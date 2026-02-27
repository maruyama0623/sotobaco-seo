"use client";

import { useRef, useEffect } from "react";

const SM_BREAKPOINT = 640;

export default function ArticleList({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const equalize = () => {
      const cards = Array.from(el.children) as HTMLElement[];
      cards.forEach((c) => (c.style.minHeight = ""));
      if (window.innerWidth < SM_BREAKPOINT) return;
      const max = Math.max(...cards.map((c) => c.offsetHeight));
      cards.forEach((c) => (c.style.minHeight = `${max}px`));
    };

    equalize();
    window.addEventListener("resize", equalize);
    return () => window.removeEventListener("resize", equalize);
  }, [children]);

  return (
    <div ref={ref} className="flex flex-col gap-8">
      {children}
    </div>
  );
}
