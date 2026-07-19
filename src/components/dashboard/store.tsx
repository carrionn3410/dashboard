"use client";

// Store du dashboard personnel — persistance localStorage, zéro backend.
// Au premier chargement d'un nouveau jour : les tâches cochées sont
// archivées dans le compteur, les cases se décochent, le chrono repart.
// L'historique des habitudes est conservé par date (streaks, stats).

import * as React from "react";

export interface Task {
  id: string;
  label: string;
  done: boolean;
}

export interface Project {
  id: string;
  name: string;
  progress: number; // 0-100
  nextAction: string;
  due: string;
  color: string; // var CSS du thème
}

export interface InboxItem {
  id: string;
  text: string;
  at: string;
}

export interface PlanItem {
  id: string;
  text: string;
  bucket: "today" | "tomorrow" | "week";
  done: boolean;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  history: Record<string, boolean>; // clé = date ISO (YYYY-MM-DD)
}

export type JobCategory = "restauration" | "autres";
export type JobStatus = "a_postuler" | "postule" | "entretien" | "refuse";

export interface JobOffer {
  id: string;
  title: string;
  category: JobCategory;
  status: JobStatus;
  url?: string;
  addedAt: string;
}

export interface ZenState {
  version: 1;
  name: string;
  company: string;
  objective: string;
  focus: string;
  tasks: Task[];
  projects: Project[];
  inbox: InboxItem[];
  notes: string;
  planning: PlanItem[];
  habits: Habit[];
  jobs: JobOffer[];
  tasksCompletedTotal: number;
  goalsReached: number;
  workSeconds: Record<string, number>; // par date
  lastOpened: string;
}

export const todayKey = () => new Date().toISOString().slice(0, 10);

const uid = () => Math.random().toString(36).slice(2, 9);

const DEFAULT_STATE: ZenState = {
  version: 1,
  name: "",
  company: "",
  objective: "",
  focus: "",
  tasks: [
    { id: uid(), label: "Ta priorité n°1", done: false },
    { id: uid(), label: "Ta priorité n°2", done: false },
    { id: uid(), label: "Ta priorité n°3", done: false },
  ],
  projects: [
    { id: uid(), name: "Nouveau projet 1", progress: 0, nextAction: "Définir la prochaine action", due: "date", color: "var(--z-turquoise)" },
    { id: uid(), name: "Nouveau projet 2", progress: 0, nextAction: "Définir la prochaine action", due: "date", color: "var(--z-ocean)" },
    { id: uid(), name: "Nouveau projet 3", progress: 0, nextAction: "Définir la prochaine action", due: "date", color: "var(--z-salmon)" },
  ],
  inbox: [],
  notes: "",
  planning: [],
  habits: [
    { id: uid(), name: "Sport", emoji: "🏃", history: {} },
    { id: uid(), name: "Lecture", emoji: "📖", history: {} },
    { id: uid(), name: "Travail profond", emoji: "🧠", history: {} },
    { id: uid(), name: "Création", emoji: "🎨", history: {} },
    { id: uid(), name: "Hydratation", emoji: "💧", history: {} },
    { id: uid(), name: "Sommeil", emoji: "😴", history: {} },
    { id: uid(), name: "Méditation", emoji: "🧘", history: {} },
  ],
  jobs: [],
  tasksCompletedTotal: 0,
  goalsReached: 0,
  workSeconds: {},
  lastOpened: todayKey(),
};

const STORAGE_KEY = "zen-dashboard-v1";

function rollover(state: ZenState): ZenState {
  const today = todayKey();
  if (state.lastOpened === today) return state;
  // Nouveau jour : archiver et repartir propre
  const doneCount = state.tasks.filter((t) => t.done).length;
  return {
    ...state,
    tasksCompletedTotal: state.tasksCompletedTotal + doneCount,
    goalsReached: state.goalsReached + (doneCount === state.tasks.length && state.tasks.length > 0 ? 1 : 0),
    tasks: state.tasks.map((t) => ({ ...t, done: false })),
    planning: state.planning.filter((p) => !(p.bucket === "today" && p.done)),
    lastOpened: today,
  };
}

type Ctx = {
  state: ZenState;
  set: React.Dispatch<React.SetStateAction<ZenState>>;
  ready: boolean;
  uid: () => string;
};

const ZenContext = React.createContext<Ctx | null>(null);

export function ZenProvider({ children }: { children: React.ReactNode }) {
  const [state, set] = React.useState<ZenState>(DEFAULT_STATE);
  const [ready, setReady] = React.useState(false);

  // Chargement + rollover
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) set(rollover({ ...DEFAULT_STATE, ...JSON.parse(raw) }));
    } catch {
      /* état par défaut */
    }
    setReady(true);
  }, []);

  // Sauvegarde automatique (débouncée)
  React.useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* stockage plein — silencieux */
      }
    }, 300);
    return () => clearTimeout(t);
  }, [state, ready]);

  return <ZenContext.Provider value={{ state, set, ready, uid }}>{children}</ZenContext.Provider>;
}

export function useZen() {
  const ctx = React.useContext(ZenContext);
  if (!ctx) throw new Error("useZen doit être utilisé dans <ZenProvider>");
  return ctx;
}

// Streak : jours consécutifs (en remontant depuis aujourd'hui) avec
// au moins une habitude validée.
export function computeStreak(habits: Habit[]): number {
  let streak = 0;
  const d = new Date();
  const today = todayKey();
  for (let i = 0; i < 3650; i++) {
    const key = d.toISOString().slice(0, 10);
    const validated = habits.some((h) => h.history[key]);
    if (validated) streak += 1;
    else if (key !== today) break; // un jour passé sans habitude casse la série ;
    // aujourd'hui pas encore validé ne la casse pas
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
