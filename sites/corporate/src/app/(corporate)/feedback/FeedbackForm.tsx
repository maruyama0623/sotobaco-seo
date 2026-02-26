"use client";

import { useState, useRef, type FormEvent } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import PageHero from "@/components/ui/PageHero";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { CONTACT_API_URL, TURNSTILE_SITE_KEY } from "@/lib/constants";

const SERVICES = [
  { value: "sotobaco-portal", label: "ソトバコポータル" },
  { value: "btone", label: "Btone" },
] as const;

const FEEDBACK_TYPES = [
  { value: "like", label: "気に入っている" },
  { value: "dislike", label: "不満がある" },
  { value: "idea", label: "アイデアがある" },
] as const;

type FormData = {
  service: string;
  feedbackType: string;
  comment: string;
  company: string;
  name: string;
  email: string;
  agree: boolean;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.service) errors.service = "サービスを選択してください";
  if (!data.feedbackType)
    errors.feedbackType = "ご意見の種類を選択してください";
  if (!data.comment.trim())
    errors.comment = "コメントを入力してください";
  if (!data.agree)
    errors.agree = "プライバシーポリシーおよび注意事項に同意してください";
  return errors;
}

export default function FeedbackForm() {
  const [formData, setFormData] = useState<FormData>({
    service: "",
    feedbackType: "",
    comment: "",
    company: "",
    name: "",
    email: "",
    agree: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setTurnstileError("セキュリティ検証を完了してください");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(`${CONTACT_API_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: formData.service,
          feedbackType: formData.feedbackType,
          comment: formData.comment,
          company: formData.company || undefined,
          name: formData.name || undefined,
          email: formData.email || undefined,
          _hp: honeypot,
          turnstileToken: turnstileToken || undefined,
        }),
      });
      if (!res.ok) throw new Error("送信に失敗しました");
      setStatus("success");
    } catch {
      setStatus("error");
      turnstileRef.current?.reset();
      setTurnstileToken("");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

  if (status === "success") {
    return (
      <>
        <PageHero
          title="ソトバコの改善に協力する"
          description="貴重なご意見をお寄せいただきありがとうございます。"
        />
        <SectionWrapper maxWidth="800" bg="gray">
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
              ご意見を受け付けました
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              いただいたご意見は、ソトバコの改善に活用させていただきます。
              <br />
              ご協力ありがとうございました。
            </p>
          </div>
        </SectionWrapper>
      </>
    );
  }

  return (
    <>
      <PageHero
        title="ソトバコの改善に協力する"
        description="本フォームで送信されたご意見は、ソトバコの改善を目的として利用します。"
      />
      <SectionWrapper maxWidth="800" bg="gray">
        <div className="rounded-2xl bg-white p-6 shadow-sm md:p-10">
          {/* 案内文 */}
          <p className="mb-8 text-sm text-gray-600">
            ※サービスに関するお問い合わせや、返信をご希望の方は下記のフォームよりお願いいたします
            <br />
            <a
              href="/requests"
              className="text-brand underline hover:text-brand-dark"
            >
              サービスに対するお問い合わせ
            </a>
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Honeypot */}
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

            {/* 会社名（任意） */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-900">
                会社名<span className="ml-1 text-xs font-normal text-gray-400">（任意）</span>
              </label>
              <input
                type="text"
                className={inputClass}
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>

            {/* 担当者名（任意） */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-900">
                担当者名<span className="ml-1 text-xs font-normal text-gray-400">（任意）</span>
              </label>
              <input
                type="text"
                className={inputClass}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* メールアドレス（任意） */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-900">
                メールアドレス<span className="ml-1 text-xs font-normal text-gray-400">（任意）</span>
              </label>
              <input
                type="email"
                className={inputClass}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* サービス選択 */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-900">
                ご意見・ご感想したいサービスを教えてください
                <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className={`${inputClass} appearance-none pr-10`}
                  value={formData.service}
                  onChange={(e) =>
                    setFormData({ ...formData, service: e.target.value })
                  }
                >
                  <option value="">選択してください</option>
                  {SERVICES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {errors.service && (
                <p className="mt-1.5 text-xs text-red-500">{errors.service}</p>
              )}
            </div>

            {/* 種類選択 */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-900">
                ご意見・ご感想の種類を教えてください
                <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className={`${inputClass} appearance-none pr-10`}
                  value={formData.feedbackType}
                  onChange={(e) =>
                    setFormData({ ...formData, feedbackType: e.target.value })
                  }
                >
                  <option value="">選択してください</option>
                  {FEEDBACK_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {errors.feedbackType && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.feedbackType}
                </p>
              )}
            </div>

            {/* コメント */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-900">
                コメントを入力ください！
                <span className="ml-1 text-red-500">*</span>
              </label>
              <textarea
                className={`${inputClass} min-h-[160px] resize-y`}
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
              />
              {errors.comment && (
                <p className="mt-1.5 text-xs text-red-500">{errors.comment}</p>
              )}
            </div>

            {/* 注意事項 */}
            <div className="rounded-lg bg-gray-50 p-4 text-xs leading-relaxed text-gray-600">
              <p className="font-bold">【注意事項】</p>
              <p className="mt-1">
                ※
                いただきましたサービスに関するご意見は、ソトバコの改善を目的として利用します。
              </p>
              <p>
                ※
                いただきましたサービスに関するアイディアは、いかなる補償もなく自動的に株式会社ソトバコの財産になります。
              </p>
              <p>
                ※
                個人情報、秘密保持義務のある情報、個別の通信内容等の提供はご遠慮ください。
              </p>
              <p className="mt-2">上記、あらかじめご了承ください。</p>
            </div>

            {/* 同意チェック */}
            <div>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-brand"
                  checked={formData.agree}
                  onChange={(e) =>
                    setFormData({ ...formData, agree: e.target.checked })
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
                  および注意事項に同意して送信する
                  <span className="ml-1 text-red-500">*</span>
                </span>
              </label>
              {errors.agree && (
                <p className="mt-1.5 text-xs text-red-500">{errors.agree}</p>
              )}
            </div>

            {/* Turnstile */}
            {TURNSTILE_SITE_KEY && (
              <div>
                <Turnstile
                  ref={turnstileRef}
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={(token) => { setTurnstileToken(token); setTurnstileError(""); }}
                  onError={() => { setTurnstileToken(""); setTurnstileError("セキュリティ検証に失敗しました。ページを再読み込みしてください。"); }}
                  onExpire={() => { setTurnstileToken(""); }}
                />
                {turnstileError && (
                  <p className="mt-1.5 text-xs text-red-500">{turnstileError}</p>
                )}
              </div>
            )}

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
                className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-8 py-4 text-base font-bold text-white shadow-lg transition hover:bg-brand-dark hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
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
                  "この内容で送信する"
                )}
              </button>
            </div>
          </form>
        </div>
      </SectionWrapper>
    </>
  );
}
