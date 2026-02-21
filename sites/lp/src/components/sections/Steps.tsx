import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
  {
    number: "Step1",
    title: "アカウント作成",
    description: "メールアドレスだけでOK。1分で完了します。",
    image: "/images/icons/howto_01.jpg",
    imageAlt: "アカウント作成のアイコン",
  },
  {
    number: "Step2",
    title: "kintone接続設定",
    description: "画面の案内に沿って、IDを入力するだけで接続できます。",
    image: "/images/icons/howto_02.jpg",
    imageAlt: "kintone接続設定のアイコン",
  },
  {
    number: "Step3",
    title: "初期設定",
    description:
      "管理画面からJSファイルをダウンロードして、kintoneにアップロードするだけ。コードの知識は不要です。",
    image: "/images/icons/howto_03.jpg",
    imageAlt: "初期設定のアイコン",
  },
];

function Arrow() {
  return (
    <div className="hidden items-center self-center md:flex">
      <svg
        className="h-8 w-8 text-brand"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

export default function Steps() {
  return (
    <SectionWrapper>
      <SectionHeader label="導入の流れ" title="導入は簡単3ステップで完了！" />

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-4">
        {steps.map((step, i) => (
          <>
            {/* Card */}
            <div
              key={step.number}
              className="flex flex-col items-center overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="w-full bg-brand py-3 text-center text-base font-extrabold text-white">
                {step.number}
              </div>
              <div className="flex items-center justify-center px-6 py-8">
                <img
                  src={step.image}
                  alt={step.imageAlt}
                  className="h-32 w-32 object-contain"
                />
              </div>
              <p className="px-4 text-center text-lg font-extrabold text-gray-900">
                {step.title}
              </p>
              <p className="px-4 pb-6 pt-2 text-center text-xs leading-relaxed text-gray-500">
                {step.description}
              </p>
            </div>

            {/* Arrow between cards */}
            {i < steps.length - 1 && <Arrow key={`arrow-${i}`} />}
          </>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-gray-400">
        ※ソトバコポータル利用時はサイボウズ社のkintoneを別途ご契約いただく必要がございます。
      </p>
    </SectionWrapper>
  );
}
