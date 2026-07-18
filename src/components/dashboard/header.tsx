"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Cloud, CloudRain, CloudSun, Snowflake, Sun, SunMoon, Moon, Sunset, Zap } from "lucide-react";
import { useZen } from "./store";
import { Editable } from "./bits";
import type { ZenMoment } from "./scene";

const QUOTES = [
  "La constance bat le talent quand le talent n'est pas constant.",
  "Fais de chaque matin une petite victoire.",
  "Un pas par jour suffit, si tu ne t'arrêtes jamais.",
  "La simplicité est la sophistication suprême.",
  "Ce qui est mesuré s'améliore.",
  "Commence avant d'être prêt.",
  "L'océan est fait de gouttes.",
  "Protège ton attention comme ton bien le plus précieux.",
  "Le meilleur moment pour planter un arbre, c'était hier. Le second, c'est maintenant.",
  "Termine ce que tu commences, commence peu de choses.",
  "La discipline est un pont entre les rêves et leur réalisation.",
  "Chaque expert a d'abord été un débutant.",
  "Moins, mais mieux.",
  "Ta future vie se construit dans tes matinées.",
];

// Météo Open-Meteo (gratuit, sans clé). Échec réseau → simplement masqué.
const WEATHER_ICONS: [number[], typeof Sun, string][] = [
  [[0, 1], Sun, "Dégagé"],
  [[2], CloudSun, "Éclaircies"],
  [[3, 45, 48], Cloud, "Nuageux"],
  [[51, 53, 55, 61, 63, 65, 80, 81, 82], CloudRain, "Pluie"],
  [[71, 73, 75, 77, 85, 86], Snowflake, "Neige"],
  [[95, 96, 99], Zap, "Orage"],
];

function useWeather() {
  const [weather, setWeather] = React.useState<{ temp: number; code: number } | null>(null);
  React.useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=48.86&longitude=2.35&current=temperature_2m,weather_code"
    )
      .then((r) => r.json())
      .then((d) =>
        setWeather({ temp: Math.round(d.current.temperature_2m), code: d.current.weather_code })
      )
      .catch(() => {});
  }, []);
  return weather;
}

function useClock() {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

const MOMENTS: { id: ZenMoment | "auto"; icon: typeof Sun; label: string }[] = [
  { id: "auto", icon: SunMoon, label: "Auto" },
  { id: "morning", icon: Sun, label: "Matin" },
  { id: "afternoon", icon: CloudSun, label: "Après-midi" },
  { id: "evening", icon: Sunset, label: "Soir" },
  { id: "night", icon: Moon, label: "Nuit" },
];

export function Header({
  moment,
  override,
  onOverride,
}: {
  moment: ZenMoment;
  override: ZenMoment | "auto";
  onOverride: (m: ZenMoment | "auto") => void;
}) {
  const { state, set } = useZen();
  const now = useClock();
  const weather = useWeather();

  const greeting =
    moment === "morning" ? "Bonjour" : moment === "night" ? "Bonne nuit" : moment === "evening" ? "Bonsoir" : "Bel après-midi";

  const dayIndex = Math.floor(now.getTime() / 86_400_000);
  const quote = QUOTES[dayIndex % QUOTES.length];

  const date = now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const time = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const w = weather ? WEATHER_ICONS.find(([codes]) => codes.includes(weather.code)) : undefined;
  const WeatherIcon = w?.[1];

  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: "var(--z-ink)" }}>
            {greeting}, {state.name}
          </h1>
          <p className="mt-1 text-sm capitalize" style={{ color: "var(--z-ink-soft)" }}>
            {date} · {time}
            {w && WeatherIcon && weather && (
              <span className="ml-2 inline-flex items-center gap-1">
                <WeatherIcon className="inline h-3.5 w-3.5" /> {weather.temp}° {w[2]}
              </span>
            )}
          </p>
        </div>

        {/* Sélecteur de moment (thème) */}
        <div className="zen-card flex items-center gap-0.5 !rounded-full p-1">
          {MOMENTS.map((m) => (
            <button
              key={m.id}
              onClick={() => onOverride(m.id)}
              title={m.label}
              aria-label={m.label}
              className="rounded-full p-1.5 transition-colors duration-150"
              style={{
                background: override === m.id ? "var(--z-turquoise)" : "transparent",
                color: override === m.id ? "#fff" : "var(--z-ink-soft)",
              }}
            >
              <m.icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm italic" style={{ color: "var(--z-ink-soft)" }}>
        « {quote} »
      </p>

      <div className="zen-card px-5 py-4">
        <p className="text-[11px] font-medium uppercase tracking-widest" style={{ color: "var(--z-ink-faint)" }}>
          Objectif principal du jour
        </p>
        <Editable
          value={state.objective}
          onChange={(v) => set((s) => ({ ...s, objective: v }))}
          className="mt-1 text-lg font-medium"
          placeholder="Quel est ton objectif aujourd'hui ?"
        />
      </div>
    </motion.header>
  );
}
