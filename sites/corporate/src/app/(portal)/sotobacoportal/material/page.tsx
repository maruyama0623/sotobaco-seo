"use client";

import { Suspense, useState, type FormEvent } from "react";
import PageHero from "@/components/ui/PageHero";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { MATERIAL_API_URL } from "@/lib/constants";

/* ── Select options ── */

const INDUSTRY_OPTIONS = [
  "IT・ソフトウェア",
  "製造",
  "建設・不動産",
  "食品・飲料",
  "医療・福祉",
  "教育・学校",
  "金融・保険",
  "小売・流通",
  "人材・派遣",
  "広告・メディア",
  "士業・コンサルティング",
  "官公庁・自治体",
  "その他",
];

const POSITION_OPTIONS = [
  "経営者・役員",
  "部長・マネージャー",
  "課長・リーダー",
  "一般社員",
  "情報システム担当",
  "その他",
];

const COMPANY_SIZE_OPTIONS = [
  "1〜10名",
  "11〜50名",
  "51〜100名",
  "101〜300名",
  "301名以上",
];

const PURPOSE_OPTIONS = ["情報収集", "比較検討", "導入予定", "その他"];

const START_TIMING_OPTIONS = [
  "すぐに",
  "1ヶ月以内",
  "3ヶ月以内",
  "6ヶ月以内",
  "未定",
];

const KINTONE_HISTORY_OPTIONS = [
  "未利用",
  "半年未満",
  "半年〜1年",
  "1〜3年",
  "3年以上",
];

const KINTONE_USERS_OPTIONS = [
  "1〜10",
  "11〜50",
  "51〜100",
  "101〜300",
  "301以上",
];

const KINTONE_APPS_OPTIONS = [
  "1〜10",
  "11〜30",
  "31〜50",
  "51〜100",
  "101以上",
];

/* ── Types ── */

type FormData = {
  company: string;
  name: string;
  email: string;
  position: string;
  industry: string;
  companySize: string;
  purpose: string;
  startTiming: string;
  kintoneHistory: string;
  kintoneUsers: string;
  kintoneApps: string;
  privacy: boolean;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

/* ── Validation ── */

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.company.trim()) errors.company = "会社名を入力してください";
  if (!data.name.trim()) errors.name = "お名前を入力してください";
  if (!data.email.trim()) {
    errors.email = "メールアドレスを入力してください";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "正しいメールアドレスを入力してください";
  }
  if (!data.position) errors.position = "役職を選択してください";
  if (!data.industry) errors.industry = "業種・業態を選択してください";
  if (!data.companySize) errors.companySize = "会社規模を選択してください";
  if (!data.purpose) errors.purpose = "目的を選択してください";
  if (!data.startTiming) errors.startTiming = "開始時期を選択してください";
  if (!data.kintoneHistory)
    errors.kintoneHistory = "kintoneの利用歴を選択してください";
  if (!data.kintoneUsers)
    errors.kintoneUsers = "kintoneのユーザー数を選択してください";
  if (!data.kintoneApps)
    errors.kintoneApps = "作成したアプリ数を選択してください";
  if (!data.privacy)
    errors.privacy = "プライバシーポリシーに同意してください";
  return errors;
}

/* ── Components ── */

function SelectField({
  label,
  value,
  options,
  error,
  onChange,
  inputClass,
}: {
  label: string;
  value: string;
  options: string[];
  error?: string;
  onChange: (v: string) => void;
  inputClass: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-gray-900">
        {label}
        <span className="ml-1 text-red-500">*</span>
      </label>
      <div className="relative">
        <select
          className={`${inputClass} appearance-none pr-10`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">選択してください</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
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
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ── Form ── */

function MaterialForm() {
  const [formData, setFormData] = useState<FormData>({
    company: "",
    name: "",
    email: "",
    position: "",
    industry: "",
    companySize: "",
    purpose: "",
    startTiming: "",
    kintoneHistory: "",
    kintoneUsers: "",
    kintoneApps: "",
    privacy: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch(MATERIAL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: formData.company,
          name: formData.name,
          email: formData.email,
          position: formData.position,
          industry: formData.industry,
          companySize: formData.companySize,
          purpose: formData.purpose,
          startTiming: formData.startTiming,
          kintoneHistory: formData.kintoneHistory,
          kintoneUsers: formData.kintoneUsers,
          kintoneApps: formData.kintoneApps,
          _hp: honeypot,
        }),
      });
      if (!res.ok) throw new Error("送信に失敗しました");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const update = (key: keyof FormData, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

  if (status === "success") {
    return (
      <>
        <PageHero
          title="資料ダウンロード"
          description="ソトバコポータルを気軽に知ることができる資料をご用意しています。"
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
              資料のダウンロードリンクをお送りしました
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              ご入力いただいたメールアドレス宛にダウンロードリンクをお送りしました。
              <br />
              リンクは72時間有効です。届かない場合は迷惑メールフォルダをご確認ください。
            </p>
          </div>
        </SectionWrapper>
      </>
    );
  }

  return (
    <>
      <PageHero
        title="資料ダウンロード"
        description="ソトバコポータルを気軽に知ることができる資料をご用意しています。"
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
              onChange={(e) => update("company", e.target.value)}
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
              onChange={(e) => update("name", e.target.value)}
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
              onChange={(e) => update("email", e.target.value)}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* 役職・業種・会社規模 */}
          <div className="grid gap-6 md:grid-cols-3">
            <SelectField
              label="役職"
              value={formData.position}
              options={POSITION_OPTIONS}
              error={errors.position}
              onChange={(v) => update("position", v)}
              inputClass={inputClass}
            />
            <SelectField
              label="業種・業態"
              value={formData.industry}
              options={INDUSTRY_OPTIONS}
              error={errors.industry}
              onChange={(v) => update("industry", v)}
              inputClass={inputClass}
            />
            <SelectField
              label="会社規模"
              value={formData.companySize}
              options={COMPANY_SIZE_OPTIONS}
              error={errors.companySize}
              onChange={(v) => update("companySize", v)}
              inputClass={inputClass}
            />
          </div>

          {/* アンケート見出し */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-base font-bold text-gray-900">
              アンケートにご協力をお願いいたします
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              よりよいサービス提供のため、以下の項目にご回答ください。
            </p>
          </div>

          {/* 目的・開始時期 (2 columns) */}
          <div className="grid gap-6 md:grid-cols-2">
            <SelectField
              label="目的"
              value={formData.purpose}
              options={PURPOSE_OPTIONS}
              error={errors.purpose}
              onChange={(v) => update("purpose", v)}
              inputClass={inputClass}
            />
            <SelectField
              label="開始時期"
              value={formData.startTiming}
              options={START_TIMING_OPTIONS}
              error={errors.startTiming}
              onChange={(v) => update("startTiming", v)}
              inputClass={inputClass}
            />
          </div>

          {/* kintone利用歴・ユーザー数 (2 columns) */}
          <div className="grid gap-6 md:grid-cols-2">
            <SelectField
              label="kintoneの利用歴"
              value={formData.kintoneHistory}
              options={KINTONE_HISTORY_OPTIONS}
              error={errors.kintoneHistory}
              onChange={(v) => update("kintoneHistory", v)}
              inputClass={inputClass}
            />
            <SelectField
              label="kintoneのユーザー数"
              value={formData.kintoneUsers}
              options={KINTONE_USERS_OPTIONS}
              error={errors.kintoneUsers}
              onChange={(v) => update("kintoneUsers", v)}
              inputClass={inputClass}
            />
          </div>

          {/* 作成したアプリ数 */}
          <div className="grid gap-6 md:grid-cols-2">
            <SelectField
              label="作成したアプリ数"
              value={formData.kintoneApps}
              options={KINTONE_APPS_OPTIONS}
              error={errors.kintoneApps}
              onChange={(v) => update("kintoneApps", v)}
              inputClass={inputClass}
            />
          </div>

          {/* プライバシーポリシー同意 */}
          <div>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-brand"
                checked={formData.privacy}
                onChange={(e) => update("privacy", e.target.checked)}
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
                "資料をダウンロードする"
              )}
            </button>
          </div>
        </form>
      </SectionWrapper>
    </>
  );
}

export default function MaterialPage() {
  return (
    <Suspense>
      <MaterialForm />
    </Suspense>
  );
}
