const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const SITE_URL = "https://guide.sotobaco.com";
const OUT_DIR = path.join(__dirname, "..", "out");
const CONTENT_DIR = path.join(__dirname, "..", "content");

const staticPages = [
  { url: "/", priority: "1.0", changefreq: "monthly" },
  { url: "/portal/", priority: "0.9", changefreq: "monthly" },
];

function getGuidePages() {
  const pages = [];
  const services = fs.readdirSync(CONTENT_DIR).filter((f) => {
    const fullPath = path.join(CONTENT_DIR, f);
    return fs.statSync(fullPath).isDirectory();
  });

  for (const service of services) {
    const serviceDir = path.join(CONTENT_DIR, service);
    const categories = fs.readdirSync(serviceDir).filter((f) => {
      const fullPath = path.join(serviceDir, f);
      return fs.statSync(fullPath).isDirectory();
    });

    for (const category of categories) {
      const categoryDir = path.join(serviceDir, category);
      const files = fs.readdirSync(categoryDir).filter((f) => f.endsWith(".md"));

      for (const file of files) {
        const content = fs.readFileSync(path.join(categoryDir, file), "utf-8");
        const { data } = matter(content);
        const slug = data.slug || file.replace(".md", "");
        pages.push({
          url: `/${service}/${category}/${slug}/`,
          priority: "0.7",
          changefreq: "monthly",
        });
      }
    }
  }
  return pages;
}

function generateSitemap() {
  const guidePages = getGuidePages();
  const allPages = [...staticPages, ...guidePages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "sitemap.xml"), xml);
  console.log(`Generated sitemap.xml with ${allPages.length} URLs`);
}

generateSitemap();
