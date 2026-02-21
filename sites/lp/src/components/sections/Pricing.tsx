import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import ArrowLink from "@/components/ui/ArrowLink";
import PlanCard from "@/components/ui/PlanCard";
import { plans } from "@/lib/data";

export default function Pricing() {
  return (
    <SectionWrapper bg="gray">
      <SectionHeader label="料金プラン" title="フリープランは期間制限なし" />

      {/* Pricing highlights */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10">
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

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-gray-400">
        ※ 価格はすべて税抜です
      </p>
      <div className="mt-4 text-center">
        <ArrowLink href="/pricing/">プラン別機能比較を見る</ArrowLink>
      </div>
    </SectionWrapper>
  );
}
