# Guide de Déploiement sur Vercel

Ce guide vous explique comment déployer votre application Stitch My Habits sur Vercel.

## 📋 Prérequis

1. Un compte GitHub (gratuit)
2. Un compte Vercel (gratuit) - [vercel.com](https://vercel.com)
3. Un compte pour une base de données PostgreSQL (recommandé pour la production)

## 🗄️ Option 1 : Base de données PostgreSQL (Recommandé)

### Étape 1 : Créer une base de données PostgreSQL

Options gratuites :
- **Vercel Postgres** (intégré à Vercel) - [vercel.com/storage/postgres](https://vercel.com/storage/postgres)
- **Supabase** (gratuit jusqu'à 500MB) - [supabase.com](https://supabase.com)
- **Neon** (gratuit jusqu'à 512MB) - [neon.tech](https://neon.tech)
- **Railway** (gratuit avec crédits) - [railway.app](https://railway.app)

### Étape 2 : Modifier le schéma Prisma

Si vous utilisez PostgreSQL, modifiez `prisma/schema.prisma` :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Puis exécutez :
```bash
npm run db:generate
npm run db:push
```

## 🚀 Option 2 : Déploiement avec SQLite (Développement uniquement)

⚠️ **Note** : SQLite n'est pas recommandé pour la production sur Vercel car les fichiers sont éphémères. Utilisez PostgreSQL pour la production.

## 📦 Déploiement sur Vercel

### Méthode 1 : Via l'interface Vercel (Recommandé)

1. **Préparer votre code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/votre-username/stitch-my-habits.git
   git push -u origin main
   ```

2. **Connecter à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "Add New Project"
   - Importez votre repository GitHub
   - Vercel détectera automatiquement Next.js

3. **Configurer les variables d'environnement**
   
   Dans les paramètres du projet Vercel, ajoutez :
   
   ```
   DATABASE_URL=votre-url-postgresql
   NEXTAUTH_URL=https://votre-projet.vercel.app
   NEXTAUTH_SECRET=votre-clé-secrète-générée
   NODE_ENV=production
   ```

   **Pour générer NEXTAUTH_SECRET** :
   ```bash
   openssl rand -base64 32
   ```

4. **Configurer le Build Command**
   
   Dans les paramètres du projet → Build & Development Settings :
   - **Build Command** : `prisma generate && next build`
   - **Install Command** : `npm install`
   - **Output Directory** : `.next` (par défaut)

5. **Déployer**
   - Cliquez sur "Deploy"
   - Vercel va automatiquement construire et déployer votre application

### Méthode 2 : Via Vercel CLI

1. **Installer Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Se connecter**
   ```bash
   vercel login
   ```

3. **Déployer**
   ```bash
   vercel
   ```

4. **Configurer les variables d'environnement**
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add NODE_ENV
   ```

5. **Déployer en production**
   ```bash
   vercel --prod
   ```

## 🔧 Configuration Vercel Postgres (Optionnel mais recommandé)

Si vous utilisez Vercel Postgres :

1. Dans votre projet Vercel, allez dans "Storage"
2. Cliquez sur "Create Database" → "Postgres"
3. Sélectionnez votre région
4. Vercel créera automatiquement la variable `POSTGRES_URL`
5. Utilisez cette URL comme `DATABASE_URL`

## 📝 Variables d'environnement requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion à la base de données | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | URL de votre application | `https://votre-projet.vercel.app` |
| `NEXTAUTH_SECRET` | Clé secrète pour NextAuth | Générée avec `openssl rand -base64 32` |
| `NODE_ENV` | Environnement | `production` |

## 🔄 Migrations de base de données

Après le premier déploiement, vous devez exécuter les migrations :

### Option 1 : Via Vercel CLI
```bash
vercel env pull .env.local
npx prisma db push
```

### Option 2 : Via Prisma Studio (local)
```bash
vercel env pull .env.local
npx prisma studio
```

### Option 3 : Script de migration automatique

Créez un script dans `package.json` :
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma db push && next build"
  }
}
```

## 🐛 Dépannage

### Erreur "Prisma Client not generated"
Ajoutez dans `package.json` :
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Erreur de connexion à la base de données
- Vérifiez que `DATABASE_URL` est correctement configurée
- Vérifiez que votre base de données PostgreSQL accepte les connexions externes
- Pour Vercel Postgres, utilisez `POSTGRES_URL` au lieu de `DATABASE_URL`

### Erreur NextAuth
- Vérifiez que `NEXTAUTH_URL` correspond exactement à l'URL de votre déploiement
- Vérifiez que `NEXTAUTH_SECRET` est défini et unique

### Build échoue
- Vérifiez les logs de build dans Vercel
- Assurez-vous que toutes les dépendances sont dans `package.json`
- Vérifiez que `prisma generate` s'exécute avant `next build`

## 📊 Monitoring

Vercel fournit automatiquement :
- Analytics de performance
- Logs en temps réel
- Monitoring des erreurs
- Métriques de déploiement

Accédez-y via le dashboard Vercel de votre projet.

## 🔐 Sécurité

1. **Ne commitez jamais** votre fichier `.env`
2. Utilisez des secrets forts pour `NEXTAUTH_SECRET`
3. Activez HTTPS (automatique sur Vercel)
4. Configurez les CORS si nécessaire

## 🚀 Déploiements automatiques

Vercel déploie automatiquement :
- À chaque push sur `main` → Production
- À chaque pull request → Preview

Vous pouvez configurer cela dans les paramètres du projet.

## 📱 Domaines personnalisés

1. Allez dans les paramètres du projet → Domains
2. Ajoutez votre domaine personnalisé
3. Suivez les instructions DNS

## ✅ Checklist de déploiement

- [ ] Code poussé sur GitHub
- [ ] Base de données PostgreSQL créée
- [ ] Schéma Prisma mis à jour (si PostgreSQL)
- [ ] Variables d'environnement configurées
- [ ] Build Command configuré
- [ ] Premier déploiement réussi
- [ ] Migrations de base de données exécutées
- [ ] Application testée en production
- [ ] Domaine personnalisé configuré (optionnel)

## 🎉 C'est fait !

Votre application est maintenant déployée sur Vercel. Partagez l'URL avec vos utilisateurs !

## 📞 Support

- Documentation Vercel : [vercel.com/docs](https://vercel.com/docs)
- Support Vercel : [vercel.com/support](https://vercel.com/support)
- Documentation Prisma : [prisma.io/docs](https://prisma.io/docs)

