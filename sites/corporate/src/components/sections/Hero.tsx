import Image from "next/image";

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
            DXが進まない現場にも、デジタル化の恩恵をしっかりと届けたい。
            <br className="hidden md:inline" />
            ソトバコは、そんな想いで現場に寄り添うサービスを提供しています。
          </p>
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
