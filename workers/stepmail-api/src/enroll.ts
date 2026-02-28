import type { Env, EnrollmentRecord, EnrollRequest } from "./types";
import { KV_PREFIX, KV_TTL_SECONDS } from "./types";
import { hashEmail, isValidEmail } from "./utils";
import { sendStepEmail } from "./email";
import { notifySlack, buildEnrollBlocks } from "./slack";

/** POST /enroll ハンドラ */
export async function handleEnroll(
  body: EnrollRequest,
  env: Env,
  ctx: ExecutionContext,
  workerUrl: string
): Promise<Response> {
  // バリデーション
  if (!body.email || !body.companyName) {
    return new Response(
      JSON.stringify({ error: "email and companyName are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!isValidEmail(body.email)) {
    return new Response(
      JSON.stringify({ error: "Invalid email format" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const emailHash = await hashEmail(body.email);
  const kvKey = `${KV_PREFIX}${emailHash}`;

  // 重複チェック
  const existing = await env.STEPMAIL_KV.get(kvKey);
  if (existing) {
    return new Response(
      JSON.stringify({ error: "Already enrolled" }),
      { status: 409, headers: { "Content-Type": "application/json" } }
    );
  }

  const now = new Date().toISOString();

  // Step 1メールを即時送信
  await sendStepEmail(env, body.email, body.companyName, 1, workerUrl);

  // KVにレコード保存
  const record: EnrollmentRecord = {
    email: body.email,
    companyName: body.companyName,
    enrolledAt: now,
    currentStep: 1,
    unsubscribed: false,
    lastSentAt: now,
  };

  await env.STEPMAIL_KV.put(kvKey, JSON.stringify(record), {
    expirationTtl: KV_TTL_SECONDS,
  });

  // Slack通知（PIIなし、waitUntilで非同期）
  ctx.waitUntil(notifySlack(env, buildEnrollBlocks()));

  return new Response(
    JSON.stringify({ ok: true, step: 1 }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
