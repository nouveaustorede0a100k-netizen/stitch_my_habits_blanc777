# 🔐 Variables d'Environnement pour Vercel

## ✅ Variables Requises

Ajoutez ces variables dans **Vercel → Settings → Environment Variables** :

### 1. Base de Données (Supabase PostgreSQL)

```
DATABASE_URL=postgresql://postgres.qkqosfgdxlmmovyrokkp:[VOTRE_MOT_DE_PASSE]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Important** :
- Remplacez `[VOTRE_MOT_DE_PASSE]` par le mot de passe de votre base Supabase
- Utilisez **Connection Pooling** (port 6543) pour Vercel
- Pour trouver le mot de passe : Supabase → Settings → Database → Database password

### 2. NextAuth

```
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=générez-avec: openssl rand -base64 32
```

**Important** :
- `NEXTAUTH_URL` doit être EXACTEMENT l'URL de votre déploiement Vercel
- `NEXTAUTH_SECRET` : générez une clé aléatoire (ne partagez jamais cette clé)

### 3. Environnement

```
NODE_ENV=production
```

## 📝 Comment Obtenir l'URL PostgreSQL Complète

### Option A : Via Supabase Dashboard

1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. **Settings** → **Database**
4. Cherchez **Connection Pooling** (recommandé pour Vercel)
5. Copiez l'URL et remplacez `[YOUR-PASSWORD]` par votre mot de passe

### Option B : Format de l'URL

L'URL devrait ressembler à :
```
postgresql://postgres.qkqosfgdxlmmovyrokkp:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## 🔍 Vérification

Après avoir ajouté les variables :

1. **Redéployez** sur Vercel
2. Vérifiez les **Function Logs** pour voir si la connexion fonctionne
3. Si erreur, vérifiez que le mot de passe est correct

## 🚨 Sécurité

- ⚠️ Ne partagez JAMAIS votre `DATABASE_URL` complète publiquement
- ⚠️ Ne commitez JAMAIS les variables d'environnement dans Git
- ✅ Utilisez toujours les variables d'environnement de Vercel

