import type { TocItem } from "@/lib/markdown";
import SidebarCard from "@/components/ui/SidebarCard";
import SidebarHeading from "@/components/ui/SidebarHeading";

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <SidebarCard as="nav">
      <SidebarHeading>目次</SidebarHeading>
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
    </SidebarCard>
  );
}
