import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureCard from "@/components/ui/FeatureCard";
import ArrowLink from "@/components/ui/ArrowLink";
import { mainFeatures } from "@/lib/data";

export default function MainFeatures() {
  return (
    <SectionWrapper>
      <SectionHeader label="機能紹介" title="ソトバコポータルの主な機能" />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mainFeatures.map((feature) => (
          <FeatureCard key={feature.title} {...feature} hoverable />
        ))}
      </div>
      <div className="mt-10 text-center">
        <ArrowLink href="/features/">すべての機能を見る</ArrowLink>
      </div>
    </SectionWrapper>
  );
}
