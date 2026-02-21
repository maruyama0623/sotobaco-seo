import SectionWrapper from "@/components/ui/SectionWrapper";

const stats = [
  {
    value: "7",
    unit: "分",
    label: "最短導入時間",
    description: "3ステップで導入完了",
    icon: (
      <svg className="h-20 w-20 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    value: "0",
    unit: "円",
    label: "フリープラン",
    description: "期間制限なし・すぐ始められる",
    icon: (
      <svg className="h-20 w-20 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    value: "部署別",
    unit: "",
    label: "閲覧権限",
    description: "組織・グループ・ユーザー単位で設定",
    icon: (
      <svg className="h-20 w-20 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

export default function Numbers() {
  return (
    <SectionWrapper>
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-sm"
          >
            <div className="mb-4">{stat.icon}</div>
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="text-4xl font-extrabold text-gray-900 md:text-5xl">
                {stat.value}
              </span>
              {stat.unit && (
                <span className="text-xl font-bold text-gray-900">
                  {stat.unit}
                </span>
              )}
            </div>
            <p className="mt-2 text-base font-bold text-gray-900">
              {stat.label}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
