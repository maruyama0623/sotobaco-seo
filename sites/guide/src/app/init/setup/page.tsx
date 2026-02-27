import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { markdownToHtml } from "@/lib/markdown";
import { buildGuideMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const CONTENT_PATH = path.join(
  process.cwd(),
  "content",
  "init",
  "setup.md"
);

function getContent() {
  const fileContent = fs.readFileSync(CONTENT_PATH, "utf-8");
  return matter(fileContent);
}

export function generateMetadata(): Metadata {
  const { data } = getContent();
  return buildGuideMetadata(
    data.title,
    data.description,
    "/init/setup/"
  );
}

export default async function InitSetupPage() {
  const { data, content } = getContent();
  const html = await markdownToHtml(content);

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "操作ガイド", url: `${SITE_URL}/` },
    { name: data.title, url: `${SITE_URL}/init/setup/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <article className="rounded-xl bg-white p-6 shadow-sm md:p-8">
        <h1 className="mb-6 border-l-4 border-primary pl-4 text-2xl font-bold text-gray-900">
          {data.title}
        </h1>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </>
  );
}
