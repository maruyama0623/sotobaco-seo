# Cloudflare Workers ドキュメント

モノレポ内の全Worker（`workers/` 配下）の構成・役割・環境変数・デプロイ手順をまとめたドキュメント。

> 週次学習分析レポートについては [`docs/weekly-report.md`](./weekly-report.md) を参照。

---

## 一覧

| Worker | URL | 役割 |
|--------|-----|------|
| support-api | `support-api.sotobaco.workers.dev` | お問い合わせ受付・自動返信・AI回答案・Slack通知・kintone連携・週次レポート |
| proxy | `proxy.sotobaco.workers.dev` | AIプロキシ（タイトル要約・回答案生成・コンテンツクロール・学習分析・GA4データ取得） |
| material-api | `material-api.sotobaco.workers.dev` | 資料ダウンロード（フォーム受付・メール送信・R2からPDF配信・kintone連携） |

---

## 1. support-api

お問い合わせの受付からAI回答案生成、Slack通知、kintone記録、週次レポートまでの自動化システム。

### ファイル構成

```
workers/support-api/src/
  index.ts      — ルーティング + export default
  types.ts      — 型定義・定数（Env, ContactBody, etc.）
  utils.ts      — sanitize, corsHeaders, isValidEmail, stripPII, hashEmail, timingSafeEqual, checkRateLimit, checkWebhookRateLimit
  kintone.ts    — kintone CRUD・ID生成・類似Q&A検索
  email.ts      — SendGrid送信・メール解析（引用除去・アドレス抽出）
  ai.ts         — AIプロンプト構築・回答案生成・関連ページ取得・docs動的取得・学習パッチ生成
  slack.ts      — Slack署名検証・メッセージ送信/更新・Block Kit構築・インタラクション・長文テキスト分割
  learning.ts   — 学習システム（完了ボタン・モーダル・AI要約・GitHubコミット）
  contact.ts    — handleContact（お問い合わせフォーム受付）
  reply.ts      — handleReply（メール返信処理）
  scheduled.ts  — handleScheduled（週次レポート）
```

### エンドポイント

| メソッド | パス | 保護 | 機能 |
|---------|------|------|------|
| POST | `/` | レート制限 + バリデーション | お問い合わせフォーム受付 |
| POST | `/feedback` | レート制限 + バリデーション | フィードバックフォーム受付 |
| POST | `/reply` | Webhookシークレット認証（timing-safe） + レート制限 | メール返信ハンドラ（GAS経由） |
| POST | `/slack/interact` | Slack署名検証（HMAC） | Slackインタラクション（ボタン・モーダル） |
| OPTIONS | `*` | — | CORS preflight |

### Cronトリガー

| Cron式 | タイミング | 内容 |
|--------|-----------|------|
| `0 1 * * 1` | 毎週月曜 10:00 JST | 週次学習分析レポートをSlack投稿 |

### Slack通知ヘッダー

フォームの送信元ページによって通知タイトルを切り替える。

| 送信元ページ | 判定ロジック | Slackヘッダー |
|-------------|------------|--------------|
| `sotobaco.com/contact` | `body.category` あり | 【要確認】コーポレートサイトからのお問い合わせ |
| `sotobaco.com/requests` | `body.category` なし | 【至急確認】サービスに対するお問い合わせ |

### お問い合わせフロー

```
お問い合わせフォーム送信
  ↓
support-api Worker
  ├→ SendGrid: 自動返信メール送信
  ├→ kintone: App 93（親）+ App 94（明細）にレコード作成
  ├→ proxy Worker: 関連ページ取得（/relevant-pages）
  └→ Anthropic API: AI回答案生成（GitHub docs + 関連ページURL）
       ↓
     Slack通知（回答案 + 送信/編集ボタン）
       ↓
     担当者がSlackで確認 → 「送信」or「編集する」
       ↓
     SendGrid: 顧客にメール送信 + kintone App 94に回答記録
```

### 顧客返信フロー

```
顧客がメール返信
  ↓
Google Apps Script（5分おき監視）
  ↓
support-api /reply エンドポイント
  ├→ kintone App 94: 新しい枝番で明細追加
  ├→ proxy Worker: 関連ページ取得
  ├→ kintone App 94: 類似Q&A検索
  └→ AI回答案生成
       ↓
     Slack スレッドに通知
```

### 学習システム

お問い合わせ対応完了後、対応内容をドキュメントに自動反映し、次回以降のAI回答案の精度を向上させる仕組み。

```
担当者がメール送信完了
  ↓
「完了」ボタンをクリック
  ↓
ローディングモーダル表示 → AI要約生成（スレッドコンテキストから）
  ↓
学習モーダル（対象サービス・困っていたこと・方針の入力フィールド）
  ↓
「登録」クリック
  ├→ Slackスレッドに学習データ投稿
  ├→ AIパッチ生成（見出し一覧 + 学習データ → 追加内容のみ生成）
  └→ GitHub API: docs/*.md にコミット（developブランチ）
```

#### 学習の方針テンプレート

AI要約は以下のテンプレートで生成される。担当者が編集してから登録可能。

```
今後このような問い合わせが来た場合は以下の回答をしてください。

■ （見出し）

【① （手順名）】
（具体的な操作手順）

【② （手順名）】
（具体的な操作手順）
```

#### ドキュメント更新方式（パッチ方式）

Cloudflare Workers の `waitUntil` 時間制限内で処理を完了させるため、ドキュメント全文書き換えではなくパッチ方式を採用。

| 処理 | 旧方式 | 現方式 |
|------|--------|--------|
| AIへの入力 | ドキュメント全文（数十KB） | 見出し一覧のみ + 学習データ |
| AIの出力 | ドキュメント全文 | 追加先セクション名 + 追加内容のみ |
| ドキュメント更新 | AI出力で全文置換 | コード側で指定セクションに挿入 |
| max_tokens | 8192 | 1024 |

#### 必要なSecrets

`GITHUB_TOKEN`（Contents: Read and write 権限）と `GITHUB_REPO`（`owner/repo` 形式）が未設定の場合、Slackスレッド記録のみで GitHub コミットはスキップされる。

#### Slack Block Kit の文字数制限

Slack の section ブロックは `text.text` 最大3000文字の制限がある。学習データの「困っていたこと」「方針」が長い場合、`buildLongTextBlocks()` で自動的に改行位置で複数ブロックに分割して投稿する。

### AI回答案の情報源

| 情報源 | 内容 | 取得元 |
|--------|------|--------|
| サービスドキュメント | サービス仕様・価格・FAQ・会社情報 | GitHub API（developブランチの `docs/sotobaco-portal.md` + `docs/btone.md` + `docs/company.md`） |
| 関連ページ | 操作ガイド・ブログ記事・LPから関連ページURL | proxy Worker `/relevant-pages` |

> docsの動的取得により、ドキュメントを更新すれば再デプロイなしでAI回答案に反映される。GitHub API取得に失敗した場合はAI回答案の生成をスキップし、Slack通知のみ行う（手動対応）。

### AI回答案のルール

- 挨拶文: 「お世話になっております。株式会社ソトバコ サポートチームです。」
- 宛名は「会社名＋ご担当者様」を使用（個人名はAIに送信しない）
- Markdown記法はプロンプトで禁止 + 後処理で自動除去（`**太字**`→太字、`*斜体*`→斜体、`- `→`・`）
- メール送信元: 受付完了メール=`noreply@sotobaco.com`（FROM_EMAIL）、Slack返信=`support@sotobaco.co.jp`（SUPPORT_FROM_EMAIL）
- 自動返信メール（noreply@sotobaco.com）には「このメールに返信してください」等の文言を含めない（返信不可アドレスのため）

> **過去Q&A参照（無効化済み）**: kintone App 94 の類似Q&A検索は PII 保護の観点から無効化。`fetchSimilarAnswers` / `extractKeywords` は kintone.ts に関数として残存しているが、contact.ts / reply.ts からの呼び出しを削除済み。将来 kintone 側で回答を匿名化して保存する仕組みができた場合に復活可能。

### kintone連携

| アプリ | アプリID | 用途 |
|--------|---------|------|
| 問い合わせ管理（親） | App 93 | 問い合わせ単位の管理。question_id, タイトル, 顧客情報 |
| 問い合わせ明細（子） | App 94 | やりとりの履歴。枝番管理、質問内容、回答内容 |

- `question_id`: `YYYYMMDD-NNN` 形式（例: 20260223-001）
- スレッド管理: KV（THREAD_MAP）で `questionId` をキーとして、Slackメッセージ＋kintone情報＋PII（email, name）を集約（30日TTL）
  - 顧客返信時、メール件名の `[Q-YYYYMMDD-NNN]` からquestionIdを抽出してKV検索し、既存スレッドに返信を追加
  - questionIdなし（件名から抽出不可）の場合はフォールバックIDを生成して新規KV作成
  - やり取りがある度にKV putでTTLがリセットされ、アクティブな問い合わせは自動延長される

### 環境変数・Secrets

| 変数名 | 用途 |
|--------|------|
| SENDGRID_API_KEY | メール送信 |
| FROM_EMAIL | 自動返信メール送信元（noreply@sotobaco.com） |
| SUPPORT_FROM_EMAIL | Slack返信メール送信元（support@sotobaco.co.jp） |
| REPLY_TO_EMAIL | 返信先（support@sotobaco.co.jp） |
| CORS_ORIGIN | 許可するオリジン |
| ANTHROPIC_API_KEY | AI回答案生成 |
| REPLY_WEBHOOK_SECRET | 返信Webhook認証 |
| SLACK_BOT_TOKEN | Slack Bot API |
| SLACK_SIGNING_SECRET | Slack署名検証 |
| SLACK_CHANNEL_ID | 通知先チャンネル |
| TITLE_PROXY_URL | proxy WorkerのURL |
| KINTONE_SUBDOMAIN | kintoneサブドメイン |
| KINTONE_APP_ID_93 / 94 | kintoneアプリID |
| KINTONE_API_TOKEN_93 / 94 | kintone APIトークン |
| GITHUB_TOKEN | GitHub APIトークン（docs動的取得 + 学習コミット） |
| GITHUB_REPO | GitHubリポジトリ（owner/repo形式） |

### KV Namespace

| Binding | 用途 |
|---------|------|
| THREAD_MAP | questionId→Slackスレッド＋kintone情報＋PII（email, name）の集約（30日TTL、アクティブ時自動延長） |
| RATE_LIMIT | IP単位のレート制限カウンター（10分TTL）。フォーム用（`rl:`prefix, 5req/10min）とwebhook用（`wrl:`prefix, 30req/10min） |

---

## 2. proxy

AIプロキシ。コンテンツクロール・タイトル要約・回答案生成・学習分析・GA4データ取得を担う。support-api から `TITLE_PROXY_URL` 経由で呼び出される。

### ファイル構成

```
workers/proxy/src/
  index.ts    — ルーティング + ハンドラ
  types.ts    — 型定義
  claude.ts   — Claude API 呼び出し
  crawl.ts    — サイトクロール・KVキャッシュ
  scoring.ts  — ページスコアリング・関連ページ抽出
  ga4.ts      — GA4 Data API 連携
  utils.ts    — テキスト正規化ユーティリティ
```

### エンドポイント

| メソッド | パス | 認証 | 機能 |
|---------|------|------|------|
| GET | `/health` | 不要 | ヘルスチェック（キャッシュ状況・AI・GA4の設定状態） |
| GET | `/ga4-weekly` | 不要 | GA4週次アクセスデータ（ブログPV・LP PV・概要） |
| POST | `/crawl` | PROXY_TOKEN | 手動クロール実行 |
| POST | `/summarize-title` | PROXY_TOKEN | テキストからタイトル要約（20〜40文字） |
| POST | `/draft-answer` | PROXY_TOKEN | 質問に対する回答案生成 |
| POST | `/relevant-pages` | 不要 | 問い合わせ内容に関連するページURL取得 |
| POST | `/learning-insights` | PROXY_TOKEN | お問い合わせデータ＋コンテンツの比較分析 |

### Cronトリガー

| Cron式 | タイミング | 内容 |
|--------|-----------|------|
| `0 0,6,12,18 * * *` | 6時間ごと | 操作ガイド・ブログ・LPをクロール→KVキャッシュ更新 |

### クロール対象

| ソース | ドメイン | 対象パス | 用途 |
|--------|---------|---------|------|
| 操作ガイド | guide.sotobaco.com | /portal/ 配下 | 操作手順・設定方法の案内 |
| ブログ | blog.sotobaco.com | /articles/ 配下 | 詳しい解説・活用事例の紹介 |
| LP | sotobaco.com | /sotobacoportal 配下 | 機能一覧・料金・導入手順の案内 |

### 環境変数・Secrets

| 変数名 | 用途 |
|--------|------|
| ANTHROPIC_API_KEY | Claude API キー |
| PROXY_TOKEN | 認証トークン |
| GA_CLIENT_EMAIL | サービスアカウントemail（GA4設定後） |
| GA_PRIVATE_KEY | サービスアカウント秘密鍵（GA4設定後） |
| GA_PROJECT_ID | GCPプロジェクトID（GA4設定後） |
| GA_PROPERTY_ID_BLOG | blog.sotobaco.com GA4プロパティID（GA4設定後） |
| GA_PROPERTY_ID_SITE | sotobaco.com GA4プロパティID（GA4設定後） |

### KV Namespace

| Binding | 用途 |
|---------|------|
| PAGE_CACHE | クロール結果キャッシュ + GA4トークンキャッシュ |

### AIモデル

- Claude Haiku 4.5（`claude-haiku-4-5-20251001`）

---

## 3. material-api

ソトバコポータルの資料ダウンロードフォーム。フォーム送信→ダウンロードURL生成→メール送信→Slack通知→kintoneリード登録を処理する。

### ファイル構成

```
workers/material-api/src/
  index.ts  — 全処理（単一ファイル、約440行）
```

### エンドポイント

| メソッド | パス | 機能 |
|---------|------|------|
| POST | `/` | 資料ダウンロードフォーム受付（レート制限→バリデーション→トークン生成→kintone登録→メール送信→Slack通知） |
| GET | `/download?token=xxx` | PDFダウンロード（R2から配信、72時間有効トークン認証） |
| OPTIONS | `*` | CORS preflight |

### フロー

```
資料ダウンロードフォーム送信
  ↓
material-api Worker
  ├→ バリデーション（会社名・名前・メール + セレクト項目のホワイトリストチェック）
  ├→ KV: ダウンロードトークン生成（72時間TTL）
  ├→ kintone: App 95（資料請求リード）にレコード作成 → レコードID取得
  ├→ SendGrid: ダウンロードURLをメール送信
  └→ Slack Bot API: リード通知（PIIなし + kintoneレコードリンクボタン）
```

### 収集データ（リードクオリフィケーション）

フォームで以下の情報を収集：会社名、氏名、メール、役職、業種・業態、会社規模、目的、開始時期、kintone利用歴、kintoneユーザー数、作成アプリ数

### kintone連携

| アプリ | アプリID | 用途 |
|--------|---------|------|
| 資料請求リード管理 | App 95 | 資料請求フォームからのリード情報を自動登録 |

登録フィールド: service（固定: ソトバコポータル）, company, name, email, position, industry, companySize, purpose, startTiming, kintoneHistory, kintoneUsers, kintoneApps

- 環境変数（`KINTONE_SUBDOMAIN`, `KINTONE_APP_ID_95`, `KINTONE_API_TOKEN_95`）が全て設定されている場合のみ有効
- kintone登録失敗はユーザーレスポンスに影響させない（メール送信・Slack通知と並列実行）

### Slack通知のPII配置

| メッセージ | 表示内容 | PII |
|-----------|---------|-----|
| 親メッセージ（チャンネル一覧で見える） | 会社名・役職・業種 + kintoneレコードリンクボタン | なし |

- SlackにはPIIを一切送信しない。リード詳細（氏名・メール・アンケート項目）はkintoneレコードで確認する
- kintone未設定時はリンクボタンなしの通知のみ

### 環境変数・Secrets

| 変数名 | 用途 |
|--------|------|
| SENDGRID_API_KEY | メール送信 |
| SLACK_WEBHOOK_URL | Slack通知（レガシー Webhook、フォールバック） |
| SLACK_BOT_TOKEN | Slack Bot API（Bot Token、親子メッセージ分離に必要） |
| SLACK_CHANNEL_ID | Slack通知先チャンネル |
| FROM_EMAIL | 送信元メールアドレス |
| CORS_ORIGIN | 許可するオリジン |
| KINTONE_SUBDOMAIN | kintoneサブドメイン（任意） |
| KINTONE_APP_ID_95 | kintone App 95 ID（任意） |
| KINTONE_API_TOKEN_95 | kintone App 95 APIトークン（任意） |

### KV Namespace

| Binding | 用途 |
|---------|------|
| DOWNLOAD_TOKENS | ダウンロードトークン（72時間TTL） |
| RATE_LIMIT | IP単位のレート制限カウンター（10分TTL） |

### R2 Bucket

| Binding | バケット名 | 用途 |
|---------|-----------|------|
| MATERIAL_BUCKET | sotobaco-material | 資料PDF格納（`sotobaco-portal-material.pdf`） |

---

## デプロイ

```bash
# support-api Worker
cd workers/support-api && npx wrangler deploy

# proxy Worker
cd workers/proxy && npx wrangler deploy

# material-api Worker
cd workers/material-api && npx wrangler deploy

# Secret設定（初回のみ）
cd workers/support-api && npx wrangler secret put SENDGRID_API_KEY
cd workers/proxy && npx wrangler secret put ANTHROPIC_API_KEY
cd workers/proxy && npx wrangler secret put PROXY_TOKEN
cd workers/material-api && npx wrangler secret put SENDGRID_API_KEY
cd workers/material-api && npx wrangler secret put KINTONE_SUBDOMAIN
cd workers/material-api && npx wrangler secret put KINTONE_APP_ID_95
cd workers/material-api && npx wrangler secret put KINTONE_API_TOKEN_95

# 手動クロール実行（初回 or キャッシュ即時更新時）
curl -X POST https://proxy.sotobaco.workers.dev/crawl -H 'x-proxy-token: <TOKEN>'
```

---

## Worker間の連携

```
support-api
  ├→ proxy Worker（TITLE_PROXY_URL経由）
  │    ├→ /relevant-pages   — 問い合わせに関連するページURL
  │    ├→ /learning-insights — 週次レポートのAI分析
  │    └→ /ga4-weekly        — GA4アクセスデータ
  ├→ kintone（App 93 + App 94）
  ├→ SendGrid
  └→ Slack Bot API

proxy
  ├→ Anthropic API（Claude Haiku 4.5）
  ├→ GA4 Data API
  └→ KV（PAGE_CACHE — クロール結果）

material-api（独立、他Workerとの連携なし）
  ├→ SendGrid
  ├→ Slack Bot API（PIIなし通知 + kintoneリンクボタン）
  ├→ kintone（App 95 — 資料請求リード、環境変数設定時のみ）
  ├→ KV（DOWNLOAD_TOKENS）
  └→ R2（PDF格納）
```

---

## レート制限

全エンドポイントにIP単位のレート制限を適用。`/slack/interact`（HMAC検証済み）のみ対象外。

| 対象 | キープレフィックス | 上限 | 備考 |
|------|-------------------|------|------|
| フォーム（contact / feedback / material） | `rl:{IP}` | 5回 / 10分 | 日本語エラーメッセージ |
| Webhook（/reply） | `wrl:{IP}` | 30回 / 10分 | secret認証後に適用 |

| 設定 | 値 |
|------|-----|
| ウィンドウ | 10分（固定ウィンドウ） |
| 超過時 | 429 Too Many Requests |
| ストレージ | KV（`RATE_LIMIT`）— TTL = ウィンドウ秒数（自動削除） |

### 入力文字数上限

| フィールド | 上限 |
|-----------|------|
| 会社名 | 200文字 |
| 氏名 | 100文字 |
| メールアドレス | 254文字（RFC 5321準拠） |
| 本文・コメント | 5,000文字 |

---

## セキュリティ（PII保護）

顧客の個人情報（PII）を最小限の箇所に集約し、外部サービスへの不必要な送信を防止する。

### Worker別のSlack PII方針

| Worker | Slack上のPII | 理由 |
|--------|-------------|------|
| support-api | スレッド内に表示 | AI回答案の確認・編集・送信をSlackスレッド上で行うため、問い合わせ内容・顧客情報が必要 |
| material-api | 一切なし | リード情報はkintoneに集約。Slackにはkintoneレコードリンクボタンのみ |

### PII集約アーキテクチャ（support-api）

PIIはKV（THREAD_MAP）の1箇所に集約し、他のシステムにはquestionIdのみを渡す。

```
KV（THREAD_MAP）← PIIの唯一の保存先（30日TTL、アクティブ時自動延長）
  ├ email, name（顧客のメールアドレス・氏名）
  ├ channel, ts（Slackスレッド情報）
  ├ questionId, kintoneRecordId, detailRecordId（業務ID）
  └ branchNumber（やり取り枝番）

Slackボタン value ← questionId のみ（PIIなし）
Slackモーダル private_metadata ← questionId のみ（PIIなし）
Slack親メッセージ ← 種別・会社名・AIタイトルのみ（PIIなし）
Slackスレッド返信 ← 氏名・メールアドレスはスレッド内のみに表示
```

### TTLリセットの仕組み

KV `put` で同キーに上書きするとTTLもリセットされる。以下のタイミングで30日TTLが延長される：

1. `contact.ts`: 初回問い合わせ → KV作成
2. `reply.ts`: 顧客返信 → KV更新
3. `slack.ts`: 担当者回答送信 → KV再保存

### Slack通知のPII配置

| メッセージ | 表示内容 | PII |
|-----------|---------|-----|
| 親メッセージ（チャンネル一覧で見える） | 種別・会社名・AIタイトル | なし |
| スレッド返信（展開で見える） | お名前・メールアドレス・問い合わせ内容 | あり |
| ボタンvalue / モーダルmetadata | questionIdのみ | なし |

### AIに送信されるデータの範囲

| データ | 送信有無 | 備考 |
|--------|---------|------|
| 会社名 | 送信する | 回答案の宛名（会社名＋ご担当者様）に必要 |
| 問い合わせ内容 | 送信する | 回答案生成に必須 |
| 氏名 | **送信しない** | 宛名は「ご担当者様」を使用 |
| メールアドレス | **送信しない** | — |
| 学習データ（スレッドコンテキスト） | PIIマスク済みで送信 | `stripPII()` でメール・電話番号を自動マスク |
| 過去Q&A | **送信しない** | PII保護のため無効化済み（将来匿名化対応後に復活可能） |
| サービスドキュメント | 送信する | GitHub APIから動的取得（公開ドキュメント） |
| 関連ページURL | 送信する | proxy Workerのクロール結果（公開ページ） |

### 認証・保護

| 対策 | 詳細 |
|------|------|
| Webhook認証 | `/reply` のsecret比較にタイミングセーフ比較（HMAC経由）を使用。タイミング攻撃を防止 |
| Slack署名検証 | `/slack/interact` はHMAC-SHA256署名検証（リプレイ攻撃対策: 5分以内のタイムスタンプチェック） |
| レート制限 | 全エンドポイントにIP単位のレート制限を適用（フォーム: 5req/10min、webhook: 30req/10min） |
| エラーログのサニタイズ | console.errorにPIIを含めない。SendGridエラーはステータスコードのみ記録 |
| エラーレスポンスの汎用化 | クライアントに内部エラー詳細を返さない（`Internal server error` のみ） |
