import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

const NEWS_DIR = path.join(process.cwd(), "news");

export type NewsCategory = "アップデート情報" | "お知らせ";

export type NewsFrontmatter = {
  title: string;
  date: string;
  categories: NewsCategory[];
  excerpt: string;
};

export type NewsItem = NewsFrontmatter & {
  slug: string;
};

export type NewsArticle = NewsItem & {
  htmlContent: string;
};

function getNewsFiles(): string[] {
  if (!fs.existsSync(NEWS_DIR)) return [];
  return fs
    .readdirSync(NEWS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "");
}

function parseNewsFile(
  filename: string
): { frontmatter: NewsFrontmatter; content: string; slug: string } | null {
  const filePath = path.join(NEWS_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  if (!data.title || !data.date) return null;

  return {
    frontmatter: {
      title: data.title,
      date: data.date,
      categories: data.categories ?? ["お知らせ"],
      excerpt: data.excerpt ?? "",
    },
    content,
    slug: slugFromFilename(filename),
  };
}

export function getAllNews(): NewsItem[] {
  return getNewsFiles()
    .map((f) => {
      const parsed = parseNewsFile(f);
      if (!parsed) return null;
      return { ...parsed.frontmatter, slug: parsed.slug };
    })
    .filter((n): n is NewsItem => n !== null);
}

export function getAllNewsSlugs(): string[] {
  return getNewsFiles().map(slugFromFilename);
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}

export async function getNewsBySlug(
  slug: string
): Promise<NewsArticle | null> {
  for (const filename of getNewsFiles()) {
    if (slugFromFilename(filename) !== slug) continue;
    const parsed = parseNewsFile(filename);
    if (!parsed) return null;

    const htmlContent = await markdownToHtml(parsed.content);
    return {
      ...parsed.frontmatter,
      slug: parsed.slug,
      htmlContent,
    };
  }
  return null;
}
