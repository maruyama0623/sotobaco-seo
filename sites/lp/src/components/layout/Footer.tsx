import Image from "next/image";

function ExternalIcon() {
  return (
    <svg
      className="ml-1.5 inline-block h-3 w-3"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
    >
      <rect x="1" y="3" width="8" height="8" rx="1" strokeLinejoin="round" />
      <path d="M7 1H11V5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 1L5.5 6.5" strokeLinecap="round" />
    </svg>
  );
}

const footerMenus = [
  {
    title: "サービス",
    links: [
      {
        label: "ソトバコポータル",
        href: "https://sotobaco.com/sotobacoportal",
        external: false,
      },
    ],
  },
  {
    title: "サポート",
    links: [
      { label: "お問い合わせ", href: "https://sotobaco.com/contact", external: true },
      {
        label: "操作ガイド",
        href: "https://guide.sotobaco.com/portal/index.html",
        external: true,
      },
    ],
  },
  {
    title: "お知らせ",
    links: [
      {
        label: "アップデート情報",
        href: "https://sotobaco.com/update/",
        external: true,
      },
      {
        label: "ブログ",
        href: "https://blog.sotobaco.com/",
        external: true,
      },
    ],
  },
  {
    title: "会社情報",
    links: [
      { label: "運営会社", href: "https://sotobaco.com/", external: true },
      { label: "会社概要", href: "https://sotobaco.com/company", external: true },
      { label: "利用規約", href: "https://sotobaco.com/terms", external: true },
      {
        label: "プライバシーポリシー",
        href: "https://sotobaco.com/privacy",
        external: true,
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#485157] text-gray-300">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          {/* Left: Logo & Company Info */}
          <div className="shrink-0">
            <Image
              src="/images/logo-yoko.svg"
              alt="ソトバコ"
              width={140}
              height={48}
              className="h-10 w-auto brightness-0 invert"
            />
            <p className="mt-4 text-sm leading-relaxed">
              株式会社ソトバコ
              <br />
              〒810-0004
              <br />
              福岡県福岡市中央区渡辺通5-23-8 サンライトビル3F
            </p>
          </div>

          {/* Right: Footer Menus */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerMenus.map((menu) => (
              <div key={menu.title}>
                <h3 className="border-b border-gray-500 pb-2 text-sm font-bold text-white">
                  {menu.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {menu.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-300 transition hover:text-white"
                      >
                        {link.label}
                        {link.external && <ExternalIcon />}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-600">
        <div className="mx-auto max-w-[1200px] px-6 py-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} sotobaco. Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
