import type { Env } from "./types";

function kintoneUrl(env: Env, path: string): string {
  return `https://${env.KINTONE_SUBDOMAIN}.cybozu.com${path}`;
}

/** slug でレコードを検索（1件） */
export async function findRecordBySlug(
  env: Env,
  slug: string
): Promise<{ id: string; fields: Record<string, { value: string }> } | null> {
  const query = `slug = "${slug}" limit 1`;
  const params = new URLSearchParams({
    app: env.KINTONE_APP_ID_BLOG,
    query,
  });

  const res = await fetch(
    kintoneUrl(env, `/k/v1/records.json?${params.toString()}`),
    {
      headers: { "X-Cybozu-API-Token": env.KINTONE_API_TOKEN_BLOG },
    }
  );

  if (!res.ok) {
    console.error("kintone query error:", res.status);
    return null;
  }

  const data = (await res.json()) as {
    records: Array<{
      $id: { value: string };
      [key: string]: { value: string };
    }>;
  };

  if (data.records.length === 0) return null;

  const record = data.records[0];
  return { id: record.$id.value, fields: record };
}

/** レコード新規作成 */
export async function createRecord(
  env: Env,
  fields: Record<string, { value: string | number }>
): Promise<string | null> {
  const res = await fetch(kintoneUrl(env, "/k/v1/record.json"), {
    method: "POST",
    headers: {
      "X-Cybozu-API-Token": env.KINTONE_API_TOKEN_BLOG,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ app: env.KINTONE_APP_ID_BLOG, record: fields }),
  });

  if (!res.ok) {
    console.error("kintone create error:", res.status);
    return null;
  }

  const data = (await res.json()) as { id: string };
  return data.id;
}

/** レコード更新 */
export async function updateRecord(
  env: Env,
  recordId: string,
  fields: Record<string, { value: string | number }>
): Promise<void> {
  const res = await fetch(kintoneUrl(env, "/k/v1/record.json"), {
    method: "PUT",
    headers: {
      "X-Cybozu-API-Token": env.KINTONE_API_TOKEN_BLOG,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      app: env.KINTONE_APP_ID_BLOG,
      id: recordId,
      record: fields,
    }),
  });

  if (!res.ok) {
    console.error("kintone update error:", res.status);
  }
}
