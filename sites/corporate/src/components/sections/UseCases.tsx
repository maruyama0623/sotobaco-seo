import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

const patterns = [
  {
    label: "パターン 01",
    title: "業務別にタブを整理",
    description:
      "案件管理・経理・人事など、業務カテゴリごとにタブを分けて整理。担当業務のタブを開くだけで、必要なアプリがすぐ見つかります。",
    image: "/images/no_image.jpg",
    imageAlt: "業務別にタブを整理したソトバコポータルの画面例",
  },
  {
    label: "パターン 02",
    title: "部署別にタブを見せ分け",
    description:
      "営業部・総務部・経理部など、部署ごとに閲覧権限を設定。自分の部署に関係のあるタブだけが表示されるので、アプリを探す手間がなくなります。",
    image: "/images/portal/tab_permission-compare.png",
    imageAlt:
      "部署別に閲覧権限を設定したソトバコポータルの画面例。営業部と総務部で表示が異なる",
  },
  {
    label: "パターン 03",
    title: "プロジェクト別にタブを管理",
    description:
      "新規事業・システム導入・採用プロジェクトなど、プロジェクト単位でタブを作成。関連アプリ・スペースリンク・資料をひとつのタブに集約できます。",
    image: "/images/no_image.jpg",
    imageAlt: "プロジェクト別にタブを管理しているソトバコポータルの画面例",
  },
  {
    label: "パターン 04",
    title: "全社共有 + 部署ポータル",
    description:
      "メインポータルには全社アナウンスやスペースリンクなど共通情報だけを配置。部署ごとの業務アプリはスペース単位ポータルで管理し、情報を分離できます。",
    image: "/images/portal/space_overview.png",
    imageAlt:
      "全社共有ポータルとスペース単位の部署ポータルを組み合わせた活用例",
  },
];

export default function UseCases() {
  return (
    <SectionWrapper bg="gray">
      <SectionHeader
        label="活用パターン"
        title="さまざまなポータル構成に対応"
        description="タブの分け方や閲覧権限の組み合わせで、自社に合ったポータル構成を実現できます。"
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {patterns.map((pattern) => (
          <div
            key={pattern.label}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="bg-gray-50 p-4">
              <Image
                src={pattern.image}
                alt={pattern.imageAlt}
                width={640}
                height={400}
                className="h-[220px] w-full rounded-lg object-contain object-center md:h-[260px]"
              />
            </div>
            <div className="p-6">
              <span className="text-xs font-bold tracking-wider text-brand">
                {pattern.label}
              </span>
              <h3 className="mt-2 text-lg font-extrabold text-gray-900">
                {pattern.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {pattern.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
