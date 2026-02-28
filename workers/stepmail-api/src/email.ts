import type { Env } from "./types";
import { generateHmacToken } from "./utils";

/** ステップ番号に対応するSendGrid Dynamic Template IDを取得 */
function getTemplateId(env: Env, step: number): string {
  const map: Record<number, string> = {
    1: env.TEMPLATE_ID_STEP1,
    2: env.TEMPLATE_ID_STEP2,
    3: env.TEMPLATE_ID_STEP3,
    4: env.TEMPLATE_ID_STEP4,
    5: env.TEMPLATE_ID_STEP5,
    6: env.TEMPLATE_ID_STEP6,
  };
  return map[step] || "";
}

/** 配信停止URLを生成（HMAC署名付き） */
export async function buildUnsubscribeUrl(
  env: Env,
  email: string,
  workerUrl: string
): Promise<string> {
  const token = await generateHmacToken(env.UNSUBSCRIBE_SECRET, email.toLowerCase());
  const params = new URLSearchParams({ email, token });
  return `${workerUrl}/unsubscribe?${params.toString()}`;
}

/** SendGrid Dynamic Template でステップメールを送信 */
export async function sendStepEmail(
  env: Env,
  email: string,
  companyName: string,
  step: number,
  workerUrl: string
): Promise<void> {
  const templateId = getTemplateId(env, step);
  if (!templateId) {
    console.error(`Template ID not configured for step ${step}`);
    return;
  }

  const unsubscribeUrl = await buildUnsubscribeUrl(env, email, workerUrl);

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email }],
          dynamic_template_data: {
            companyName,
            unsubscribeUrl,
          },
        },
      ],
      from: {
        email: env.FROM_EMAIL,
        name: env.FROM_NAME,
      },
      template_id: templateId,
      tracking_settings: {
        click_tracking: { enable: false },
      },
    }),
  });

  if (!res.ok) {
    console.error(`SendGrid error for step ${step}: ${res.status}`);
  }
}
