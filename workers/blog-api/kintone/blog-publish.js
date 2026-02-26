(function () {
  "use strict";

  // ---- 設定 ----
  var BLOG_API_URL = "https://blog-api.sotobaco.workers.dev";
  var WEBHOOK_SECRET = "bc0c965b6f3f77f8a9db143dc104197fe3687d6069a65992d496362f55d70827";

  // ---- HMAC-SHA256 署名生成 ----
  function generateSignature(timestamp, body) {
    var encoder = new TextEncoder();
    var data = timestamp + ":" + body;
    return crypto.subtle
      .importKey(
        "raw",
        encoder.encode(WEBHOOK_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      )
      .then(function (key) {
        return crypto.subtle.sign("HMAC", key, encoder.encode(data));
      })
      .then(function (sig) {
        return Array.from(new Uint8Array(sig))
          .map(function (b) {
            return b.toString(16).padStart(2, "0");
          })
          .join("");
      });
  }

  // ---- API呼び出し ----
  function callBlogApi(endpoint, payload) {
    var body = JSON.stringify(payload);
    var timestamp = Math.floor(Date.now() / 1000).toString();

    return generateSignature(timestamp, body).then(function (signature) {
      return fetch(BLOG_API_URL + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Signature-Timestamp": timestamp,
          "X-Signature": signature,
        },
        body: body,
      });
    });
  }

  // ---- 詳細画面にボタン追加 ----
  kintone.events.on("app.record.detail.show", function (event) {
    var record = event.record;
    var status = record.status.value;
    var slug = record.slug.value;
    var filename = record.filename.value;
    var recordId = record.$id.value;

    // ヘッダー領域にボタンを配置
    var headerSpace = kintone.app.record.getHeaderMenuSpaceElement();
    if (!headerSpace) return event;

    // 既存のボタンを削除（画面再描画対策）
    var existingBtn = document.getElementById("blog-publish-btn");
    if (existingBtn) existingBtn.remove();

    var BTN_STYLE = "margin: 16px 0 0 16px;";

    if (status === "ステージング") {
      var publishBtn = new Kuc.Button({
        text: "本番公開",
        type: "submit",
        id: "blog-publish-btn",
      });

      publishBtn.style.cssText = BTN_STYLE;

      publishBtn.addEventListener("click", function () {
        if (!confirm("この記事を本番公開しますか？\n\n" + record.title.value)) {
          return;
        }
        publishBtn.text = "公開処理中...";
        publishBtn.disabled = true;

        callBlogApi("/publish", {
          slug: slug,
          recordId: recordId,
          filename: filename,
        })
          .then(function (res) {
            if (res.ok) {
              alert("本番公開が完了しました。");
              location.reload();
            } else {
              return res.json().then(function (data) {
                alert("エラー: " + (data.error || "公開に失敗しました"));
                publishBtn.text = "本番公開";
                publishBtn.disabled = false;
              });
            }
          })
          .catch(function (err) {
            alert("通信エラーが発生しました: " + err.message);
            publishBtn.text = "本番公開";
            publishBtn.disabled = false;
          });
      });

      headerSpace.appendChild(publishBtn);
    } else if (status === "公開済み") {
      var unpublishBtn = new Kuc.Button({
        text: "非公開に戻す",
        type: "alert",
        id: "blog-publish-btn",
      });

      unpublishBtn.style.cssText = BTN_STYLE;

      unpublishBtn.addEventListener("click", function () {
        if (
          !confirm(
            "この記事を非公開に戻しますか？\n本番サイトから記事が削除されます。\n\n" +
              record.title.value
          )
        ) {
          return;
        }
        unpublishBtn.text = "非公開処理中...";
        unpublishBtn.disabled = true;

        callBlogApi("/unpublish", {
          slug: slug,
          recordId: recordId,
          filename: filename,
        })
          .then(function (res) {
            if (res.ok) {
              alert("非公開処理が完了しました。");
              location.reload();
            } else {
              return res.json().then(function (data) {
                alert("エラー: " + (data.error || "非公開処理に失敗しました"));
                unpublishBtn.text = "非公開に戻す";
                unpublishBtn.disabled = false;
              });
            }
          })
          .catch(function (err) {
            alert("通信エラーが発生しました: " + err.message);
            unpublishBtn.text = "非公開に戻す";
            unpublishBtn.disabled = false;
          });
      });

      headerSpace.appendChild(unpublishBtn);
    }

    return event;
  });
})();
