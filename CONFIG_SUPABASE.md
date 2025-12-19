# 🔧 Configuration Supabase pour Vercel

## 📋 Informations Fournies

Vous avez fourni :
- `NEXT_PUBLIC_SUPABASE_URL` : URL publique Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé anonyme Supabase

## ⚠️ Important : URL PostgreSQL Requise

Pour Prisma, vous avez besoin de l'**URL de connexion PostgreSQL directe**, pas de l'URL publique Supabase.

## 🔍 Comment Obtenir l'URL PostgreSQL depuis Supabase

### Étape 1 : Accéder aux Paramètres

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet : `qkqosfgdxlmmovyrokkp`
4. Allez dans **Settings** (Paramètres) → **Database**

### Étape 2 : Trouver l'URL de Connexion

Dans la section **Database**, cherchez :
- **Connection string** ou **Connection pooling**
- **URI** ou **Connection URL**

Vous verrez quelque chose comme :
```
postgresql://postgres:[YOUR-PASSWORD]@db.qkqosfgdxlmmovyrokkp.supabase.co:5432/postgres
```

### Étape 3 : Utiliser Connection Pooling (Recommandé)

Pour Vercel, utilisez **Connection Pooling** (plus stable) :

1. Dans Supabase → Settings → Database
2. Cherchez **Connection Pooling**
3. Copiez l'URL qui ressemble à :
   ```
   postgresql://postgres.qkqosfgdxlmmovyrokkp:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

**Note** : Vous devrez remplacer `[YOUR-PASSWORD]` par le mot de passe de votre base de données Supabase.

## ✅ Configuration sur Vercel

Une fois que vous avez l'URL PostgreSQL, ajoutez dans Vercel → Settings → Environment Variables :

```
DATABASE_URL=postgresql://postgres.qkqosfgdxlmmovyrokkp:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=générez-une-clé-secrète
NODE_ENV=production
```

## 🔐 Trouver le Mot de Passe

Si vous ne connaissez pas le mot de passe :
1. Supabase → Settings → Database
2. Section **Database password**
3. Si vous l'avez oublié, vous pouvez le réinitialiser

## 🚀 Étapes Suivantes

1. Obtenez l'URL PostgreSQL complète
2. Ajoutez-la comme `DATABASE_URL` sur Vercel
3. Assurez-vous que `prisma/schema.prisma` utilise `provider = "postgresql"`
4. Poussez le schéma : `npx prisma db push`
5. Redéployez sur Vercel

---

**Besoin d'aide ?** Partagez l'URL PostgreSQL complète (vous pouvez masquer le mot de passe) et je vous aiderai à la configurer.

