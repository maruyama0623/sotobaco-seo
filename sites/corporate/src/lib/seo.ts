import type { Metadata } from "next";

const SITE_NAME = "株式会社ソトバコ";
const SITE_URL = "https://sotobaco.com";

export function buildSiteMetadata(): Metadata {
  return {
    title: {
      default: `${SITE_NAME} | すべての働く人がDXの恩恵を受ける社会にする`,
      template: `%s | ${SITE_NAME}`,
    },
    description:
      "株式会社ソトバコは、kintoneを中心としたクラウドサービスの活用支援を通じて、すべての働く人がDXの恩恵を受ける社会を目指しています。",
    metadataBase: new URL(SITE_URL),
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName: SITE_NAME,
      url: SITE_URL,
    },
    twitter: {
      card: "summary_large_image",
    },
    icons: {
      icon: "/images/sotobaco_favicon.ico",
    },
    alternates: {
      canonical: SITE_URL,
    },
  };
}
