# 🔐 Variables d'Environnement

## Pour Vercel (Production)

Ajoutez ces variables dans **Vercel → Settings → Environment Variables** :

```
DATABASE_URL=postgresql://postgres.mapkjbxdjwfwzbtrpkil:[VOTRE_MOT_DE_PASSE]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=générez-avec: openssl rand -base64 32
NODE_ENV=production
```

## Pour Local (Développement)

Créez un fichier `.env.local` :

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-clé-secrète-locale"
NODE_ENV="development"
```

## Supabase (Optionnel)

Si vous voulez utiliser l'API Supabase directement :

```
NEXT_PUBLIC_SUPABASE_URL=https://mapkjbxdjwfwzbtrpkil.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_pbg9EwUmKHQs8a4P67mBag_ID8SiKf1
```

