import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SIZE = 512;
const OUTPUT_DIR = path.join(process.cwd(), "public", "icons");

const icons = [
  {
    filename: "solo-mode.png",
    bgFrom: "#feccef",
    bgTo: "#fb64d0",
    accent: "#1a1a2e",
    shadow: "rgba(251,100,208,0.45)",
    content: `
      <circle cx="128" cy="118" r="34" fill="#fffdf1" stroke="#1a1a2e" stroke-width="6"/>
      <circle cx="128" cy="118" r="14" fill="#59b0f7"/>
      <circle cx="128" cy="118" r="6" fill="#1a1a2e"/>
      <rect x="118" y="152" width="20" height="28" rx="10" fill="#e2ef5f" stroke="#1a1a2e" stroke-width="5"/>
      <path d="M92 92 L78 78" stroke="#1a1a2e" stroke-width="8" stroke-linecap="round"/>
      <path d="M164 92 L178 78" stroke="#1a1a2e" stroke-width="8" stroke-linecap="round"/>
    `,
  },
  {
    filename: "multiplayer.png",
    bgFrom: "#b8dcfa",
    bgTo: "#59b0f7",
    accent: "#1a1a2e",
    shadow: "rgba(89,176,247,0.45)",
    content: `
      <circle cx="92" cy="112" r="24" fill="#fffdf1" stroke="#1a1a2e" stroke-width="5"/>
      <circle cx="164" cy="112" r="24" fill="#fffdf1" stroke="#1a1a2e" stroke-width="5"/>
      <circle cx="128" cy="148" r="26" fill="#fb64d0" stroke="#1a1a2e" stroke-width="5"/>
      <rect x="78" y="148" width="32" height="18" rx="9" fill="#e2ef5f" stroke="#1a1a2e" stroke-width="4"/>
      <rect x="146" y="148" width="32" height="18" rx="9" fill="#e2ef5f" stroke="#1a1a2e" stroke-width="4"/>
    `,
  },
  {
    filename: "general-knowledge.png",
    bgFrom: "#feccef",
    bgTo: "#fb64d0",
    accent: "#1a1a2e",
    shadow: "rgba(251,100,208,0.4)",
    content: `
      <path d="M88 156 C88 108 168 108 168 156" fill="#fffdf1" stroke="#1a1a2e" stroke-width="6"/>
      <ellipse cx="128" cy="108" rx="44" ry="36" fill="#fffdf1" stroke="#1a1a2e" stroke-width="6"/>
      <path d="M104 104 C112 92 144 92 152 104" stroke="#59b0f7" stroke-width="8" stroke-linecap="round"/>
      <circle cx="112" cy="118" r="6" fill="#1a1a2e"/>
      <circle cx="144" cy="118" r="6" fill="#1a1a2e"/>
    `,
  },
  {
    filename: "science.png",
    bgFrom: "#b8dcfa",
    bgTo: "#59b0f7",
    accent: "#1a1a2e",
    shadow: "rgba(89,176,247,0.4)",
    content: `
      <rect x="108" y="78" width="40" height="110" rx="8" fill="#fffdf1" stroke="#1a1a2e" stroke-width="6"/>
      <circle cx="128" cy="118" r="18" fill="#e2ef5f" stroke="#1a1a2e" stroke-width="5"/>
      <path d="M88 188 L168 188" stroke="#1a1a2e" stroke-width="8" stroke-linecap="round"/>
      <path d="M96 92 L160 92" stroke="#fb64d0" stroke-width="6" stroke-linecap="round"/>
    `,
  },
  {
    filename: "geography.png",
    bgFrom: "#f0f7b8",
    bgTo: "#e2ef5f",
    accent: "#1a1a2e",
    shadow: "rgba(226,239,95,0.45)",
    content: `
      <circle cx="128" cy="128" r="52" fill="#59b0f7" stroke="#1a1a2e" stroke-width="6"/>
      <ellipse cx="128" cy="128" rx="52" ry="22" fill="none" stroke="#fffdf1" stroke-width="5"/>
      <path d="M76 128 H180" stroke="#fffdf1" stroke-width="5"/>
      <path d="M128 76 V180" stroke="#fffdf1" stroke-width="5"/>
      <circle cx="148" cy="108" r="10" fill="#fb64d0" stroke="#1a1a2e" stroke-width="4"/>
    `,
  },
  {
    filename: "history.png",
    bgFrom: "#b8dcfa",
    bgTo: "#59b0f7",
    accent: "#1a1a2e",
    shadow: "rgba(89,176,247,0.4)",
    content: `
      <rect x="86" y="82" width="84" height="108" rx="12" fill="#fffdf1" stroke="#1a1a2e" stroke-width="6"/>
      <path d="M104 108 H152" stroke="#fb64d0" stroke-width="6" stroke-linecap="round"/>
      <path d="M104 128 H152" stroke="#1a1a2e" stroke-width="5" stroke-linecap="round" opacity="0.35"/>
      <path d="M104 148 H136" stroke="#1a1a2e" stroke-width="5" stroke-linecap="round" opacity="0.35"/>
      <circle cx="128" cy="72" r="10" fill="#e2ef5f" stroke="#1a1a2e" stroke-width="4"/>
    `,
  },
  {
    filename: "mixed.png",
    bgFrom: "#feccef",
    bgTo: "#fb64d0",
    accent: "#1a1a2e",
    shadow: "rgba(251,100,208,0.4)",
    content: `
      <rect x="88" y="88" width="80" height="80" rx="18" fill="#fffdf1" stroke="#1a1a2e" stroke-width="6" transform="rotate(12 128 128)"/>
      <circle cx="104" cy="104" r="8" fill="#59b0f7" stroke="#1a1a2e" stroke-width="3"/>
      <circle cx="152" cy="104" r="8" fill="#e2ef5f" stroke="#1a1a2e" stroke-width="3"/>
      <circle cx="104" cy="152" r="8" fill="#fb64d0" stroke="#1a1a2e" stroke-width="3"/>
      <circle cx="152" cy="152" r="8" fill="#59b0f7" stroke="#1a1a2e" stroke-width="3"/>
      <circle cx="128" cy="128" r="8" fill="#e2ef5f" stroke="#1a1a2e" stroke-width="3"/>
    `,
  },
  {
    filename: "fast-rounds.png",
    bgFrom: "#f0f7b8",
    bgTo: "#e2ef5f",
    accent: "#1a1a2e",
    shadow: "rgba(226,239,95,0.45)",
    content: `
      <path d="M128 78 L148 138 H108 Z" fill="#fb64d0" stroke="#1a1a2e" stroke-width="6" stroke-linejoin="round"/>
      <rect x="118" y="138" width="20" height="34" rx="8" fill="#59b0f7" stroke="#1a1a2e" stroke-width="5"/>
      <path d="M164 92 L178 78" stroke="#fffdf1" stroke-width="8" stroke-linecap="round"/>
      <path d="M178 92 L164 78" stroke="#fffdf1" stroke-width="8" stroke-linecap="round"/>
    `,
  },
  {
    filename: "score-big.png",
    bgFrom: "#feccef",
    bgTo: "#fb64d0",
    accent: "#1a1a2e",
    shadow: "rgba(251,100,208,0.4)",
    content: `
      <path d="M98 168 L108 118 L128 148 L148 108 L158 168 Z" fill="#e2ef5f" stroke="#1a1a2e" stroke-width="6" stroke-linejoin="round"/>
      <rect x="108" y="82" width="40" height="24" rx="8" fill="#59b0f7" stroke="#1a1a2e" stroke-width="5"/>
      <circle cx="128" cy="94" r="6" fill="#fffdf1"/>
    `,
  },
  {
    filename: "party-ready.png",
    bgFrom: "#b8dcfa",
    bgTo: "#59b0f7",
    accent: "#1a1a2e",
    shadow: "rgba(89,176,247,0.4)",
    content: `
      <path d="M88 168 L108 92 L128 132 L148 88 L168 168 Z" fill="#fb64d0" stroke="#1a1a2e" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="92" cy="92" r="8" fill="#e2ef5f" stroke="#1a1a2e" stroke-width="4"/>
      <circle cx="164" cy="92" r="8" fill="#e2ef5f" stroke="#1a1a2e" stroke-width="4"/>
      <rect x="118" y="168" width="20" height="16" rx="6" fill="#fffdf1" stroke="#1a1a2e" stroke-width="4"/>
    `,
  },
];

function buildSvg(icon) {
  return `
    <svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${icon.bgFrom}"/>
          <stop offset="100%" stop-color="${icon.bgTo}"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="${icon.shadow}"/>
        </filter>
      </defs>
      <rect x="24" y="24" width="208" height="208" rx="52" fill="url(#bg)" filter="url(#shadow)"/>
      <rect x="36" y="36" width="184" height="92" rx="40" fill="white" opacity="0.22"/>
      <g>${icon.content}</g>
    </svg>
  `;
}

async function generateIcons() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  await Promise.all(
    icons.map(async (icon) => {
      const svg = buildSvg(icon);
      const outputPath = path.join(OUTPUT_DIR, icon.filename);

      await sharp(Buffer.from(svg)).png().toFile(outputPath);
      console.log(`Created ${icon.filename}`);
    }),
  );
}

generateIcons().catch((error) => {
  console.error(error);
  process.exit(1);
});
