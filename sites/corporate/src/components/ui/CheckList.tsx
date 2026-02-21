type Props = {
  items: string[];
  size?: "sm" | "md";
};

function CheckIcon({ size }: { size: "sm" | "md" }) {
  const cls = size === "sm" ? "mt-0.5 h-4 w-4" : "mt-0.5 h-5 w-5";
  return (
    <svg
      className={`shrink-0 text-brand ${cls}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export default function CheckList({ items, size = "sm" }: Props) {
  const gap = size === "sm" ? "gap-2" : "gap-3";
  const space = size === "sm" ? "space-y-2.5" : "space-y-3";
  return (
    <ul className={space}>
      {items.map((item) => (
        <li
          key={item}
          className={`flex items-start ${gap} text-sm leading-relaxed text-gray-700`}
        >
          <CheckIcon size={size} />
          {item}
        </li>
      ))}
    </ul>
  );
}
