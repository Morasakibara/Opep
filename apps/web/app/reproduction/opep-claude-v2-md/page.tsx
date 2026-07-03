'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const markdownContent = `# OPEP — Plateforme de Gestion de Transport Interurbain
## Fichier de spécification pour Claude Code / Gemini CLI — v2.0

> **IMPORTANT — LIRE EN PREMIER**
> Ce fichier est la source unique de vérité pour construire le projet OPEP.
> Ne jamais deviner une règle métier. Si une ambiguïté subsiste, implémenter l'option la plus restrictive/sécurisée et laisser un commentaire \`TODO:\` dans le code.
> **Langue :** Le projet est bilingue français/anglais (FR/EN). Toute chaîne visible par l'utilisateur doit être externalisée dans les fichiers de traduction. Ne jamais hardcoder du texte UI.

---

## 0. Résumé exécutif

OPEP est une plateforme de réservation de tickets de transport interurbain au Cameroun.
Elle comporte trois surfaces : une **application mobile Flutter** (clients), un **portail web Next.js PWA** (agences), et un **backend NestJS** central. Les tickets sont sécurisés par QR code signé RSA, valides hors-ligne. Les paiements supportés sont MTN Mobile Money, Orange Money et Stripe (cartes). Les notifications sont envoyées par WhatsApp ou SMS via Africa's Talking, selon la préférence du client. La plateforme est entièrement bilingue FR/EN.

---

## 1. Stack technique — décisions finales (non négociables)

| Couche | Technologie | Version cible |
|---|---|---|
| Backend API | NestJS (TypeScript) | v10+ |
| ORM | TypeORM | v0.3+ |
| Base de données | PostgreSQL | v15+ |
| Cache | Redis | v7+ |
| Message Queue | BullMQ (Redis-backed, pas Kafka pour le dev local) | v5+ |
| Mobile | Flutter | v3.19+ (Dart 3) |
| Web Portail | Next.js 14 (App Router) + TailwindCSS | v14+ |
| Auth | JWT access token (15min) + Refresh token (7j) avec rotation | — |
| i18n Backend | nestjs-i18n | v10+ |
| i18n Web | next-intl (détection par cookie, pas de préfixe URL) | v3+ |
| i18n Mobile | flutter_localizations + intl (ARB) | SDK |
| Notifications | Africa's Talking (SMS + WhatsApp) + Nodemailer (email) | — |
| PDF | @react-pdf/renderer (génération côté serveur) | v3+ |
| Containerisation | Docker + Docker Compose (dev local uniquement) | — |
| Structure repo | Monorepo — un seul dépôt Git | — |
| Tests | Jest (backend), Flutter test (mobile), Playwright (web E2E) | — |

---

## 20. Contraintes et règles non négociables

1. **Ne jamais utiliser \`synchronize: true\`** dans la config TypeORM en dehors des tests. Toujours passer par des migrations.
2. **Ne jamais logger** les données sensibles (tokens JWT, données bancaires, mots de passe, payloads QR en clair, numéros de téléphone complets).
3. **Toujours valider** les DTOs avec \`class-validator\` avant tout traitement.
4. **Soft delete uniquement** — ne jamais supprimer physiquement les enregistrements en base.
5. **Idempotence des webhooks** — vérifier si le \`providerTransactionId\` a déjà été traité avant de mettre à jour le paiement.
6. **Isolation agence** — chaque requête d'un staff d'agence doit filtrer par \`agencyId\` extrait du token JWT, jamais depuis le body de la requête.
7. **La clé privée RSA ne doit jamais être retournée par l'API**, ni loggée, ni committée dans Git. \`apps/api/keys/\` dans \`.gitignore\`.
8. **Audit log** — logger dans \`AuditLog\` toute action critique : scan ticket, annulation, remboursement, changement de statut paiement, publication document légal.
9. **Verrou siège atomique** — toujours utiliser \`SET NX EX\` (Redis) pour le blocage de siège. Un \`SET\` simple sans \`NX\` est interdit.
10. **Refresh token rotation** — un refresh token utilisé une fois est immédiatement invalidé. Token déjà invalidé présenté → invalider toute la famille.
11. **Montants en entier XAF** — aucun \`decimal\` ou \`float\` pour les montants. Stocker et calculer en integer.
12. **Toute chaîne UI externalisée** — aucun texte visible par l'utilisateur ne doit être hardcodé. Toujours passer par les fichiers i18n (fr/en).
13. **Retry BullMQ obligatoire** — tout job BullMQ doit définir \`attempts: 5\` avec backoff exponentiel. Un job sans retry est interdit en production.
14. **Consentement légal vérifié** — le backend doit rejeter toute inscription sans \`privacyPolicyVersion\` et \`termsVersion\` valides dans le body.

---

*Fin du fichier de spécification OPEP v2.0*
*Généré pour utilisation avec Claude Code et Gemini CLI*`;

export default function OpepClaudeV2MdReproductionPage() {
  return (
    <div className="min-h-screen bg-[#111316] text-[#e2e2e6] overflow-x-hidden">
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <div className="prose prose-invert max-w-none 
          prose-headings:text-primary prose-headings:font-bold 
          prose-h1:text-4xl prose-h1:border-b prose-h1:border-charcoal_border prose-h1:pb-4 prose-h1:mb-8
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8
          prose-p:text-on_surface_variant prose-p:leading-relaxed
          prose-strong:text-on_surface
          prose-code:text-primary prose-code:bg-surface_container prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-surface_container prose-pre:border prose-pre:border-charcoal_border prose-pre:rounded-2xl
          prose-blockquote:border-l-primary prose-blockquote:text-on_surface_variant
          prose-table:text-sm prose-th:text-on_surface prose-th:bg-surface_container prose-td:text-on_surface_variant
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-ul:text-on_surface_variant prose-ol:text-on_surface_variant
          prose-li:marker:text-primary
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
