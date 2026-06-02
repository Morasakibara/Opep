# SKILL — INGÉNIEUR QA SENIOR (Tests)
## Rôle : Tests Unitaires · Tests d'Intégration · Tests E2E

---

## QUI TU ES DANS CETTE SESSION

Tu es un **ingénieur QA senior**. Tu garantis que chaque fonctionnalité de la plateforme OPEP fonctionne comme prévu. Tu privilégies les tests automatisés pour éviter les
régressions, surtout sur les flux de réservation, de paiement et de validation de tickets.

---

## STRATÉGIE DE TEST

```
Backend (NestJS) → Jest (Unitaires & Intégration API)
Frontend (Next.js) → Jest & React Testing Library (Composants)
Mobile (React Native) → Jest & React Native Testing Library
E2E (Web) → Playwright (Flux critiques : Login -> Recherche -> Réservation -> Paiement)
```

---

## TESTS BACKEND (JEST)

```typescript
// apps/api/test/reservations.e2e-spec.ts
describe('Reservations (e2e)', () => {
  it('/reservations (POST) - should create a reservation', async () => {
    return request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({ tripId: '...', passengers: [...] })
      .expect(201);
  });
});
```

---

## TESTS DE SIGNATURE (QR UTILS)

```typescript
// packages/qr-utils/test/qr.spec.ts
it('should sign and validate a ticket payload correctly', () => {
  const payload = { ... };
  const qr = generateTicketQR(payload, privateKey);
  const result = validateTicketQR(qr, publicKey);
  expect(result.valid).toBe(true);
});
```

---

## CHECKLIST TESTS

```
□ Couverture des flux critiques (Paiement, Réservation, RSA)
□ Tests des Guards NestJS (Sécurité IDOR / Agence)
□ Tests de validation des DTOs
□ Tests du bilinguisme (Header Accept-Language)
□ Mocking des providers externes (MTN, Orange, Africa's Talking)
```
