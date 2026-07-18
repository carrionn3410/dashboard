"use client";

// 📂 Projets — progression, prochaine action, échéance, couleur.

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { useZen } from "./store";
import { Editable, SectionTitle, ZenCard } from "./bits";

export function ProjectsCard() {
  const { state, set } = useZen();

  const patch = (id: string, p: Partial<(typeof state.projects)[number]>) =>
    set((s) => ({
      ...s,
      projects: s.projects.map((x) => (x.id === id ? { ...x, ...p } : x)),
    }));

  return (
    <ZenCard delay={0.15}>
      <SectionTitle emoji="📂" hint="+/− pour la progression">
        Mes projets
      </SectionTitle>
      <div className="space-y-4">
        {state.projects.map((p) => (
          <div key={p.id}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.color }} />
                <Editable
                  value={p.name}
                  onChange={(v) => patch(p.id, { name: v })}
                  className="truncate text-sm font-semibold"
                />
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => patch(p.id, { progress: Math.max(0, p.progress - 5) })}
                  className="rounded-full p-1 transition-colors duration-150 hover:bg-black/[0.06]"
                  aria-label="Réduire la progression"
                >
                  <Minus className="h-3 w-3" style={{ color: "var(--z-ink-faint)" }} />
                </button>
                <span className="w-9 text-center text-xs font-semibold tabular-nums" style={{ color: "var(--z-ink-soft)" }}>
                  {p.progress} %
                </span>
                <button
                  onClick={() => patch(p.id, { progress: Math.min(100, p.progress + 5) })}
                  className="rounded-full p-1 transition-colors duration-150 hover:bg-black/[0.06]"
                  aria-label="Augmenter la progression"
                >
                  <Plus className="h-3 w-3" style={{ color: "var(--z-ink-faint)" }} />
                </button>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--z-line)" }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${p.progress}%`, background: p.color }}
              />
            </div>

            <div className="mt-1.5 flex items-center justify-between gap-2 text-xs" style={{ color: "var(--z-ink-soft)" }}>
              <span className="flex min-w-0 items-center gap-1">
                <span style={{ color: "var(--z-ink-faint)" }}>→</span>
                <Editable
                  value={p.nextAction}
                  onChange={(v) => patch(p.id, { nextAction: v })}
                  className="truncate text-xs"
                  placeholder="Prochaine action…"
                />
              </span>
              <Editable
                value={p.due}
                onChange={(v) => patch(p.id, { due: v })}
                className="w-14 shrink-0 text-right text-xs"
                placeholder="échéance"
              />
            </div>
          </div>
        ))}
      </div>
    </ZenCard>
  );
}
