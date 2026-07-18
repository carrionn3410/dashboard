# 🌅 Dashboard — mon espace de pilotage quotidien

Application personnelle : priorités du jour, focus, projets, idées, notes,
planning, habitudes et statistiques. Esthétique city-pop japonaise années 80,
le fond change selon le moment de la journée.

## Lancer l'application

**Le plus simple** : double-clique sur `Démarrer.command`
(la première fois, macOS demandera peut-être : clic droit → Ouvrir).

**Ou dans le Terminal :**

```bash
cd ~/Desktop/Dashboard
npm install        # première fois seulement
npm run dev
```

Puis ouvre http://localhost:3000

## Raccourcis clavier

| Touche | Action |
|---|---|
| `i` | Capturer une idée (Inbox) |
| `n` | Aller aux notes |
| `1` `2` `3` | Cocher/décocher les 3 tâches essentielles |
| `t` | Changer l'ambiance (auto / matin / après-midi / soir / nuit) |

## Bon à savoir

- **Tout est sauvegardé automatiquement** dans le navigateur (localStorage) —
  pas de compte, pas de serveur, tes données restent sur ton Mac.
- **Chaque nuit à minuit**, les tâches se décochent pour le nouveau jour ;
  les compteurs et l'historique des habitudes sont conservés.
- Clique sur n'importe quel texte (objectif, focus, tâches, projets…) pour
  le modifier directement.
- Le bouton ▶ dans Focus chronomètre ton travail profond, qui alimente les
  statistiques.

## Technique

Next.js 14 · React 18 · TypeScript · Tailwind CSS · Framer Motion · Lucide.
Nécessite Node.js ≥ 18.17 (Node 20 installé via nvm sur ce Mac).

---

Créé par **Kevin Chapon** · Licence MIT
