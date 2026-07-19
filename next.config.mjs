/** @type {import('next').NextConfig} */

// basePath/export ne s'appliquent QUE pour le build GitHub Pages
// (npm run build:pages) — en dev local (npm run dev) et en build normal,
// l'app reste servie à la racine http://localhost:3000/.
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  ...(isGithubPages && {
    output: "export",
    basePath: "/dashboard",
    assetPrefix: "/dashboard/",
    images: { unoptimized: true },
  }),
};

export default nextConfig;
