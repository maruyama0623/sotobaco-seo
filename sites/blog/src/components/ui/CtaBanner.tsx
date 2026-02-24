import Image from "next/image";
import CtaButton from "@/components/ui/CtaButton";

interface CtaBannerProps {
  imageSrc: string;
  imageAlt: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export default function CtaBanner({
  imageSrc,
  imageAlt,
  heading,
  description,
  buttonText,
  buttonHref,
  secondaryButtonText,
  secondaryButtonHref,
}: CtaBannerProps) {
  return (
    <div className="rounded-xl bg-brand-light p-6 sm:p-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        {/* Left: Image */}
        <div className="relative w-full sm:w-2/5 sm:shrink-0">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Right: Text + Buttons */}
        <div className="flex flex-1 flex-col items-center sm:items-start">
          <p className="text-center text-lg font-bold leading-snug text-gray-900 sm:text-left">
            {heading}
          </p>
          <p className="mt-2 text-center text-sm leading-relaxed text-gray-600 sm:text-left">
            {description}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <CtaButton href={buttonHref}>{buttonText}</CtaButton>
            {secondaryButtonText && secondaryButtonHref && (
              <a
                href={secondaryButtonHref}
                className="inline-flex items-center justify-center rounded-lg border border-brand bg-white px-8 py-3 text-sm font-bold text-brand transition hover:bg-gray-50"
              >
                {secondaryButtonText}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
