const stats = [
  {
    value: "7",
    unit: "分",
    label: "最短導入時間",
    description: "3ステップで導入完了",
  },
  {
    value: "0",
    unit: "円",
    label: "フリープラン",
    description: "期間制限なし",
  },
  {
    value: "3",
    unit: "軸",
    label: "閲覧権限",
    description: "組織・グループ・ユーザー",
  },
];

export default function Numbers() {
  return (
    <section className="bg-brand py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center text-white">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-extrabold md:text-6xl">
                  {stat.value}
                </span>
                <span className="text-2xl font-bold">{stat.unit}</span>
              </div>
              <p className="mt-2 text-lg font-bold">{stat.label}</p>
              <p className="mt-1 text-sm text-white/80">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
