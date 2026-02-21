import Link from "next/link";
import { getAllNews } from "@/lib/news";
import SectionHeader from "@/components/ui/SectionHeader";
import NewsCard from "@/components/news/NewsCard";

export default function News() {
  const items = getAllNews().slice(0, 3);

  return (
    <section id="news" className="bg-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeader label="NEWS" title="お知らせ" />

        <div className="mt-14">
          {items.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <NewsCard key={item.slug} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm md:p-12">
              <p className="text-gray-500">お知らせは準備中です。</p>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/news/"
              className="inline-block rounded-full border-2 border-brand px-8 py-3 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
            >
              お知らせ一覧を見る
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
