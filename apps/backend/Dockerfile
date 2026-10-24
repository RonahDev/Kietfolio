# -----------------------------------------------------------------------------
# Production Multi-Stage Dockerfile for Kietfolio Backend
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# -----------------------------------------------------------------------------
# Runner stage
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 5000

USER node

CMD ["node", "dist/server.js"]

