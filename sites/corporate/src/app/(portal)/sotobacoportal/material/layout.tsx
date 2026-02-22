import type { Metadata } from "next";
import { buildPortalPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPortalPageMetadata(
  "資料ダウンロード",
  "ソトバコポータルの紹介資料をダウンロードいただけます。フォーム入力後、メールでダウンロードリンクをお送りします。",
  "/material/"
);

export default function MaterialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
