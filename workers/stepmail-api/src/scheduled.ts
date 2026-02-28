import type { Env, EnrollmentRecord } from "./types";
import { KV_PREFIX, KV_TTL_SECONDS, STEP_SCHEDULE } from "./types";
import { sendStepEmail } from "./email";
import { notifySlack, buildCronResultBlocks } from "./slack";

/** Cron Trigger ハンドラ: Step 2〜6の配信 */
export async function handleScheduled(env: Env): Promise<void> {
  const now = Date.now();
  let sent = 0;
  let skipped = 0;
  let errors = 0;

  // KVからプレフィックス sm: のレコードを全取得
  let cursor: string | undefined;
  const records: Array<{ key: string; record: EnrollmentRecord }> = [];

  do {
    const list = await env.STEPMAIL_KV.list({
      prefix: KV_PREFIX,
      cursor,
    });

    for (const key of list.keys) {
      const data = await env.STEPMAIL_KV.get(key.name, "json") as EnrollmentRecord | null;
      if (data) {
        records.push({ key: key.name, record: data });
      }
    }

    cursor = list.list_complete ? undefined : list.cursor;
  } while (cursor);

  // workerUrl はCron実行時に取得できないため固定値を使用
  const workerUrl = "https://stepmail-api.sotobaco.workers.dev";

  for (const { key, record } of records) {
    // 配信停止済み → スキップ
    if (record.unsubscribed) {
      skipped++;
      continue;
    }

    // 全ステップ配信済み → スキップ
    if (record.currentStep >= 6) {
      skipped++;
      continue;
    }

    const nextStep = record.currentStep + 1;
    const daysRequired = STEP_SCHEDULE[nextStep];
    if (daysRequired === undefined) {
      skipped++;
      continue;
    }

    // enrolledAt からの経過日数を計算
    const enrolledAt = new Date(record.enrolledAt).getTime();
    const elapsedDays = Math.floor((now - enrolledAt) / (1000 * 60 * 60 * 24));

    if (elapsedDays < daysRequired) {
      skipped++;
      continue;
    }

    // 送信
    try {
      await sendStepEmail(
        env,
        record.email,
        record.companyName,
        nextStep,
        workerUrl
      );

      // KVレコード更新
      record.currentStep = nextStep;
      record.lastSentAt = new Date().toISOString();
      await env.STEPMAIL_KV.put(key, JSON.stringify(record), {
        expirationTtl: KV_TTL_SECONDS,
      });

      sent++;
    } catch (e) {
      console.error(`Step ${nextStep} send failed:`, (e as Error).message);
      errors++;
    }
  }

  // 処理件数が1件以上の場合のみSlack通知
  if (sent > 0 || errors > 0) {
    await notifySlack(env, buildCronResultBlocks(sent, skipped, errors));
  }
}
