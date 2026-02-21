import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "会社概要",
  description: "株式会社ソトバコの会社概要です。",
};

const companyData = [
  {
    label: "会社名",
    value: (
      <>
        株式会社ソトバコ
        <br />
        <span className="text-sm font-normal text-gray-500">Sotobaco.Inc</span>
      </>
    ),
  },
  { label: "設立日", value: "2024年 12月 17日" },
  { label: "資本金", value: "6000万円" },
  { label: "代表者", value: "丸山 智大" },
  {
    label: "所在地",
    value: (
      <>
        〒810-0004
        <br />
        福岡県福岡市中央区渡辺通5-23-8 サンライトビル3F
      </>
    ),
  },
  {
    label: "事業内容",
    value: (
      <ul className="list-disc pl-5">
        <li>クラウドサービスの開発/提供</li>
        <li>kintoneおよび連携SaaSの導入支援およびカスタマイズ支援</li>
      </ul>
    ),
  },
  {
    label: "取引銀行",
    value: (
      <ul className="list-disc pl-5">
        <li>三井住友銀行</li>
      </ul>
    ),
  },
];

export default function CompanyPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-16 md:py-20">
      <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
        会社概要
      </h1>

      <dl className="mt-12">
        {companyData.map((item, i) => (
          <div
            key={i}
            className="border-b border-brand py-6 sm:flex sm:items-baseline sm:gap-8"
          >
            <dt className="w-36 shrink-0 text-sm font-bold text-brand sm:text-base">
              {item.label}
            </dt>
            <dd className="mt-2 text-sm font-bold text-gray-900 sm:mt-0 sm:text-base">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
