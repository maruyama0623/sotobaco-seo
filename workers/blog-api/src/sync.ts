import type { Env, SyncRequest, ArticleMeta } from "./types";
import { findRecordBySlug, createRecord, updateRecord } from "./kintone";
import { notifySlack, buildSyncBlocks } from "./slack";

const STAGING_BASE_URL = "https://stg.blog.sotobaco.com/articles";

function buildKintoneFields(article: ArticleMeta) {
  return {
    slug: { value: article.slug },
    title: { value: article.title },
    description: { value: article.description },
    article_number: { value: article.articleNumber },
    filename: { value: article.filename },
    staging_url: { value: `${STAGING_BASE_URL}/${article.slug}/` },
  };
}

export async function handleSync(
  body: SyncRequest,
  env: Env
): Promise<Response> {
  const { articles } = body;
  if (!articles || !Array.isArray(articles) || articles.length === 0) {
    return new Response(
      JSON.stringify({ error: "articles array is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const results: Array<{
    title: string;
    slug: string;
    isNew: boolean;
    isPublished: boolean;
  }> = [];

  for (const article of articles) {
    const existing = await findRecordBySlug(env, article.slug);
    const fields = buildKintoneFields(article);

    if (existing) {
      await updateRecord(env, existing.id, fields);
      const status = existing.fields.status?.value ?? "";
      results.push({
        title: article.title,
        slug: article.slug,
        isNew: false,
        isPublished: status === "公開済み",
      });
    } else {
      // 新規作成時はステータスを「ステージング」に設定
      const createFields = {
        ...fields,
        status: { value: "ステージング" },
      };
      await createRecord(env, createFields);
      results.push({
        title: article.title,
        slug: article.slug,
        isNew: true,
        isPublished: false,
      });
    }
  }

  // Slack通知（新規記事のみ）
  const notifiable = results.filter((r) => r.isNew);
  if (notifiable.length > 0) {
    await notifySlack(env, buildSyncBlocks(notifiable));
  }

  return new Response(
    JSON.stringify({ ok: true, synced: results.length }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
