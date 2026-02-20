import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-noto-sans-jp)",
          "YuGothic",
          "游ゴシック",
          "Meiryo",
          "メイリオ",
          '"Hiragino Kaku Gothic Pro"',
          "ヒラギノ角ゴシック",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          DEFAULT: "#35b597",
          light: "#E5F8F2",
          dark: "#2a9a7f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
