import Image from "next/image";
import { ExternalIcon } from "./ExternalIcon";
import { COMPANY_INFO } from "./constants";

export interface FooterLink {
  label: string;
  href: string;
  external: boolean;
}

export interface FooterMenu {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  menus: FooterMenu[];
}

export function Footer({ menus }: FooterProps) {
  return (
    <footer className="bg-[#485157] text-gray-300">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          {/* Left: Logo & Company Info */}
          <div className="shrink-0">
            <Image
              src="/images/logo/logo-yoko.svg"
              alt="ソトバコ"
              width={140}
              height={48}
              className="h-10 w-auto brightness-0 invert"
            />
            <p className="mt-4 text-sm leading-relaxed">
              {COMPANY_INFO.name}
              <br />
              {COMPANY_INFO.zip}
              <br />
              {COMPANY_INFO.address}
            </p>
          </div>

          {/* Right: Footer Menus */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {menus.map((menu) => (
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
            &copy; {new Date().getFullYear()} {COMPANY_INFO.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
