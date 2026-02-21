import Image from "next/image";
import SidebarCard from "@/components/ui/SidebarCard";
import CtaButton from "@/components/ui/CtaButton";
import { EXTERNAL_URLS, IMAGES, MESSAGING } from "@/lib/constants";

export default function SidebarCta() {
  return (
    <a
      href={EXTERNAL_URLS.portal}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <SidebarCard padding={false} hover className="overflow-hidden">
        <div className="relative aspect-[4/3] w-full bg-brand-light">
          <Image
            src={IMAGES.smartphone}
            alt="ソトバコポータルのマルチデバイス対応画面"
            fill
            className="object-contain p-4"
          />
        </div>
        <div className="p-4 text-center">
          <p className="text-sm font-bold leading-snug text-gray-900">
            {MESSAGING.tagline.split("、").map((part, i) => (
              <span key={i}>
                {i > 0 && (
                  <>
                    {"、"}
                    <br />
                  </>
                )}
                {part}
              </span>
            ))}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-gray-500">
            フリープラン・期間制限なし
            <br />
            最短7分で導入できます
          </p>
          <span className="mt-3 inline-block">
            <CtaButton href={EXTERNAL_URLS.portal} size="sm">
              {MESSAGING.ctaButtonText}
            </CtaButton>
          </span>
        </div>
      </SidebarCard>
    </a>
  );
}
