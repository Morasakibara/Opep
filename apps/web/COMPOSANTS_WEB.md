# 🧩 Composants Web — Documentation

Cette documentation répertorie l'ensemble des composants, pages et utilitaires créés pour le portail web OPEP (`apps/web`).

---

## 📋 Table des matières

1. [Composants UI](#1-composants-ui)
   - [Toast](#11-toast)
   - [Button](#12-button)
   - [Input](#13-input)
2. [Composants de Layout](#2-composants-de-layout)
   - [Sidebar](#21-sidebar)
   - [Header](#22-header)
   - [Breadcrumbs](#23-breadcrumbs)
   - [PageTransition](#24-pagetransition)
   - [MobileNav](#25-mobilenav)
   - [NotificationCenter](#26-notificationcenter)
   - [ThemeToggle](#27-themetoggle)
3. [Pages](#3-pages)
   - [Settings](#31-settings)
   - [Forbidden (403)](#32-forbidden)
   - [Unauthorized (401)](#33-unauthorized)
4. [Utilitaires](#4-utilitaires)
   - [role.utils](#41-roleutils)
   - [api.service](#42-apiservice)
   - [AuthContext](#43-authcontext)
   - [LanguageContext](#44-languagecontext)
5. [Providers](#5-providers)
   - [Providers](#51-providers)
   - [ThemeProvider](#52-themeprovider)
   - [ToastProvider](#53-toastprovider)
6. [Protection d'accès](#6-protection-daccès)
   - [ProtectedRoute](#61-protectedroute)
   - [Can](#62-can)

---

## 1. Composants UI

### 1.1 Toast

**Fichier :** `apps/web/components/ui/Toast.tsx`

Système de notifications toast avec contexte React.

#### Types supportés

| Type | Couleur | Durée | Icône |
|------|---------|-------|-------|
| `success` | Vert (`success_green`) | 4s | `CheckCircle2` |
| `error` | Rouge (`error_red`) | 6s | `AlertCircle` |
| `info` | Primaire (`primary`) | 4s | `Info` |
| `warning` | Jaune (`warning_yellow`) | 5s | `AlertTriangle` |

#### Utilisation

```tsx
import { useToast } from '@/components/ui/Toast';

function MonComposant() {
  const toast = useToast();

  const handleAction = () => {
    toast.success('Titre', 'Message optionnel');
    toast.error('Erreur', 'Description détaillée');
    toast.info('Information', 'Contenu informatif');
    toast.warning('Attention', 'Message d\'avertissement');
  };
}
```

#### Architecture

- **`ToastProvider`** : Contexte React englobant l'application (dans `Providers.tsx`)
- **`useToast()`** : Hook exposant `success()`, `error()`, `info()`, `warning()`
- Les toasts s'affichent en bas à droite avec animation `slide-in-from-right`
- Auto-disparition avec durée configurable (`duration` en ms, 0 = persistant)
- Fallback SSR pour éviter les erreurs de rendu côté serveur

---

### 1.2 Button

**Fichier :** `apps/web/components/ui/Button.tsx`

Composant bouton réutilisable avec variants et effet ripple.

#### Variants

| Variant | Usage | Classes |
|---------|-------|---------|
| `primary` | Action principale | Fond primary, ombre |
| `secondary` | Action secondaire | Fond secondary |
| `outline` | Action discrète | Bordure, fond transparent |
| `ghost` | Action minimale | Aucun fond ni bordure |
| `danger` | Action destructive | Rouge, fond transparent |

#### Tailles

| Taille | Usage |
|--------|-------|
| `sm` | Petits boutons |
| `md` | Taille par défaut |
| `lg` | Boutons importants |
| `icon` | Boutons icône uniquement |

#### Props

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  noRipple?: boolean;
}
```

---

### 1.3 Input

**Fichier :** `apps/web/components/ui/Input.tsx`

Composant champ de saisie avec label, icônes et état d'erreur.

#### Props

```tsx
interface InputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

---

## 2. Composants de Layout

### 2.1 Sidebar

**Fichier :** `apps/web/components/layout/Sidebar.tsx`

Navigation latérale gauche (desktop uniquement).

#### Sections

- **Gestion** : Dashboard, Compagnies, Centres, Trajets, Bus, Employés, Conducteurs, Paiements, Rapports
- **Opérations** : Suivi GPS, Horaires, Sièges, Factures, Scans Offline, Messages, Notifications, Incidents, Réclamations, Avis, Abonnements
- **Pied** : **Paramètres** (nouveau !) → `/settings`, Aide

#### Fonctionnalités

- Surbrillance de l'élément actif avec indicateur visuel (pastille + flèche)
- Animation au survol (scale, couleur)
- Bouton "Nouveau Trajet" → redirige vers `/trips`
- Logo OPEP avec rotation 3D

#### Routes Dashboard

Voir la liste complète dans `Breadcrumbs.tsx` (`PATH_LABELS`).

---

### 2.2 Header

**Fichier :** `apps/web/components/layout/Header.tsx`

Barre d'en-tête supérieure avec :

- **Recherche globale** : champ de recherche avec placeholder configurable
- **ThemeToggle** : bascule thème clair/sombre
- **Bouton langue** : FR/EN via `LanguageContext`
- **NotificationCenter** : dropdown notifications
- **Déconnexion** : bouton logout avec confirmation
- **Profil utilisateur** : nom, rôle, avatar

#### Props

```tsx
interface HeaderProps {
  title?: string;       // défaut: "Super Admin"
  placeholder?: string; // défaut: "Rechercher..."
}
```

---

### 2.3 Breadcrumbs

**Fichier :** `apps/web/components/layout/Breadcrumbs.tsx`

Fil d'Ariane dynamique affiché sous le Header.

#### Fonctionnement

- Lit le chemin courant via `usePathname()`
- Mappe chaque segment à un label français via `PATH_LABELS`
- Affiche `Accueil > Section > Sous-section` avec séparateurs chevron
- Masqué sur la page d'accueil du dashboard (`/dashboard`)

#### Mapping des routes

```typescript
const PATH_LABELS: Record<string, string> = {
  'dashboard': 'Tableau de bord',
  'trips': 'Trajets',
  'buses': 'Bus',
  'drivers': 'Conducteurs',
  // ... toutes les routes dashboard
};
```

#### Fallback

Si un segment n'est pas dans le mapping, le label est généré automatiquement :
`segment-name` → `Segment Name` (capitalize + remplacement des tirets)

---

### 2.4 PageTransition

**Fichier :** `apps/web/components/layout/PageTransition.tsx`

Système d'animation de transition entre les pages.

#### Phases d'animation

| Phase | Descriptif | Durée |
|-------|------------|-------|
| `leaving` | Page qui disparaît : fade out + slide up + scale down + blur | 200ms |
| `entering` | Page qui apparaît : fade in + slide up from bottom | 400ms |
| `visible` | Page stable, visible | — |

#### StaggeredItem

Composant pour les animations d'apparition en cascade (liste, grille).

```tsx
<StaggeredItem index={0} delay={75} animation="slide-up">
  Premier élément
</StaggeredItem>
<StaggeredItem index={1} animation="scale-in">
  Deuxième élément
</StaggeredItem>
<StaggeredItem index={2} animation="fade-in">
  Troisième élément
</StaggeredItem>
```

#### Props de StaggeredItem

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `index` | `number` | `0` | Position dans la séquence |
| `delay` | `number` | `75` | Délai en ms entre chaque élément |
| `animation` | `'slide-up' \| 'scale-in' \| 'fade-in'` | `'slide-up'` | Type d'animation |

---

### 2.5 MobileNav

**Fichier :** `apps/web/components/dashboard/MobileNav.tsx`

Barre de navigation mobile en bas de l'écran.

- 5 icônes : Dashboard, Agences, Nouveau (action), Trajets, Paramètres
- Le bouton "Nouveau" est surélevé avec cercle primary
- Masqué sur desktop (visible uniquement en `md:hidden`)

---

### 2.6 NotificationCenter

**Fichier :** `apps/web/components/layout/NotificationCenter.tsx`

Dropdown de notifications.

- 3 notifications mock (succès, avertissement, info)
- Indicateur de non-lu (pastille rouge animée)
- Badge de compteur "3 non lues"
- Bouton "Voir tout"

---

### 2.7 ThemeToggle

**Fichier :** `apps/web/components/layout/ThemeToggle.tsx`

Bascule thème clair/sombre.

- Utilise `useTheme()` du `ThemeProvider`
- Icône `Sun` en mode sombre, `Moon` en mode clair
- Évite l'hydratation mismatch avec état `mounted`

---

## 3. Pages

### 3.1 Settings

**Fichier :** `apps/web/app/(dashboard)/settings/page.tsx`

Page de paramètres complète avec 4 sections :

| Section | Contenu |
|---------|---------|
| **Profil** | Nom modifiable + Email (lecture seule) + Rôle affiché en français |
| **Notifications** | 3 toggles (WhatsApp, SMS, Email) avec persistance localStorage |
| **Apparence** | Thème Clair/Sombre + Langue FR/EN |
| **Sécurité** | Formulaire changement de mot de passe (actuel + nouveau + confirmation) |
| **Déconnexion** | Bouton de déconnexion avec style danger |

#### Colonnes

- **Gauche** : Carte utilisateur sticky + navigation interne vers chaque section
- **Droite** : Sections déroulantes avec glass-card

#### Mapping des rôles

```typescript
const ROLE_LABELS: Record<string, string> = {
  ADMIN_PLATFORM: 'Super Administrateur',
  COMPANY_DIRECTOR: 'Directeur',
  CENTRE_MANAGER: 'Gestionnaire de centre',
  AGENCY_MANAGER: "Manager d'agence",
  CASHIER: 'Caissier',
  CONTROLLER: 'Contrôleur',
  DRIVER: 'Chauffeur',
  CLIENT: 'Client',
};
```

#### Notifications persistées

Les préférences de notification sont sauvegardées dans `localStorage` avec la clé `opep-notification-prefs`. Au chargement de la page, les préférences sont restaurées automatiquement. Si les données sont corrompues, les valeurs par défaut sont utilisées.

---

### 3.2 Forbidden (403)

**Fichier :** `apps/web/app/(auth)/forbidden/page.tsx`

Page d'accès interdit.

- Design : glass-card centré avec fond flouté
- Icône : `LockKeyhole` (cadenas)
- Message : "Accès interdit" + description RBAC
- Actions : retour au Dashboard ou connexion
- Info supplémentaire : explication du système de contrôle d'accès par rôles

---

### 3.3 Unauthorized (401)

**Fichier :** `apps/web/app/(auth)/unauthorized/page.tsx`

Page d'accès non autorisé.

- Design : glass-card centré avec fond flouté
- Icône : `ShieldAlert` (bouclier alerte)
- Message : "Accès non autorisé" + permissions insuffisantes
- Actions : retour au Dashboard ou connexion

---

## 4. Utilitaires

### 4.1 role.utils

**Fichier :** `apps/web/lib/role.utils.ts`

Utilitaires de vérification des rôles.

```typescript
type Role = 'ADMIN_PLATFORM' | 'COMPANY_DIRECTOR' | 'CENTRE_MANAGER' 
         | 'AGENCY_MANAGER' | 'CASHIER' | 'CONTROLLER' | 'DRIVER' | 'CLIENT';
```

#### Fonctions

| Fonction | Description |
|----------|-------------|
| `isAdminRole(role?)` | Vérifie si le rôle est admin (ADMIN_PLATFORM, COMPANY_DIRECTOR, CENTRE_MANAGER, AGENCY_MANAGER) |
| `isStaffRole(role?)` | Vérifie si le rôle est staff (pas CLIENT ni DRIVER) |
| `hasRole(role, expected)` | Vérifie si le rôle correspond à un ou plusieurs rôles attendus |

Une copie est disponible dans `packages/shared-types/src/role.utils.ts` pour les autres packages du monorepo.

---

### 4.2 api.service

**Fichier :** `apps/web/services/api.service.ts`

Service API centralisé avec typage fort.

#### Méthodes disponibles par module

| Module | Méthodes |
|--------|----------|
| **authApi** | login, register, refresh, sendOtp, verifyOtp, changePassword, resetPassword, getProfile, updateProfile, logout |
| **tripsApi** | getAll, getAvailable, search, getById, getSeats, updateStatus, create, update, remove |
| **routesApi** | getAll, getCities, search, getById, create, update, remove |
| **busesApi** | getAll, getById, create, update, remove |
| **usersApi** | getAll, getById, create, update, activate, remove |
| **agenciesApi** | getAll, getById, getStats, create, update, remove |
| **companiesApi** | getAll, getById, create, update, remove, getStats |
| **centresApi** | getAll, getById, create, update, remove, getRanking |
| **reservationsApi** | getAll, getMyReservations, getById, create |
| **ticketsApi** | getMyTickets, getById, getByReservation, generateTickets, validate |
| **paymentsApi** | initiate, process, getByReservation, deposit, payBalance, refund |
| **driversApi** | getAll, getById, getPerformance, rateDriver |
| **incidentsApi** | getAll, getById, create, resolve |
| **messagesApi** | getAll, send |
| **complaintsApi** | **getAll** (nouveau), getMy, getByCentre, getByCompany, getById, create, updateStatus |
| **notificationsApi** | getMyNotifications |
| **billingsApi** | getAll, getByCompany, markPaid |
| **offlineScanApi** | getAll, getUnsynced, getByDevice, getById, verify, syncBatch, create |
| **reviewsApi** | getByAgency, getAgencyStats, create |
| **reportsApi** | getDashboard, getRevenue, getHealth |
| **subscriptionsApi** | getPackages, subscribe, getStatus |
| **schedulesApi** | getAll, getCities, getByRoute, getById, create, update, remove |
| **seatsApi** | getByTrip, getAvailable, create, bulkCreate, lock, unlock, remove |
| **configApi** | healthCheck, getPublicKey |

#### Pagination automatique

`fetchApi` dépaquette automatiquement les réponses paginées au format `{ data: [...], meta: {...} }` → retourne uniquement le tableau.

---

### 4.3 AuthContext

**Fichier :** `apps/web/context/AuthContext.tsx`

Contexte d'authentification.

#### Interface User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN_PLATFORM' | 'COMPANY_DIRECTOR' | 'CENTRE_MANAGER' 
      | 'AGENCY_MANAGER' | 'CASHIER' | 'CONTROLLER' | 'DRIVER' | 'CLIENT';
}
```

#### Hook : `useAuth()`

```typescript
const { user, isAuthenticated, isLoading, login, logout } = useAuth();
```

#### Fonctionnement

- Stockage JWT + User dans `localStorage` (clés `opep_token`, `opep_user`)
- Vérification de session au montage
- Fallback SSR sécurisé (pas d'accès à localStorage côté serveur)

---

### 4.4 LanguageContext

**Fichier :** `apps/web/context/LanguageContext.tsx`

Gestion de la langue (FR/EN).

#### Hook : `useTranslation()`

```typescript
const { language, setLanguage, t } = useTranslation();
// language: 'fr' | 'en'
// setLanguage: déclenche localStorage + reload navigateur
// t: fonction de traduction (dictionnaire à compléter)
```

#### Stockage

- Clé localStorage : `opep-language`
- Valeurs : `'fr'` (défaut) ou `'en'`
- Le changement de langue provoque un `window.location.reload()` pour réappliquer les traductions

---

## 5. Providers

### 5.1 Providers

**Fichier :** `apps/web/components/providers/Providers.tsx`

Composant racine qui encapsule l'application avec tous les providers nécessaires.

#### Ordre d'imbrication

```
QueryClientProvider (TanStack React Query)
└── ThemeProvider (thème clair/sombre)
    └── LanguageProvider (FR/EN)
        └── AuthProvider (authentification JWT)
            └── ToastProvider (notifications toast)
                └── {children}
```

### 5.2 ThemeProvider

**Fichier :** `apps/web/components/providers/ThemeProvider.tsx`

Gestion du thème clair/sombre.

- Stockage localStorage (clé `opep-theme`)
- Synchronisation via classe `.dark` / `.light` sur `<html>`
- Valeur par défaut : `dark`
- Hook : `useTheme()` → `{ theme, setTheme }`

### 5.3 ToastProvider

**Fichier :** inclus dans `Toast.tsx`

Fournisseur de notifications toast.

- À ajouter dans l'arbre des providers (déjà fait dans `Providers.tsx`)
- Le conteneur de toasts est rendu en `fixed bottom-6 right-6 z-[9999]`

---

## 6. Protection d'accès

### 6.1 ProtectedRoute

**Fichier :** `apps/web/components/auth/ProtectedRoute.tsx`

Composant de protection des routes par rôle.

#### Props

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Role[];           // Rôles autorisés (optionnel)
  fallback?: boolean;       // true = afficher inline error, false = redirect
}
```

#### Comportement

| Situation | Comportement |
|-----------|-------------|
| Non authentifié | Redirection vers `/login` |
| Rôle non autorisé (`fallback=false`) | Redirection vers `/unauthorized` |
| Rôle non autorisé (`fallback=true`) | Affichage inline d'un message d'erreur avec lien vers `/unauthorized` |
| Authentifié et rôle OK | Affichage du contenu |

### 6.2 Can

**Fichier :** `apps/web/components/auth/Can.tsx`

Composant conditionnel qui affiche/masque du contenu selon le rôle.

```tsx
<Can roles={['ADMIN_PLATFORM', 'AGENCY_MANAGER']} fallback={<p>Accès restreint</p>}>
  <AdminPanel />
</Can>
```

#### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `roles` | `Role[]` | requis | Rôles autorisés à voir le contenu |
| `children` | `ReactNode` | requis | Contenu à afficher si autorisé |
| `fallback` | `ReactNode` | `null` | Contenu alternatif si non autorisé |

---

## 📐 Patterns de conception

### Structure d'une page dashboard

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { IconName } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { apiModule } from '@/services/api.service';
import { PageSkeleton } from '@/components/layout/PageSkeleton';

export default function MaPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true); setError(null);
    try {
      const result = await apiModule.getAll();
      setData(result);
    } catch (err: any) {
      const msg = err.message || 'Erreur de chargement';
      setError(msg);
      toast.error('Titre', msg);
    } finally { setLoading(false); }
  }

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-8">
      <div className="animate-in slide-in-from-bottom duration-300">
        <h2 className="text-2xl font-bold text-on_surface">Titre</h2>
        <p className="text-on_surface_variant">Description.</p>
      </div>
      {/* Contenu avec glass-card */}
    </div>
  );
}
```

### Classes CSS réutilisables

| Classe | Usage |
|--------|-------|
| `glass-card` | Carte vitrée avec bordure et blur |
| `glass-card-hover` | Idem + effet hover (border primary, translate Y) |
| `input-field` | Champ de saisie standard |
| `input-label` | Label de champ (uppercase, bold) |
| `status-badge` | Badge d'état (succès, warning, danger, info) |
| `table-header` | En-tête de tableau |
| `table-row` | Ligne de tableau avec hover |

### Animations disponibles

| Classe | Effet |
|--------|-------|
| `animate-in fade-in` | Apparition en fondu |
| `slide-in-from-bottom` | Glissement depuis le bas |
| `slide-in-from-right` | Glissement depuis la droite |
| `zoom-in` | Zoom avant |
| `animate-pulse-soft` | Pulsation douce |
| `click-feedback` | Scale down au clic |
| `hover-lift` | Légère élévation au survol |

---

*Documentation générée le ${new Date().toLocaleDateString('fr-FR')} — Mise à jour automatique non garantie.*
