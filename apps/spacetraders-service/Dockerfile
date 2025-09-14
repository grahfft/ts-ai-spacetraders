# syntax=docker/dockerfile:1.6

FROM node:20-alpine AS deps
WORKDIR /workspace
RUN apk add --no-cache bash libc6-compat openssl python3 make g++
ENV PNPM_HOME=/root/.local/share/pnpm \
    PNPM_STORE_PATH=/root/.pnpm-store
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@9 --activate
# Prime pnpm store using only the lockfile for max cache reuse
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store pnpm fetch

FROM node:20-alpine AS builder
WORKDIR /workspace
ENV PNPM_HOME=/root/.local/share/pnpm \
    PNPM_STORE_PATH=/root/.pnpm-store
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@9 --activate
# Copy full workspace and use the cache mount for fast installs
COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store pnpm install -r --frozen-lockfile
# Build service (webpack via Nx project target)
RUN pnpm exec nx build spacetraders-service --configuration=production

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy the entire dist/apps folder to avoid path mismatches
COPY --from=builder /workspace/dist/apps ./
# Install only runtime deps from generated package.json
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store if [ -f spacetraders-service/package.json ]; then cd spacetraders-service && pnpm install --prod; fi
EXPOSE 3000
CMD ["node", "spacetraders-service/main.js"]
