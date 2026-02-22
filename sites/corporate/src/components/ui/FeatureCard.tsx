import PlanBadge, { type Plan } from "./PlanBadge";
import ImageZoom from "@/components/ui/ImageZoom";

type Props = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  plans: Plan[];
  imageHeight?: string;
  hoverable?: boolean;
};

export default function FeatureCard({
  title,
  description,
  image,
  imageAlt,
  plans,
  imageHeight = "h-[180px]",
  hoverable = false,
}: Props) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${
        hoverable ? "transition hover:shadow-md" : ""
      }`}
    >
      <div className="flex items-center justify-center bg-gray-50 p-4">
        <ImageZoom
          src={image}
          alt={imageAlt}
          width={400}
          height={240}
          className={`${imageHeight} w-full rounded-lg object-contain object-center`}
        />
      </div>
      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {plans.map((plan) => (
            <PlanBadge key={plan} plan={plan} />
          ))}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
}
