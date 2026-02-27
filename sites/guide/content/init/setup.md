---
title: "kintone接続設定の方法"
slug: "setup"
category: "init"
order: 1
description: "ソトバコのサービスとkintoneを接続するための初期設定手順をご案内します。OAuthクライアントの作成からkintone連携完了までの流れを解説します。"
---

ソトバコのサービスを利用するには、kintoneとの接続設定が必要です。以下の手順に沿って設定してください。

<div class="guide-step" data-step="1">

## 「cybozu.com共通管理画面へ」ボタンをクリックする

ソトバコにログインし、初期設定メニューから「cybozu.com共通管理画面へ」ボタンをクリックします。

![cybozu.com共通管理画面へ](/images/init%3Asetup/01.png)

<div class="guide-alert">
cybozu.com共通管理画面にログインできる管理者アカウントが必要です。kintoneのログイン画面が表示された場合は、管理者アカウントでログインしてください。
</div>

</div>

<div class="guide-step" data-step="2">

## 「OAuthクライアントの追加」ボタンをクリックする

cybozu.com共通管理画面で「OAuthクライアントの追加」ボタンをクリックします。

![OAuthクライアントの追加](/images/init%3Asetup/02.png)

</div>

<div class="guide-step" data-step="3">

## クライアント名とリダイレクトエンドポイントをコピーする

ソトバコの画面に戻り、表示されているクライアント名とリダイレクトエンドポイントをコピーします。コピーアイコンをクリックするとクリップボードにコピーされます。

![コピー](/images/init%3Asetup/03.png)

</div>

<div class="guide-step" data-step="4">

## cybozu.comに貼り付けて保存する

cybozu.com共通管理画面に戻り、コピーしたクライアント名とリダイレクトエンドポイントをそれぞれの入力欄に貼り付けて「保存」をクリックします。

![貼り付けて保存](/images/init%3Asetup/04.png)

</div>

<div class="guide-step" data-step="5">

## 「利用者の設定」をクリックする

「ソトバコ」の項目にある「利用者の設定」をクリックします。

![利用者の設定](/images/init%3Asetup/05.png)

</div>

<div class="guide-step" data-step="6">

## ユーザーを選択して保存する

画面右上に表示されているユーザー名を確認し、該当するユーザーにチェックを入れて保存します。

![ユーザー選択](/images/init%3Asetup/06.png)

</div>

<div class="guide-step" data-step="7">

## えんぴつマークをクリックする

「ソトバコ」の項目にあるえんぴつマークをクリックします。

![えんぴつマーク](/images/init%3Asetup/07.png)

</div>

<div class="guide-step" data-step="8">

## クライアントIDとクライアントシークレットをコピーする

表示されるクライアントIDとクライアントシークレットをコピーします。

![クライアントID・シークレット](/images/init%3Asetup/08.png)

<div class="guide-alert">
クライアントシークレットは第三者に漏らさないように取扱いにご注意ください。
</div>

</div>

<div class="guide-step" data-step="9">

## ソトバコに貼り付ける

ソトバコの画面に戻り、コピーしたクライアントIDとクライアントシークレットをそれぞれの入力欄に貼り付けます。

![貼り付け](/images/init%3Asetup/09.png)

</div>

<div class="guide-step" data-step="10">

## 「登録する」ボタンをクリックする

「登録する」ボタンをクリックします。

![登録する](/images/init%3Asetup/10.png)

</div>

<div class="guide-step" data-step="11">

## 「許可する」をクリックする

画面が遷移するので、「許可する」をクリックします。

![許可する](/images/init%3Asetup/11.png)

</div>

<div class="guide-step" data-step="12">

## 接続設定完了

kintoneとソトバコの接続設定が完了しました。ホーム画面に戻って操作を開始できます。

![接続設定完了](/images/init%3Asetup/12.png)

</div>

<div class="guide-alert">
kintoneでIPアドレス制限を設定している場合は、ソトバコのIPアドレスを許可リストに追加する必要があります。詳しくは<a href="https://sotobaco.com/news/2025-03-04_ip-restriction/" target="_blank" rel="noopener noreferrer">こちら</a>をご確認ください。
</div>
