/**
 * Google Apps Script: support@sotobaco.co.jp の返信メールを検知して
 * Cloudflare Worker に転送し、AI回答案をSlackに通知する。
 *
 * === セットアップ手順 ===
 * 1. Google Apps Script (https://script.google.com/) で新規プロジェクトを作成
 * 2. このファイルの内容を貼り付ける
 * 3. WEBHOOK_URL と WEBHOOK_SECRET を設定する
 * 4. checkNewReplies を「時間主導型トリガー」で5分おきに実行するよう設定
 *    - 左メニュー「トリガー」→「トリガーを追加」
 *    - 関数: checkNewReplies
 *    - イベントのソース: 時間主導型
 *    - 時間ベースのトリガーのタイプ: 分ベースのタイマー
 *    - 間隔: 5分おき
 */

// ---------- 設定 ----------
var WEBHOOK_URL = "https://support-api.sotobaco.workers.dev/reply";
var WEBHOOK_SECRET = "ここにシークレットを設定"; // wrangler secret put REPLY_WEBHOOK_SECRET で設定した値と同じ
var PROCESSED_LABEL_NAME = "AI処理済み";
// --------------------------

/**
 * 新着返信メールをチェックしてWorkerに送信
 */
function checkNewReplies() {
  // 「AI処理済み」ラベルを取得（なければ作成）
  var label = GmailApp.getUserLabelByName(PROCESSED_LABEL_NAME);
  if (!label) {
    label = GmailApp.createLabel(PROCESSED_LABEL_NAME);
  }

  // 未読かつ「AI処理済み」ラベルがないメールを検索
  // 自社からの送信メール（noreply@sotobaco.com, support@sotobaco.co.jp）は除外
  var query =
    "in:inbox is:unread -label:" +
    PROCESSED_LABEL_NAME +
    " -from:noreply@sotobaco.com -from:support@sotobaco.co.jp";
  var threads = GmailApp.search(query, 0, 20);

  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();

    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      if (!message.isUnread()) continue;

      var from = message.getFrom();
      // 自社メールは念のためスキップ
      if (
        from.indexOf("noreply@sotobaco.com") !== -1 ||
        from.indexOf("support@sotobaco.co.jp") !== -1
      ) {
        continue;
      }

      var payload = {
        from: from,
        subject: message.getSubject(),
        body: message.getPlainBody(),
        date: message.getDate().toISOString(),
        secret: WEBHOOK_SECRET,
      };

      try {
        var response = UrlFetchApp.fetch(WEBHOOK_URL, {
          method: "post",
          contentType: "application/json",
          payload: JSON.stringify(payload),
          muteHttpExceptions: true,
        });

        var code = response.getResponseCode();
        if (code === 200) {
          Logger.log("送信成功: " + message.getSubject());
        } else {
          Logger.log(
            "送信失敗 (" + code + "): " + response.getContentText()
          );
        }
      } catch (e) {
        Logger.log("エラー: " + e.message);
      }
    }

    // スレッド単位で「AI処理済み」ラベルを付与
    threads[i].addLabel(label);
  }
}
