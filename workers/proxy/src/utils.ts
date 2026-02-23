export const cleanInline = (v: unknown): string =>
  String(v == null ? '' : v)
    .replace(/\s+/g, ' ')
    .trim();

export const normalizeMultiline = (v: unknown): string =>
  String(v == null ? '' : v)
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

export const unique = <T>(arr: T[]): T[] => [...new Set(arr)];

const stopWords = new Set([
  'です', 'ます', 'する', 'いる', 'ある', 'こと', 'ため',
  'よう', 'ください', '確認', '設定', '操作', '画面',
  'ソトバコ', 'ポータル', 'kintone',
]);

const htmlEntityMap: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'",
};

export const decodeHtmlEntities = (input: unknown): string => {
  let s = String(input == null ? '' : input);
  s = s.replace(/&#(\d+);/g, (_, n) => {
    const code = Number(n);
    return Number.isFinite(code) ? String.fromCodePoint(code) : _;
  });
  s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, n) => {
    const code = parseInt(n, 16);
    return Number.isFinite(code) ? String.fromCodePoint(code) : _;
  });
  s = s.replace(/&([a-zA-Z0-9#]+);/g, (m, name) =>
    htmlEntityMap[name] ? htmlEntityMap[name] : m,
  );
  return s;
};

export const stripHtmlToText = (html: unknown): string =>
  normalizeMultiline(
    decodeHtmlEntities(
      String(html == null ? '' : html)
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|section|article|li|h[1-6]|tr)>/gi, '\n')
        .replace(/<[^>]*>/g, ' '),
    )
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n[ \t]+/g, '\n'),
  );

export const extractTitleFromHtml = (html: string, fallback: string): string => {
  const m = String(html || '').match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return fallback;
  const title = cleanInline(decodeHtmlEntities(m[1]));
  return title || fallback;
};

export const extractHrefLinks = (html: string, currentUrl: string): string[] => {
  const links: string[] = [];
  const re = /href\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi;
  let m;
  while ((m = re.exec(String(html || ''))) !== null) {
    const raw = m[1] || m[2] || m[3] || '';
    if (!raw || raw.startsWith('#') || raw.startsWith('javascript:') || raw.startsWith('mailto:'))
      continue;
    try {
      const resolved = new URL(raw, currentUrl);
      resolved.hash = '';
      resolved.search = '';
      links.push(resolved.href);
    } catch {
      // ignore invalid url
    }
  }
  return unique(links);
};

export const tokenize = (s: unknown): string[] => {
  const found = String(s == null ? '' : s)
    .toLowerCase()
    .match(/[a-z0-9][a-z0-9._-]{1,}|[一-龯ぁ-んァ-ヶー]{2,}/g);
  if (!found) return [];
  return unique(found.filter((w) => !stopWords.has(w)));
};
