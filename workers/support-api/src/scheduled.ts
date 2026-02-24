import type { Env } from "./types";
import { isKintoneEnabled, kintoneUrl, extractKeywords } from "./kintone";

interface LearningInsightsResult {
  blogTopics: Array<{ title: string; reason: string; targetKeyword: string; priority: string }>;
  guideImprovements: Array<{ page: string; issue: string; suggestion: string }>;
  answerPatterns: Array<{ pattern: string; frequency: string; improvementHint: string }>;
}

interface GA4WeeklyData {
  blogRanking: Array<{ path: string; title: string; views: number; prevViews: number }>;
  lpAccess: {
    current: { views: number; sessions: number; users: number };
    previous: { views: number; sessions: number; users: number };
    byPage: Array<{ path: string; views: number }>;
  };
  overview: {
    blog: { views: number; sessions: number; users: number };
    site: { views: number; sessions: number; users: number };
  };
}

async function fetchRecentInquiries(
  env: Env,
  limit: number = 20
): Promise<Array<{ question: string; answer: string }>> {
  if (!isKintoneEnabled(env)) return [];
  try {
    const query = `order by 更新日時 desc limit ${limit}`;
    const params = new URLSearchParams({
      app: env.KINTONE_APP_ID_94!,
      query,
    });
    ["question_detail", "answer_detail"].forEach((f, i) =>
      params.append(`fields[${i}]`, f)
    );
    const res = await fetch(
      kintoneUrl(env, `/k/v1/records.json?${params.toString()}`),
      { headers: { "X-Cybozu-API-Token": env.KINTONE_API_TOKEN_94! } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as {
      records: Array<{
        question_detail: { value: string };
        answer_detail: { value: string };
      }>;
    };
    return data.records
      .filter((r) => r.question_detail.value)
      .map((r) => ({
        question: r.question_detail.value,
        answer: r.answer_detail.value || "",
      }));
  } catch (err) {
    console.error("fetchRecentInquiries error:", err);
    return [];
  }
}

function formatNumber(n: number): string {
  return n.toLocaleString("ja-JP");
}

function formatChangePercent(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "（New）" : "";
  const change = ((current - previous) / previous) * 100;
  if (change > 0) return `（:arrow_up: ${Math.round(change)}%）`;
  if (change < 0) return `（:arrow_down: ${Math.abs(Math.round(change))}%）`;
  return "（±0%）";
}

const LP_PAGE_LABELS: Record<string, string> = {
  "/sotobacoportal": "トップ",
  "/sotobacoportal/": "トップ",
  "/sotobacoportal/features": "機能",
  "/sotobacoportal/features/": "機能",
  "/sotobacoportal/pricing": "料金",
  "/sotobacoportal/pricing/": "料金",
  "/sotobacoportal/contact": "問い合わせ",
  "/sotobacoportal/contact/": "問い合わせ",
};


/** 親メッセージ: サマリー（ヘッダー + 日付 + アクセス概要） */
function formatSummaryBlocks(
  inquiryCount: number,
  ga4?: GA4WeeklyData | null
): Array<Record<string, unknown>> {
  const blocks: Array<Record<string, unknown>> = [
    {
      type: "header",
      text: { type: "plain_text", text: "【通知】週次レポートを作成しました", emoji: true },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `:calendar: ${new Date().toLocaleDateString("ja-JP")} | 分析対象: 直近 ${inquiryCount} 件のお問い合わせ`,
        },
      ],
    },
  ];

  if (ga4) {
    blocks.push({ type: "divider" });
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: [
          "*:bar_chart: アクセス概要（直近7日）*",
          `ブログ: ${formatNumber(ga4.overview.blog.views)} PV / ${formatNumber(ga4.overview.blog.sessions)} セッション / ${formatNumber(ga4.overview.blog.users)} ユーザー`,
          `LP: ${formatNumber(ga4.overview.site.views)} PV / ${formatNumber(ga4.overview.site.sessions)} セッション / ${formatNumber(ga4.overview.site.users)} ユーザー`,
        ].join("\n"),
      },
    });
  }

  return blocks;
}

/** スレッド返信: GA4 詳細（人気記事 + LPアクセス内訳） */
function formatGA4DetailBlocks(ga4: GA4WeeklyData): Array<Record<string, unknown>> {
  const blocks: Array<Record<string, unknown>> = [];

  // ブログ人気記事 Top5
  if (ga4.blogRanking.length > 0) {
    const top5 = ga4.blogRanking.slice(0, 5);
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*:trophy: 人気記事 Top 5*\n" +
          top5
            .map((article, i) => {
              const change = formatChangePercent(article.views, article.prevViews);
              const title = article.title.replace(/\s*[|｜\-–—].*(ソトバコ|sotobaco).*$/i, "").trim() || article.title;
              return `${i + 1}. ${title} — ${formatNumber(article.views)} PV${change}`;
            })
            .join("\n"),
      },
    });
    blocks.push({ type: "divider" });
  }

  // LPアクセス
  const lpChange = formatChangePercent(ga4.lpAccess.current.views, ga4.lpAccess.previous.views);
  const pageBreakdown = ga4.lpAccess.byPage
    .map((p) => {
      const label = LP_PAGE_LABELS[p.path] || p.path;
      return `${label}: ${formatNumber(p.views)} PV`;
    })
    .join(" | ");

  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: [
        "*:chart_with_upwards_trend: LP アクセス（/sotobacoportal）*",
        `今週: ${formatNumber(ga4.lpAccess.current.views)} PV / 前週: ${formatNumber(ga4.lpAccess.previous.views)} PV${lpChange}`,
        pageBreakdown || "ページ別データなし",
      ].join("\n"),
    },
  });

  return blocks;
}

/** スレッド返信: AI分析（記事案 + ガイド改善 + 回答パターン） */
function formatInsightsBlocks(
  insights: LearningInsightsResult
): Array<Record<string, unknown>> {
  const blocks: Array<Record<string, unknown>> = [];

  // ブログ記事案
  if (insights.blogTopics.length > 0) {
    const priorityEmoji: Record<string, string> = { high: ":red_circle:", medium: ":large_orange_circle:", low: ":white_circle:" };
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*:pencil2: ブログ記事案*\n" +
          insights.blogTopics
            .map(
              (t) =>
                `${priorityEmoji[t.priority] || ":white_circle:"} *${t.title}*\n   KW: \`${t.targetKeyword}\` | ${t.reason}`
            )
            .join("\n"),
      },
    });
    blocks.push({ type: "divider" });
  }

  // ガイド改善案
  if (insights.guideImprovements.length > 0) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*:books: 操作ガイド改善案*\n" +
          insights.guideImprovements
            .map((g) => `• *${g.page}*\n   課題: ${g.issue}\n   提案: ${g.suggestion}`)
            .join("\n"),
      },
    });
    blocks.push({ type: "divider" });
  }

  // 回答パターン
  if (insights.answerPatterns.length > 0) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*:bulb: 回答パターン分析*\n" +
          insights.answerPatterns
            .map((a) => `• *${a.pattern}*（${a.frequency}）\n   ${a.improvementHint}`)
            .join("\n"),
      },
    });
  }

  blocks.push({
    type: "context",
    elements: [
      { type: "mrkdwn", text: ":robot_face: このレポートはAIが自動生成したものです" },
    ],
  });

  return blocks;
}

export async function handleScheduled(env: Env): Promise<void> {
  if (!env.TITLE_PROXY_URL || !env.SLACK_BOT_TOKEN || !env.SLACK_CHANNEL_ID) {
    console.log("Scheduled: missing TITLE_PROXY_URL or Slack config, skipping");
    return;
  }

  const inquiries = await fetchRecentInquiries(env, 20);
  if (inquiries.length === 0) {
    console.log("Scheduled: no inquiries found, skipping");
    return;
  }

  // キーワード集計
  const wordCount: Record<string, number> = {};
  for (const inq of inquiries) {
    const words = extractKeywords(inq.question);
    for (const w of words) {
      wordCount[w] = (wordCount[w] || 0) + 1;
    }
  }
  const keywords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word, count]) => ({ word, count }));

  const stats = {
    detailCount: inquiries.length,
    answeredCount: inquiries.filter((i) => i.answer).length,
    unansweredCount: inquiries.filter((i) => !i.answer).length,
  };

  try {
    // learning-insights と GA4 データを並列取得（Service Binding優先）
    const proxyFetch = env.PROXY_SERVICE
      ? env.PROXY_SERVICE.fetch.bind(env.PROXY_SERVICE)
      : fetch;
    const proxyBase = env.PROXY_SERVICE
      ? "https://proxy"
      : env.TITLE_PROXY_URL!;
    const proxyHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...(env.PROXY_TOKEN ? { "x-proxy-token": env.PROXY_TOKEN } : {}),
    };

    const [insightsRes, ga4Res] = await Promise.all([
      proxyFetch(`${proxyBase}/learning-insights`, {
        method: "POST",
        headers: proxyHeaders,
        body: JSON.stringify({
          service: "ソトバコポータル",
          inquiries: inquiries.slice(0, 30).map((i) => ({
            question: i.question,
            answer: i.answer,
          })),
          stats,
          keywords,
        }),
      }),
      proxyFetch(`${proxyBase}/ga4-weekly`, {
        headers: proxyHeaders,
      }).catch((err) => {
        console.log("Scheduled: GA4 fetch failed (non-blocking):", err);
        return null;
      }),
    ]);

    if (!insightsRes.ok) {
      console.error("Scheduled: learning-insights error:", insightsRes.status);
      return;
    }

    const insights = (await insightsRes.json()) as LearningInsightsResult;

    // GA4 データ（取得失敗時はnull、レポートはGA4なしで続行）
    let ga4Data: GA4WeeklyData | null = null;
    if (ga4Res && ga4Res.ok) {
      try {
        ga4Data = (await ga4Res.json()) as GA4WeeklyData;
      } catch (err) {
        console.log("Scheduled: GA4 JSON parse failed (non-blocking):", err);
      }
    }

    // 親メッセージ: サマリー
    const summaryBlocks = formatSummaryBlocks(inquiries.length, ga4Data);
    const parentRes = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: env.SLACK_CHANNEL_ID,
        blocks: summaryBlocks,
        text: "【通知】週次レポートを作成しました",
      }),
    });
    const parentData = (await parentRes.json()) as { ok: boolean; ts?: string };
    const parentTs = parentData.ts;

    if (parentTs) {
      // スレッド返信1: GA4 詳細（データがある場合）
      if (ga4Data) {
        const ga4Blocks = formatGA4DetailBlocks(ga4Data);
        if (ga4Blocks.length > 0) {
          await fetch("https://slack.com/api/chat.postMessage", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              channel: env.SLACK_CHANNEL_ID,
              thread_ts: parentTs,
              blocks: ga4Blocks,
              text: "GA4 アクセス詳細",
            }),
          });
        }
      }

      // スレッド返信2: AI分析（記事案・ガイド改善・回答パターン）
      const insightsBlocks = formatInsightsBlocks(insights);
      if (insightsBlocks.length > 0) {
        await fetch("https://slack.com/api/chat.postMessage", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channel: env.SLACK_CHANNEL_ID,
            thread_ts: parentTs,
            blocks: insightsBlocks,
            text: "AI分析レポート",
          }),
        });
      }
    }

    console.log(`Scheduled: weekly report posted to Slack (GA4: ${ga4Data ? "included" : "skipped"})`);
  } catch (err) {
    console.error("Scheduled: error:", err);
  }
}
