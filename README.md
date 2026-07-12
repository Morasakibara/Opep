# 🚌 OPEP — Système de Transport Interurbain

Plateforme de gestion complète pour compagnies de transport interurbain au Cameroun. Backend NestJS + Frontend Next.js + Client mobile React/Vite.

## 📋 Architecture

```
OPEP/
├── apps/
│   ├── api/          # Backend NestJS (API REST + WebSocket + BullMQ)
│   ├── web/          # Portail Web Next.js (Admin, Gestion, Dashboard)
│   └── client/       # Client React/Vite (Mobile-friendly)
├── packages/
│   ├── shared-types/ # Types et schémas Zod partagés
│   └── qr-utils/     # Utilitaires de validation QR
└── docker-compose.yml
```

## 🚀 Installation rapide

### Prérequis
- Node.js >= 20
- Docker Desktop (PostgreSQL + Redis)
- npm

### 1. Démarrer les services

```bash
docker compose up -d
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l'environnement

```bash
cp apps/api/.env.example apps/api/.env
# Éditer apps/api/.env selon votre configuration
```

### 4. Lancer les migrations

```bash
cd apps/api && npm run migration:run
```

### 5. Seeder la base de données (données de démonstration)

```bash
cd apps/api && npm run seed
```

**Comptes de démonstration (mot de passe : `123456`) :**

| Rôle | Email |
|------|-------|
| 🔑 Admin Platform | admin@opep.cm |
| 🏢 Company Director | paul.biya@opep-express.cm |
| 🏢 Company Director | esther.njike@star-co.cm |
| 📍 Centre Manager | jean.mballa@opep-express.cm |
| 👤 Client | adrian@email.com |
| 👤 Client | samuel@email.com |

### 6. Lancer les serveurs de développement

```bash
# API Backend (port 3000)
cd apps/api && npm run start:dev

# Portail Web (port 3001)
cd apps/web && npm run dev

# Client mobile (port 5173)
cd apps/client && npm run dev
```

## 🧱 Modules fonctionnels

### Backend (NestJS + TypeORM + PostgreSQL)

| Module | Description | Statut |
|--------|-------------|--------|
| **Auth** | JWT, refresh token, OTP, rate limiting | ✅ Complet |
| **Users** | CRUD, rôles (8 rôles), hiérarchie multi-niveaux | ✅ Complet |
| **Agencies** | Agences legacy, plan BASIC/PREMIUM | ✅ Complet |
| **Companies** | Compagnies, DG, abonnements | ✅ Complet |
| **Centres** | Centres d'exploitation, managers, classement | ✅ Complet |
| **Buses** | Bus, sièges, layout JSON | ✅ Complet |
| **Routes** | Lignes, villes départ/arrivée | ✅ Complet |
| **Trips** | Voyages, statuts (SCHEDULED→BOARDING→IN_PROGRESS→COMPLETED) | ✅ Complet |
| **Reservations** | Réservations, acompte 30%, solde au guichet | ✅ Complet |
| **Tickets** | Tickets, QR signé RSA, scan offline | ✅ Complet |
| **Payments** | MTN MoMo, Orange Money, Stripe, Cash (mock) | ✅ Complet |
| **Seats** | État des sièges par voyage, lock/unlock | ✅ Complet |
| **Notifications** | SMS (Africa's Talking), Push (FCM), WhatsApp, Email | ✅ Complet |
| **GPS** | WebSocket, tracking en temps réel | ✅ Complet |
| **Reviews** | Avis clients, notation chauffeur/confort | ✅ Complet |
| **Complaints** | Litiges confidentiels, isolation company/centre | ✅ Complet |
| **Billings** | Factures, cron check-trials, generate-invoices | ✅ Complet |
| **Subscriptions** | Plans STARTER/PREMIUM/ENTERPRISE/FREE_TRIAL | ✅ Complet |
| **Incidents** | Gestion des incidents et remboursements | ✅ Complet |
| **Offline Scan** | Scan de tickets hors-ligne, sync batch | ✅ Complet |
| **Drivers** | Gestion des chauffeurs | ✅ Complet |
| **Reports** | Rapports et statistiques | ✅ Complet |
| **Audit** | Traçabilité de toutes les actions | ✅ Complet |

### Frontend Web (Next.js + Tailwind + React Query)

| Page | Description |
|------|-------------|
| Dashboard | KPIs, statistiques, graphiques |
| Companies | CRUD compagnies, grille avec recherche |
| Centres | CRUD centres, classement par note |
| Trips | Gestion des voyages |
| Buses | Gestion de la flotte |
| Reservations | Réservations et paiements |
| Tickets | Validation QR |
| Scanner | Scan de tickets |

## 🛡️ Sécurité

- **JWT** avec refresh token
- **OTP** pour actions sensibles
- **Rate limiting** multi-niveaux (Redis + Throttler)
- **CSRF** protection
- **OwnershipGuard** — isolation multi-tenant par companyId/centreId
- **SubscriptionGuard** — blocage écriture si abonnement inactif
- **Helmet** headers de sécurité
- **Validation** Zod + class-validator
- **Audit** log de toutes les actions

## 📦 Technologies

| Technologie | Usage |
|-------------|-------|
| **NestJS 11** | Framework backend |
| **TypeORM** | ORM PostgreSQL |
| **PostgreSQL** | Base de données |
| **Redis** | Cache, BullMQ, sessions |
| **BullMQ** | Files d'attente (notifications, paiements) |
| **Next.js 15** | Portail web |
| **Tailwind CSS** | Styling |
| **React Query** | Gestion d'état serveur |
| **Firebase Admin** | Notifications push (FCM) |
| **Africa's Talking** | SMS et WhatsApp |
| **Socket.io** | GPS tracking temps réel |
| **Docker** | Conteneurisation |

## 🔑 Variables d'environnement

Copier `apps/api/.env.example` vers `apps/api/.env` et configurer :

```
# Database
DATABASE_URL=postgres://user:password@localhost:5432/opep_db

# JWT
JWT_SECRET=votre_secret
JWT_REFRESH_SECRET=votre_refresh_secret

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Firebase (push notifications)
FCM_ACTIVE=false
FCM_CREDENTIALS=/path/to/serviceAccountKey.json

# Africa's Talking (SMS/WhatsApp)
AT_API_KEY=your_api_key
AT_USERNAME=sandbox
AT_ACTIVE=false

# Paiements
MTN_MOMO_API_KEY=
ORANGE_MONEY_CLIENT_ID=
STRIPE_SECRET_KEY=
```

## 🧪 Tests

```bash
# Tous les tests
cd apps/api && npm test

# Tests unitaires (23 fichiers spec)
cd apps/api && npm run test:watch

# Tests e2e
cd apps/api && npm run test:e2e
```

## 📊 Migrations

```bash
# Créer une migration
cd apps/api && npm run typeorm migration:create src/migrations/NomDeMigration

# Exécuter les migrations
cd apps/api && npm run migration:run

# Voir le statut
cd apps/api && npx typeorm-ts-node-commonjs migration:show -d src/config/typeorm.config.ts
```

## 🐳 Docker

```bash
# Démarrer PostgreSQL + Redis
docker compose up -d

# Voir les logs
docker compose logs -f

# Arrêter
docker compose down

# Tout reconstruire (données perdues)
docker compose down -v && docker compose up -d
```
