import { SERVICE_URL } from "@/lib/constants";

/* ──────────── Shared cell renderers ──────────── */

function CheckCircle() {
  return (
    <svg
      className="mx-auto h-6 w-6 text-brand"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
      <path
        d="M8 12l2.5 2.5L16 9.5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Dash() {
  return <span className="text-gray-300">—</span>;
}

function CellValue({ value }: { value: string }) {
  if (value === "○") return <CheckCircle />;
  if (value === "×") return <Dash />;
  return <span className="text-sm font-medium text-gray-900">{value}</span>;
}

/* ──────────── Types ──────────── */

export type Column = {
  key: string;
  label: string;
  subLabel?: string;
  highlight?: boolean;
  cta?: string;
};

export type Row = Record<string, string | boolean | undefined> & {
  label: string;
  href?: string;
};

type Props = {
  columns: Column[];
  rows: Row[];
};

/* ──────────── Component ──────────── */

export default function ComparisonTable({ columns, rows }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        {/* Header */}
        <thead>
          <tr>
            <th className="w-[240px] min-w-[180px] px-4 pb-4" />
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 pb-4 text-center ${col.highlight ? "bg-brand-light/40" : ""}`}
              >
                <p className={`text-lg font-extrabold ${col.highlight ? "text-brand" : "text-gray-900"}`}>
                  {col.label}
                </p>
                {col.subLabel && (
                  <span className="text-xs font-normal text-gray-400">
                    {col.subLabel}
                  </span>
                )}
                {col.cta && (
                  <a
                    href={SERVICE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block whitespace-nowrap rounded-full border border-brand-light bg-white px-4 py-1.5 text-xs font-bold text-brand transition hover:bg-brand-light/20"
                  >
                    {col.cta}
                  </a>
                )}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.label}
              className={`border-t border-gray-200 ${
                i === rows.length - 1 ? "border-b" : ""
              } ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
            >
              <td className="px-4 py-4 text-sm font-medium text-gray-700">
                {row.href ? (
                  <a
                    href={row.href}
                    className="text-gray-700 transition hover:underline hover:underline-offset-2"
                  >
                    {row.label}
                  </a>
                ) : (
                  row.label
                )}
              </td>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-4 text-center ${col.highlight ? "bg-brand-light/40" : ""}`}
                >
                  <CellValue value={String(row[col.key] ?? "")} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
