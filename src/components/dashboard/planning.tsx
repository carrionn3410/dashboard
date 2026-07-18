"use client";

// 📅 Planning — aujourd'hui / demain / cette semaine.

import * as React from "react";
import { Plus } from "lucide-react";
import { useZen, type PlanItem } from "./store";
import { SectionTitle, ZenCard, ZenCheck } from "./bits";

const BUCKETS: { id: PlanItem["bucket"]; label: string }[] = [
  { id: "today", label: "Aujourd'hui" },
  { id: "tomorrow", label: "Demain" },
  { id: "week", label: "Cette semaine" },
];

function Bucket({ bucket, label }: { bucket: PlanItem["bucket"]; label: string }) {
  const { state, set, uid } = useZen();
  const [adding, setAdding] = React.useState(false);
  const [text, setText] = React.useState("");

  const items = state.planning.filter((p) => p.bucket === bucket);

  const add = () => {
    const t = text.trim();
    if (t) {
      set((s) => ({ ...s, planning: [...s.planning, { id: uid(), text: t, bucket, done: false }] }));
    }
    setText("");
    setAdding(false);
  };

  const toggle = (id: string) =>
    set((s) => ({
      ...s,
      planning: s.planning.map((p) => (p.id === id ? { ...p, done: !p.done } : p)),
    }));

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-widest" style={{ color: "var(--z-ink-faint)" }}>
          {label}
        </p>
        <button
          onClick={() => setAdding(true)}
          className="rounded-full p-0.5 transition-colors duration-150 hover:bg-black/[0.06]"
          aria-label={`Ajouter à ${label}`}
        >
          <Plus className="h-3.5 w-3.5" style={{ color: "var(--z-ink-faint)" }} />
        </button>
      </div>
      {items.map((p) => (
        <ZenCheck key={p.id} checked={p.done} onToggle={() => toggle(p.id)} label={p.text} />
      ))}
      {adding && (
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          onBlur={add}
          placeholder="…"
          className="mt-1 w-full rounded-lg border px-2 py-1 text-sm"
          style={{
            background: "var(--z-surface-strong)",
            borderColor: "var(--z-line)",
            color: "var(--z-ink)",
          }}
        />
      )}
      {items.length === 0 && !adding && (
        <p className="px-2 py-1 text-xs" style={{ color: "var(--z-ink-faint)" }}>
          Rien de prévu
        </p>
      )}
    </div>
  );
}

export function PlanningCard() {
  return (
    <ZenCard delay={0.3}>
      <SectionTitle emoji="📅">Planning</SectionTitle>
      <div className="flex flex-col gap-4 sm:flex-row">
        {BUCKETS.map((b) => (
          <Bucket key={b.id} bucket={b.id} label={b.label} />
        ))}
      </div>
    </ZenCard>
  );
}
