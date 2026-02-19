import Link from "next/link";
import type { ArticleSummary } from "@/types/article";
export default function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link
      href={`/articles/${article.slug}/`}
      className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-video bg-brand p-3">
        <div className="relative flex h-full w-full flex-col rounded bg-white px-6 py-4">
          {/* ロゴ（上部固定） */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-yoko.svg"
            alt="ソトバコ"
            className="h-7 w-auto self-center"
          />
          {/* タイトル（中央） */}
          <div className="flex flex-1 items-center justify-center">
            <p className="thumbnail-title break-auto-phrase text-center">
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
