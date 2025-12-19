# Stitch My Habits - Application de Suivi d'Habitudes et Objectifs

Application web moderne pour suivre vos habitudes et objectifs sur différentes périodes (jour, semaine, mois, année).

## 🚀 Fonctionnalités

### Gestion des Habitudes
- ✅ Création d'habitudes personnalisées
- ✅ Catégorisation (santé, productivité, finance, développement personnel, etc.)
- ✅ Fréquence configurable (quotidienne, hebdomadaire, mensuelle)
- ✅ Système de validation quotidienne (cocher/décocher)
- ✅ Suivi de séries (streaks) consécutives
- ✅ Rappels/notifications paramétrables

### Gestion des Objectifs
- ✅ Objectifs journaliers, hebdomadaires, mensuels et annuels
- ✅ Hiérarchisation (priorité haute/moyenne/basse)
- ✅ Date de début et échéance
- ✅ Suivi de progression en pourcentage
- ✅ Décomposition d'objectifs longs en sous-objectifs

### Tableaux de Bord et Visualisations
- ✅ Dashboard principal : vue d'ensemble du jour
- ✅ Vue calendrier : visualisation mensuelle
- ✅ Statistiques : taux de complétion, graphiques d'évolution, streaks

### Système de Motivation
- ✅ Citations motivantes
- ✅ Rappel des "pourquoi" (motivation derrière chaque objectif)
- ✅ Système de points/gamification (à venir)

## 🛠️ Technologies

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Base de données**: Prisma ORM avec SQLite
- **Authentification**: NextAuth.js
- **Graphiques**: Recharts

## 📦 Installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Configurer l'environnement**
```bash
cp .env.example .env
```

Éditez `.env` et configurez :
- `DATABASE_URL`: URL de la base de données (par défaut: `file:./dev.db`)
- `NEXTAUTH_SECRET`: Clé secrète pour NextAuth (générez-en une avec `openssl rand -base64 32`)
- `NEXTAUTH_URL`: URL de l'application (par défaut: `http://localhost:3000`)

3. **Initialiser la base de données**
```bash
npm run db:generate
npm run db:push
```

4. **Lancer l'application**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
stitch_my_habits_blanc/
├── app/                    # Pages Next.js (App Router)
│   ├── (auth)/            # Pages d'authentification
│   ├── (main)/            # Pages principales (protégées)
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── habits/        # Gestion des habitudes
│   │   ├── goals/         # Gestion des objectifs
│   │   ├── calendar/      # Vue calendrier
│   │   └── statistics/    # Statistiques
│   └── api/               # API Routes
├── components/            # Composants React réutilisables
├── lib/                   # Utilitaires et configuration
├── prisma/                # Schéma Prisma
└── types/                 # Types TypeScript
```

## 🔐 Authentification

L'application utilise NextAuth.js avec authentification par credentials (email/mot de passe).

Pour créer un compte :
1. Allez sur `/auth/signup`
2. Remplissez le formulaire
3. Connectez-vous sur `/auth/signin`

## 📊 Base de Données

Le schéma Prisma définit les modèles suivants :
- `User`: Utilisateurs
- `Habit`: Habitudes
- `HabitLog`: Historique de validation des habitudes
- `Goal`: Objectifs
- `GoalProgress`: Progression des objectifs
- `Note`: Notes et réflexions

Pour visualiser la base de données :
```bash
npm run db:studio
```

## 🎨 Personnalisation

Les couleurs et styles peuvent être personnalisés dans :
- `tailwind.config.ts`: Configuration Tailwind
- `app/globals.css`: Styles globaux

## 📱 Responsive

L'application est optimisée pour mobile-first avec un design responsive.

## 🚧 Fonctionnalités à venir

- [ ] Export de données (PDF, CSV)
- [ ] Partage social
- [ ] Mode sombre/clair (partiellement implémenté)
- [ ] Notifications push
- [ ] Système de badges et récompenses
- [ ] Synchronisation multi-appareils

## 📝 Licence

Ce projet est privé et réservé à un usage personnel.

## 🤝 Contribution

Ce projet est en développement actif. Les contributions sont les bienvenues !

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt du projet.

