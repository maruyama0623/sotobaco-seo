const rows = [
  {
    label: "費用",
    sotobaco: "無料〜¥9,800/月",
    kodawari: "¥12,000/月（税別）",
    designer: "無料（開発終了）",
    ai: "基本無料",
  },
  {
    label: "無料プラン",
    sotobaco: "あり（期間制限なし）",
    kodawari: "なし（30日トライアルのみ）",
    designer: "無料（開発終了）",
    ai: "無料",
    highlight: true,
  },
  {
    label: "操作難易度",
    sotobaco: "ドラッグ&ドロップで簡単",
    kodawari: "ドラッグ&ドロップで比較的簡単",
    designer: "設定が必要",
    ai: "高い（コード知識必要）",
  },
  {
    label: "属人化リスク",
    sotobaco: "低い（誰でも操作可）",
    kodawari: "低い",
    designer: "高い",
    ai: "高い（作った人に依存）",
  },
  {
    label: "閲覧権限の設定単位",
    sotobaco: "タブ単位（3軸で柔軟に設定）",
    kodawari: "画面単位（最大10画面）",
    designer: "なし",
    ai: "実装次第",
  },
  {
    label: "グラフ表示",
    sotobaco: "○",
    kodawari: "◎（複数アプリ統合）",
    designer: "△",
    ai: "実装次第",
  },
  {
    label: "スマートフォン対応",
    sotobaco: "○",
    kodawari: "○",
    designer: "×",
    ai: "実装次第",
  },
  {
    label: "今後のサポート",
    sotobaco: "○",
    kodawari: "○",
    designer: "×（開発終了）",
    ai: "−",
  },
];

export default function Comparison() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
          他のポータルカスタマイズ方法との比較
        </h2>
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-500" />
                <th className="bg-brand-light px-4 py-3 text-center text-sm font-bold text-brand">
                  ソトバコポータル
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">
                  こだわりkintone
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">
                  Portal Designer
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">
                  AI活用
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-gray-100">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">
                    {row.label}
                  </td>
                  <td
                    className={`bg-brand-light/50 px-4 py-3 text-center text-sm font-medium text-gray-900 ${
                      row.highlight ? "font-bold text-brand" : ""
                    }`}
                  >
                    {row.sotobaco}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {row.kodawari}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {row.designer}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {row.ai}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
