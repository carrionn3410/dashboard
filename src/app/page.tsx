"use client";

// Dashboard personnel "Zen" — pilotage quotidien, esthétique city-pop 80s.
// Raccourcis : i = capturer une idée · n = notes · 1/2/3 = cocher une tâche
// t = changer d'ambiance. Tout est persisté en localStorage.

import * as React from "react";
import { ZenProvider, useZen } from "@/components/dashboard/store";
import { Scene, momentFromHour, type ZenMoment } from "@/components/dashboard/scene";
import { ZenSidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { FocusCard, TasksCard } from "@/components/dashboard/daily";
import { ProjectsCard } from "@/components/dashboard/projects";
import { InboxCard, NotesCard, INBOX_INPUT_ID, NOTES_INPUT_ID } from "@/components/dashboard/capture";
import { PlanningCard } from "@/components/dashboard/planning";
import { HabitsCard, StatsCard } from "@/components/dashboard/habits";

const MOMENT_CYCLE: (ZenMoment | "auto")[] = ["auto", "morning", "afternoon", "evening", "night"];

function DashboardInner() {
  const { set, ready } = useZen();
  const [override, setOverride] = React.useState<ZenMoment | "auto">("auto");
  const [hour, setHour] = React.useState(() => new Date().getHours());

  // Le fond suit l'heure (vérifiée chaque minute) sauf choix manuel
  React.useEffect(() => {
    const t = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(t);
  }, []);
  const moment: ZenMoment = override === "auto" ? momentFromHour(hour) : override;

  // Sauvegarde du choix d'ambiance
  React.useEffect(() => {
    const saved = localStorage.getItem("zen-moment");
    if (saved && MOMENT_CYCLE.includes(saved as ZenMoment | "auto")) {
      setOverride(saved as ZenMoment | "auto");
    }
  }, []);
  const changeOverride = (m: ZenMoment | "auto") => {
    setOverride(m);
    localStorage.setItem("zen-moment", m);
  };

  // Raccourcis clavier globaux (< 3 secondes pour chaque geste du quotidien)
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      )
        return;

      if (e.key === "i") {
        e.preventDefault();
        document.getElementById(INBOX_INPUT_ID)?.focus();
      } else if (e.key === "n") {
        e.preventDefault();
        document.getElementById(NOTES_INPUT_ID)?.focus();
      } else if (e.key === "t") {
        changeOverride(MOMENT_CYCLE[(MOMENT_CYCLE.indexOf(override) + 1) % MOMENT_CYCLE.length]);
      } else if (["1", "2", "3"].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        set((s) => ({
          ...s,
          tasks: s.tasks.map((t, i) => (i === idx ? { ...t, done: !t.done } : t)),
        }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [override, set]);

  // Évite le flash d'état par défaut avant lecture du localStorage
  if (!ready) return <div data-zen={moment} className="min-h-screen" />;

  return (
    <div data-zen={moment} className="min-h-screen transition-colors duration-700">
      <Scene moment={moment} />
      <ZenSidebar />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-16">
        <div id="zen-top" className="scroll-mt-8">
          <Header moment={moment} override={override} onOverride={changeOverride} />
        </div>

        {/* Focus + 3 essentielles */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <FocusCard />
          <TasksCard />
        </div>

        {/* Projets + capture */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div id="zen-projects" className="scroll-mt-8 lg:col-span-2">
            <ProjectsCard />
          </div>
          <div id="zen-inbox" className="scroll-mt-8 flex flex-col gap-4">
            <InboxCard />
          </div>
        </div>

        {/* Notes + Planning */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <NotesCard />
          <div id="zen-planning" className="scroll-mt-8 lg:col-span-2">
            <PlanningCard />
          </div>
        </div>

        {/* Habitudes + Stats */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div id="zen-habits" className="scroll-mt-8">
            <HabitsCard />
          </div>
          <div id="zen-stats" className="scroll-mt-8">
            <StatsCard />
          </div>
        </div>

        <footer className="mt-8 text-center text-[11px]" style={{ color: "var(--z-ink-faint)" }}>
          <kbd>i</kbd> idée · <kbd>n</kbd> notes · <kbd>1-3</kbd> tâches · <kbd>t</kbd> ambiance — tout est
          sauvegardé automatiquement sur cet appareil
        </footer>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ZenProvider>
      <DashboardInner />
    </ZenProvider>
  );
}
