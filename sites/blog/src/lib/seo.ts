import type { Metadata } from "next";
import type { Article, ArticleSummary } from "@/types/article";

const SITE_NAME = "ソトバコ ブログ";
const SITE_URL = "https://blog.sotobaco.com";
const DEFAULT_OG_IMAGE = "/images/portal_overview.png";

export function buildSiteMetadata(): Metadata {
  return {
    title: {
      default: `${SITE_NAME} | kintoneポータルの活用情報`,
      template: `%s | ${SITE_NAME}`,
    },
    description:
      "kintoneのポータルをもっと使いやすく。アプリ整理・部署別表示・ダッシュボード化のノウハウをお届けします。",
    metadataBase: new URL(SITE_URL),
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

export function buildArticleMetadata(article: Article | ArticleSummary): Metadata {
  const url = `${SITE_URL}/articles/${article.slug}/`;
  const ogImage = article.ogImage || DEFAULT_OG_IMAGE;

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function buildArticleJsonLd(article: Article | ArticleSummary) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.ogImage || DEFAULT_OG_IMAGE,
    datePublished: article.publishedAt,
    author: {
      "@type": "Organization",
      name: "株式会社ソトバコ.",
    },
    publisher: {
      "@type": "Organization",
      name: "株式会社ソトバコ.",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo-portal-yoko.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/articles/${article.slug}/`,
    },
  };
}
