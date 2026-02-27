---
title: "標準ポータルの非表示"
slug: "hide-default-portal"
category: "edit"
order: 6
description: "kintone標準のポータルを非表示にして、ソトバコポータルのみを表示する方法をご案内します。"
---

kintone標準のポータルを組織・グループ・ユーザー単位で非表示にできます。

<div class="guide-step" data-step="1">

## ユーザー・グループ・組織用アプリを作成する

ポータル設定 ＞ アプリ設定 から「ユーザー・グループ・組織用アプリ」が作成されていることを確認します。未作成の場合は「作成する」ボタンで作成してください。

![アプリ設定](/images/portal/setup_app-settings.png)

</div>

<div class="guide-step" data-step="2">

## 最新のユーザー・グループ・組織情報を取得する

<div class="guide-substep" data-substep="2-1">

ポータル編集 ＞ 表示設定 ＞ kintone標準のポータル表示範囲 にある「kintoneアプリ」リンクをクリックして、ユーザー・グループ・組織用アプリを開きます。

![kintoneアプリリンク](/images/portal/tab_permission-kintone-app-link.png)

</div>

<div class="guide-substep" data-substep="2-2">

「最新の組織・グループ・ユーザー情報を取得する」ボタンをクリックして最新情報を取得します。

![最新情報を取得](/images/portal/tab_permission-get-users.png)

</div>

<div class="guide-info">
「全員に適用する」を選択する場合、この手順は不要です。「限定した組織・グループ・ユーザーで適用する」を選択する場合のみ実行してください。
</div>

</div>

<div class="guide-step" data-step="3">

## 表示範囲を設定する

「デフォルトのkintoneポータル表示範囲」で「限定した組織・グループ・ユーザーで適用する」を選択し、「組織選択」「グループ選択」「ユーザー選択」から、kintone標準ポータルを**表示したい**対象を選びます。チェックを入れた組織・グループ・ユーザーにはkintone標準ポータルが表示されます。

![デフォルトのkintoneポータル表示範囲](/images/portal/hide-default-portal_display-range.png)

<div class="guide-alert">
kintone標準ポータルを非表示にしたい組織・グループ・ユーザーのチェックを**外してください**。チェックを入れた対象にはkintone標準ポータルが表示されます。
</div>

例：「管理者」組織のユーザーに対してkintone標準ポータルを非表示にする場合は、組織選択で「管理者」のチェックを外して保存します。

<div class="guide-info">
対象の組織・グループ・ユーザーが一覧に表示されない場合は、ステップ2の情報取得を再度実行してください。
</div>

</div>

<div class="guide-step" data-step="4">

## ソトバコポータルをkintoneに反映する

ポータル編集画面下部の「ポータルを更新する」をクリックして、kintoneポータルに変更を反映します。

![ポータル更新](/images/portal/limit-user_update-portal.png)

</div>
