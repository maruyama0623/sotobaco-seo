import { ReactNode } from "react";
import Link from "next/link";

type Props = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "inverse" | "outline" | "muted";
  size?: "sm" | "md";
  external?: boolean;
  className?: string;
};

const variantStyles = {
  primary:
    "bg-brand text-white shadow-lg hover:bg-brand-dark hover:shadow-xl",
  inverse:
    "bg-white text-brand shadow-lg hover:bg-gray-50 hover:shadow-xl",
  outline:
    "border-2 border-brand bg-white text-brand hover:bg-brand-light",
  muted:
    "bg-gray-100 text-gray-700 hover:bg-gray-200",
};

const sizeStyles = {
  sm: "px-6 py-3 text-sm",
  md: "px-8 py-4 text-base",
};

export default function CtaButton({
  children,
  href,
  variant = "primary",
  size = "md",
  external = false,
  className = "",
}: Props) {
  const styles = `inline-flex items-center justify-center rounded-lg font-bold transition ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={styles}>
      {children}
    </Link>
  );
}
