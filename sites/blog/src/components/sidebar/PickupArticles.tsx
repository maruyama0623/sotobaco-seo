import Link from "next/link";
import type { ArticleSummary } from "@/types/article";

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
      <p className="mb-3 text-sm font-bold text-gray-700">ピックアップ記事</p>
      <div className="space-y-4">
        {pickupArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}/`}
            className="group block overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
          >
            {/* サムネイル */}
            <div className="relative aspect-video bg-brand p-2">
              <div className="relative flex h-full w-full flex-col rounded bg-white px-4 py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-yoko.svg"
                  alt="ソトバコ"
                  className="h-5 w-auto self-center"
                />
                <div className="flex flex-1 items-center justify-center">
                  <p className="break-auto-phrase text-center text-xs font-extrabold leading-snug text-gray-900">
                    {article.title.split("｜").map((part, i) => (
                      <span key={i}>
                        {i > 0 && <br />}
                        {part}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
            {/* テキスト */}
            <div className="p-3">
              <p className="text-xs font-bold leading-snug text-gray-900 group-hover:text-brand">
                {article.title}
              </p>
              {article.publishedAt && (
                <time className="mt-1.5 block text-[10px] text-gray-400">
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
