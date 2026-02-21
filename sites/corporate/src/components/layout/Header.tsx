"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CONTACT_URL, BLOG_URL, LP_URL } from "@/lib/constants";

const SERVICE_ITEMS = [
  { label: "ソトバコポータル", href: LP_URL },
  { label: "Btone", href: "/btone/" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo/logo-yoko.svg"
            alt="ソトバコ"
            width={140}
            height={36}
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <div
            className="relative"
            onMouseEnter={() => setIsServiceOpen(true)}
            onMouseLeave={() => setIsServiceOpen(false)}
          >
            <button
              className="flex items-center gap-1 text-sm font-medium text-gray-700 transition hover:text-brand"
            >
              サービス
              <svg className={`h-3.5 w-3.5 transition-transform ${isServiceOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isServiceOpen && (
              <div className="absolute left-0 top-full pt-2">
                <div className="min-w-[180px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  {SERVICE_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link
            href="/news/"
            className="text-sm font-medium text-gray-700 transition hover:text-brand"
          >
            お知らせ
          </Link>
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-700 transition hover:text-brand"
          >
            ブログ
          </a>
          <a
            href={CONTACT_URL}
            className="rounded-lg border-2 border-brand px-5 py-2 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
          >
            お問い合わせ
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex h-10 w-10 items-center justify-center md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="メニュー"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <nav className="border-t border-gray-100 bg-white px-4 pb-4 md:hidden">
          <div>
            <button
              className="flex w-full items-center justify-between py-3 text-sm font-medium text-gray-700"
              onClick={() => setIsServiceOpen(!isServiceOpen)}
            >
              サービス
              <svg className={`h-3.5 w-3.5 transition-transform ${isServiceOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isServiceOpen && (
              <div className="pb-1">
                {SERVICE_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block py-2.5 pl-4 text-sm text-gray-600"
                    onClick={() => { setIsOpen(false); setIsServiceOpen(false); }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/news/"
            className="block py-3 text-sm font-medium text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            お知らせ
          </Link>
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-3 text-sm font-medium text-gray-700"
          >
            ブログ
          </a>
          <a
            href={CONTACT_URL}
            className="mt-2 block rounded-lg border-2 border-brand px-5 py-3 text-center text-sm font-bold text-brand"
          >
            お問い合わせ
          </a>
        </nav>
      )}
    </header>
  );
}
