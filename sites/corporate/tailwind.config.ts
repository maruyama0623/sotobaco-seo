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
  plugins: [typography],
};

export default config;
