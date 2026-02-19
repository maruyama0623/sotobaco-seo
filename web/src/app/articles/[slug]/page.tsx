import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getArticleBySlug } from "@/lib/articles";
import { buildArticleMetadata, buildArticleJsonLd } from "@/lib/seo";
import { extractToc } from "@/lib/markdown";
import ArticleBody from "@/components/article/ArticleBody";
import TableOfContents from "@/components/article/TableOfContents";
import CtaBanner from "@/components/ui/CtaBanner";
import Breadcrumb from "@/components/ui/Breadcrumb";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};
  return buildArticleMetadata(article);
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const toc = extractToc(article.htmlContent);
  const jsonLd = buildArticleJsonLd(article);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: article.title },
          ]}
        />

        {/* Article Header */}
        {article.publishedAt && (
          <div className="mt-6">
            <time className="text-sm text-gray-400">
              {article.publishedAt}
            </time>
          </div>
        )}

        {/* 2-column layout */}
        <div className="mt-8 flex gap-10">
          {/* Main content */}
          <article className="min-w-0 flex-1">
            <ArticleBody html={article.htmlContent} />

            <div className="mt-10">
              <CtaBanner
                imageSrc="/images/smartphone_multi-device.png"
                imageAlt="ソトバコポータルのマルチデバイス対応画面"
                heading="kintoneのポータルを、もっと使いやすく"
                description="ソトバコポータルなら、ドラッグ&ドロップだけで部署別ポータルを実現できます。フリープランは期間制限なし。最短7分で導入できます。"
                buttonText="フリープランを試す"
                buttonHref="https://sotobaco.com/sotobacoportal"
              />
            </div>
          </article>

          {/* Sidebar (desktop only) */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-6 space-y-6">
              <TableOfContents items={toc} />

              {/* Sidebar CTA Card */}
              <div className="rounded-xl border border-gray-100 bg-white p-5 text-center">
                <p className="text-sm font-bold text-gray-700">
                  ポータル整理を始めてみませんか？
                </p>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  フリープラン・期間制限なし
                </p>
                <a
                  href="https://sotobaco.com/sotobacoportal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block rounded-lg bg-brand px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-dark"
                >
                  フリープランを試す
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
