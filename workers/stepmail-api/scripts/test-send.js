#!/usr/bin/env node
"use strict";

/**
 * テスト送信スクリプト: 指定ステップのメールを即時送信
 *
 * 使い方:
 *   SENDGRID_API_KEY=<key> node scripts/test-send.js --email test@example.com --step 1
 *   SENDGRID_API_KEY=<key> node scripts/test-send.js --email test@example.com --all
 */

const fs = require("fs");
const path = require("path");

const IDS_FILE = path.join(__dirname, "template-ids.json");

const SUBJECTS = {
  1: "初期設定が完了しました｜最初のポータルを作ってみましょう",
  2: "部署ごとに「見せるアプリ」を変えられます",
  3: "ポータルをもっと便利に｜グラフ表示・通知一覧・アプリカードの活用法",
  4: "全社展開の準備はできていますか？",
  5: "フリープランの4タブ、足りていますか？",
  6: "ソトバコポータルの活用、お手伝いできることはありますか？",
};

const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  console.error("[error] SENDGRID_API_KEY が設定されていません");
  process.exit(1);
}

if (!fs.existsSync(IDS_FILE)) {
  console.error("[error] template-ids.json が見つかりません。先に npm run templates:sync を実行してください");
  process.exit(1);
}

const templateIds = JSON.parse(fs.readFileSync(IDS_FILE, "utf8"));

const args = process.argv.slice(2);
let email = null;
let step = null;
let sendAll = false;
let companyName = "テスト株式会社";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--email" && args[i + 1]) { email = args[++i]; }
  if (args[i] === "--step" && args[i + 1]) { step = Number(args[++i]); }
  if (args[i] === "--all") { sendAll = true; }
  if (args[i] === "--company" && args[i + 1]) { companyName = args[++i]; }
}

if (!email) {
  console.error("使い方: node scripts/test-send.js --email <送信先> --step <1-6>");
  console.error("        node scripts/test-send.js --email <送信先> --all");
  process.exit(1);
}

if (!sendAll && (!step || step < 1 || step > 6)) {
  console.error("[error] --step は 1〜6 を指定、または --all で全通送信");
  process.exit(1);
}

async function sendStep(stepNum) {
  const templateId = templateIds[`step${stepNum}`];
  if (!templateId) {
    console.error(`  Step ${stepNum}: テンプレートIDが未設定`);
    return false;
  }

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email }],
          dynamic_template_data: {
            companyName,
            unsubscribeUrl: "https://example.com/unsubscribe?test=true",
          },
        },
      ],
      from: {
        email: "noreply@sotobaco.com",
        name: "ソトバコポータル",
      },
      template_id: templateId,
      tracking_settings: {
        click_tracking: { enable: false },
      },
    }),
  });

  if (res.ok || res.status === 202) {
    console.log(`  Step ${stepNum}: 送信OK (${SUBJECTS[stepNum]})`);
    return true;
  } else {
    const text = await res.text();
    console.error(`  Step ${stepNum}: エラー ${res.status} - ${text}`);
    return false;
  }
}

async function main() {
  const steps = sendAll ? [1, 2, 3, 4, 5, 6] : [step];
  console.log(`\n  送信先: ${email}`);
  console.log(`  会社名: ${companyName}\n`);

  let ok = 0;
  for (const s of steps) {
    if (await sendStep(s)) ok++;
  }
  console.log(`\n  完了: ${ok}/${steps.length}件送信\n`);
}

main().catch((err) => {
  console.error("[error]", err.message);
  process.exit(1);
});
