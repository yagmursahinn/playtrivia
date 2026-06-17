import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ICONS_DIR = path.join(process.cwd(), "public", "icons");
const SIZE = 512;

function isBackground(r, g, b, a) {
  if (a < 20) return true;
  if (r < 50 && g < 50 && b < 50) return true;
  if (r > 235 && g > 235 && b > 228) return true;
  if (r > 246 && g > 244 && b > 228 && b < 253) return true;
  return false;
}

/** Flat PlayTrivia cream tile fill — safe to remove after edge pass. */
function isCreamFill(r, g, b, a) {
  return a > 100 && r > 248 && g > 246 && b > 236 && b < 248;
}

function removeCreamFill(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (isCreamFill(r, g, b, a)) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
  }
}

function removeEdgeBackground(data, width, height) {
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = [];

  const push = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const pi = y * width + x;
    if (visited[pi]) return;
    queue.push(pi);
  };

  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  while (queue.length > 0) {
    const pi = queue.pop();
    if (visited[pi]) continue;
    visited[pi] = 1;

    const i = pi * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (!isBackground(r, g, b, a)) continue;

    data[i] = 0;
    data[i + 1] = 0;
    data[i + 2] = 0;
    data[i + 3] = 0;

    const x = pi % width;
    const y = Math.floor(pi / width);
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
    }
  }
}

async function processIcon(filename) {
  const inputPath = path.join(ICONS_DIR, filename);
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);
  removeEdgeBackground(pixels, info.width, info.height);
  removeCreamFill(pixels);

  const output = await sharp(pixels, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .resize(SIZE, SIZE, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    })
    .png({ compressionLevel: 6, quality: 100 })
    .toBuffer();

  await writeFile(inputPath, output);
  console.log(`Processed ${filename}`);
}

const files = (await readdir(ICONS_DIR)).filter((file) => file.endsWith(".png"));
await Promise.all(files.map(processIcon));
