#!/bin/zsh
# Double-clique pour publier le code sur GitHub (après les 2 étapes du README)

cd "$(dirname "$0")"
echo "📤 Publication sur github.com/carrionn3410/dashboard…"
git push -u origin main && echo "✅ C'est en ligne : https://github.com/carrionn3410/dashboard" || echo "❌ Échec — vérifie que le repo existe et que la clé SSH est ajoutée (voir README)"
read -sk 1 "?Appuie sur une touche pour fermer…"
