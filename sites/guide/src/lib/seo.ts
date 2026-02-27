import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, COMPANY_NAME } from "./constants";

const DEFAULT_OG_IMAGE = "/images/portal/portal_overview.png";

export function buildSiteMetadata(): Metadata {
  return {
    title: {
      default: `${SITE_NAME} | ${COMPANY_NAME}`,
      template: `%s | ${SITE_NAME}`,
    },
    description:
      "ソトバコポータルの初期設定・編集方法・よくあるお問い合わせなど、操作に関するガイドをまとめています。",
    metadataBase: new URL(SITE_URL),
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName: COMPANY_NAME,
      url: SITE_URL,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
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

export function buildGuideMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      url,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
