import type { MetadataRoute } from "next";

// Manifeste PWA — dynamique pour que les chemins d'icônes/scope restent
// corrects que l'app soit servie à la racine (dev local) ou sous /dashboard
// (build GitHub Pages, voir next.config.mjs).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function manifest(): MetadataRoute.Manifest {
  return {
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
}
