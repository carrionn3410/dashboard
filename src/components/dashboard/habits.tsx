"use client";

// 🔥 Habitudes (validation du jour + 7 derniers jours) et 📊 Statistiques.

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock3, Flame, Trophy } from "lucide-react";
import { computeStreak, todayKey, useZen } from "./store";
import { SectionTitle, ZenCard } from "./bits";

function lastNDays(n: number): string[] {
  const days: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(d);
    x.setDate(d.getDate() - i);
    days.push(x.toISOString().slice(0, 10));
  }
  return days;
}

export function HabitsCard() {
  const { state, set } = useZen();
  const today = todayKey();
  const week = lastNDays(7);

  const toggle = (id: string) =>
    set((s) => ({
      ...s,
      habits: s.habits.map((h) =>
        h.id === id ? { ...h, history: { ...h.history, [today]: !h.history[today] } } : h
      ),
    }));

  const doneToday = state.habits.filter((h) => h.history[today]).length;

  return (
    <ZenCard delay={0.35}>
      <SectionTitle emoji="🔥" hint={`${doneToday}/${state.habits.length} aujourd'hui`}>
        Habitudes
      </SectionTitle>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {state.habits.map((h) => {
          const done = !!h.history[today];
          return (
            <motion.button
              key={h.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggle(h.id)}
              className="flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition-colors duration-150"
              style={{
                borderColor: done ? "var(--z-turquoise)" : "var(--z-line)",
                background: done ? "color-mix(in srgb, var(--z-turquoise) 14%, transparent)" : "transparent",
              }}
              aria-pressed={done}
            >
              <span className="flex items-center gap-2 text-sm" style={{ color: "var(--z-ink)" }}>
                <span>{h.emoji}</span>
                {h.name}
              </span>
              {/* 7 derniers jours */}
              <span className="flex items-center gap-1">
                {week.map((day) => (
                  <span
                    key={day}
                    className="h-1.5 w-1.5 rounded-full transition-colors duration-150"
                    style={{
                      background: h.history[day] ? "var(--z-turquoise)" : "var(--z-line)",
                    }}
                  />
                ))}
              </span>
            </motion.button>
          );
        })}
      </div>
    </ZenCard>
  );
}

export function StatsCard() {
  const { state } = useZen();
  const today = todayKey();

  const doneToday = state.tasks.filter((t) => t.done).length;
  const streak = computeStreak(state.habits);
  const seconds = state.workSeconds[today] ?? 0;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  const stats = [
    {
      icon: CheckCircle2,
      label: "Tâches terminées",
      value: `${state.tasksCompletedTotal + doneToday}`,
      sub: `dont ${doneToday} aujourd'hui`,
      color: "var(--z-turquoise)",
    },
    {
      icon: Flame,
      label: "Streak",
      value: `${streak} j`,
      sub: streak > 0 ? "continue comme ça" : "valide une habitude",
      color: "var(--z-sunset)",
    },
    {
      icon: Clock3,
      label: "Temps de travail",
      value: h > 0 ? `${h} h ${m.toString().padStart(2, "0")}` : `${m} min`,
      sub: "travail profond du jour",
      color: "var(--z-ocean)",
    },
    {
      icon: Trophy,
      label: "Objectifs atteints",
      value: `${state.goalsReached}`,
      sub: "journées 3/3 complètes",
      color: "var(--z-salmon)",
    },
  ];

  return (
    <ZenCard delay={0.4}>
      <SectionTitle emoji="📊">Statistiques</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border p-3" style={{ borderColor: "var(--z-line)" }}>
            <s.icon className="h-4 w-4" style={{ color: s.color }} />
            <p className="mt-1.5 text-xl font-semibold tabular-nums" style={{ color: "var(--z-ink)" }}>
              {s.value}
            </p>
            <p className="text-[11px] font-medium" style={{ color: "var(--z-ink-soft)" }}>
              {s.label}
            </p>
            <p className="text-[10px]" style={{ color: "var(--z-ink-faint)" }}>
              {s.sub}
            </p>
          </div>
        ))}
      </div>
    </ZenCard>
  );
}
