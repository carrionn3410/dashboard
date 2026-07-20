"use client";

// 🌍 Actualités — sélection quotidienne des news les plus importantes,
// priorité géopolitique. Alimenté par la tâche planifiée (data/news.json),
// lecture seule, sobre — pas de ticker, pas de défilement automatique.

import * as React from "react";
import { ExternalLink } from "lucide-react";
import { SectionTitle, ZenCard } from "./bits";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

interface NewsItem {
  title: string;
  source: string;
  url: string;
  summary: string;
}

interface NewsFeed {
  updatedAt: string;
  items: NewsItem[];
}

export function NewsCard() {
  const [feed, setFeed] = React.useState<NewsFeed | null>(null);

  React.useEffect(() => {
    fetch(`${basePath}/data/news.json`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setFeed)
      .catch(() => {});
  }, []);

  const updated = feed
    ? new Date(feed.updatedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
    : "";

  return (
    <ZenCard delay={0.44}>
      <SectionTitle emoji="🌍" hint={feed ? `mis à jour le ${updated}` : undefined}>
        Actualités
      </SectionTitle>
      {!feed && (
        <p className="text-sm" style={{ color: "var(--z-ink-faint)" }}>
          Pas encore de résumé disponible — nécessite une connexion.
        </p>
      )}
      <div className="space-y-3">
        {feed?.items.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-black/[0.04]"
          >
            <p className="flex items-start gap-1.5 text-sm font-medium" style={{ color: "var(--z-ink)" }}>
              <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" style={{ color: "var(--z-ink-faint)" }} />
              <span>{item.title}</span>
            </p>
            <p className="ml-[18px] text-xs" style={{ color: "var(--z-ink-soft)" }}>
              {item.summary}
            </p>
            <p className="ml-[18px] text-[11px] uppercase tracking-wide" style={{ color: "var(--z-ink-faint)" }}>
              {item.source}
            </p>
          </a>
        ))}
      </div>
    </ZenCard>
  );
}
