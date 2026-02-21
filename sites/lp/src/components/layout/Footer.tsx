import { Footer as SharedFooter } from "@sotobaco/ui";
import type { FooterMenu } from "@sotobaco/ui";

const footerMenus: FooterMenu[] = [
  {
    title: "サービス",
    links: [
      {
        label: "ソトバコポータル",
        href: "https://sotobaco.com/sotobacoportal",
        external: false,
      },
    ],
  },
  {
    title: "サポート",
    links: [
      { label: "お問い合わせ", href: "/contact/?category=sotobaco-portal", external: false },
      {
        label: "操作ガイド",
        href: "https://guide.sotobaco.com/portal/index.html",
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
        external: true,
      },
      {
        label: "ブログ",
        href: "https://blog.sotobaco.com/",
        external: true,
      },
    ],
  },
  {
    title: "会社情報",
    links: [
      { label: "運営会社", href: "https://sotobaco.com/", external: true },
      { label: "会社概要", href: "https://sotobaco.com/company", external: true },
      { label: "利用規約", href: "https://sotobaco.com/terms", external: true },
      {
        label: "プライバシーポリシー",
        href: "https://sotobaco.com/privacy",
        external: true,
      },
    ],
  },
];

export default function Footer() {
  return <SharedFooter menus={footerMenus} />;
}
