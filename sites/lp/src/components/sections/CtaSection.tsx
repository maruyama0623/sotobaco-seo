import SectionWrapper from "@/components/ui/SectionWrapper";
import { SERVICE_URL } from "@/lib/constants";

const benefits = [
  "決済情報の登録不要",
  "フリープランは期間制限なし（自動で有料プランに移行することはありません）",
  "いつでもアップグレード・解約可能",
];

function CheckCircle() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-brand"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
      <path
        d="M8 12l2.5 2.5L16 9.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  variant?: "filled" | "bordered";
  title?: string;
  description?: string;
  buttonText?: string;
  links?: { label: string; href: string; external?: boolean }[];
};

export default function CtaSection({
  variant = "filled",
  title = "まずはフリープランで体験しませんか？",
  description,
  buttonText = "フリープランを始める（無料）",
  links,
}: Props) {
  return (
    <SectionWrapper bg={variant === "filled" ? "brand-light" : undefined}>
      <div
        className={`overflow-hidden shadow-sm ${
          variant === "bordered"
            ? "rounded-3xl border-[6px] border-brand-light bg-white"
            : "rounded-2xl border border-brand/20 bg-white"
        }`}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="flex items-center justify-center p-6 md:w-2/5 md:p-8">
            <img
              src="/images/portal/smartphone_multi-device.png"
              alt="ソトバコポータルのPC・スマートフォン画面イメージ"
              className="w-full max-w-[400px] rounded-lg"
            />
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-center p-8 md:p-10">
            <p className="text-sm font-bold text-brand">
              登録カンタン！最短7分で導入
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-gray-900 md:text-2xl">
              {title}
            </h2>

            {description && (
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {description}
              </p>
            )}

            <ul className="mt-5 space-y-3">
              {benefits.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm leading-relaxed text-gray-700"
                >
                  <CheckCircle />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <a
                href={SERVICE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-lg bg-brand px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-brand-dark hover:shadow-xl"
              >
                {buttonText}
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
            </div>

            {links && links.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-500">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="underline transition hover:text-brand"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
