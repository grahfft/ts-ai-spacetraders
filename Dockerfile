# Dev container for Nx monorepo (Next.js + NestJS)
FROM node:20-alpine AS base

RUN apk add --no-cache bash libc6-compat openssl python3 make g++

# Enable corepack and pnpm
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /workspace

# Copy repo and install with frozen lockfile (network allowed)
COPY . .
RUN pnpm install -r --frozen-lockfile

ENV NODE_ENV=development

# Expose common dev ports
# - 4200: Next.js dev (spacetraders-ui via Nx)
# - 3000: NestJS dev (spacetraders-service)
EXPOSE 4200 3000

# Default command: run both apps (Next dev + Nest serve)
CMD ["sh","-lc","pnpm exec nx run spacetraders-service:serve & pnpm exec nx run spacetraders-ui:dev"]