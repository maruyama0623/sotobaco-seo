import Image from "next/image";

const features = [
  {
    title: "タブ整理+閲覧権限",
    description:
      "アプリをタブで分類し、組織・グループ・ユーザーの3軸で閲覧権限を設定。部署に関係のないアプリは表示されないため、必要なアプリだけが並ぶポータルに。",
    image: "/images/tab_permission-compare.png",
    imageAlt: "ソトバコポータルのタブ別閲覧権限設定画面。営業部と総務部で表示アプリが異なる",
  },
  {
    title: "ドラッグ&ドロップで直感操作",
    description:
      "専門知識は不要。ドラッグ&ドロップでアプリの配置・グループの並べ替えが完了します。管理者1人でもすぐに整理できます。",
    image: "/images/portal_drag-drop.png",
    imageAlt: "ソトバコポータルのドラッグ&ドロップ操作画面",
  },
  {
    title: "フリープランで今日から始められる",
    description:
      "フリープランは期間制限なし。4タブまで無料で利用できます。まずは試して、本格導入はあとから検討できます。",
    image: "/images/portal_free-plan.png",
    imageAlt: "ソトバコポータルのフリープラン画面",
  },
];

export default function Features() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
          ソトバコポータルが選ばれる3つの理由
        </h2>
        <div className="mt-12 space-y-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`flex flex-col items-center gap-8 lg:flex-row ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1">
                <span className="text-sm font-bold text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-xl font-bold text-gray-900 md:text-2xl">
                  {feature.title}
                </h3>
                <p className="mt-4 leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
              <div className="flex-1">
                <Image
                  src={feature.image}
                  alt={feature.imageAlt}
                  width={560}
                  height={350}
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
