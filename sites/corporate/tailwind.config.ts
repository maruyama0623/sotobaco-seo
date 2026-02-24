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
      keyframes: {
        "pulse-ring": {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
