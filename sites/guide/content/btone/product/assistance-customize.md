---
title: "入力補助・表示カスタマイズ"
slug: "assistance-customize"
category: "product"
order: 1
description: "商品基本管理アプリのkintone入力補助・kintone表示カスタマイズ機能をご案内します。表示フラグ・商品表示グループ・例外表示会員・カテゴリ・商品画像URL・特集の入力補助を解説します。"
---

商品基本管理アプリでは、kintone入力補助・kintone表示カスタマイズ機能を使って、Bカートのデータをkintoneの入力フォームで効率的に管理できます。

<div class="guide-step" data-step="1">

## 表示フラグが非表示の場合（kintone表示カスタマイズ）

「表示フラグ」が「非表示」になっているレコードは灰色に塗りつぶされ、非表示であることがわかりやすくなっています。

![表示フラグ非表示](/images/btone/product-assistance-customize/01.png)

</div>

<div class="guide-step" data-step="2">

## 商品表示グループ（kintone入力補助）

マッピング設定画面の「商品表示グループの入力補助を表示するスペース」で選択したスペースに対して、商品表示グループの入力補助が表示されます。商品表示を行いたいグループにチェックを入れる形式で入力が行えます。

![商品表示グループ](/images/btone/product-assistance-customize/02.png)

<div class="guide-alert">
Bカート管理画面では「非表示にしたい商品グループ」を選択しますが、Btoneでは「表示したい商品グループ」にチェックを入れます。ご注意ください。
</div>

<div class="guide-info">
この入力補助で表示される商品表示グループの一覧は、Bカートから最新の情報を取得して表示されます。チェックを入れた商品表示グループのみがサブテーブルのレコードとして保存されます。
</div>

</div>

<div class="guide-step" data-step="3">

## 例外的に表示させる会員（kintone入力補助）

マッピング設定画面の「例外的に表示する会員の入力補助を表示するスペース」で選択したスペースに対して、例外的に表示する会員の入力補助が表示されます。「会員選択」のボタンを押下すると、会員の一覧が表示され、例外的に表示を行いたい会員にチェックを入れる形式で入力が行えます。

![例外表示会員](/images/btone/product-assistance-customize/03.png)

<div class="guide-info">
この入力補助で表示される例外的に表示させる会員の一覧は、Bカートから最新の情報を取得して表示されます。チェックを入れた例外的に表示させる会員のみがサブテーブルのレコードとして保存されます。
</div>

</div>

<div class="guide-step" data-step="4">

## メインカテゴリ・サブカテゴリ（kintone入力補助）

マッピング設定項目にて設定した、Bカートの「メインカテゴリ」と「サブカテゴリ」に対応するkintoneフィールドに「入力補助ボタン」が表示されます。このボタンをクリックすると、Bカートに登録済みのカテゴリ一覧がモーダルで表示されます。任意の項目を選択し、「選択」ボタンをクリックすることで、入力欄へ自動で入力されます。

![カテゴリ入力補助](/images/btone/product-assistance-customize/04.png)

<div class="guide-alert">
入力欄には自由入力も可能ですが、本機能で自動入力された形式でない場合は同期エラーとなります。
</div>

<div class="guide-info">
【】内の数字はカテゴリIDを表しています。
</div>

</div>

<div class="guide-step" data-step="5">

## 商品画像URL（kintone入力補助）

マッピング設定項目にて設定した、Bカートの「商品画像URL」と「サブ画像1〜6（画像URL）」に対応するkintoneフィールドに「アップロードボタン」が表示されます。

<div class="guide-substep" data-substep="5-1">

「アップロードボタン」をクリックすると、Bカート管理画面上にある「ファイルマネージャ画面」が開かれます。

![アップロードボタン](/images/btone/product-assistance-customize/05.png)

<div class="guide-info">
未ログインの場合は、先にBカートへのログイン画面が表示されます。ログイン後にファイルマネージャー画面が開きます。
</div>

</div>

<div class="guide-substep" data-substep="5-2">

ファイルマネージャ画面で任意の画像をアップロード、もしくはアップロード済のファイルをクリックすることで、画像URLがコピーできます。

![ファイルマネージャ](/images/btone/product-assistance-customize/06.png)

</div>

<div class="guide-substep" data-substep="5-3">

コピーした画像URLをkintoneのフィールドに入力することで、画像を設定することができます。

![画像URL入力](/images/btone/product-assistance-customize/07.png)

</div>

</div>

<div class="guide-step" data-step="6">

## 特集1・特集2・特集3（kintone入力補助）

マッピング設定項目にて設定した、Bカートの「特集1〜3」に対応するkintoneフィールドに「入力補助ボタン」が表示されます。このボタンをクリックすると、Bカートに登録済みの特集一覧がモーダルで表示されます。任意の項目を選択し、「選択」ボタンをクリックすることで、入力欄へ自動で入力されます。

![特集入力補助](/images/btone/product-assistance-customize/08.png)

<div class="guide-alert">
入力欄には自由入力も可能ですが、本機能で自動入力された形式でない場合は同期エラーとなります。
</div>

<div class="guide-info">
【】内の数字は特集IDを表しています。
</div>

</div>
