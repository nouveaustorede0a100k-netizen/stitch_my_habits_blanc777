# Guide de Démarrage Rapide

## 🚀 Installation et Configuration

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer les variables d'environnement
Créez un fichier `.env` à la racine du projet :
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-clé-secrète-ici"
NODE_ENV="development"
```

**Important** : Pour générer une clé secrète pour `NEXTAUTH_SECRET`, exécutez :
```bash
openssl rand -base64 32
```

### 3. Initialiser la base de données
```bash
npm run db:generate
npm run db:push
```

### 4. Lancer l'application
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📱 Première Utilisation

1. **Créer un compte** : Allez sur `/auth/signup` ou cliquez sur "S'inscrire" depuis la page de connexion
2. **Se connecter** : Utilisez vos identifiants sur `/auth/signin`
3. **Créer votre première habitude** : Cliquez sur le bouton "+" en bas à droite ou allez sur `/habits/new`
4. **Suivre vos progrès** : Consultez le dashboard pour voir votre progression quotidienne

## 🎯 Fonctionnalités Disponibles

### Pages Principales
- **Dashboard** (`/dashboard`) : Vue d'ensemble du jour avec progression
- **Mes Habitudes** (`/habits`) : Liste de toutes vos habitudes avec statistiques
- **Mes Objectifs** (`/goals`) : Gestion des objectifs par période
- **Calendrier** (`/calendar`) : Visualisation mensuelle de votre progression
- **Statistiques** (`/statistics`) : Analyses détaillées et métriques

### Actions Rapides
- Cliquez sur le bouton "+" flottant pour créer une nouvelle habitude
- Cochez/décochez les habitudes directement depuis le dashboard
- Consultez vos streaks (séries) pour chaque habitude

## 🛠️ Commandes Utiles

```bash
# Développement
npm run dev

# Build de production
npm run build
npm start

# Base de données
npm run db:generate    # Générer le client Prisma
npm run db:push        # Pousser le schéma vers la DB
npm run db:migrate     # Créer une migration
npm run db:studio      # Ouvrir Prisma Studio (interface graphique)
```

## 📊 Structure des Données

### Habitudes
- Nom, description, catégorie
- Fréquence (quotidienne, hebdomadaire, mensuelle)
- Jours spécifiques (pour habitudes hebdomadaires)
- Rappels et notifications
- Motivation ("pourquoi")

### Objectifs
- Titre, description
- Période (jour, semaine, mois, année)
- Priorité (haute, moyenne, basse)
- Dates de début et échéance
- Progression en pourcentage
- Sous-objectifs (hiérarchie)

## 🎨 Personnalisation

Les couleurs et styles peuvent être modifiés dans :
- `tailwind.config.ts` : Configuration Tailwind CSS
- `app/globals.css` : Styles globaux

## ⚠️ Notes Importantes

1. **Base de données** : Par défaut, SQLite est utilisé (`dev.db`). Pour la production, utilisez PostgreSQL ou MySQL.
2. **Authentification** : L'authentification utilise NextAuth.js avec credentials. Pour ajouter OAuth (Google, GitHub, etc.), modifiez `lib/auth.ts`.
3. **Notifications** : Les notifications push ne sont pas encore implémentées mais la structure est en place.

## 🐛 Dépannage

### Erreur de base de données
```bash
# Supprimer et recréer la base de données
rm dev.db
npm run db:push
```

### Erreur d'authentification
Vérifiez que `NEXTAUTH_SECRET` est bien défini dans `.env`

### Problèmes de build
```bash
# Nettoyer et réinstaller
rm -rf node_modules .next
npm install
npm run build
```

## 📚 Documentation

Pour plus d'informations, consultez le [README.md](./README.md)

## 🎉 Prêt à commencer !

Votre application est maintenant prête. Créez votre compte et commencez à suivre vos habitudes et objectifs !

