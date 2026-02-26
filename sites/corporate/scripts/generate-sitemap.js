const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const SITE_URL = "https://sotobaco.com";
const NEWS_DIR = path.join(__dirname, "..", "news");
const OUT_DIR = path.join(__dirname, "..", "out");

function getNewsSlugs() {
  if (!fs.existsSync(NEWS_DIR)) return [];
  return fs
    .readdirSync(NEWS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .filter(Boolean);
}

const today = new Date().toISOString().split("T")[0];
const newsSlugs = getNewsSlugs();

const urls = [
  { loc: `${SITE_URL}/`, priority: "1.0" },
  { loc: `${SITE_URL}/company/`, priority: "0.8" },
  { loc: `${SITE_URL}/news/`, priority: "0.8" },
  { loc: `${SITE_URL}/contact/`, priority: "0.6" },
  { loc: `${SITE_URL}/privacy/`, priority: "0.3" },
  { loc: `${SITE_URL}/terms/`, priority: "0.3" },
  { loc: `${SITE_URL}/sotobacoportal/`, priority: "0.9" },
  { loc: `${SITE_URL}/sotobacoportal/features/`, priority: "0.8" },
  { loc: `${SITE_URL}/sotobacoportal/pricing/`, priority: "0.8" },
  { loc: `${SITE_URL}/sotobacoportal/material/`, priority: "0.7" },
  { loc: `${SITE_URL}/btone/`, priority: "0.8" },
  ...newsSlugs.map((slug) => ({
    loc: `${SITE_URL}/news/${slug}/`,
    priority: "0.6",
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, "sitemap.xml"), xml);
console.log(`Generated sitemap.xml with ${urls.length} URLs`);
