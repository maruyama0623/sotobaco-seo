import SectionHeader from "@/components/ui/SectionHeader";

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

function UserIcon() {
  return (
    <svg
      className="h-14 w-14 text-brand/40"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section className="relative">
      {/* Top wave */}
      <svg
        className="block w-full"
        viewBox="0 0 1440 80"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 80V40C240 0 480 0 720 40C960 80 1200 80 1440 40V80H0Z"
          className="fill-brand-light"
        />
      </svg>

      {/* Content */}
      <div className="bg-brand-light pb-4">
        <div className="mx-auto max-w-[1200px] px-4">
          <SectionHeader label="お客様の声" title="kintone管理者の声" />
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-8 shadow-sm"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-light">
                  <UserIcon />
                </div>
                <p className="text-sm leading-loose text-gray-700">
                  {t.quote}
                </p>
                <p className="mt-4 text-xs font-bold text-gray-400">
                  {t.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <svg
        className="block w-full"
        viewBox="0 0 1440 80"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 0V40C240 80 480 80 720 40C960 0 1200 0 1440 40V0H0Z"
          className="fill-brand-light"
        />
      </svg>
    </section>
  );
}
