# 🗄️ Configuration de la Base de Données Supabase

## 📋 Informations de Connexion

- **Host** : `db.mapkjbxdjwfwzbtrpkil.supabase.co`
- **Port** : `5432`
- **Database** : `postgres`
- **User** : `postgres`

## 🔐 Obtenir le Mot de Passe

### Méthode 1 : Via Supabase Dashboard

1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. **Settings** → **Database**
4. Section **Database password**
5. Si vous ne voyez pas le mot de passe, cliquez **Reset database password**
6. **Copiez le mot de passe** (vous ne pourrez plus le voir après)

### Méthode 2 : Si vous avez déjà le mot de passe

Si vous connaissez déjà le mot de passe, utilisez-le directement.

## 🔗 Construire l'URL PostgreSQL Complète

Une fois que vous avez le mot de passe, l'URL complète sera :

```
postgresql://postgres:[VOTRE_MOT_DE_PASSE]@db.mapkjbxdjwfwzbtrpkil.supabase.co:5432/postgres
```

**Exemple** (si votre mot de passe est `monPassword123`) :
```
postgresql://postgres:monPassword123@db.mapkjbxdjwfwzbtrpkil.supabase.co:5432/postgres
```

## ✅ Configuration sur Vercel

Dans **Vercel → Settings → Environment Variables**, ajoutez :

```
DATABASE_URL=postgresql://postgres:[VOTRE_MOT_DE_PASSE]@db.mapkjbxdjwfwzbtrpkil.supabase.co:5432/postgres
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=générez-avec: openssl rand -base64 32
NODE_ENV=production
```

## 🧪 Tester la Connexion (Optionnel)

Si vous voulez tester la connexion localement :

```bash
# Installer psql (si pas déjà installé)
# Sur macOS: brew install postgresql

# Se connecter
psql -h db.mapkjbxdjwfwzbtrpkil.supabase.co -p 5432 -d postgres -U postgres

# Entrez le mot de passe quand demandé
```

## 🚀 Initialiser les Tables

Après avoir configuré `DATABASE_URL` sur Vercel :

### Option A : Automatique (Recommandé)

Le script `vercel-build` dans `package.json` créera automatiquement les tables lors du déploiement.

### Option B : Manuel

```bash
# Récupérer les variables d'environnement
vercel env pull .env.local

# Pousser le schéma Prisma (crée les tables)
npx prisma db push

# Régénérer le client Prisma
npx prisma generate
```

## 📝 Checklist

- [ ] Mot de passe Supabase obtenu
- [ ] URL PostgreSQL complète construite
- [ ] `DATABASE_URL` configurée sur Vercel
- [ ] `NEXTAUTH_URL` configurée (URL exacte de votre app Vercel)
- [ ] `NEXTAUTH_SECRET` généré et configuré
- [ ] `NODE_ENV=production` configuré
- [ ] Redéployé sur Vercel
- [ ] Tables créées (automatiquement ou manuellement)

## ⚠️ Sécurité

- ⚠️ **Ne partagez JAMAIS** votre `DATABASE_URL` complète publiquement
- ⚠️ **Ne commitez JAMAIS** les variables d'environnement dans Git
- ✅ Utilisez toujours les variables d'environnement de Vercel

---

**Une fois que vous avez le mot de passe et avez configuré `DATABASE_URL` sur Vercel, redéployez et l'application devrait fonctionner !** 🚀

