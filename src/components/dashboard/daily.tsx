"use client";

// 🎯 Focus (avec chrono de travail profond) et ✅ les 3 tâches essentielles.

import * as React from "react";
import { Pause, Play } from "lucide-react";
import { useZen, todayKey } from "./store";
import { Editable, SectionTitle, ZenCard, ZenCheck } from "./bits";

export function FocusCard() {
  const { state, set } = useZen();
  const [running, setRunning] = React.useState(false);

  // Chrono : incrémente le temps de travail du jour, seconde par seconde.
  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      set((s) => ({
        ...s,
        workSeconds: { ...s.workSeconds, [todayKey()]: (s.workSeconds[todayKey()] ?? 0) + 1 },
      }));
    }, 1000);
    return () => clearInterval(t);
  }, [running, set]);

  const seconds = state.workSeconds[todayKey()] ?? 0;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  return (
    <ZenCard delay={0.05}>
      <SectionTitle emoji="🎯" hint="une seule mission">
        Focus
      </SectionTitle>
      <Editable
        value={state.focus}
        onChange={(v) => set((s) => ({ ...s, focus: v }))}
        className="text-base font-medium"
        placeholder="Ta mission principale…"
      />
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform duration-150 hover:scale-105"
          style={{ background: running ? "var(--z-salmon)" : "var(--z-turquoise)" }}
          aria-label={running ? "Mettre en pause" : "Démarrer le travail profond"}
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 pl-0.5" />}
        </button>
        <div>
          <p className="text-sm font-semibold tabular-nums" style={{ color: "var(--z-ink)" }}>
            {h > 0 ? `${h} h ${m.toString().padStart(2, "0")}` : `${m} min`}
          </p>
          <p className="text-[11px]" style={{ color: "var(--z-ink-faint)" }}>
            {running ? "travail profond en cours…" : "de travail profond aujourd'hui"}
          </p>
        </div>
      </div>
    </ZenCard>
  );
}

export function TasksCard() {
  const { state, set } = useZen();

  const toggle = (id: string) =>
    set((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));

  const rename = (id: string, label: string) =>
    set((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, label } : t)),
    }));

  const doneCount = state.tasks.filter((t) => t.done).length;

  return (
    <ZenCard delay={0.1}>
      <SectionTitle emoji="✅" hint={`${doneCount}/${state.tasks.length} · touches 1-3`}>
        Les 3 essentielles
      </SectionTitle>
      <div className="space-y-0.5">
        {state.tasks.map((t) => (
          <div key={t.id} className="flex items-center">
            <ZenCheck
              checked={t.done}
              onToggle={() => toggle(t.id)}
              label={
                <Editable
                  value={t.label}
                  onChange={(v) => rename(t.id, v)}
                  className="inline text-sm"
                />
              }
              strike
            />
          </div>
        ))}
      </div>
    </ZenCard>
  );
}
