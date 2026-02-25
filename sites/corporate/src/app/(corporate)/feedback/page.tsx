import { Suspense } from "react";
import type { Metadata } from "next";
import FeedbackForm from "./FeedbackForm";

export const metadata: Metadata = {
  title: "ソトバコの改善に協力する | 株式会社ソトバコ",
  description:
    "ソトバコサービスに関するご意見・ご感想をお聞かせください。いただいたフィードバックはサービス改善に活用いたします。",
};

export default function FeedbackPage() {
  return (
    <Suspense>
      <FeedbackForm />
    </Suspense>
  );
}
