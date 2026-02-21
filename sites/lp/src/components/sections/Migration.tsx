import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import CheckList from "@/components/ui/CheckList";
import CtaButton from "@/components/ui/CtaButton";

export default function Migration() {
  return (
    <SectionWrapper bg="gray" maxWidth="800">
      <SectionHeader
        label="お知らせ"
        title={"Kintone Portal Designerを\nお使いの方へ"}
      />
      <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-8">
        <p className="text-center text-sm font-bold text-yellow-800">
          Kintone Portal Designerは2025年5月12日に開発終了しました
        </p>
        <p className="mt-4 text-center text-sm leading-relaxed text-gray-700">
          ソトバコポータルは、ポータル整理の代替サービスとしてご利用いただけます。
          <br className="hidden md:inline" />
          デザインの直接引き継ぎには対応していませんが、最短7分で新しいポータルを構築できます。
        </p>
        <div className="mx-auto mt-4 max-w-[480px]">
          <CheckList
            items={[
              "タブ整理・閲覧権限・ドラッグ&ドロップに対応",
              "グラフ・通知・未処理の一覧表示にも対応",
              "フリープランは期間制限なし。まずは試してから判断できます",
            ]}
          />
        </div>
        <div className="mt-6 text-center">
          <CtaButton size="sm">フリープランで試してみる</CtaButton>
        </div>
      </div>
    </SectionWrapper>
  );
}
