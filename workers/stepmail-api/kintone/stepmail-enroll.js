(function () {
  "use strict";

  // ---- 設定 ----
  var STEPMAIL_API_URL = "https://stepmail-api.sotobaco.workers.dev";
  var WEBHOOK_SECRET = "19918d8c8ed36fa2bf830ba620bb210d844635c2861d6a9800f3ebb92af0bd07";

  // ---- フィールドコード（App 86: ソトバコポータル契約管理） ----
  var FIELD_EMAIL = "associate_mail";
  var FIELD_COMPANY = "cliemt_name";

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
  function callStepmailApi(endpoint, payload) {
    var body = JSON.stringify(payload);
    var timestamp = Math.floor(Date.now() / 1000).toString();

    return generateSignature(timestamp, body).then(function (signature) {
      return fetch(STEPMAIL_API_URL + endpoint, {
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
    var email = record[FIELD_EMAIL].value;
    var company = record[FIELD_COMPANY].value;

    if (!email) return event;

    // ヘッダー領域にボタンを配置
    var headerSpace = kintone.app.record.getHeaderMenuSpaceElement();
    if (!headerSpace) return event;

    // 既存のボタンを削除（画面再描画対策）
    var existingBtn = document.getElementById("stepmail-enroll-btn");
    if (existingBtn) existingBtn.remove();

    var enrollBtn = new Kuc.Button({
      text: "ステップメール登録",
      type: "submit",
      id: "stepmail-enroll-btn",
    });

    enrollBtn.style.cssText = "margin: 16px 0 0 16px;";

    enrollBtn.addEventListener("click", function () {
      if (
        !confirm(
          "このユーザーにステップメールを配信開始しますか？\n\n" +
            "会社名: " + company + "\n" +
            "メール: " + email
        )
      ) {
        return;
      }
      enrollBtn.text = "登録処理中...";
      enrollBtn.disabled = true;

      callStepmailApi("/enroll", {
        email: email,
        companyName: company,
      })
        .then(function (res) {
          if (res.ok) {
            alert(
              "ステップメール登録が完了しました。\n第1通目を送信しました。"
            );
            enrollBtn.text = "登録済み";
          } else {
            return res.json().then(function (data) {
              if (data.error === "Already enrolled") {
                alert("このユーザーは既に登録済みです。");
                enrollBtn.text = "登録済み";
              } else {
                alert("エラー: " + (data.error || "登録に失敗しました"));
                enrollBtn.text = "ステップメール登録";
                enrollBtn.disabled = false;
              }
            });
          }
        })
        .catch(function (err) {
          alert("通信エラーが発生しました: " + err.message);
          enrollBtn.text = "ステップメール登録";
          enrollBtn.disabled = false;
        });
    });

    headerSpace.appendChild(enrollBtn);

    return event;
  });
})();
