const SERVICE_URL = "https://app.sotobaco.com";

export default function CtaSection() {
  return (
    <section className="bg-brand py-16 md:py-24">
      <div className="mx-auto max-w-[800px] px-4 text-center">
        <h2 className="text-2xl font-extrabold text-white md:text-3xl">
          まずはフリープランで
          <br className="md:hidden" />
          体験しませんか？
        </h2>
        <p className="mt-4 text-white/80">
          フリープランは期間制限なし。4タブまで無料でご利用いただけます。
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={SERVICE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-bold text-brand shadow-lg transition hover:bg-gray-50 hover:shadow-xl"
          >
            フリープランを始める（無料）
          </a>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
          <a href="/pricing/" className="underline transition hover:text-white">
            料金プランを見る
          </a>
          <a
            href="https://guide.sotobaco.com/portal/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition hover:text-white"
          >
            操作ガイドを見る
          </a>
        </div>
      </div>
    </section>
  );
}
