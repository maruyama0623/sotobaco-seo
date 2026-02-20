/**
 * 記事をPDFに書き出すスクリプト
 *
 * 使い方:
 *   node scripts/export-pdf.mjs <記事番号>
 *
 * 例:
 *   node scripts/export-pdf.mjs 11   → articles/11_*.md をPDF化
 *   node scripts/export-pdf.mjs 01   → articles/01_*.md をPDF化
 *
 * 出力先: sotobaco-seo/<slug>.pdf
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = path.join(__dirname, "../../articles");
const IMAGES_DIR  = path.join(__dirname, "../../images");
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// ── 引数チェック ──────────────────────────────────────────────
const articleNo = process.argv[2];
if (!articleNo) {
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith(".md")).sort();
  console.log("使い方: node scripts/export-pdf.mjs <記事番号>\n");
  console.log("利用可能な記事:");
  files.forEach(f => console.log(`  ${f}`));
  process.exit(1);
}

// ── 記事ファイルを特定 ────────────────────────────────────────
const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith(".md")).sort();
const mdFile = files.find(f => f.startsWith(articleNo.padStart(2, "0") + "_"));
if (!mdFile) {
  console.error(`エラー: 記事番号 "${articleNo}" に対応するファイルが見つかりません`);
  process.exit(1);
}
const mdPath = path.join(ARTICLES_DIR, mdFile);
console.log(`対象ファイル: ${mdFile}`);

// ── frontmatter を解析 ────────────────────────────────────────
const raw = fs.readFileSync(mdPath, "utf-8");
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n/);
const frontmatter = {};
if (fmMatch) {
  fmMatch[1].split("\n").forEach(line => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) frontmatter[key.trim()] = rest.join(":").trim().replace(/^"|"$/g, "");
  });
}
const title = frontmatter.title || mdFile;
const slug  = frontmatter.slug  || mdFile.replace(".md", "");

// ── Markdown 本文を抽出・クリーニング ─────────────────────────
const content = raw
  .replace(/^---[\s\S]*?---\n/, "")
  // PDF不要なフッター（LP CTA・内部リンク・免責文）を除去
  .replace(/\n👉 \[ソトバコポータルのフリープランを試す[\s\S]*$/, "");

// ── Markdown → HTML ───────────────────────────────────────────
const result = await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify)
  .process(content);

// ── 画像を Base64 に変換して埋め込み ─────────────────────────
const bodyHtml = result.toString().replace(
  /src="\/images\/([^"]+)"/g,
  (match, filename) => {
    const imgPath = path.join(IMAGES_DIR, filename);
    if (!fs.existsSync(imgPath)) return match;
    const ext = path.extname(filename).slice(1).toLowerCase();
    const mime =
      ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
      ext === "webp" ? "image/webp" :
      ext === "svg"  ? "image/svg+xml" : "image/png";
    const base64 = fs.readFileSync(imgPath).toString("base64");
    return `src="data:${mime};base64,${base64}"`;
  }
);

// ── HTML テンプレート ─────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
      font-size: 13px;
      line-height: 1.8;
      color: #333;
      padding: 40px 48px;
      max-width: 780px;
      margin: 0 auto;
    }
    h1 {
      font-size: 20px; font-weight: bold; margin: 0 0 24px; color: #111;
      border-bottom: 2px solid #35b597; padding-bottom: 10px;
    }
    h2 {
      font-size: 15px; font-weight: bold; margin: 32px 0 12px; color: #111;
      border-left: 4px solid #35b597; padding-left: 10px;
    }
    h3 { font-size: 13px; font-weight: bold; margin: 20px 0 8px; color: #333; }
    p { margin: 0 0 10px; }
    ul, ol { margin: 6px 0 10px 20px; }
    li { margin-bottom: 4px; }
    strong { font-weight: bold; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }
    blockquote {
      border-left: 3px solid #35b597;
      background: #f0fdf9;
      padding: 10px 16px;
      margin: 10px 0;
      font-size: 12px;
      color: #444;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 12px;
    }
    th {
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      padding: 7px 10px;
      text-align: left;
      font-weight: bold;
      color: #111;
    }
    td {
      border: 1px solid #d1d5db;
      padding: 7px 10px;
      vertical-align: top;
    }
    tr:nth-child(even) td { background: #fafafa; }
    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 16px auto;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    a { color: #35b597; }
    em { font-style: italic; font-size: 11px; color: #666; }
    .logo {
      font-size: 15px; font-weight: bold; color: #35b597;
      margin-bottom: 28px; padding-bottom: 14px;
      border-bottom: 1px solid #e5e7eb;
    }
    @media print {
      body { padding: 20px 32px; }
      table { page-break-inside: avoid; }
      h2 { page-break-after: avoid; }
      img { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="logo">ソトバコポータル</div>
  ${bodyHtml}
</body>
</html>`;

// ── PDF生成 ───────────────────────────────────────────────────
const tmpHtml  = path.join(__dirname, "../../_tmp_pdf.html");
const pdfDir = path.join(__dirname, "../../pdf");
fs.mkdirSync(pdfDir, { recursive: true });
const outputPdf = path.join(pdfDir, `${slug}.pdf`);

fs.writeFileSync(tmpHtml, html, "utf-8");

console.log("PDFを生成中...");
execSync(
  `"${CHROME_PATH}" --headless=new --no-sandbox --disable-gpu ` +
  `--print-to-pdf="${outputPdf}" ` +
  `--no-pdf-header-footer ` +
  `"file://${tmpHtml}"`,
  { stdio: "pipe" }
);

fs.unlinkSync(tmpHtml);
console.log(`✅ 完了: ${outputPdf}`);
