# 🚀 Déploiement Rapide sur Vercel

## Étapes rapides (5 minutes)

### 1. Préparer le code
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/VOTRE-USERNAME/stitch-my-habits.git
git push -u origin main
```

### 2. Créer une base de données PostgreSQL

**Option A : Vercel Postgres (le plus simple)**
1. Allez sur [vercel.com/storage](https://vercel.com/storage)
2. Créez une base de données Postgres
3. Notez l'URL de connexion

**Option B : Supabase (gratuit)**
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un projet
3. Copiez l'URL de connexion depuis Settings → Database

### 3. Modifier le schéma Prisma

Remplacez le contenu de `prisma/schema.prisma` par celui de `prisma/schema.postgresql.prisma` :

```bash
cp prisma/schema.postgresql.prisma prisma/schema.prisma
```

Puis :
```bash
npm run db:generate
```

### 4. Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez "Add New Project"
3. Importez votre repo GitHub
4. Configurez les variables d'environnement :

```
DATABASE_URL=votre-url-postgresql
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=générez-avec: openssl rand -base64 32
NODE_ENV=production
```

5. Dans Build Settings :
   - Build Command: `prisma generate && next build`
   - Install Command: `npm install`

6. Cliquez "Deploy"

### 5. Initialiser la base de données

Après le déploiement, exécutez les migrations :

```bash
# Récupérer les variables d'environnement
vercel env pull .env.local

# Pousser le schéma
npx prisma db push
```

Ou utilisez Prisma Studio :
```bash
npx prisma studio
```

## ✅ C'est fait !

Votre application est maintenant en ligne ! 🎉

## 🔗 Liens utiles

- [Guide complet de déploiement](./DEPLOY.md)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Prisma](https://www.prisma.io/docs)

