export interface Env {
  BLOG_WEBHOOK_SECRET: string;
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;
  SLACK_WEBHOOK_URL: string;
  KINTONE_SUBDOMAIN: string;
  KINTONE_APP_ID_BLOG: string;
  KINTONE_API_TOKEN_BLOG: string;
  PUBLISH_LOCK: KVNamespace;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  articleNumber: number;
  publishedAt: string;
  filename: string;
}

export interface SyncRequest {
  articles: ArticleMeta[];
}

export interface PublishRequest {
  slug: string;
  recordId: string;
  filename: string;
}
