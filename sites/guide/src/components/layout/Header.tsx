import Image from "next/image";
import { IMAGES } from "@/lib/constants";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1200px] items-center px-4 py-3">
        <a href="/" className="flex items-center">
          <Image
            src={IMAGES.logo}
            alt="ソトバコ"
            width={140}
            height={32}
            className="h-8 w-auto"
          />
        </a>
      </div>
    </header>
  );
}
