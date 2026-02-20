import Image from "next/image";

export default function BeforeAfter() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
          kintoneのポータルが、こう変わります
        </h2>
        <div className="mt-12 grid items-center gap-8 md:grid-cols-2">
          {/* Before */}
          <div className="text-center">
            <span className="inline-block rounded-full bg-gray-200 px-4 py-1 text-sm font-bold text-gray-600">
              Before
            </span>
            <div className="mt-4 overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-sm">
              <Image
                src="/images/kintone_portal-default.png"
                alt="kintoneのデフォルトポータル。アプリが一覧で並び、部署ごとの整理ができない状態"
                width={560}
                height={350}
                className="w-full"
              />
            </div>
            <p className="mt-3 text-sm text-gray-500">
              kintoneデフォルトポータル
            </p>
          </div>

          {/* Arrow (mobile: down, desktop: right) */}
          <div className="hidden md:flex md:absolute md:left-1/2 md:-translate-x-1/2">
            {/* Using CSS grid gap instead */}
          </div>

          {/* After */}
          <div className="text-center">
            <span className="inline-block rounded-full bg-brand/10 px-4 py-1 text-sm font-bold text-brand">
              After
            </span>
            <div className="mt-4 overflow-hidden rounded-xl border-2 border-brand/30 bg-white shadow-lg">
              <Image
                src="/images/portal_overview.png"
                alt="ソトバコポータルで整理されたポータル。タブで部署ごとにアプリを分類"
                width={560}
                height={350}
                className="w-full"
              />
            </div>
            <p className="mt-3 text-sm font-medium text-brand">
              ソトバコポータルで整理したポータル
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
