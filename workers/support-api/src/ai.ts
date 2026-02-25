import type { Env, AiResult } from "./types";
import { getFileFromGitHub } from "./learning";

const DOC_PATHS = [
  "docs/sotobaco-portal.md",
  "docs/btone.md",
  "docs/company.md",
];

/** GitHub から最新の docs を取得し、サービスコンテキスト文字列を構築。失敗時は null を返す */
export async function fetchServiceContext(env: Env): Promise<string | null> {
  if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) {
    console.warn("fetchServiceContext: GITHUB_TOKEN or GITHUB_REPO not set");
    return null;
  }

  try {
    const results = await Promise.allSettled(
      DOC_PATHS.map((path) => getFileFromGitHub(env, path))
    );

    const docs: string[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        docs.push(result.value.content);
      }
    }

    if (docs.length === 0) {
      console.error("fetchServiceContext: all docs fetch failed");
      return null;
    }

    return docs.join("\n\n---\n\n");
  } catch (err) {
    console.error("fetchServiceContext error:", err);
    return null;
  }
}

/** お問い合わせ用システムプロンプトを構築 */
export function buildContactPrompt(serviceContext: string): string {
  return `あなたは株式会社ソトバコのカスタマーサポート担当です。お問い合わせに対する回答案を作成してください。

${serviceContext}

## 指示

1. まず、お問い合わせが「営業メール」かどうか判定してください。
   - 営業メール = ソトバコに対して何かを売り込む・提案する・パートナーシップを持ちかけるお問い合わせ
   - ソトバコのサービスについて質問・相談・導入検討するお問い合わせは営業メールではありません

2. 回答は以下の形式で出力してください:

営業メールの場合:
SALES
（回答案は不要）

営業メール以外の場合:
SUPPORT
---
（ここに回答案を記載）

3. 回答案のルール:
   - 以下のテンプレートに沿って回答案を作成する
   - 上記のサービス情報を参考に正確に回答する
   - わからないことは「確認のうえ改めてご連絡いたします」とする
   - 「過去の類似お問い合わせと回答」が提供された場合、それを参考にしつつ今回の質問に合わせて回答する（コピペしない）
   - 宛名は会社名＋「ご担当者様」とする（例: 株式会社○○ ご担当者様）。個人名は使わない
   - 質問内容は「>」で引用し、その下に回答を書く
   - 複数の質問がある場合は質問ごとに引用+回答を繰り返す
   - 「関連ページ」が提供された場合、回答の最後に「ご参考」として関連URLを案内する。操作手順は操作ガイド、詳しい解説はブログ記事、機能一覧は製品ページを適切に使い分ける
   - Markdown記法（**太字**、*斜体*、箇条書きの「-」など）は一切使わない。プレーンテキストのメールとして送信するため、装飾記法は不要

4. テンプレート:

件名：【ソトバコポータル】お問い合わせいただきました件について

本文：
（お問い合わせ内容から読み取った会社名）
ご担当者様

お世話になっております。株式会社ソトバコ サポートチームです。
この度はソトバコへお問い合わせいただきまして、誠にありがとうございます。
早速ではございますが、お問い合わせいただきました件について回答いたします。

> 質問内容

回答内容

ご質問の回答は以上となります。
他にご不明点やお困り事等がございましたら、お気軽にお問い合わせくださいませ。

引き続き何卒よろしくお願い申し上げます。`;
}

/** メール返信用システムプロンプトを構築 */
export function buildReplyPrompt(serviceContext: string): string {
  return `あなたは株式会社ソトバコのカスタマーサポート担当です。お客様からの返信メールに対する回答案を作成してください。

${serviceContext}

## 指示

1. まず、メールが「営業メール」かどうか判定してください。
   - 営業メール = ソトバコに対して何かを売り込む・提案する・パートナーシップを持ちかけるメール
   - ソトバコのサービスに関する質問・相談・やり取りの続きは営業メールではありません

2. 回答は以下の形式で出力してください:

営業メールの場合:
SALES
（回答案は不要）

営業メール以外の場合:
SUPPORT
---
（ここに回答案を記載）

3. 回答案のルール:
   - 敬語（ですます調）で丁寧に書く
   - 上記のサービス情報を参考に正確に回答する
   - わからないことは「確認のうえ改めてご連絡いたします」とする
   - これは返信メールへの回答なので、前回のやり取りの文脈を踏まえて回答する
   - 件名・宛名・署名は不要（担当者が追記する）
   - 冒頭は「お世話になっております。」から始める
   - 「関連ページ」が提供された場合、回答の最後に「ご参考」として関連URLを案内する。操作手順は操作ガイド、詳しい解説はブログ記事、機能一覧は製品ページを適切に使い分ける
   - Markdown記法（**太字**、*斜体*、箇条書きの「-」など）は一切使わない。プレーンテキストのメールとして送信するため、装飾記法は不要`;
}

/** proxy Worker から関連ページを取得（Service Binding優先） */
export async function fetchRelevantPages(
  env: Env,
  question: string
): Promise<Array<{ url: string; title: string; source: string; snippet: string }>> {
  if (!env.PROXY_SERVICE && !env.TITLE_PROXY_URL) return [];
  try {
    const proxyFetch = env.PROXY_SERVICE
      ? env.PROXY_SERVICE.fetch.bind(env.PROXY_SERVICE)
      : fetch;
    const base = env.PROXY_SERVICE ? "https://proxy" : env.TITLE_PROXY_URL!;
    const res = await proxyFetch(`${base}/relevant-pages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      pages?: Array<{ url: string; title: string; source: string; snippet: string }>;
    };
    return Array.isArray(data.pages) ? data.pages : [];
  } catch (err) {
    console.error("fetchRelevantPages error:", err);
    return [];
  }
}

export async function generateAiDraft(
  env: Env,
  systemPrompt: string,
  userMessage: string,
  relevantPages?: Array<{ url: string; title: string; source: string; snippet: string }>
): Promise<AiResult> {
  let enrichedMessage = userMessage;
  if (relevantPages && relevantPages.length > 0) {
    const pagesContext = relevantPages
      .map((p) => {
        const label = p.source === "guide" ? "操作ガイド" : p.source === "blog" ? "ブログ記事" : "サービスページ";
        return `- [${label}] ${p.title}: ${p.url}`;
      })
      .join("\n");
    enrichedMessage += `\n\n## 関連ページ（回答時にURLを案内してください）\n${pagesContext}`;
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: enrichedMessage }],
    }),
  });

  if (!response.ok) {
    console.error("Anthropic API error:", response.status);
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const result = (await response.json()) as {
    content: Array<{ type: string; text: string }>;
  };
  const text = result.content?.[0]?.text || "";

  if (text.startsWith("SALES")) {
    return { isSales: true, draft: "" };
  }

  const separatorIndex = text.indexOf("---");
  let draft =
    separatorIndex !== -1
      ? text.slice(separatorIndex + 3).trim()
      : text.replace(/^SUPPORT\s*/, "").trim();

  // Markdown記法を除去（AIが指示を無視する場合の安全策）
  draft = draft
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^- /gm, "・");

  return { isSales: false, draft };
}

/** スレッドの内容からお問い合わせの要約と方針を生成 */
export async function generateLearningSummary(
  env: Env,
  threadContext: string
): Promise<{ issue: string; policy: string }> {
  const systemPrompt = `お問い合わせ対応のSlackスレッド内容を読み、以下の2点を要約してください。

1. 「困っていたこと」: お客様が何に困っていたのかを簡潔に要約（1〜3文）
2. 「方針」: この問い合わせに対してソトバコとしてどう対応したか・今後の方針を箇条書きで要約（2〜5項目、各項目は「- 」で始める）

以下の形式で出力してください（他の文章は不要）:
ISSUE:
（困っていたことの要約）

POLICY:
- （方針1）
- （方針2）`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: threadContext }],
    }),
  });

  if (!response.ok) throw new Error("AI summary failed");

  const result = (await response.json()) as {
    content: Array<{ type: string; text: string }>;
  };
  const text = result.content?.[0]?.text || "";

  const issueMatch = text.match(/ISSUE:\s*\n?([\s\S]*?)(?=\nPOLICY:)/);
  const policyMatch = text.match(/POLICY:\s*\n?([\s\S]*?)$/);

  return {
    issue: issueMatch?.[1]?.trim() || "",
    policy: policyMatch?.[1]?.trim() || "",
  };
}

/** 学習データを基にドキュメントをブラッシュアップ */
export async function generateDocBrushUp(
  env: Env,
  currentDoc: string,
  issue: string,
  policy: string
): Promise<string | null> {
  const systemPrompt = `あなたはサービスドキュメントの編集担当です。
お問い合わせ対応から得られた学習データを基に、既存のドキュメントをブラッシュアップしてください。

## ルール
- 既存の構造（見出し・セクション順序）を維持する
- FAQ追加・説明補足・注意事項追加・トラブルシューティング追記など、適切な箇所に情報を追加する
- 既存の記述と重複する情報は追加しない
- 変更が不要な場合は「NO_CHANGE」とだけ出力する
- 変更がある場合はドキュメント全文を出力する（差分ではなく全文）`;

  const userMessage = `## 現在のドキュメント
${currentDoc}

## 学習データ
### お客様が困っていたこと
${issue}

### ソトバコとしての方針
${policy}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    console.error("Anthropic API error:", response.status);
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const result = (await response.json()) as {
    content: Array<{ type: string; text: string }>;
  };
  const text = result.content?.[0]?.text || "";

  if (text.trim() === "NO_CHANGE") return null;
  return text;
}
