import type { Metadata } from "next";
import Image from "next/image";
import { buildPortalPageMetadata } from "@/lib/seo";
import { featureSections, otherFeatures } from "@/lib/portal-data";
import PageHero from "@/components/ui/PageHero";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import PlanBadge from "@/components/ui/PlanBadge";
import CheckList from "@/components/ui/CheckList";
import FeatureCard from "@/components/ui/FeatureCard";
import ArrowLink from "@/components/ui/ArrowLink";
import CtaSection from "@/components/sections/CtaSection";
import CtaCards from "@/components/sections/CtaCards";

export const metadata: Metadata = buildPortalPageMetadata(
  "機能一覧",
  "ソトバコポータルの全機能を紹介。タブ整理・閲覧権限・ドラッグ&ドロップ・グラフ表示・全体アナウンスなど、kintoneのポータルを使いやすくする機能が揃っています。",
  "/features/"
);

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        title="ソトバコポータルの機能"
        description="kintoneのポータルを部署ごとに整理し、使いやすくするための機能が揃っています。"
      />

      {/* Main Feature Sections */}
      {featureSections.map((section, index) => (
        <SectionWrapper
          key={section.id}
          id={section.id}
          bg={index % 2 === 1 ? "gray" : "white"}
        >
          <div
            className={`flex flex-col items-center gap-10 lg:flex-row ${
              index % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            <div className="flex-1">
              <div className="flex flex-wrap gap-1.5">
                {section.plans.map((plan) => (
                  <PlanBadge key={plan} plan={plan} />
                ))}
              </div>
              <h2 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
                {section.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                {section.description}
              </p>
              <div className="mt-6">
                <CheckList items={section.details} size="md" />
              </div>
            </div>
            <div className="flex-1">
              <Image
                src={section.image}
                alt={section.imageAlt}
                width={560}
                height={350}
                className="h-[240px] w-full rounded-xl object-contain object-center shadow-lg md:h-[320px]"
              />
            </div>
          </div>
        </SectionWrapper>
      ))}

      {/* Other Features */}
      <SectionWrapper bg="gray">
        <SectionHeader
          label="その他の機能"
          title="ポータル管理をもっと便利に"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {otherFeatures.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              imageHeight="h-[160px]"
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <ArrowLink href="/sotobacoportal/pricing/">料金プラン・機能比較を見る</ArrowLink>
        </div>
      </SectionWrapper>

      <CtaSection
        variant="bordered"
        title="すべての機能をフリープランで体験"
        description="フリープランは期間制限なし。4タブまで無料でご利用いただけます。"
        links={[]}
      />
      <CtaCards />
    </>
  );
}
