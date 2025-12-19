# 🚀 Déploiement Simple pour Tester

## ⚡ Solution la Plus Simple (2 minutes)

Vous pouvez tester l'app SANS configurer PostgreSQL manuellement ! Vercel le fait pour vous :

### Étape 1 : Déployez sur Vercel (sans base de données)
1. Allez sur [vercel.com](https://vercel.com)
2. "Add New Project" → Importez votre repo GitHub
3. **Laissez les variables d'environnement vides pour l'instant**
4. Cliquez "Deploy" (ça va échouer, c'est normal)

### Étape 2 : Créez la base de données (2 clics)
1. Dans votre projet Vercel → Onglet **"Storage"**
2. Cliquez **"Create Database"** → **"Postgres"**
3. Choisissez **"Hobby"** (gratuit)
4. Cliquez **"Create"**
5. **C'est tout !** Vercel crée automatiquement `POSTGRES_URL`

### Étape 3 : Configurez les variables
Dans Vercel → Settings → Environment Variables, ajoutez :

```
DATABASE_URL=$POSTGRES_URL
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=tapez-une-chaine-aleatoire-ici
NODE_ENV=production
```

### Étape 4 : Changez le schéma Prisma
Remplacez dans `prisma/schema.prisma` :
```prisma
datasource db {
  provider = "postgresql"  // au lieu de "sqlite"
  url      = env("DATABASE_URL")
}
```

Puis poussez sur GitHub :
```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for Vercel"
git push
```

### Étape 5 : Redéployez
Vercel redéploie automatiquement ou cliquez "Redeploy"

## ✅ C'est tout !

Votre app fonctionne maintenant ! Vercel Postgres est **gratuit** et **automatique**.

## 🎯 Pourquoi PostgreSQL ?

Sur Vercel, SQLite ne fonctionne pas car :
- ❌ Les fichiers sont supprimés à chaque redéploiement
- ❌ Pas de stockage persistant
- ✅ PostgreSQL fonctionne parfaitement

## 💡 Alternative : Tester Localement

Si vous voulez tester SANS déployer :

```bash
npm install
npm run db:push  # Crée la base SQLite locale
npm run dev      # Lance sur http://localhost:3000
```

Mais pour Vercel, PostgreSQL est nécessaire (et c'est gratuit et simple !)

