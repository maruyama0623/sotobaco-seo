import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo-yoko.svg"
            alt="ソトバコ"
            width={140}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
      </div>
    </header>
  );
}
