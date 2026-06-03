# 🚀 GUIDE D'INSTALLATION ET D'EXPLOITATION — OPEP

Ce guide vous permet de configurer l'environnement de développement complet pour le projet OPEP.

## 1. Prérequis
- **Node.js** (v18.x ou v20.x)
- **Docker Desktop** (indispensable pour PostgreSQL et Redis)
- **Git**

## 2. Configuration Initiale

### A. Initialisation des variables d'environnement
Le fichier `.env` a été initialisé à la racine. Vous pouvez modifier les valeurs si nécessaire (notamment les secrets de paiement).

### B. Génération des clés RSA (Sécurité des Tickets)
Le système utilise des signatures RSA pour valider les tickets hors-ligne. Vous devez générer les clés dans le dossier `keys/` :
```bash
# Si vous avez openssl installé
openssl genrsa -out keys/private.pem 2048
openssl rsa -in keys/private.pem -pubout -out keys/public.pem
```

## 3. Lancement de l'Infrastructure
Lancez la base de données, Redis et l'outil d'administration :
```bash
docker-compose up -d
```
- **Postgres** : `localhost:5432` (User: `opep`, Pass: `opep_dev_secret`)
- **pgAdmin** : `http://localhost:5050` (Email: `admin@opep.cm`, Pass: `admin`)
- **Redis** : `localhost:6379`

## 4. Installation des Dépendances
Depuis la racine du projet :
```bash
npm install
```

## 5. Préparation de la Base de Données
Exécutez les migrations pour créer les tables :
```bash
npm run typeorm:run -w apps/api
```

## 6. Lancement du Projet en Développement

Utilisez les commandes suivantes pour lancer les différents modules :

| Module | Commande | URL / Port |
| :--- | :--- | :--- |
| **Backend (API)** | `npm run dev:api` | `http://localhost:3000` |
| **Frontend (Web)** | `npm run dev:web` | `http://localhost:3001` |
| **Mobile (React Native)** | `npm run dev:mobile` | Expo Dashboard |

## 7. Configuration MCP (IA)
Pour que votre assistant IA puisse interagir avec ce projet, utilisez la configuration définie dans `MCP_CONFIG.md`.

---
**Note :** Pour toute modification de schéma de base de données, créez une migration :
`npm run typeorm:generate -w apps/api -- src/migrations/NomDeLaMigration`
