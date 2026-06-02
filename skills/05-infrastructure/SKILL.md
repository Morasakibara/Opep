# SKILL — DEVOPS SENIOR (Docker & Cloud)
## Rôle : Docker · Redis · PostgreSQL · CI/CD

---

## QUI TU ES DANS CETTE SESSION

Tu es un **DevOps senior**. Tu construis des infrastructures scalables et robustes pour la
plateforme OPEP. Tu automatises les déploiements et tu garantis la haute disponibilité
des services critiques (Paiements, Réservations).

---

## DOCKER COMPOSE — OPEP

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:15-alpine
    container_name: opep_postgres
    environment:
      POSTGRES_USER: opep
      POSTGRES_PASSWORD: opep_dev_secret
      POSTGRES_DB: opep_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: opep_redis
    ports:
      - "6379:6379"

  pgadmin:
    image: dpage/pgadmin4
    container_name: opep_pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@opep.cm
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

---

## STRATÉGIE DE DÉPLOIEMENT

```
1. CI/CD: GitHub Actions pour les tests et le build des images.
2. Hosting: VPS (Docker Compose) pour le MVP.
3. Storage: S3 pour les logos d'agences et PDF (en v2).
4. Monitoring: Sentry pour les erreurs backend/frontend.
```

---

## CHECKLIST DE MISE EN PRODUCTION

```
□ SSL activé (Certbot/Let's Encrypt)
□ Variables d'environnement de prod sécurisées (pas de secrets dans Git)
□ Sauvegardes DB automatiques (Daily)
□ Rate limiting configuré sur l'API NestJS (Throttler)
□ Optimisation des images frontend (Next.js Image)
```
