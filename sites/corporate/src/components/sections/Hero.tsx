export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-brand-light to-white">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 px-6 py-20 md:py-28 lg:flex-row lg:py-32">
        {/* Left: Text */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl font-extrabold leading-relaxed text-gray-900 md:text-4xl md:leading-relaxed lg:text-5xl lg:leading-relaxed">
            すべての働く人が
            <br />
            <span className="text-brand">DXの恩恵を受ける</span>
            <br />
            社会にする
          </h1>
          <p className="mt-6 text-base leading-relaxed text-gray-600 md:text-lg">
            株式会社ソトバコは、kintoneを中心としたクラウドサービスの活用支援を通じて、
            <br className="hidden md:inline" />
            企業のデジタル変革を支えるプロダクトを開発・提供しています。
          </p>
        </div>

        {/* Right: Abstract visual */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative h-64 w-full max-w-md md:h-80">
            {/* Decorative circles */}
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 md:h-64 md:w-64" />
            <div className="absolute left-1/3 top-1/3 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 md:h-44 md:w-44" />
            <div className="absolute bottom-1/4 right-1/4 h-24 w-24 rounded-full bg-brand/15 md:h-32 md:w-32" />
            {/* Center icon */}
            <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-brand shadow-lg md:h-24 md:w-24">
              <svg className="h-10 w-10 text-white md:h-12 md:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
