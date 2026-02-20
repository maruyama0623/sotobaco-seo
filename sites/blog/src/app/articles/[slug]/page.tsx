import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getArticleBySlug, getAllArticleSummaries } from "@/lib/articles";
import { buildArticleMetadata, buildArticleJsonLd } from "@/lib/seo";
import ArticleBody from "@/components/article/ArticleBody";
import CtaBanner from "@/components/ui/CtaBanner";
import SidebarCta from "@/components/sidebar/SidebarCta";
import PickupArticles from "@/components/sidebar/PickupArticles";

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

  const allArticles = getAllArticleSummaries();
  const jsonLd = buildArticleJsonLd(article);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[1200px] px-4 py-6">
        {/* 2-column layout */}
        <div className="mt-4 flex gap-6">
          {/* Main content */}
          <article className="min-w-0 flex-1 rounded-lg bg-[#FCFCFC] p-6 lg:p-10">
            {/* Article Header */}
            <h1 className="text-[28px] font-bold leading-[45px] text-gray-900 lg:text-[36px] lg:leading-[51px]">
              {article.title}
            </h1>
            {article.publishedAt && (
              <div className="mt-4">
                <time className="text-sm text-gray-400">
                  {article.publishedAt}
                </time>
              </div>
            )}
            <hr className="mt-6 mb-8 border-t-[3px] border-brand" />

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
              <SidebarCta />
              <PickupArticles
                articles={allArticles}
                currentSlug={params.slug}
              />
            </div>
          </aside>
        </div>

        {/* 記事一覧へ戻るボタン */}
        <div className="mt-10 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-10 py-3.5 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            記事一覧へ
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </>
  );
}
