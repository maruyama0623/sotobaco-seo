---
title: "入力補助・表示カスタマイズ"
slug: "assistance-customize"
category: "customer"
order: 1
description: "会員管理アプリのkintone入力補助・kintone表示カスタマイズ機能をご案内します。必須バリデーション・同期方向による編集制限・初期パスワード編集制限・電話番号形式バリデーション・設立年月形式バリデーションを解説します。"
---

会員管理アプリでは、kintone入力補助・kintone表示カスタマイズ機能を使って、データの入力ミスや誤編集を防止できます。

<div class="guide-step" data-step="1">

## 新規登録時の必須バリデーション（kintone入力補助）

<div class="guide-substep" data-substep="1-1">

レコード新規作成時、Btoneマッピング設定で対応しているkintoneフィールドが空のまま「保存」ボタンを押した場合、エラーを表示します。

対応フィールド：担当者姓、郵便番号、都道府県、市区町村、町域・番地、メールアドレス、初期パスワード

![必須バリデーション](/images/btone/customer-assistance-customize/01-01.png)

</div>

<div class="guide-substep" data-substep="1-2">

どのフィールドに不備があるのか、画面上部とフィールド下部にエラーが表示され、視覚的にわかりやすくなっています。

![バリデーションエラー表示](/images/btone/customer-assistance-customize/01-02.png)

<div class="guide-info">
初期パスワードはkintoneから新規登録する時にのみ入力するフィールドです。
</div>

</div>

</div>

<div class="guide-step" data-step="2">

## 同期の向きがkintoneの場合に編集を無効にする（kintone入力補助）

<div class="guide-substep" data-substep="2-1">

連携の向きが右向き（Bカートからkintoneへのデータ取得を許可）の場合、該当項目の編集が無効化されます。

![同期方向の設定](/images/btone/customer-assistance-customize/02-01.png)

</div>

<div class="guide-substep" data-substep="2-2">

誤って編集してしまうことを防止し、Bカートのデータを正として保護します。

![編集無効化](/images/btone/customer-assistance-customize/02-02.png)

</div>

</div>

<div class="guide-step" data-step="3">

## 初期パスワードの編集を無効にする（kintone入力補助）

<div class="guide-substep" data-substep="3-1">

初期パスワードは新規作成時にのみ入力するフィールドなので、誤って編集してしまわないために編集が無効化されます。

![初期パスワード設定](/images/btone/customer-assistance-customize/03-01.png)

</div>

<div class="guide-substep" data-substep="3-2">

既存レコードの編集画面では、初期パスワードフィールドが自動的にグレーアウトされます。

![初期パスワード編集無効](/images/btone/customer-assistance-customize/03-02.png)

</div>

</div>

<div class="guide-step" data-step="4">

## 電話番号の形式バリデーション（kintone入力補助）

<div class="guide-substep" data-substep="4-1">

ハイフン込みの電話番号形式のみ受け付けます。形式に合わない場合、画面上部とフィールド下部にエラーを表示します。

![電話番号バリデーション](/images/btone/customer-assistance-customize/04-01.png)

</div>

<div class="guide-substep" data-substep="4-2">

正しい形式で入力し直すことで、エラーが解消されます。

![電話番号エラー表示](/images/btone/customer-assistance-customize/04-02.png)

<div class="guide-info">
ハイフン込みの電話番号形式で入力してください。
</div>

</div>

</div>

<div class="guide-step" data-step="5">

## 設立年月の形式バリデーション（kintone入力補助）

<div class="guide-substep" data-substep="5-1">

「Y-m」「Y」「Y-n」のいずれかの形式での入力が必須です。形式に合わない場合、エラーを表示します。

![設立年月バリデーション](/images/btone/customer-assistance-customize/05-01.png)

</div>

<div class="guide-substep" data-substep="5-2">

正しい形式で入力し直すことで、エラーが解消されます。

![設立年月エラー表示](/images/btone/customer-assistance-customize/05-02.png)

<div class="guide-info">
「Y-m」「Y」「Y-n」のうちいずれかの形式で入力してください。
</div>

</div>

</div>
