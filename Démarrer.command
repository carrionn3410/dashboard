#!/bin/zsh
# Double-clique ce fichier pour lancer ton Dashboard 🌅

cd "$(dirname "$0")"

# Charger nvm pour utiliser Node 20 (Next.js exige Node >= 18.17)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
nvm use 20 >/dev/null 2>&1 || nvm use default >/dev/null 2>&1

echo "🌴 Dashboard personnel"
echo "──────────────────────"

# Première fois : installer les dépendances
if [ ! -d node_modules ]; then
  echo "📦 Première installation (2-3 minutes)…"
  npm install
fi

# Ouvrir le navigateur dans 4 secondes, puis lancer le serveur
(sleep 4 && open http://localhost:3000) &
echo "🚀 Lancement… ton dashboard va s'ouvrir dans le navigateur."
echo "   (laisse cette fenêtre ouverte, ferme-la pour arrêter)"
npm run dev
