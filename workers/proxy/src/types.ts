export interface Env {
  PAGE_CACHE: KVNamespace;
  ANTHROPIC_API_KEY: string;
  PROXY_TOKEN: string;
  GA_CLIENT_EMAIL: string;
  GA_PRIVATE_KEY: string;
  GA_PROJECT_ID: string;
  GA_PROPERTY_ID_BLOG: string;
  GA_PROPERTY_ID_SITE: string;
}

export interface CrawledPage {
  url: string;
  title: string;
  text: string;
  source?: 'guide' | 'blog' | 'lp';
}

export interface CrawlMeta {
  fetchedAt: number;
  pageCount: number;
  error: string;
}
