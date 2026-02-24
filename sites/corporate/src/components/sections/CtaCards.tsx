import SectionWrapper from "@/components/ui/SectionWrapper";
import { SERVICE_URL } from "@/lib/constants";

type CtaCard = {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  href: string;
  variant: "filled" | "outline";
};

function MailIcon() {
  return (
    <svg className="h-20 w-20 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function DeviceIcon() {
  return (
    <svg className="h-20 w-20 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="h-20 w-20 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

const cards: CtaCard[] = [
  {
    icon: <MailIcon />,
    title: "お問い合わせ",
    description:
      "導入に関する不明点やお悩みに、専門スタッフが迅速にお答えします。",
    cta: "問い合わせする",
    href: "/contact/?category=sotobaco-portal",
    variant: "filled",
  },
  {
    icon: <DeviceIcon />,
    title: "無料でお試し",
    description:
      "決済情報の登録不要！フリープランは期間制限なしですべての基本機能をお試しいただけます。",
    cta: "フリープランを始める",
    href: SERVICE_URL,
    variant: "filled",
  },
  {
    icon: <DocumentIcon />,
    title: "お役立ち資料",
    description:
      "ソトバコポータルを気軽に知ることができる資料をご用意しています。",
    cta: "資料ダウンロード",
    href: "/sotobacoportal/material/",
    variant: "outline",
  },
];

export default function CtaCards() {
  return (
    <SectionWrapper bg="brand-light">
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const isExternal = card.href.startsWith("http");
          return (
            <div
              key={card.title}
              className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-sm"
            >
              <div className="mb-4">{card.icon}</div>
              <h3 className="text-lg font-extrabold text-brand">{card.title}</h3>
              <p className="mt-3 flex-1 text-center text-sm leading-relaxed text-gray-600">
                {card.description}
              </p>
              <div className="mt-6 w-full">
                <a
                  href={card.href}
                  {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`block rounded-lg py-3 text-center text-sm font-bold transition ${
                    card.variant === "filled"
                      ? "bg-brand text-white hover:bg-brand-dark"
                      : "border-2 border-brand bg-white text-brand hover:bg-brand-light"
                  }`}
                >
                  {card.cta}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
