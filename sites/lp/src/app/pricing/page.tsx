import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { plans, comparisonRows, faqs } from "@/lib/data";
import type { Column } from "@/components/ui/ComparisonTable";
import PageHero from "@/components/ui/PageHero";
import SectionWrapper from "@/components/ui/SectionWrapper";
import PlanCard from "@/components/ui/PlanCard";
import ComparisonTable from "@/components/ui/ComparisonTable";
import ArrowLink from "@/components/ui/ArrowLink";
import CtaSection from "@/components/sections/CtaSection";
import CtaCards from "@/components/sections/CtaCards";

export const metadata: Metadata = buildPageMetadata(
  "料金プラン",
  "ソトバコポータルの料金プラン。フリープラン（0円・期間制限なし）から、ライト（月額3,800円）、スタンダード（月額9,800円）まで。機能比較表・FAQも掲載。",
  "/pricing/"
);

const planColumns: Column[] = [
  { key: "free", label: "フリー", cta: "まずは無料で始める" },
  { key: "light", label: "ライト", cta: "まずは無料で始める" },
  { key: "standard", label: "スタンダード", cta: "まずは無料で始める" },
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

      <PageHero
        title="料金プラン"
        description="フリープランは期間制限なし。必要に応じてアップグレードできます。"
      />

      {/* Plan Cards */}
      <SectionWrapper>
        {/* Pricing highlights */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-6 md:gap-10">
          <div className="flex items-center gap-2">
            <svg className="h-7 w-7 text-brand" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
              <path d="M8 12l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-lg font-extrabold text-gray-900">
              初期費用<span className="text-2xl text-brand">0</span>円
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-7 w-7 text-brand" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
              <path d="M8 12l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <span className="text-lg font-extrabold text-gray-900">
                kintone1環境につき1契約で利用可能
              </span>
              <p className="text-xs text-gray-500">
                （ユーザー単位・アプリ単位の課金なし）
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-gray-400">
          ※ 価格はすべて税抜です
        </p>
      </SectionWrapper>

      {/* Feature Comparison Table */}
      <SectionWrapper bg="gray">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
          プラン別機能比較
        </h2>
        <div className="mt-12">
          <ComparisonTable columns={planColumns} rows={comparisonRows} />
        </div>
        <div className="mt-8 text-center">
          <ArrowLink href="/features/">各機能の詳細を見る</ArrowLink>
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper maxWidth="800">
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
      </SectionWrapper>

      <CtaSection
        variant="bordered"
        title="まずはフリープランから始めましょう"
        description="期間制限なし。いつでもアップグレード・解約可能です。"
        links={[]}
      />
      <CtaCards />
    </>
  );
}
