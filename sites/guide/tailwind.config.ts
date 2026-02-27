import type { Config } from "tailwindcss";
import sharedConfig from "../../packages/tailwind-config";
import typography from "@tailwindcss/typography";

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
            fontSize: "15px",
            color: "rgb(35, 34, 31)",
            h2: {
              color: "#111827",
              fontSize: "1.25rem",
              lineHeight: "1.75rem",
              fontWeight: "700",
              marginTop: "2rem",
              marginBottom: "0.75rem",
            },
            h3: {
              color: "#111827",
              fontSize: "1.1rem",
              lineHeight: "1.5rem",
              fontWeight: "600",
            },
            a: {
              color: "#35b597",
              "&:hover": { color: "#2a9a7f" },
            },
            img: {
              maxWidth: "100%",
              height: "auto",
              display: "block",
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
