import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuideArticle, getAllGuideParams } from "@/lib/guides";
import { markdownToHtml } from "@/lib/markdown";
import { buildGuideMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
  params: { category: string; slug: string };
}

export function generateStaticParams() {
  return getAllGuideParams("portal");
}

export function generateMetadata({ params }: PageProps): Metadata {
  const article = getGuideArticle("portal", params.category, params.slug);
  if (!article) return {};

  return buildGuideMetadata(
    article.title,
    article.description,
    `/portal/${params.category}/${params.slug}/`
  );
}

export default async function GuideArticlePage({ params }: PageProps) {
  const article = getGuideArticle("portal", params.category, params.slug);
  if (!article) notFound();

  const html = await markdownToHtml(article.content);

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "操作ガイド", url: `${SITE_URL}/` },
    { name: "ソトバコポータル", url: `${SITE_URL}/portal/` },
    {
      name: article.title,
      url: `${SITE_URL}/portal/${params.category}/${params.slug}/`,
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <article className="rounded-xl bg-white p-6 shadow-sm md:p-8">
        <h1 className="mb-6 border-l-4 border-primary pl-4 text-2xl font-bold text-gray-900">
          {article.title}
        </h1>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </>
  );
}
