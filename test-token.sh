#!/bin/bash

# Script pour tester les tokens GitHub
# Utilisation: ./test-token.sh VOTRE_TOKEN

if [ -z "$1" ]; then
    echo "Usage: ./test-token.sh VOTRE_TOKEN_GITHUB"
    exit 1
fi

TOKEN=$1

echo "🔍 Test du token GitHub..."
echo ""

# Test 1: Vérifier l'authentification
echo "1️⃣  Test d'authentification..."
RESPONSE=$(curl -s -H "Authorization: token $TOKEN" https://api.github.com/user)
if echo "$RESPONSE" | grep -q "login"; then
    USERNAME=$(echo "$RESPONSE" | grep -o '"login":"[^"]*' | cut -d'"' -f4)
    echo "✅ Token valide pour l'utilisateur: $USERNAME"
else
    echo "❌ Token invalide ou expiré"
    echo "$RESPONSE"
    exit 1
fi

# Test 2: Vérifier les permissions
echo ""
echo "2️⃣  Vérification des permissions..."
SCOPES=$(curl -s -I -H "Authorization: token $TOKEN" https://api.github.com/user | grep -i "x-oauth-scopes" | cut -d' ' -f2- | tr -d '\r')
echo "Permissions: $SCOPES"

if echo "$SCOPES" | grep -q "repo"; then
    echo "✅ Permission 'repo' détectée"
else
    echo "⚠️  Permission 'repo' manquante - le token doit avoir toutes les permissions repo"
fi

# Test 3: Vérifier l'accès au repository
echo ""
echo "3️⃣  Test d'accès au repository..."
REPO_RESPONSE=$(curl -s -H "Authorization: token $TOKEN" https://api.github.com/repos/nouveaustorede0a100k-netizen/stitch_my_habits_blanc777)
if echo "$REPO_RESPONSE" | grep -q "full_name"; then
    echo "✅ Accès au repository confirmé"
else
    echo "❌ Impossible d'accéder au repository"
    echo "$REPO_RESPONSE"
fi

# Test 4: Configuration Git
echo ""
echo "4️⃣  Configuration Git avec le token..."
git remote remove origin 2>/dev/null
git remote add origin https://nouveaustorede0a100k-netizen:${TOKEN}@github.com/nouveaustorede0a100k-netizen/stitch_my_habits_blanc777.git
echo "✅ Remote configuré"

# Test 5: Tentative de push
echo ""
echo "5️⃣  Test de push..."
git push -u origin main 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo "✅✅✅ SUCCÈS ! Le push a fonctionné !"
else
    echo ""
    echo "❌ Le push a échoué. Vérifiez les erreurs ci-dessus."
fi

