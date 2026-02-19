import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold text-gray-700">
              ソトバコ ブログ
            </Link>
            <p className="mt-1 text-xs text-gray-500">
              kintoneポータルの活用情報をお届けします
            </p>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a
              href="https://sotobaco.com/sotobacoportal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand"
            >
              ソトバコポータル
            </a>
            <a
              href="https://guide.sotobaco.com/portal/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand"
            >
              操作ガイド
            </a>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} 株式会社ソトバコ. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
