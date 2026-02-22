import type { Plan } from "@/components/ui/PlanBadge";

/* ──────────── Plan Data ──────────── */

export interface PlanStat {
  label: string;
  value: string;
}

export interface PlanCardData {
  name: string;
  description: string;
  price: string;
  unit: string;
  period: string;
  stats: PlanStat[];
  features: string[];
  cta: string;
}

export const plans: PlanCardData[] = [
  {
    name: "フリー",
    price: "0",
    unit: "円",
    period: "",
    description: "まずは試したい方に",
    stats: [
      { label: "メンバー上限", value: "1名" },
      { label: "タブ上限", value: "4タブ" },
    ],
    features: [
      "グラフ埋め込み（各1個まで/1タブ）",
      "通知/未処理/アプリ一覧",
      "閲覧権限設定",
      "限定公開",
    ],

    cta: "フリープランを始める",
  },
  {
    name: "ライト",
    price: "3,800",
    unit: "円/月",
    period: "（年払い: ¥36,000/年）",
    description: "本格的に整理したい企業に",
    stats: [
      { label: "メンバー上限", value: "2名" },
      { label: "タブ上限", value: "無制限" },
    ],
    features: [
      "グラフ埋め込み無制限",
      "通知/未処理/アプリ一覧",
      "全体アナウンス",
      "グループ説明文",
    ],

    cta: "まずは無料で始める",
  },
  {
    name: "スタンダード",
    price: "9,800",
    unit: "円/月",
    period: "（年払い: ¥108,000/年）",
    description: "全機能を使いたい企業に",
    stats: [
      { label: "メンバー上限", value: "5名" },
      { label: "タブ上限", value: "無制限" },
    ],
    features: [
      "ライトの全機能",
      "アナウンスカテゴリ設定",
      "スペースリンク対応",
      "スペース単位ポータル無制限",
    ],

    cta: "まずは無料で始める",
  },
];

/* ──────────── Comparison Table ──────────── */

export type ComparisonRow = {
  label: string;
  href?: string;
  free: string;
  light: string;
  standard: string;
};

export const comparisonRows: ComparisonRow[] = [
  { label: "タブ上限", href: "/sotobacoportal/features/#tab", free: "4タブまで", light: "無制限", standard: "無制限" },
  { label: "グラフ埋め込み", href: "/sotobacoportal/features/#graph", free: "各1個まで/1タブ", light: "無制限", standard: "無制限" },
  { label: "通知/未処理/アプリ一覧", href: "/sotobacoportal/features/#notification", free: "○", light: "○", standard: "○" },
  { label: "グループ説明文", href: "/sotobacoportal/features/#group", free: "×", light: "○", standard: "○" },
  { label: "全体アナウンス", href: "/sotobacoportal/features/#announce", free: "×", light: "○", standard: "○" },
  { label: "アナウンス表示件数設定", href: "/sotobacoportal/features/#announce", free: "×", light: "○", standard: "○" },
  { label: "アナウンスカテゴリ設定", href: "/sotobacoportal/features/#announce", free: "×", light: "×", standard: "○" },
  { label: "スペースリンク", href: "/sotobacoportal/features/#space-link", free: "×", light: "×", standard: "○" },
  { label: "スペース単位ポータル", href: "/sotobacoportal/features/#space", free: "×", light: "×", standard: "無制限" },
  { label: "メンバー上限", href: "/sotobacoportal/features/#member", free: "1名", light: "2名", standard: "5名" },
];

/* ──────────── FAQ ──────────── */

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "フリープランに期間制限はありますか？",
    answer:
      "いいえ、フリープランは期間制限なくご利用いただけます。4タブまで無料で使えるので、まずはお気軽にお試しください。",
  },
  {
    question: "導入にどのくらい時間がかかりますか？",
    answer:
      "最短7分で導入できます。アカウント作成、kintone連携設定、ポータル設定の3ステップで完了します。",
  },
  {
    question: "kintoneのプラグインですか？",
    answer:
      "いいえ、ソトバコポータルはWebアプリ（kintone外のサービス）です。プラグインではないため、kintoneプラグインの制約を受けません。",
  },
  {
    question: "kintone連携にはどの権限が必要ですか？",
    answer:
      "初回のkintone連携設定時に、cybozu.com共通管理者権限が必要です。OAuthクライアントの追加を行います。",
  },
  {
    question: "閲覧権限の組織・グループはどこから取得されますか？",
    answer:
      "kintoneに設定されている組織・グループを読み込んで使用します。ソトバコポータル側で独自に組織やグループを管理する必要はありません。",
  },
  {
    question: "スマートフォンから利用できますか？",
    answer:
      "はい。JSファイル（portal-design-common.min.js）をkintone全体カスタマイズのスマートフォン用JSとしてアップロードすることで対応できます。",
  },
  {
    question: "Kintone Portal Designerから移行できますか？",
    answer:
      "Portal Designerのデザインをそのまま引き継ぐことはできませんが、ポータル整理の代替サービスとしてご利用いただけます。Portal Designerは2025年5月12日に開発終了しました。ソトバコポータルは最短7分で新しいポータルを構築でき、フリープランから試せます。",
  },
  {
    question: "プランの変更はいつでもできますか？",
    answer:
      "はい、プランのアップグレードはいつでも可能です。ダウングレードには対応しておりません。",
  },
  {
    question: "解約に手数料はかかりますか？",
    answer:
      "いいえ、解約手数料はかかりません。いつでも解約可能です。",
  },
  {
    question: "課金はいつから始まりますか？",
    answer:
      "有料プランのお申し込みをいただいた翌月より、課金が始まります。",
  },
  {
    question: "支払い方法は何が選べますか？",
    answer:
      "現時点では銀行振り込みのみとなります。",
  },
  {
    question: "動作環境は？",
    answer:
      "以下のWebブラウザー上で動作いたします。Microsoft Edge最新版（Chromium版のみ）、Mozilla Firefox最新版、Google Chrome最新版、Safari最新版。",
  },
  {
    question: "ソトバコポータル側には、kintoneのレコードやアカウント情報は保存しますか？",
    answer:
      "kintoneのレコード情報は一切保存しませんのでご安心ください。ソトバコポータルが保存するのは、ポータル画面を表示するためのレイアウト情報（アプリ名やアプリID）と、タブの閲覧権限を管理するためのユーザーコード（kintoneのログイン名）のみです。kintone内の顧客データや売上データなどのレコード情報、パスワード等のアカウント詳細は一切保存しません。ソトバコポータルは、必要最低限の情報だけを管理する設計となっており、安全にご利用いただけます。",
  },
  {
    question: "導入前に相談できますか？",
    answer:
      "はい、お問い合わせフォームからお気軽にご相談ください。3営業日以内にご回答いたします。",
  },
];

/* ──────────── Feature Data ──────────── */

export interface Feature {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  plans: Plan[];
}

/** Main features used in both MainFeatures section and features page */
export const mainFeatures: Feature[] = [
  {
    title: "タブでアプリを簡単整理",
    description:
      "用途や部署ごとにアプリをタブで分類できるから、必要な情報にすぐアクセス可能。アプリが多くなっても、目的別にすっきり整理されたポータルで迷いません。",
    image: "/images/portal/portal_tab-organized.png",
    imageAlt: "ソトバコポータルのタブ整理画面。タブごとにアプリが分類されている",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    title: "アプリを目的別にグループ化",
    description:
      "「業務別」「機能別」など、タブ内のアプリを目的に応じてグループ分け。例えば「総務」タブの中に「勤怠管理」「備品申請」などをまとめて表示できます。",
    image: "/images/portal/portal_group-settings.png",
    imageAlt: "ソトバコポータルのグループ設定画面。アプリを目的別にグループ化",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    title: "色分け&アイコンでわかりやすい",
    description:
      "アプリカードに色やアイコンを設定できるから、パッと見て内容が伝わるポータルに。例えば「営業」は青、「経理」は緑など、視覚的に迷わない設計が可能です。",
    image: "/images/portal/portal_app-color.png",
    imageAlt: "ソトバコポータルのカラー設定画面。7色から選択可能",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    title: "タブごとに閲覧権限を設定",
    description:
      "部署や役職に合わせて、タブ単位で表示・非表示をコントロール。見せたい情報だけを見せられるので、混乱を防ぎます。",
    image: "/images/portal/tab_permission-compare.png",
    imageAlt: "ソトバコポータルのタブ別閲覧権限。営業部と総務部で表示が異なる",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    title: "スペースごとのポータル編集",
    description:
      "スペースごとに専用のポータル画面を設定でき、用途に応じたアプリ配置や構成で、使いやすい入口を実現します。",
    image: "/images/portal/space_kintone-view.png",
    imageAlt: "kintoneのスペースからソトバコポータルのスペース単位ポータルが表示されている画面",
    plans: ["スタンダード"],
  },
  {
    title: "特定のユーザーのみ限定適用",
    description:
      "作成中のポータルを特定のユーザーだけに表示できるから、テスト運用や段階的な導入も安心。全社公開前に動作やデザインをじっくり確認できます。",
    image: "/images/portal/portal_limited-public.png",
    imageAlt: "ソトバコポータルの限定公開設定画面",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    title: "通知・未処理一覧をポータルに表示",
    description:
      "kintoneの通知一覧と未処理一覧を、ポータルのサイドバーにまとめて表示。承認待ち・確認待ちのタスクも、ポータルを開くだけですぐに把握できます。対応漏れや確認忘れを防ぎ、業務の流れを止めません。",
    image: "/images/portal/portal_sidebar.png",
    imageAlt: "ソトバコポータルのサイドバーに通知一覧・未処理一覧・アプリ一覧が表示されている画面",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    title: "全体アナウンスをポータルに表示",
    description:
      "社内で共有したい情報を、ポータル上部にすぐに表示可能。掲示板よりも目につきやすく、緊急連絡や周知事項も確実に届けられます。",
    image: "/images/portal/announce_overview.png",
    imageAlt: "ソトバコポータルの全体アナウンス機能。カテゴリ別に表示",
    plans: ["ライト", "スタンダード"],
  },
  {
    title: "ポータルに外部リンクを集約",
    description:
      "社内ポータルに業務で使う外部サービスや社内システムのリンクをまとめて配置。kintoneにアクセスすれば、必要な情報やツールにすぐアクセスできます。",
    image: "/images/portal/portal_app-link.png",
    imageAlt: "ソトバコポータルの外部リンク設定画面",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    title: "リアルタイムにグラフ表示",
    description:
      "kintoneのグラフをポータル上にそのまま表示。最新データが常に反映されるから、売上や進捗などの状況をリアルタイムで確認できます。",
    image: "/images/portal/graph_overview.png",
    imageAlt: "ソトバコポータルにkintoneのグラフが埋め込み表示されている画面",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    title: "スマホでも快適なポータル",
    description:
      "kintoneのポータル画面がスマートフォンでも見やすく表示されるので、外出先からも業務に必要な情報へスムーズにアクセスできます。",
    image: "/images/portal/smartphone_app.png",
    imageAlt: "ソトバコポータルのスマートフォン対応画面",
    plans: ["フリー", "ライト", "スタンダード"],
  },
];

/* ──────────── Feature Page Detail Sections ──────────── */

export interface FeatureSection {
  id: string;
  title: string;
  description: string;
  details: string[];
  image: string;
  imageAlt: string;
  plans: Plan[];
}

export const featureSections: FeatureSection[] = [
  {
    id: "tab",
    title: "タブでアプリを簡単整理",
    description:
      "用途や部署ごとにアプリをタブで分類し、必要な情報にすぐアクセスできるポータルを作れます。アプリが増えても目的別にすっきり整理されるので、社員が迷うことがありません。",
    details: [
      "アプリが増えても目的のアプリにすぐたどり着ける",
      "部署・用途・プロジェクトごとにポータルを自由に整理",
      "「どこに何があるかわからない」をなくし、社員からの問い合わせを削減",
      "ドラッグ&ドロップで並び替えできるから管理もかんたん",
    ],
    image: "/images/portal/portal_tab-organized.png",
    imageAlt: "ソトバコポータルのタブ整理画面。タブごとにアプリが分類されている",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    id: "group",
    title: "アプリを目的別にグループ化",
    description:
      "タブの中をさらにグループで分類できます。「業務別」「機能別」など目的に応じた整理で、必要なアプリにすばやくたどり着けます。",
    details: [
      "業務単位でアプリをまとめて、目的のアプリに迷わずたどり着ける",
      "アイコンや説明文を添えて、用途が一目でわかるポータルに",
      "新入社員でも「どのアプリを使えばいいか」がすぐわかる",
      "レイアウトの自由度が高く、部署に最適なポータル構成を実現",
    ],
    image: "/images/portal/portal_group-settings.png",
    imageAlt: "ソトバコポータルのグループ設定画面。アプリを目的別にグループ化",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    id: "visual",
    title: "色分け&アイコンでわかりやすい",
    description:
      "アプリカードに色やアイコンを設定できるから、パッと見て内容が伝わるポータルに。例えば「営業」は青、「経理」は緑など、視覚的に迷わない設計が可能です。",
    details: [
      "色とアイコンで業務内容が直感的にわかるポータルに",
      "似たようなアプリ名でも迷わず目的のアプリを選べる",
      "アプリの重要度に応じてカードサイズを変えて視認性を向上",
      "開発やデザインの知識がなくても見やすいポータルが作れる",
    ],
    image: "/images/portal/portal_app-color.png",
    imageAlt: "ソトバコポータルのアプリカードカラー設定画面。7色から選択可能",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    id: "permission",
    title: "タブごとに閲覧権限を設定",
    description:
      "部署や役職に合わせて、タブ単位で表示・非表示をコントロール。組織・グループ・ユーザーの3軸を組み合わせた柔軟な権限設定で、見せたい情報だけを見せられます。",
    details: [
      "部署に関係のないアプリが表示されず、シンプルなポータルを実現",
      "組織・グループ・ユーザーの3軸を組み合わせた柔軟な権限設定",
      "kintoneの組織・グループをそのまま使えるので設定の手間が少ない",
      "各社員が自分に必要な情報だけを見るポータルで業務効率アップ",
    ],
    image: "/images/portal/tab_permission-compare.png",
    imageAlt: "ソトバコポータルのタブ別閲覧権限設定。営業部と総務部で表示アプリが異なる",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    id: "space",
    title: "スペースごとのポータル編集",
    description:
      "スペースごとに専用のポータル画面を設定でき、用途に応じたアプリ配置や構成で、使いやすい入口を実現します。プロジェクト・チーム・拠点ごとに情報を整理できます。",
    details: [
      "全社ポータルと部署・プロジェクト専用ポータルを使い分けられる",
      "チームごとに最適化された入口で、必要な情報にすぐアクセス",
      "情報過多を解消し、各チームが自分の業務に集中できる環境に",
    ],
    image: "/images/portal/space_kintone-view.png",
    imageAlt: "kintoneのスペースからソトバコポータルのスペース単位ポータルが表示されている画面",
    plans: ["スタンダード"],
  },
  {
    id: "limited",
    title: "特定のユーザーのみ限定適用",
    description:
      "作成中のポータルを特定のユーザーだけに表示できます。全社公開前にデザインや動作をテストしたり、段階的に導入を進めることが可能です。",
    details: [
      "全社公開前にデザインや動作を安心してテストできる",
      "段階的な導入で、社員の混乱を防ぎながらスムーズに展開",
      "管理者だけで事前確認し、品質を担保した状態で全社リリース",
    ],
    image: "/images/portal/portal_limited-public.png",
    imageAlt: "ソトバコポータルの限定公開設定画面",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    id: "notification",
    title: "通知・未処理一覧をポータルに表示",
    description:
      "kintoneの通知一覧と未処理一覧を、ポータルのサイドバーにまとめて表示。承認待ち・確認待ちのタスクも、ポータルを開くだけですぐに把握できます。アプリ一覧の表示にも対応しています。",
    details: [
      "承認待ち・確認待ちのタスクをポータルですぐに把握できる",
      "対応漏れや確認忘れを防ぎ、業務の流れを止めない",
      "通知・未処理・アプリ一覧をポータルに集約して画面遷移を削減",
      "ポータルが業務のハブとなり、kintoneの活用率が向上",
    ],
    image: "/images/portal/portal_sidebar.png",
    imageAlt: "ソトバコポータルのサイドバーに通知一覧・未処理一覧・アプリ一覧が表示されている画面",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    id: "announce",
    title: "全体アナウンスをポータルに表示",
    description:
      "社内で共有したい情報を、ポータル上部にすぐに表示可能。掲示板よりも目につきやすく、緊急連絡や周知事項も確実に届けられます。kintoneアプリのレコードと連動して更新されます。",
    details: [
      "社内の重要なお知らせをポータル上部で確実に届けられる",
      "掲示板を見に行く手間がなく、情報の見逃しを防止",
      "カテゴリ分けで種類別に整理し、必要な情報を探しやすく",
      "kintoneアプリと連動して自動更新されるので運用の手間が少ない",
    ],
    image: "/images/portal/announce_overview.png",
    imageAlt: "ソトバコポータルの全体アナウンス表示画面。カテゴリ別に表示",
    plans: ["ライト", "スタンダード"],
  },
  {
    id: "external",
    title: "ポータルに外部リンクを集約",
    description:
      "社内ポータルに業務で使う外部サービスや社内システムのリンクをまとめて配置。kintoneにアクセスすれば、必要な情報やツールにすぐアクセスできます。",
    details: [
      "kintoneと外部ツールをポータルに一元化して画面の行き来を削減",
      "スプレッドシート・勤怠システム・社内Wikiなど業務ツールへの導線を集約",
      "「あのツールのURLどこだっけ？」を解消して業務効率アップ",
    ],
    image: "/images/portal/portal_app-link.png",
    imageAlt: "ソトバコポータルの外部リンク設定画面",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    id: "space-link",
    title: "kintoneスペースへのリンクカード",
    description:
      "kintoneのスペースへのリンクをアプリカードとしてポータルに配置できます。スペース名やカバー画像はkintone側の変更に自動で同期されるため、手動で更新する手間がありません。",
    details: [
      "プロジェクトや部署のスペースへの導線をポータルにかんたんに設置",
      "スペース名・カバー画像はkintoneと自動同期で手動更新が不要",
      "チーム間の情報共有がスムーズになり、スペースの活用が促進",
    ],
    image: "/images/portal/space-link_settings.png",
    imageAlt: "ソトバコポータルのスペースリンクカード設定画面",
    plans: ["スタンダード"],
  },
  {
    id: "graph",
    title: "リアルタイムにグラフ表示",
    description:
      "kintoneのグラフをポータル上にそのまま表示。最新データが常に反映されるから、売上や進捗などの状況をリアルタイムで確認できます。",
    details: [
      "売上・進捗・KPIなどの状況をポータルを開くだけでリアルタイムに把握",
      "わざわざアプリを開かなくても最新データを確認できる",
      "ポータルをダッシュボード化して意思決定のスピードを向上",
    ],
    image: "/images/portal/graph_overview.png",
    imageAlt: "ソトバコポータルにkintoneのグラフが埋め込み表示されている画面",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    id: "smartphone",
    title: "スマホでも快適なポータル",
    description:
      "kintoneのポータル画面がスマートフォンでも見やすく表示されるので、外出先からも業務に必要な情報へスムーズにアクセスできます。",
    details: [
      "外出先・現場からkintoneアプリにすばやくアクセス",
      "スマホでもPCと同じように整理されたポータルを利用可能",
      "移動中や出張先でも承認・確認作業がすぐにできる",
    ],
    image: "/images/portal/smartphone_app.png",
    imageAlt: "ソトバコポータルのスマートフォン対応画面",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    id: "member",
    title: "メンバー上限",
    description:
      "メンバー上限は、ソトバコポータルの管理画面にアクセスしてポータルを編集できる人数の上限です。ソトバコポータルを適用するkintoneユーザーには制限はありません。全社員がポータルを利用できます。",
    details: [
      "複数の管理者でポータルの運用・管理を分担できる",
      "担当者の異動や退職時も引き継ぎがスムーズ",
      "ポータルの閲覧ユーザー数に制限なし（全社員が利用可能）",
      "属人化を防ぎ、チームでポータルを継続的に改善",
    ],
    image: "/images/portal/member_settings.png",
    imageAlt: "ソトバコポータルのメンバー管理画面",
    plans: ["フリー", "ライト", "スタンダード"],
  },
];

export const otherFeatures: Feature[] = [
  {
    title: "ドラッグ&ドロップ操作",
    description:
      "アプリカードの配置変更やグループの並べ替えをドラッグ&ドロップで完了。HTMLやJavaScriptの知識がなくても、管理者1人でポータルを整理できます。属人化を防ぎ、担当者が変わっても運用を継続できます。",
    image: "/images/portal/portal_drag-drop.png",
    imageAlt: "ソトバコポータルのドラッグ&ドロップ操作画面",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    title: "アプリカード操作メニュー",
    description:
      "各アプリカードの3点メニューから「編集」「グループ移動」「複製」「削除」が可能。グループ移動はタブをまたいだ移動にも対応しており、複製で同じ設定のカードをすばやく別のタブ・グループに配置できます。",
    image: "/images/portal/portal_app-move.png",
    imageAlt: "ソトバコポータルのアプリカード操作メニュー",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    title: "グループ操作メニュー",
    description:
      "各グループの右上3点メニューから「編集」「タブ移動」「複製」「削除」が可能。タブ移動でグループごと別のタブに移動でき、複製でグループ内のアプリカードを含めてまるごと複製できます。",
    image: "/images/portal/portal_group-tab-move.png",
    imageAlt: "ソトバコポータルのグループ操作メニュー",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    title: "kintoneポータル非表示",
    description:
      "ソトバコポータルの導入後、kintoneのデフォルトポータルを非表示にできます。対象はユーザー・グループ・組織単位で指定可能。ソトバコポータルへの一本化がスムーズに行えます。",
    image: "/images/portal/portal_display-settings.png",
    imageAlt: "kintoneデフォルトポータルの非表示設定",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    title: "アプリカード位置固定",
    description:
      "アプリカードの表示位置を固定できます。画面サイズやブラウザの幅が変わっても、アプリカードの配置が崩れることなく、いつも同じ場所で目的のアプリを見つけられます。",
    image: "/images/portal/app-card_fixed-position.png",
    imageAlt: "ソトバコポータルのアプリカード位置固定設定",
    plans: ["フリー", "ライト", "スタンダード"],
  },
  {
    title: "ユーザー権限管理（ロール）",
    description:
      "「管理者」と「ポータル編集者」の2つのロールでアクセス権を管理。管理者はすべてのページにアクセスでき、ポータル編集者はポータルの編集のみに限定されます。役割に応じた適切な権限設定が可能です。",
    image: "/images/portal/member_settings.png",
    imageAlt: "ソトバコポータルのユーザー権限管理画面",
    plans: ["フリー", "ライト", "スタンダード"],
  },
];
