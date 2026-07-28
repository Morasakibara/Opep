# 001 — Standardize glass-card hover transitions

**Status**: DONE ✅  
**Audit**: improve-animations / Easing & duration, Performance  

## What was fixed

- `transition: all 0.3s ease` on `.glass-card-hover` → specific `border-color`, `transform`, `box-shadow` properties  
- `transition-all` on `.btn-press` → `transition-transform`  
- `btn-press` duration 75ms → 100ms (standard: 100-160ms)  
- `glass-enter` duration 400ms → 350ms (rare entrance, borderline UI)  

## File

`apps/web/app/globals.css`
