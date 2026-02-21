import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  external?: boolean;
};

export default function ArrowLink({ href, children, external = false }: Props) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex items-center gap-1 text-sm font-bold text-brand transition hover:text-brand-dark"
    >
      {children}
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
    </a>
  );
}
