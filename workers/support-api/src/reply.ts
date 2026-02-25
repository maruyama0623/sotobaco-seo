import type { Env, ReplyBody, SlackActionMeta, ThreadMapValue } from "./types";
import { stripQuotedContent, extractEmail, extractName } from "./email";
import { extractQuestionId, generateFallbackId, timingSafeEqual, checkWebhookRateLimit } from "./utils";
import { fetchServiceContext, buildReplyPrompt, generateAiDraft, fetchRelevantPages } from "./ai";
import { isKintoneEnabled, toKintoneDate, createKintoneRecord } from "./kintone";
import { buildSummaryBlocks, buildContentBlocks, buildAiDraftBlocks, sendSlackMessage } from "./slack";

export async function handleReply(request: Request, env: Env): Promise<Response> {
  const jsonHeaders = { "Content-Type": "application/json" };

  let body: ReplyBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  // Verify webhook secret (timing-safe comparison)
  if (!env.REPLY_WEBHOOK_SECRET || !body.secret ||
      !(await timingSafeEqual(body.secret, env.REPLY_WEBHOOK_SECRET))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: jsonHeaders,
    });
  }

  // Rate limit (30req/10min per IP)
  const rateLimitRes = await checkWebhookRateLimit(env.RATE_LIMIT, request);
  if (rateLimitRes) return rateLimitRes;

  if (!body.from || !body.body) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const strippedBody = stripQuotedContent(body.body);

  try {
    const userMessage = `件名: ${body.subject}\n\nメール本文:\n${strippedBody}`;

    const aiResult = env.ANTHROPIC_API_KEY
      ? await (async () => {
          const [serviceContext, relevantPages] = await Promise.all([
            fetchServiceContext(env),
            fetchRelevantPages(env, strippedBody),
          ]);
          if (!serviceContext) return null;
          return generateAiDraft(
            env,
            buildReplyPrompt(serviceContext),
            userMessage,
            relevantPages
          );
        })().catch((err) => {
          console.error("AI draft generation error");
          return null;
        })
      : null;

    const recipientEmail = extractEmail(body.from);
    const recipientName = extractName(body.from);

    // スレッド管理: 件名からquestionIdを抽出してKV検索
    const questionId = extractQuestionId(body.subject || "");
    let effectiveQuestionId = questionId;

    // questionIdなし（件名から抽出できなかった場合）→ フォールバックID生成
    if (!effectiveQuestionId) {
      effectiveQuestionId = generateFallbackId();
    }

    let threadTs: string | undefined;
    let existingThread: ThreadMapValue | undefined;
    if (questionId && env.THREAD_MAP) {
      const stored = await env.THREAD_MAP.get(questionId);
      if (stored) {
        try {
          existingThread = JSON.parse(stored) as ThreadMapValue;
          threadTs = existingThread.ts;
        } catch { /* ignore */ }
      }
    }

    // Slack通知: 親メッセージ → スレッド返信（差出人＋内容）→ スレッド返信（AI回答案）
    const summaryBlocks = buildSummaryBlocks("メール返信", [
      { label: "件名", value: body.subject || "(件名なし)" },
      { label: "受信日時", value: body.date || "-" },
    ]);

    const messageTs = await sendSlackMessage(env, summaryBlocks, threadTs).catch(
      (err) => {
        console.error("Slack notification error:", err);
        return null;
      }
    );

    // parentTsはスレッドの起点（既存スレッドがあればその親、なければ今送った親メッセージ）
    const parentTs = threadTs || messageTs;

    if (parentTs) {
      // スレッド返信: 差出人情報 + メール本文（PIIはスレッド内のみ）
      const contentBlocks: Array<Record<string, unknown>> = [
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*差出人:*\n${body.from}` },
          ],
        },
        { type: "divider" },
        ...buildContentBlocks("メール本文", strippedBody),
      ];
      await sendSlackMessage(env, contentBlocks, parentTs).catch((err) => {
        console.error("Slack thread (content) error:", err);
      });

      if (aiResult) {
        const actionMeta: SlackActionMeta | null = env.SLACK_BOT_TOKEN
          ? {
              type: "reply",
              questionId: existingThread?.questionId || effectiveQuestionId,
              subject: body.subject
                ? `Re: ${body.subject}`
                : "Re: お問い合わせについて",
            }
          : null;
        const aiBlocks = buildAiDraftBlocks(aiResult, actionMeta);
        if (aiBlocks.length > 0) {
          await sendSlackMessage(env, aiBlocks, parentTs).catch((err) => {
            console.error("Slack thread (AI draft) error:", err);
          });
        }
      }
    }

    // kintone: App 94に新しい枝番で問い合わせ内容を追加
    const kvQuestionId = existingThread?.questionId || effectiveQuestionId;
    if (kvQuestionId && existingThread && isKintoneEnabled(env)) {
      const nextBranch = (existingThread.branchNumber || 0) + 1;
      const detailId = await createKintoneRecord(
        env,
        env.KINTONE_APP_ID_94!,
        {
          question_id: { value: kvQuestionId },
          branch_number: { value: nextBranch },
          question_date: { value: toKintoneDate() },
          question_detail: { value: strippedBody },
        }
      );

      // KV更新: email/nameを含めてTTLリセット
      if (env.THREAD_MAP) {
        const updated: ThreadMapValue = {
          ...existingThread,
          email: recipientEmail,
          name: recipientName,
          branchNumber: nextBranch,
          detailRecordId: detailId || existingThread.detailRecordId,
        };
        await env.THREAD_MAP.put(
          kvQuestionId,
          JSON.stringify(updated),
          { expirationTtl: 60 * 60 * 24 * 30 }
        ).catch((err) => console.error("KV put error:", err));
      }
    }

    // 新規スレッド（既存KVなし）の場合もKV保存
    if (!existingThread && messageTs && env.THREAD_MAP) {
      const kvValue: ThreadMapValue = {
        channel: env.SLACK_CHANNEL_ID || "",
        ts: messageTs,
        email: recipientEmail,
        name: recipientName,
        questionId: effectiveQuestionId,
      };
      await env.THREAD_MAP.put(
        effectiveQuestionId,
        JSON.stringify(kvValue),
        { expirationTtl: 60 * 60 * 24 * 30 }
      ).catch((err) => console.error("KV put error:", err));
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: jsonHeaders,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
}
