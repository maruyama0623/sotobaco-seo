import type { TocItem } from "@/lib/markdown";

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav className="rounded-xl border border-gray-100 bg-white p-5">
      <p className="mb-3 text-sm font-bold text-gray-700">目次</p>
      <ul className="space-y-1.5 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? "pl-4" : ""}
          >
            <a
              href={`#${item.id}`}
              className="block leading-relaxed text-gray-500 transition hover:text-brand"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
