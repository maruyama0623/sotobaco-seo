import { Suspense } from "react";
import type { Metadata } from "next";
import RequestForm from "./RequestForm";

export const metadata: Metadata = {
  title: "サービスに対するお問い合わせ | 株式会社ソトバコ.",
  description:
    "ソトバコサービスに関するご質問・不具合報告はこちらのフォームよりお問い合わせください。",
};

export default function RequestsPage() {
  return (
    <Suspense>
      <RequestForm />
    </Suspense>
  );
}
