#!/usr/bin/env node
"use strict";

/**
 * SendGrid Dynamic Templates 同期スクリプト
 *
 * 使い方:
 *   node scripts/sync-templates.js          # 全テンプレートを作成 or 更新
 *   node scripts/sync-templates.js --status  # 現在のテンプレート状態を表示
 *
 * 環境変数:
 *   SENDGRID_API_KEY — SendGrid APIキー（必須）
 *
 * テンプレートIDの管理:
 *   初回実行時にSendGridにテンプレートを作成し、IDを scripts/template-ids.json に保存。
 *   2回目以降は既存テンプレートを更新。
 */

const fs = require("fs");
const path = require("path");

const API_BASE = "https://api.sendgrid.com/v3";
const TEMPLATES_DIR = path.join(__dirname, "..", "templates");
const IDS_FILE = path.join(__dirname, "template-ids.json");

const STEPS = [
  {
    step: 1,
    name: "Step 1 - 初期設定完了",
    subject: "初期設定が完了しました｜最初のポータルを作ってみましょう",
    file: "step1.html",
  },
  {
    step: 2,
    name: "Step 2 - 閲覧権限",
    subject: "部署ごとに「見せるアプリ」を変えられます",
    file: "step2.html",
  },
  {
    step: 3,
    name: "Step 3 - 機能活用",
    subject: "ポータルをもっと便利に｜グラフ表示・通知一覧・アプリカードの活用法",
    file: "step3.html",
  },
  {
    step: 4,
    name: "Step 4 - 全社展開",
    subject: "全社展開の準備はできていますか？",
    file: "step4.html",
  },
  {
    step: 5,
    name: "Step 5 - プラン比較",
    subject: "フリープランの4タブ、足りていますか？",
    file: "step5.html",
  },
  {
    step: 6,
    name: "Step 6 - 最終CTA",
    subject: "ソトバコポータルの活用、お手伝いできることはありますか？",
    file: "step6.html",
  },
];

const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  console.error("[error] SENDGRID_API_KEY が設定されていません");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
};

async function apiRequest(method, endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SendGrid API error ${res.status}: ${text}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

/** テンプレートを新規作成 */
async function createTemplate(name) {
  const data = await apiRequest("POST", "/templates", {
    name,
    generation: "dynamic",
  });
  return data.id;
}

/** テンプレートにバージョン（HTML + 件名）を追加 */
async function createVersion(templateId, name, subject, htmlContent) {
  await apiRequest("POST", `/templates/${templateId}/versions`, {
    name,
    subject,
    html_content: htmlContent,
    active: 1,
    editor: "code",
  });
}

/** 既存バージョンを更新 */
async function updateVersion(templateId, versionId, name, subject, htmlContent) {
  await apiRequest("PATCH", `/templates/${templateId}/versions/${versionId}`, {
    name,
    subject,
    html_content: htmlContent,
    active: 1,
  });
}

/** テンプレートの詳細（バージョン含む）を取得 */
async function getTemplate(templateId) {
  return apiRequest("GET", `/templates/${templateId}`);
}

/** IDファイルを読み込み */
function loadIds() {
  if (fs.existsSync(IDS_FILE)) {
    return JSON.parse(fs.readFileSync(IDS_FILE, "utf8"));
  }
  return {};
}

/** IDファイルに保存 */
function saveIds(ids) {
  fs.writeFileSync(IDS_FILE, JSON.stringify(ids, null, 2) + "\n", "utf8");
}

/** ステータス表示 */
async function showStatus() {
  const ids = loadIds();
  console.log("\n  SendGrid Dynamic Templates ステータス\n");

  for (const step of STEPS) {
    const templateId = ids[`step${step.step}`];
    if (!templateId) {
      console.log(`  Step ${step.step}: 未作成`);
      continue;
    }

    try {
      const tmpl = await getTemplate(templateId);
      const activeVersion = tmpl.versions?.find((v) => v.active === 1);
      console.log(
        `  Step ${step.step}: ${templateId} (${activeVersion ? "active" : "no active version"})`
      );
    } catch {
      console.log(`  Step ${step.step}: ${templateId} (取得エラー)`);
    }
  }
  console.log("");
}

/** メイン: テンプレート同期 */
async function syncTemplates() {
  const ids = loadIds();
  let created = 0;
  let updated = 0;

  for (const step of STEPS) {
    const key = `step${step.step}`;
    const htmlPath = path.join(TEMPLATES_DIR, step.file);

    if (!fs.existsSync(htmlPath)) {
      console.error(`  [skip] ${step.file} が見つかりません`);
      continue;
    }

    const htmlContent = fs.readFileSync(htmlPath, "utf8");
    process.stdout.write(`  Step ${step.step}: ${step.name} ... `);

    try {
      if (ids[key]) {
        // 既存テンプレートを更新
        const tmpl = await getTemplate(ids[key]);
        const activeVersion = tmpl.versions?.find((v) => v.active === 1);

        if (activeVersion) {
          await updateVersion(ids[key], activeVersion.id, step.name, step.subject, htmlContent);
        } else {
          await createVersion(ids[key], step.name, step.subject, htmlContent);
        }
        console.log("更新");
        updated++;
      } else {
        // 新規作成
        const templateId = await createTemplate(step.name);
        await createVersion(templateId, step.name, step.subject, htmlContent);
        ids[key] = templateId;
        console.log(`作成 (${templateId})`);
        created++;
      }
    } catch (err) {
      console.log("エラー");
      console.error(`    -> ${err.message}`);
    }
  }

  saveIds(ids);

  console.log(
    `\n  完了: ${created}件作成, ${updated}件更新`
  );

  // wrangler.toml用のテンプレートID一覧を表示
  if (created > 0) {
    console.log("\n  wrangler.toml に以下を設定してください:\n");
    for (const step of STEPS) {
      const key = `step${step.step}`;
      if (ids[key]) {
        console.log(`  TEMPLATE_ID_STEP${step.step} = "${ids[key]}"`);
      }
    }
    console.log("");
  }
}

// CLI実行
const args = process.argv.slice(2);
if (args.includes("--status")) {
  showStatus().catch((err) => {
    console.error("[error]", err.message);
    process.exit(1);
  });
} else {
  syncTemplates().catch((err) => {
    console.error("[error]", err.message);
    process.exit(1);
  });
}
