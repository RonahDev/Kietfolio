# =============================================================================
# Production Multi-Stage Dockerfile for Kietfolio Backend (Monorepo)
# =============================================================================

# Stage 1: Build TypeScript artifacts
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace configurations
COPY package*.json ./
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY apps/backend/package*.json ./apps/backend/

RUN npm ci

# Copy source files
COPY packages/shared-types/ ./packages/shared-types/
COPY apps/backend/ ./apps/backend/

# Build shared types and backend
RUN npm run build:types
RUN npm run build:backend

# Stage 2: Production Execution Image
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY apps/backend/package*.json ./apps/backend/

RUN npm ci --omit=dev

COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

WORKDIR /app/apps/backend

EXPOSE 5000

USER node

CMD ["node", "dist/server.js"]
