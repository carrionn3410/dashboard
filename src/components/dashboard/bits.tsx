"use client";

// Petites briques partagées du dashboard : carte animée, titre de
// section, texte éditable inline, case à cocher sereine.

import * as React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ZenCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className={cn("zen-card p-5", className)}
    >
      {children}
    </motion.section>
  );
}

export function SectionTitle({
  emoji,
  children,
  hint,
}: {
  emoji: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-2">
      <h2 className="text-sm font-semibold tracking-wide" style={{ color: "var(--z-ink)" }}>
        <span className="mr-1.5">{emoji}</span>
        {children}
      </h2>
      {hint && (
        <span className="text-[11px]" style={{ color: "var(--z-ink-faint)" }}>
          {hint}
        </span>
      )}
    </div>
  );
}

// Texte cliquable → input. Entrée ou blur pour valider.
export function Editable({
  value,
  onChange,
  className,
  placeholder = "…",
  textarea = false,
  inline = false,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
  textarea?: boolean;
  inline?: boolean;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);

  React.useEffect(() => setDraft(value), [value]);

  const commit = () => {
    onChange(draft.trim() || value);
    setEditing(false);
  };

  if (editing) {
    const shared = {
      autoFocus: true,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onBlur: commit,
      className: cn(
        inline ? "inline-block w-48" : "w-full",
        "rounded-lg border-none bg-transparent p-0 focus-visible:outline-none",
        className
      ),
      style: { color: "var(--z-ink)" },
    };
    return textarea ? (
      <textarea
        {...shared}
        rows={2}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), commit())}
      />
    ) : (
      <input {...shared} onKeyDown={(e) => e.key === "Enter" && commit()} />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className={cn(
        inline ? "inline" : "block w-full",
        "cursor-text rounded-lg text-left transition-opacity duration-150 hover:opacity-70",
        className
      )}
      style={{ color: value ? "var(--z-ink)" : "var(--z-ink-faint)" }}
      title="Cliquer pour modifier"
    >
      {value || placeholder}
    </button>
  );
}

export function ZenCheck({
  checked,
  onToggle,
  label,
  strike = true,
}: {
  checked: boolean;
  onToggle: () => void;
  label: React.ReactNode;
  strike?: boolean;
}) {
  // Div conteneur (le label peut lui-même être interactif — édition inline)
  return (
    <div className="group flex w-full items-center gap-3 rounded-xl px-2 py-1.5 transition-colors duration-150 hover:bg-black/[0.04]">
      <motion.button
        onClick={onToggle}
        whileTap={{ scale: 0.85 }}
        aria-pressed={checked}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150"
        style={{
          borderColor: checked ? "var(--z-turquoise)" : "var(--z-ink-faint)",
          background: checked ? "var(--z-turquoise)" : "transparent",
        }}
      >
        {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </motion.button>
      <div
        className={cn("min-w-0 flex-1 text-sm transition-all duration-150", checked && strike && "line-through opacity-50")}
        style={{ color: "var(--z-ink)" }}
      >
        {label}
      </div>
    </div>
  );
}
