import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "株式会社ソトバコのプライバシーポリシーです。お客様の個人情報の取得、利用、管理、提供、消去について説明します。",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 py-16 md:py-20">
      <h1 className="text-center text-3xl font-extrabold text-gray-900 md:text-4xl">
        プライバシーポリシー
      </h1>

      <div className="mt-12 space-y-10 text-sm leading-relaxed text-gray-700">
        {/* はじめに */}
        <section>
          <h2 className="text-lg font-bold text-gray-900">はじめに</h2>
          <p className="mt-4">
            株式会社ソトバコ（以下、「当社」といいます。）は、当社が提供するすべてのサービス（以下、「当社サービス」といいます。）を提供するにあたり、お客様、従業者およびその他関係者等（以下、「お客様等」といいます。）から個人に関する情報（以下、「個人情報」といいます。）を取得します。
            本プライバシーポリシー（以下、「本ポリシー」といいます。）は、以下についてご説明するものです。
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>
              <span className="font-bold">当社について</span>
              <br />
              当社がどのように、個人情報を取得し、利用し、安全に管理し、提供し、消去するか
            </li>
            <li>
              <span className="font-bold">お客様等について</span>
              <br />
              お客様等がどのように、ご自身の個人情報を管理することができるか
            </li>
          </ul>
        </section>

        {/* 当社について */}
        <section>
          <h2 className="border-b-2 border-gray-900 pb-2 text-xl font-bold text-gray-900">
            当社について
          </h2>
        </section>

        {/* 1. 取得する個人情報 */}
        <section>
          <h3 className="text-lg font-bold text-gray-900">
            1 取得する個人情報
          </h3>
          <p className="mt-4">
            当社は、当社サービスを提供するにあたり、以下のような個人情報を取得します。
          </p>

          <h4 className="mt-6 font-bold text-gray-800">
            ①お客様等からご提供いただく情報
          </h4>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              プロフィールに関する情報（氏名、生年月日、性別、職業等）
            </li>
            <li>
              連絡先に関する情報（メールアドレス、電話番号、住所等）
            </li>
            <li>
              決済手段に関する情報（銀行口座情報、電子マネー情報等）
            </li>
            <li>
              その他、入力フォームその他当社が定める方法を通じてお客様等が入力または送信する情報
            </li>
          </ul>

          <h4 className="mt-6 font-bold text-gray-800">
            ②サービスのご利用にあたり取得する情報
          </h4>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              サービスの利用状況に関する情報（利用サービス、購入商品、閲覧ページ、広告履歴、検索キーワード、利用日時、利用方法、利用環境等）
            </li>
            <li>
              サービスの利用環境に関する情報（ネットワーク情報、クッキー情報、位置情報、端末情報、ブラウザ情報、アプリケーション情報等）
            </li>
          </ul>

          <h4 className="mt-6 font-bold text-gray-800">
            ③第三者から取得する情報
          </h4>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>提携する他の事業者から取得する情報</li>
            <li>他のお客様等がアップロードする情報</li>
          </ul>

          <h4 className="mt-6 font-bold text-gray-800">④公開情報</h4>
        </section>

        {/* 2. 利用目的 */}
        <section>
          <h3 className="text-lg font-bold text-gray-900">2. 利用目的</h3>
          <p className="mt-4">
            当社は、お客様等の個人情報を以下の目的のために利用いたします。
          </p>

          {/* 1. お客様に関する個人情報 */}
          <div className="mt-6 rounded-lg border border-gray-200 p-6">
            <h4 className="font-bold text-gray-900">
              1.お客様に関する個人情報
            </h4>
            <ol className="mt-3 list-none space-y-2 pl-0">
              <li>
                (1)
                当社および第三者の商品等の広告または宣伝（電子メールの送信およびチラシ、その他のダイレクトメールの送付を含む）またはメールマガジン送信のため
              </li>
              <li>
                (2)
                贈答品をご本人に代わってお送りするため（お届け先に指定された方の個人情報を発送のために利用します）
              </li>
              <li>
                (3)
                キャンペーン、アンケートのお知らせ、サービス改善ヒアリング等のお願いを行うため
              </li>
              <li>
                (4)
                キャンペーン等の実施および当選の連絡、景品等の発送等を行うため
              </li>
              <li>(5) セミナー、イベントの管理を行うため</li>
              <li>(6) ポイントサービスの提供のため</li>
              <li>
                (7)
                マーケティング活動およびマーケティングデータの調査統計分析のため
              </li>
              <li>
                (8)
                お客様情報管理、その他の各種連絡、対応管理等のため
              </li>
              <li>
                (9)
                製品やサービス等のサポートおよび問合せ等に対応するため
              </li>
              <li>
                (10) 対面営業を含むマーケティング活動のため
              </li>
              <li>
                (11) マーケティングデータの調査統計分析のため
              </li>
              <li>
                (12) 当社の商品・サービス等の開発、改善のため
              </li>
              <li>
                (13) システムの維持、不具合対応のため
              </li>
              <li>
                (14)
                当社に個人情報を登録している会員が、当社または親会社の提供する別サービスを利用する場合、会員登録等作業の簡素化を行うため
              </li>
              <li>
                (15)
                取引先等より個人情報の取扱業務を委託された場合、委託された業務の遂行のため（商品の発送代行および発送に伴う連絡等を含む）
              </li>
              <li>
                (16)
                契約や法律等に基づく権利の行使や義務の履行のため
              </li>
              <li>
                (17)
                郵便の宛先確認、マーケティング活動及び広告宣伝のために、他社が保持しているソースと突き合わせるため
              </li>
              <li>
                (18)
                その他当社の各サービスにおいて個別に定める目的のため
              </li>
              <li>
                (19)
                その他の各種連絡、対応管理、関連資料の送付等
              </li>
            </ol>
            <p className="mt-3 text-xs text-gray-500">
              お電話でお問い合わせいただいた場合には、上記の目的および円滑な業務遂行を目的としたオペレータ教育に利用するために、録音させていただくことがあります。
            </p>
          </div>

          {/* 2. 取引先各社 */}
          <div className="mt-6 rounded-lg border border-gray-200 p-6">
            <h4 className="font-bold text-gray-900">
              ２．取引先各社（個人を含む）、他社の役員・社員等に関する個人情報
            </h4>
            <ol className="mt-3 list-none space-y-2 pl-0">
              <li>
                (1)
                業務上必要な諸連絡（挨拶状送付を含む）、協力、交渉、契約の履行、履行請求等のため
              </li>
              <li>
                (2) 取引先情報管理、支払・収入処理のため
              </li>
              <li>
                (3)
                お客様等に対する生産地および商品等紹介およびこれにかかる販売促進・広報宣伝のため
              </li>
              <li>
                (4)
                会社案内・事業報告書・会社年史等の記録物への掲載のため
              </li>
              <li>
                (5)
                当社サービス、イベント等のご案内のため
              </li>
              <li>
                (6)
                アンケート協力依頼、その他各種統計資料作成のため
              </li>
              <li>
                (7)
                当社内に入場される場合、当社の営業秘密等の保護管理の観点からご本人を特定するため
              </li>
              <li>
                (8)
                労働者派遣事業の適正な運営の確保及び派遣労働者の就業条件の整備等に関する法律および労働安全衛生法等の法令に定められた義務を履行するため
              </li>
              <li>
                (9)
                当社の従業者および取引先の法令遵守状況確認のため
              </li>
              <li>
                (10)
                特定個人情報等については、当社の取引先のうちの個人事業主の方の場合に、報酬、料金、契約金および賞金等に関する支払調書作成事務のため
              </li>
            </ol>
          </div>

          {/* 3. 官公庁の職員 */}
          <div className="mt-6 rounded-lg border border-gray-200 p-6">
            <h4 className="font-bold text-gray-900">
              ３．官公庁の職員・公務員等に関する個人情報
            </h4>
            <ol className="mt-3 list-none space-y-2 pl-0">
              <li>
                (1)
                所管官庁への業務上必要な連絡・報告・問合せ等のため
              </li>
              <li>
                (2)
                当社および当社の従業者の法令遵守状況確認のため
              </li>
            </ol>
          </div>

          {/* 4. 委託 */}
          <div className="mt-6 rounded-lg border border-gray-200 p-6">
            <h4 className="font-bold text-gray-900">
              ４．他の事業者等から個人情報の取扱業務の委託を受けた個人情報
            </h4>
            <ol className="mt-3 list-none space-y-2 pl-0">
              <li>
                (1)
                取引先との契約履行（委託された業務の遂行）等のため
              </li>
            </ol>
          </div>

          {/* 5. 株主 */}
          <div className="mt-6 rounded-lg border border-gray-200 p-6">
            <h4 className="font-bold text-gray-900">
              5. 株主に関する個人情報
            </h4>
            <ol className="mt-3 list-none space-y-2 pl-0">
              <li>
                (1) 法令に基づく権利の行使・義務の履行のため
              </li>
              <li>
                (2)
                株主としての地位に関し、当社から各種便宜を供与するため
              </li>
              <li>
                (3)
                株主と会社の関係の中でも、社団の構成員と社団という観点から双方の関係を円滑にするための各種の方策を実施するため
              </li>
              <li>
                (4)
                法令に基づく株主管理（株主データ作成等）のため
              </li>
            </ol>
            <p className="mt-3 text-xs text-gray-500">
              お電話でお問い合わせいただいた場合には、上記の目的および円滑な業務遂行を目的としたオペレータ教育に利用するために、録音させていただくことがあります。
            </p>
          </div>

          {/* 6. イベント等参加者 */}
          <div className="mt-6 rounded-lg border border-gray-200 p-6">
            <h4 className="font-bold text-gray-900">
              6. イベント等参加者に関する個人情報
            </h4>
            <ol className="mt-3 list-none space-y-2 pl-0">
              <li>
                (1) 連絡、イベントの関連情報の提供のため
              </li>
              <li>
                (2)
                関連商品またはサービスの案内、取引先から委託を受けた調査、分析、宣伝、広告業務の遂行等のため
              </li>
              <li>
                (3)
                イベント等紹介およびこれにかかる販売促進・広報宣伝のため
              </li>
              <li>
                (4)
                会社案内・事業報告書・会社年史等の記録物への掲載のため
              </li>
              <li>
                (5)
                その他個別のイベント等において個別に定める目的のため
              </li>
            </ol>
          </div>

          {/* 7. 採用応募者 */}
          <div className="mt-6 rounded-lg border border-gray-200 p-6">
            <h4 className="font-bold text-gray-900">
              7.採用応募者に関する個人情報
            </h4>
            <ol className="mt-3 list-none space-y-2 pl-0">
              <li>
                (1)
                採用応募者（インターンシップを含む）への採用情報等の連絡、情報の提供および採用選考のため
              </li>
              <li>(2) 当社での採用業務管理のため</li>
              <li>
                (3)
                採用応募者向けの当社のウェブサイト改善のため
              </li>
            </ol>
          </div>

          {/* 8. 従業者 */}
          <div className="mt-6 rounded-lg border border-gray-200 p-6">
            <h4 className="font-bold text-gray-900">
              8.従業者に関する個人情報
            </h4>
            <p className="mt-3">従業者管理のため</p>
            <p className="mt-2">
              なお、特定個人情報等については、以下のうち、取得時に個別に特定した利用目的の範囲内で、業務の遂行上必要な限りにおいて利用します。
            </p>
            <ol className="mt-2 list-none space-y-2 pl-0">
              <li>
                （１）本人およびその扶養親族にかかる健康保険関連事務、厚生年金保険関連事務、雇用保険関連事務その他の社会保障に関する申請・請求事務等
              </li>
              <li>
                （２）本人およびその扶養親族にかかる源泉徴収関連事務、個人住民税関連事務その他の税に関する申告事務等
              </li>
            </ol>
          </div>

          {/* 9. その他 */}
          <div className="mt-6 rounded-lg border border-gray-200 p-6">
            <h4 className="font-bold text-gray-900">
              9.上記１．～７．以外で、当社へお問い合わせされた方及び当社を来訪された方等に関する個人情報
            </h4>
            <p className="mt-3">
              連絡、対応管理、関連資料の送付等のため
            </p>
          </div>

          <p className="mt-6">
            当社は、個人情報をお預かりする際にお知らせした利用目的の合理的な範囲を超えてお客様等の個人情報を利用いたしません。これらの目的以外に利用する必要が生じた場合は、事前にお客様等にその旨を通知いたします。
          </p>
          <p className="mt-4">
            また当社は、他事業者からお客様等に関する情報（内部識別子、広告識別子、クッキー、メールアドレス、利用履歴など）を取得し、当社が保有するお客様等の個人情報と組み合わせ、上記の利用目的の範囲内で利用することがあります。
          </p>
        </section>

        {/* 3. 安全管理 */}
        <section>
          <h3 className="text-lg font-bold text-gray-900">3. 安全管理</h3>
          <p className="mt-4">
            当社は、お客様等の個人情報の取り扱いに際して、個人情報を管理する責任部門に個人情報保護管理責任者を置き、適切な管理を行っています。また、従業員入社時に、個人情報保護に関する研修を実施している他、全社的に個人情報保護に関する定期研修を実施し、社員教育を徹底しています。
          </p>
          <p className="mt-4">
            外部からの不正なアクセス、さらには紛失、破壊、改ざん等の危険に対しては、適切かつ合理的なレベルの安全対策を実施し、お客様等の個人情報の保護に努めております。
          </p>
          <div className="mt-6 rounded-lg bg-gray-50 p-5">
            <p className="text-xs font-bold text-gray-600">
              ＜個人情報の管理に関するお問い合わせ先＞
            </p>
            <p className="mt-1 text-xs text-gray-600">
              株式会社ソトバコ 個人情報保護管理責任者
              <br />
              Ｅメール：maruyama.tomohiro@sotobaco.co.jp
            </p>
          </div>
        </section>

        {/* 4. 第三者への提供 */}
        <section>
          <h3 className="text-lg font-bold text-gray-900">
            4. 第三者への提供
          </h3>
          <p className="mt-4">
            当社は、お客様等から同意を得た場合または法律で認められる場合を除き、個人情報を第三者に提供、公開または共有することはありません。
            例えば、以下のような場合には第三者に提供、公開または共有します。
          </p>

          <h4 className="mt-6 font-bold text-gray-800">
            ①ご本人による公開
          </h4>
          <p className="mt-2">
            レビュー投稿などお客様等が投稿される内容について、公開/非公開の設定や宛先に応じて、第三者が閲覧可能になる場合があります。
          </p>

          <h4 className="mt-6 font-bold text-gray-800">②業務委託</h4>
          <p className="mt-2">
            事業遂行のために、当社の業務委託先に対して、最低限必要な情報に限り、お客様等の個人情報を開示する場合があります。
            これら業務委託先に対しては、個人情報の保護に関する契約を締結し、業務委託先が契約を遵守するよう、必要かつ適切な管理および監督を行います。
          </p>

          <h4 className="mt-6 font-bold text-gray-800">
            ③グループ会社間の共同利用
          </h4>
          <div className="mt-2 space-y-3">
            <p>
              <span className="font-bold">
                【共同して利用される個人データの項目】
              </span>
              <br />
              「１. 取得する個人情報」記載の情報
            </p>
            <p>
              <span className="font-bold">
                【共同して利用する者の範囲】
              </span>
              <br />
              当社およびカラビナテクノロジー株式会社
            </p>
            <p>
              <span className="font-bold">
                【利用する者の利用目的】
              </span>
              <br />
              「２.
              利用目的」に記載された利用目的と同じですが、共同利用先における利用目的については、「当社」をカラビナテクノロジー株式会社と、また、「当社サービス」をカラビナテクノロジー株式会社の提供するサービスと読み替えるものとします。
            </p>
            <p>
              当該個人データの管理について責任を有する者の氏名又は名称及び住所並びに法人にあっては、その代表者の氏名
              <br />
              〒810-0004
              <br />
              福岡県福岡市中央区渡辺通5-23-8 サンライトビル 3F
              <br />
              株式会社ソトバコ
              <br />
              代表取締役 丸山智大
            </p>
          </div>

          <h4 className="mt-6 font-bold text-gray-800">④事業承継</h4>
          <p className="mt-2">
            買収、合併、事業主体の変更など、本ポリシーの対象となる当社事業に係る企業間取引が生じた場合、法律で認められる限りにおいて個人情報もそれに伴い事業の承継者に移管される可能性があります。
          </p>

          <h4 className="mt-6 font-bold text-gray-800">
            ⑤コンプライアンスおよび公的機関への協力
          </h4>
          <p className="mt-2">
            当社は、令状などの法的手続きに則った要請を受領した場合など、法律に基づいて警察などの法執行機関や裁判所などの第三者に対して個人情報を開示することがあります。
          </p>

          <h4 className="mt-6 font-bold text-gray-800">
            ⑥他事業者との連携
          </h4>
          <p className="mt-2">
            お客様等が当社と連携する他事業者のサービスを利用される場合や、当社が当社と連携する他事業者を通じてマーケティング活動及び広告宣伝を行う場合、当社から当該他事業者に対してお客様等の個人情報を提供する場合があります。なお、当社から提供する個人情報は目的達成のために必要な最小限度に止めます。
          </p>
        </section>

        {/* 5. 第三者による取得 */}
        <section>
          <h3 className="text-lg font-bold text-gray-900">
            5. 第三者による取得
          </h3>
          <p className="mt-4">
            「４.
            第三者への提供」とは別に、当社は、パートナー企業に対して、「クッキー」や「アプリ開発キット」などを用いたお客様等の情報の取得を認めている場合があります。当社以外のパートナー企業による個人情報の利用は、それぞれのパートナー企業のプライバシーポリシーに従って行われます。
          </p>
          <p className="mt-4">
            例えば、当社サービスの向上のため、Google社のGoogle
            Analyticsを利用してウェブサイトなどの当社サービスの計測を行っています。データ取得のためにGoogle社がクッキーを設定し、または既存のクッキーを読み取る場合があります。その際、Google社に対して、お客様がアクセスしたページのURLやIPアドレスなどの情報を自動的に送信します。当社は、それらの情報を、利用状況の把握や当社サービスなどに利用する場合があります。Google
            AnalyticsにおけるGoogle社によるデータの取扱いについては、Google
            Analyticsサービス利用規約およびGoogle社プライバシーポリシーをご確認ください。
          </p>
        </section>

        {/* 6. 消去 */}
        <section>
          <h3 className="text-lg font-bold text-gray-900">6. 消去</h3>
          <p className="mt-4">
            当社は、取得した個人情報について利用する必要がなくなったときは、当該個人情報を遅滞なく消去するよう努めています。お客様等からアカウント削除の申請があった場合、一定期間保持した後、法律および社内規程に従ってお客様等の情報を削除します。
          </p>
        </section>

        {/* お客様等について */}
        <section>
          <h2 className="border-b-2 border-gray-900 pb-2 text-xl font-bold text-gray-900">
            お客様等について
          </h2>
          <p className="mt-4">
            個人情報の開示、訂正、追加、削除、利用停止、消去（以下、総称して「開示等」といいます。）のご請求手続きは、以下のとおりです。
          </p>
        </section>

        {/* 1. 開示等の請求方法 */}
        <section>
          <h3 className="text-lg font-bold text-gray-900">
            1. 開示等の請求方法
          </h3>
          <p className="mt-4">
            当社所定の請求書（以下、「開示等請求書」といいます。）をお送りいたしますので、まずは以下のお問い合わせ受付窓口より、ご連絡をお願いいたします。お送りする開示等請求書へ必要事項をご記入のうえ、以下に定める本人確認書類を添えて簡易書留、配達証明郵便など、到着確認が確認可能な配送方法にてご郵送ください。
          </p>
          <div className="mt-6 rounded-lg bg-gray-50 p-5">
            <p className="text-xs font-bold text-gray-600">
              ＜個人情報に関するお問い合わせ受付窓口＞
            </p>
            <p className="mt-1 text-xs text-gray-600">
              株式会社ソトバコ
              <br />
              Ｅメール：maruyama.tomohiro@sotobaco.co.jp
            </p>
          </div>
          <div className="mt-4 rounded-lg bg-gray-50 p-5">
            <p className="text-xs font-bold text-gray-600">＜宛先＞</p>
            <p className="mt-1 text-xs text-gray-600">
              〒810-0004
              <br />
              福岡県福岡市中央区渡辺通5-23-8 サンライトビル 3F
              <br />
              株式会社ソトバコ
            </p>
          </div>
        </section>

        {/* 2. 開示等の求めの手続きができる方 */}
        <section>
          <h3 className="text-lg font-bold text-gray-900">
            2. 開示等の求めの手続きができる方
          </h3>
          <ul className="mt-4 list-disc space-y-1 pl-6">
            <li>ご本人</li>
            <li>
              ご本人が未成年者または成年被後見人の場合はご本人の法定代理人
            </li>
            <li>
              開示等の求めの手続についてご本人が委任した代理人
            </li>
          </ul>
        </section>

        {/* 3. 開示等の求めの際の必要書類 */}
        <section>
          <h3 className="text-lg font-bold text-gray-900">
            3. 開示等の求めの際の必要書類
          </h3>

          <h4 className="mt-6 font-bold text-gray-800">
            ①ご本人が手続きされる場合
          </h4>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              開示等請求書（印鑑登録証明書に登録された印鑑で押印）
            </li>
            <li>本人確認書類</li>
            <li>印鑑登録証明書</li>
          </ul>

          <h4 className="mt-6 font-bold text-gray-800">
            ②代理人の方が手続をされる場合
          </h4>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>開示等請求書</li>
            <li>
              本人確認書類（ご本人様・代理人様分両方）
            </li>
            <li>委任状</li>
          </ul>

          <div className="mt-4 rounded-lg bg-gray-50 p-5 text-xs text-gray-600">
            <p>
              ※本人確認書類は、以下２点をご郵送ください。
            </p>
            <p className="mt-2">
              1)３ヶ月以内に取得した住民票（コピー不可）（１通）
            </p>
            <p className="mt-1 pl-3">
              ※外国人の方の場合、住民票に代わり、在留カードまたは特別永住者証明書の写しを提出してください。
            </p>
            <p className="mt-1 pl-3">
              ※転居等により、各証明書の住所と当社の登録住所が違う場合は、転居の履歴がわかる住民票の提出をお願いいたします。
            </p>
            <p className="mt-2">
              2)運転免許証またはパスポート（有効期限内）のコピー、３ヶ月以内に取得した戸籍謄本または抄本（現住所記載の附票がついている原本）のうちいずれか1点
            </p>
            <p className="mt-1 pl-3">
              ※本籍地が記載されている証明書の場合は、紙を貼るなどして「本籍地」部分を隠してからコピーいただくか、またはコピー後に「本籍地」が見えなくなるように黒く塗りつぶしてお送りいただけますようお願いいたします。（お手数ですが、住所が確認できるような形でお願いいたします。）
            </p>
          </div>
        </section>

        {/* 4. 開示等の手数料 */}
        <section>
          <h3 className="text-lg font-bold text-gray-900">
            4. 開示等の手数料
          </h3>
          <p className="mt-4">
            個人情報の開示・利用目的の通知をご請求される場合、1回のご請求ごとに、1,000円（税込）をいただきます。切手の同封あるいは郵便小為替を同封にてお願いいたします。
          </p>
        </section>

        {/* 5. 開示等の通知 */}
        <section>
          <h3 className="text-lg font-bold text-gray-900">
            5. 開示等の通知
          </h3>
          <p className="mt-4">
            開示の通知（不開示の理由の通知を含む）は、ご本人（代理人請求の場合は代理人）を受取人として、書留扱いで本人限定受取郵便によりご本人宛に発送します。
          </p>
        </section>

        {/* その他の重要な情報 */}
        <section>
          <h2 className="border-b-2 border-gray-900 pb-2 text-xl font-bold text-gray-900">
            その他の重要な情報
          </h2>
        </section>

        {/* 1. 本ポリシーの改訂 */}
        <section>
          <h3 className="text-lg font-bold text-gray-900">
            1 本ポリシーの改訂
          </h3>
          <p className="mt-4">
            当社は、法令等の変更や必要に応じて、いつでも事前の予告なく本ポリシーを改訂することがあります。この場合、当社は最新の本ポリシーを当社サイト上に掲載いたします。当社は、お客様等が閲覧された当時の本ポリシーの内容の如何にかかわらず、常に最新の本ポリシーによりお客様等の情報を取り扱いいたします。
          </p>
        </section>

        {/* 2. 個人情報取扱事業者 */}
        <section>
          <h3 className="text-lg font-bold text-gray-900">
            2. 個人情報取扱事業者
          </h3>
          <div className="mt-4 space-y-1">
            <p>
              <span className="font-bold">氏名又は名称</span>
              <br />
              株式会社ソトバコ
            </p>
            <p className="mt-3">
              <span className="font-bold">住所</span>
              <br />
              〒810-0004
              <br />
              福岡県福岡市中央区渡辺通5-23-8 サンライトビル 3F
            </p>
            <p className="mt-3">
              <span className="font-bold">代表者の氏名</span>
              <br />
              代表取締役 丸山智大
            </p>
          </div>
        </section>

        {/* 以上 + 制定日 */}
        <div className="border-t border-gray-200 pt-8 text-center">
          <p>以上</p>
          <p className="mt-4 text-sm text-gray-500">
            ２０２４年１２月１７日 制定
          </p>
        </div>
      </div>
    </div>
  );
}
