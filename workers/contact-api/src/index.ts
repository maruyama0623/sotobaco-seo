export interface Env {
  SENDGRID_API_KEY: string;
  SLACK_WEBHOOK_URL: string;
  FROM_EMAIL: string;
  CORS_ORIGIN: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  "sotobaco-portal": "ソトバコポータル",
  other: "その他",
};

interface ContactBody {
  category?: string;
  company: string;
  name: string;
  email: string;
  message: string;
  _hp?: string;
}

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

async function sendAutoReplyEmail(
  env: Env,
  data: ContactBody
): Promise<Response> {
  const textBody = `${sanitize(data.name)} 様

この度はソトバコへお問い合わせいただき、誠にありがとうございます。
以下の内容でお問い合わせを受け付けいたしました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

お問い合わせ種別: ${CATEGORY_LABELS[data.category || "other"] || "その他"}
会社名: ${data.company}
お名前: ${data.name}
メールアドレス: ${data.email}

お問い合わせ内容:
${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

内容を確認の上、担当者よりご連絡いたします。
しばらくお待ちくださいますようお願い申し上げます。

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
      subject: "【ソトバコ】お問い合わせありがとうございます",
      content: [{ type: "text/plain", value: textBody }],
    }),
  });
}

async function sendSlackNotification(
  env: Env,
  data: ContactBody
): Promise<Response> {
  const blocks = [
    {
      type: "header",
      text: { type: "plain_text", text: "新しいお問い合わせ", emoji: true },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*種別:*\n${CATEGORY_LABELS[data.category || "other"] || "その他"}` },
        { type: "mrkdwn", text: `*会社名:*\n${data.company}` },
        { type: "mrkdwn", text: `*お名前:*\n${data.name}` },
        { type: "mrkdwn", text: `*メールアドレス:*\n${data.email}` },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*お問い合わせ内容:*\n${data.message}`,
      },
    },
    { type: "divider" },
  ];

  return fetch(env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocks }),
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = env.CORS_ORIGIN || "https://sotobaco.com";
    const headers = corsHeaders(origin);

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

    let body: ContactBody;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // Honeypot check — silently succeed if bot fills hidden field
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
    if (!body.message?.trim()) errors.push("お問い合わせ内容は必須です");

    if (errors.length > 0) {
      return new Response(JSON.stringify({ error: errors.join(", ") }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // Sanitize inputs
    const sanitizedData: ContactBody = {
      category: body.category || "other",
      company: body.company.trim(),
      name: body.name.trim(),
      email: body.email.trim(),
      message: body.message.trim(),
    };

    // Send email and Slack notification in parallel
    try {
      const [emailRes, slackRes] = await Promise.allSettled([
        sendAutoReplyEmail(env, sanitizedData),
        sendSlackNotification(env, sanitizedData),
      ]);

      // Log failures but don't fail the request if Slack fails
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

      if (
        emailRes.status === "fulfilled" &&
        !emailRes.value.ok
      ) {
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
