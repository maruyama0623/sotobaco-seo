import type { CrawledPage } from './types';
import { normalizeMultiline, tokenize } from './utils';

const SOURCE_LABELS: Record<string, string> = {
  guide: 'ガイド',
  blog: 'ブログ',
  lp: 'LP',
};

export function pickGuideSnippet(
  page: CrawledPage,
  tokens: string[],
  limit = 540,
): string {
  const src = normalizeMultiline(page.text || '');
  if (!src) return '';
  if (!tokens.length) return src.slice(0, limit);

  const lower = src.toLowerCase();
  let hit = -1;
  for (const tk of tokens) {
    const idx = lower.indexOf(tk.toLowerCase());
    if (idx >= 0 && (hit < 0 || idx < hit)) {
      hit = idx;
    }
  }
  if (hit < 0) return src.slice(0, limit);

  let start = Math.max(0, hit - 220);
  let end = Math.min(src.length, start + limit);
  const prevNl = src.lastIndexOf('\n', start);
  if (prevNl >= 0) start = prevNl + 1;
  const nextNl = src.indexOf('\n', end);
  if (nextNl >= 0) end = nextNl;
  return src.slice(start, end).trim();
}

interface BuildContextInput {
  question: string;
  candidates?: Array<{ question: string; answer: string }>;
}

export function buildFullContext(
  pages: CrawledPage[],
  input: BuildContextInput,
): string {
  if (!pages.length) return '';

  const seed = [
    normalizeMultiline(input.question),
    ...(input.candidates || []).map(
      (c) =>
        `${normalizeMultiline(c.question)}\n${normalizeMultiline(c.answer)}`,
    ),
  ].join('\n');
  const tokens = tokenize(seed).slice(0, 24);

  const scored = pages
    .map((p) => {
      const t = `${p.title}\n${p.text}`.toLowerCase();
      let score = 0;
      tokens.forEach((tk) => {
        if (t.includes(tk))
          score += p.title.toLowerCase().includes(tk) ? 3 : 1;
      });
      return { page: p, score };
    })
    .sort((a, b) => b.score - a.score);

  const selected = scored.some((x) => x.score > 0)
    ? scored.filter((x) => x.score > 0).slice(0, 6)
    : scored.slice(0, 3);

  return selected
    .map((x, idx) => {
      const label = SOURCE_LABELS[x.page.source || ''] || x.page.source || '';
      const snippet = pickGuideSnippet(x.page, tokens);
      return `[${label}${idx + 1}] ${x.page.title}\nURL: ${x.page.url}\n抜粋:\n${snippet}`;
    })
    .join('\n\n');
}

export function scoreAndRankPages(
  pages: CrawledPage[],
  question: string,
): Array<{ page: CrawledPage; score: number }> {
  const tokens = tokenize(question).slice(0, 24);
  return pages
    .map((p) => {
      const t = `${p.title}\n${p.text}`.toLowerCase();
      let score = 0;
      tokens.forEach((tk) => {
        if (t.includes(tk))
          score += p.title.toLowerCase().includes(tk) ? 3 : 1;
      });
      return { page: p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}
