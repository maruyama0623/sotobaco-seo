import type { Metadata } from "next";
import Link from "next/link";
import { buildGuideMetadata } from "@/lib/seo";
import { portalNavigation } from "@/lib/navigation";

export const metadata: Metadata = buildGuideMetadata(
  "ソトバコポータル 操作ガイド",
  "ソトバコポータルの初期設定・ポータル編集・よくあるお問い合わせなど、操作に関するガイドをまとめています。",
  "/portal/"
);

export default function PortalIndexPage() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
      <h1 className="mb-6 text-xl font-bold text-gray-900">
        ソトバコポータル 操作ガイド
      </h1>
      <p className="mb-8 text-sm text-gray-600">
        ソトバコポータルの設定方法や使い方をご案内します。
      </p>

      {portalNavigation.map((group) => (
        <div key={group.heading} className="mb-8">
          <h2 className="mb-4 border-b border-gray-200 pb-2 text-lg font-bold text-gray-800">
            {group.heading}
          </h2>
          {group.sections.map((section) => (
            <div key={section.title || "default"} className="mb-4">
              {section.title && (
                <h3 className="mb-2 text-sm font-bold text-gray-700">
                  {section.title}
                </h3>
              )}
              <ul className="grid gap-2 sm:grid-cols-2">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 transition hover:border-brand hover:bg-brand-light hover:text-brand"
                    >
                      <svg
                        className="mr-2 h-4 w-4 shrink-0 text-brand"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
