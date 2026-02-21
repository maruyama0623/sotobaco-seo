import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import CtaButton from "@/components/ui/CtaButton";

export default function Hero() {
  return (
    <SectionWrapper bg="gradient">
      <div className="flex flex-col items-center gap-12 lg:flex-row">
        {/* Text */}
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center gap-4 max-lg:justify-center">
            <Image
              src="/images/partner/partner_normal_yoko.png"
              alt="cybozu Official Partner認定バッジ"
              width={200}
              height={60}
              className="h-10 w-auto md:h-12"
            />
            <Image
              src="/images/partner/partner_product_yoko.png"
              alt="cybozu Official Partner Product認定バッジ"
              width={200}
              height={60}
              className="h-10 w-auto md:h-12"
            />
          </div>
          <h1 className="mt-3 text-3xl font-extrabold leading-relaxed text-gray-900 md:text-4xl md:leading-relaxed lg:text-5xl lg:leading-relaxed">
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
            <CtaButton>フリープランを始める（無料）</CtaButton>
            <CtaButton href="/features/" variant="outline" external={false}>
              機能を見る
            </CtaButton>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1">
          <Image
            src="/images/portal/portal_overview.png"
            alt="ソトバコポータルの管理画面。タブでアプリを整理し、部署ごとに表示"
            width={640}
            height={400}
            className="rounded-xl shadow-lg"
            priority
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
