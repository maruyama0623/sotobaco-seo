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

/* ──────────── ソトバコポータル LP ──────────── */

const PORTAL_NAME = "ソトバコポータル";
const PORTAL_URL = "https://sotobaco.com/sotobacoportal";
const PORTAL_OG_IMAGE = "/images/portal/portal_overview.png";

export function buildPortalMetadata(): Metadata {
  return {
    title: `${PORTAL_NAME} | kintoneのポータルを、部署ごとに整理`,
    description:
      "kintoneのポータルを部署ごとにタブで整理し、ドラッグ&ドロップで管理。閲覧権限も設定可能。フリープランは期間制限なし。最短7分で導入できます。",
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName: PORTAL_NAME,
      url: PORTAL_URL,
      images: [{ url: PORTAL_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      canonical: PORTAL_URL,
    },
  };
}

export function buildPortalPageMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  const url = `https://sotobaco.com/sotobacoportal${path}`;
  return {
    title: `${title} | ${PORTAL_NAME}`,
    description,
    openGraph: {
      title: `${title} | ${PORTAL_NAME}`,
      description,
      url,
      images: [{ url: PORTAL_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${PORTAL_NAME}`,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}
