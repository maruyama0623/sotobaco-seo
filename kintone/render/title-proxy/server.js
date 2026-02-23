import express from 'express';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const app = express();
app.use(express.json({ limit: '256kb' }));

const PORT = Number(process.env.PORT || 3000);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const PROXY_TOKEN = process.env.PROXY_TOKEN || '';
const GUIDE_ROOT_URL = process.env.GUIDE_ROOT_URL || 'https://guide.sotobaco.com/portal/index.html';
const GUIDE_CONTEXT_ENABLED = String(process.env.GUIDE_CONTEXT_ENABLED || 'true').toLowerCase() !== 'false';
const GUIDE_MAX_PAGES = Number(process.env.GUIDE_MAX_PAGES || 24);
const GUIDE_CACHE_TTL_MS = Number(process.env.GUIDE_CACHE_TTL_MS || 6 * 60 * 60 * 1000);
const GUIDE_FETCH_TIMEOUT_MS = Number(process.env.GUIDE_FETCH_TIMEOUT_MS || 12000);
const BLOG_ROOT_URL = process.env.BLOG_ROOT_URL || 'https://blog.sotobaco.com/';
const LP_ROOT_URL = process.env.LP_ROOT_URL || 'https://sotobaco.com/sotobacoportal/';
const BLOG_MAX_PAGES = Number(process.env.BLOG_MAX_PAGES || 20);
const LP_MAX_PAGES = Number(process.env.LP_MAX_PAGES || 10);

// GA4 Data API
const GA_CLIENT_EMAIL = process.env.GA_CLIENT_EMAIL || '';
const GA_PRIVATE_KEY = (process.env.GA_PRIVATE_KEY || '').replace(/\\n/g, '\n');
const GA_PROJECT_ID = process.env.GA_PROJECT_ID || '';
const GA_PROPERTY_ID_BLOG = process.env.GA_PROPERTY_ID_BLOG || '';
const GA_PROPERTY_ID_SITE = process.env.GA_PROPERTY_ID_SITE || '';

let analyticsClient = null;
if (GA_CLIENT_EMAIL && GA_PRIVATE_KEY) {
  analyticsClient = new BetaAnalyticsDataClient({
    credentials: { client_email: GA_CLIENT_EMAIL, private_key: GA_PRIVATE_KEY },
    projectId: GA_PROJECT_ID,
  });
}

const cleanInline = (v) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim();
const normalizeMultiline = (v) =>
  String(v == null ? '' : v)
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
const unique = (arr) => [...new Set(arr)];
const stopWords = new Set([
  'です',
  'ます',
  'する',
  'いる',
  'ある',
  'こと',
  'ため',
  'よう',
  'ください',
  '確認',
  '設定',
  '操作',
  '画面',
  'ソトバコ',
  'ポータル',
  'kintone',
]);

const htmlEntityMap = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  '#39': "'",
};

const decodeHtmlEntities = (input) => {
  let s = String(input == null ? '' : input);
  s = s.replace(/&#(\d+);/g, (_, n) => {
    const code = Number(n);
    return Number.isFinite(code) ? String.fromCodePoint(code) : _;
  });
  s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, n) => {
    const code = parseInt(n, 16);
    return Number.isFinite(code) ? String.fromCodePoint(code) : _;
  });
  s = s.replace(/&([a-zA-Z0-9#]+);/g, (m, name) => (htmlEntityMap[name] ? htmlEntityMap[name] : m));
  return s;
};

const stripHtmlToText = (html) =>
  normalizeMultiline(
    decodeHtmlEntities(
      String(html == null ? '' : html)
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|section|article|li|h[1-6]|tr)>/gi, '\n')
        .replace(/<[^>]*>/g, ' ')
    )
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n[ \t]+/g, '\n')
  );

const extractTitleFromHtml = (html, fallback) => {
  const m = String(html || '').match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return fallback;
  const title = cleanInline(decodeHtmlEntities(m[1]));
  return title || fallback;
};

const extractHrefLinks = (html, currentUrl) => {
  const links = [];
  const re = /href\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi;
  let m;
  while ((m = re.exec(String(html || ''))) !== null) {
    const raw = m[1] || m[2] || m[3] || '';
    if (!raw || raw.startsWith('#') || raw.startsWith('javascript:') || raw.startsWith('mailto:')) continue;
    try {
      const resolved = new URL(raw, currentUrl);
      resolved.hash = '';
      resolved.search = '';
      links.push(resolved.href);
    } catch (_e) {
      // ignore invalid url
    }
  }
  return unique(links);
};

const tokenize = (s) => {
  const found = String(s == null ? '' : s)
    .toLowerCase()
    .match(/[a-z0-9][a-z0-9._-]{1,}|[一-龯ぁ-んァ-ヶー]{2,}/g);
  if (!found) return [];
  return unique(found.filter((w) => !stopWords.has(w)));
};

const abortableFetchText = async (url) => {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), GUIDE_FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: 'follow' });
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
};

const guideCache = {
  pages: [],
  fetchedAt: 0,
  expiresAt: 0,
  lastError: '',
};

const isAllowedGuideUrl = (url) => {
  const root = new URL(GUIDE_ROOT_URL);
  const u = new URL(url);
  if (u.host !== root.host) return false;
  const rootDir = root.pathname.endsWith('/') ? root.pathname : root.pathname.replace(/[^/]*$/, '');
  if (!u.pathname.startsWith(rootDir)) return false;
  if (!/(\.html?$|\/$)/i.test(u.pathname)) return false;
  return true;
};

const crawlGuidePages = async () => {
  const startUrl = new URL(GUIDE_ROOT_URL).href;
  const visited = new Set();
  const queue = [startUrl];
  const pages = [];

  while (queue.length && pages.length < GUIDE_MAX_PAGES) {
    const url = queue.shift();
    if (!url || visited.has(url)) continue;
    visited.add(url);
    if (!isAllowedGuideUrl(url)) continue;

    try {
      const html = await abortableFetchText(url);
      const title = extractTitleFromHtml(html, url);
      const text = stripHtmlToText(html);
      if (text.length > 80) {
        pages.push({
          url,
          title,
          text: text.slice(0, 12000),
        });
      }

      const links = extractHrefLinks(html, url)
        .filter((next) => !visited.has(next) && isAllowedGuideUrl(next))
        .slice(0, 60);
      links.forEach((next) => queue.push(next));
    } catch (_e) {
      // skip fetch failures and continue crawling
    }
  }
  return pages;
};

const getGuidePages = async () => {
  if (!GUIDE_CONTEXT_ENABLED) return [];
  const now = Date.now();
  if (guideCache.pages.length && guideCache.expiresAt > now) return guideCache.pages;
  try {
    const pages = await crawlGuidePages();
    guideCache.pages = pages;
    guideCache.fetchedAt = now;
    guideCache.expiresAt = now + GUIDE_CACHE_TTL_MS;
    guideCache.lastError = '';
    return pages;
  } catch (err) {
    guideCache.lastError = err && err.message ? err.message : 'guide crawl failed';
    guideCache.fetchedAt = now;
    guideCache.expiresAt = now + Math.min(5 * 60 * 1000, GUIDE_CACHE_TTL_MS);
    return guideCache.pages || [];
  }
};

// ---------------------------------------------------------------------------
// Blog crawler
// ---------------------------------------------------------------------------

const blogCache = {
  pages: [],
  fetchedAt: 0,
  expiresAt: 0,
  lastError: '',
};

const isAllowedBlogUrl = (url) => {
  const u = new URL(url);
  const root = new URL(BLOG_ROOT_URL);
  if (u.host !== root.host) return false;
  if (u.pathname === '/') return true;
  if (u.pathname.startsWith('/articles/')) return true;
  return false;
};

const crawlBlogPages = async () => {
  const startUrl = new URL(BLOG_ROOT_URL).href;
  const visited = new Set();
  const queue = [startUrl];
  const pages = [];

  while (queue.length && pages.length < BLOG_MAX_PAGES) {
    const url = queue.shift();
    if (!url || visited.has(url)) continue;
    visited.add(url);
    if (!isAllowedBlogUrl(url)) continue;

    try {
      const html = await abortableFetchText(url);
      const title = extractTitleFromHtml(html, url);
      const text = stripHtmlToText(html);
      if (text.length > 80) {
        pages.push({ url, title, text: text.slice(0, 12000) });
      }

      const links = extractHrefLinks(html, url)
        .filter((next) => !visited.has(next) && isAllowedBlogUrl(next))
        .slice(0, 60);
      links.forEach((next) => queue.push(next));
    } catch (_e) {
      // skip fetch failures
    }
  }
  return pages;
};

const getBlogPages = async () => {
  if (!GUIDE_CONTEXT_ENABLED) return [];
  const now = Date.now();
  if (blogCache.pages.length && blogCache.expiresAt > now) return blogCache.pages;
  try {
    const pages = await crawlBlogPages();
    blogCache.pages = pages;
    blogCache.fetchedAt = now;
    blogCache.expiresAt = now + GUIDE_CACHE_TTL_MS;
    blogCache.lastError = '';
    return pages;
  } catch (err) {
    blogCache.lastError = err && err.message ? err.message : 'blog crawl failed';
    blogCache.fetchedAt = now;
    blogCache.expiresAt = now + Math.min(5 * 60 * 1000, GUIDE_CACHE_TTL_MS);
    return blogCache.pages || [];
  }
};

// ---------------------------------------------------------------------------
// LP crawler
// ---------------------------------------------------------------------------

const lpCache = {
  pages: [],
  fetchedAt: 0,
  expiresAt: 0,
  lastError: '',
};

const isAllowedLpUrl = (url) => {
  const u = new URL(url);
  if (u.host !== 'sotobaco.com') return false;
  if (!u.pathname.startsWith('/sotobacoportal')) return false;
  return true;
};

const crawlLpPages = async () => {
  const startUrl = new URL(LP_ROOT_URL).href;
  const visited = new Set();
  const queue = [startUrl];
  const pages = [];

  while (queue.length && pages.length < LP_MAX_PAGES) {
    const url = queue.shift();
    if (!url || visited.has(url)) continue;
    visited.add(url);
    if (!isAllowedLpUrl(url)) continue;

    try {
      const html = await abortableFetchText(url);
      const title = extractTitleFromHtml(html, url);
      const text = stripHtmlToText(html);
      if (text.length > 80) {
        pages.push({ url, title, text: text.slice(0, 12000) });
      }

      const links = extractHrefLinks(html, url)
        .filter((next) => !visited.has(next) && isAllowedLpUrl(next))
        .slice(0, 30);
      links.forEach((next) => queue.push(next));
    } catch (_e) {
      // skip fetch failures
    }
  }
  return pages;
};

const getLpPages = async () => {
  if (!GUIDE_CONTEXT_ENABLED) return [];
  const now = Date.now();
  if (lpCache.pages.length && lpCache.expiresAt > now) return lpCache.pages;
  try {
    const pages = await crawlLpPages();
    lpCache.pages = pages;
    lpCache.fetchedAt = now;
    lpCache.expiresAt = now + GUIDE_CACHE_TTL_MS;
    lpCache.lastError = '';
    return pages;
  } catch (err) {
    lpCache.lastError = err && err.message ? err.message : 'lp crawl failed';
    lpCache.fetchedAt = now;
    lpCache.expiresAt = now + Math.min(5 * 60 * 1000, GUIDE_CACHE_TTL_MS);
    return lpCache.pages || [];
  }
};

// ---------------------------------------------------------------------------
// Content integration
// ---------------------------------------------------------------------------

const getAllContentPages = async () => {
  const [guide, blog, lp] = await Promise.all([
    getGuidePages(),
    getBlogPages(),
    getLpPages(),
  ]);
  return [
    ...guide.map((p) => ({ ...p, source: 'guide' })),
    ...blog.map((p) => ({ ...p, source: 'blog' })),
    ...lp.map((p) => ({ ...p, source: 'lp' })),
  ];
};

const pickGuideSnippet = (page, tokens, limit = 540) => {
  const src = normalizeMultiline(page.text || '');
  if (!src) return '';
  if (!tokens.length) return src.slice(0, limit);

  const lower = src.toLowerCase();
  let hit = -1;
  for (const tk of tokens) {
    const idx = lower.indexOf(tk.toLowerCase());
    if (idx >= 0 && (hit < 0 || idx < hit)) {
      hit = idx;
    }
  }
  if (hit < 0) return src.slice(0, limit);

  let start = Math.max(0, hit - 220);
  let end = Math.min(src.length, start + limit);
  const prevNl = src.lastIndexOf('\n', start);
  if (prevNl >= 0) start = prevNl + 1;
  const nextNl = src.indexOf('\n', end);
  if (nextNl >= 0) end = nextNl;
  return src.slice(start, end).trim();
};

const buildGuideContext = async ({ question, candidates }) => {
  if (!GUIDE_CONTEXT_ENABLED) return '';
  const pages = await getGuidePages();
  if (!pages.length) return '';

  const seed = [
    normalizeMultiline(question),
    ...(Array.isArray(candidates) ? candidates : []).map((c) => `${normalizeMultiline(c.question)}\n${normalizeMultiline(c.answer)}`),
  ].join('\n');
  const tokens = tokenize(seed).slice(0, 24);

  const scored = pages
    .map((p) => {
      const t = `${p.title}\n${p.text}`.toLowerCase();
      let score = 0;
      tokens.forEach((tk) => {
        if (t.includes(tk)) score += p.title.toLowerCase().includes(tk) ? 3 : 1;
      });
      return { page: p, score };
    })
    .sort((a, b) => b.score - a.score);

  const selected = scored.some((x) => x.score > 0)
    ? scored.filter((x) => x.score > 0).slice(0, 4)
    : scored.slice(0, 2);

  return selected
    .map((x, idx) => {
      const snippet = pickGuideSnippet(x.page, tokens);
      return `[ガイド${idx + 1}] ${x.page.title}\nURL: ${x.page.url}\n抜粋:\n${snippet}`;
    })
    .join('\n\n');
};

const SOURCE_LABELS = { guide: 'ガイド', blog: 'ブログ', lp: 'LP' };

const buildFullContext = async ({ question, candidates }) => {
  if (!GUIDE_CONTEXT_ENABLED) return '';
  const pages = await getAllContentPages();
  if (!pages.length) return '';

  const seed = [
    normalizeMultiline(question),
    ...(Array.isArray(candidates) ? candidates : []).map((c) => `${normalizeMultiline(c.question)}\n${normalizeMultiline(c.answer)}`),
  ].join('\n');
  const tokens = tokenize(seed).slice(0, 24);

  const scored = pages
    .map((p) => {
      const t = `${p.title}\n${p.text}`.toLowerCase();
      let score = 0;
      tokens.forEach((tk) => {
        if (t.includes(tk)) score += p.title.toLowerCase().includes(tk) ? 3 : 1;
      });
      return { page: p, score };
    })
    .sort((a, b) => b.score - a.score);

  const selected = scored.some((x) => x.score > 0)
    ? scored.filter((x) => x.score > 0).slice(0, 6)
    : scored.slice(0, 3);

  return selected
    .map((x, idx) => {
      const label = SOURCE_LABELS[x.page.source] || x.page.source;
      const snippet = pickGuideSnippet(x.page, tokens);
      return `[${label}${idx + 1}] ${x.page.title}\nURL: ${x.page.url}\n抜粋:\n${snippet}`;
    })
    .join('\n\n');
};

// ---------------------------------------------------------------------------
// GA4 Data API
// ---------------------------------------------------------------------------

async function fetchGA4Report(propertyId, dimensions, metrics, dateRanges, options = {}) {
  if (!analyticsClient || !propertyId) return [];
  const request = {
    property: `properties/${propertyId}`,
    dimensions: dimensions.map((d) => ({ name: d })),
    metrics: metrics.map((m) => ({ name: m })),
    dateRanges,
    limit: options.limit || 50,
  };
  if (options.orderBys) request.orderBys = options.orderBys;
  if (options.dimensionFilter) request.dimensionFilter = options.dimensionFilter;
  const [response] = await analyticsClient.runReport(request);
  return (response.rows || []).map((row) => ({
    dimensions: row.dimensionValues.map((d) => d.value),
    metrics: row.metricValues.map((m) => m.value),
  }));
}

app.get('/ga4-weekly', async (_req, res) => {
  try {
    if (!analyticsClient) {
      return res.status(503).json({ error: 'GA4 not configured' });
    }

    const dateRangesCurrent = [{ startDate: '7daysAgo', endDate: 'yesterday' }];
    const dateRangesPrevious = [{ startDate: '14daysAgo', endDate: '8daysAgo' }];

    // 並列で全データを取得
    const [blogCurrent, blogPrevious, lpCurrent, lpPrevious, blogOverview, siteOverview] = await Promise.all([
      // ブログ記事PVランキング（直近7日）
      fetchGA4Report(
        GA_PROPERTY_ID_BLOG,
        ['pagePath', 'pageTitle'],
        ['screenPageViews'],
        dateRangesCurrent,
        {
          limit: 20,
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          dimensionFilter: {
            filter: { fieldName: 'pagePath', stringFilter: { matchType: 'CONTAINS', value: '/articles/' } },
          },
        }
      ),
      // ブログ記事PV（前7日、比較用）
      fetchGA4Report(
        GA_PROPERTY_ID_BLOG,
        ['pagePath'],
        ['screenPageViews'],
        dateRangesPrevious,
        {
          limit: 20,
          dimensionFilter: {
            filter: { fieldName: 'pagePath', stringFilter: { matchType: 'CONTAINS', value: '/articles/' } },
          },
        }
      ),
      // LPアクセス（直近7日）
      fetchGA4Report(
        GA_PROPERTY_ID_SITE,
        ['pagePath'],
        ['screenPageViews', 'sessions', 'totalUsers'],
        dateRangesCurrent,
        {
          limit: 20,
          dimensionFilter: {
            filter: { fieldName: 'pagePath', stringFilter: { matchType: 'BEGINS_WITH', value: '/sotobacoportal' } },
          },
        }
      ),
      // LPアクセス（前7日）
      fetchGA4Report(
        GA_PROPERTY_ID_SITE,
        ['pagePath'],
        ['screenPageViews', 'sessions', 'totalUsers'],
        dateRangesPrevious,
        {
          limit: 20,
          dimensionFilter: {
            filter: { fieldName: 'pagePath', stringFilter: { matchType: 'BEGINS_WITH', value: '/sotobacoportal' } },
          },
        }
      ),
      // ブログ全体概要
      fetchGA4Report(GA_PROPERTY_ID_BLOG, [], ['screenPageViews', 'sessions', 'totalUsers'], dateRangesCurrent),
      // サイト全体概要
      fetchGA4Report(GA_PROPERTY_ID_SITE, [], ['screenPageViews', 'sessions', 'totalUsers'], dateRangesCurrent),
    ]);

    // ブログ前週PVマップ
    const prevPvMap = {};
    for (const row of blogPrevious) {
      prevPvMap[row.dimensions[0]] = Number(row.metrics[0]) || 0;
    }

    // ブログ記事ランキング Top10
    const blogRanking = blogCurrent.slice(0, 10).map((row) => {
      const path = row.dimensions[0];
      const title = row.dimensions[1] || path;
      const views = Number(row.metrics[0]) || 0;
      const prevViews = prevPvMap[path] || 0;
      return { path, title, views, prevViews };
    });

    // LP集計
    const sumMetrics = (rows) => {
      let views = 0, sessions = 0, users = 0;
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

    // 全体概要
    const parseOverview = (rows) => {
      if (!rows.length) return { views: 0, sessions: 0, users: 0 };
      const r = rows[0];
      return {
        views: Number(r.metrics[0]) || 0,
        sessions: Number(r.metrics[1]) || 0,
        users: Number(r.metrics[2]) || 0,
      };
    };

    res.json({
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
  } catch (err) {
    console.error('GA4 weekly error:', err);
    res.status(500).json({ error: err && err.message ? err.message : 'GA4 fetch failed' });
  }
});

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    guide: {
      enabled: GUIDE_CONTEXT_ENABLED,
      cachedPages: guideCache.pages.length,
      fetchedAt: guideCache.fetchedAt || null,
      expiresAt: guideCache.expiresAt || null,
      lastError: guideCache.lastError || '',
      rootUrl: GUIDE_ROOT_URL,
    },
    blog: {
      cachedPages: blogCache.pages.length,
      fetchedAt: blogCache.fetchedAt || null,
      expiresAt: blogCache.expiresAt || null,
      lastError: blogCache.lastError || '',
      rootUrl: BLOG_ROOT_URL,
    },
    lp: {
      cachedPages: lpCache.pages.length,
      fetchedAt: lpCache.fetchedAt || null,
      expiresAt: lpCache.expiresAt || null,
      lastError: lpCache.lastError || '',
      rootUrl: LP_ROOT_URL,
    },
    ga4: {
      enabled: !!analyticsClient,
      blogPropertyId: GA_PROPERTY_ID_BLOG ? '***' : '',
      sitePropertyId: GA_PROPERTY_ID_SITE ? '***' : '',
    },
  });
});

app.post('/summarize-title', async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is not set' });
    }

    if (PROXY_TOKEN) {
      const token = req.header('x-proxy-token') || '';
      if (token !== PROXY_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    const source = cleanInline(req.body && req.body.text);
    if (!source) {
      return res.status(400).json({ error: 'text is required' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.2,
        max_tokens: 80,
        messages: [
          {
            role: 'system',
            content:
              'あなたは業務システムのタイトル生成アシスタントです。入力文から、日本語タイトルを1行で作成してください。最重要: 「何をしたいか/何ができないか」が一読で分かる表現を優先し、「〜について」「〜の件」は原則使わない。例: 「CSV取り込みが完了しない」「請求書PDFを再発行できない」。記号は最小限、冗長な敬語は不要、20〜40文字程度。',
          },
          {
            role: 'user',
            content: source,
          },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return res.status(502).json({ error: 'OpenAI request failed', detail: body });
    }

    const json = await response.json();
    const title = cleanInline(json?.choices?.[0]?.message?.content || '').replace(/^["「]|["」]$/g, '');
    if (!title) {
      return res.status(502).json({ error: 'Empty summary result' });
    }

    res.json({ title });
  } catch (err) {
    res.status(500).json({ error: err && err.message ? err.message : 'unknown error' });
  }
});

app.post('/draft-answer', async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is not set' });
    }

    if (PROXY_TOKEN) {
      const token = req.header('x-proxy-token') || '';
      if (token !== PROXY_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    const question = normalizeMultiline(req.body && req.body.question);
    if (!question) {
      return res.status(400).json({ error: 'question is required' });
    }

    const template = normalizeMultiline(req.body && req.body.template) || '';
    const candidates = Array.isArray(req.body && req.body.candidates) ? req.body.candidates.slice(0, 8) : [];
    const normalizedCandidates = candidates.map((c) => ({
      question: normalizeMultiline(c && c.question),
      answer: normalizeMultiline(c && c.answer),
    }));
    const referenceText = candidates
      .map((c, i) => `#${i + 1}\n質問: ${normalizeMultiline(c && c.question)}\n回答: ${normalizeMultiline(c && c.answer)}`)
      .join('\n\n');
    const fullContext = await buildFullContext({ question, candidates: normalizedCandidates });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.3,
        max_tokens: 900,
        messages: [
          {
            role: 'system',
            content:
              'あなたはカスタマーサポート文書作成アシスタントです。入力された質問・参考回答・関連ページ抜粋を使い、丁寧で実務的な文書を1通作成します。最優先は操作ガイドの内容との整合です。ガイドに根拠がある手順や設定名は具体的に記載し、根拠がない箇所は断定しないでください。「関連ページ」が提供された場合、回答の最後に「ご参考」として関連URLを案内してください。操作手順は操作ガイド、詳しい解説はブログ記事、機能一覧は製品ページを適切に使い分けてください。日本語で出力し、余計な注釈は書かずテンプレート構成に沿って返してください。',
          },
          {
            role: 'user',
            content: `以下の質問に対する回答文（またはレポート）を作成してください。\n\n質問:\n${question}\n\n参考回答（類似）:\n${referenceText || 'なし'}\n\n関連ページ抜粋:\n${fullContext || '関連ページ情報を取得できませんでした。一般的な注意を添えて回答してください。'}\n\nテンプレート:\n${template}\n\n要件:\n- テンプレートの文体・構成を維持する\n- 関連ページの内容と矛盾しないようにする\n- 「> 質問内容」には質問を引用する（回答文の場合）\n- 回答本文は質問に合わせて具体化する\n- 参考回答をそのままコピペせず、今回の質問向けに調整する\n- 関連するURLがあれば「ご参考」として回答末尾に記載する`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return res.status(502).json({ error: 'OpenAI request failed', detail: body });
    }

    const json = await response.json();
    const answer = normalizeMultiline(json?.choices?.[0]?.message?.content || '');
    if (!answer) {
      return res.status(502).json({ error: 'Empty draft result' });
    }

    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err && err.message ? err.message : 'unknown error' });
  }
});

app.post('/relevant-pages', async (req, res) => {
  try {
    const question = normalizeMultiline(req.body && req.body.question);
    if (!question) {
      return res.status(400).json({ error: 'question is required' });
    }

    const pages = await getAllContentPages();
    if (!pages.length) {
      return res.json({ pages: [] });
    }

    const tokens = tokenize(question).slice(0, 24);

    const scored = pages
      .map((p) => {
        const t = `${p.title}\n${p.text}`.toLowerCase();
        let score = 0;
        tokens.forEach((tk) => {
          if (t.includes(tk)) score += p.title.toLowerCase().includes(tk) ? 3 : 1;
        });
        return { page: p, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    const result = scored.map((x) => ({
      url: x.page.url,
      title: x.page.title,
      source: x.page.source,
      snippet: pickGuideSnippet(x.page, tokens, 300),
    }));

    res.json({ pages: result });
  } catch (err) {
    res.status(500).json({ error: err && err.message ? err.message : 'unknown error' });
  }
});

app.post('/learning-insights', async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is not set' });
    }

    if (PROXY_TOKEN) {
      const token = req.header('x-proxy-token') || '';
      if (token !== PROXY_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }

    const service = cleanInline(req.body && req.body.service);
    const inquiries = Array.isArray(req.body && req.body.inquiries) ? req.body.inquiries.slice(0, 30) : [];
    const stats = req.body && req.body.stats ? req.body.stats : {};
    const keywords = Array.isArray(req.body && req.body.keywords) ? req.body.keywords.slice(0, 15) : [];

    if (!service) {
      return res.status(400).json({ error: 'service is required' });
    }
    if (!inquiries.length) {
      return res.status(400).json({ error: 'inquiries is required (at least 1)' });
    }

    // 操作ガイド・ブログ・LPを取得して比較分析に使う
    const allPages = await getAllContentPages();
    const guideContext = allPages.length
      ? allPages
          .map((p, i) => {
            const label = SOURCE_LABELS[p.source] || p.source;
            return `[${label}${i + 1}] ${p.title}\nURL: ${p.url}\n内容:\n${p.text.slice(0, 3000)}`;
          })
          .join('\n\n---\n\n')
      : 'コンテンツ情報を取得できませんでした。';

    const inquiryText = inquiries
      .map((item, i) => {
        const q = normalizeMultiline(item && item.question);
        const a = normalizeMultiline(item && item.answer);
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

## 出力（必ずJSON形式で出力してください）

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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.3,
        max_tokens: 3000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return res.status(502).json({ error: 'OpenAI request failed', detail: body });
    }

    const json = await response.json();
    const raw = normalizeMultiline(json?.choices?.[0]?.message?.content || '');
    if (!raw) {
      return res.status(502).json({ error: 'Empty analysis result' });
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (_e) {
      return res.status(502).json({ error: 'Failed to parse AI response as JSON', raw });
    }

    res.json({
      blogTopics: Array.isArray(parsed.blogTopics) ? parsed.blogTopics : [],
      guideImprovements: Array.isArray(parsed.guideImprovements) ? parsed.guideImprovements : [],
      answerPatterns: Array.isArray(parsed.answerPatterns) ? parsed.answerPatterns : [],
    });
  } catch (err) {
    res.status(500).json({ error: err && err.message ? err.message : 'unknown error' });
  }
});

app.listen(PORT, () => {
  console.log(`title-summary-proxy listening on :${PORT}`);
});
