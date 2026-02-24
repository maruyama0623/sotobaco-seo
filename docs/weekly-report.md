# 週次学習分析レポート

お問い合わせデータとGA4アクセスデータを自動分析し、アクセス概要・ブログ記事案・ガイド改善案・回答パターン分析をSlackに毎週投稿するレポート機能。

---

## 概要

毎週月曜 10:00（JST）に、直近のお問い合わせとGA4アクセスデータを分析し、Slackチャンネルに自動投稿される。

---

## フロー

```
Cloudflare Cron Trigger（毎週月曜 01:00 UTC = 10:00 JST）
  ↓
support-api Worker（scheduled ハンドラ）
  ├→ kintone App 94: 直近20件のお問い合わせ取得
  ├→ キーワード集計・統計算出
  ├→ proxy Worker /learning-insights に送信（AI分析）
  │    ├→ 全コンテンツ（操作ガイド・ブログ・LP）と比較分析
  │    └→ AI分析（Claude Haiku 4.5）
  └→ proxy Worker /ga4-weekly を取得（GA4アクセスデータ）
       └→ GA4 Data API（blog + site の2プロパティ）
            ↓
          Slackチャンネルに投稿
```

※ GA4 データの取得に失敗した場合、アクセスデータのセクションをスキップしてレポートは投稿される（graceful degradation）

---

## レポート内容

### 1. アクセス概要（GA4）

GA4 Data API から取得した直近7日間のアクセスデータ。

- **全体概要**: ブログ・LPそれぞれのPV/セッション/ユーザー数
- **人気記事 Top 5**: ブログ記事のPVランキング（前週比の増減率付き）
- **LP アクセス**: ソトバコポータルLPの各ページPVと前週比

### 2. ブログ記事案（3〜5件）

問い合わせから見えるニーズに基づくSEO記事テーマの提案。

- 優先度を赤/橙/白で表示（high / medium / low）
- 想定検索キーワード付き
- 既にブログ記事として公開済みのテーマは自動除外される

### 3. 操作ガイド改善案（3〜5件）

ガイドに記載がない、または記載が不十分なためにお問い合わせに至っている箇所の特定。

- 該当ページ（既存 or 新規）
- 課題と具体的な改善提案

### 4. 回答パターン分析（3〜5件）

テンプレート化できる回答の傾向分析。

- パターン名と出現頻度の目安
- テンプレート改善ヒント

---

## 分析に使われるコンテンツ

レポート生成時に、以下の3サイトのコンテンツを自動クロールして分析に使用する。既に記事やガイドでカバーされているテーマとまだカバーされていないテーマを区別できる。

| ソース | ドメイン | 対象パス |
|--------|---------|---------|
| 操作ガイド | guide.sotobaco.com | /portal/ 配下 |
| ブログ | blog.sotobaco.com | /articles/ 配下 |
| LP | sotobaco.com | /sotobacoportal 配下 |

---

## GA4 Data API 連携

proxy Worker が GA4 Data API を呼び出し、`GET /ga4-weekly` エンドポイントでアクセスデータを提供する。

### 取得データ

| データ | プロパティ | 内容 |
|--------|-----------|------|
| ブログ記事PVランキング | blog | `/articles/` パスの PV Top10（直近7日 + 前7日比較） |
| LPアクセス | site | `/sotobacoportal` パスの PV/セッション/ユーザー（直近7日 + 前7日比較） |
| 全体概要 | blog + site | 各プロパティの総PV/セッション/ユーザー |

### GA4 セットアップ手順

1. **Google Cloud Console**: 「Google Analytics Data API」を有効化 → サービスアカウント作成 → JSON キーをダウンロード
2. **GA4 管理画面**: ブログ用・サイト用の各プロパティにサービスアカウントのメールアドレスを「閲覧者」として追加
3. **Render.com**: 環境変数を設定（下記参照）

---

## 設定

| 項目 | 値 |
|------|-----|
| Cron式 | `0 1 * * 1`（wrangler.toml の `[triggers]`） |
| 実行タイミング | 毎週月曜 10:00 JST |
| 分析対象件数 | 直近20件 |

### 必要な環境変数（support-api Worker）

| 変数名 | 用途 |
|--------|------|
| TITLE_PROXY_URL | proxy Worker の URL |
| SLACK_BOT_TOKEN | Slack投稿用 |
| SLACK_CHANNEL_ID | 投稿先チャンネル |
| kintone関連（SUBDOMAIN, APP_ID_94, API_TOKEN_94） | お問い合わせデータ取得 |

※ いずれかが未設定の場合、レポートはスキップされる（エラーにはならない）

### 必要な環境変数（proxy Worker）

| 変数名 | 用途 |
|--------|------|
| GA_CLIENT_EMAIL | サービスアカウントのメールアドレス |
| GA_PRIVATE_KEY | サービスアカウントの秘密鍵（`\n` はエスケープ文字列で可） |
| GA_PROJECT_ID | Google Cloud プロジェクトID |
| GA_PROPERTY_ID_BLOG | blog.sotobaco.com の GA4 プロパティID |
| GA_PROPERTY_ID_SITE | sotobaco.com の GA4 プロパティID |

※ GA4 環境変数が未設定の場合、`/ga4-weekly` は 503 を返し、週次レポートはGA4セクションなしで投稿される

---

## 実行タイミングの変更

`workers/support-api/wrangler.toml` の Cron式を変更してデプロイする:

```toml
[triggers]
crons = ["0 1 * * 1"]  # 毎週月曜 01:00 UTC = 10:00 JST
```

例:
- 毎日: `0 1 * * *`
- 毎週月・木: `0 1 * * 1,4`
- 毎月1日: `0 1 1 * *`

変更後: `cd workers/support-api && npx wrangler deploy`
