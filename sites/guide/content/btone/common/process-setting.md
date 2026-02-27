---
title: "プロセス管理設定"
slug: "process-setting"
category: "common"
order: 9
description: "Bカートから取得したステータスをkintoneのプロセス管理で活用する方法をご案内します。プロセス管理の有効化から確認までの手順を解説します。"
---

Bカートから取得したステータスをkintoneのプロセス管理のステータスとして設定する方法をご案内します。

<div class="guide-step" data-step="1">

## ソトバコのBtone設定画面を開く

Bカートから取得したステータス関連のデータを、kintoneのプロセス管理のステータスとして簡単に設定することができます。ソトバコにアクセスし、プロセス管理設定を有効にしたいアプリをクリックします。

![Btone設定画面](/images/btone/common-process-setting/01.png)

<div class="guide-info">
プロセス管理設定に対応しているアプリは出荷管理アプリのみとなります。
</div>

</div>

<div class="guide-step" data-step="2">

## プロセス管理のステータスとして設定するマッピング項目を削除する

マッピング設定から、プロセス管理のステータスとして設定するマッピング項目を削除します。既にマッピング設定に含めていない場合はこの操作は不要です。出荷管理アプリでは「発送状況」を削除してください。

![マッピング項目削除](/images/btone/common-process-setting/02.png)

</div>

<div class="guide-step" data-step="3">

## プロセス管理設定を有効にする

プロセス管理設定を有効にするチェックボックスにチェックを入れます。無効にする場合はチェックを外してください。

![プロセス管理有効化](/images/btone/common-process-setting/03.png)

</div>

<div class="guide-step" data-step="4">

## プロセス管理設定有効化時の注意事項を確認する

チェックを入れると、注意事項が表示されるので確認してください。

![注意事項](/images/btone/common-process-setting/04.png)

</div>

<div class="guide-step" data-step="5">

## 設定を保存する

画面下部の「設定を保存する」ボタンをクリックします。

![設定を保存する](/images/btone/common-process-setting/05.png)

</div>

<div class="guide-step" data-step="6">

## 保存完了

保存が完了すると、プロセス管理設定が有効化された旨のメッセージが表示されます。

![保存完了](/images/btone/common-process-setting/06.png)

</div>

<div class="guide-step" data-step="7">

## プロセス管理が有効化されたか確認する

kintoneの該当アプリの「アプリの設定＞プロセス管理」を開き、プロセス管理が有効化されているか確認します。『プロセス管理を有効にする』にチェックが入っていることを確認してください。

![プロセス管理確認](/images/btone/common-process-setting/07.png)

</div>

<div class="guide-step" data-step="8">

## 最新データを取得する

プロセス管理設定を有効化した後、Bカートから最新のデータを取得する必要があります。kintoneの該当アプリの一覧を開き、最新情報を取込むボタンを押下します。

![最新データ取得](/images/btone/common-process-setting/08.png)

</div>

<div class="guide-step" data-step="9">

## ステータスが更新されたか確認する

データの取り込みが完了したら、各レコードのステータスが更新されているか確認します。

![ステータス確認](/images/btone/common-process-setting/09.png)

<div class="guide-alert">
出荷管理アプリでプロセス管理を有効化すると、「未発送」「発送指示」「発送済」に合わせて「出荷キャンセル」という独自のステータスを作成します。「出荷キャンセル」はBカート上には存在しないステータスのため、出荷キャンセルとしてkintoneのレコードを保存しても、Bカート上の発送状況のステータスは変更されませんのでご注意ください。
</div>

</div>
