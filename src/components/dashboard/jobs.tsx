"use client";

// 🔎 Recherche d'emploi — deux colonnes : offres restauration / autres offres.
// Capture rapide façon Inbox, statut cyclique en un clic (à postuler →
// postulé → entretien → refusé), lien optionnel vers l'annonce.

import * as React from "react";
import { ExternalLink, X } from "lucide-react";
import { useZen, type JobCategory, type JobStatus } from "./store";
import { SectionTitle, ZenCard } from "./bits";

const STATUS_CYCLE: JobStatus[] = ["a_postuler", "postule", "entretien", "refuse"];

const STATUS_META: Record<JobStatus, { label: string; color: string }> = {
  a_postuler: { label: "À postuler", color: "var(--z-ink-faint)" },
  postule: { label: "Postulé", color: "var(--z-ocean)" },
  entretien: { label: "Entretien", color: "var(--z-sunset)" },
  refuse: { label: "Refusé", color: "var(--z-salmon)" },
};

function isUrl(text: string) {
  return /^https?:\/\//i.test(text.trim());
}

function JobColumn({ category, label }: { category: JobCategory; label: string }) {
  const { state, set, uid } = useZen();
  const [text, setText] = React.useState("");

  const jobs = state.jobs.filter((j) => j.category === category);

  const add = () => {
    const t = text.trim();
    if (!t) return;
    set((s) => ({
      ...s,
      jobs: [
        { id: uid(), title: t, category, status: "a_postuler", addedAt: new Date().toISOString() },
        ...s.jobs,
      ],
    }));
    setText("");
  };

  const cycleStatus = (id: string) =>
    set((s) => ({
      ...s,
      jobs: s.jobs.map((j) => {
        if (j.id !== id) return j;
        const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(j.status) + 1) % STATUS_CYCLE.length];
        return { ...j, status: next };
      }),
    }));

  const remove = (id: string) => set((s) => ({ ...s, jobs: s.jobs.filter((j) => j.id !== id) }));

  return (
    <div className="min-w-0 flex-1">
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest" style={{ color: "var(--z-ink-faint)" }}>
        {label} · {jobs.length}
      </p>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && add()}
        placeholder="Titre · entreprise, ou lien de l'annonce…"
        className="mb-2 w-full rounded-lg border px-2.5 py-1.5 text-sm"
        style={{ background: "var(--z-surface-strong)", borderColor: "var(--z-line)", color: "var(--z-ink)" }}
      />
      <div className="space-y-1">
        {jobs.map((j) => {
          const meta = STATUS_META[j.status];
          const link = isUrl(j.title) ? j.title : undefined;
          return (
            <div
              key={j.id}
              className="group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-black/[0.04]"
            >
              <button
                onClick={() => cycleStatus(j.id)}
                className="min-w-0 flex-1 text-left"
                title="Cliquer pour changer le statut"
              >
                <span className="flex items-center gap-1.5 truncate text-sm" style={{ color: "var(--z-ink)" }}>
                  {link && <ExternalLink className="h-3 w-3 shrink-0" style={{ color: "var(--z-ink-faint)" }} />}
                  <span className="truncate">{link ?? j.title}</span>
                </span>
                <span className="text-[11px] font-medium" style={{ color: meta.color }}>
                  {meta.label}
                </span>
              </button>
              <button
                onClick={() => remove(j.id)}
                className="shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                aria-label="Supprimer l'offre"
              >
                <X className="h-3.5 w-3.5" style={{ color: "var(--z-ink-faint)" }} />
              </button>
            </div>
          );
        })}
        {jobs.length === 0 && (
          <p className="px-2 py-1 text-xs" style={{ color: "var(--z-ink-faint)" }}>
            Aucune offre pour l&apos;instant
          </p>
        )}
      </div>
    </div>
  );
}

export function JobSearchCard() {
  return (
    <ZenCard delay={0.32}>
      <SectionTitle emoji="🔎" hint="clic = changer le statut">
        Recherche d&apos;emploi
      </SectionTitle>
      <div className="flex flex-col gap-5 sm:flex-row">
        <JobColumn category="restauration" label="Offres restauration" />
        <JobColumn category="autres" label="Autres offres" />
      </div>
    </ZenCard>
  );
}
