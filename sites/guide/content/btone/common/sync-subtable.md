---
title: "サブテーブル連携設定"
slug: "sync-subtable"
category: "common"
order: 4
description: "サブテーブル連携項目の設定方法をご案内します。同期設定・取り込み先テーブルの指定・マッピング・入力補助スペースの設定を解説します。"
---

サブテーブル連携項目の設定方法をご案内します。

<div class="guide-step" data-step="1">

## ソトバコのBtone設定画面を開く

ソトバコにアクセスし、サブテーブル連携項目の設定をしたいアプリをクリックします。本ページでは例として、「商品基本情報連携」の「商品表示グループ」を設定していますが、他アプリの他項目でも同様の操作となります。

設定できるアプリと項目は以下のとおりです。

**商品基本情報連携**：商品表示グループ、例外的に表示する会員

**商品セット情報連携**：商品セット表示グループ、例外的に表示する会員、価格グループ別価格、特別価格、別品番在庫参照

**受注情報連携**：受注商品

**出荷情報連携**：出荷商品

**見積情報連携**：見積商品

![Btone設定画面](/images/btone/common-sync-subtable/01.png)

</div>

<div class="guide-step" data-step="2">

## 『設定を同期する』にチェックを入れる

『設定を同期する』にチェックを入れると、該当の項目がBカートからkintoneへ同期されるようになります。

![設定を同期する](/images/btone/common-sync-subtable/02.png)

<div class="guide-info">
チェックボックスがないものもあります。その場合は自動的に同期されます。チェックを外しても、それまでに同期したデータは消えません。
</div>

</div>

<div class="guide-step" data-step="3">

## 取り込み先テーブルを指定する

Bカートのデータの取り込み先となるkintoneのサブテーブルを指定してください。

基本的には、アプリにデフォルトで存在する、項目名と同じ名前のサブテーブルを指定してください。例えば、「商品基本情報連携」の「商品表示グループ」であれば、「商品表示グループ (product_visible_view_group)」を選択してください。

![取り込み先テーブル](/images/btone/common-sync-subtable/03.png)

<div class="guide-info">
アプリにデフォルトで存在するサブテーブル以外を指定したい場合、Bカートの項目に対応するフィールドをサブテーブル内に用意してください。例えば、Bカートの項目が「会員ID」「会員名」「価格」の3つの場合「会員ID」「会員名」を取り込む「文字列（１行）」フィールドを2つと「価格」を取り込む「数値」フィールドを1つ用意してください。
</div>

</div>

<div class="guide-step" data-step="4">

## マッピングを設定する

サブテーブルのマッピングを設定してください。マッピングについて詳しく知りたい方は、マッピング設定の操作ガイドをご覧ください。

![マッピング設定](/images/btone/common-sync-subtable/04.png)

</div>

<div class="guide-step" data-step="5">

## 入力補助を表示するスペースを指定する

入力補助を表示するkintoneのスペースフィールドを指定してください。kintoneアプリのフォーム設定でお好きな場所にスペースフィールドを設定していただくことで、お好きな場所に入力補助を表示いただけます。

<div class="guide-substep" data-substep="5-1">

![入力補助スペース](/images/btone/common-sync-subtable/05-01.png)

</div>

<div class="guide-substep" data-substep="5-2">

![入力補助スペース](/images/btone/common-sync-subtable/05-02.png)

</div>

<div class="guide-info">
入力補助がないものに関しては、スペースを指定するフィールドは表示されません。入力補助について詳しく知りたい方は、各アプリの操作ガイド「kintone入力補助・kintone表示カスタマイズ」をご覧ください。
</div>

</div>

<div class="guide-step" data-step="6">

## 『設定を保存する』ボタンをクリックする

画面下にある「設定を保存する」ボタンをクリックしてください。

![設定を保存する](/images/btone/common-sync-subtable/06.png)

</div>
