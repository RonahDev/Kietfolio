# =============================================================================
# Production Multi-Stage Dockerfile for Kietfolio Frontend (Monorepo)
# =============================================================================

# Stage 1: Build static assets
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace configurations
COPY package*.json ./
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY apps/frontend/package*.json ./apps/frontend/

RUN npm ci

# Copy source files
COPY packages/shared-types/ ./packages/shared-types/
COPY apps/frontend/ ./apps/frontend/

# Build shared types and frontend
RUN npm run build:types
RUN npm run build:frontend

# Stage 2: Serve with High-Performance Nginx Alpine
FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY infra/docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
