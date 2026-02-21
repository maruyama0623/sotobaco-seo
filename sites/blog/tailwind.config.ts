import type { Config } from "tailwindcss";
import sharedConfig from "@sotobaco/tailwind-config";

const config: Config = {
  presets: [sharedConfig],
  content: [
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "768px",
            lineHeight: "1.8",
            fontSize: "14px",
            color: "rgb(35, 34, 31)",
            h1: { color: "#111827", fontSize: "28px", lineHeight: "45px" },
            h2: { color: "#111827", lineHeight: "35px" },
            h3: { color: "#111827", lineHeight: "32px" },
            h4: { color: "#111827" },
            a: {
              color: "#35b597",
              "&:hover": { color: "#2a9a7f" },
            },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
            img: {
              maxWidth: "100%",
              height: "auto",
              display: "block",
            },
          },
        },
        lg: {
          css: {
            fontSize: "18px",
            h1: { fontSize: "36px", lineHeight: "51px" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
