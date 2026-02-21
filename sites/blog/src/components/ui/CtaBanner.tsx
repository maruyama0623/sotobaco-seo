import Image from "next/image";
import CtaButton from "@/components/ui/CtaButton";

interface CtaBannerProps {
  imageSrc: string;
  imageAlt: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export default function CtaBanner({
  imageSrc,
  imageAlt,
  heading,
  description,
  buttonText,
  buttonHref,
}: CtaBannerProps) {
  return (
    <div className="rounded-xl bg-brand-light p-6 sm:p-8">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        {/* Left: Image (40%) */}
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

        {/* Right: Text (60%) */}
        <div className="text-center sm:flex-1 sm:text-left">
          <p className="text-lg font-bold leading-snug text-gray-900">{heading}</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {description}
          </p>
        </div>
      </div>

      {/* Button: Centered */}
      <div className="mt-6 text-center">
        <CtaButton href={buttonHref}>{buttonText}</CtaButton>
      </div>
    </div>
  );
}
