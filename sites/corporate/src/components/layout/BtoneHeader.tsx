import Link from "next/link";
import Image from "next/image";
import { BTONE_SIGNUP_URL } from "@/lib/constants";

export default function BtoneHeader() {
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

        <a
          href={BTONE_SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-brand px-5 py-2 text-sm font-bold text-white shadow transition hover:bg-brand-dark hover:shadow-md"
        >
          30日間無料で試す
        </a>
      </div>
    </header>
  );
}
