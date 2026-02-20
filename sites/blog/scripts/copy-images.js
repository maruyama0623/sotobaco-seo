const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "..", "..", "images");
const DEST = path.join(__dirname, "..", "public", "images");

if (!fs.existsSync(SRC)) {
  console.log("No images/ directory found, skipping copy.");
  process.exit(0);
}

fs.mkdirSync(DEST, { recursive: true });

const files = fs.readdirSync(SRC).filter((f) => !f.startsWith("."));
let copied = 0;

for (const file of files) {
  const srcPath = path.join(SRC, file);
  if (!fs.statSync(srcPath).isFile()) continue;
  fs.copyFileSync(srcPath, path.join(DEST, file));
  copied++;
}

console.log(`Copied ${copied} images to public/images/`);
