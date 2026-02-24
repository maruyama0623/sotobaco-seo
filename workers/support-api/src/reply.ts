import type { Env, ReplyBody, SlackActionMeta, ThreadMapValue } from "./types";
import { stripQuotedContent, extractEmail, extractName } from "./email";
import { AI_SYSTEM_PROMPT_REPLY, generateAiDraft, fetchRelevantPages } from "./ai";
import { fetchSimilarAnswers, isKintoneEnabled, toKintoneDate, createKintoneRecord } from "./kintone";
import { buildSlackBlocks, sendSlackMessage } from "./slack";

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

  // Verify webhook secret
  if (!env.REPLY_WEBHOOK_SECRET || body.secret !== env.REPLY_WEBHOOK_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: jsonHeaders,
    });
  }

  if (!body.from || !body.body) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const strippedBody = stripQuotedContent(body.body);

  try {
    const userMessage = `差出人: ${body.from}\n件名: ${body.subject}\n\nメール本文:\n${strippedBody}`;

    const aiResult = env.ANTHROPIC_API_KEY
      ? await (async () => {
          const [pastQA, relevantPages] = await Promise.all([
            fetchSimilarAnswers(env, strippedBody),
            fetchRelevantPages(env, strippedBody),
          ]);
          return generateAiDraft(
            env,
            AI_SYSTEM_PROMPT_REPLY,
            userMessage,
            pastQA,
            relevantPages
          );
        })().catch((err) => {
          console.error("AI draft generation error:", err);
          return null;
        })
      : null;

    const recipientEmail = extractEmail(body.from);
    const recipientName = extractName(body.from);

    const actionMeta: SlackActionMeta | null = env.SLACK_BOT_TOKEN
      ? {
          type: "reply",
          email: recipientEmail,
          name: recipientName,
          subject: body.subject
            ? `Re: ${body.subject}`
            : "Re: お問い合わせについて",
        }
      : null;

    const blocks = buildSlackBlocks(
      "メール返信",
      [
        { label: "差出人", value: body.from },
        { label: "件名", value: body.subject || "(件名なし)" },
        { label: "受信日時", value: body.date || "-" },
      ],
      "メール本文",
      strippedBody,
      aiResult,
      actionMeta
    );

    // スレッド管理: 同じメールアドレスの既存スレッドを検索
    let threadTs: string | undefined;
    let existingThread: ThreadMapValue | undefined;
    if (env.THREAD_MAP) {
      const stored = await env.THREAD_MAP.get(recipientEmail.toLowerCase());
      if (stored) {
        try {
          existingThread = JSON.parse(stored) as ThreadMapValue;
          threadTs = existingThread.ts;
        } catch { /* ignore */ }
      }
    }

    const messageTs = await sendSlackMessage(env, blocks, threadTs).catch(
      (err) => {
        console.error("Slack notification error:", err);
        return null;
      }
    );

    // kintone: App 94に新しい枝番で問い合わせ内容を追加 + App 93を「未回答」に戻す
    if (existingThread?.questionId && isKintoneEnabled(env)) {
      const nextBranch = (existingThread.branchNumber || 0) + 1;
      const detailId = await createKintoneRecord(
        env,
        env.KINTONE_APP_ID_94!,
        {
          question_id: { value: existingThread.questionId },
          branch_number: { value: nextBranch },
          question_date: { value: toKintoneDate() },
          question_detail: { value: strippedBody },
        }
      );

      // KV更新: 新しい枝番とdetailRecordIdを保存
      if (env.THREAD_MAP) {
        const updated: ThreadMapValue = {
          ...existingThread,
          branchNumber: nextBranch,
          detailRecordId: detailId || existingThread.detailRecordId,
        };
        await env.THREAD_MAP.put(
          recipientEmail.toLowerCase(),
          JSON.stringify(updated),
          { expirationTtl: 60 * 60 * 24 * 30 }
        ).catch((err) => console.error("KV put error:", err));
      }
    } else if (!threadTs && messageTs && env.THREAD_MAP) {
      // スレッドがなかった場合、新規スレッドとして保存（30日間保持）
      const kvValue: ThreadMapValue = {
        channel: env.SLACK_CHANNEL_ID || "",
        ts: messageTs,
      };
      await env.THREAD_MAP.put(
        recipientEmail.toLowerCase(),
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
