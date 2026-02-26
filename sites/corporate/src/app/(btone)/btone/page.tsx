import type { Metadata } from "next";
import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import CtaButton from "@/components/ui/CtaButton";
import Card from "@/components/ui/Card";
import ImageZoom from "@/components/ui/ImageZoom";
import { BTONE_SIGNUP_URL, BTONE_CONTACT_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Bカート×kintone連携｜Btone",
  description:
    "Bカートの受注・商品・出荷情報をkintoneへ連携。バックオフィス業務を効率化するサービス「Btone」。",
};

/* ──────────────────── FAQ Data (JSON-LD用) ──────────────────── */

const faqData = [
  {
    question: "30日間の無料お試しに条件はありますか？",
    answer:
      "いいえ、特別な条件はありません。アカウントを作成するだけで、すべての機能を30日間無料でお試しいただけます。決済情報の登録も不要で、お試し期間終了後に自動で課金されることはありません。",
  },
  {
    question: "kintone側で同期する際、必要なアプリを事前に準備しておく必要はありますか？",
    answer:
      "必要ありません。Btoneが自動で連携用のアプリを生成するため、事前のアプリ作成や設定は不要です。ただし、現時点ではお客様で事前に準備しているアプリと同期・設定は行えませんのでご注意ください。",
  },
  {
    question: "kintoneとBカートで、同期させる項目は自由に選択できますか？",
    answer:
      "はい。kintoneとBカート間で同期させる項目は、お客さまの運用に合わせて自由に選択いただけます。Bカート側・kintone側ともにドロップダウンからフィールドを選択でき、同期の方向（Bカート→kintone / kintone→Bカート / 両方向）も項目ごとに指定できます。不要なフィールドは削除して管理することも可能です。",
  },
  {
    question: "同期のタイミングはいつですか？",
    answer:
      "kintoneからBカートへの同期はリアルタイムで反映されます（レコード保存時に自動同期）。一方、BカートからkintoneへはBtoneの各アプリで「取得」ボタンを押したタイミングで同期されます。一括同期・個別同期の両方に対応しています。",
  },
  {
    question: "一度取り込んだデータを再度取り込んだ場合、どうなりますか？",
    answer:
      "既存のレコードが最新の情報で上書き更新されます。同じデータが複数のレコードとして重複登録されることはありませんので、安心して繰り返し同期いただけます。",
  },
  {
    question: "kintoneですでに作っているアプリと同期設定はできますか？",
    answer:
      "現時点では、お客様が事前に作成されたkintoneアプリとの同期には対応しておりません。Btoneが自動生成する専用の連携アプリをご利用いただく形となります。既存アプリのデータを活用したい場合は、Btoneが生成したアプリへデータを移行してご利用ください。",
  },
  {
    question: "kintone連携にはどの権限が必要ですか？",
    answer:
      "初回のkintone連携設定時に、cybozu.com共通管理者権限が必要です。OAuthクライアントの追加を行います。",
  },
  {
    question: "導入前に相談できますか？",
    answer:
      "はい、お問い合わせフォームからお気軽にご相談ください。3営業日以内にご回答いたします。",
  },
  {
    question: "解約に手数料はかかりますか？",
    answer: "いいえ、解約手数料はかかりません。いつでも解約可能です。",
  },
  {
    question: "課金はいつから始まりますか？",
    answer:
      "30日間の無料お試し期間終了後、有料プランのお申し込みをいただいた翌月より課金が始まります。",
  },
  {
    question: "支払い方法は何が選べますか？",
    answer: "現時点では銀行振り込みのみとなります。",
  },
  {
    question: "動作環境は？",
    answer:
      "以下のWebブラウザー上で動作いたします。Microsoft Edge最新版（Chromium版のみ）、Mozilla Firefox最新版、Google Chrome最新版、Safari最新版。",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqData.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

/* ──────────────────── Data ──────────────────── */

const problems = [
  { text: "Bカートの受注データを", bold: "毎回手作業でkintoneに転記している" },
  { text: "Bカートに溜まったデータを、", bold: "他の業務にも有効活用したい" },
  { text: "受注情報の共有や連絡に、", bold: "毎回メールでやり取りして手間がかかる" },
  { text: "Bカートの管理画面だけでは、", bold: "業務がスムーズに進まない" },
];

const features = [
  {
    label: "特徴 01",
    title: "かんたん連携",
    subtitle: "Bカートとkintoneをスムーズに接続",
    description:
      "Bカートの受注・商品・出荷などの情報をボタン操作でkintoneに連携。手動でのデータ転記が不要になり、入力ミスや作業時間を大幅に削減できます。",
    image: "/images/btone/feature_shipping-import.png",
    imageAlt: "Btoneの出荷情報取込画面。Bカートの出荷データを期間指定でkintoneに取り込む操作画面",
  },
  {
    label: "特徴 02",
    title: "マウス操作のみで設定完了",
    subtitle: "プログラミング知識は一切不要",
    description:
      "連携項目の設定はすべてマウス操作だけで完結。専門的なIT知識がなくても、管理画面から直感的に連携ルールを設定できます。",
    image: "/images/btone/feature_mapping-detail.png",
    imageAlt: "Btoneの受注情報マッピング設定画面。Bカート側・kintone側の同期フィールドをドロップダウンで選択し、同期の方向も指定できる",
  },
];

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
    title: "OAuth認証・初期設定",
    description: "表示される画面で「許可」を押すだけ。あとは連携項目を設定すれば準備完了です。",
    image: "/images/icons/howto_03.jpg",
    imageAlt: "初期設定のアイコン",
  },
];


/* ──────────────────── Page ──────────────────── */

export default function BtonePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Hero ── */}
      <SectionWrapper bg="gradient">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold leading-relaxed text-gray-900 md:text-4xl md:leading-relaxed lg:text-5xl lg:leading-relaxed">
              Bカート × kintone
              <br />
              <span className="text-brand">業務をつなぐ。</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-gray-600 md:text-lg">
              Bカートの受注・商品・出荷情報を
              <br className="hidden md:inline" />
              kintoneにかんたん連携。
              <br className="hidden md:inline" />
              バックオフィス業務を効率化します。
            </p>
            <p className="mt-4 text-sm font-bold text-brand">30日間無料でお試しいただけます</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <CtaButton href={BTONE_SIGNUP_URL} external>30日間無料で試す</CtaButton>
              <CtaButton href={BTONE_CONTACT_URL} variant="outline">お問い合わせ</CtaButton>
            </div>
          </div>
          <div className="flex-1">
            <Image
              src="/images/btone/hero_solution.webp"
              alt="Btone導入後のデータ活用イメージ。グラフやチャートを活用して業務を効率化している様子"
              width={640}
              height={400}
              className="rounded-xl"
              priority
            />
          </div>
        </div>
      </SectionWrapper>

      {/* ── Btoneとは？ ── */}
      <SectionWrapper>
        <SectionHeader label="サービス紹介" title="Btoneとは？" />
        <div className="mt-10 flex flex-col items-center gap-10 lg:flex-row">
          <div className="flex-1">
            <Image
              src="/images/btone/about_data-flow.png"
              alt="BカートからBtoneを経由してkintoneにデータ連携する流れ。受注・出荷・会員・商品情報が自動で同期される"
              width={560}
              height={350}
              className="rounded-xl"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-extrabold text-gray-900 md:text-2xl">
              Bカートとkintoneをつなぐ
              <br />
              連携サービス
            </h3>
            <p className="mt-4 leading-relaxed text-gray-600">
              Btoneは、BtoB向けEC
              カート「Bカート」とサイボウズ社のクラウド型業務アプリプラットフォーム「kintone」を連携するサービスです。
            </p>
            <p className="mt-3 leading-relaxed text-gray-600">
              受注データ・商品データ・出荷データなどをkintone上で一元管理でき、
              手動でのデータ転記や二重入力の手間を解消します。
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* ── こんな課題、ありませんか？ ── */}
      <SectionWrapper>
        <SectionHeader label="よくある課題" title="こんな課題、ありませんか？" />
        <div className="mt-10 flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-12">
          <div className="flex items-center justify-center self-stretch md:w-[40%]">
            <img
              src="/images/btone/hero_problem.webp"
              alt="Bカートとkintoneのデータ連携に悩む担当者のイラスト"
              className="max-h-full w-full max-w-[280px] object-contain"
            />
          </div>
          <div className="w-full md:w-[55%]">
            <p className="text-sm leading-relaxed text-gray-700">
              Bカートの受注データをもっと活用したいのに、管理画面だけでは限界を感じていませんか？「情報共有にいちいちメールが必要」「データを他の業務に活かせていない」——そんな課題を抱えるEC担当者の方は少なくありません。
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

      {/* ── Btoneの特徴 ── */}
      <SectionWrapper>
        <SectionHeader label="選ばれる理由" title="Btoneの特徴" />
        <div className="mt-10 space-y-8">
          {features.map((f) => (
            <Card key={f.label} className="overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="flex flex-1 flex-col justify-center p-8 lg:p-12">
                  <span className="text-sm font-bold text-brand">{f.label}</span>
                  <h3 className="mt-2 text-xl font-extrabold text-gray-900 md:text-2xl">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-gray-500">{f.subtitle}</p>
                  <p className="mt-4 leading-relaxed text-gray-600">{f.description}</p>
                </div>
                <div className="flex items-center justify-center bg-gray-50 p-6 lg:h-[320px] lg:w-[55%] lg:p-10">
                  <ImageZoom
                    src={f.image}
                    alt={f.imageAlt}
                    width={640}
                    height={400}
                    className="max-h-full w-auto max-w-full rounded-lg object-contain shadow-md"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* ── CTA バナー ── */}
      <SectionWrapper bg="brand-light">
        <div className="overflow-hidden rounded-2xl border border-brand/20 bg-white shadow-sm">
          <div className="flex flex-col md:flex-row">
            <div className="flex items-center justify-center p-6 md:w-2/5 md:p-8">
              <img
                src="/images/btone/about_data-flow.png"
                alt="BカートからBtoneを経由してkintoneにデータ連携する流れ"
                className="w-full max-w-[400px] rounded-lg"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center p-8 md:p-10">
              <p className="text-sm font-bold text-brand">
                30日間無料でお試しいただけます
              </p>
              <h2 className="mt-2 text-xl font-extrabold text-gray-900 md:text-2xl">
                まずは無料トライアルで体験しませんか？
              </h2>
              <ul className="mt-5 space-y-3">
                {[
                  "決済情報の登録不要",
                  "お試し期間中もすべての機能が利用可能",
                  "期間終了後に自動課金されることはありません",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm leading-relaxed text-gray-700"
                  >
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
                      <path
                        d="M8 12l2.5 2.5L16 9.5"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CtaButton href={BTONE_SIGNUP_URL} external>30日間無料で試す</CtaButton>
                <CtaButton href={BTONE_CONTACT_URL} variant="outline">お問い合わせ</CtaButton>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── 機能一覧 ── */}
      <SectionWrapper>
        <SectionHeader label="できること" title="機能一覧" />

        {/* 共通機能 */}
        <h3 className="mt-10 text-center text-lg font-extrabold text-gray-900">すべての連携データで使える共通機能</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "マッピング設定",
              desc: "連携する項目をドロップダウンで選ぶだけ。自社の運用に合わせた柔軟なデータ連携を実現できます。",
              image: "/images/btone/feature_mapping-detail.png",
              imageAlt: "Btoneのマッピング設定画面。Bカート側・kintone側のフィールドをドロップダウンで対応付け",
            },
            {
              title: "一括同期",
              desc: "ボタン1つで大量のデータをまとめて同期。手作業での転記が不要になり、作業時間を大幅に短縮できます。",
              image: "/images/btone/feature_bulk-sync.png",
              imageAlt: "kintoneのBカート商品基本管理アプリ。一括同期ボタンでBカートのデータを取り込み",
            },
            {
              title: "kintoneアプリ自動生成",
              desc: "連携用のkintoneアプリを自動生成。事前のアプリ準備やフィールド設計が不要で、すぐに連携を始められます。",
              image: "/images/btone/feature_auto-generate.png",
              imageAlt: "Btone基本情報画面。自動生成されたkintoneアプリ（見積管理・会員管理・カテゴリ管理等）の一覧",
            },
            {
              title: "新規レコード無効化",
              desc: "kintoneからの誤ったレコード追加を防止。連携データの整合性を保ち、運用トラブルを未然に防げます。",
              image: "/images/btone/feature_record-disable.png",
              imageAlt: "Btoneの設定画面。「このアプリのレコード追加を無効にする」チェックボックスで誤登録を防止",
            },
            {
              title: "Bカート画面遷移",
              desc: "kintoneからBカートの該当画面にワンクリックで移動。画面を切り替える手間がなくなり、確認作業がスムーズになります。",
              image: "/images/btone/feature_bcart-navigate.png",
              imageAlt: "kintoneのBカート会員管理レコード。Bカート会員情報詳細・代理ログインボタンからワンクリックで遷移",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="bg-gray-50 p-4">
                <ImageZoom
                  src={f.image}
                  alt={f.imageAlt}
                  width={400}
                  height={240}
                  className="h-[180px] w-full rounded-lg object-contain object-center"
                />
              </div>
              <div className="p-5">
                <h4 className="text-base font-bold text-gray-900">{f.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* データ別機能 */}
        <h3 className="mt-14 text-center text-lg font-extrabold text-gray-900">データ別の主な機能</h3>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="whitespace-nowrap border border-gray-200 px-4 py-3 text-left font-bold text-gray-900">連携データ</th>
                <th className="whitespace-nowrap border border-gray-200 px-4 py-3 text-center font-bold text-gray-900">同期方向</th>
                <th className="border border-gray-200 px-4 py-3 text-left font-bold text-gray-900">主な機能</th>
              </tr>
            </thead>
            <tbody>
              {[
                { data: "商品基本管理", direction: "相互連携", features: "個別／一括同期、入力補助（カテゴリ選択・画像アップロード等）" },
                { data: "商品セット管理", direction: "相互連携", features: "個別／一括同期、入力補助（商品ID選択・特別価格設定等）" },
                { data: "カテゴリ管理", direction: "相互連携", features: "個別／一括同期、カテゴリ内商品の一覧表示" },
                { data: "特集管理", direction: "相互連携", features: "個別／一括同期" },
                { data: "会員管理", direction: "相互連携", features: "個別／一括同期、代理ログイン、入力補助（電話番号チェック等）" },
                { data: "見積管理", direction: "Bカート→kintone", features: "個別／一括同期" },
                { data: "受注管理", direction: "相互連携", features: "個別／一括同期（一部項目はkintone→Bカート同期不可）" },
                { data: "出荷管理", direction: "相互連携", features: "個別／一括同期、プロセス管理で発送状況を管理（一部項目はkintone→Bカート同期不可）" },
              ].map((row) => (
                <tr key={row.data} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap border border-gray-200 px-4 py-3 font-bold text-gray-900">{row.data}</td>
                  <td className="whitespace-nowrap border border-gray-200 px-4 py-3 text-center">
                    <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ${
                      row.direction === "相互連携"
                        ? "bg-brand-light text-brand"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {row.direction}
                    </span>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-gray-600">{row.features}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          ※ 相互連携は一部「Bカート→kintone」のみの項目があります。削除操作は非対応です。
        </p>
      </SectionWrapper>

      {/* ── 導入までの流れ ── */}
      <SectionWrapper bg="gray">
        <SectionHeader label="導入の流れ" title="導入は簡単3ステップで完了！" />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-4">
          {steps.map((step, i) => (
            <>
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
              {i < steps.length - 1 && (
                <div key={`arrow-${i}`} className="hidden items-center self-center md:flex">
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
              )}
            </>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-gray-400">
          ※Btone利用時はサイボウズ社のkintoneおよびBカートを別途ご契約いただく必要がございます。
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <CtaButton href={BTONE_SIGNUP_URL} external>30日間無料で試す</CtaButton>
          <CtaButton href={BTONE_CONTACT_URL} variant="outline">お問い合わせ</CtaButton>
        </div>
      </SectionWrapper>

      {/* ── 料金 ── */}
      <SectionWrapper>
        <SectionHeader label="料金プラン" title="料金" />
        <div className="mx-auto mt-10 max-w-[480px]">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="bg-brand px-6 py-4 text-center text-lg font-extrabold text-white">
              Btone
            </div>
            <div className="px-8 py-10 text-center">
              <p className="inline-block rounded-full bg-brand-light px-4 py-1 text-sm font-bold text-brand">
                30日間無料お試しあり
              </p>
              <p className="mt-4 text-sm text-gray-500">月額（税抜）</p>
              <p className="mt-2 text-4xl font-extrabold text-gray-900">
                ¥15,000<span className="text-base font-bold text-gray-500">/月</span>
              </p>
              <div className="mt-6">
                <CtaButton href={BTONE_SIGNUP_URL} external size="sm">30日間無料で試す</CtaButton>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── よくあるご質問 ── */}
      <SectionWrapper bg="gray" maxWidth="800">
        <SectionHeader label="ご不明点はこちら" title="よくあるご質問" />
        <div className="mt-10 space-y-4">
          {[
            {
              question: "30日間の無料お試しに条件はありますか？",
              answer:
                "いいえ、特別な条件はありません。アカウントを作成するだけで、すべての機能を30日間無料でお試しいただけます。決済情報の登録も不要で、お試し期間終了後に自動で課金されることはありません。",
            },
            {
              question: "kintone側で同期する際、必要なアプリを事前に準備しておく必要はありますか？",
              answer:
                "必要ありません。Btoneが自動で連携用のアプリを生成するため、事前のアプリ作成や設定は不要です。ただし、現時点ではお客様で事前に準備しているアプリと同期・設定は行えませんのでご注意ください。",
            },
            {
              question: "kintoneとBカートで、同期させる項目は自由に選択できますか？",
              answer:
                "はい。kintoneとBカート間で同期させる項目は、お客さまの運用に合わせて自由に選択いただけます。Bカート側・kintone側ともにドロップダウンからフィールドを選択でき、同期の方向（Bカート→kintone / kintone→Bカート / 両方向）も項目ごとに指定できます。不要なフィールドは削除して管理することも可能です。",
            },
            {
              question: "同期のタイミングはいつですか？",
              answer:
                "kintoneからBカートへの同期はリアルタイムで反映されます（レコード保存時に自動同期）。一方、BカートからkintoneへはBtoneの各アプリで「取得」ボタンを押したタイミングで同期されます。一括同期・個別同期の両方に対応しています。",
            },
            {
              question: "一度取り込んだデータを再度取り込んだ場合、どうなりますか？",
              answer:
                "既存のレコードが最新の情報で上書き更新されます。同じデータが複数のレコードとして重複登録されることはありませんので、安心して繰り返し同期いただけます。",
            },
            {
              question: "kintoneですでに作っているアプリと同期設定はできますか？",
              answer:
                "現時点では、お客様が事前に作成されたkintoneアプリとの同期には対応しておりません。Btoneが自動生成する専用の連携アプリをご利用いただく形となります。既存アプリのデータを活用したい場合は、Btoneが生成したアプリへデータを移行してご利用ください。",
            },
            {
              question: "kintone連携にはどの権限が必要ですか？",
              answer:
                "初回のkintone連携設定時に、cybozu.com共通管理者権限が必要です。OAuthクライアントの追加を行います。",
            },
            {
              question: "導入前に相談できますか？",
              answer:
                "はい、お問い合わせフォームからお気軽にご相談ください。3営業日以内にご回答いたします。",
            },
            {
              question: "解約に手数料はかかりますか？",
              answer:
                "いいえ、解約手数料はかかりません。いつでも解約可能です。",
            },
            {
              question: "課金はいつから始まりますか？",
              answer:
                "30日間の無料お試し期間終了後、有料プランのお申し込みをいただいた翌月より課金が始まります。",
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
              question: "Btone側には、kintoneのレコードやアカウント情報は保存しますか？",
              answer:
                "kintoneのレコード情報は一切保存しませんのでご安心ください。Btoneが保存するのは、連携設定に必要な情報（アプリIDやフィールドのマッピング情報）のみです。kintone内の顧客データや売上データなどのレコード情報、パスワード等のアカウント詳細は一切保存しません。",
            },
          ].map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-gray-200 bg-white"
            >
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-bold text-gray-900 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <svg
                  className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="border-t border-gray-100 px-6 py-5">
                <p className="text-sm leading-relaxed text-gray-600">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </SectionWrapper>

      {/* ── CTA カード ── */}
      <SectionWrapper bg="brand-light">
        <div className="grid gap-6 md:grid-cols-2">
          {/* お問い合わせ */}
          <div className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-4">
              <svg className="h-20 w-20 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h3 className="text-lg font-extrabold text-brand">お問い合わせ</h3>
            <p className="mt-3 flex-1 text-center text-sm leading-relaxed text-gray-600">
              導入に関する不明点やお悩みに、専門スタッフが迅速にお答えします。
            </p>
            <div className="mt-6 w-full">
              <a
                href={BTONE_CONTACT_URL}
                className="block rounded-lg bg-brand py-3 text-center text-sm font-bold text-white transition hover:bg-brand-dark"
              >
                問い合わせする
              </a>
            </div>
          </div>
          {/* 30日間無料お試し */}
          <div className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-4">
              <svg className="h-20 w-20 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
              </svg>
            </div>
            <h3 className="text-lg font-extrabold text-brand">30日間無料お試し</h3>
            <p className="mt-3 flex-1 text-center text-sm leading-relaxed text-gray-600">
              決済情報の登録不要！30日間すべての機能をお試しいただけます。期間終了後に自動課金されることはありません。
            </p>
            <div className="mt-6 w-full">
              <a
                href={BTONE_SIGNUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg bg-brand py-3 text-center text-sm font-bold text-white transition hover:bg-brand-dark"
              >
                30日間無料で試す
              </a>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
