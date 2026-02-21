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
        external: false,
      },
    ],
  },
  {
    title: "サポート",
    links: [
      { label: "お問い合わせ", href: EXTERNAL_URLS.contact, external: true },
    ],
  },
  {
    title: "お知らせ",
    links: [
      {
        label: "アップデート情報",
        href: EXTERNAL_URLS.update,
        external: true,
      },
    ],
  },
  {
    title: "会社情報",
    links: [
      { label: "運営会社", href: EXTERNAL_URLS.company, external: true },
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
