import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
};

export default function Card({ children, className = "", hoverable = false }: Props) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${
        hoverable ? "transition hover:shadow-md" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
