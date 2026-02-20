const testimonials = [
  {
    quote:
      "kintoneのアプリが増えすぎて、使いたいアプリがなかなか見つからなかったのですが、ソトバコポータルで部署ごとにタブ分けしたら、社員からの問い合わせが減りました。",
    role: "製造業 / kintone管理者",
  },
  {
    quote:
      "kintone導入時にデフォルトのポータルだとわかりづらくて定着が進まなかったのですが、ソトバコポータルを使ってからは各部署が自分のタブを見るだけでよくなりました。",
    role: "サービス業 / 情報システム担当",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
          kintone管理者の声
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
            >
              <svg className="h-8 w-8 text-brand/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="mt-4 leading-relaxed text-gray-700">{t.quote}</p>
              <p className="mt-4 text-sm font-medium text-gray-500">
                {t.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
