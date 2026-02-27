import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { GuideArticle, GuideArticleSummary } from "@/types/guide";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getGuideArticle(
  service: string,
  category: string,
  slug: string
): GuideArticle | null {
  const filePath = path.join(CONTENT_DIR, service, category, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug: data.slug || slug,
    title: data.title || "",
    category: data.category || category,
    order: data.order || 0,
    description: data.description || "",
    content,
    service,
  };
}

export function getGuideArticlesByCategory(
  service: string,
  category: string
): GuideArticleSummary[] {
  const categoryDir = path.join(CONTENT_DIR, service, category);

  if (!fs.existsSync(categoryDir)) return [];

  const files = fs.readdirSync(categoryDir).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => {
      const fileContent = fs.readFileSync(
        path.join(categoryDir, file),
        "utf-8"
      );
      const { data } = matter(fileContent);
      const slug = data.slug || file.replace(".md", "");

      return {
        slug,
        title: data.title || "",
        category: data.category || category,
        order: data.order || 0,
        description: data.description || "",
        service,
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function getAllGuideParams(
  service: string
): { category: string; slug: string }[] {
  const serviceDir = path.join(CONTENT_DIR, service);

  if (!fs.existsSync(serviceDir)) return [];

  const categories = fs
    .readdirSync(serviceDir)
    .filter((f) => fs.statSync(path.join(serviceDir, f)).isDirectory());

  const params: { category: string; slug: string }[] = [];

  for (const category of categories) {
    const categoryDir = path.join(serviceDir, category);
    const files = fs.readdirSync(categoryDir).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const fileContent = fs.readFileSync(
        path.join(categoryDir, file),
        "utf-8"
      );
      const { data } = matter(fileContent);
      const slug = data.slug || file.replace(".md", "");
      params.push({ category, slug });
    }
  }

  return params;
}
