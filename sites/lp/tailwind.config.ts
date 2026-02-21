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
      keyframes: {
        "pulse-ring": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.02)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
