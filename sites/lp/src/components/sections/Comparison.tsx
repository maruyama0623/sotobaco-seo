import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import ComparisonTable from "@/components/ui/ComparisonTable";
import type { Column, Row } from "@/components/ui/ComparisonTable";

const columns: Column[] = [
  { key: "sotobaco", label: "ソトバコポータル", highlight: true, cta: "まずは無料で始める" },
  { key: "plugin", label: "プラグイン型サービス" },
  { key: "code", label: "コードカスタマイズ", subLabel: "（JavaScript / AI活用等）" },
];

const rows: Row[] = [
  {
    label: "費用",
    sotobaco: "無料〜¥9,800/月",
    plugin: "¥10,000〜/月が一般的",
    code: "基本無料（開発工数は別）",
  },
  {
    label: "無料プラン",
    sotobaco: "あり（期間制限なし）",
    plugin: "なし（トライアルのみが多い）",
    code: "無料",
  },
  {
    label: "操作難易度",
    sotobaco: "ドラッグ&ドロップで簡単",
    plugin: "比較的簡単",
    code: "高い（コード知識必要）",
  },
  {
    label: "属人化リスク",
    sotobaco: "低い（誰でも操作可）",
    plugin: "低い",
    code: "高い（作った人に依存）",
  },
  {
    label: "閲覧権限の設定",
    sotobaco: "タブ単位（3軸で柔軟に設定）",
    plugin: "画面単位が一般的",
    code: "実装次第",
  },
  {
    label: "通知・未処理・アプリ一覧",
    sotobaco: "○",
    plugin: "△（サービスによる）",
    code: "実装次第",
  },
  {
    label: "スペース単位ポータル",
    sotobaco: "○",
    plugin: "サービスによる",
    code: "実装次第",
  },
  {
    label: "グラフ表示",
    sotobaco: "○",
    plugin: "○",
    code: "実装次第",
  },
  {
    label: "スマートフォン対応",
    sotobaco: "○",
    plugin: "サービスによる",
    code: "実装次第",
  },
];

export default function Comparison() {
  return (
    <SectionWrapper>
      <SectionHeader label="比較" title="ポータルカスタマイズ方法の比較" />
      <div className="mt-12">
        <ComparisonTable columns={columns} rows={rows} />
      </div>
    </SectionWrapper>
  );
}
