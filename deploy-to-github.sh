#!/bin/bash

# Script pour déployer le code sur GitHub
# Usage: ./deploy-to-github.sh

echo "🚀 Déploiement sur GitHub..."

# Vérifier si git est initialisé
if [ ! -d ".git" ]; then
    echo "📦 Initialisation du repository Git..."
    git init
fi

# Ajouter le remote s'il n'existe pas
if ! git remote | grep -q "origin"; then
    echo "🔗 Ajout du remote GitHub..."
    git remote add origin https://github.com/nouveaustorede0a100k-netizen/stitch_my_habits_blanc777.git
else
    echo "🔄 Mise à jour du remote GitHub..."
    git remote set-url origin https://github.com/nouveaustorede0a100k-netizen/stitch_my_habits_blanc777.git
fi

# Ajouter tous les fichiers
echo "📝 Ajout des fichiers..."
git add .

# Commit
echo "💾 Création du commit..."
git commit -m "Initial commit: Application de suivi d'habitudes et objectifs

- Dashboard avec vue d'ensemble du jour
- Gestion des habitudes avec streaks
- Gestion des objectifs par période
- Calendrier mensuel
- Statistiques et métriques
- Authentification NextAuth
- Base de données Prisma
- Design responsive mobile-first"

# Pousser vers GitHub
echo "⬆️  Envoi vers GitHub..."
git branch -M main
git push -u origin main

echo "✅ Déploiement terminé!"
echo "🌐 Votre code est maintenant sur: https://github.com/nouveaustorede0a100k-netizen/stitch_my_habits_blanc777"

