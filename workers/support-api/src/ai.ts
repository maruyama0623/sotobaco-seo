import type { Env, AiResult } from "./types";

export const SERVICE_CONTEXT = `
# 株式会社ソトバコ. サービス情報

## 会社概要
- 会社名: 株式会社ソトバコ.
- 本社: 福岡県福岡市
- 認定: サイボウズ プロダクトパートナー（2025年10月認定）
- 公式サイト: https://sotobaco.com/

## サービス① ソトバコポータル（kintoneポータル整理・管理）
- Webアプリ（kintoneプラグインではない）
- LP: https://sotobaco.com/sotobacoportal
- 操作ガイド: https://guide.sotobaco.com/portal/index.html
- アカウント作成: https://portal.sotobaco.com/signup
- 資料ダウンロード: https://sotobaco.com/sotobacoportal/material

### 価格（税抜）
- フリー: ¥0（期間制限なし、決済情報登録不要、4タブまで）
- ライト: 月額¥3,800 / 年額¥36,000
- スタンダード: 月額¥9,800 / 年額¥108,000
- 初期費用0円、kintone1環境につき1契約（ユーザー単位課金なし）
- 課金開始: 有料プラン申込翌月から
- 解約: いつでも可能、手数料なし
- 支払い方法: 銀行振り込みのみ

### 主な機能

#### タブ整理・閲覧権限設定
アプリをタブごとに分類し、組織・グループ・ユーザーの3軸で閲覧権限を設定。複数の軸を組み合わせて柔軟な権限制御が可能。権限外のタブはそのユーザーには表示されない。閲覧権限の組織・グループはkintoneに設定されているものを読み込んで使用（ソトバコポータル側で独自管理はしない）。

#### ドラッグ&ドロップ操作
アプリカードやグループの配置をドラッグ&ドロップで変更。HTMLやJavaScriptの知識不要。管理者1人で整理可能。属人化を防ぎ、担当者が変わっても運用継続できる。

#### アプリカード
3種類から選択して追加:
- kintoneアプリリンク: kintoneアプリへのリンクカード。アプリアイコンをkintoneから自動取得
- 外部リンク: スプレッドシートや勤怠システムなど外部サービスのURLを登録
- スペースリンク（スタンダード）: kintoneスペースへのリンクカード。スペース名・カバー画像はkintone側の変更を自動同期
設定項目: サイズ（大/小）・リンクの開き方（別タブ/同じタブ）・カラー（7色）・説明文・アイコン。サイズ「大」は説明文が展開表示、「小」はコンパクト表示。
操作メニュー: 各カードの3点メニューから「編集」「グループ移動」「複製」「削除」が可能。グループ移動はタブをまたいだ移動にも対応。

#### グループ
アプリカードをまとめるグループ。グループ名の表示/非表示を切り替え可能。説明文をグループ名の下に設定可能（ライト以上）。アイコン設定可。
操作メニュー: 3点メニューから「編集」「タブ移動」「複製」「削除」が可能。タブ移動でグループごと別タブに移動。複製はアプリカードを含めてまるごと複製。

#### グラフリアルタイム表示
kintoneのグラフをポータル上にリアルタイム表示（サイズS/L選択可）。売上・進捗・KPIなどをポータルを開くだけで即座に把握できる。フリー: 各1個/タブ、ライト以上: 無制限。

#### アプリ一覧埋め込み
kintoneのアプリ一覧をポータルに表示（全プラン対応）。

#### 通知一覧表示
kintoneの通知をポータルのサイドバーに表示（全プラン対応）。承認待ち・確認待ちのタスクをすぐに把握でき、対応漏れや確認忘れを防ぐ。

#### 未処理一覧表示
kintoneの未処理レコードをポータルのサイドバーに表示（全プラン対応）。

#### 全体アナウンス（ライト以上）
ポータルに1〜10件まで表示可能（デフォルト3件、管理画面で変更可）。kintoneアプリのレコードと連動して自動更新。カテゴリ分けはスタンダードのみ対応（フィールドコードを「category」に設定する必要あり）。
- 導入時に専用「全体アナウンス」kintoneアプリが自動生成される
- レコード管理方式: 過去のアナウンスもすべてアーカイブとして残り検索・絞り込みが可能
- レコード単位で表示/非表示を切替可能
- kintoneの「アクション機能」で他アプリ（障害報告アプリ等）からワンクリック転記可能
- ユーザー選択フィールド＋レコードのアクセス権設定で特定ユーザーのみへの表示も可能
- タイトルフィールドをリッチエディターに変更すれば文字色・太字・背景色の装飾も可能

#### 限定公開（全プラン対応）
全社導入前に一部ユーザー・グループだけにポータルをテスト適用。全社公開前にデザインや動作を安心してテストでき、フィードバック収集後に全社展開できる。

#### アプリカード位置固定
画面サイズが変わってもアプリカードの位置が固定され、迷わない。

#### スマートフォン対応
JSファイル（portal-design-common.min.js）をkintone全体カスタマイズのスマートフォン用JSとしてアップロードで対応。外出先や移動中でもスマホからポータル確認可能。

#### スペース単位ポータル（スタンダード）
スペースIDを設定してスペースごとに異なるポータルを表示。数に制限なし。全社ポータルと部署・プロジェクト専用ポータルを使い分けられる。

#### kintoneデフォルトポータル非表示
対象ユーザー・グループ・組織ごとにkintone標準ポータルを非表示化（全プラン対応）。

#### ユーザー権限管理（ロール）
「管理者」と「ポータル編集者」の2ロール。管理者はすべてのページにアクセス可能、ポータル編集者はポータルの編集のみに限定（全プラン対応）。

### プラン別機能比較
| 機能 | フリー | ライト | スタンダード |
| タブ上限 | 4タブ | 無制限 | 無制限 |
| グラフ埋め込み | 各1個/タブ | 無制限 | 無制限 |
| グループ説明文 | × | ○ | ○ |
| 全体アナウンス | × | ○ | ○ |
| 全体アナウンス表示件数設定（1〜10件） | × | ○ | ○ |
| 全体アナウンスカテゴリ | × | × | ○ |
| スペースリンク | × | × | ○ |
| スペース単位ポータル | × | × | 無制限 |
| メンバー上限（管理画面にアクセスできるユーザー数） | 1名 | 2名 | 5名 |
| 閲覧権限・通知・未処理・アプリ一覧・限定公開・位置固定・ロール・ポータル非表示 | 全プラン対応 |

### 契約・課金ルール
- 決済情報の登録不要: アカウント作成時に決済情報の入力なし。フリープランからすぐに始められる
- 自動課金なし: フリープランから自動で有料プランに移行することはない
- 課金開始: 有料プラン申込翌月から
- プラン変更: アップグレードはいつでも可能。ダウングレードは非対応
- 解約: いつでも可能、手数料なし
- 支払い方法: 銀行振り込みのみ

### 導入手順（最短7分）
1. アカウント作成: メールアドレスだけでOK、1分で完了。アカウント作成時に自動的にフリープラン契約
2. kintone連携設定: cybozu.com共通管理画面でOAuthクライアントを追加し、クライアントID・シークレットをソトバコポータルに入力して接続（共通管理者権限が必要）
3. ポータル設定: タブ・グループ・アプリカードを追加して「ポータルを更新する」をクリック

### FAQ
- フリープランに期間制限はない
- kintoneのプラグインではなくWebアプリ（kintone外のサービス）。プラグインの制約を受けない
- 初回連携にcybozu.com共通管理者権限が必要（OAuthクライアント追加）
- 閲覧権限の組織・グループはkintoneの設定を読み込んで使用。独自管理不要
- Kintone Portal Designerからの移行: デザインの直接引き継ぎは不可。代替サービスとして利用可能。Portal Designerは2025年5月12日に開発終了
- 動作環境: Edge（Chromium版）, Firefox, Chrome, Safari の各最新版
- 導入前の相談: お問い合わせフォームから可能、3営業日以内に回答

### 活用パターン
- 業務別にタブを整理: 案件管理・経理・人事など業務カテゴリごとにタブを分けて整理
- 部署別にタブを見せ分け: 営業部・総務部・経理部など部署ごとに閲覧権限を設定
- プロジェクト別にタブを管理: 関連アプリ・スペースリンク・資料をひとつのタブに集約
- 全社共有 + 部署ポータル: メインポータルには全社共通情報、部署アプリはスペース単位ポータルで分離

### 操作上の注意点
- 設定変更後は「ポータルを更新する」ボタンをクリックしないとkintoneに反映されない
- 通知・未処理・アプリ一覧を表示するには、kintone側の「ポータルの設定」で各項目にチェックが必要
- スペースリンクのURL入力形式: /k/#/space/{スペースID}
- スペースリンクの自動同期: kintone側でスペース名・カバー画像を変更するとポータルにも自動反映
- 全体アナウンスカテゴリ: kintoneのフィールドコードを必ず「category」にする

### トラブルシューティング
ポータルが表示されない場合の主な原因:
- kintoneシステムのアクセス権（アプリの管理）が付与されていない
- ポータルデザイン設定反映アプリの権限（レコード追加・アプリ管理・ファイル読み込み）が不足
- カスタマイズ適用範囲が「すべてのユーザーに適用」になっていない
- ブラウザ・iOSのバージョンが古い

### データ保存ポリシー
kintoneのレコード情報は一切保存しない。保存するのはレイアウト情報（アプリ名やアプリID）とユーザーコード（kintoneのログイン名）のみ。kintone内の顧客データや売上データなどのレコード情報、パスワード等のアカウント詳細は一切保存しない。

## サービス② Btone（Bカート×kintone連携）
- Webアプリ
- LP: https://sotobaco.com/btone
- アカウント作成: https://app.sotobaco.com/signup
- 月額¥15,000（税抜）、年払いなし
- 30日間無料お試し（決済情報登録不要、自動課金なし）
- 連携データ: 商品基本・商品セット・カテゴリ・特集・会員・見積・受注・出荷
- kintoneアプリ自動生成機能あり
`.trim();

export const AI_SYSTEM_PROMPT_CONTACT = `あなたは株式会社ソトバコ.のカスタマーサポート担当です。お問い合わせに対する回答案を作成してください。

${SERVICE_CONTEXT}

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
   - 【会社名】【問い合わせ者の姓】【名前】はそのままプレースホルダーとして残す（担当者が置き換える）
   - 質問内容は「>」で引用し、その下に回答を書く
   - 複数の質問がある場合は質問ごとに引用+回答を繰り返す
   - 「関連ページ」が提供された場合、回答の最後に「ご参考」として関連URLを案内する。操作手順は操作ガイド、詳しい解説はブログ記事、機能一覧は製品ページを適切に使い分ける

4. テンプレート:

件名：【ソトバコポータル】お問い合わせいただきました件について

本文：
【会社名】
【問い合わせ者の姓】様

お世話になっております。株式会社ソトバコの【名前】と申します。

この度はソトバコポータルをご契約いただきまして、誠にありがとうございます。
早速ではございますが、お問い合わせいただきました件について回答いたします。

> 質問内容

回答内容

ご質問の回答は以上となります。
他にご不明点やお困り事等がございましたら、お気軽にお問い合わせくださいませ。

引き続き何卒よろしくお願い申し上げます。`;

export const AI_SYSTEM_PROMPT_REPLY = `あなたは株式会社ソトバコ.のカスタマーサポート担当です。お客様からの返信メールに対する回答案を作成してください。

${SERVICE_CONTEXT}

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
   - 「関連ページ」が提供された場合、回答の最後に「ご参考」として関連URLを案内する。操作手順は操作ガイド、詳しい解説はブログ記事、機能一覧は製品ページを適切に使い分ける`;

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
  pastQA?: Array<{ question: string; answer: string }>,
  relevantPages?: Array<{ url: string; title: string; source: string; snippet: string }>
): Promise<AiResult> {
  let enrichedMessage = userMessage;
  if (pastQA && pastQA.length > 0) {
    const qaContext = pastQA
      .map(
        (qa, i) =>
          `#${i + 1}\n質問: ${qa.question.slice(0, 300)}\n回答: ${qa.answer.slice(0, 500)}`
      )
      .join("\n\n");
    enrichedMessage += `\n\n## 過去の類似お問い合わせと回答（参考）\n${qaContext}`;
  }
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
    const errorText = await response.text();
    throw new Error(`Anthropic API error: ${response.status} ${errorText}`);
  }

  const result = (await response.json()) as {
    content: Array<{ type: string; text: string }>;
  };
  const text = result.content?.[0]?.text || "";

  if (text.startsWith("SALES")) {
    return { isSales: true, draft: "" };
  }

  const separatorIndex = text.indexOf("---");
  const draft =
    separatorIndex !== -1
      ? text.slice(separatorIndex + 3).trim()
      : text.replace(/^SUPPORT\s*/, "").trim();

  return { isSales: false, draft };
}

/** スレッドの内容からお問い合わせの要約と方針を生成 */
export async function generateLearningSummary(
  env: Env,
  threadContext: string
): Promise<{ issue: string; policy: string }> {
  const systemPrompt = `お問い合わせ対応のSlackスレッド内容を読み、以下の2点を要約してください。

1. 「困っていたこと」: お客様が何に困っていたのかを簡潔に要約（1〜3文）
2. 「方針」: この問い合わせに対してソトバコとしてどう対応したか・今後の方針を要約（1〜3文）

以下の形式で出力してください（他の文章は不要）:
ISSUE:
（困っていたことの要約）

POLICY:
（方針の要約）`;

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
    const errorText = await response.text();
    throw new Error(`Anthropic API error: ${response.status} ${errorText}`);
  }

  const result = (await response.json()) as {
    content: Array<{ type: string; text: string }>;
  };
  const text = result.content?.[0]?.text || "";

  if (text.trim() === "NO_CHANGE") return null;
  return text;
}
