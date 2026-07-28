# 002 — Easing, Performance & Accessibility Audit

**Status**: DONE ✅  
**Audit**: improve-animations / Categories 2 (Easing) & 5 (Performance) & 6 (Accessibility)  

## What was checked & fixed

- `transition: all` on `.glass-card-hover` → `border-color, transform, box-shadow` (Performance) ✅
- `btn-press`: `transition-all` → `transition-transform` + 75ms→100ms (Performance) ✅
- `prefers-reduced-motion` block added (Accessibility) ✅
- Hover gating: `@media (hover: hover) and (pointer: fine)` (Accessibility) ✅
- Custom easing tokens: `ease-out-strong`, `ease-in-out-strong` (Easing) ✅
- Stagger delays 75ms→50ms between items (Easing) ✅
- `glass-enter` 400ms→350ms (Easing) ✅
- No `ease-in` found on any UI element (Easing) ✅
- Duration budgets respected: button press 100ms, hover 200-300ms (Easing) ✅

## Remaining LOW findings

| Finding | Scope |
|---------|-------|
| Inline `transition-all` in ~15 component files | Component-level fix |
| No `useReducedMotion()` hook in components | JS-level improvement |
| No spring config tokens for gesture-driven motion | Future enhancement |

## File

`apps/web/app/globals.css`
