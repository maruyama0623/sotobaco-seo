import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="flex min-h-[520px] flex-col lg:flex-row">
        {/* Left: Text */}
        <div className="flex flex-1 flex-col justify-center px-6 py-16 md:px-12 lg:py-24 lg:pl-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))] lg:pr-12">
          <h1 className="text-4xl font-extrabold leading-[1.6] tracking-tight text-gray-900 md:text-5xl md:leading-[1.6] lg:text-6xl lg:leading-[1.6]">
            すべての働く人が
            <br />
            <span className="text-brand">DXの恩恵を受ける</span>
            <br />
            社会にする
          </h1>
          <p className="mt-8 text-base leading-relaxed text-gray-600 md:text-lg">
            株式会社ソトバコは、kintoneを中心とした
            <br className="hidden md:inline" />
            クラウドサービスの活用支援を通じて、
            <br className="hidden md:inline" />
            企業のデジタル変革を支えるプロダクトを開発・提供しています。
          </p>
          <div className="mt-10">
            <Link
              href="/company/"
              className="inline-flex items-center gap-4 rounded-full bg-gray-900 px-8 py-4 text-base font-bold text-white transition hover:bg-gray-700"
            >
              私たちについて
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right: Hero image — edge to edge */}
        <div className="relative lg:w-[50%]">
          <Image
            src="/images/corporate/hero.jpg"
            alt="都市の風景"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="aspect-[16/9] lg:hidden" />
        </div>
      </div>
    </section>
  );
}
