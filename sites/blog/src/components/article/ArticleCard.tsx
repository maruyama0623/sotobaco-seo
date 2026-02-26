import Link from "next/link";
import type { ArticleSummary } from "@/types/article";
import ArticleThumbnail from "./ArticleThumbnail";

export default function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link
      href={`/articles/${article.slug}/`}
      className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md sm:flex-row sm:items-stretch"
    >
      <div className="aspect-[306/172] w-full shrink-0 sm:w-[306px]">
        <ArticleThumbnail title={article.title} size="md" />
      </div>
      <div className="flex flex-col justify-center p-4 sm:p-5">
        {article.publishedAt && (
          <time className="text-xs text-gray-400">
            {article.publishedAt}
          </time>
        )}
        <h2 className="mt-1 text-base font-bold leading-snug text-gray-900 group-hover:text-brand sm:text-lg">
          {article.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500">
          {article.description}
        </p>
      </div>
    </Link>
  );
}
