"use client";

import { useState } from "react";
import type { NewsItem } from "@/lib/news";
import NewsCard from "./NewsCard";

const CATEGORIES = ["すべて", "アップデート情報", "お知らせ"] as const;

export default function CategoryFilter({ items }: { items: NewsItem[] }) {
  const [active, setActive] = useState<string>("すべて");

  const filtered =
    active === "すべて"
      ? items
      : items.filter((n) => n.categories.includes(active as never));

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
              active === cat
                ? "bg-brand text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length > 0 ? (
          filtered.map((item) => <NewsCard key={item.slug} item={item} />)
        ) : (
          <p className="col-span-full py-12 text-center text-gray-400">
            該当するお知らせはありません。
          </p>
        )}
      </div>
    </>
  );
}
