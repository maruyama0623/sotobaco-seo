import type { Metadata } from "next";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/seo";

const SERVICE_URL = "https://app.sotobaco.com";

export const metadata: Metadata = buildPageMetadata(
  "機能一覧",
  "ソトバコポータルの全機能を紹介。タブ整理・閲覧権限・ドラッグ&ドロップ・グラフ表示・全体アナウンスなど、kintoneのポータルを使いやすくする機能が揃っています。",
  "/features/"
);

type FeatureSection = {
  id: string;
  badge?: string;
  title: string;
  description: string;
  details: string[];
  image: string;
  imageAlt: string;
};

const featureSections: FeatureSection[] = [
  {
    id: "tab",
    title: "部署ごとに、必要なアプリだけを表示",
    description:
      "アプリをタブで分類し、組織・グループ・ユーザーの3軸で閲覧権限を設定できます。権限外のタブはそのユーザーには表示されません。",
    details: [
      "タブ単位で閲覧権限を設定（組織・グループ・ユーザーの3軸を組み合わせ可能）",
      "kintoneに設定されている組織・グループを読み込んで使用",
      "権限外のタブは非表示になるため、部署に関係のないアプリが表示されない",
    ],
    image: "/images/tab_permission-compare.png",
    imageAlt: "ソトバコポータルのタブ別閲覧権限設定。営業部と総務部で表示アプリが異なる",
  },
  {
    id: "app-card",
    title: "kintoneアプリも外部サービスも、ひとつのポータルに",
    description:
      "kintoneアプリへのリンクだけでなく、外部サービスのURLやkintoneスペースもアプリカードとして追加できます。",
    details: [
      "kintoneアプリリンク：アプリアイコンを自動取得",
      "外部リンク：スプレッドシートや勤怠システムなどのURLを登録",
      "スペースリンク：kintoneスペースへのリンク。名前・画像はkintone側と自動同期（スタンダード）",
      "サイズ（大/小）・カラー（7色）・説明文・アイコンを設定可能",
    ],
    image: "/images/portal_app-list.png",
    imageAlt: "ソトバコポータルのアプリカード一覧。kintoneアプリと外部リンクが並ぶ",
  },
  {
    id: "visual",
    title: "ひと目で業務内容がわかるポータルに",
    description:
      "アプリカードは7色のカラーとアイコンを設定でき、グループにもアイコンを設定できます。部署・業務の種別を直感的に識別できます。",
    details: [
      "アプリカード：7色のカラー＋アイコン設定",
      "グループ：アイコン設定で部署・業務を視覚的に分類",
      "グループ名の表示/非表示切り替えで、すっきりしたレイアウトも可能",
      "グループ説明文で用途を社員にわかりやすく伝えられる（ライト以上）",
    ],
    image: "/images/portal_app-color.png",
    imageAlt: "ソトバコポータルのアプリカードカラー設定画面。7色から選択可能",
  },
  {
    id: "drag-drop",
    title: "専門知識不要。管理者1人で、すぐに整理",
    description:
      "ドラッグ&ドロップでアプリカードの配置やグループの並べ替えが完了。HTMLやJavaScriptの知識は不要です。",
    details: [
      "ドラッグ&ドロップでレイアウト変更",
      "アプリカードの3点メニューから編集・グループ移動・複製・削除が可能",
      "グループの3点メニューからタブ移動・複製・削除が可能",
      "複製機能で同じ設定をすばやく別のタブ・グループに配置",
    ],
    image: "/images/portal_drag-drop.png",
    imageAlt: "ソトバコポータルのドラッグ&ドロップ操作画面",
  },
  {
    id: "graph",
    title: "kintoneのグラフ・一覧をポータルに表示",
    description:
      "kintoneアプリのグラフをポータル上にリアルタイム表示。アプリ一覧・通知一覧・未処理一覧も表示できます。",
    details: [
      "kintoneグラフをリアルタイム表示（サイズS/L選択可）",
      "kintoneのアプリ一覧をポータルに表示",
      "kintoneの通知一覧をポータルに表示",
      "kintoneの未処理レコードをポータルに表示",
    ],
    image: "/images/graph_overview.png",
    imageAlt: "ソトバコポータルのグラフ表示画面。kintoneのグラフがリアルタイムで表示される",
  },
  {
    id: "announce",
    title: "全社への情報発信を効率化",
    description:
      "kintoneアプリと連携した全体アナウンス機能で、1〜10件をポータルに表示。カテゴリ分けにも対応しています。",
    details: [
      "全体アナウンスを1〜10件表示（デフォルト3件）（ライト以上）",
      "カテゴリ分けで種類別に整理（スタンダード）",
      "kintoneアプリのレコードと連動",
    ],
    image: "/images/announce_overview.png",
    imageAlt: "ソトバコポータルの全体アナウンス表示画面",
  },
  {
    id: "smartphone",
    title: "外出先でも業務アプリにすぐアクセス",
    description:
      "JSファイルをkintone全体カスタマイズにアップロードすることで、スマートフォンからもソトバコポータルを利用できます。",
    details: [
      "portal-design-common.min.jsをkintoneのスマートフォン用JSとしてアップロード",
      "外出先・現場からkintoneアプリにすばやくアクセス",
    ],
    image: "/images/smartphone_overview.png",
    imageAlt: "ソトバコポータルのスマートフォン表示画面",
  },
  {
    id: "space",
    badge: "スタンダード",
    title: "スペースごとに専用ポータルを設定",
    description:
      "kintoneスペースのIDを設定して、スペースごとに異なるポータルを表示できます。プロジェクト別・チーム別の情報整理に。",
    details: [
      "スペースIDを設定してスペース単位のポータルを作成",
      "プロジェクト・チーム・拠点ごとに情報を整理",
    ],
    image: "/images/space_overview.png",
    imageAlt: "ソトバコポータルのスペース単位ポータル設定画面",
  },
];

const otherFeatures = [
  {
    title: "kintoneポータル非表示",
    description: "対象ユーザー・グループ・組織ごとにkintone標準ポータルを非表示化",
  },
  {
    title: "限定公開機能",
    description: "全社導入前に一部ユーザー・グループでテスト適用",
  },
  {
    title: "アプリカード位置固定",
    description: "画面サイズが変わっても迷わない配置",
  },
  {
    title: "ユーザー権限管理",
    description: "管理者とポータル編集者の2つのロールで権限を管理",
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-gradient-to-b from-brand-light to-white py-16 md:py-20">
        <div className="mx-auto max-w-[800px] px-4 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
            ソトバコポータルの機能
          </h1>
          <p className="mt-4 text-gray-600">
            kintoneのポータルを部署ごとに整理し、使いやすくするための機能が揃っています。
          </p>
        </div>
      </section>

      {/* Feature Sections */}
      {featureSections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={`py-16 md:py-24 ${index % 2 === 1 ? "bg-gray-50" : ""}`}
        >
          <div className="mx-auto max-w-[1200px] px-4">
            <div
              className={`flex flex-col items-center gap-10 lg:flex-row ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Text */}
              <div className="flex-1">
                {section.badge && (
                  <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                    {section.badge}
                  </span>
                )}
                <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
                  {section.title}
                </h2>
                <p className="mt-4 leading-relaxed text-gray-600">
                  {section.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {section.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3 text-sm text-gray-700">
                      <svg
                        className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image */}
              <div className="flex-1">
                <Image
                  src={section.image}
                  alt={section.imageAlt}
                  width={560}
                  height={350}
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Other Features */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-4">
          <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
            その他の機能
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {otherFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-bold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand py-16 md:py-20">
        <div className="mx-auto max-w-[800px] px-4 text-center">
          <h2 className="text-2xl font-extrabold text-white md:text-3xl">
            すべての機能をフリープランで体験
          </h2>
          <p className="mt-4 text-white/80">
            フリープランは期間制限なし。4タブまで無料でご利用いただけます。
          </p>
          <div className="mt-8">
            <a
              href={SERVICE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-bold text-brand shadow-lg transition hover:bg-gray-50 hover:shadow-xl"
            >
              フリープランを始める（無料）
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
