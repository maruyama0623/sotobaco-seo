const problems = [
  {
    icon: (
      <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    title: "アプリが見つからない",
    description:
      "アプリが増えるにつれてポータルが縦長に。目的のアプリにたどり着くまでスクロールが必要になっていませんか？",
  },
  {
    icon: (
      <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: "関係ないアプリが表示される",
    description:
      "営業部のアプリが経理部にも表示され、管理部のアプリが営業にも表示される。部署に関係のないアプリが増えると、使いにくさの原因に。",
  },
  {
    icon: (
      <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "管理者が少なく整理する時間がない",
    description:
      "kintoneの管理者は1〜2名。日々の問い合わせ対応に追われ、ポータルの整理まで手が回らない。",
  },
];

export default function Problems() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
          こんな課題、ありませんか？
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                {problem.icon}
              </div>
              <h3 className="mt-5 text-lg font-bold text-gray-900">
                {problem.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
