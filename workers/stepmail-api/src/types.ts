export interface Env {
  STEPMAIL_KV: KVNamespace;
  SENDGRID_API_KEY: string;
  WEBHOOK_SECRET: string;
  UNSUBSCRIBE_SECRET: string;
  SLACK_WEBHOOK_URL: string;
  FROM_EMAIL: string;
  FROM_NAME: string;
  TEMPLATE_ID_STEP1: string;
  TEMPLATE_ID_STEP2: string;
  TEMPLATE_ID_STEP3: string;
  TEMPLATE_ID_STEP4: string;
  TEMPLATE_ID_STEP5: string;
  TEMPLATE_ID_STEP6: string;
}

export interface EnrollmentRecord {
  email: string;
  companyName: string;
  enrolledAt: string; // ISO 8601
  currentStep: number; // 1〜6
  unsubscribed: boolean;
  lastSentAt: string; // ISO 8601
}

export interface EnrollRequest {
  email: string;
  companyName: string;
}

/** ステップ配信スケジュール（enrolledAt からの経過日数） */
export const STEP_SCHEDULE: Record<number, number> = {
  1: 0,  // 即時（enroll時に送信）
  2: 1,  // Day 1
  3: 3,  // Day 3
  4: 7,  // Day 7
  5: 14, // Day 14
  6: 21, // Day 21
};

/** KVレコードのTTL: 51日（21日 + 30日バッファ） */
export const KV_TTL_SECONDS = 51 * 24 * 60 * 60;

/** KVキーのプレフィックス */
export const KV_PREFIX = "sm:";
