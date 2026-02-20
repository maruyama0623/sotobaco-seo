const SERVICE_URL = "https://app.sotobaco.com";

const steps = [
  {
    number: "1",
    title: "アカウント作成",
    description: "ソトバコポータルにアクセスして、メールアドレスでアカウントを作成します。",
  },
  {
    number: "2",
    title: "kintone連携設定",
    description:
      "cybozu.com共通管理画面でOAuthクライアントを追加し、クライアントID・シークレットを入力して接続します。",
  },
  {
    number: "3",
    title: "ポータル設定",
    description:
      "タブ・グループ・アプリカードを追加して「ポータルを更新する」をクリック。これだけで完了です。",
  },
];

export default function Steps() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
          最短7分。3ステップで導入完了
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl font-extrabold text-white">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a
            href={SERVICE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-brand px-8 py-4 text-base font-bold text-white shadow-lg transition hover:bg-brand-dark hover:shadow-xl"
          >
            フリープランを始める（無料）
          </a>
        </div>
      </div>
    </section>
  );
}
