import Image from "next/image";
import { LP_URL } from "@/lib/constants";

export default function Services() {
  return (
    <section id="services" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
          サービス
        </h2>
        <p className="mt-4 text-center text-gray-600">
          kintoneをもっと使いやすく、もっと活用できるプロダクトを提供しています。
        </p>

        {/* Main service: ソトバコポータル */}
        <div className="mt-10">
          <a
            href={LP_URL}
            className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
          >
            <div className="flex flex-col lg:flex-row">
              <div className="flex items-center justify-center bg-brand-light p-6 lg:w-[55%] lg:p-8">
                <Image
                  src="/images/portal/smartphone_multi-device.png"
                  alt="ソトバコポータル。PC・タブレット・スマートフォンのマルチデバイス対応"
                  width={720}
                  height={410}
                  className="w-full max-w-[640px]"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center p-8 lg:p-12">
                <Image
                  src="/images/logo/logo-portal-yoko.png"
                  alt="ソトバコポータル"
                  width={280}
                  height={80}
                  className="w-56 md:w-64"
                />
                <p className="mt-4 text-lg font-bold text-gray-900">
                  kintoneのポータルを、部署ごとに整理。
                </p>
                <p className="mt-3 leading-relaxed text-gray-600">
                  アプリが増えても迷わない。タブで分類、ドラッグ&ドロップで管理。
                  閲覧権限の設定も直感的に行えます。フリープランは期間制限なし。
                </p>
                <div className="mt-6">
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-brand transition group-hover:gap-2">
                    詳しく見る
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Sub services */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Btone */}
          <a
            href="/btone/"
            className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900">Btone</h3>
            <p className="mt-3 leading-relaxed text-gray-600">
              Bカートの受注・商品・出荷情報をkintoneへ連携。バックオフィス業務を効率化します。
            </p>
            <div className="mt-4">
              <span className="inline-flex items-center gap-1 text-sm font-bold text-brand transition group-hover:gap-2">
                詳しく見る
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </a>

          {/* kintoneプラグイン */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
              Coming Soon
            </span>
            <h3 className="mt-4 text-xl font-bold text-gray-900">kintoneプラグイン</h3>
            <p className="mt-3 leading-relaxed text-gray-600">
              kintoneの機能を拡張するプラグインを開発・提供しています。
              詳細は近日公開予定です。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
