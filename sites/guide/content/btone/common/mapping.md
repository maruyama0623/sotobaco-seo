---
title: "マッピング設定"
slug: "mapping"
category: "common"
order: 1
description: "BtoneのBカート・kintone間のマッピング設定方法をご案内します。フィールドの対応付け・同期方向・項目の増減・保存方法を解説します。"
---

Bカート・kintone間のマッピング設定方法をご案内します。

<div class="guide-step" data-step="1">

## ソトバコのBtone設定画面を開く

ソトバコにアクセスし、マッピング設定を変更したいアプリをクリックします。本ページでは例として「商品基本連携」を選択していますが、他アプリでも同様の操作となります。

![Btone設定画面](/images/btone/common-mapping/01.png)

</div>

<div class="guide-step" data-step="2">

## マッピング設定について

Bカート・kintoneそれぞれのフィールドを選択することで、連携時のマッピングを設定できます。この設定に従って、Bカートからのデータ取込、kintoneレコードのBカート一括同期、および個別同期機能が使用可能になります。

![マッピング設定](/images/btone/common-mapping/02.png)

</div>

<div class="guide-step" data-step="3">

## マッピング設定の選択肢について

Bカート側フィールド選択により、kintone側選択肢は自動絞込されます。テーブル内フィールドは「[テーブル名] - フィールド名」と表示されます。

![マッピング選択肢](/images/btone/common-mapping/03.png)

<div class="guide-alert">
フィールド名は重複選択不可です。重複した場合は保存時にエラーとなります。
</div>

</div>

<div class="guide-step" data-step="4">

## マッピング設定の矢印について

三種類の矢印があります。右向き（→）はBカート→kintoneのみ、左向き（←）はkintone→Bカートのみ、両方（↔）は双方向です。

![同期方向の矢印](/images/btone/common-mapping/04.png)

<div class="guide-info">
受注・出荷連携の一部フィールドは右向き固定です。商品基本連携等は双方向固定です。
</div>

</div>

<div class="guide-step" data-step="5">

## マッピング設定項目の増減について

「取り込み項目を追加する」でマッピング項目を増加、×ボタンで削除が可能です。

![項目の増減](/images/btone/common-mapping/05.png)

<div class="guide-alert">
空欄では保存できません。
</div>

</div>

<div class="guide-step" data-step="6">

## 『設定を保存する』ボタンをクリック

画面下のボタンをクリックして設定を保存します。

![設定を保存する](/images/btone/common-mapping/06.png)

</div>
