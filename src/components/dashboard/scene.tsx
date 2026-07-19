"use client";

// Décor "vintage 80 city-pop" — composition originale en SVG plat :
// ciel à quatre tons saturés, soleil cerclé d'encre à reflets en tirets,
// ville lointaine (fenêtres multicolores la nuit, immeubles modernistes
// crème le jour), palmier en silhouette, grain de trame façon sérigraphie.
// Toutes les couleurs viennent des variables CSS du thème.

export type ZenMoment = "morning" | "afternoon" | "evening" | "night";

export function momentFromHour(h: number): ZenMoment {
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 18) return "afternoon";
  if (h >= 18 && h < 22) return "evening";
  return "night";
}

const HORIZON = 620;

// Générateur déterministe (même rendu serveur/client, pas d'hydration mismatch)
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

// Lumières de la ville (matin/soir/nuit) — fenêtres allumées au loin,
// trois teintes façon néon : chaude, blanche, rose vif.
const CITY_LIGHTS = (() => {
  const rand = rng(42);
  const dots: { x: number; y: number; r: number; kind: "warm" | "white" | "neon" }[] = [];
  for (let i = 0; i < 170; i++) {
    const p = rand();
    dots.push({
      x: Math.round(rand() * 1440),
      y: Math.round(HORIZON - 4 - rand() * 48),
      r: 1.3 + rand() * 1.3,
      kind: p < 0.8 ? "warm" : p < 0.93 ? "white" : "neon",
    });
  }
  return dots;
})();

// Ligne d'arbres (après-midi) — bosquets au loin
const TREELINE = (() => {
  const rand = rng(7);
  const bumps: { x: number; r: number; o: number }[] = [];
  for (let x = -10; x <= 1450; x += 34) {
    bumps.push({ x: x + rand() * 18, r: 12 + rand() * 14, o: 0.75 + rand() * 0.25 });
  }
  return bumps;
})();

function sunPos(moment: ZenMoment) {
  return moment === "morning"
    ? { cx: 420, cy: 468, r: 96 }
    : moment === "afternoon"
      ? { cx: 1030, cy: 208, r: 78 }
      : moment === "evening"
        ? { cx: 560, cy: 592, r: 128 }
        : { cx: 1050, cy: 196, r: 54 };
}

function Sun({ moment }: { moment: ZenMoment }) {
  const pos = sunPos(moment);
  return (
    <>
      {/* halo très léger */}
      <circle cx={pos.cx} cy={pos.cy} r={pos.r * 1.6} fill="var(--z-sun)" opacity={0.16} />
      {/* disque cerclé d'encre, coupé net à l'horizon — signature poster vintage */}
      <g clipPath="url(#sky-clip)">
        <circle cx={pos.cx} cy={pos.cy} r={pos.r} fill="var(--z-sun)" stroke="var(--z-ink)" strokeOpacity={0.5} strokeWidth={2.5} />
        {/* liseré chaud à la base (matin/soir) */}
        <ellipse
          cx={pos.cx}
          cy={HORIZON - 6}
          rx={pos.r * 0.92}
          ry={15}
          fill="var(--z-sun-rim, transparent)"
          opacity={0.85}
        />
      </g>
    </>
  );
}

// Reflet en tirets — rendu APRÈS la mer pour rester visible par-dessus l'eau
function Reflection({ moment }: { moment: ZenMoment }) {
  const pos = sunPos(moment);
  const dashes = [150, 118, 94, 72, 54, 40, 28, 18];
  return (
    <g>
      {dashes.map((w, i) => (
        <rect
          key={i}
          x={pos.cx - w / 2}
          y={HORIZON + 22 + i * 19}
          width={w}
          height={4}
          rx={2}
          fill="var(--z-reflect)"
          opacity={0.9 - i * 0.08}
        />
      ))}
    </g>
  );
}

// Fines lignes de houle — texture de mer façon poster sérigraphié
function SeaTexture() {
  return (
    <g stroke="#ffffff" strokeOpacity={0.16} strokeWidth={1.5}>
      <line x1={0} y1={HORIZON + 54} x2={1440} y2={HORIZON + 54} />
      <line x1={0} y1={HORIZON + 92} x2={1440} y2={HORIZON + 92} />
    </g>
  );
}

function CityNight() {
  // silhouettes de tours cerclées de néon + fenêtres allumées multicolores
  const towers = [
    { x: 168, w: 48, h: 96 },
    { x: 238, w: 34, h: 64 },
    { x: 730, w: 40, h: 74 },
    { x: 1020, w: 56, h: 112 },
    { x: 1092, w: 42, h: 86 },
    { x: 1360, w: 38, h: 60 },
  ];
  return (
    <>
      <rect x={0} y={HORIZON - 34} width={1440} height={34} fill="var(--z-city)" />
      {towers.map((t) => (
        <g key={t.x}>
          <rect
            x={t.x}
            y={HORIZON - t.h}
            width={t.w}
            height={t.h}
            fill="var(--z-city)"
            stroke="var(--z-neon)"
            strokeOpacity={0.45}
            strokeWidth={1}
          />
          <rect
            x={t.x + 5}
            y={HORIZON - t.h + 6}
            width={t.w - 10}
            height={t.h - 14}
            fill="url(#windows)"
          />
        </g>
      ))}
      {CITY_LIGHTS.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill={d.kind === "warm" ? "var(--z-light)" : d.kind === "white" ? "#ffffff" : "var(--z-neon)"}
          opacity={d.kind === "warm" ? 0.95 : 0.85}
        />
      ))}
    </>
  );
}

function CityDay() {
  // immeubles modernistes crème, cernés d'un trait d'encre + ligne d'arbres
  const slabs = [
    { x: 150, w: 52, h: 84 },
    { x: 226, w: 30, h: 52 },
    { x: 620, w: 64, h: 112 },
    { x: 700, w: 40, h: 66 },
    { x: 906, w: 128, h: 46 },
    { x: 1330, w: 46, h: 70 },
  ];
  return (
    <>
      {slabs.map((s) => (
        <g key={s.x}>
          <rect
            x={s.x}
            y={HORIZON - s.h}
            width={s.w}
            height={s.h}
            fill="var(--z-city)"
            stroke="var(--z-ink)"
            strokeOpacity={0.22}
            strokeWidth={1}
          />
          {[...Array(Math.floor((s.h - 16) / 14))].map((_, i) => (
            <rect
              key={i}
              x={s.x + 6}
              y={HORIZON - s.h + 8 + i * 14}
              width={s.w - 12}
              height={4}
              fill="var(--z-city-window)"
            />
          ))}
        </g>
      ))}
      {TREELINE.map((b, i) => (
        <circle key={i} cx={b.x} cy={HORIZON - 2} r={b.r} fill="var(--z-palm-tree)" opacity={b.o * 0.9} />
      ))}
    </>
  );
}

function Plane() {
  return (
    <g transform="translate(112 268) rotate(-9)">
      {/* traînées */}
      <rect x={-210} y={-1} width={150} height={2.6} rx={1.3} fill="#ffffff" opacity={0.55} />
      <rect x={-186} y={8} width={126} height={2.2} rx={1.1} fill="#ffffff" opacity={0.4} />
      {/* jet en silhouette */}
      <g fill="var(--z-ink)">
        <ellipse cx={0} cy={2} rx={30} ry={5.5} />
        <rect x={-52} y={0} width={118} height={4.6} rx={2.3} />
        <path d="M-16 2 L-30 -24 L-23 -24 L-8 2 Z" />
        <rect x={-38} y={-23} width={26} height={3.4} rx={1.7} />
        <circle cx={-14} cy={7} r={3.6} />
        <circle cx={18} cy={6} r={3.6} />
      </g>
    </g>
  );
}

function Birds() {
  const bird = "M0 0 Q 7 -7 14 0 Q 21 -7 28 0";
  return (
    <g stroke="var(--z-ink)" strokeWidth={2.4} fill="none" opacity={0.45} strokeLinecap="round">
      <path d={bird} transform="translate(520 226) scale(0.9)" />
      <path d={bird} transform="translate(584 194) scale(0.7)" />
      <path d={bird} transform="translate(640 240) scale(0.55)" />
    </g>
  );
}

function Palm({ neon }: { neon: boolean }) {
  // frondes = une feuille réutilisée en rotation autour de la couronne
  const angles = [-96, -72, -48, -22, 0, 24, 48, 74, 98];
  const rim = neon ? { stroke: "var(--z-neon)", strokeOpacity: 0.55, strokeWidth: 1.5 } : {};
  return (
    <g transform="translate(1252 900)">
      {/* tronc en S, effilé */}
      <path
        d="M-9 0 C -20 -110, 12 -220, -6 -330 L 8 -330 C 22 -220, -6 -110, 14 0 Z"
        fill="var(--z-palm-tree)"
        {...rim}
      />
      <g transform="translate(1 -330)">
        {angles.map((a) => (
          <path
            key={a}
            d="M0 0 C 26 -14, 76 -22, 128 -10 C 78 -8, 34 -2, 8 8 Z"
            fill="var(--z-palm-tree)"
            transform={`rotate(${a - 90}) scale(${1 - Math.abs(a) / 400})`}
            {...rim}
          />
        ))}
        <circle cx={-8} cy={6} r={8} fill="var(--z-palm-tree)" {...rim} />
        <circle cx={7} cy={9} r={7} fill="var(--z-palm-tree)" {...rim} />
      </g>
    </g>
  );
}

export function Scene({ moment }: { moment: ZenMoment }) {
  const isLowLight = moment !== "afternoon"; // ville de nuit pour matin/soir/nuit, ville de jour l'après-midi

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-colors duration-700"
      style={{ background: "var(--z-sky-3)" }}
    >
      {/* Étoiles CSS (nuit uniquement) */}
      <div className="zen-stars absolute inset-x-0 top-0 h-1/2" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--z-sky-1)" }} />
            <stop offset="35%" style={{ stopColor: "var(--z-sky-2)" }} />
            <stop offset="68%" style={{ stopColor: "var(--z-sky-3)" }} />
            <stop offset="100%" style={{ stopColor: "var(--z-sky-4)" }} />
          </linearGradient>
          <clipPath id="sky-clip">
            <rect x={0} y={0} width={1440} height={HORIZON} />
          </clipPath>
          <pattern id="windows" width={10} height={13} patternUnits="userSpaceOnUse">
            <rect x={2} y={3} width={4.5} height={5.5} fill="var(--z-light, transparent)" opacity={0.9} />
          </pattern>
          <pattern id="halftone" width={7} height={7} patternUnits="userSpaceOnUse">
            <circle cx={1.3} cy={1.3} r={1.1} fill="var(--z-ink)" />
          </pattern>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>

        {/* Ciel — quatre tons */}
        <rect x={0} y={0} width={1440} height={HORIZON} fill="url(#sky)" />

        {/* Soleil / lune, cerclé d'encre */}
        <Sun moment={moment} />

        {/* Mer en deux aplats */}
        <rect x={0} y={HORIZON} width={1440} height={900 - HORIZON} fill="var(--z-sea)" opacity={0.92} />
        <rect x={0} y={790} width={1440} height={110} fill="var(--z-sea-deep)" opacity={0.9} />
        <rect x={0} y={HORIZON} width={1440} height={2} fill="#ffffff" opacity={0.35} />
        <SeaTexture />

        {/* Reflet du soleil, par-dessus l'eau */}
        <Reflection moment={moment} />

        {/* Ville au loin */}
        {isLowLight ? <CityNight /> : <CityDay />}

        {/* Ciel vivant : avion l'après-midi et le soir, oiseaux le matin */}
        {(moment === "afternoon" || moment === "evening") && <Plane />}
        {moment === "morning" && <Birds />}

        {/* Palmier au premier plan */}
        <Palm neon={isLowLight} />

        {/* Grain de trame façon sérigraphie */}
        <rect x={0} y={0} width={1440} height={900} fill="url(#halftone)" opacity={0.05} />
        <rect x={0} y={0} width={1440} height={900} filter="url(#grain)" opacity={0.05} />
      </svg>
    </div>
  );
}
