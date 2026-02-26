import type { Env } from "./types";
import { publishArticle, todayDate } from "./publish";
import { notifySlack } from "./slack";

interface ScheduledRecord {
  $id: { value: string };
  slug: { value: string };
  title: { value: string };
  filename: { value: string };
}

/** kintone から公開予定日が今日のレコードを取得 */
async function fetchScheduledArticles(
  env: Env
): Promise<ScheduledRecord[]> {
  const today = todayDate();
  const query = `scheduled_date = "${today}" and status in ("ステージング") limit 10`;
  const params = new URLSearchParams({
    app: env.KINTONE_APP_ID_BLOG,
    query,
  });
  ["$id", "slug", "title", "filename"].forEach((f, i) =>
    params.append(`fields[${i}]`, f)
  );

  const res = await fetch(
    `https://${env.KINTONE_SUBDOMAIN}.cybozu.com/k/v1/records.json?${params.toString()}`,
    {
      headers: { "X-Cybozu-API-Token": env.KINTONE_API_TOKEN_BLOG },
    }
  );

  if (!res.ok) {
    console.error("Scheduled query error:", res.status);
    return [];
  }

  const data = (await res.json()) as { records: ScheduledRecord[] };
  return data.records;
}

/** Cron Trigger ハンドラ: 公開予定日の記事を自動公開 */
export async function handleScheduled(env: Env): Promise<void> {
  const articles = await fetchScheduledArticles(env);
  if (articles.length === 0) return;

  for (const article of articles) {
    try {
      await publishArticle(
        article.slug.value,
        article.$id.value,
        article.filename.value,
        env
      );
    } catch (err) {
      console.error(`Scheduled publish error (${article.slug.value}):`, err);
      await notifySlack(env, [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:warning: スケジュール公開に失敗しました: *${article.title.value}*`,
          },
        },
      ]);
    }
  }
}
