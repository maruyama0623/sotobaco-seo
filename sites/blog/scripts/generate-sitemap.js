const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const SITE_URL = "https://blog.sotobaco.com";
const ARTICLES_DIR = path.join(__dirname, "..", "articles");
const OUT_DIR = path.join(__dirname, "..", "out");

function getArticleSlugs() {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, f), "utf-8");
      const { data } = matter(raw);
      return data.slug;
    })
    .filter(Boolean);
}

const today = new Date().toISOString().split("T")[0];
const slugs = getArticleSlugs();

const urls = [
  { loc: `${SITE_URL}/`, priority: "1.0" },
  ...slugs.map((slug) => ({
    loc: `${SITE_URL}/articles/${slug}/`,
    priority: "0.8",
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
