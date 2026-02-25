import type { Env, LearningMeta } from "./types";
import { corsHeaders, checkRateLimit } from "./utils";
import { buildSummaryBlocks, buildContentBlocks, sendSlackMessage } from "./slack";
import { buildCompleteButton } from "./learning";

interface FeedbackBody {
  service: string;
  feedbackType: string;
  comment: string;
  company?: string;
  name?: string;
  email?: string;
  _hp?: string;
}

const SERVICE_LABELS: Record<string, string> = {
  "sotobaco-portal": "ソトバコポータル",
  btone: "Btone",
};

const FEEDBACK_TYPE_LABELS: Record<string, string> = {
  like: "気に入っている",
  dislike: "不満がある",
  idea: "アイデアがある",
};

const FEEDBACK_TYPE_EMOJI: Record<string, string> = {
  like: ":heart:",
  dislike: ":disappointed:",
  idea: ":bulb:",
};

export async function handleFeedback(
  request: Request,
  env: Env,
  headers: Record<string, string>,
  ctx: ExecutionContext
): Promise<Response> {
  const jsonHeaders = { ...headers, "Content-Type": "application/json" };

  let body: FeedbackBody;
  try {
    body = (await request.json()) as FeedbackBody;
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400, headers: jsonHeaders }
    );
  }

  // Honeypot check
  if (body._hp) {
    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: jsonHeaders }
    );
  }

  // Rate limit check
  const rateLimitRes = await checkRateLimit(env.RATE_LIMIT, request, jsonHeaders);
  if (rateLimitRes) return rateLimitRes;

  // Validation
  if (!body.service || !SERVICE_LABELS[body.service]) {
    return new Response(
      JSON.stringify({ error: "サービスを選択してください" }),
      { status: 400, headers: jsonHeaders }
    );
  }
  if (!body.feedbackType || !FEEDBACK_TYPE_LABELS[body.feedbackType]) {
    return new Response(
      JSON.stringify({ error: "ご意見の種類を選択してください" }),
      { status: 400, headers: jsonHeaders }
    );
  }
  if (!body.comment?.trim()) {
    return new Response(
      JSON.stringify({ error: "コメントを入力してください" }),
      { status: 400, headers: jsonHeaders }
    );
  }
  if (body.comment.length > 5000) {
    return new Response(
      JSON.stringify({ error: "コメントは5000文字以内で入力してください" }),
      { status: 400, headers: jsonHeaders }
    );
  }
  if (body.company && body.company.length > 200) {
    return new Response(
      JSON.stringify({ error: "会社名は200文字以内で入力してください" }),
      { status: 400, headers: jsonHeaders }
    );
  }
  if (body.name && body.name.length > 100) {
    return new Response(
      JSON.stringify({ error: "お名前は100文字以内で入力してください" }),
      { status: 400, headers: jsonHeaders }
    );
  }
  if (body.email && body.email.length > 254) {
    return new Response(
      JSON.stringify({ error: "メールアドレスは254文字以内で入力してください" }),
      { status: 400, headers: jsonHeaders }
    );
  }

  const serviceLabel = SERVICE_LABELS[body.service];
  const typeLabel = FEEDBACK_TYPE_LABELS[body.feedbackType];
  const typeEmoji = FEEDBACK_TYPE_EMOJI[body.feedbackType] || "";

  // 親メッセージ: ヘッダー + 基本情報
  const fields: Array<{ label: string; value: string }> = [
    { label: "サービス", value: serviceLabel },
    { label: "種類", value: typeLabel },
  ];
  if (body.company?.trim()) {
    fields.push({ label: "会社名", value: body.company.trim() });
  }
  if (body.name?.trim()) {
    fields.push({ label: "担当者名", value: body.name.trim() });
  }
  if (body.email?.trim()) {
    fields.push({ label: "メール", value: body.email.trim() });
  }

  const summaryBlocks = buildSummaryBlocks(
    "【感謝】ソトバコの改善に協力いただきました",
    fields
  );

  // Slack通知: 親メッセージ → スレッド返信（コメント内容）
  ctx.waitUntil(
    (async () => {
      try {
        const messageTs = await sendSlackMessage(env, summaryBlocks);
        if (messageTs) {
          const contentBlocks = buildContentBlocks("コメント", body.comment.trim());
          await sendSlackMessage(env, contentBlocks, messageTs);

          // 「完了」ボタンをスレッドに追加
          const meta: LearningMeta = {
            threadTs: messageTs,
            messageTs,
            messageChannel: env.SLACK_CHANNEL_ID || "",
            category: body.service,
          };
          await sendSlackMessage(env, [buildCompleteButton(meta)], messageTs);
        }
      } catch (err) {
        console.error("Feedback Slack error:", err);
      }
    })()
  );

  return new Response(
    JSON.stringify({ ok: true }),
    { status: 200, headers: jsonHeaders }
  );
}
