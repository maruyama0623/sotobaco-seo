import { Footer as SharedFooter } from "@sotobaco/ui";
import type { FooterMenu } from "@sotobaco/ui";
import { LP_URL, CONTACT_URL, BLOG_URL } from "@/lib/constants";

const footerMenus: FooterMenu[] = [
  {
    title: "サービス",
    links: [
      {
        label: "ソトバコポータル",
        href: LP_URL,
        external: false,
      },
      {
        label: "Btone",
        href: "/btone",
        external: false,
      },
    ],
  },
  {
    title: "サポート",
    links: [
      {
        label: "お問い合わせ",
        href: CONTACT_URL,
        external: false,
      },
      {
        label: "操作ガイド",
        href: "https://guide.sotobaco.com/",
        external: true,
      },
    ],
  },
  {
    title: "お知らせ",
    links: [
      {
        label: "アップデート情報",
        href: "https://sotobaco.com/update/",
        external: false,
      },
      {
        label: "ブログ",
        href: BLOG_URL,
        external: true,
      },
    ],
  },
  {
    title: "会社情報",
    links: [
      { label: "会社概要", href: "/company", external: false },
      { label: "利用規約", href: "/terms", external: false },
      {
        label: "プライバシーポリシー",
        href: "/privacy",
        external: false,
      },
    ],
  },
];

export default function Footer() {
  return <SharedFooter menus={footerMenus} />;
}
