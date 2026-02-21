import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  bg?: "white" | "gray" | "brand" | "brand-light" | "gradient";
  maxWidth?: "800" | "900" | "1000" | "1200";
  center?: boolean;
  id?: string;
  className?: string;
};

const bgMap = {
  white: "",
  gray: "bg-gray-50",
  brand: "bg-brand",
  "brand-light": "bg-brand-light",
  gradient: "bg-gradient-to-b from-brand-light to-white",
};

const maxWidthMap = {
  "800": "max-w-[800px]",
  "900": "max-w-[900px]",
  "1000": "max-w-[1000px]",
  "1200": "max-w-[1200px]",
};

export default function SectionWrapper({
  children,
  bg = "white",
  maxWidth = "1200",
  center = false,
  id,
  className = "",
}: Props) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${bgMap[bg]} ${className}`}
    >
      <div
        className={`mx-auto px-4 ${maxWidthMap[maxWidth]} ${center ? "text-center" : ""}`}
      >
        {children}
      </div>
    </section>
  );
}
