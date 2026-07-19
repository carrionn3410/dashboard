"use client";

import { useEffect } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function PwaRegister() {
  useEffect(() => {
    // Jamais en dev : le cache du service worker entre en conflit avec le
    // rechargement à chaud de Next.js (JS mis en cache != bundle recompilé).
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register(`${basePath}/sw.js`).catch(() => {
        /* échec silencieux — l'app reste utilisable sans mode hors ligne */
      });
    }
  }, []);

  return null;
}
