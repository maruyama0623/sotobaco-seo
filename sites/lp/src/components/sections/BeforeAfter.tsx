import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";

export default function BeforeAfter() {
  return (
    <section className="relative">
      {/* Top wave */}
      <svg
        className="block w-full"
        viewBox="0 0 1440 80"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 80V40C240 0 480 0 720 40C960 80 1200 80 1440 40V80H0Z"
          className="fill-brand-light"
        />
      </svg>

      {/* Content */}
      <div className="bg-brand-light pb-4">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionHeader
            label="Before / After"
            title="kintoneのポータルが、こう変わります"
          />
          <div className="mt-12 flex flex-col items-center gap-8 md:flex-row md:items-end md:gap-6">
            {/* Before */}
            <div className="w-full text-center md:w-[38%]">
              <span className="inline-block rounded-full bg-white px-4 py-1 text-sm font-bold text-gray-600">
                Before
              </span>
              <div className="mt-4 overflow-hidden rounded-xl border-2 border-white bg-white opacity-80 shadow-sm">
                <Image
                  src="/images/portal/kintone_portal-default.png"
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

            {/* After */}
            <div className="w-full text-center md:flex-1">
              <span className="inline-block rounded-full bg-brand px-4 py-1 text-sm font-bold text-white">
                After
              </span>
              <div className="relative mt-4">
                {/* Pulsing glow ring */}
                <div className="absolute -inset-2 animate-[pulse-ring_3s_ease-in-out_infinite] rounded-2xl bg-brand/20" />
                <div className="absolute -inset-1 animate-[pulse-ring_3s_ease-in-out_infinite_0.5s] rounded-xl bg-brand/10" />
              <div className="relative overflow-hidden rounded-xl border-2 border-brand/30 bg-white shadow-xl">
                <Image
                  src="/images/portal/portal_overview.png"
                  alt="ソトバコポータルで整理されたポータル。タブで部署ごとにアプリを分類"
                  width={640}
                  height={400}
                  className="w-full"
                />
              </div>
              </div>
              <p className="mt-3 text-sm font-medium text-brand">
                ソトバコポータルで整理したポータル
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <svg
        className="block w-full"
        viewBox="0 0 1440 80"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 0V40C240 80 480 80 720 40C960 0 1200 0 1440 40V0H0Z"
          className="fill-brand-light"
        />
      </svg>
    </section>
  );
}
