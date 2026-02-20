const SERVICE_URL = "https://app.sotobaco.com";

export default function Migration() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-[800px] px-4">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
          Kintone Portal Designerを
          <br className="md:hidden" />
          お使いの方へ
        </h2>
        <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-8">
          <p className="text-center text-sm font-bold text-yellow-800">
            Kintone Portal Designerは2025年5月12日に開発終了しました
          </p>
          <p className="mt-4 text-center leading-relaxed text-gray-700">
            ソトバコポータルは、Portal Designerの移行先としてご利用いただけます。
            タブ整理・閲覧権限・ドラッグ&ドロップなど、ポータル整理に必要な機能を備えています。
          </p>
          <div className="mt-6 text-center">
            <a
              href={SERVICE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
            >
              フリープランで移行を試す
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
