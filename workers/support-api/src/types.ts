export interface Env {
  SENDGRID_API_KEY: string;
  SLACK_WEBHOOK_URL?: string;
  SLACK_BOT_TOKEN?: string;
  SLACK_SIGNING_SECRET?: string;
  SLACK_CHANNEL_ID?: string;
  FROM_EMAIL: string;
  REPLY_TO_EMAIL: string;
  CORS_ORIGIN: string;
  ANTHROPIC_API_KEY: string;
  REPLY_WEBHOOK_SECRET: string;
  THREAD_MAP: KVNamespace;
  KINTONE_SUBDOMAIN?: string;
  KINTONE_APP_ID_93?: string;
  KINTONE_APP_ID_94?: string;
  KINTONE_API_TOKEN_93?: string;
  KINTONE_API_TOKEN_94?: string;
  TITLE_PROXY_URL?: string;
}

export const CATEGORY_LABELS: Record<string, string> = {
  "sotobaco-portal": "ソトバコポータル",
  btone: "Btone",
  other: "その他",
};

export interface ContactBody {
  category?: string;
  company: string;
  name: string;
  email: string;
  message: string;
  _hp?: string;
}

export interface ReplyBody {
  from: string;
  subject: string;
  body: string;
  date: string;
  secret: string;
}

export interface AiResult {
  isSales: boolean;
  draft: string;
}

export interface SlackActionMeta {
  type: "contact" | "reply";
  email: string;
  name: string;
  subject: string;
}

export interface ThreadMapValue {
  channel: string;
  ts: string;
  kintoneRecordId?: string;
  questionId?: string;
  detailRecordId?: string;
  branchNumber?: number;
}
