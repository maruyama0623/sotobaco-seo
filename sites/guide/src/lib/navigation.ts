import type { NavGroup } from "@/types/guide";

export const btoneNavigation: NavGroup[] = [
  {
    heading: "操作ガイド",
    sections: [
      {
        title: "初期設定",
        items: [
          {
            title: "kintone接続設定",
            href: "/init/setup/",
          },
          {
            title: "Bカート連携設定",
            href: "/btone/init/setup/",
          },
        ],
      },
      {
        title: "基本操作",
        items: [
          {
            title: "Btoneの基本画面",
            href: "/btone/basic/overview/",
          },
        ],
      },
      {
        title: "共通機能",
        items: [
          {
            title: "マッピング設定",
            href: "/btone/common/mapping/",
          },
          {
            title: "一括同期",
            href: "/btone/common/sync-button/",
          },
          {
            title: "レコード保存時の同期",
            href: "/btone/common/sync-onsave/",
          },
          {
            title: "サブテーブル連携設定",
            href: "/btone/common/sync-subtable/",
          },
          {
            title: "Bカート画面への遷移",
            href: "/btone/common/detail-button/",
          },
          {
            title: "レコード追加を無効にする",
            href: "/btone/common/disable-add-record/",
          },
          {
            title: "Bカートからの取り込み",
            href: "/btone/common/get-button/",
          },
          {
            title: "ボタン表示の一覧制限",
            href: "/btone/common/restrict-views/",
          },
          {
            title: "プロセス管理設定",
            href: "/btone/common/process-setting/",
          },
        ],
      },
      {
        title: "商品基本管理",
        items: [
          {
            title: "入力補助・表示カスタマイズ",
            href: "/btone/product/assistance-customize/",
          },
        ],
      },
      {
        title: "商品セット管理",
        items: [
          {
            title: "入力補助・表示カスタマイズ",
            href: "/btone/product-set/assistance-customize/",
          },
        ],
      },
      {
        title: "カテゴリ管理",
        items: [
          {
            title: "入力補助・表示カスタマイズ",
            href: "/btone/category/assistance-customize/",
          },
          {
            title: "メインカテゴリのスペース設定",
            href: "/btone/category/main-category-space/",
          },
          {
            title: "サブカテゴリのスペース設定",
            href: "/btone/category/sub-category-space/",
          },
        ],
      },
      {
        title: "会員管理",
        items: [
          {
            title: "入力補助・表示カスタマイズ",
            href: "/btone/customer/assistance-customize/",
          },
          {
            title: "代理ログイン",
            href: "/btone/customer/proxy-login/",
          },
        ],
      },
      {
        title: "受注管理",
        items: [
          {
            title: "入力補助・表示カスタマイズ",
            href: "/btone/order/assistance-customize/",
          },
        ],
      },
      {
        title: "出荷管理",
        items: [
          {
            title: "入力補助・表示カスタマイズ",
            href: "/btone/shipment/assistance-customize/",
          },
        ],
      },
    ],
  },
];

export const portalNavigation: NavGroup[] = [
  {
    heading: "操作ガイド",
    sections: [
      {
        title: "初期設定",
        items: [
          {
            title: "kintone接続設定",
            href: "/init/setup/",
          },
        ],
      },
      {
        title: "ポータル編集",
        items: [
          {
            title: "ポータルの編集",
            href: "/portal/edit/portal-edit/",
          },
          {
            title: "グラフ・一覧の埋め込み",
            href: "/portal/edit/add-graph/",
          },
          {
            title: "タブの閲覧権限",
            href: "/portal/edit/viewing-permission/",
          },
          {
            title: "スペースごとのカスタマイズ",
            href: "/portal/edit/space-portal/",
          },
          {
            title: "利用者の制限",
            href: "/portal/edit/limit-user/",
          },
          {
            title: "標準ポータルの非表示",
            href: "/portal/edit/hide-default-portal/",
          },
          {
            title: "アナウンスの表示件数",
            href: "/portal/edit/change-announcement/",
          },
          {
            title: "アナウンスのカテゴリ",
            href: "/portal/edit/announcement-category/",
          },
          {
            title: "未処理一覧の表示",
            href: "/portal/edit/assigned/",
          },
          {
            title: "通知一覧の表示",
            href: "/portal/edit/notification/",
          },
          {
            title: "アプリ一覧の表示",
            href: "/portal/edit/app/",
          },
          {
            title: "スマートフォン対応",
            href: "/portal/edit/mobile/",
          },
          {
            title: "表示されないとき",
            href: "/portal/edit/not-display/",
          },
        ],
      },
      {
        title: "その他",
        items: [
          {
            title: "メンバーの追加",
            href: "/portal/other/add-user/",
          },
        ],
      },
    ],
  },
  {
    heading: "よくあるお問い合わせ",
    sections: [
      {
        title: "",
        items: [
          {
            title: "よくあるお問い合わせ",
            href: "/portal/qa/faq/",
          },
          {
            title: "契約について",
            href: "/portal/qa/contract/",
          },
        ],
      },
    ],
  },
];
