import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <p className="text-6xl font-extrabold text-brand">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          ページが見つかりませんでした
        </h1>
        <p className="mt-3 text-gray-600">
          お探しのページは移動または削除された可能性があります。
        </p>
        <Link
          href="/"
          className="mt-8 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          トップページに戻る
        </Link>
      </main>
      <Footer />
    </>
  );
}
