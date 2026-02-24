"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SERVICE_URL } from "@/lib/constants";

export default function PortalHeader() {
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
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/sotobacoportal/"
            className="text-sm font-medium text-gray-700 transition hover:text-brand"
          >
            TOP
          </Link>
          <Link
            href="/sotobacoportal/features/"
            className="text-sm font-medium text-gray-700 transition hover:text-brand"
          >
            機能
          </Link>
          <Link
            href="/sotobacoportal/pricing/"
            className="text-sm font-medium text-gray-700 transition hover:text-brand"
          >
            料金
          </Link>
          <Link
            href="/contact/?category=sotobaco-portal"
            className="text-sm font-medium text-gray-700 transition hover:text-brand"
          >
            お問い合わせ
          </Link>
          <div className="flex items-center gap-2">
            <a
              href={SERVICE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
            >
              フリープランを試す
            </a>
            <Link
              href="/sotobacoportal/material/"
              className="rounded-lg border border-brand px-5 py-2.5 text-sm font-bold text-brand transition hover:bg-brand/5"
            >
              資料ダウンロード
            </Link>
          </div>
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
            href="/sotobacoportal/"
            className="block py-3 text-sm font-medium text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            TOP
          </Link>
          <Link
            href="/sotobacoportal/features/"
            className="block py-3 text-sm font-medium text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            機能
          </Link>
          <Link
            href="/sotobacoportal/pricing/"
            className="block py-3 text-sm font-medium text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            料金
          </Link>
          <Link
            href="/contact/?category=sotobaco-portal"
            className="block py-3 text-sm font-medium text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            お問い合わせ
          </Link>
          <Link
            href="/sotobacoportal/material/"
            className="mt-2 block rounded-lg border border-brand px-5 py-3 text-center text-sm font-bold text-brand"
            onClick={() => setIsOpen(false)}
          >
            資料ダウンロード
          </Link>
          <a
            href={SERVICE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block rounded-lg bg-brand px-5 py-3 text-center text-sm font-bold text-white"
          >
            フリープランを試す
          </a>
        </nav>
      )}
    </header>
  );
}
