# Base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Native modules are gone (bcrypt was swapped for @node-rs/argon2 prebuilt
# binaries; pg/bullmq are pure JS), so only libc6-compat is needed for
# the Next.js SWC prebuilt MUSL binaries. python3/make/g++ were removed
# to shrink the build context and shave a few seconds off the install.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/qr-utils/package*.json ./packages/qr-utils/
RUN npm install

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1
# Workspace packages declare `"main": "dist/index.js"` so apps/web (Next.js)
# cannot import `@opep/shared-types` or `@opep/qr-utils` via the symlinks in
# node_modules until the workspace dist files exist on disk. Build deps first.
RUN npm run build --workspace=packages/shared-types --workspace=packages/qr-utils
RUN npm run build --workspace=apps/web

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start", "--workspace=apps/web"]
