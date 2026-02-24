import type { Env } from "./types";
import { corsHeaders } from "./utils";
import { sendSlackMessage } from "./slack";

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

  const serviceLabel = SERVICE_LABELS[body.service];
  const typeLabel = FEEDBACK_TYPE_LABELS[body.feedbackType];
  const typeEmoji = FEEDBACK_TYPE_EMOJI[body.feedbackType] || "";

  // Build Slack blocks
  const blocks: Array<Record<string, unknown>> = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `${typeEmoji} ご意見・ご感想（${serviceLabel}）`,
        emoji: true,
      },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*サービス:*\n${serviceLabel}` },
        { type: "mrkdwn", text: `*種類:*\n${typeLabel}` },
      ],
    },
  ];

  // Optional contact info
  const contactFields: Array<{ type: string; text: string }> = [];
  if (body.company?.trim()) {
    contactFields.push({ type: "mrkdwn", text: `*会社名:*\n${body.company.trim()}` });
  }
  if (body.name?.trim()) {
    contactFields.push({ type: "mrkdwn", text: `*担当者名:*\n${body.name.trim()}` });
  }
  if (body.email?.trim()) {
    contactFields.push({ type: "mrkdwn", text: `*メール:*\n${body.email.trim()}` });
  }
  if (contactFields.length > 0) {
    blocks.push({ type: "section", fields: contactFields });
  }

  blocks.push(
    {
      type: "section",
      text: { type: "mrkdwn", text: `*コメント:*\n${body.comment.trim()}` },
    },
    { type: "divider" }
  );

  // Send to Slack (fire and forget)
  ctx.waitUntil(
    sendSlackMessage(env, blocks).catch((err) =>
      console.error("Feedback Slack error:", err)
    )
  );

  return new Response(
    JSON.stringify({ ok: true }),
    { status: 200, headers: jsonHeaders }
  );
}
