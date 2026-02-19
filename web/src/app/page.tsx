import { getAllArticleSummaries } from "@/lib/articles";
import ArticleCard from "@/components/article/ArticleCard";

export default function HomePage() {
  const articles = getAllArticleSummaries();

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-light">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:py-16">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            ソトバコ ブログ
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
            kintoneのポータルをもっと使いやすく。
            <br className="hidden sm:block" />
            アプリ整理・部署別表示・ダッシュボード化のノウハウをお届けします。
          </p>
        </div>
      </section>

      {/* Article Grid */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        {articles.length === 0 ? (
          <p className="text-center text-gray-500">記事を準備中です。</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
