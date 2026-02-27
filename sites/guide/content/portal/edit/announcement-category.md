---
title: "アナウンスのカテゴリ"
slug: "announcement-category"
category: "edit"
order: 8
description: "全体アナウンス（お知らせ）にカテゴリを設定し、色分け・フィルタリングを行う方法をご案内します。"
---

全体アナウンスにカテゴリを設定すると、お知らせを色分け表示したりカテゴリでフィルタリングできるようになります。

<div class="guide-alert">
お知らせカテゴリ機能はスタンダードプラン以上で利用できます。
</div>

<div class="guide-step" data-step="1">

## 全体アナウンス用アプリを作成する

ポータル設定 ＞ アプリ設定 から「全体アナウンス用アプリ」が作成されていることを確認します。未作成の場合は「作成する」ボタンで作成してください。

![アプリ設定](/images/portal/announcement_create-app.png)

</div>

<div class="guide-step" data-step="2">

## カテゴリ用のドロップダウンフィールドを作成する

<div class="guide-substep" data-substep="2-1">

アプリ設定のアイコン、またはkintoneでアナウンスレコードを開くことで、全体アナウンス用アプリにアクセスします。

![kintoneアナウンスアプリ](/images/portal/kintone_announce-app-gear.png)

</div>

<div class="guide-substep" data-substep="2-2">

歯車アイコンからフォーム編集画面を開き、左メニューから「ドロップダウン」フィールドをドラッグ&ドロップします。

![フォーム編集](/images/portal/kintone_announce-form-add.png)

</div>

<div class="guide-substep" data-substep="2-3">

ドロップダウンの設定で、カテゴリ名を入力します。

![カテゴリ設定](/images/portal/kintone_announce-form-settings.png)

<div class="guide-alert">
フィールドコードは必ず「category」に設定してください。フィールドコードが異なる場合、カテゴリ機能が正しく動作しません。
</div>

</div>

<div class="guide-substep" data-substep="2-4">

「アプリを更新」をクリックして変更を保存します。

</div>

</div>

<div class="guide-step" data-step="3">

## アナウンスレコードにカテゴリを設定する

アナウンスレコードの編集画面で、作成したドロップダウンからカテゴリを選択して保存します。

![レコード一覧](/images/portal/kintone_announce-record-list.png)

</div>

<div class="guide-step" data-step="4">

## カテゴリ機能を有効にする

ポータル編集 ＞ 表示設定 ＞ 全体アナウンス で「表示」を選択し、カテゴリ設定で「カテゴリ機能を使用する」を選択します。

![カテゴリ有効化](/images/portal/announce_category-enable.png)

</div>

<div class="guide-step" data-step="5">

## カテゴリの色を設定する

<div class="guide-substep" data-substep="5-1">

「全体アナウンス用アプリからカテゴリ名をインポートする」をクリックします。

![カテゴリインポート](/images/portal/announce_category-import.png)

</div>

<div class="guide-substep" data-substep="5-2">

カテゴリの一覧が表示されます。各カテゴリに任意の色を設定してください。

![カテゴリ色設定](/images/portal/announce_category-color.png)

</div>

</div>

<div class="guide-step" data-step="6">

## ソトバコポータルをkintoneに反映する

ポータル編集画面下部の「ポータルを更新する」をクリックして、kintoneポータルに変更を反映します。

![ポータル更新](/images/portal/announce_update-portal.png)

</div>

カテゴリが設定されたアナウンスは、kintoneのポータル上でカテゴリ別のフィルタリングが可能になります。

![カテゴリ付きアナウンス一覧](/images/portal/announce_category-list.png)
