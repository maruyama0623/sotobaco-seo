import { ReactNode } from "react";
import Link from "next/link";

type Props = {
  href: string;
  children: ReactNode;
  external?: boolean;
};

export default function ArrowLink({ href, children, external = false }: Props) {
  const className = "inline-flex items-center gap-1 text-sm font-bold text-brand transition hover:text-brand-dark";
  const icon = (
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
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        {icon}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
      {icon}
    </Link>
  );
}
