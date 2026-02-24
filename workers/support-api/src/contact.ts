import type { Env, ContactBody, AiResult, SlackActionMeta, ThreadMapValue } from "./types";
import { CATEGORY_LABELS } from "./types";
import { isValidEmail } from "./utils";
import { sendAutoReplyEmail } from "./email";
import { fetchServiceContext, buildContactPrompt, generateAiDraft, fetchRelevantPages } from "./ai";
import {
  fetchSimilarAnswers,
  isKintoneEnabled,
  toKintoneDate,
  generateQuestionId,
  generateInquiryTitle,
  createKintoneRecord,
} from "./kintone";
import { buildSummaryBlocks, buildContentBlocks, buildAiDraftBlocks, sendSlackMessage } from "./slack";

export async function handleContact(
  request: Request,
  env: Env,
  headers: Record<string, string>,
  ctx: ExecutionContext
): Promise<Response> {
  let body: ContactBody;
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
  if (!body.message?.trim()) errors.push("お問い合わせ内容は必須です");

  if (errors.length > 0) {
    return new Response(JSON.stringify({ error: errors.join(", ") }), {
      status: 400,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  const sanitizedData: ContactBody = {
    category: body.category || "other",
    company: body.company.trim(),
    name: body.name.trim(),
    email: body.email.trim(),
    message: body.message.trim(),
  };

  try {
    const categoryLabel =
      CATEGORY_LABELS[sanitizedData.category || "other"] || "その他";
    const userMessage = `お問い合わせ種別: ${categoryLabel}\n会社名: ${sanitizedData.company}\nお名前: ${sanitizedData.name}\n\nお問い合わせ内容:\n${sanitizedData.message}`;

    const [emailRes, aiRes, titleRes] = await Promise.allSettled([
      sendAutoReplyEmail(env, sanitizedData),
      env.ANTHROPIC_API_KEY
        ? (async () => {
            const [serviceContext, pastQA, relevantPages] = await Promise.all([
              fetchServiceContext(env),
              fetchSimilarAnswers(env, sanitizedData.message),
              fetchRelevantPages(env, sanitizedData.message),
            ]);
            if (!serviceContext) return null;
            return generateAiDraft(
              env,
              buildContactPrompt(serviceContext),
              userMessage,
              pastQA,
              relevantPages
            );
          })()
        : Promise.resolve(null),
      env.ANTHROPIC_API_KEY
        ? generateInquiryTitle(env, sanitizedData.message)
        : Promise.resolve(
            sanitizedData.message.length > 40
              ? sanitizedData.message.slice(0, 40) + "…"
              : sanitizedData.message
          ),
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

    let aiResult: AiResult | null = null;
    if (aiRes.status === "fulfilled") {
      aiResult = aiRes.value;
    } else {
      console.error("AI draft generation error:", aiRes.reason);
    }

    const titleText =
      titleRes.status === "fulfilled" ? titleRes.value : "新しいお問い合わせ";
    const headerText =
      sanitizedData.category !== "other"
        ? "【至急確認】サービスに対するお問い合せ"
        : "【要確認】コーポレートサイトからのお問い合わせ";

    // Slack通知: 親メッセージ → スレッド返信（内容）→ スレッド返信（AI回答案）
    const summaryBlocks = buildSummaryBlocks(headerText, [
      { label: "種別", value: categoryLabel },
      { label: "会社名", value: sanitizedData.company },
      { label: "お名前", value: sanitizedData.name },
      { label: "メールアドレス", value: sanitizedData.email },
    ]);

    // AI生成タイトルをメールアドレスの下に挿入（営業判定時はプレフィックス付与）
    const displayTitle = aiResult?.isSales ? `【営業連絡】${titleText}` : titleText;
    summaryBlocks.splice(-1, 0, {
      type: "context",
      elements: [
        { type: "mrkdwn", text: `:memo: ${displayTitle}` },
      ],
    });

    const messageTs = await sendSlackMessage(env, summaryBlocks).catch((err) => {
      console.error("Slack notification error:", err);
      return null;
    });

    if (messageTs) {
      const contentBlocks = buildContentBlocks("お問い合わせ内容", sanitizedData.message);
      await sendSlackMessage(env, contentBlocks, messageTs).catch((err) => {
        console.error("Slack thread (content) error:", err);
      });

      if (aiResult) {
        const actionMeta: SlackActionMeta | null = env.SLACK_BOT_TOKEN
          ? {
              type: "contact",
              email: sanitizedData.email,
              name: sanitizedData.name,
              subject:
                "【ソトバコポータル】お問い合わせいただきました件について",
              category: sanitizedData.category,
            }
          : null;
        const aiBlocks = buildAiDraftBlocks(aiResult, actionMeta);
        if (aiBlocks.length > 0) {
          await sendSlackMessage(env, aiBlocks, messageTs).catch((err) => {
            console.error("Slack thread (AI draft) error:", err);
          });
        }
      }
    }

    // kintoneレコード作成 + スレッド管理（非ブロッキング）
    if (messageTs && env.THREAD_MAP) {
      const kvValue: ThreadMapValue = {
        channel: env.SLACK_CHANNEL_ID || "",
        ts: messageTs,
      };

      if (isKintoneEnabled(env)) {
        ctx.waitUntil(
          (async () => {
            const questionId = await generateQuestionId(env);
            const today = toKintoneDate();

            // App 93: 親レコード作成
            const recordId = await createKintoneRecord(
              env,
              env.KINTONE_APP_ID_93!,
              {
                question_id: { value: questionId },
                title: { value: titleText },
                question_date: { value: today },
                category: { value: categoryLabel },
                client_name: { value: sanitizedData.company },
                inquirer_name: { value: sanitizedData.name },
                inquirer_mail: { value: sanitizedData.email },
              }
            );

            // App 94: 明細レコード作成（枝番1）
            const detailId = await createKintoneRecord(
              env,
              env.KINTONE_APP_ID_94!,
              {
                question_id: { value: questionId },
                branch_number: { value: 1 },
                question_date: { value: today },
                question_detail: { value: sanitizedData.message },
              }
            );

            if (recordId) {
              kvValue.kintoneRecordId = recordId;
              kvValue.questionId = questionId;
              kvValue.branchNumber = 1;
            }
            if (detailId) kvValue.detailRecordId = detailId;

            await env.THREAD_MAP.put(
              sanitizedData.email.toLowerCase(),
              JSON.stringify(kvValue),
              { expirationTtl: 60 * 60 * 24 * 30 }
            );
          })().catch((err) => console.error("kintone/KV error:", err))
        );
      } else {
        await env.THREAD_MAP.put(
          sanitizedData.email.toLowerCase(),
          JSON.stringify(kvValue),
          { expirationTtl: 60 * 60 * 24 * 30 }
        ).catch((err) => console.error("KV put error:", err));
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
}
