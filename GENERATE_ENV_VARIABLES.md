# 🔐 Comment Générer les Variables d'Environnement

## ✅ Étape 1 : DATABASE_URL (Vous l'avez !)

Vous avez le mot de passe, donc l'URL complète est :

```
DATABASE_URL=postgresql://postgres:[VOTRE_MOT_DE_PASSE]@db.mapkjbxdjwfwzbtrpkil.supabase.co:5432/postgres
```

**Remplacez `[VOTRE_MOT_DE_PASSE]` par le mot de passe que vous avez trouvé.**

**Exemple** (si votre mot de passe est `abc123xyz`) :
```
DATABASE_URL=postgresql://postgres:abc123xyz@db.mapkjbxdjwfwzbtrpkil.supabase.co:5432/postgres
```

## ✅ Étape 2 : NEXTAUTH_URL (URL de votre App Vercel)

`NEXTAUTH_URL` est simplement **l'URL de votre application déployée sur Vercel**.

### Comment la trouver :

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Allez dans **Deployments**
4. Cliquez sur le dernier déploiement
5. **Copiez l'URL** qui s'affiche (ex: `https://stitch-my-habits-xyz.vercel.app`)

### Format :

```
NEXTAUTH_URL=https://votre-projet.vercel.app
```

**Exemple** :
```
NEXTAUTH_URL=https://stitch-my-habits-abc123.vercel.app
```

**Important** : 
- L'URL doit commencer par `https://`
- Pas de slash à la fin
- C'est l'URL exacte de votre déploiement Vercel

## ✅ Étape 3 : NEXTAUTH_SECRET (Clé Secrète à Générer)

`NEXTAUTH_SECRET` est une **clé secrète aléatoire** que vous devez générer vous-même.

### Méthode 1 : Via Terminal (Recommandé)

```bash
openssl rand -base64 32
```

Cette commande génère une clé aléatoire de 32 caractères.

### Méthode 2 : Via Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Méthode 3 : En ligne

Allez sur [generate-secret.vercel.app](https://generate-secret.vercel.app/32) et copiez la clé générée.

### Format :

```
NEXTAUTH_SECRET=votre-clé-générée-ici
```

**Exemple** :
```
NEXTAUTH_SECRET=abc123xyz456def789ghi012jkl345mno678pqr901stu234vwx567
```

**Important** :
- Gardez cette clé secrète
- Ne la partagez jamais publiquement
- Utilisez une clé différente pour chaque environnement

## ✅ Étape 4 : NODE_ENV (Simple)

```
NODE_ENV=production
```

C'est tout ! Pas besoin de générer quoi que ce soit.

## 📋 Récapitulatif Complet

Voici un exemple complet avec toutes les variables :

```
DATABASE_URL=postgresql://postgres:monMotDePasse123@db.mapkjbxdjwfwzbtrpkil.supabase.co:5432/postgres
NEXTAUTH_URL=https://stitch-my-habits-abc123.vercel.app
NEXTAUTH_SECRET=abc123xyz456def789ghi012jkl345mno678pqr901stu234vwx567
NODE_ENV=production
```

## 🚀 Configuration sur Vercel

1. Allez sur **Vercel → Settings → Environment Variables**
2. Cliquez **Add New**
3. Ajoutez chaque variable une par une :
   - **Name** : `DATABASE_URL`
   - **Value** : `postgresql://postgres:[VOTRE_MOT_DE_PASSE]@db.mapkjbxdjwfwzbtrpkil.supabase.co:5432/postgres`
   - Cliquez **Save**

Répétez pour chaque variable.

## ⚠️ Important

- **DATABASE_URL** : Remplacez `[VOTRE_MOT_DE_PASSE]` par votre vrai mot de passe
- **NEXTAUTH_URL** : Utilisez l'URL exacte de votre déploiement Vercel
- **NEXTAUTH_SECRET** : Générez une nouvelle clé avec `openssl rand -base64 32`
- **NODE_ENV** : Toujours `production` pour Vercel

---

**Besoin d'aide ?** Dites-moi quelle variable vous pose problème et je vous aiderai à la générer !

