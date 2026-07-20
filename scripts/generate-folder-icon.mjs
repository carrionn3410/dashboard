// Génère l'icône du dossier Finder "Dashboard" à partir du même design
// que l'icône PWA (soleil cerclé d'encre sur ciel crépuscule) — pour que
// le dossier sur le Bureau soit immédiatement reconnaissable.
//
// Usage : node scripts/generate-folder-icon.mjs
// Produit un .icns multi-résolutions dans scripts/.tmp-iconset/

import sharp from "sharp";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(scriptDir, "..");
const iconsetDir = path.join(scriptDir, ".tmp-iconset", "Dashboard.iconset");

// Même design que scripts/generate-icons.mjs, avec un peu de marge autour
// (les icônes de dossier Finder sont vues petites — éviter que le disque
// touche les bords rend le rendu plus net dans le Dock/Finder).
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#241249"/>
      <stop offset="42%" stop-color="#7a2a86"/>
      <stop offset="72%" stop-color="#e8368f"/>
      <stop offset="100%" stop-color="#ffb14a"/>
    </linearGradient>
  </defs>
  <rect x="16" y="16" width="480" height="480" rx="96" fill="url(#sky)"/>
  <clipPath id="clip"><rect x="16" y="16" width="480" height="480" rx="96"/></clipPath>
  <g clip-path="url(#clip)">
    <rect x="16" y="360" width="480" height="136" fill="#12a6a0"/>
    <rect x="16" y="416" width="480" height="80" fill="#0c7d7a"/>
    <circle cx="256" cy="300" r="110" fill="#ffce3a" stroke="#16121f" stroke-width="7"/>
    <g opacity="0.92">
      <rect x="190" y="368" width="132" height="10" rx="5" fill="#ffe9b0"/>
      <rect x="204" y="387" width="104" height="9" rx="4.5" fill="#ffe9b0" opacity="0.85"/>
      <rect x="218" y="404" width="76" height="8" rx="4" fill="#ffe9b0" opacity="0.7"/>
    </g>
  </g>
</svg>`;

async function main() {
  await rm(path.dirname(iconsetDir), { recursive: true, force: true });
  await mkdir(iconsetDir, { recursive: true });

  // Convention iconutil : icon_<pt>x<pt>.png et icon_<pt>x<pt>@2x.png
  const entries = [
    [16, "icon_16x16.png"],
    [32, "icon_16x16@2x.png"],
    [32, "icon_32x32.png"],
    [64, "icon_32x32@2x.png"],
    [128, "icon_128x128.png"],
    [256, "icon_128x128@2x.png"],
    [256, "icon_256x256.png"],
    [512, "icon_256x256@2x.png"],
    [512, "icon_512x512.png"],
    [1024, "icon_512x512@2x.png"],
  ];

  for (const [size, name] of entries) {
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(iconsetDir, name));
  }
  console.log("✓ iconset généré :", path.relative(projectRoot, iconsetDir));
}

main();
