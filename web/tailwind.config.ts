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
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "672px",
            lineHeight: "1.8",
            fontSize: "18px",
            color: "rgb(35, 34, 31)",
            h1: { color: "#111827" },
            h2: { color: "#111827" },
            h3: { color: "#111827" },
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
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
