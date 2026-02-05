# MURKOFF OS 2026 - Simulation d'OS Moderne

Une simulation interactive d'un système d'exploitation moderne ultra-moderne avec une ambiance bleue/cyan et des éléments Android/scripts. Ce projet est construit avec Next.js 16 et optimisé pour Vercel.

## 🚀 Fonctionnalités

### Écrans Principaux
- **Boot Screen** : Écran de démarrage avec lignes de code défilantes (ambiance bleue)
- **Login Screen** : Écran de connexion avec photo de profil (mot de passe: `1234`)
- **Startup Animation** : Animation de lancement après connexion
- **Desktop** : Bureau complet avec barre des tâches style Windows

### Bureau & Applications
- **Barre des tâches** : Style Windows avec icônes et horloge système
- **Icônes d'applications** : Navigateurs et applications (non accessibles)
- **Explorateur de fichiers** : Fonctionnel avec navigation dans les dossiers
- **10 dossiers** : Éparpillés sur le bureau avec documents non accessibles
- **Corbeille** : Système complet de restauration de fichiers

### Corbeille - Contenu Spécial
La corbeille contient 3 dossiers restaurables :

1. **ex-toxique** : 7 captures d'écran iOS style 2012
   - 6 conversations de disputes entre Harry Murkoff et Helene Bertram
   - 1 conversation importante sur la garde des enfants (5 juillet 2012)
   - Disputes puériles et conversation tendue

2. **image +18** : 10 rapports techniques sur l'androïde GP-TWO
   - Rapports scientifiques ultra sophistiqués
   - Descriptions complexes de tâches triviales (péter, laver le sol, etc.)
   - Lexique scientifique avancé

3. **dossier test** : Dossier protégé par mot de passe
   - Mot de passe: `123456789`
   - Contient des fichiers confidentiels

## 🛠 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour production
npm run build

# Démarrer en production
npm start
```

## 📱 Accès

- **URL locale** : [http://localhost:3000](http://localhost:3000)
- **Login** : Mot de passe `1234`
- **Dossier protégé** : Mot de passe `123456789`

## 🎨 Technologies

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **Hébergement** : Vercel (optimisé pour le plan gratuit)

## 📦 Structure du Projet

```
pc-denz-ex-femme/
├── app/
│   ├── page.tsx              # Point d'entrée principal
│   ├── layout.tsx            # Layout global
│   └── globals.css           # Styles globaux
├── components/
│   ├── BootScreen.tsx        # Écran de démarrage
│   ├── LoginScreen.tsx       # Écran de connexion
│   ├── StartupAnimation.tsx  # Animation de lancement
│   ├── Desktop.tsx           # Bureau principal
│   ├── FileExplorer.tsx      # Explorateur de fichiers
│   ├── RecycleBin.tsx        # Corbeille avec restauration
│   └── IOSScreenshot.tsx     # Générateur de captures iOS
├── data/
│   └── fileSystem.ts         # Système de fichiers virtuel
└── public/
    └── reports/              # 10 rapports techniques GP-TWO
```

## 🚀 Déploiement sur Vercel

### Méthode 1 : Via GitHub

1. Pousser le projet sur GitHub
2. Aller sur [vercel.com](https://vercel.com)
3. Importer le repository GitHub
4. Vercel détectera automatiquement Next.js
5. Cliquer sur "Deploy"

### Méthode 2 : Via CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

## 🎮 Utilisation

1. **Boot** : Attendez 4 secondes pour l'écran de démarrage
2. **Login** : Entrez le mot de passe `1234`
3. **Desktop** : Explorez le bureau
4. **Explorateur** : Cliquez sur l'icône dans la barre des tâches
5. **Corbeille** : Cliquez sur la corbeille pour voir les fichiers supprimés
6. **Restauration** : Utilisez le bouton "Restore" pour restaurer les dossiers

## ⚠️ Notes Importantes

- Les navigateurs et applications du bureau sont **non accessibles** (comme demandé)
- Les dossiers sur le bureau contiennent des documents **non ouvrable**
- Seul l'explorateur de fichiers et la corbeille sont **fonctionnels**
- Les captures d'écran iOS sont générées dynamiquement en React
- Les rapports GP-TWO utilisent un langage scientifique sophistiqué

## 📝 Crédits

Projet créé pour une simulation interactive d'OS moderne.
Construit avec Next.js 16 et optimisé pour Vercel Free Tier.

## 🔒 Mots de Passe

- **Login système** : `1234`
- **Dossier protégé** : `123456789`

---

**Note** : Ce projet est une simulation à but créatif/éducatif.
