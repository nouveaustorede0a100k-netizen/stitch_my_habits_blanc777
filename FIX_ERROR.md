# 🔧 Résoudre l'Erreur "Application error: a server-side exception has occurred"

## 🔍 Causes Probables

Cette erreur est généralement causée par :

1. **Base de données non configurée** (le plus probable)
2. **Variables d'environnement manquantes**
3. **Schéma Prisma non poussé** (tables n'existent pas)
4. **Mauvais provider Prisma** (SQLite au lieu de PostgreSQL)

## ✅ Solution Étape par Étape

### Étape 1 : Vérifier les Variables d'Environnement sur Vercel

Dans Vercel → Settings → Environment Variables, vous DEVEZ avoir :

```
DATABASE_URL=votre-url-postgresql
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=une-chaine-aleatoire-secrete
NODE_ENV=production
```

**Important** :
- Si vous utilisez Vercel Postgres, utilisez `DATABASE_URL=$POSTGRES_URL`
- `NEXTAUTH_URL` doit être EXACTEMENT l'URL de votre déploiement Vercel
- `NEXTAUTH_SECRET` doit être une chaîne aléatoire (générez avec `openssl rand -base64 32`)

### Étape 2 : Vérifier le Schéma Prisma

Le fichier `prisma/schema.prisma` doit utiliser PostgreSQL :

```prisma
datasource db {
  provider = "postgresql"  // PAS "sqlite"
  url      = env("DATABASE_URL")
}
```

Si c'est encore `sqlite`, changez-le et poussez :

```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push
```

### Étape 3 : Initialiser la Base de Données

**C'est CRUCIAL !** Les tables doivent être créées dans PostgreSQL.

#### Option A : Via Vercel CLI (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Récupérer les variables d'environnement
vercel env pull .env.local

# Pousser le schéma Prisma
npx prisma db push

# Régénérer le client Prisma
npx prisma generate
```

#### Option B : Via Script de Build

Le script `vercel-build` dans `package.json` devrait déjà faire ça, mais vérifiez qu'il est bien exécuté.

### Étape 4 : Vérifier les Logs Vercel

1. Allez dans votre projet Vercel
2. Cliquez sur "Deployments"
3. Cliquez sur le dernier déploiement
4. Regardez les "Function Logs" ou "Build Logs"

Cherchez des erreurs comme :
- `Can't reach database server`
- `Table does not exist`
- `Environment variable not found`

### Étape 5 : Vérifier que la Base de Données Existe

Si vous utilisez Vercel Postgres :
1. Vercel → Storage → Votre base Postgres
2. Vérifiez qu'elle est bien créée et active

Si vous utilisez Supabase/Neon :
1. Vérifiez que la base est active
2. Vérifiez que l'URL de connexion est correcte

## 🐛 Dépannage Spécifique

### Erreur : "Can't reach database server"
- Vérifiez que `DATABASE_URL` est correcte
- Vérifiez que la base de données accepte les connexions externes
- Pour Vercel Postgres, utilisez `$POSTGRES_URL`

### Erreur : "Table does not exist"
- Les tables n'ont pas été créées
- Exécutez `npx prisma db push` (voir Étape 3)

### Erreur : "Environment variable not found"
- Vérifiez que toutes les variables sont dans Vercel
- Redéployez après avoir ajouté les variables

### Erreur : "Prisma Client not generated"
- Le client Prisma n'a pas été généré
- Vérifiez que `postinstall` dans `package.json` contient `prisma generate`

## 🚀 Solution Rapide (Checklist)

- [ ] Base de données PostgreSQL créée (Vercel Postgres ou autre)
- [ ] `DATABASE_URL` configurée dans Vercel
- [ ] `NEXTAUTH_URL` = URL exacte de votre app Vercel
- [ ] `NEXTAUTH_SECRET` configuré
- [ ] `prisma/schema.prisma` utilise `provider = "postgresql"`
- [ ] Schéma poussé avec `npx prisma db push`
- [ ] Redéployé sur Vercel

## 📝 Commandes Rapides

```bash
# 1. Récupérer les variables d'environnement
vercel env pull .env.local

# 2. Vérifier le schéma
cat prisma/schema.prisma | grep provider

# 3. Pousser le schéma
npx prisma db push

# 4. Régénérer le client
npx prisma generate

# 5. Tester localement
npm run dev
```

## 💡 Astuce

Si vous ne pouvez pas exécuter `prisma db push` localement, vous pouvez le faire via le script de build Vercel. Le script `vercel-build` dans `package.json` devrait déjà inclure `prisma db push`.

---

**Le problème est probablement que les tables n'existent pas dans PostgreSQL. Exécutez `npx prisma db push` après avoir configuré `DATABASE_URL`.**

