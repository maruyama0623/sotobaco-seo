import Link from "next/link";
import Image from "next/image";
import { EXTERNAL_URLS, IMAGES } from "@/lib/constants";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center">
          <Image
            src={IMAGES.logo}
            alt="ソトバコ"
            width={140}
            height={32}
            className="h-8 w-auto"
          />
        </a>
        <a
          href={EXTERNAL_URLS.contact}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border-2 border-brand bg-white px-5 py-2 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
        >
          お問い合わせ
        </a>
      </div>
    </header>
  );
}
