# 🔧 Configuration Supabase - Nouvelle Instance

## 📋 Informations Fournies

- **URL Supabase** : `https://mapkjbxdjwfwzbtrpkil.supabase.co`
- **Clé Publique** : `sb_publishable_pbg9EwUmKHQs8a4P67mBag_ID8SiKf1`

## ⚠️ Important : URL PostgreSQL Requise

Pour que Prisma fonctionne, vous avez besoin de l'**URL de connexion PostgreSQL directe**, pas de l'URL publique Supabase.

## 🔍 Comment Obtenir l'URL PostgreSQL

### Étape 1 : Accéder à Supabase

1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Connectez-vous
3. Sélectionnez votre projet (celui avec l'URL `mapkjbxdjwfwzbtrpkil.supabase.co`)

### Étape 2 : Obtenir l'URL PostgreSQL

1. Allez dans **Settings** → **Database**
2. Cherchez la section **Connection string** ou **Connection pooling**
3. Pour Vercel, utilisez **Connection Pooling** (recommandé)
4. Copiez l'URL qui ressemble à :

```
postgresql://postgres.mapkjbxdjwfwzbtrpkil:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Important** : Remplacez `[YOUR-PASSWORD]` par le mot de passe de votre base de données.

### Étape 3 : Si vous ne connaissez pas le mot de passe

1. Supabase → Settings → Database
2. Section **Database password**
3. Si oublié, cliquez sur **Reset database password**
4. Copiez le nouveau mot de passe

## ✅ Variables d'Environnement pour Vercel

Dans **Vercel → Settings → Environment Variables**, ajoutez :

```
DATABASE_URL=postgresql://postgres.mapkjbxdjwfwzbtrpkil:[VOTRE_MOT_DE_PASSE]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=générez-avec: openssl rand -base64 32
NODE_ENV=production
```

## 🔐 Optionnel : Variables Supabase (si vous voulez utiliser l'API Supabase plus tard)

```
NEXT_PUBLIC_SUPABASE_URL=https://mapkjbxdjwfwzbtrpkil.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_pbg9EwUmKHQs8a4P67mBag_ID8SiKf1
```

**Note** : Ces variables ne sont pas nécessaires pour Prisma, mais peuvent être utiles si vous voulez utiliser l'API Supabase directement.

## 🚀 Étapes Suivantes

1. ✅ Obtenez l'URL PostgreSQL complète depuis Supabase
2. ✅ Ajoutez `DATABASE_URL` sur Vercel avec votre mot de passe
3. ✅ Ajoutez `NEXTAUTH_URL` et `NEXTAUTH_SECRET`
4. ✅ Redéployez sur Vercel
5. ✅ Les tables seront créées automatiquement via `vercel-build`

## 📝 Format de l'URL Complète

L'URL devrait ressembler à :
```
postgresql://postgres.mapkjbxdjwfwzbtrpkil:VOTRE_MOT_DE_PASSE@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

Ou pour la connexion directe (sans pooling) :
```
postgresql://postgres.mapkjbxdjwfwzbtrpkil:VOTRE_MOT_DE_PASSE@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

**Recommandation** : Utilisez Connection Pooling (port 6543) pour Vercel.

---

**Une fois que vous avez l'URL PostgreSQL complète, partagez-la (vous pouvez masquer le mot de passe) et je vous aiderai à finaliser la configuration !**

