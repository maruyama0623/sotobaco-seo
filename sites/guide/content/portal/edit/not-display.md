---
title: "表示されないとき"
slug: "not-display"
category: "edit"
order: 13
description: "ソトバコポータルが表示されない場合のトラブルシューティング手順をご案内します。"
---

ソトバコポータルが表示されない場合は、以下の項目を順番に確認してください。

<div class="guide-step" data-step="1">

## kintoneシステム管理のアクセス権を確認する

kintoneシステム管理のアクセス権設定で、該当ユーザー・グループ・組織に「アプリの管理」権限が付与されているか確認してください。

![kintoneアクセス権](/images/portal/not-display_system-access.png)

</div>

<div class="guide-step" data-step="2">

## ポータルデザイン設定反映アプリの権限を確認する

自動作成された「ポータルデザイン設定反映アプリ」について、以下の3つの権限を確認してください。

- 「レコード追加」権限
- 「アプリ管理」権限
- 「ファイル読み込み」権限

デフォルトではEveryoneに付与されています。

![アプリのアクセス権](/images/portal/not-display_app-access.png)

</div>

<div class="guide-step" data-step="3">

## JavaScriptカスタマイズの適用範囲を確認する

kintoneシステム管理 ＞ JavaScript / CSSでカスタマイズ ＞ 適用範囲 で「すべてのユーザーに適用」が選択されているか確認してください。

![JSカスタマイズ設定](/images/portal/not-display_js-customize.png)

</div>

<div class="guide-step" data-step="4">

## ソトバコポータルの適用範囲を確認する

ソトバコポータルの「ポータル基本情報」画面で、該当ユーザー・グループ・組織に対して権限が設定されているか確認してください。

![ソトバコポータル適用範囲](/images/portal/not-display_portal-range.png)

</div>

<div class="guide-step" data-step="5">

## タブの閲覧権限を確認する

ポータル編集画面で、タブの閲覧権限が正しく設定されているか確認してください。閲覧権限が設定されているタブは、権限のないユーザーには表示されません。

![タブの閲覧権限](/images/portal/not-display_tab-permission.png)

</div>

<div class="guide-step" data-step="6">

## ブラウザ・iOSのバージョンを確認する

古いバージョンのブラウザやiOSでは表示の不具合が発生することがあります。最新バージョンへのアップデートをお勧めします。

</div>

<div class="guide-info">
上記をすべて確認しても解決しない場合は、<a href="https://sotobaco.com/contact" target="_blank" rel="noopener noreferrer">お問い合わせ</a>ください。
</div>
