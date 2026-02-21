import type { Metadata } from "next";
import { getAllNews } from "@/lib/news";
import SectionHeader from "@/components/ui/SectionHeader";
import CategoryFilter from "@/components/news/CategoryFilter";

export const metadata: Metadata = {
  title: "お知らせ | ソトバコ",
  description:
    "ソトバコのサービスに関するお知らせ・アップデート情報をお届けします。",
};

export default function NewsListPage() {
  const items = getAllNews();

  return (
    <section className="py-16 md:py-[60px]">
      <div className="mx-auto max-w-[1200px] px-4">
        <SectionHeader label="NEWS" title="お知らせ" />

        <div className="mt-10">
          <CategoryFilter items={items} />
        </div>
      </div>
    </section>
  );
}
