/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export statique pour héberger sur GitHub Pages (repo "dashboard" →
  // servi sous /dashboard/). Sans backend : tout l'état vit déjà en
  // localStorage côté client, donc l'export statique fonctionne tel quel.
  output: "export",
  basePath: "/dashboard",
  assetPrefix: "/dashboard/",
  images: { unoptimized: true },
};

export default nextConfig;
