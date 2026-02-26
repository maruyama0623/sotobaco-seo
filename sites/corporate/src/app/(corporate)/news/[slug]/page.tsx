import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllNewsSlugs, getNewsBySlug } from "@/lib/news";
import { buildNewsMetadata, buildNewsJsonLd, buildNewsBreadcrumbJsonLd } from "@/lib/seo";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getNewsBySlug(params.slug);
  if (!article) return {};
  return buildNewsMetadata(article);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default async function NewsDetailPage({ params }: Props) {
  const article = await getNewsBySlug(params.slug);
  if (!article) notFound();

  const articleJsonLd = buildNewsJsonLd(article);
  const breadcrumbJsonLd = buildNewsBreadcrumbJsonLd(article);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="py-16 md:py-[60px]">
      <div className="mx-auto max-w-[800px] px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-brand">
            トップ
          </Link>
          <span>/</span>
          <Link href="/news/" className="hover:text-brand">
            お知らせ
          </Link>
          <span>/</span>
          <span className="truncate text-gray-600">{article.title}</span>
        </nav>

        {/* Header */}
        <div className="mt-8">
          <div className="flex items-center gap-3">
            {article.categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-brand/10 px-3 py-0.5 text-xs font-bold text-brand"
              >
                {cat}
              </span>
            ))}
            <time className="text-xs text-gray-400" dateTime={article.date}>
              {formatDate(article.date)}
            </time>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold leading-relaxed text-gray-900 md:text-3xl">
            {article.title}
          </h1>
        </div>

        {/* Body */}
        <div
          className="prose prose-gray mt-10 max-w-none prose-headings:font-extrabold prose-a:text-brand prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: article.htmlContent }}
        />

        {/* Back */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <Link
            href="/news/"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline"
          >
            ← お知らせ一覧に戻る
          </Link>
        </div>
      </div>
    </section>
    </>
  );
}
