import type { Env, AiResult, SlackActionMeta, ThreadMapValue, LearningMeta } from "./types";
import { sendDraftEmail, parseDraftContent } from "./email";
import { updateKintoneRecord, isKintoneEnabled, toKintoneDate } from "./kintone";
import { buildCompleteButton, handleLearningComplete, populateLearningModal, handleLearningModalSubmit } from "./learning";

async function verifySlackSignature(
  signingSecret: string,
  timestamp: string,
  body: string,
  signature: string
): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > 300) return false;

  const sigBasestring = `v0:${timestamp}:${body}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(signingSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(sigBasestring)
  );
  const computed =
    "v0=" +
    Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  return computed === signature;
}

export async function sendSlackMessage(
  env: Env,
  blocks: Array<Record<string, unknown>>,
  threadTs?: string
): Promise<string | null> {
  if (env.SLACK_BOT_TOKEN && env.SLACK_CHANNEL_ID) {
    const payload: Record<string, unknown> = {
      channel: env.SLACK_CHANNEL_ID,
      blocks,
      text: "お問い合わせ通知",
    };
    if (threadTs) {
      payload.thread_ts = threadTs;
    }
    const res = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as {
      ok: boolean;
      error?: string;
      ts?: string;
    };
    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error}`);
    }
    return data.ts || null;
  } else if (env.SLACK_WEBHOOK_URL) {
    await fetch(env.SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocks }),
    });
  }
  return null;
}

/** メッセージを「送信済み」に更新（ボタン削除 + ステータス追加 + 完了ボタン） */
async function updateSlackMessageSent(
  env: Env,
  channel: string,
  ts: string,
  originalBlocks: Array<Record<string, unknown>>,
  threadTs: string,
  category?: string
): Promise<void> {
  const updatedBlocks = originalBlocks
    .filter((b) => b.type !== "actions")
    .concat({
      type: "context",
      elements: [
        { type: "mrkdwn", text: ":white_check_mark: *メールを送信しました*" },
      ],
    });

  await fetch("https://slack.com/api/chat.update", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel,
      ts,
      blocks: updatedBlocks,
      text: "お問い合わせ通知（送信済み）",
    }),
  });

  // 「完了」ボタンをスレッドに追加
  const meta: LearningMeta = {
    threadTs,
    messageTs: ts,
    messageChannel: channel,
    category,
  };
  await sendSlackMessage(env, [buildCompleteButton(meta)], threadTs);
}

/** メッセージのボタン部分にエラー表示 */
async function updateSlackMessageError(
  env: Env,
  channel: string,
  ts: string,
  originalBlocks: Array<Record<string, unknown>>
): Promise<void> {
  const updatedBlocks = originalBlocks
    .filter((b) => b.type !== "actions")
    .concat({
      type: "context",
      elements: [
        { type: "mrkdwn", text: ":x: *メール送信に失敗しました*" },
      ],
    });

  await fetch("https://slack.com/api/chat.update", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel,
      ts,
      blocks: updatedBlocks,
      text: "お問い合わせ通知（送信失敗）",
    }),
  });
}

/** SlackのHTMLエンティティをデコード */
function unescapeSlack(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");
}

function extractDraftFromBlocks(
  blocks: Array<Record<string, unknown>>
): string {
  for (const block of blocks) {
    if (block.block_id === "ai_draft") {
      const text = block.text as { text?: string } | undefined;
      return unescapeSlack(text?.text || "");
    }
  }
  return "";
}

/** 親メッセージ用ブロック（ヘッダー + 基本情報フィールド） */
export function buildSummaryBlocks(
  headerText: string,
  fields: Array<{ label: string; value: string }>
): Array<Record<string, unknown>> {
  return [
    {
      type: "header",
      text: { type: "plain_text", text: headerText, emoji: true },
    },
    {
      type: "section",
      fields: fields.map((f) => ({
        type: "mrkdwn",
        text: `*${f.label}:*\n${f.value}`,
      })),
    },
    { type: "divider" },
  ];
}

/** スレッド返信1用ブロック（問い合わせ内容） */
export function buildContentBlocks(
  messageLabel: string,
  messageText: string
): Array<Record<string, unknown>> {
  return [
    {
      type: "section",
      text: { type: "mrkdwn", text: `*${messageLabel}:*\n${messageText}` },
    },
  ];
}

/** スレッド返信2用ブロック（AI回答案 + ボタン） */
export function buildAiDraftBlocks(
  aiResult: AiResult,
  actionMeta: SlackActionMeta | null
): Array<Record<string, unknown>> {
  if (aiResult.isSales) {
    return [
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: ":no_entry_sign: *営業のお問い合わせと判定されました* — 回答案の生成をスキップしました",
          },
        ],
      },
    ];
  }

  if (!aiResult.draft) return [];

  const blocks: Array<Record<string, unknown>> = [
    {
      type: "header",
      text: { type: "plain_text", text: "回答案（AI生成）", emoji: true },
    },
    {
      type: "section",
      block_id: "ai_draft",
      text: { type: "mrkdwn", text: aiResult.draft },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: ":robot_face: この回答案はAIが自動生成したものです。内容を確認・修正のうえご利用ください。",
        },
      ],
    },
  ];

  if (actionMeta) {
    blocks.push({
      type: "actions",
      block_id: "draft_actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "送信", emoji: true },
          style: "primary",
          action_id: "send_draft",
          value: JSON.stringify(actionMeta),
          confirm: {
            title: { type: "plain_text", text: "メール送信の確認" },
            text: {
              type: "mrkdwn",
              text: "この回答案をそのままメールで送信しますか？",
            },
            confirm: { type: "plain_text", text: "送信する" },
            deny: { type: "plain_text", text: "キャンセル" },
          },
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "編集する",
            emoji: true,
          },
          action_id: "edit_draft",
          value: JSON.stringify(actionMeta),
        },
      ],
    });
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// Slack interaction handlers
// ---------------------------------------------------------------------------

async function handleSendDraft(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  env: Env
): Promise<void> {
  const action = payload.actions?.[0];
  const meta: SlackActionMeta = JSON.parse(action.value || "{}");
  const blocks = payload.message?.blocks || [];
  const channel = payload.channel?.id;
  const ts = payload.message?.ts;
  const draftRaw = extractDraftFromBlocks(blocks);

  const { subject, body } =
    meta.type === "contact"
      ? parseDraftContent(draftRaw, meta.subject)
      : { subject: meta.subject, body: draftRaw };

  const threadTs = payload.message?.thread_ts || ts;

  try {
    await sendDraftEmail(env, meta.email, subject, body);
    await updateSlackMessageSent(env, channel, ts, blocks, threadTs, meta.category);

    // kintone: App 94に回答を記録 + App 93を「回答済」に更新
    if (isKintoneEnabled(env) && env.THREAD_MAP) {
      const stored = await env.THREAD_MAP.get(meta.email.toLowerCase());
      if (stored) {
        try {
          const threadInfo = JSON.parse(stored) as ThreadMapValue;

          // App 94: 最新の明細レコードに回答を追記
          if (threadInfo.detailRecordId) {
            await updateKintoneRecord(
              env,
              env.KINTONE_APP_ID_94!,
              threadInfo.detailRecordId,
              {
                answer_detail: { value: body },
                answer_date: { value: toKintoneDate() },
              }
            );
          }
        } catch { /* ignore parse error */ }
      }
    }
  } catch (err) {
    console.error("Draft email send error:", err);
    await updateSlackMessageError(env, channel, ts, blocks).catch(() => {});
  }
}

async function handleEditDraft(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  env: Env
): Promise<void> {
  const action = payload.actions?.[0];
  const meta: SlackActionMeta = JSON.parse(action.value || "{}");
  const blocks = payload.message?.blocks || [];
  const channel = payload.channel?.id;
  const ts = payload.message?.ts;
  const draftRaw = extractDraftFromBlocks(blocks);

  const { subject, body } =
    meta.type === "contact"
      ? parseDraftContent(draftRaw, meta.subject)
      : { subject: meta.subject, body: draftRaw };

  const privateMeta = JSON.stringify({
    email: meta.email,
    type: meta.type,
    subject: meta.subject,
    channel,
    ts,
    thread_ts: payload.message?.thread_ts,
  });

  await fetch("https://slack.com/api/views.open", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trigger_id: payload.trigger_id,
      view: {
        type: "modal",
        callback_id: "edit_draft_modal",
        title: { type: "plain_text", text: "回答案を編集" },
        submit: { type: "plain_text", text: "保存" },
        close: { type: "plain_text", text: "キャンセル" },
        private_metadata: privateMeta,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*送信先:* ${meta.email}`,
            },
          },
          {
            type: "input",
            block_id: "subject_input",
            label: { type: "plain_text", text: "件名" },
            element: {
              type: "plain_text_input",
              action_id: "subject_text",
              initial_value: subject,
            },
          },
          {
            type: "input",
            block_id: "draft_input",
            label: { type: "plain_text", text: "本文" },
            element: {
              type: "plain_text_input",
              action_id: "draft_text",
              multiline: true,
              initial_value: body,
            },
          },
        ],
      },
    }),
  });
}

/** モーダルの保存 → Slackメッセージの回答案を更新（メール送信はしない） */
async function handleModalSave(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  env: Env
): Promise<void> {
  const view = payload.view;
  const privateMeta = JSON.parse(view.private_metadata || "{}");
  const subject =
    view.state?.values?.subject_input?.subject_text?.value || "";
  const body = view.state?.values?.draft_input?.draft_text?.value || "";

  if (!privateMeta.channel || !privateMeta.ts) return;

  try {
    // 元メッセージのブロックを取得（スレッド返信はconversations.repliesで取得）
    let originalBlocks: Array<Record<string, unknown>> = [];
    if (privateMeta.thread_ts) {
      const repliesRes = await fetch(
        `https://slack.com/api/conversations.replies?channel=${privateMeta.channel}&ts=${privateMeta.thread_ts}&latest=${privateMeta.ts}&inclusive=true&limit=1`,
        {
          headers: { Authorization: `Bearer ${env.SLACK_BOT_TOKEN}` },
        }
      );
      const repliesData = (await repliesRes.json()) as {
        ok: boolean;
        messages?: Array<{ ts?: string; blocks?: Array<Record<string, unknown>> }>;
      };
      const target = repliesData.messages?.find((m) => m.ts === privateMeta.ts);
      originalBlocks = target?.blocks || [];
    } else {
      const historyRes = await fetch(
        `https://slack.com/api/conversations.history?channel=${privateMeta.channel}&latest=${privateMeta.ts}&inclusive=true&limit=1`,
        {
          headers: { Authorization: `Bearer ${env.SLACK_BOT_TOKEN}` },
        }
      );
      const historyData = (await historyRes.json()) as {
        ok: boolean;
        messages?: Array<{ blocks?: Array<Record<string, unknown>> }>;
      };
      originalBlocks = historyData.messages?.[0]?.blocks || [];
    }

    // 回答案テキストを再構成
    const newDraftText =
      privateMeta.type === "contact"
        ? `件名：${subject}\n\n本文：\n${body}`
        : body;

    // ブロックを更新: ai_draftの中身を差し替え + ボタンのmetaを更新
    const updatedBlocks = originalBlocks.map(
      (block: Record<string, unknown>) => {
        if (block.block_id === "ai_draft") {
          return { ...block, text: { type: "mrkdwn", text: newDraftText } };
        }
        if (block.block_id === "draft_actions") {
          const newMeta: SlackActionMeta = {
            type: privateMeta.type || "contact",
            email: privateMeta.email,
            name: "",
            subject,
          };
          const elements = (
            block.elements as Array<Record<string, unknown>>
          ).map((el) => ({
            ...el,
            value: JSON.stringify(newMeta),
          }));
          return { ...block, elements };
        }
        return block;
      }
    );

    // 「編集済み」インジケーターを追加（重複しないよう既存チェック）
    const hasEdited = updatedBlocks.some(
      (b: Record<string, unknown>) => b.block_id === "edited_indicator"
    );
    if (!hasEdited) {
      const actionsIdx = updatedBlocks.findIndex(
        (b: Record<string, unknown>) => b.block_id === "draft_actions"
      );
      if (actionsIdx > -1) {
        updatedBlocks.splice(actionsIdx, 0, {
          type: "context",
          block_id: "edited_indicator",
          elements: [
            { type: "mrkdwn", text: ":pencil2: *編集済み*" },
          ],
        });
      }
    }

    await fetch("https://slack.com/api/chat.update", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: privateMeta.channel,
        ts: privateMeta.ts,
        blocks: updatedBlocks,
        text: "お問い合わせ通知（編集済み）",
      }),
    });
  } catch (err) {
    console.error("Modal save error:", err);
  }
}

export async function handleSlackInteraction(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const bodyText = await request.text();

  // Verify Slack signature
  if (env.SLACK_SIGNING_SECRET) {
    const timestamp =
      request.headers.get("X-Slack-Request-Timestamp") || "";
    const signature = request.headers.get("X-Slack-Signature") || "";
    const valid = await verifySlackSignature(
      env.SLACK_SIGNING_SECRET,
      timestamp,
      bodyText,
      signature
    );
    if (!valid) {
      return new Response("Invalid signature", { status: 401 });
    }
  }

  const params = new URLSearchParams(bodyText);
  const payload = JSON.parse(params.get("payload") || "{}");

  if (payload.type === "block_actions") {
    const action = payload.actions?.[0];

    if (action?.action_id === "send_draft") {
      ctx.waitUntil(handleSendDraft(payload, env));
      return new Response("", { status: 200 });
    }

    if (action?.action_id === "edit_draft") {
      await handleEditDraft(payload, env);
      return new Response("", { status: 200 });
    }

    if (action?.action_id === "learning_complete") {
      const viewId = await handleLearningComplete(payload, env);
      if (viewId) {
        ctx.waitUntil(populateLearningModal(viewId, payload, env));
      }
      return new Response("", { status: 200 });
    }
  }

  if (payload.type === "view_submission") {
    if (payload.view?.callback_id === "edit_draft_modal") {
      ctx.waitUntil(handleModalSave(payload, env));
      return new Response("", { status: 200 });
    }

    if (payload.view?.callback_id === "learning_modal") {
      ctx.waitUntil(handleLearningModalSubmit(payload, env));
      return new Response("", { status: 200 });
    }
  }

  return new Response("", { status: 200 });
}
