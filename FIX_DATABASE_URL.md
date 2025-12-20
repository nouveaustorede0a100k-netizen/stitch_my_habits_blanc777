# 🔧 Correction : Erreur DATABASE_URL sur Vercel

## ❌ Erreur Rencontrée

```
Failed to connect to database: PrismaClientInitializationError: 
error: Error validating datasource `db`: 
the URL must start with the protocol `postgresql://` or `postgres://`.
```

## 🔍 Cause

La variable `DATABASE_URL` n'est **pas correctement configurée** sur Vercel ou est **vide**.

## ✅ Solution

### Étape 1 : Vérifier les Variables d'Environnement sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. **Settings** → **Environment Variables**
4. Vérifiez que `DATABASE_URL` existe et a une valeur

### Étape 2 : Ajouter/Corriger DATABASE_URL

Si `DATABASE_URL` n'existe pas ou est vide, ajoutez-la :

```
DATABASE_URL=postgresql://postgres:[VOTRE_MOT_DE_PASSE]@db.mapkjbxdjwfwzbtrpkil.supabase.co:5432/postgres
```

**Important** :
- Remplacez `[VOTRE_MOT_DE_PASSE]` par votre mot de passe Supabase
- L'URL doit commencer par `postgresql://` ou `postgres://`
- Pas d'espaces avant ou après l'URL

### Étape 3 : Obtenir le Mot de Passe Supabase

1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. **Settings** → **Database**
4. Section **Database password**
5. Si vous ne le voyez pas, cliquez **Reset database password**
6. **Copiez le mot de passe**

### Étape 4 : Utiliser Connection Pooling (Recommandé)

Pour Vercel, utilisez **Connection Pooling** (plus stable) :

1. Supabase → Settings → Database
2. Cherchez **Connection Pooling**
3. Copiez l'URL qui ressemble à :
   ```
   postgresql://postgres.mapkjbxdjwfwzbtrpkil:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
4. Utilisez cette URL comme `DATABASE_URL`

### Étape 5 : Vérifier Toutes les Variables

Assurez-vous d'avoir **TOUTES** ces variables sur Vercel :

```
DATABASE_URL=postgresql://postgres:[MOT_DE_PASSE]@db.mapkjbxdjwfwzbtrpkil.supabase.co:5432/postgres
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=une-clé-secrète-aléatoire
NODE_ENV=production
```

### Étape 6 : Redéployer

1. Après avoir ajouté/corrigé `DATABASE_URL`
2. Allez dans **Deployments**
3. Cliquez sur les **3 points** du dernier déploiement
4. Cliquez **Redeploy**
5. Ou faites un nouveau commit pour déclencher un redéploiement automatique

## 🧪 Vérification

Après le redéploiement, vérifiez :

1. Les **Function Logs** dans Vercel
2. Si l'erreur persiste, vérifiez que :
   - `DATABASE_URL` commence bien par `postgresql://`
   - Le mot de passe est correct
   - Pas d'espaces dans l'URL

## 📝 Format Correct

L'URL doit ressembler exactement à :
```
postgresql://postgres:monMotDePasse123@db.mapkjbxdjwfwzbtrpkil.supabase.co:5432/postgres
```

**Sans espaces, sans caractères spéciaux non encodés, commençant par `postgresql://`**

---

**Le problème est que `DATABASE_URL` n'est pas configurée ou est vide sur Vercel. Ajoutez-la et redéployez !** 🚀

