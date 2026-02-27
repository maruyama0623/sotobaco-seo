"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavGroup } from "@/types/guide";

interface SidebarProps {
  navigation: NavGroup[];
}

export default function Sidebar({ navigation }: SidebarProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      for (const group of navigation) {
        for (const section of group.sections) {
          const isActive = section.items.some((item) => pathname === item.href);
          if (section.title) {
            initial[section.title] = isActive || true;
          }
        }
      }
      return initial;
    }
  );

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <nav className="w-full" aria-label="操作ガイドナビゲーション">
      {navigation.map((group) => (
        <div key={group.heading} className="mb-4">
          <div className="rounded-t-lg bg-brand px-4 py-2">
            <h3 className="text-sm font-bold text-white">{group.heading}</h3>
          </div>
          <div className="rounded-b-lg border border-t-0 border-gray-200 bg-white">
            {group.sections.map((section) => (
              <div key={section.title || "default"}>
                {section.title && (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-2.5 text-left text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                    aria-expanded={openSections[section.title]}
                  >
                    {section.title}
                    <svg
                      className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
                        openSections[section.title] ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}
                {(section.title ? openSections[section.title] : true) && (
                  <ul>
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`block border-b border-gray-50 px-6 py-2 text-sm transition ${
                              isActive
                                ? "bg-brand-light font-bold text-brand"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
