import { Footer as SharedFooter } from "@sotobaco/ui";
import type { FooterMenu } from "@sotobaco/ui";
import { EXTERNAL_URLS } from "@/lib/constants";

const footerMenus: FooterMenu[] = [
  {
    title: "サービス",
    links: [
      {
        label: "ソトバコポータル",
        href: EXTERNAL_URLS.portal,
        external: true,
      },
      {
        label: "Btone",
        href: "https://sotobaco.com/btone",
        external: true,
      },
    ],
  },
  {
    title: "サポート",
    links: [
      { label: "お問い合わせ", href: EXTERNAL_URLS.contact, external: true },
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
        label: "お知らせ",
        href: "https://sotobaco.com/news/?category=お知らせ",
        external: true,
      },
      {
        label: "アップデート情報",
        href: "https://sotobaco.com/news/?category=アップデート情報",
        external: true,
      },
      {
        label: "ブログ",
        href: "/",
        external: false,
      },
    ],
  },
  {
    title: "会社情報",
    links: [
      { label: "会社概要", href: EXTERNAL_URLS.companyAbout, external: true },
      { label: "利用規約", href: EXTERNAL_URLS.terms, external: true },
      {
        label: "プライバシーポリシー",
        href: EXTERNAL_URLS.privacy,
        external: true,
      },
    ],
  },
];

export default function Footer() {
  return <SharedFooter menus={footerMenus} />;
}
