import Image from "next/image";

export default function SidebarCta() {
  return (
    <a
      href="https://sotobaco.com/sotobacoportal"
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-xl border border-gray-100 bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full bg-brand-light">
        <Image
          src="/images/smartphone_multi-device.png"
          alt="ソトバコポータルのマルチデバイス対応画面"
          fill
          className="object-contain p-4"
        />
      </div>
      <div className="p-4 text-center">
        <p className="text-sm font-bold leading-snug text-gray-900">
          kintoneのポータルを、
          <br />
          もっと使いやすく
        </p>
        <p className="mt-2 text-xs leading-relaxed text-gray-500">
          フリープラン・期間制限なし
          <br />
          最短7分で導入できます
        </p>
        <span className="mt-3 inline-block rounded-lg bg-brand px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-dark">
          フリープランを試す
        </span>
      </div>
    </a>
  );
}
