# お問い合わせAIシステム（contact-api）

お問い合わせの受付からAI回答案生成、Slack通知、kintone記録までの自動化システム。

> 週次学習分析レポートについては [`docs/weekly-report.md`](./weekly-report.md) を参照。

---

## システム構成

| コンポーネント | ホスト | 役割 |
|-------------|--------|------|
| contact-api Worker | Cloudflare Workers | メイン処理（受付・AI回答案・Slack通知・kintone連携） |
| proxy Worker | Cloudflare Workers | AIプロキシ（タイトル要約・回答案生成・コンテンツクロール・学習分析・GA4データ取得） |
| check-replies.js | Google Apps Script | Gmail返信メール監視（5分おき） |

---

## お問い合わせフロー

```
お問い合わせフォーム送信
  ↓
contact-api Worker
  ├→ SendGrid: 自動返信メール送信
  ├→ kintone: App 93（親）+ App 94（明細）にレコード作成
  ├→ proxy Worker: 関連ページ取得（/relevant-pages）
  ├→ kintone App 94: 類似Q&A検索
  └→ Anthropic API: AI回答案生成（SERVICE_CONTEXT + 類似Q&A + 関連ページURL）
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
contact-api /reply エンドポイント
  ├→ kintone App 94: 新しい枝番で明細追加
  ├→ proxy Worker: 関連ページ取得
  ├→ kintone App 94: 類似Q&A検索
  └→ AI回答案生成
       ↓
     Slack スレッドに通知
```

---

## AI回答案の情報源

AI回答案は以下の情報を組み合わせて生成される:

| 情報源 | 内容 | 取得元 |
|--------|------|--------|
| SERVICE_CONTEXT | サービス仕様・価格・FAQ（contact-api内に埋め込み） | `workers/contact-api/src/index.ts` |
| 類似Q&A | kintoneに蓄積された過去の問い合わせ＋回答 | kintone App 94 |
| 関連ページ | 操作ガイド・ブログ記事・LP から関連ページURL | proxy Worker `/relevant-pages` |

### 関連ページのコンテンツソース

proxy Workerが以下の3サイトをクロール・キャッシュし、問い合わせ内容に関連するページを返す:

| ソース | ドメイン | 対象 | 用途 |
|--------|---------|------|------|
| 操作ガイド | guide.sotobaco.com | /portal/ 配下の全ページ | 操作手順・設定方法の案内 |
| ブログ | blog.sotobaco.com | /articles/ 配下の記事 | 詳しい解説・活用事例の紹介 |
| LP | sotobaco.com | /sotobacoportal 配下 | 機能一覧・料金・導入手順の案内 |

キャッシュ: KV（PAGE_CACHE）に保存。Cronトリガー（6時間ごと）で自動更新。

---

## kintone連携

| アプリ | アプリID | 用途 |
|--------|---------|------|
| 問い合わせ管理（親） | App 93 | 問い合わせ単位の管理。question_id, タイトル, 顧客情報 |
| 問い合わせ明細（子） | App 94 | やりとりの履歴。枝番管理、質問内容、回答内容 |

- `question_id`: `YYYYMMDD-NNN` 形式（例: 20260223-001）
- スレッド管理: KV（THREAD_MAP）でメールアドレス → Slackメッセージ＋kintone情報を紐づけ（30日保持）

---

## 環境変数・Secrets

### contact-api Worker

| 変数名 | 用途 |
|--------|------|
| SENDGRID_API_KEY | メール送信 |
| FROM_EMAIL | 送信元メールアドレス |
| REPLY_TO_EMAIL | 返信先（support@sotobaco.co.jp） |
| CORS_ORIGIN | 許可するオリジン |
| ANTHROPIC_API_KEY | AI回答案生成 |
| REPLY_WEBHOOK_SECRET | 返信Webhook認証 |
| SLACK_BOT_TOKEN | Slack Bot API |
| SLACK_SIGNING_SECRET | Slack署名検証 |
| SLACK_CHANNEL_ID | 通知先チャンネル |
| TITLE_PROXY_URL | proxy WorkerのURL（https://proxy.sotobaco.workers.dev） |
| KINTONE_SUBDOMAIN | kintoneサブドメイン |
| KINTONE_APP_ID_93 / 94 | kintoneアプリID |
| KINTONE_API_TOKEN_93 / 94 | kintone APIトークン |

### proxy Worker

| 変数名 | 用途 |
|--------|------|
| ANTHROPIC_API_KEY | Claude API キー |
| PROXY_TOKEN | 認証トークン（kintone/contact-apiが使用） |
| GA_CLIENT_EMAIL | サービスアカウントemail（GA4設定後） |
| GA_PRIVATE_KEY | サービスアカウント秘密鍵（GA4設定後） |
| GA_PROJECT_ID | GCPプロジェクトID（GA4設定後） |
| GA_PROPERTY_ID_BLOG | blog.sotobaco.com GA4プロパティID（GA4設定後） |
| GA_PROPERTY_ID_SITE | sotobaco.com GA4プロパティID（GA4設定後） |

---

## デプロイ

```bash
# contact-api Worker
cd workers/contact-api && npx wrangler deploy

# proxy Worker
cd workers/proxy && npx wrangler deploy

# Secret設定（初回のみ）
cd workers/proxy && npx wrangler secret put ANTHROPIC_API_KEY
cd workers/proxy && npx wrangler secret put PROXY_TOKEN

# contact-apiのプロキシURL切り替え
cd workers/contact-api && npx wrangler secret put TITLE_PROXY_URL
# → https://proxy.sotobaco.workers.dev を入力

# 手動クロール実行（初回 or キャッシュ即時更新時）
curl -X POST https://proxy.sotobaco.workers.dev/crawl -H 'x-proxy-token: <TOKEN>'
```
