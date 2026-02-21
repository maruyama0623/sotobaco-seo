import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

const features = [
  {
    number: "01",
    title: "タブ整理+閲覧権限",
    subtitle: "部署ごとに、必要なアプリだけを表示",
    description:
      "アプリをタブで分類し、組織・グループ・ユーザーの3軸で閲覧権限を設定。部署に関係のないアプリは表示されないため、必要なアプリだけが並ぶポータルに。",
    image: "/images/portal/tab_permission-compare.png",
    imageAlt:
      "ソトバコポータルのタブ別閲覧権限設定画面。営業部と総務部で表示アプリが異なる",
  },
  {
    number: "02",
    title: "ドラッグ&ドロップで直感操作",
    subtitle: "専門知識不要。管理者1人ですぐに整理",
    description:
      "専門知識は不要。ドラッグ&ドロップでアプリの配置・グループの並べ替えが完了します。管理者1人でもすぐに整理できます。",
    image: "/images/portal/portal_drag-drop.png",
    imageAlt: "ソトバコポータルのドラッグ&ドロップ操作画面",
  },
  {
    number: "03",
    title: "フリープランで今日から",
    subtitle: "期間制限なし。まずは無料で試せる",
    description:
      "フリープランは期間制限なし。4タブまで無料で利用できます。まずは試して、本格導入はあとから検討できます。",
    image: "/images/portal/portal_free-plan.png",
    imageAlt: "ソトバコポータルのフリープラン画面",
  },
];

export default function Features() {
  return (
    <SectionWrapper>
      <SectionHeader
        label="選ばれる理由"
        title="ソトバコポータルが選ばれる3つの理由"
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="bg-gray-50 p-4">
              <Image
                src={feature.image}
                alt={feature.imageAlt}
                width={560}
                height={380}
                className="h-[180px] w-full rounded-lg object-contain object-center md:h-[200px]"
              />
            </div>
            <div className="p-6">
              <span className="text-sm font-bold tracking-wider text-brand">
                理由{feature.number}
              </span>
              <h3 className="mt-2 text-xl font-extrabold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-1 text-sm font-bold text-gray-700">
                {feature.subtitle}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
