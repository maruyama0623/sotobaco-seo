import type { Env } from "./types";

/** Slack Incoming Webhook で通知（PIIなし） */
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

/** Cron処理結果の通知ブロック */
export function buildCronResultBlocks(
  sent: number,
  skipped: number,
  errors: number
): Array<Record<string, unknown>> {
  const lines: string[] = [
    `*送信:* ${sent}件`,
    `*スキップ:* ${skipped}件`,
  ];
  if (errors > 0) {
    lines.push(`*エラー:* ${errors}件`);
  }

  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "ステップメール配信レポート",
        emoji: true,
      },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: lines.join("\n") },
    },
  ];
}

/** 新規登録通知ブロック（PIIなし） */
export function buildEnrollBlocks(): Array<Record<string, unknown>> {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "ステップメール: 新規ユーザーが登録されました（Step 1送信済み）",
      },
    },
  ];
}
