import type { Metadata } from "next";
import Script from "next/script";
import { GA_ID } from "@sotobaco/ui";
import { buildSiteMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = buildSiteMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body className="flex min-h-screen flex-col bg-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
