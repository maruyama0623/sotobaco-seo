import type { Env, ContactBody } from "./types";
import { CATEGORY_LABELS } from "./types";
import { sanitize } from "./utils";

export async function sendAutoReplyEmail(
  env: Env,
  data: ContactBody,
  questionId?: string
): Promise<Response> {
  const replyTo = env.REPLY_TO_EMAIL || env.FROM_EMAIL;

  const questionIdLine = questionId
    ? `\nお問い合わせ番号: ${questionId}\n`
    : "";

  const textBody = `${sanitize(data.name)} 様

この度はソトバコへお問い合わせいただき、誠にありがとうございます。
以下の内容でお問い合わせを受け付けいたしました。
${questionIdLine}
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
※ ご返信の際はこのメールにそのままご返信ください。

──────────────────────────
株式会社ソトバコ
https://sotobaco.com
──────────────────────────`;

  const subject = questionId
    ? `【ソトバコ】お問い合わせありがとうございます [Q-${questionId}]`
    : "【ソトバコ】お問い合わせありがとうございます";

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
        name: "ソトバコ サポートチーム",
      },
      reply_to: {
        email: replyTo,
        name: "ソトバコ サポート",
      },
      subject,
      content: [{ type: "text/plain", value: textBody }],
      tracking_settings: {
        click_tracking: { enable: false },
      },
    }),
  });
}

/** Slackから回答案をメール送信 */
export async function sendDraftEmail(
  env: Env,
  toEmail: string,
  subject: string,
  body: string
): Promise<void> {
  const fromEmail = env.SUPPORT_FROM_EMAIL || env.FROM_EMAIL;
  const replyTo = env.REPLY_TO_EMAIL || fromEmail;

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: toEmail }] }],
      from: { email: fromEmail, name: "ソトバコ サポートチーム" },
      reply_to: { email: replyTo, name: "ソトバコ サポート" },
      subject,
      content: [{ type: "text/plain", value: body }],
      tracking_settings: {
        click_tracking: { enable: false },
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`SendGrid error: ${res.status} ${errorText}`);
  }
}

/** メール本文から引用部分（> や「On ... wrote:」以降）を除去 */
export function stripQuotedContent(body: string): string {
  const lines = body.split("\n");
  const result: string[] = [];

  for (const line of lines) {
    if (/^On .+ wrote:$/.test(line.trim())) break;
    if (/^\d{4}\/\d{1,2}\/\d{1,2}.*のメッセージ/.test(line.trim())) break;
    if (line.trim().startsWith("---------- Forwarded message")) break;
    if (line.trim().startsWith(">")) continue;
    result.push(line);
  }

  return result.join("\n").trim();
}

/** "Name <email>" 形式からメールアドレスを抽出 */
export function extractEmail(fromField: string): string {
  const match = fromField.match(/<([^>]+)>/);
  return match ? match[1] : fromField.trim();
}

/** "Name <email>" 形式から名前を抽出 */
export function extractName(fromField: string): string {
  const match = fromField.match(/^"?([^"<]+)"?\s*</);
  return match ? match[1].trim() : fromField.replace(/<[^>]+>/, "").trim();
}

/** AI回答案から件名と本文を分離 */
export function parseDraftContent(
  draftText: string,
  defaultSubject: string
): { subject: string; body: string } {
  const lines = draftText.split("\n");
  let subject = defaultSubject;
  let bodyStartIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const subjectMatch = line.match(/^件名[：:]\s*(.+)/);
    if (subjectMatch) {
      subject = subjectMatch[1].trim();
      continue;
    }
    if (/^本文[：:]/.test(line)) {
      bodyStartIndex = i + 1;
      break;
    }
  }

  if (bodyStartIndex > 0) {
    return { subject, body: lines.slice(bodyStartIndex).join("\n").trim() };
  }

  return { subject, body: draftText };
}
