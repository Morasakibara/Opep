#!/usr/bin/env bash
# OPEP — End-to-end validation of the bcrypt → @node-rs/argon2 + bcryptjs migration.
# Run from Git Bash on Windows (or Linux/macOS):
#   bash scripts/validate-migration.sh
# Exits non-zero on first failure, surfaces the failing step clearly.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

step() { echo -e "\n\e[1;36m▶ $*\e[0m"; }
fail() { echo -e "\n\e[1;31m✗ FAILED: $*\e[0m"; exit 1; }
ok()   { echo -e "\e[1;32m✓ $*\e[0m"; }

step "1. Sanity: lockfile and Dockerfile state"
test -f package-lock.json || fail "package-lock.json missing — run from root after npm install"
grep -q 'package-lock=true' .npmrc || fail ".npmrc missing package-lock=true"
grep -q 'lockfile-version=3' .npmrc || fail ".npmrc missing lockfile-version=3"
grep -q "@next/swc-linux-x64-musl" package-lock.json || fail "Musl swc not locked"
grep -q "@node-rs/argon2" apps/api/package.json || fail "@node-rs/argon2 not in apps/api/package.json"
grep -q "bcryptjs" apps/api/package.json || fail "bcryptjs not in apps/api/package.json"
grep -E '"bcrypt"\s*:' apps/api/package.json && fail "leftover bcrypt dependency" || ok "bcrypt dependency removed"
# Tightened assertion: only an actual `apk add ... python3 ... make ... g++`
# install line (the literal toolchain that needs ~250 MB and a multi-minute
# apk fetch) matters. Comments referencing the removed packages are allowed
# and even encouraged for migration grep-ability.
grep -E 'apk add[^&]*\bpython3\b.*\b(make|g\+\+)\b' apps/api/Dockerfile && fail "leftover python3/make/g++ in api Dockerfile" || ok "api Dockerfile is trimmed"
grep -E 'apk add[^&]*\bpython3\b.*\b(make|g\+\+)\b' apps/web/Dockerfile && fail "leftover python3/make/g++ in web Dockerfile" || ok "web Dockerfile is trimmed"
grep -q "workspace=packages/shared-types" apps/api/Dockerfile || fail "api Dockerfile missing workspace pre-build"
grep -q "workspace=packages/shared-types" apps/web/Dockerfile || fail "web Dockerfile missing workspace pre-build"
ok "All static checks passed"

step "2. Docker build (api + web, --no-cache)"
docker compose -f docker-compose.yml build --no-cache --progress=plain api web
ok "Docker images built (api + web)"

step "3. Bring stack up"
docker compose -f docker-compose.yml up -d
ok "Stack is up"

step "4. Wait for Postgres readiness"
for i in {1..30}; do
  if docker compose -f docker-compose.yml exec -T postgres pg_isready -U opep >/dev/null 2>&1; then
    ok "Postgres ready after ${i}s"; break
  fi
  sleep 1
  if [ "$i" = "30" ]; then fail "Postgres not ready after 30s"; fi
done

step "5. Wait for Redis readiness"
for i in {1..30}; do
  if docker compose -f docker-compose.yml exec -T redis redis-cli ping >/dev/null 2>&1; then
    ok "Redis ready after ${i}s"; break
  fi
  sleep 1
  if [ "$i" = "30" ]; then fail "Redis not ready after 30s"; fi
done

step "6. Wait for api readiness (HTTP probe)"
for i in {1..60}; do
  if curl -fsS http://localhost:3000/api/v1/health >/dev/null 2>&1; then
    ok "api HTTP ready after ${i}s"; break
  fi
  sleep 1
  if [ "$i" = "60" ]; then fail "api not HTTP-ready after 60s — check: docker compose logs api"; fi
done

step "7. Build and seed API (argon2id hashes)"
cd "$ROOT/apps/api"
npm run build
# Seed runs as a one-shot process; do not run inside the container.
DATABASE_URL=${DATABASE_URL:-postgres://opep:opep@localhost:5432/opep} \
REDIS_URL=${REDIS_URL:-redis://localhost:6379} \
  node dist/seed.js
ok "Seed completed (passwords now argon2id-shaped)"

step "8. Inspect a passwordHash via psql"
HASH=$(docker compose -f docker-compose.yml exec -T postgres \
  psql -U opep -d opep -At -c "SELECT \"passwordHash\" FROM users WHERE email='admin@opep.cm' LIMIT 1;")
echo "  hash: $HASH"
case "$HASH" in
  \$argon2id\$*) ok "argon2id hash format confirmed";;
  *) fail "expected \$argon2id\$ prefix, got: $HASH";;
esac

step "9. Smoke login (admin@opep.cm / 123456)"
RESP=$(curl -sS -w "\nHTTP %{http_code}\n" -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin@opep.cm","password":"123456"}')
echo "$RESP"
echo "$RESP" | grep -q "HTTP 20" && ok "Smoke login returned 2xx" || fail "Smoke login did not return 2xx"

step "10. Optional: verify legacy migration path"
HASH_AT=$(docker compose -f docker-compose.yml exec -T postgres \
  psql -U opep -d opep -At -c "SELECT \"passwordHash\" FROM users WHERE email='adrian@email.com' LIMIT 1;")
echo "  client hash: $HASH_AT"
case "$HASH_AT" in
  \$argon2id\$*) ok "client hash is argon2id (seed wrote it directly)";;
  *) fail "client hash format unexpected";;
esac

ok "✅ All migration validations passed"
