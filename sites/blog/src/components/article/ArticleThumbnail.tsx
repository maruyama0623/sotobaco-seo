import { IMAGES } from "@/lib/constants";

interface ArticleThumbnailProps {
  title: string;
  size?: "md" | "sm";
}

const sizeStyles = {
  md: {
    outer: "p-2",
    inner: "px-6 py-4",
    logo: "h-7",
    titleClass: "thumbnail-title break-auto-phrase text-center",
  },
  sm: {
    outer: "p-1.5",
    inner: "px-4 py-2",
    logo: "h-5",
    titleClass: "break-auto-phrase text-center text-xs font-extrabold leading-snug text-gray-900",
  },
} as const;

export default function ArticleThumbnail({
  title,
  size = "md",
}: ArticleThumbnailProps) {
  const s = sizeStyles[size];

  return (
    <div className={`relative aspect-[306/172] bg-brand ${s.outer}`}>
      <div
        className={`relative flex h-full w-full flex-col rounded bg-white ${s.inner}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={IMAGES.logo}
          alt="ソトバコ"
          className={`${s.logo} w-auto self-center`}
        />
        <div className="flex flex-1 items-center justify-center">
          <p className={s.titleClass}>
            {title.split("｜")[0]}
          </p>
        </div>
      </div>
    </div>
  );
}
