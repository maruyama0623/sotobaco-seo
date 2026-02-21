import { Footer as SharedFooter } from "@sotobaco/ui";
import type { FooterMenu } from "@sotobaco/ui";

const footerMenus: FooterMenu[] = [
  {
    title: "サービス",
    links: [
      {
        label: "ソトバコポータル",
        href: "/sotobacoportal/",
        external: false,
      },
    ],
  },
  {
    title: "サポート",
    links: [
      { label: "お問い合わせ", href: "/sotobacoportal/contact/?category=sotobaco-portal", external: false },
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
      { label: "運営会社", href: "/", external: false },
      { label: "会社概要", href: "/company/", external: false },
      { label: "利用規約", href: "/terms/", external: false },
      {
        label: "プライバシーポリシー",
        href: "/privacy/",
        external: false,
      },
    ],
  },
];

export default function PortalFooter() {
  return <SharedFooter menus={footerMenus} />;
}
