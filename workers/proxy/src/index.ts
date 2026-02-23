import type { Env } from './types';
import { callClaude } from './claude';
import { runCrawl, getAllCachedPages, getCachedMeta } from './crawl';
import { buildFullContext, scoreAndRankPages, pickGuideSnippet } from './scoring';
import { fetchGA4Report } from './ga4';
import { cleanInline, normalizeMultiline } from './utils';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function checkAuth(request: Request, env: Env): Response | null {
  if (!env.PROXY_TOKEN) return null;
  const token = request.headers.get('x-proxy-token') || '';
  if (token !== env.PROXY_TOKEN) return json({ error: 'Unauthorized' }, 401);
  return null;
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

async function handleHealth(env: Env): Promise<Response> {
  const [guideMeta, blogMeta, lpMeta] = await Promise.all([
    getCachedMeta(env.PAGE_CACHE, 'guide'),
    getCachedMeta(env.PAGE_CACHE, 'blog'),
    getCachedMeta(env.PAGE_CACHE, 'lp'),
  ]);

  return json({
    ok: true,
    guide: {
      enabled: true,
      cachedPages: guideMeta?.pageCount ?? 0,
      fetchedAt: guideMeta?.fetchedAt ?? null,
      lastError: guideMeta?.error ?? '',
      rootUrl: 'https://guide.sotobaco.com/portal/index.html',
    },
    blog: {
      cachedPages: blogMeta?.pageCount ?? 0,
      fetchedAt: blogMeta?.fetchedAt ?? null,
      lastError: blogMeta?.error ?? '',
      rootUrl: 'https://blog.sotobaco.com/',
    },
    lp: {
      cachedPages: lpMeta?.pageCount ?? 0,
      fetchedAt: lpMeta?.fetchedAt ?? null,
      lastError: lpMeta?.error ?? '',
      rootUrl: 'https://sotobaco.com/sotobacoportal/',
    },
    ai: {
      provider: 'anthropic',
      model: 'claude-haiku-4-5-20251001',
      enabled: !!env.ANTHROPIC_API_KEY,
    },
    ga4: {
      enabled: !!(env.GA_CLIENT_EMAIL && env.GA_PRIVATE_KEY),
      blogPropertyId: env.GA_PROPERTY_ID_BLOG ? '***' : '',
      sitePropertyId: env.GA_PROPERTY_ID_SITE ? '***' : '',
    },
  });
}

async function handleSummarizeTitle(
  request: Request,
  env: Env,
): Promise<Response> {
  if (!env.ANTHROPIC_API_KEY)
    return json({ error: 'ANTHROPIC_API_KEY is not set' }, 500);
  const authErr = checkAuth(request, env);
  if (authErr) return authErr;

  const body = await readBody(request);
  const source = cleanInline(body.text);
  if (!source) return json({ error: 'text is required' }, 400);

  const raw = await callClaude({
    apiKey: env.ANTHROPIC_API_KEY,
    system:
      'あなたは業務システムのタイトル生成アシスタントです。入力文から、日本語タイトルを1行で作成してください。最重要: 「何をしたいか/何ができないか」が一読で分かる表現を優先し、「〜について」「〜の件」は原則使わない。例: 「CSV取り込みが完了しない」「請求書PDFを再発行できない」。記号は最小限、冗長な敬語は不要、20〜40文字程度。',
    userMessage: source,
    maxTokens: 60,
  });

  const title = cleanInline(raw).replace(/^["「]|["」]$/g, '');
  if (!title) return json({ error: 'Empty summary result' }, 502);
  return json({ title });
}

async function handleDraftAnswer(
  request: Request,
  env: Env,
): Promise<Response> {
  if (!env.ANTHROPIC_API_KEY)
    return json({ error: 'ANTHROPIC_API_KEY is not set' }, 500);
  const authErr = checkAuth(request, env);
  if (authErr) return authErr;

  const body = await readBody(request);
  const question = normalizeMultiline(body.question);
  if (!question) return json({ error: 'question is required' }, 400);

  const template = normalizeMultiline(body.template) || '';
  const candidates = Array.isArray(body.candidates)
    ? (body.candidates as Array<{ question?: string; answer?: string }>).slice(0, 8)
    : [];
  const normalizedCandidates = candidates.map((c) => ({
    question: normalizeMultiline(c?.question),
    answer: normalizeMultiline(c?.answer),
  }));
  const referenceText = candidates
    .map(
      (c, i) =>
        `#${i + 1}\n質問: ${normalizeMultiline(c?.question)}\n回答: ${normalizeMultiline(c?.answer)}`,
    )
    .join('\n\n');

  const pages = await getAllCachedPages(env.PAGE_CACHE);
  const fullContext = buildFullContext(pages, {
    question,
    candidates: normalizedCandidates,
  });

  const answer = await callClaude({
    apiKey: env.ANTHROPIC_API_KEY,
    system:
      'あなたはカスタマーサポート文書作成アシスタントです。入力された質問・参考回答・関連ページ抜粋を使い、丁寧で実務的な文書を1通作成します。最優先は操作ガイドの内容との整合です。ガイドに根拠がある手順や設定名は具体的に記載し、根拠がない箇所は断定しないでください。「関連ページ」が提供された場合、回答の最後に「ご参考」として関連URLを案内してください。操作手順は操作ガイド、詳しい解説はブログ記事、機能一覧は製品ページを適切に使い分けてください。日本語で出力し、余計な注釈は書かずテンプレート構成に沿って返してください。',
    userMessage: `以下の質問に対する回答文（またはレポート）を作成してください。\n\n質問:\n${question}\n\n参考回答（類似）:\n${referenceText || 'なし'}\n\n関連ページ抜粋:\n${fullContext || '関連ページ情報を取得できませんでした。一般的な注意を添えて回答してください。'}\n\nテンプレート:\n${template}\n\n要件:\n- テンプレートの文体・構成を維持する\n- 関連ページの内容と矛盾しないようにする\n- 「> 質問内容」には質問を引用する（回答文の場合）\n- 回答本文は質問に合わせて具体化する\n- 参考回答をそのままコピペせず、今回の質問向けに調整する\n- 関連するURLがあれば「ご参考」として回答末尾に記載する`,
    maxTokens: 900,
  });

  const normalizedAnswer = normalizeMultiline(answer);
  if (!normalizedAnswer)
    return json({ error: 'Empty draft result' }, 502);
  return json({ answer: normalizedAnswer });
}

async function handleRelevantPages(
  request: Request,
  env: Env,
): Promise<Response> {
  const body = await readBody(request);
  const question = normalizeMultiline(body.question);
  if (!question) return json({ error: 'question is required' }, 400);

  const pages = await getAllCachedPages(env.PAGE_CACHE);
  if (!pages.length) return json({ pages: [] });

  const scored = scoreAndRankPages(pages, question);
  const result = scored.map((x) => ({
    url: x.page.url,
    title: x.page.title,
    source: x.page.source,
    snippet: pickGuideSnippet(
      x.page,
      normalizeMultiline(question)
        .toLowerCase()
        .match(/[a-z0-9][a-z0-9._-]{1,}|[一-龯ぁ-んァ-ヶー]{2,}/g) || [],
      300,
    ),
  }));

  return json({ pages: result });
}

const SOURCE_LABELS: Record<string, string> = {
  guide: 'ガイド',
  blog: 'ブログ',
  lp: 'LP',
};

async function handleLearningInsights(
  request: Request,
  env: Env,
): Promise<Response> {
  if (!env.ANTHROPIC_API_KEY)
    return json({ error: 'ANTHROPIC_API_KEY is not set' }, 500);
  const authErr = checkAuth(request, env);
  if (authErr) return authErr;

  const body = await readBody(request);
  const service = cleanInline(body.service);
  const inquiries = Array.isArray(body.inquiries)
    ? (body.inquiries as Array<{ question?: string; answer?: string }>).slice(0, 30)
    : [];
  const stats = (body.stats || {}) as Record<string, unknown>;
  const keywords = Array.isArray(body.keywords)
    ? (body.keywords as Array<{ word: string; count: number }>).slice(0, 15)
    : [];

  if (!service) return json({ error: 'service is required' }, 400);
  if (!inquiries.length)
    return json({ error: 'inquiries is required (at least 1)' }, 400);

  const allPages = await getAllCachedPages(env.PAGE_CACHE);
  const guideContext = allPages.length
    ? allPages
        .map((p, i) => {
          const label = SOURCE_LABELS[p.source || ''] || p.source || '';
          return `[${label}${i + 1}] ${p.title}\nURL: ${p.url}\n内容:\n${p.text.slice(0, 3000)}`;
        })
        .join('\n\n---\n\n')
    : 'コンテンツ情報を取得できませんでした。';

  const inquiryText = inquiries
    .map((item, i) => {
      const q = normalizeMultiline(item?.question);
      const a = normalizeMultiline(item?.answer);
      return `#${i + 1}\n質問: ${q}\n回答: ${a || '（未回答）'}`;
    })
    .join('\n\n');

  const statsText = [
    `件数: ${stats.detailCount || 0}件`,
    `回答済み: ${stats.answeredCount || 0}件`,
    `未回答: ${stats.unansweredCount || 0}件`,
  ].join(' / ');

  const keywordsText = keywords.length
    ? keywords.map((k) => `${k.word}(${k.count})`).join(', ')
    : '該当なし';

  const systemPrompt = `あなたはSaaSカスタマーサポートの分析アシスタントです。お問い合わせデータと関連コンテンツ（操作ガイド・ブログ記事・LP）を比較分析し、以下の3つを提案してください。

## 出力（必ずJSON形式のみで出力してください。説明文やマークダウンは含めず、JSONオブジェクトだけを返してください。）

### 1. blogTopics（ブログ記事案 3〜5件）
ユーザーが頻繁に困っている課題をもとに、SEO記事として有効なテーマを提案。既にブログ記事として公開されているテーマは除外し、未カバーのテーマを優先する。
各提案: { title: タイトル案, reason: 理由, targetKeyword: 想定検索キーワード, priority: "high"/"medium"/"low" }

### 2. guideImprovements（操作ガイド改善案 3〜5件）
ガイドに記載がない or 記載が不十分なためにお問い合わせに至っている箇所を特定。
各提案: { page: 該当ガイドページ or 新規ページ, issue: 課題, suggestion: 改善提案 }

### 3. answerPatterns（回答パターン分析 3〜5件）
よく出る回答パターンをテンプレート化できるか分析。
各提案: { pattern: パターン名, frequency: 出現頻度の目安, improvementHint: テンプレート改善ヒント }`;

  const userPrompt = `対象サービス: ${service}

## 統計
${statsText}
多いキーワード: ${keywordsText}

## お問い合わせ一覧（質問＋回答）
${inquiryText}

## 関連コンテンツ（操作ガイド・ブログ・LP）
${guideContext}

上記データを分析し、blogTopics, guideImprovements, answerPatterns の3つをJSON形式で出力してください。`;

  const raw = await callClaude({
    apiKey: env.ANTHROPIC_API_KEY,
    system: systemPrompt,
    userMessage: userPrompt,
    maxTokens: 3000,
    jsonMode: true,
  });

  if (!raw) return json({ error: 'Empty analysis result' }, 502);

  let parsed: Record<string, unknown>;
  try {
    const jsonStr = raw.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
    parsed = JSON.parse(jsonStr) as Record<string, unknown>;
  } catch {
    return json({ error: 'Failed to parse AI response as JSON', raw }, 502);
  }

  return json({
    blogTopics: Array.isArray(parsed.blogTopics) ? parsed.blogTopics : [],
    guideImprovements: Array.isArray(parsed.guideImprovements)
      ? parsed.guideImprovements
      : [],
    answerPatterns: Array.isArray(parsed.answerPatterns)
      ? parsed.answerPatterns
      : [],
  });
}

async function handleGA4Weekly(env: Env): Promise<Response> {
  if (!env.GA_CLIENT_EMAIL || !env.GA_PRIVATE_KEY)
    return json({ error: 'GA4 not configured' }, 503);

  const dateRangesCurrent = [{ startDate: '7daysAgo', endDate: 'yesterday' }];
  const dateRangesPrevious = [
    { startDate: '14daysAgo', endDate: '8daysAgo' },
  ];

  const [
    blogCurrent,
    blogPrevious,
    lpCurrent,
    lpPrevious,
    blogOverview,
    siteOverview,
  ] = await Promise.all([
    fetchGA4Report(
      env,
      env.GA_PROPERTY_ID_BLOG,
      ['pagePath', 'pageTitle'],
      ['screenPageViews'],
      dateRangesCurrent,
      {
        limit: 20,
        orderBys: [
          { metric: { metricName: 'screenPageViews' }, desc: true },
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'pagePath',
            stringFilter: { matchType: 'CONTAINS', value: '/articles/' },
          },
        },
      },
    ),
    fetchGA4Report(
      env,
      env.GA_PROPERTY_ID_BLOG,
      ['pagePath'],
      ['screenPageViews'],
      dateRangesPrevious,
      {
        limit: 20,
        dimensionFilter: {
          filter: {
            fieldName: 'pagePath',
            stringFilter: { matchType: 'CONTAINS', value: '/articles/' },
          },
        },
      },
    ),
    fetchGA4Report(
      env,
      env.GA_PROPERTY_ID_SITE,
      ['pagePath'],
      ['screenPageViews', 'sessions', 'totalUsers'],
      dateRangesCurrent,
      {
        limit: 20,
        dimensionFilter: {
          filter: {
            fieldName: 'pagePath',
            stringFilter: {
              matchType: 'BEGINS_WITH',
              value: '/sotobacoportal',
            },
          },
        },
      },
    ),
    fetchGA4Report(
      env,
      env.GA_PROPERTY_ID_SITE,
      ['pagePath'],
      ['screenPageViews', 'sessions', 'totalUsers'],
      dateRangesPrevious,
      {
        limit: 20,
        dimensionFilter: {
          filter: {
            fieldName: 'pagePath',
            stringFilter: {
              matchType: 'BEGINS_WITH',
              value: '/sotobacoportal',
            },
          },
        },
      },
    ),
    fetchGA4Report(
      env,
      env.GA_PROPERTY_ID_BLOG,
      [],
      ['screenPageViews', 'sessions', 'totalUsers'],
      dateRangesCurrent,
    ),
    fetchGA4Report(
      env,
      env.GA_PROPERTY_ID_SITE,
      [],
      ['screenPageViews', 'sessions', 'totalUsers'],
      dateRangesCurrent,
    ),
  ]);

  const prevPvMap: Record<string, number> = {};
  for (const row of blogPrevious) {
    prevPvMap[row.dimensions[0]] = Number(row.metrics[0]) || 0;
  }

  const blogRanking = blogCurrent.slice(0, 10).map((row) => {
    const path = row.dimensions[0];
    const title = row.dimensions[1] || path;
    const views = Number(row.metrics[0]) || 0;
    const prevViews = prevPvMap[path] || 0;
    return { path, title, views, prevViews };
  });

  const sumMetrics = (
    rows: Array<{ metrics: string[] }>,
  ) => {
    let views = 0,
      sessions = 0,
      users = 0;
    for (const row of rows) {
      views += Number(row.metrics[0]) || 0;
      sessions += Number(row.metrics[1]) || 0;
      users += Number(row.metrics[2]) || 0;
    }
    return { views, sessions, users };
  };

  const lpCurrentTotal = sumMetrics(lpCurrent);
  const lpPreviousTotal = sumMetrics(lpPrevious);
  const lpByPage = lpCurrent.map((row) => ({
    path: row.dimensions[0],
    views: Number(row.metrics[0]) || 0,
  }));

  const parseOverview = (rows: Array<{ metrics: string[] }>) => {
    if (!rows.length) return { views: 0, sessions: 0, users: 0 };
    const r = rows[0];
    return {
      views: Number(r.metrics[0]) || 0,
      sessions: Number(r.metrics[1]) || 0,
      users: Number(r.metrics[2]) || 0,
    };
  };

  return json({
    blogRanking,
    lpAccess: {
      current: lpCurrentTotal,
      previous: lpPreviousTotal,
      byPage: lpByPage,
    },
    overview: {
      blog: parseOverview(blogOverview),
      site: parseOverview(siteOverview),
    },
  });
}

// ---------------------------------------------------------------------------
// Worker export
// ---------------------------------------------------------------------------

export default {
  async fetch(
    request: Request,
    env: Env,
  ): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      if (method === 'GET' && path === '/health') return handleHealth(env);
      if (method === 'GET' && path === '/ga4-weekly') return handleGA4Weekly(env);
      if (method === 'POST' && path === '/crawl') {
        const authErr = checkAuth(request, env);
        if (authErr) return authErr;
        await runCrawl(env);
        return handleHealth(env);
      }
      if (method === 'POST' && path === '/summarize-title')
        return handleSummarizeTitle(request, env);
      if (method === 'POST' && path === '/draft-answer')
        return handleDraftAnswer(request, env);
      if (method === 'POST' && path === '/relevant-pages')
        return handleRelevantPages(request, env);
      if (method === 'POST' && path === '/learning-insights')
        return handleLearningInsights(request, env);

      return json({ error: 'Not found' }, 404);
    } catch (err) {
      const e = err as { status?: number; message?: string; detail?: string };
      if (e.status === 502)
        return json({ error: e.message, detail: e.detail }, 502);
      return json(
        { error: e.message || 'unknown error' },
        500,
      );
    }
  },

  async scheduled(
    _event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<void> {
    ctx.waitUntil(runCrawl(env));
  },
};
