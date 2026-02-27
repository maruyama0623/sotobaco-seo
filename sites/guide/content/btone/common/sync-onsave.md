---
title: "レコード保存時の同期"
slug: "sync-onsave"
category: "common"
order: 3
description: "kintoneレコード毎にBカートに同期する方法をご案内します。レコード保存時の同期処理の流れと注意事項を解説します。"
---

kintoneレコード毎にBカートに同期する方法をご案内します。

<div class="guide-step" data-step="1">

## レコード詳細画面を開く

kintoneにログインし、アプリを開くとレコード一覧が表示されます。赤枠内のアイコンをクリックして、レコード詳細画面を開いてください。

![レコード詳細画面](/images/btone/common-sync-onsave/01.png)

</div>

<div class="guide-step" data-step="2">

## レコード編集画面を開く

赤枠内のアイコンをクリックして、レコード編集画面を開いてください。もしくは、レコード一覧画面から赤枠内の「編集アイコン」をクリックすることで、インラインでの編集モードにすることもできます。

<div class="guide-substep" data-substep="2-1">

![レコード編集画面](/images/btone/common-sync-onsave/02-01.png)

</div>

<div class="guide-substep" data-substep="2-2">

![インライン編集](/images/btone/common-sync-onsave/02-02.png)

</div>

</div>

<div class="guide-step" data-step="3">

## 『保存』ボタンをクリックする

必要であればレコードを編集し、「保存」ボタンをクリックしてください。インラインでの編集の場合も同じく必要であればレコードを編集し、「保存する」ボタンまたは「保存アイコン」をクリックしてください。

<div class="guide-substep" data-substep="3-1">

![保存ボタン](/images/btone/common-sync-onsave/03-01.png)

</div>

<div class="guide-substep" data-substep="3-2">

![インライン保存](/images/btone/common-sync-onsave/03-02.png)

</div>

</div>

<div class="guide-step" data-step="4">

## 同期が完了するのを待つ

同期が完了するまで、ブラウザを閉じないでください。ローディングの表示が消えるまでお待ちください。

![同期処理中](/images/btone/common-sync-onsave/04.png)

</div>

<div class="guide-step" data-step="5">

## 同期が完了する

同期が完了すると、画面上部に「更新しました」というメッセージが表示されます。Bカート画面を確認し、データが同期されていることをご確認ください。

![同期完了](/images/btone/common-sync-onsave/05.png)

<div class="guide-info">
「Bカート見積管理」ではレコード保存時のBカート同期は行われません。「Bカート受注管理」アプリでレコードを保存すると、その受注に関連する出荷情報も更新されます。「Bカート出荷管理」アプリでレコードを保存すると、その出荷に関連する受注情報も更新されます。
</div>

</div>
