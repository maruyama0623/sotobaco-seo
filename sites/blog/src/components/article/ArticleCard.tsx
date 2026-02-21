import Link from "next/link";
import type { ArticleSummary } from "@/types/article";
import ArticleThumbnail from "./ArticleThumbnail";

export default function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link
      href={`/articles/${article.slug}/`}
      className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
    >
      <ArticleThumbnail title={article.title} size="md" />
      <div className="p-5">
        <h2 className="text-lg font-bold leading-snug text-gray-900 group-hover:text-brand">
          {article.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {article.description}
        </p>
        {article.publishedAt && (
          <time className="mt-3 block text-xs text-gray-400">
            {article.publishedAt}
          </time>
        )}
      </div>
    </Link>
  );
}
