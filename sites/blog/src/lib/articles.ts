import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { markdownToHtml } from "./markdown";
import type { Article, ArticleFrontmatter, ArticleSummary } from "@/types/article";

const ARTICLES_DIR = path.join(process.cwd(), "articles");

function getArticleFiles(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();
}

function parseArticleFile(filename: string): { frontmatter: ArticleFrontmatter; content: string } | null {
  const filePath = path.join(ARTICLES_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  if (!data.slug || !data.title) return null;

  return {
    frontmatter: {
      title: data.title,
      slug: data.slug,
      description: data.description ?? "",
      publishedAt: data.publishedAt ?? "",
      category: data.category ?? "kyoukan",
      tags: data.tags ?? [],
      ogImage: data.ogImage ?? "",
      articleNumber: data.articleNumber ?? 0,
      faq: Array.isArray(data.faq) ? data.faq : undefined,
    },
    content,
  };
}

export function getAllArticleSummaries(): ArticleSummary[] {
  return getArticleFiles()
    .map((f) => {
      const parsed = parseArticleFile(f);
      if (!parsed) return null;
      return { ...parsed.frontmatter };
    })
    .filter((a): a is ArticleSummary => a !== null && !!a.publishedAt)
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export function getAllSlugs(): string[] {
  return getArticleFiles()
    .map((f) => {
      const parsed = parseArticleFile(f);
      if (!parsed || !parsed.frontmatter.publishedAt) return null;
      return parsed.frontmatter.slug;
    })
    .filter((s): s is string => s !== null);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  for (const filename of getArticleFiles()) {
    const parsed = parseArticleFile(filename);
    if (!parsed || parsed.frontmatter.slug !== slug) continue;
    if (!parsed.frontmatter.publishedAt) return null;

    const htmlContent = await markdownToHtml(parsed.content);
    return {
      ...parsed.frontmatter,
      content: parsed.content,
      htmlContent,
    };
  }
  return null;
}
