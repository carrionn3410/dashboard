"use client";

// Sidebar très discrète : un rail d'icônes qui défile en douceur
// vers chaque section. Masquée sur mobile (tout est déjà vertical).

import { BarChart3, Briefcase, Calendar, Flame, FolderOpen, Globe2, Home, Lightbulb } from "lucide-react";

const LINKS = [
  { id: "zen-top", icon: Home, label: "Accueil" },
  { id: "zen-projects", icon: FolderOpen, label: "Projets" },
  { id: "zen-inbox", icon: Lightbulb, label: "Inbox" },
  { id: "zen-planning", icon: Calendar, label: "Planning" },
  { id: "zen-jobs", icon: Briefcase, label: "Recherche d'emploi" },
  { id: "zen-habits", icon: Flame, label: "Habitudes" },
  { id: "zen-stats", icon: BarChart3, label: "Statistiques" },
  { id: "zen-news", icon: Globe2, label: "Actualités" },
];

export function ZenSidebar() {
  return (
    <nav
      aria-label="Navigation du dashboard"
      className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 rounded-full p-1.5 lg:flex"
      style={{ background: "var(--z-surface)", border: "1px solid var(--z-line)", backdropFilter: "blur(14px)" }}
    >
      {LINKS.map((l) => (
        <button
          key={l.id}
          onClick={() => document.getElementById(l.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          title={l.label}
          aria-label={l.label}
          className="rounded-full p-2 transition-colors duration-150 hover:bg-black/[0.06]"
          style={{ color: "var(--z-ink-soft)" }}
        >
          <l.icon className="h-4 w-4" />
        </button>
      ))}
    </nav>
  );
}
