const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "..", "..", "images");
const DEST = path.join(__dirname, "..", "public", "images");

if (!fs.existsSync(SRC)) {
  console.log("No images/ directory found, skipping copy.");
  process.exit(0);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let copied = 0;

  const entries = fs.readdirSync(src).filter((f) => !f.startsWith("."));
  for (const entry of entries) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);

    if (fs.statSync(srcPath).isDirectory()) {
      copied += copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      copied++;
    }
  }
  return copied;
}

const copied = copyDir(SRC, DEST);
console.log(`Copied ${copied} images to public/images/`);
