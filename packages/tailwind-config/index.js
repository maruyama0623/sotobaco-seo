/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontSize: {
        xs: ["var(--text-xs)", { lineHeight: "var(--leading-xs)" }],
        sm: ["var(--text-sm)", { lineHeight: "var(--leading-sm)" }],
      },
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
};
