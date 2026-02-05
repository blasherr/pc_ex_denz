# Guide de Déploiement sur Vercel

## Préparation

Assurez-vous que votre projet compile sans erreurs :

```bash
npm run build
```

## Option 1 : Déploiement via GitHub (Recommandé)

### Étape 1 : Créer un repository GitHub

```bash
# Initialiser Git (déjà fait)
git add .
git commit -m "Initial commit: MURKOFF OS 2026"

# Créer un nouveau repo sur GitHub puis :
git remote add origin https://github.com/votre-username/murkoff-os-2026.git
git branch -M main
git push -u origin main
```

### Étape 2 : Connecter à Vercel

1. Aller sur [vercel.com/new](https://vercel.com/new)
2. Se connecter avec GitHub
3. Sélectionner votre repository
4. Vercel détecte automatiquement Next.js
5. Cliquer sur **Deploy**

✅ Votre site sera disponible en ~2 minutes !

## Option 2 : Déploiement via Vercel CLI

### Installation

```bash
npm i -g vercel
```

### Déploiement

```bash
# Se connecter
vercel login

# Déployer en preview
vercel

# Déployer en production
vercel --prod
```

## Configuration Automatique

Vercel détecte automatiquement :
- ✅ Framework: Next.js 16
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `.next`
- ✅ Install Command: `npm install`

## Variables d'Environnement

Aucune variable d'environnement n'est nécessaire pour ce projet.

## Domaine Personnalisé

Après le déploiement, vous pouvez :
1. Aller dans **Settings > Domains**
2. Ajouter votre domaine personnalisé
3. Suivre les instructions DNS

## URLs de Production

Vercel vous donnera automatiquement :
- URL principale : `https://votre-projet.vercel.app`
- URL de preview : `https://votre-projet-git-branch.vercel.app`

## Build Time

- **Build estimé** : 30-60 secondes
- **Taille du build** : ~5-10 MB
- **Plan gratuit** : Largement suffisant

## Résolution de Problèmes

### Erreur de build

```bash
# Vérifier localement
npm run build

# Si ça marche localement mais pas sur Vercel :
# - Vérifier les logs de build sur Vercel
# - Vérifier que toutes les dépendances sont dans package.json
```

### Images non chargées

Les images dans ce projet sont :
- Photo de profil : URL externe (https://imgg.fr)
- Captures iOS : Générées dynamiquement en React
- Pas de problème avec les images statiques

## Performance

Le site devrait avoir :
- ⚡ Performance : 90-100
- ✅ Accessibility : 95-100
- ⚡ Best Practices : 90-100
- ✅ SEO : 90-100

## Mises à Jour

Pour mettre à jour le site :

```bash
# Via GitHub
git add .
git commit -m "Update: votre message"
git push

# Vercel redéploiera automatiquement
```

## Support

Si vous rencontrez des problèmes :
1. Vérifier les [logs Vercel](https://vercel.com/dashboard)
2. Consulter la [documentation Next.js](https://nextjs.org/docs)
3. Consulter la [documentation Vercel](https://vercel.com/docs)

---

**Note** : Le plan gratuit Vercel permet :
- ✅ 100 GB de bande passante/mois
- ✅ Déploiements illimités
- ✅ SSL automatique
- ✅ CDN global
