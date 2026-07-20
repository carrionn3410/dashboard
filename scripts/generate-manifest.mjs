// Génère public/manifest.json avec des chemins corrects selon le
// déploiement (racine en dev, /dashboard sur GitHub Pages).
//
// Remplace l'ancienne route dynamique src/app/manifest.ts : celle-ci
// générait bien le fichier au bon endroit, mais le <link rel="manifest">
// que Next injecte automatiquement dans le <head> ne reprenait PAS le
// basePath (contrairement à icon.png/apple-icon.png, qui eux sont
// corrects) — sur GitHub Pages, le lien pointait donc vers une URL
// inexistante (404), invisible pour PWABuilder et pour l'invite
// d'installation native de Chrome/Edge. Un fichier statique + un lien
// écrit à la main dans layout.tsx (avec le même basePath) évite ce bug.
//
// Usage : node scripts/generate-manifest.mjs  (appelé avant dev/build)

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(scriptDir, "..");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const manifest = {
  id: `${basePath}/`,
  name: "Dashboard — pilotage quotidien",
  short_name: "Dashboard",
  description:
    "Priorités du jour, projets, idées, planning et habitudes — un espace de pilotage personnel, esthétique city-pop vintage.",
  start_url: `${basePath}/`,
  scope: `${basePath}/`,
  display: "standalone",
  orientation: "portrait-primary",
  background_color: "#241249",
  theme_color: "#241249",
  lang: "fr",
  icons: [
    { src: `${basePath}/icons/icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
    { src: `${basePath}/icons/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
    {
      src: `${basePath}/icons/icon-maskable-512.png`,
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
};

const outPath = path.join(projectRoot, "public/manifest.json");
await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, JSON.stringify(manifest, null, 2));
console.log("✓ public/manifest.json généré — basePath :", basePath || "(racine)");
