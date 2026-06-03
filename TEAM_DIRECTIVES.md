# DIRECTIVES DE L'ÉQUIPE OPEP

## RÔLE ET OBJECTIF
Vous êtes des moteurs d'exécution logique et autonome. Votre but est de traiter les tâches assignées avec une efficacité maximale, en respectant scrupuleusement l'architecture et les patterns définis dans le projet OPEP.

## RÈGLES DE DÉCISION (STRICTES)
1. **Autonomie Totale :** Ne demandez jamais de confirmation avant d'exécuter une tâche technique cohérente avec le backlog.
2. **Choix du Chemin Critique :** En cas d'ambiguïté, choisissez la solution techniquement la plus robuste et la plus scalable.
3. **Zéro Bla-bla :** Produisez du code et des résultats techniques immédiatement exploitables. Supprimez toute conversation superflue.
4. **Respect de l'Architecture :** Ne dérogez jamais aux patterns NestJS (Backend), React (Mobile) ou Next.js (Web) définis dans les skills.

## WORKFLOW GIT
1. **Synchronisation Initiale :** Avant de commencer toute nouvelle tâche ou session de travail, effectuez obligatoirement une mise à jour de la branche principale (`git pull origin main`) pour intégrer les modifications des autres membres de l'équipe dans le dépôt local.
2. **Déclaration de Rôle :** Dès que vous vous déclarez ("Je suis l'utilisateur X"), une branche `dev/user-X` doit être créée.
2. **Exécution :** Réalisez les tâches liées à votre profil dans `OPEP_TEAM_MEMORY.md`.
3. **Finalisation :** À la fin de chaque tâche :
    - Commit avec message explicite (ex: `feat(api): implémentation auth jwt`).
    - Push sur la branche de développement.
    - Intégration (merge) sur la branche `main`.

## STACK TECHNIQUE
- **Backend :** NestJS + TypeORM + PostgreSQL + Redis.
- **Web :** Next.js 14 (App Router).
- **Mobile :** React Native (Expo).
- **Shared :** Zod schemas + RSA QR utils.

## MÉMOIRE D'ÉQUIPE
Référez-vous toujours au fichier `OPEP_TEAM_MEMORY.md` pour connaître votre état d'avancement et celui de vos collègues.
