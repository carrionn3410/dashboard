// Génère les icônes PWA à partir d'un design SVG unique (esthétique
// "vintage 80" du dashboard : ciel crépuscule, soleil cerclé d'encre,
// reflet sur la mer). À relancer si le design de l'icône change :
//   node scripts/generate-icons.mjs

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(scriptDir, "..");

// design plein cadre (favicon, icônes standard) — le soleil touche les bords
const fullBleedIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#241249"/>
      <stop offset="42%" stop-color="#7a2a86"/>
      <stop offset="72%" stop-color="#e8368f"/>
      <stop offset="100%" stop-color="#ffb14a"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#sky)"/>
  <rect x="0" y="352" width="512" height="160" fill="#12a6a0"/>
  <rect x="0" y="416" width="512" height="96" fill="#0c7d7a"/>
  <circle cx="256" cy="296" r="122" fill="#ffce3a" stroke="#16121f" stroke-width="7"/>
  <g opacity="0.92">
    <rect x="182" y="372" width="148" height="11" rx="5.5" fill="#ffe9b0"/>
    <rect x="198" y="393" width="116" height="10" rx="5" fill="#ffe9b0" opacity="0.85"/>
    <rect x="214" y="412" width="84" height="9" rx="4.5" fill="#ffe9b0" opacity="0.7"/>
  </g>
</svg>`;

// design "maskable" — contenu resserré dans la zone de sécurité (80 % centré)
// pour ne pas être coupé par le masque circulaire/arrondi d'Android
const maskableIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#241249"/>
      <stop offset="42%" stop-color="#7a2a86"/>
      <stop offset="72%" stop-color="#e8368f"/>
      <stop offset="100%" stop-color="#ffb14a"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#sky)"/>
  <rect x="0" y="368" width="512" height="144" fill="#12a6a0"/>
  <rect x="0" y="422" width="512" height="90" fill="#0c7d7a"/>
  <circle cx="256" cy="300" r="92" fill="#ffce3a" stroke="#16121f" stroke-width="6"/>
  <g opacity="0.92">
    <rect x="202" y="360" width="108" height="9" rx="4.5" fill="#ffe9b0"/>
    <rect x="214" y="378" width="84" height="8" rx="4" fill="#ffe9b0" opacity="0.85"/>
  </g>
</svg>`;

async function render(svg, size, outFile) {
  await mkdir(path.dirname(outFile), { recursive: true });
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outFile);
  console.log("✓", path.relative(projectRoot, outFile));
}

async function main() {
  await render(fullBleedIcon, 512, path.join(projectRoot, "src/app/icon.png"));
  await render(fullBleedIcon, 180, path.join(projectRoot, "src/app/apple-icon.png"));
  await render(fullBleedIcon, 192, path.join(projectRoot, "public/icons/icon-192.png"));
  await render(fullBleedIcon, 512, path.join(projectRoot, "public/icons/icon-512.png"));
  await render(maskableIcon, 512, path.join(projectRoot, "public/icons/icon-maskable-512.png"));
}

main();
