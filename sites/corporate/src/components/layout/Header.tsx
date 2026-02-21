"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CONTACT_URL, BLOG_URL } from "@/lib/constants";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

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
          <Link
            href="#services"
            className="text-sm font-medium text-gray-700 transition hover:text-brand"
          >
            サービス
          </Link>
          <Link
            href="#news"
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
          <Link
            href="#services"
            className="block py-3 text-sm font-medium text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            サービス
          </Link>
          <Link
            href="#news"
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
