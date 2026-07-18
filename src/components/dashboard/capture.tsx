"use client";

// 💡 Inbox (capture rapide, raccourci "i") et 📝 Notes (autosauvegarde).

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useZen } from "./store";
import { SectionTitle, ZenCard } from "./bits";

export const INBOX_INPUT_ID = "zen-inbox-input";
export const NOTES_INPUT_ID = "zen-notes-input";

export function InboxCard() {
  const { state, set, uid } = useZen();
  const [text, setText] = React.useState("");

  const add = () => {
    const t = text.trim();
    if (!t) return;
    set((s) => ({
      ...s,
      inbox: [{ id: uid(), text: t, at: new Date().toISOString() }, ...s.inbox],
    }));
    setText("");
  };

  const remove = (id: string) =>
    set((s) => ({ ...s, inbox: s.inbox.filter((i) => i.id !== id) }));

  return (
    <ZenCard delay={0.2}>
      <SectionTitle emoji="💡" hint="touche i pour capturer">
        Inbox
      </SectionTitle>
      <input
        id={INBOX_INPUT_ID}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && add()}
        placeholder="Une idée ? Note-la, tri plus tard…"
        className="w-full rounded-xl border px-3 py-2 text-sm"
        style={{
          background: "var(--z-surface-strong)",
          borderColor: "var(--z-line)",
          color: "var(--z-ink)",
        }}
      />
      <AnimatePresence initial={false}>
        {state.inbox.slice(0, 6).map((i) => (
          <motion.div
            key={i.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="group mt-1 flex items-center justify-between gap-2 overflow-hidden rounded-lg px-2 py-1"
          >
            <span className="truncate text-sm" style={{ color: "var(--z-ink-soft)" }}>
              {i.text}
            </span>
            <button
              onClick={() => remove(i.id)}
              className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              aria-label="Supprimer l'idée"
            >
              <X className="h-3.5 w-3.5" style={{ color: "var(--z-ink-faint)" }} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      {state.inbox.length > 6 && (
        <p className="mt-1 px-2 text-[11px]" style={{ color: "var(--z-ink-faint)" }}>
          + {state.inbox.length - 6} autres idées
        </p>
      )}
    </ZenCard>
  );
}

export function NotesCard() {
  const { state, set } = useZen();
  const [saved, setSaved] = React.useState(true);

  return (
    <ZenCard delay={0.25}>
      <SectionTitle emoji="📝" hint={saved ? "sauvegardé ✓" : "sauvegarde…"}>
        Notes rapides
      </SectionTitle>
      <textarea
        id={NOTES_INPUT_ID}
        value={state.notes}
        onChange={(e) => {
          setSaved(false);
          set((s) => ({ ...s, notes: e.target.value }));
          // le store débounce déjà l'écriture ; on confirme visuellement
          setTimeout(() => setSaved(true), 600);
        }}
        rows={6}
        placeholder="Écris librement, tout est conservé automatiquement…"
        className="w-full resize-none rounded-xl border p-3 text-sm leading-relaxed"
        style={{
          background: "var(--z-surface-strong)",
          borderColor: "var(--z-line)",
          color: "var(--z-ink)",
        }}
      />
    </ZenCard>
  );
}
