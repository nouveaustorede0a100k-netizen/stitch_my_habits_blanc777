#!/bin/bash

# Script alternatif pour pousser sur GitHub
# Si le push automatique échoue, utilisez ce script

echo "🚀 Tentative de push sur GitHub..."

# Nettoyer le remote
git remote remove origin 2>/dev/null

# Ajouter le remote (remplacez VOTRE_TOKEN par votre token GitHub)
git remote add origin https://nouveaustorede0a100k-netizen:VOTRE_TOKEN@github.com/nouveaustorede0a100k-netizen/stitch_my_habits_blanc777.git

# Essayer le push
echo "⬆️  Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Succès! Votre code est sur GitHub!"
    echo "🌐 https://github.com/nouveaustorede0a100k-netizen/stitch_my_habits_blanc777"
else
    echo "❌ Erreur lors du push"
    echo ""
    echo "Solutions alternatives:"
    echo "1. Vérifiez que le token a les permissions 'repo'"
    echo "2. Utilisez GitHub Desktop: https://desktop.github.com/"
    echo "3. Utilisez l'interface web GitHub pour uploader les fichiers"
fi

