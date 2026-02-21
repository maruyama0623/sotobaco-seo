interface SidebarCardProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  padding?: boolean;
  hover?: boolean;
  className?: string;
}

export default function SidebarCard({
  children,
  as: Tag = "div",
  padding = true,
  hover = false,
  className = "",
}: SidebarCardProps) {
  return (
    <Tag
      className={`rounded-xl border border-gray-100 bg-white${padding ? " p-5" : ""}${hover ? " transition hover:shadow-md" : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </Tag>
  );
}
