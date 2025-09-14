# syntax=docker/dockerfile:1.6

FROM node:20-alpine AS deps
WORKDIR /workspace
RUN apk add --no-cache bash libc6-compat openssl python3 make g++
ENV PNPM_HOME=/root/.local/share/pnpm \
    PNPM_STORE_PATH=/root/.pnpm-store
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store pnpm fetch

FROM node:20-alpine AS builder
WORKDIR /workspace
ENV PNPM_HOME=/root/.local/share/pnpm \
    PNPM_STORE_PATH=/root/.pnpm-store
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store pnpm install -r --frozen-lockfile
# Build Next app with cache for .next/cache only
RUN --mount=type=cache,target=/workspace/apps/spacetraders-ui/.next/cache pnpm exec nx build spacetraders-ui

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy the Next standalone output (Next/Nx emits a standalone dir under dist)
COPY --from=builder /workspace/dist/apps/spacetraders-ui ./
# Next standalone typically includes node_modules; if not, install prod deps
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@9 --activate
# Only install if package.json exists in output (no-op otherwise)
RUN if [ -f package.json ]; then pnpm install --prod; fi
EXPOSE 4200
CMD ["node", ".next/standalone/server.js"]
