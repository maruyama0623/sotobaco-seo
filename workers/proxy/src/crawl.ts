import type { Env, CrawledPage, CrawlMeta } from './types';
import {
  extractTitleFromHtml,
  stripHtmlToText,
  extractHrefLinks,
  unique,
} from './utils';

const GUIDE_ROOT_URL = 'https://guide.sotobaco.com/portal/index.html';
const BLOG_ROOT_URL = 'https://blog.sotobaco.com/';
const LP_ROOT_URL = 'https://sotobaco.com/sotobacoportal/';
const GUIDE_MAX_PAGES = 24;
const BLOG_MAX_PAGES = 20;
const LP_MAX_PAGES = 10;
const FETCH_TIMEOUT_MS = 12000;

// ---------------------------------------------------------------------------
// Fetch helper
// ---------------------------------------------------------------------------

async function fetchText(url: string): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: 'follow' });
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// URL filters
// ---------------------------------------------------------------------------

function isAllowedGuideUrl(url: string): boolean {
  const root = new URL(GUIDE_ROOT_URL);
  const u = new URL(url);
  if (u.host !== root.host) return false;
  const rootDir = root.pathname.endsWith('/')
    ? root.pathname
    : root.pathname.replace(/[^/]*$/, '');
  if (!u.pathname.startsWith(rootDir)) return false;
  if (!/(\.html?$|\/$)/i.test(u.pathname)) return false;
  return true;
}

function isAllowedBlogUrl(url: string): boolean {
  const u = new URL(url);
  const root = new URL(BLOG_ROOT_URL);
  if (u.host !== root.host) return false;
  if (u.pathname === '/') return true;
  if (u.pathname.startsWith('/articles/')) return true;
  return false;
}

function isAllowedLpUrl(url: string): boolean {
  const u = new URL(url);
  if (u.host !== 'sotobaco.com') return false;
  if (!u.pathname.startsWith('/sotobacoportal')) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Generic crawler (BFS with parallel fetch)
// ---------------------------------------------------------------------------

async function crawlPages(
  startUrl: string,
  maxPages: number,
  isAllowed: (url: string) => boolean,
): Promise<CrawledPage[]> {
  const visited = new Set<string>();
  let queue = [new URL(startUrl).href];
  const pages: CrawledPage[] = [];

  while (queue.length && pages.length < maxPages) {
    // parallel fetch up to 3 pages at a time
    const batch = queue.splice(0, 3).filter((url) => {
      if (visited.has(url)) return false;
      visited.add(url);
      return isAllowed(url);
    });

    const results = await Promise.allSettled(
      batch.map(async (url) => {
        const html = await fetchText(url);
        return { url, html };
      }),
    );

    for (const r of results) {
      if (r.status !== 'fulfilled') continue;
      const { url, html } = r.value;
      const title = extractTitleFromHtml(html, url);
      const text = stripHtmlToText(html);
      if (text.length > 80) {
        pages.push({ url, title, text: text.slice(0, 12000) });
      }

      const links = extractHrefLinks(html, url)
        .filter((next) => !visited.has(next) && isAllowed(next))
        .slice(0, 60);
      queue.push(...links);
    }

    queue = unique(queue);
  }
  return pages;
}

// ---------------------------------------------------------------------------
// KV read/write
// ---------------------------------------------------------------------------

type Source = 'guide' | 'blog' | 'lp';

async function writeToKV(
  kv: KVNamespace,
  source: Source,
  pages: CrawledPage[],
  error: string,
): Promise<void> {
  const meta: CrawlMeta = {
    fetchedAt: Date.now(),
    pageCount: pages.length,
    error,
  };
  await Promise.all([
    kv.put(`pages:${source}`, JSON.stringify(pages)),
    kv.put(`meta:${source}`, JSON.stringify(meta)),
  ]);
}

export async function getCachedPages(
  kv: KVNamespace,
  source: Source,
): Promise<CrawledPage[]> {
  const raw = await kv.get(`pages:${source}`);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CrawledPage[];
  } catch {
    return [];
  }
}

export async function getCachedMeta(
  kv: KVNamespace,
  source: Source,
): Promise<CrawlMeta | null> {
  const raw = await kv.get(`meta:${source}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CrawlMeta;
  } catch {
    return null;
  }
}

export async function getAllCachedPages(
  kv: KVNamespace,
): Promise<CrawledPage[]> {
  const [guide, blog, lp] = await Promise.all([
    getCachedPages(kv, 'guide'),
    getCachedPages(kv, 'blog'),
    getCachedPages(kv, 'lp'),
  ]);
  return [
    ...guide.map((p) => ({ ...p, source: 'guide' as const })),
    ...blog.map((p) => ({ ...p, source: 'blog' as const })),
    ...lp.map((p) => ({ ...p, source: 'lp' as const })),
  ];
}

// ---------------------------------------------------------------------------
// Cron entry point
// ---------------------------------------------------------------------------

export async function runCrawl(env: Env): Promise<void> {
  const kv = env.PAGE_CACHE;

  const tasks: Array<{
    source: Source;
    fn: () => Promise<CrawledPage[]>;
  }> = [
    { source: 'guide', fn: () => crawlPages(GUIDE_ROOT_URL, GUIDE_MAX_PAGES, isAllowedGuideUrl) },
    { source: 'blog', fn: () => crawlPages(BLOG_ROOT_URL, BLOG_MAX_PAGES, isAllowedBlogUrl) },
    { source: 'lp', fn: () => crawlPages(LP_ROOT_URL, LP_MAX_PAGES, isAllowedLpUrl) },
  ];

  await Promise.all(
    tasks.map(async ({ source, fn }) => {
      try {
        const pages = await fn();
        await writeToKV(kv, source, pages, '');
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'crawl failed';
        await writeToKV(kv, source, [], msg);
      }
    }),
  );
}
