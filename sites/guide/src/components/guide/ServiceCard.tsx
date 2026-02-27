import Link from "next/link";
import Image from "next/image";

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
}

export default function ServiceCard({
  title,
  description,
  href,
  imageSrc,
  imageAlt,
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-[2/1] overflow-hidden bg-gray-50 p-6">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={480}
          height={240}
          className="h-full w-full object-contain transition group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
        <span className="mt-3 inline-flex items-center text-sm font-medium text-brand">
          ガイドを見る
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
