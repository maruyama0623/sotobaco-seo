import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

const SERVICE_URL = "https://app.sotobaco.com";

export const metadata: Metadata = buildPageMetadata(
  "料金プラン",
  "ソトバコポータルの料金プラン。フリープラン（0円・期間制限なし）から、ライト（月額3,800円）、スタンダード（月額9,800円）まで。機能比較表・FAQも掲載。",
  "/pricing/"
);

const plans = [
  {
    name: "フリー",
    price: "0",
    unit: "円",
    period: "",
    description: "まずは試したい方に",
    features: [
      "4タブまで",
      "グラフ埋め込み（各1個まで/1タブ）",
      "通知/未処理/アプリ一覧",
      "メンバー1名",
    ],
    highlight: false,
    cta: "フリープランを始める",
  },
  {
    name: "ライト",
    price: "3,800",
    unit: "円/月",
    period: "（年払い: ¥36,000/年）",
    description: "本格的に整理したい企業に",
    features: [
      "タブ無制限",
      "グラフ埋め込み無制限",
      "通知/未処理/アプリ一覧",
      "全体アナウンス",
      "グループ説明文",
      "メンバー2名",
    ],
    highlight: true,
    cta: "ライトプランを始める",
  },
  {
    name: "スタンダード",
    price: "9,800",
    unit: "円/月",
    period: "（年払い: ¥108,000/年）",
    description: "全機能を使いたい企業に",
    features: [
      "ライトの全機能",
      "アナウンスカテゴリ設定",
      "スペースリンク対応",
      "スペース単位ポータル無制限",
      "メンバー5名",
    ],
    highlight: false,
    cta: "スタンダードプランを始める",
  },
];

const comparisonRows = [
  { label: "タブ上限", free: "4タブまで", light: "無制限", standard: "無制限" },
  {
    label: "グラフ埋め込み",
    free: "各1個まで/1タブ",
    light: "無制限",
    standard: "無制限",
  },
  { label: "通知/未処理/アプリ一覧", free: "○", light: "○", standard: "○" },
  { label: "グループ説明文", free: "×", light: "○", standard: "○" },
  { label: "全体アナウンス", free: "×", light: "○", standard: "○" },
  {
    label: "アナウンス表示件数設定",
    free: "×",
    light: "○",
    standard: "○",
  },
  {
    label: "アナウンスカテゴリ設定",
    free: "×",
    light: "×",
    standard: "○",
  },
  {
    label: "スペースリンク",
    free: "×",
    light: "×",
    standard: "○",
  },
  {
    label: "スペース単位ポータル",
    free: "×",
    light: "×",
    standard: "無制限",
  },
  { label: "メンバー上限", free: "1名", light: "2名", standard: "5名" },
];

const competitorRows = [
  {
    label: "月額費用",
    sotobaco: "無料〜¥9,800",
    kodawari: "¥12,000（税別）",
    designer: "無料（開発終了）",
  },
  {
    label: "無料プラン",
    sotobaco: "あり（期間制限なし）",
    kodawari: "なし（30日トライアルのみ）",
    designer: "−",
  },
  {
    label: "年額（最上位プラン）",
    sotobaco: "¥108,000",
    kodawari: "¥144,000（税別）",
    designer: "−",
  },
];

const faqs = [
  {
    question: "フリープランに期間制限はありますか？",
    answer:
      "いいえ、フリープランは期間制限なくご利用いただけます。4タブまで無料で使えるので、まずはお気軽にお試しください。",
  },
  {
    question: "導入にどのくらい時間がかかりますか？",
    answer:
      "最短7分で導入できます。アカウント作成、kintone連携設定、ポータル設定の3ステップで完了します。",
  },
  {
    question: "kintoneのプラグインですか？",
    answer:
      "いいえ、ソトバコポータルはWebアプリ（kintone外のサービス）です。プラグインではないため、kintoneプラグインの制約を受けません。",
  },
  {
    question: "kintone連携にはどの権限が必要ですか？",
    answer:
      "初回のkintone連携設定時に、cybozu.com共通管理者権限が必要です。OAuthクライアントの追加を行います。",
  },
  {
    question: "閲覧権限の組織・グループはどこから取得されますか？",
    answer:
      "kintoneに設定されている組織・グループを読み込んで使用します。ソトバコポータル側で独自に組織やグループを管理する必要はありません。",
  },
  {
    question: "スマートフォンから利用できますか？",
    answer:
      "はい。JSファイル（portal-design-common.min.js）をkintone全体カスタマイズのスマートフォン用JSとしてアップロードすることで対応できます。",
  },
  {
    question: "Kintone Portal Designerから移行できますか？",
    answer:
      "はい、移行先としてご利用いただけます。Portal Designerは2025年5月12日に開発終了しました。ソトバコポータルはフリープランから移行をお試しいただけます。",
  },
  {
    question: "プランの変更はいつでもできますか？",
    answer:
      "はい、プランのアップグレード・ダウングレードはいつでも可能です。",
  },
  {
    question: "解約に手数料はかかりますか？",
    answer:
      "いいえ、解約手数料はかかりません。いつでも解約可能です。",
  },
  {
    question: "導入前に相談できますか？",
    answer:
      "はい、お問い合わせフォームからお気軽にご相談ください。導入のご支援をいたします。",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Page Hero */}
      <section className="bg-gradient-to-b from-brand-light to-white py-16 md:py-20">
        <div className="mx-auto max-w-[800px] px-4 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
            料金プラン
          </h1>
          <p className="mt-4 text-gray-600">
            フリープランは期間制限なし。必要に応じてアップグレードできます。
          </p>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border-2 p-8 ${
                  plan.highlight
                    ? "border-brand bg-white shadow-xl"
                    : "border-gray-200 bg-white shadow-sm"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-4 py-1 text-xs font-bold text-white">
                    おすすめ
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-500">{plan.unit}</span>
                </div>
                {plan.period && (
                  <p className="mt-1 text-xs text-gray-400">{plan.period}</p>
                )}
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <a
                    href={SERVICE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block rounded-lg py-3 text-center text-sm font-bold transition ${
                      plan.highlight
                        ? "bg-brand text-white hover:bg-brand-dark"
                        : "border-2 border-brand bg-white text-brand hover:bg-brand-light"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-[900px] px-4">
          <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
            プラン別機能比較
          </h2>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-500" />
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">
                    フリー
                  </th>
                  <th className="bg-brand-light px-4 py-3 text-center text-sm font-bold text-brand">
                    ライト
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">
                    スタンダード
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                      {row.free}
                    </td>
                    <td className="bg-brand-light/50 px-4 py-3 text-center text-sm font-medium text-gray-900">
                      {row.light}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                      {row.standard}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Competitor Cost Comparison */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[900px] px-4">
          <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
            他サービスとの費用比較
          </h2>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-bold text-gray-500" />
                  <th className="bg-brand-light px-4 py-3 text-center text-sm font-bold text-brand">
                    ソトバコポータル
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">
                    こだわりkintone
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">
                    Portal Designer
                  </th>
                </tr>
              </thead>
              <tbody>
                {competitorRows.map((row) => (
                  <tr key={row.label} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">
                      {row.label}
                    </td>
                    <td className="bg-brand-light/50 px-4 py-3 text-center text-sm font-bold text-brand">
                      {row.sotobaco}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                      {row.kodawari}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                      {row.designer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-[800px] px-4">
          <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
            よくあるご質問
          </h2>
          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-gray-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-bold text-gray-900 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <svg
                    className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="border-t border-gray-100 px-6 py-5">
                  <p className="text-sm leading-relaxed text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand py-16 md:py-20">
        <div className="mx-auto max-w-[800px] px-4 text-center">
          <h2 className="text-2xl font-extrabold text-white md:text-3xl">
            まずはフリープランから始めましょう
          </h2>
          <p className="mt-4 text-white/80">
            期間制限なし。いつでもアップグレード・解約可能です。
          </p>
          <div className="mt-8">
            <a
              href={SERVICE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-bold text-brand shadow-lg transition hover:bg-gray-50 hover:shadow-xl"
            >
              フリープランを始める（無料）
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
