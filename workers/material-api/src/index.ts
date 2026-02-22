export interface Env {
  SENDGRID_API_KEY: string;
  SLACK_WEBHOOK_URL: string;
  FROM_EMAIL: string;
  CORS_ORIGIN: string;
  DOWNLOAD_TOKENS: KVNamespace;
  MATERIAL_BUCKET: R2Bucket;
}

/* ── Select options (allowlists) ── */

const INDUSTRY_OPTIONS = [
  "製造業",
  "IT・情報通信",
  "建設・不動産",
  "サービス業",
  "卸売・小売",
  "金融・保険",
  "その他",
];

const COMPANY_SIZE_OPTIONS = [
  "1〜10名",
  "11〜50名",
  "51〜100名",
  "101〜300名",
  "301名以上",
];

const PURPOSE_OPTIONS = ["情報収集", "比較検討", "導入予定", "その他"];

const START_TIMING_OPTIONS = [
  "すぐに",
  "1ヶ月以内",
  "3ヶ月以内",
  "6ヶ月以内",
  "未定",
];

const KINTONE_HISTORY_OPTIONS = [
  "未利用",
  "半年未満",
  "半年〜1年",
  "1〜3年",
  "3年以上",
];

const KINTONE_USERS_OPTIONS = [
  "1〜10",
  "11〜50",
  "51〜100",
  "101〜300",
  "301以上",
];

const KINTONE_APPS_OPTIONS = [
  "1〜10",
  "11〜30",
  "31〜50",
  "51〜100",
  "101以上",
];

/* ── Types ── */

interface MaterialBody {
  company: string;
  name: string;
  email: string;
  industry: string;
  companySize: string;
  purpose: string;
  startTiming: string;
  kintoneHistory: string;
  kintoneUsers: string;
  kintoneApps: string;
  _hp?: string;
}

/* ── Helpers ── */

function sanitize(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidOption(value: string, options: string[]): boolean {
  return options.includes(value);
}

/* ── Email ── */

async function sendDownloadEmail(
  env: Env,
  data: MaterialBody,
  downloadUrl: string
): Promise<Response> {
  const textBody = `${sanitize(data.name)} 様

この度はソトバコポータルの資料をご請求いただき、誠にありがとうございます。
以下のURLより資料をダウンロードいただけます。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ ダウンロードURL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${downloadUrl}

※ このリンクは72時間有効です。
※ 期限を過ぎた場合は、再度資料請求ページよりお申し込みください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ご不明な点がございましたら、お気軽にお問い合わせください。
https://sotobaco.com/sotobacoportal/contact/

※ このメールは自動返信です。
※ このメールにご返信いただいてもお応えできかねますのでご了承ください。

──────────────────────────
株式会社ソトバコ.
https://sotobaco.com
──────────────────────────`;

  return fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: data.email }] }],
      from: {
        email: env.FROM_EMAIL,
        name: "ソトバコ",
      },
      subject: "【ソトバコポータル】資料ダウンロードのご案内",
      content: [{ type: "text/plain", value: textBody }],
    }),
  });
}

/* ── Slack ── */

async function sendSlackNotification(
  env: Env,
  data: MaterialBody
): Promise<Response> {
  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: "資料ダウンロード申込", emoji: true },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*会社名:*\n${data.company}` },
        { type: "mrkdwn", text: `*お名前:*\n${data.name}` },
        { type: "mrkdwn", text: `*メールアドレス:*\n${data.email}` },
        { type: "mrkdwn", text: `*業種・業態:*\n${data.industry}` },
      ],
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*会社規模:*\n${data.companySize}` },
        { type: "mrkdwn", text: `*目的:*\n${data.purpose}` },
        { type: "mrkdwn", text: `*開始時期:*\n${data.startTiming}` },
        { type: "mrkdwn", text: `*kintone利用歴:*\n${data.kintoneHistory}` },
      ],
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*kintoneユーザー数:*\n${data.kintoneUsers}` },
        { type: "mrkdwn", text: `*作成したアプリ数:*\n${data.kintoneApps}` },
      ],
    },
    { type: "divider" },
  ];

  return fetch(env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocks }),
  });
}

/* ── Download handler ── */

async function handleDownload(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response("トークンが指定されていません。", {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const stored = await env.DOWNLOAD_TOKENS.get(token);
  if (!stored) {
    return new Response(
      "ダウンロードリンクの有効期限が切れているか、無効なリンクです。\n再度資料請求ページよりお申し込みください。",
      {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      }
    );
  }

  const object = await env.MATERIAL_BUCKET.get(
    "sotobaco-portal-material.pdf"
  );
  if (!object) {
    console.error("PDF not found in R2 bucket");
    return new Response("ファイルが見つかりません。", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(object.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="sotobaco-portal-material.pdf"',
      "Cache-Control": "no-store",
    },
  });
}

/* ── Main handler ── */

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = env.CORS_ORIGIN || "https://sotobaco.com";
    const headers = corsHeaders(origin);
    const url = new URL(request.url);

    // Download endpoint (no CORS — direct browser access)
    if (url.pathname === "/download" && request.method === "GET") {
      return handleDownload(request, env);
    }

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    let body: MaterialBody;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // Honeypot check
    if (body._hp) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // Validation
    const errors: string[] = [];
    if (!body.company?.trim()) errors.push("会社名は必須です");
    if (!body.name?.trim()) errors.push("お名前は必須です");
    if (!body.email?.trim()) {
      errors.push("メールアドレスは必須です");
    } else if (!isValidEmail(body.email)) {
      errors.push("メールアドレスの形式が不正です");
    }
    if (!body.industry?.trim() || !isValidOption(body.industry, INDUSTRY_OPTIONS)) {
      errors.push("業種・業態を選択してください");
    }
    if (!body.companySize?.trim() || !isValidOption(body.companySize, COMPANY_SIZE_OPTIONS)) {
      errors.push("会社規模を選択してください");
    }
    if (!body.purpose?.trim() || !isValidOption(body.purpose, PURPOSE_OPTIONS)) {
      errors.push("目的を選択してください");
    }
    if (!body.startTiming?.trim() || !isValidOption(body.startTiming, START_TIMING_OPTIONS)) {
      errors.push("開始時期を選択してください");
    }
    if (!body.kintoneHistory?.trim() || !isValidOption(body.kintoneHistory, KINTONE_HISTORY_OPTIONS)) {
      errors.push("kintoneの利用歴を選択してください");
    }
    if (!body.kintoneUsers?.trim() || !isValidOption(body.kintoneUsers, KINTONE_USERS_OPTIONS)) {
      errors.push("kintoneのユーザー数を選択してください");
    }
    if (!body.kintoneApps?.trim() || !isValidOption(body.kintoneApps, KINTONE_APPS_OPTIONS)) {
      errors.push("作成したアプリ数を選択してください");
    }

    if (errors.length > 0) {
      return new Response(JSON.stringify({ error: errors.join(", ") }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // Sanitize inputs
    const sanitizedData: MaterialBody = {
      company: body.company.trim(),
      name: body.name.trim(),
      email: body.email.trim(),
      industry: body.industry.trim(),
      companySize: body.companySize.trim(),
      purpose: body.purpose.trim(),
      startTiming: body.startTiming.trim(),
      kintoneHistory: body.kintoneHistory.trim(),
      kintoneUsers: body.kintoneUsers.trim(),
      kintoneApps: body.kintoneApps.trim(),
    };

    // Generate download token (72h TTL)
    const token = crypto.randomUUID();
    await env.DOWNLOAD_TOKENS.put(token, JSON.stringify({ email: sanitizedData.email }), {
      expirationTtl: 72 * 60 * 60,
    });

    const baseUrl = new URL(request.url);
    const downloadUrl = `${baseUrl.origin}/download?token=${token}`;

    // Send email and Slack notification in parallel
    try {
      const [emailRes, slackRes] = await Promise.allSettled([
        sendDownloadEmail(env, sanitizedData, downloadUrl),
        sendSlackNotification(env, sanitizedData),
      ]);

      if (emailRes.status === "rejected") {
        console.error("SendGrid error:", emailRes.reason);
        return new Response(
          JSON.stringify({ error: "メール送信に失敗しました" }),
          {
            status: 500,
            headers: { ...headers, "Content-Type": "application/json" },
          }
        );
      }

      if (emailRes.status === "fulfilled" && !emailRes.value.ok) {
        const errorText = await emailRes.value.text();
        console.error("SendGrid API error:", emailRes.value.status, errorText);
        return new Response(
          JSON.stringify({ error: "メール送信に失敗しました" }),
          {
            status: 500,
            headers: { ...headers, "Content-Type": "application/json" },
          }
        );
      }

      if (slackRes.status === "rejected") {
        console.error("Slack notification error:", slackRes.reason);
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        {
          status: 500,
          headers: { ...headers, "Content-Type": "application/json" },
        }
      );
    }
  },
} satisfies ExportedHandler<Env>;
