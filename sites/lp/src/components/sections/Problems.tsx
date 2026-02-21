import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";

const problems = [
  { text: "アプリが増えすぎて、", bold: "目的のアプリが見つからない" },
  { text: "部署別の見せ分けができず、", bold: "関係ないアプリが表示される" },
  { text: "管理者が少なく、", bold: "ポータルを整理する時間がない" },
];

export default function Problems() {
  return (
    <SectionWrapper>
      <SectionHeader label="よくある課題" title="こんな課題、ありませんか？" />

      <div className="mt-12 flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-12">
        {/* Image — left */}
        <div className="flex justify-center md:w-[50%]">
          <img
            src="/images/portal/kintone_apps-overflow.webp"
            alt="kintoneのアプリが増えすぎて縦長になったポータル画面"
            className="w-full max-w-[500px] object-contain"
          />
        </div>

        {/* Problem list — right */}
        <div className="w-full md:w-[55%]">
          <p className="text-sm leading-relaxed text-gray-700">
            kintoneのアプリが増えるにつれて、ポータルが使いにくくなっていませんか？「どこに何があるかわからない」「社員から問い合わせが絶えない」——そんな課題を抱えるkintone管理者の方は少なくありません。
          </p>
        <div className="mt-5 rounded-xl border-2 border-gray-300 px-8 py-6">
          <ol className="space-y-4">
            {problems.map((problem, i) => (
              <li key={i} className="flex gap-2 text-base leading-relaxed text-gray-800 md:text-lg">
                <span className="shrink-0 font-bold text-gray-400">
                  {i + 1}.
                </span>
                <span>
                  {problem.text}
                  <span className="font-bold underline decoration-brand decoration-2 underline-offset-4">
                    {problem.bold}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
