/** @type {import('next').NextConfig} */

// NEXT_PUBLIC_BASE_PATH n'est défini que pour le build GitHub Pages
// (npm run build:pages) — en dev local (npm run dev) et en build normal,
// l'app reste servie à la racine http://localhost:3000/.
// Préfixé NEXT_PUBLIC_ pour rester lisible aussi côté client (service worker).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  ...(basePath && {
    output: "export",
    basePath,
    assetPrefix: `${basePath}/`,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
