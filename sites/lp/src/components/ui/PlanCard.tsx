import type { PlanCardData, PlanStat } from "@/lib/data";
import { SERVICE_URL } from "@/lib/constants";
import CheckList from "./CheckList";

function StatItem({ stat }: { stat: PlanStat }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="rounded-full bg-brand-light px-3 py-0.5 text-xs font-bold text-brand">
        {stat.label}
      </span>
      <span className="text-lg font-extrabold text-gray-900">{stat.value}</span>
    </div>
  );
}

export default function PlanCard({ plan }: { plan: PlanCardData }) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      {/* Header */}
      <p className="text-sm text-gray-500">{plan.description}</p>
      <h3 className="mt-1 text-2xl font-extrabold text-gray-900">
        {plan.name}
      </h3>

      {/* Price */}
      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold text-gray-900">
          {plan.price}
        </span>
        <span className="text-sm text-gray-500">{plan.unit}</span>
      </div>
      <p className={`mt-1 text-xs ${plan.period ? "text-gray-400" : "invisible"}`}>
        {plan.period || "\u00A0"}
      </p>

      {/* Divider */}
      <hr className="mt-5 border-gray-200" />

      {/* Stats */}
      <div className="mt-5 flex justify-center gap-8">
        {plan.stats.map((stat) => (
          <StatItem key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Divider */}
      <hr className="mt-5 border-gray-200" />

      {/* Features */}
      <div className="mt-5 flex-1">
        <CheckList items={plan.features} />
      </div>

      {/* CTA */}
      <div className="mt-8">
        <a
          href={SERVICE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg border-2 border-brand bg-white py-3 text-center text-sm font-bold text-brand transition hover:bg-brand-light"
        >
          {plan.cta}
        </a>
      </div>
    </div>
  );
}
