import type { Env, PublishRequest } from "./types";
import {
  getFileFromGitHub,
  commitFileToGitHub,
  mergeDevelopToMain,
  updatePublishedAt,
} from "./github";
import { updateRecord } from "./kintone";
import {
  notifySlack,
  buildPublishBlocks,
  buildUnpublishBlocks,
} from "./slack";

const LOCK_KEY = "publish-lock";
const LOCK_TTL = 120; // 秒

async function acquireLock(kv: KVNamespace): Promise<boolean> {
  const existing = await kv.get(LOCK_KEY);
  if (existing) return false;
  await kv.put(LOCK_KEY, Date.now().toString(), { expirationTtl: LOCK_TTL });
  return true;
}

async function releaseLock(kv: KVNamespace): Promise<void> {
  await kv.delete(LOCK_KEY);
}

export function todayDate(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

/** 公開処理のコアロジック（HTTPハンドラ・Cronの両方から呼ばれる） */
export async function publishArticle(
  slug: string,
  recordId: string,
  filename: string,
  env: Env
): Promise<void> {
  const filePath = `sites/blog/articles/${filename}`;
  const publishedAt = todayDate();

  // develop から記事ファイルを取得
  const { content, sha } = await getFileFromGitHub(env, filePath);

  // publishedAt を今日の日付に設定
  const updated = updatePublishedAt(content, publishedAt);

  // develop にコミット
  await commitFileToGitHub(
    env,
    filePath,
    updated,
    sha,
    `publish: ${slug} を本番公開`
  );

  // develop → main マージ
  await mergeDevelopToMain(env, `publish: ${slug} を本番公開`);

  // kintone レコード更新
  await updateRecord(env, recordId, {
    status: { value: "公開済み" },
    published_at: { value: publishedAt },
    production_url: { value: `https://blog.sotobaco.com/articles/${slug}/` },
  });

  // 記事タイトルを frontmatter から取得
  const titleMatch = content.match(/^title:\s*"([^"]*)"/m);
  const title = titleMatch ? titleMatch[1] : slug;

  // Slack通知
  await notifySlack(env, buildPublishBlocks(title, slug, publishedAt));
}

export async function handlePublish(
  body: PublishRequest,
  env: Env
): Promise<Response> {
  const { slug, recordId, filename } = body;
  if (!slug || !recordId || !filename) {
    return new Response(
      JSON.stringify({ error: "slug, recordId, filename are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // ロック取得
  const locked = await acquireLock(env.PUBLISH_LOCK);
  if (!locked) {
    return new Response(
      JSON.stringify({ error: "別の公開処理が進行中です。しばらく待ってから再試行してください。" }),
      { status: 409, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    await publishArticle(slug, recordId, filename, env);

    return new Response(
      JSON.stringify({ ok: true, slug, publishedAt: todayDate() }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Publish error:", err);
    return new Response(
      JSON.stringify({ error: "公開処理に失敗しました" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    await releaseLock(env.PUBLISH_LOCK);
  }
}

export async function handleUnpublish(
  body: PublishRequest,
  env: Env
): Promise<Response> {
  const { slug, recordId, filename } = body;
  if (!slug || !recordId || !filename) {
    return new Response(
      JSON.stringify({ error: "slug, recordId, filename are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // ロック取得
  const locked = await acquireLock(env.PUBLISH_LOCK);
  if (!locked) {
    return new Response(
      JSON.stringify({ error: "別の公開処理が進行中です。しばらく待ってから再試行してください。" }),
      { status: 409, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const filePath = `sites/blog/articles/${filename}`;

    // develop から記事ファイルを取得
    const { content, sha } = await getFileFromGitHub(env, filePath);

    // 記事タイトルを frontmatter から取得
    const titleMatch = content.match(/^title:\s*"([^"]*)"/m);
    const title = titleMatch ? titleMatch[1] : slug;

    // publishedAt を空にする
    const updated = updatePublishedAt(content, "");

    // develop にコミット
    await commitFileToGitHub(
      env,
      filePath,
      updated,
      sha,
      `unpublish: ${slug} を非公開に変更`
    );

    // develop → main マージ
    await mergeDevelopToMain(env, `unpublish: ${slug} を非公開に変更`);

    // kintone レコード更新
    await updateRecord(env, recordId, {
      status: { value: "ステージング" },
      published_at: { value: "" },
      production_url: { value: "" },
    });

    // Slack通知
    await notifySlack(env, buildUnpublishBlocks(title));

    return new Response(
      JSON.stringify({ ok: true, slug }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unpublish error:", err);
    return new Response(
      JSON.stringify({ error: "非公開処理に失敗しました" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    await releaseLock(env.PUBLISH_LOCK);
  }
}
