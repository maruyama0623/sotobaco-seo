export type CategoryId = "kyoukan" | "houhou" | "kinou" | "7min" | "service";

export interface FaqItem {
  q: string;
  a: string;
}

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  category: CategoryId;
  tags: string[];
  ogImage: string;
  articleNumber: number;
  faq?: FaqItem[];
}

export interface Article extends ArticleFrontmatter {
  content: string;
  htmlContent: string;
}

export interface ArticleSummary extends ArticleFrontmatter {
  // Used for card listings (no full content)
}

export const CATEGORY_MAP: Record<
  CategoryId,
  { label: string; color: string; bg: string }
> = {
  kyoukan: { label: "お悩み", color: "text-blue-700", bg: "bg-blue-100" },
  houhou: { label: "解決方法", color: "text-emerald-700", bg: "bg-emerald-100" },
  kinou: { label: "機能活用", color: "text-purple-700", bg: "bg-purple-100" },
  "7min": { label: "導入ガイド", color: "text-amber-700", bg: "bg-amber-100" },
  service: { label: "料金・プラン", color: "text-rose-700", bg: "bg-rose-100" },
};
