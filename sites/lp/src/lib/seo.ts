import type { Metadata } from "next";

const SITE_NAME = "ソトバコポータル";
const SITE_URL = "https://sotobaco.com/sotobacoportal";
const DEFAULT_OG_IMAGE = "/images/portal_overview.png";

export function buildSiteMetadata(): Metadata {
  return {
    title: {
      default: `${SITE_NAME} | kintoneのポータルを、部署ごとに整理`,
      template: `%s | ${SITE_NAME}`,
    },
    description:
      "kintoneのポータルを部署ごとにタブで整理し、ドラッグ&ドロップで管理。閲覧権限も設定可能。フリープランは期間制限なし。最短7分で導入できます。",
    metadataBase: new URL("https://sotobaco.com"),
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName: SITE_NAME,
      url: SITE_URL,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      canonical: SITE_URL,
    },
  };
}

export function buildPageMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  const url = `https://sotobaco.com/sotobacoportal${path}`;
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}
