import Image from "next/image";

const SERVICE_URL = "https://app.sotobaco.com";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-brand-light to-white py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block rounded-full bg-brand/10 px-4 py-1.5 text-xs font-bold text-brand">
              サイボウズ プロダクトパートナー認定
            </span>
            <h1 className="mt-6 text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
              kintoneのポータルを、
              <br />
              <span className="text-brand">部署ごとに整理。</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-gray-600 md:text-lg">
              アプリが増えても迷わない。
              <br className="hidden md:inline" />
              タブで分類、ドラッグ&ドロップで管理。
              <br className="hidden md:inline" />
              フリープランは期間制限なし。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href={SERVICE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-brand px-8 py-4 text-base font-bold text-white shadow-lg transition hover:bg-brand-dark hover:shadow-xl"
              >
                フリープランを始める（無料）
              </a>
              <a
                href="/features/"
                className="inline-flex items-center justify-center rounded-lg border-2 border-brand bg-white px-8 py-4 text-base font-bold text-brand transition hover:bg-brand-light"
              >
                機能を見る
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1">
            <Image
              src="/images/portal_overview.png"
              alt="ソトバコポータルの管理画面。タブでアプリを整理し、部署ごとに表示"
              width={640}
              height={400}
              className="rounded-xl shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
