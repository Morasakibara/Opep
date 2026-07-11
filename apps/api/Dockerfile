# Base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# alpine-only glue: libc6-compat provides glibc-compatible symbols that
# the @node-rs/* prebuilt MUSL binaries (used by @node-rs/argon2 etc.)
# dynamically link against. Native-compiled deps are gone now (we removed
# bcrypt in favour of @node-rs/argon2 prebuilt binaries; pg/bullmq are
# pure JS), so python3/make/g++ are no longer required here. If a future
# native dep is added back, re-introduce `python3 make g++` on this line.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/qr-utils/package*.json ./packages/qr-utils/
RUN npm install

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Workspace packages declare `"main": "dist/index.js"` so apps/api cannot
# resolve them via TypeScript until the workspace dist files exist on disk.
# Build the workspace deps first, then the leaf (apps/api) which consumes them.
RUN npm run build --workspace=packages/shared-types --workspace=packages/qr-utils
RUN npm run build --workspace=apps/api

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/main"]
