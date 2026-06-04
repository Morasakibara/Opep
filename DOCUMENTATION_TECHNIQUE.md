# 📚 DOCUMENTATION TECHNIQUE — OPEP

Cette documentation détaille les choix architecturaux et les flux critiques de la plateforme OPEP.

## 1. Architecture Globale
OPEP est conçu comme un **Monorepo** utilisant `npm workspaces`.

### Structure des dossiers
- `apps/api` : Backend NestJS.
- `apps/web` : Portail Agence Next.js (App Router).
- `apps/client` : Client Web Passager React (Vite).
- `apps/mobile` : Application Mobile Expo (React Native).
- `packages/shared-types` : Types et schémas Zod partagés.
- `packages/qr-utils` : Logique de signature et validation des tickets QR.

## 2. Flux de Réservation & Paiement
Le flux de réservation est sécurisé par un double verrouillage :
1. **Verrouillage Temporel (Redis) :** Lorsqu'un utilisateur sélectionne un siège, il est verrouillé pendant 10 minutes pour éviter le surbooking pendant le paiement.
2. **Persistence (PostgreSQL) :** Une fois le paiement confirmé, la réservation passe au statut `CONFIRMED` et les sièges sont définitivement occupés en base de données.

### Providers de Paiement
Le système supporte :
- **MTN/Orange Money :** Simulation via une API Mock interne.
- **Stripe :** Intégration pour les paiements internationaux par carte.
- **Cash :** Pour les réservations effectuées directement en agence.

## 3. Sécurité des Tickets (Validation Hors-ligne)
Les tickets OPEP utilisent une signature numérique **RSA-SHA256**.
- **Signature :** Le backend signe les détails du ticket (Passager, Trajet, Siège) avec une clé privée.
- **QR Code :** Contient le Payload Base64 et la Signature.
- **Validation :** L'application du contrôleur (Portail Web ou Mobile) peut valider l'authenticité du ticket même sans connexion internet en utilisant la clé publique correspondante.

## 4. Base de Données
### Entités Principales
- `User` : Gestion des rôles (ADMIN, MANAGER, CONTROLLER, CLIENT).
- `Agency` : Modèle Multi-tenant (chaque agence a ses propres données).
- `Trip` : Voyages spécifiques avec date, heure et prix.
- `Route` : Définition des trajets (ex: Yaoundé - Douala).
- `Bus` : Capacité et plan des sièges.
- `Reservation` & `Passenger` : Détails de l'achat.
- `Ticket` : Instance de validation unique.

## 5. Déploiement
Le projet est prêt pour une conteneurisation via Docker :
- `api` : Image Node:20-alpine.
- `web/client` : Déploiement statique ou Node.js.
- `database` : PostgreSQL 15.
- `cache` : Redis 7.

---
Dernière mise à jour : Mercredi 3 Juin 2026.
