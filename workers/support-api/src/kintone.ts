import type { Env } from "./types";

export function isKintoneEnabled(env: Env): boolean {
  return !!(
    env.KINTONE_SUBDOMAIN &&
    env.KINTONE_APP_ID_93 &&
    env.KINTONE_APP_ID_94 &&
    env.KINTONE_API_TOKEN_93 &&
    env.KINTONE_API_TOKEN_94
  );
}

export function toKintoneDate(date?: Date): string {
  const d = date || new Date();
  return d.toISOString().slice(0, 10);
}

function kintoneTokenForApp(env: Env, appId: string): string {
  return appId === env.KINTONE_APP_ID_93
    ? env.KINTONE_API_TOKEN_93!
    : env.KINTONE_API_TOKEN_94!;
}

export function kintoneUrl(env: Env, path: string): string {
  return `https://${env.KINTONE_SUBDOMAIN}.cybozu.com${path}`;
}

export async function createKintoneRecord(
  env: Env,
  appId: string,
  fields: Record<string, { value: string | number }>
): Promise<string | null> {
  try {
    const res = await fetch(kintoneUrl(env, "/k/v1/record.json"), {
      method: "POST",
      headers: {
        "X-Cybozu-API-Token": kintoneTokenForApp(env, appId),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ app: appId, record: fields }),
    });
    if (!res.ok) {
      console.error("kintone create error:", res.status);
      return null;
    }
    const data = (await res.json()) as { id: string };
    return data.id;
  } catch (err) {
    console.error("kintone create error:", err);
    return null;
  }
}

export async function updateKintoneRecord(
  env: Env,
  appId: string,
  recordId: string,
  fields: Record<string, { value: string }>
): Promise<void> {
  try {
    const res = await fetch(kintoneUrl(env, "/k/v1/record.json"), {
      method: "PUT",
      headers: {
        "X-Cybozu-API-Token": kintoneTokenForApp(env, appId),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ app: appId, id: recordId, record: fields }),
    });
    if (!res.ok) {
      console.error("kintone update error:", res.status);
    }
  } catch (err) {
    console.error("kintone update error:", err);
  }
}

/** question_id の YYYYMMDD-NNN 形式を生成 */
export async function generateQuestionId(env: Env): Promise<string> {
  const today = toKintoneDate();
  const prefix = today.replace(/-/g, "");
  try {
    const query = `question_id like "${prefix}-" order by question_id desc limit 1`;
    const res = await fetch(
      kintoneUrl(env, `/k/v1/records.json?app=${env.KINTONE_APP_ID_93}&query=${encodeURIComponent(query)}&fields[0]=question_id`),
      { headers: { "X-Cybozu-API-Token": env.KINTONE_API_TOKEN_93! } }
    );
    if (res.ok) {
      const data = (await res.json()) as {
        records: Array<{ question_id: { value: string } }>;
      };
      if (data.records.length > 0) {
        const lastId = data.records[0].question_id.value;
        const num = parseInt(lastId.split("-")[1] || "0", 10);
        return `${prefix}-${String(num + 1).padStart(3, "0")}`;
      }
    }
  } catch (err) {
    console.error("kintone query error:", err);
  }
  return `${prefix}-001`;
}

/** App 94 の最大枝番を取得 */
export async function getMaxBranchNumber(
  env: Env,
  questionId: string
): Promise<number> {
  try {
    const query = `question_id = "${questionId}" order by branch_number desc limit 1`;
    const res = await fetch(
      kintoneUrl(env, `/k/v1/records.json?app=${env.KINTONE_APP_ID_94}&query=${encodeURIComponent(query)}&fields[0]=branch_number`),
      { headers: { "X-Cybozu-API-Token": env.KINTONE_API_TOKEN_94! } }
    );
    if (res.ok) {
      const data = (await res.json()) as {
        records: Array<{ branch_number: { value: string } }>;
      };
      if (data.records.length > 0) {
        return parseInt(data.records[0].branch_number.value || "0", 10);
      }
    }
  } catch (err) {
    console.error("kintone query error:", err);
  }
  return 0;
}

/** お問い合わせ内容からタイトルを生成（AI要約） */
export async function generateInquiryTitle(
  env: Env,
  message: string
): Promise<string> {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 60,
        system:
          "お問い合わせ内容を20〜40文字のタイトルに要約してください。" +
          "「〜ができない」「〜がしたい」「〜について」など、内容が一目でわかる形にしてください。" +
          "タイトルのみを出力し、それ以外は何も出力しないでください。",
        messages: [{ role: "user", content: message }],
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        content: Array<{ text: string }>;
      };
      const title = data.content?.[0]?.text?.trim();
      if (title) return title;
    }
  } catch (err) {
    console.error("Title generation error:", err);
  }
  // フォールバック: 先頭40文字
  return message.length > 40 ? message.slice(0, 40) + "…" : message;
}

/** メッセージからキーワードを抽出（類似Q&A検索用） */
export function extractKeywords(text: string): string[] {
  const words =
    text.match(/[一-龯ぁ-んァ-ヶー]{2,}|[a-zA-Z0-9]{3,}/g) || [];
  const stopWords = new Set([
    "です",
    "ます",
    "する",
    "いる",
    "ある",
    "こと",
    "ため",
    "よう",
    "ください",
    "について",
    "いただ",
    "ございます",
    "できる",
    "いたし",
    "お願い",
    "お問い合わせ",
  ]);
  return [...new Set(words.filter((w) => !stopWords.has(w)))].slice(0, 15);
}

/** kintone App 94 から回答済みの類似Q&Aを最大5件取得 */
export async function fetchSimilarAnswers(
  env: Env,
  message: string
): Promise<Array<{ question: string; answer: string }>> {
  if (!isKintoneEnabled(env)) return [];
  try {
    const query = `answer_detail != "" order by 更新日時 desc limit 20`;
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

    const keywords = extractKeywords(message);
    const scored = data.records
      .map((r) => {
        const q = r.question_detail.value || "";
        const a = r.answer_detail.value || "";
        let score = 0;
        keywords.forEach((kw) => {
          if (q.includes(kw)) score += 2;
          if (a.includes(kw)) score += 1;
        });
        return { question: q, answer: a, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return scored.map(({ question, answer }) => ({ question, answer }));
  } catch (err) {
    console.error("fetchSimilarAnswers error:", err);
    return [];
  }
}
