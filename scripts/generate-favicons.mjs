import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import toIco from "to-ico";

const PUBLIC_DIR = path.join(process.cwd(), "public");

const LIME = "#e2ef5f";
const LIME_SHADOW = "#c8d84a";
const DARK = "#1a1a2e";
const CREAM = "#fffdf1";

/** Matches Header logo: lime rounded tile, hard bottom shadow, bold "P". */
function buildLogoSvg({ size, background = "transparent" }) {
  const padding = Math.round(size * 0.148);
  const tileSize = size - padding * 2;
  const radius = Math.round(tileSize * 0.3);
  const shadowHeight = Math.max(4, Math.round(tileSize * 0.1));
  const shadowOffset = Math.max(3, Math.round(tileSize * 0.08));
  const tileX = padding;
  const tileY = padding;
  const shadowY = tileY + tileSize + shadowOffset - shadowHeight;
  const fontSize = Math.round(tileSize * 0.72);
  const textY = tileY + tileSize * 0.72;

  const backgroundRect =
    background === "transparent"
      ? ""
      : `<rect width="${size}" height="${size}" fill="${background}"/>`;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      ${backgroundRect}
      <rect x="${tileX}" y="${shadowY}" width="${tileSize}" height="${shadowHeight}" rx="${Math.round(radius * 0.55)}" fill="${LIME_SHADOW}"/>
      <rect x="${tileX}" y="${tileY}" width="${tileSize}" height="${tileSize}" rx="${radius}" fill="${LIME}"/>
      <text
        x="${size / 2}"
        y="${textY}"
        text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-weight="900"
        font-size="${fontSize}"
        fill="${DARK}"
      >P</text>
    </svg>
  `;
}

async function renderPng(size, background) {
  const svg = buildLogoSvg({ size, background });
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function generateFavicons() {
  const png16 = await renderPng(16, "transparent");
  const png32 = await renderPng(32, "transparent");
  const png180 = await renderPng(180, CREAM);

  const faviconIco = await toIco([png16, png32]);

  await writeFile(path.join(PUBLIC_DIR, "favicon.ico"), faviconIco);
  await writeFile(path.join(PUBLIC_DIR, "favicon-16x16.png"), png16);
  await writeFile(path.join(PUBLIC_DIR, "favicon-32x32.png"), png32);
  await writeFile(path.join(PUBLIC_DIR, "apple-touch-icon.png"), png180);

  console.log("Created public/favicon.ico");
  console.log("Created public/favicon-16x16.png");
  console.log("Created public/favicon-32x32.png");
  console.log("Created public/apple-touch-icon.png");
}

generateFavicons().catch((error) => {
  console.error(error);
  process.exit(1);
});
