export type Plan = "フリー" | "ライト" | "スタンダード";

const planStyles: Record<Plan, string> = {
  フリー: "border-gray-300 text-gray-600",
  ライト: "border-brand/40 text-brand",
  スタンダード: "border-brand bg-brand text-white",
};

export default function PlanBadge({ plan }: { plan: Plan }) {
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-xs font-bold leading-tight ${planStyles[plan]}`}
    >
      {plan}
    </span>
  );
}
