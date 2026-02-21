import Link from "next/link";
import Image from "next/image";
import type { NewsItem } from "@/lib/news";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${item.slug}/`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-center justify-center bg-gray-50 p-10">
        <Image
          src="/images/logo/logo-tate.svg"
          alt="ソトバコ"
          width={120}
          height={120}
          className="h-24 w-auto"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          {item.categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full bg-brand/10 px-3 py-0.5 text-xs font-bold text-brand"
            >
              {cat}
            </span>
          ))}
          <time className="text-xs text-gray-400" dateTime={item.date}>
            {formatDate(item.date)}
          </time>
        </div>

        <h3 className="mt-3 text-sm font-bold leading-relaxed text-gray-900 group-hover:text-brand">
          {item.title}
        </h3>

        {item.excerpt && (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
            {item.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
