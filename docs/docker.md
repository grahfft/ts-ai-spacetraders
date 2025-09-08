# Docker (Dev)

This repo includes a Dockerfile to run the Nx workspace (Next.js frontend + NestJS backend) for local development.

## Prerequisites
- Docker installed
- A `.env.local` file at the repo root (for SpaceTraders token and DB settings). You can start from `env.example`.

## Build image
```bash
docker build -t ts-ai-dev .
```

## Run container
Expose frontend (4200) and backend (3000):
```bash
docker run --rm -p 4200:4200 -p 3000:3000 --env-file .env.local ts-ai-dev
```

The container starts:
- spacetraders-service (NestJS) on port 3000
- spacetraders-ui (Next.js) on port 4200

## With PostgreSQL (optional)
Run everything with Docker Compose (db + api + web):
```bash
docker compose up --build -d
```
This will start:
- Postgres (service: db)
- Nest API (service: api)
- Next UI (service: web)

If you prefer DB-only via compose:
```bash
docker compose up -d db
```
Then run the dev container separately:
```bash
docker run --rm -p 3000:3000 --env POSTGRES_HOST=host.docker.internal --env-file .env.local ts-ai-dev sh -lc "pnpm exec nx run spacetraders-service:serve"
docker run --rm -p 4200:4200 --env-file .env.local ts-ai-dev sh -lc "pnpm exec nx run spacetraders-ui:dev"
```

## Notes
- `.dockerignore` keeps image size and context small.
- The Dockerfile installs with `--frozen-lockfile` to ensure versions match `pnpm-lock.yaml`.
- Stop the container with Ctrl+C (or `docker rm -f <container>` if detached).
