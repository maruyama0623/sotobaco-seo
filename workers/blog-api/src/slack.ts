import type { Env } from "./types";

/** Slack Incoming Webhook で通知 */
export async function notifySlack(
  env: Env,
  blocks: Array<Record<string, unknown>>
): Promise<void> {
  if (!env.SLACK_WEBHOOK_URL) return;

  const res = await fetch(env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocks }),
  });

  if (!res.ok) {
    console.error("Slack notification error:", res.status);
  }
}

/** ステージング同期通知ブロック */
export function buildSyncBlocks(
  articles: Array<{
    title: string;
    slug: string;
    isNew: boolean;
    isPublished: boolean;
  }>
): Array<Record<string, unknown>> {
  const newArticles = articles.filter((a) => a.isNew);
  const updatedArticles = articles.filter((a) => !a.isNew);

  const lines: string[] = [];
  if (newArticles.length > 0) {
    lines.push("*新規:*");
    newArticles.forEach((a) => {
      lines.push(
        `  ${a.title}\n  https://stg.blog.sotobaco.com/articles/${a.slug}/`
      );
    });
  }
  if (updatedArticles.length > 0) {
    lines.push("*更新:*");
    updatedArticles.forEach((a) => {
      lines.push(
        `  ${a.title}\n  https://stg.blog.sotobaco.com/articles/${a.slug}/`
      );
    });
  }

  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "ステージングに記事が反映されました",
        emoji: true,
      },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: lines.join("\n") },
    },
  ];
}

/** 本番公開通知ブロック */
export function buildPublishBlocks(
  title: string,
  slug: string,
  publishedAt: string
): Array<Record<string, unknown>> {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "記事を本番公開しました",
        emoji: true,
      },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*記事:*\n${title}` },
        { type: "mrkdwn", text: `*公開日:*\n${publishedAt}` },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `https://blog.sotobaco.com/articles/${slug}/`,
      },
    },
  ];
}

/** 非公開通知ブロック */
export function buildUnpublishBlocks(
  title: string
): Array<Record<string, unknown>> {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "記事を非公開にしました",
        emoji: true,
      },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: `*記事:* ${title}` },
    },
  ];
}
