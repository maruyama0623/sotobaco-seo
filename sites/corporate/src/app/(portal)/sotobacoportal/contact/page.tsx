"use client";

import { Suspense, useState, useEffect, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { CONTACT_API_URL } from "@/lib/constants";

const CATEGORIES = [
  { value: "sotobaco-portal", label: "ソトバコポータル" },
  { value: "btone", label: "Btone" },
  { value: "other", label: "その他" },
] as const;

type CategoryValue = (typeof CATEGORIES)[number]["value"];

type FormData = {
  category: CategoryValue;
  company: string;
  name: string;
  email: string;
  message: string;
  privacy: boolean;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.company.trim()) errors.company = "会社名を入力してください";
  if (!data.name.trim()) errors.name = "お名前を入力してください";
  if (!data.email.trim()) {
    errors.email = "メールアドレスを入力してください";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "正しいメールアドレスを入力してください";
  }
  if (!data.message.trim())
    errors.message = "お問い合わせ内容を入力してください";
  if (!data.privacy)
    errors.privacy = "プライバシーポリシーに同意してください";
  return errors;
}

function getInitialCategory(param: string | null): CategoryValue {
  if (param && CATEGORIES.some((c) => c.value === param)) {
    return param as CategoryValue;
  }
  return "other";
}

function ContactForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
    category: "other",
    company: "",
    name: "",
    email: "",
    message: "",
    privacy: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    setFormData((prev) => ({
      ...prev,
      category: getInitialCategory(categoryParam),
    }));
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: formData.category,
          company: formData.company,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _hp: honeypot,
        }),
      });
      if (!res.ok) throw new Error("送信に失敗しました");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

  if (status === "success") {
    return (
      <>
        <PageHero
          title="お問い合わせ"
          description={<>ご返信に3営業日ほどお時間をいただいております。<br />3営業日を過ぎても返信がない場合は、お手数ですが再度お問い合わせをお願いいたします。</>}
        />
        <SectionWrapper maxWidth="800">
          <div className="rounded-xl border border-brand/20 bg-brand-light p-8 text-center md:p-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
              <svg
                className="h-8 w-8 text-brand"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 md:text-2xl">
              お問い合わせを受け付けました
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              ご入力いただいたメールアドレス宛に確認メールをお送りしました。
              <br />
              内容を確認の上、担当者よりご連絡いたします。
            </p>
          </div>
        </SectionWrapper>
      </>
    );
  }

  return (
    <>
      <PageHero
        title="お問い合わせ"
        description={<>ご返信に3営業日ほどお時間をいただいております。<br />3営業日を過ぎても返信がない場合は、お手数ですが再度お問い合わせをお願いいたします。</>}
      />
      <SectionWrapper maxWidth="800">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Honeypot — hidden from users */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label>
              Leave this empty
              <input
                type="text"
                name="_hp"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </label>
          </div>

          {/* お問い合わせ種別 */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-900">
              お問い合わせ種別
            </label>
            <div className="relative">
            <select
              className={`${inputClass} appearance-none pr-4`}
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as CategoryValue,
                })
              }
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            </div>
          </div>

          {/* 会社名 */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-900">
              会社名<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="株式会社 Hello tokyo"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />
            {errors.company && (
              <p className="mt-1.5 text-xs text-red-500">{errors.company}</p>
            )}
          </div>

          {/* お名前 */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-900">
              お名前<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="山田　太郎"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* メールアドレス */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-900">
              メールアドレス<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              type="email"
              className={inputClass}
              placeholder="○○○@hello.tokyo"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* お問い合わせ内容 */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-900">
              お問い合わせ内容<span className="ml-1 text-red-500">*</span>
            </label>
            <textarea
              className={`${inputClass} min-h-[160px] resize-y`}
              placeholder="お問い合わせ内容を記載ください"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />
            {errors.message && (
              <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>
            )}
          </div>

          {/* プライバシーポリシー同意 */}
          <div>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-brand"
                checked={formData.privacy}
                onChange={(e) =>
                  setFormData({ ...formData, privacy: e.target.checked })
                }
              />
              <span className="text-sm text-gray-700">
                <a
                  href="/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand underline hover:text-brand-dark"
                >
                  プライバシーポリシー
                </a>
                に同意する
                <span className="ml-1 text-red-500">*</span>
              </span>
            </label>
            {errors.privacy && (
              <p className="mt-1.5 text-xs text-red-500">{errors.privacy}</p>
            )}
          </div>

          {/* エラーメッセージ */}
          {status === "error" && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              送信に失敗しました。時間を置いて再度お試しください。
            </div>
          )}

          {/* 送信ボタン */}
          <div className="pt-2 text-center">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex items-center justify-center rounded-lg bg-brand px-8 py-4 text-base font-bold text-white shadow-lg transition hover:bg-brand-dark hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? (
                <>
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  送信中...
                </>
              ) : (
                "送信する"
              )}
            </button>
          </div>
        </form>
      </SectionWrapper>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactForm />
    </Suspense>
  );
}
