interface CtaButtonProps {
  href: string;
  size?: "sm" | "md";
  children: React.ReactNode;
  external?: boolean;
}

const sizeStyles = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
} as const;

export default function CtaButton({
  href,
  size = "md",
  children,
  external = true,
}: CtaButtonProps) {
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={`inline-block rounded-lg bg-brand font-bold text-white transition hover:bg-brand-dark ${sizeStyles[size]}`}
    >
      {children}
    </a>
  );
}
