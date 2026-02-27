---
title: "利用者の制限"
slug: "limit-user"
category: "edit"
order: 5
description: "ソトバコポータルを適用するユーザーを組織・グループ・ユーザー単位で制限する方法をご案内します。"
---

ソトバコポータルを特定のユーザーにのみ適用することができます。

<div class="guide-step" data-step="1">

## ユーザー・グループ・組織用アプリを作成する

ポータル設定 ＞ アプリ設定 から「ユーザー・グループ・組織用アプリ」が作成されていることを確認します。未作成の場合は「作成する」ボタンで作成してください。

![アプリ設定](/images/portal/setup_app-settings.png)

</div>

<div class="guide-step" data-step="2">

## 最新のユーザー・グループ・組織情報を取得する

<div class="guide-substep" data-substep="2-1">

ポータル編集 ＞ 表示設定 ＞ ソトバコポータルの適用範囲 にある「kintoneアプリ」リンクをクリックして、ユーザー・グループ・組織用アプリを開きます。

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

## 適用範囲を設定する

<div class="guide-substep" data-substep="3-1">

ポータル編集画面上部の「表示設定」をクリックして、表示設定画面を開きます。

![表示設定](/images/portal/limit-user_display-settings.png)

</div>

<div class="guide-substep" data-substep="3-2">

「ソトバコポータル適用範囲」で「限定した組織・グループ・ユーザーで適用する」を選択し、「組織選択」「グループ選択」「ユーザー選択」から対象を選びます。モーダルで対象の組織・グループ・ユーザーにチェックを入れて「保存する」をクリックします。

![適用範囲の設定](/images/portal/limit-user_apply-range.png)

</div>

<div class="guide-info">
対象の組織・グループ・ユーザーが一覧に表示されない場合は、ステップ2の情報取得を再度実行してください。
</div>

</div>

<div class="guide-step" data-step="4">

## ソトバコポータルをkintoneに反映する

ポータル編集画面下部の「ポータルを更新する」をクリックして、kintoneポータルに変更を反映します。

![ポータル更新](/images/portal/limit-user_update-portal.png)

</div>
