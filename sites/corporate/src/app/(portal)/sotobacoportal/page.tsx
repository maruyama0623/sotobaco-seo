import type { Metadata } from "next";
import { buildPortalMetadata } from "@/lib/seo";
import PortalHero from "@/components/sections/PortalHero";
import Problems from "@/components/sections/Problems";
import BeforeAfter from "@/components/sections/BeforeAfter";
import Features from "@/components/sections/Features";
import UseCases from "@/components/sections/UseCases";
import MainFeatures from "@/components/sections/MainFeatures";
import Pricing from "@/components/sections/Pricing";
import Steps from "@/components/sections/Steps";
import Migration from "@/components/sections/Migration";
import Comparison from "@/components/sections/Comparison";
import Testimonials from "@/components/sections/Testimonials";
import CtaSection from "@/components/sections/CtaSection";
import CtaCards from "@/components/sections/CtaCards";

export const metadata: Metadata = buildPortalMetadata();

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ソトバコポータル",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "0",
    highPrice: "9800",
    priceCurrency: "JPY",
    offerCount: "3",
  },
  provider: {
    "@type": "Organization",
    name: "株式会社ソトバコ",
    url: "https://sotobaco.com/",
  },
  description:
    "kintoneのポータルを部署ごとにタブで整理し、ドラッグ&ドロップで管理。閲覧権限も設定可能。フリープランは期間制限なし。",
};

export default function PortalHomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortalHero />
      <Problems />
      <BeforeAfter />
      <Features />
      <CtaSection />
      <UseCases />
      <MainFeatures />
      <Pricing />
      <Steps />
      <Migration />
      <Comparison />
      <Testimonials />
      <CtaSection variant="bordered" />
      <CtaCards />
    </>
  );
}
