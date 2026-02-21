import Link from "next/link";
import type { ArticleSummary } from "@/types/article";
import ArticleThumbnail from "@/components/article/ArticleThumbnail";
import SidebarHeading from "@/components/ui/SidebarHeading";

interface PickupArticlesProps {
  articles: ArticleSummary[];
  currentSlug: string;
}

export default function PickupArticles({
  articles,
  currentSlug,
}: PickupArticlesProps) {
  const pickupArticles = articles
    .filter((a) => a.slug !== currentSlug)
    .slice(0, 5);

  if (pickupArticles.length === 0) return null;

  return (
    <div>
      <SidebarHeading>ピックアップ記事</SidebarHeading>
      <div className="space-y-4">
        {pickupArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}/`}
            className="group block overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
          >
            <ArticleThumbnail title={article.title} size="sm" />
            {/* テキスト */}
            <div className="p-3">
              <p className="text-xs font-bold leading-snug text-gray-900 group-hover:text-brand">
                {article.title}
              </p>
              {article.publishedAt && (
                <time className="mt-1.5 block text-xs text-gray-400">
                  {article.publishedAt}
                </time>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
