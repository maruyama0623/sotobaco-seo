import { getAllArticleSummaries } from "@/lib/articles";
import { MESSAGING } from "@/lib/constants";
import ArticleCard from "@/components/article/ArticleCard";
import ArticleList from "@/components/article/ArticleList";

export default function HomePage() {
  const articles = getAllArticleSummaries();

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-light">
        <div className="mx-auto max-w-[1200px] px-4 py-12 text-center sm:py-16">
          <h1 className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl md:leading-tight">
            ソトバコ ブログ
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
            {MESSAGING.tagline.replace("、", "")}。
            <br className="hidden sm:block" />
            アプリ整理・部署別表示・ダッシュボード化のノウハウをお届けします。
          </p>
        </div>
      </section>

      {/* Article List */}
      <section className="mx-auto max-w-[1100px] px-4 py-10">
        {articles.length === 0 ? (
          <p className="text-center text-gray-500">記事を準備中です。</p>
        ) : (
          <ArticleList>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </ArticleList>
        )}
      </section>
    </>
  );
}
