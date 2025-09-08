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
Use the included compose for DB only:
```bash
cd apps/spacetraders-service
docker compose up -d
```
Then run the dev container in another terminal:
```bash
docker run --rm \
  -p 4200:4200 -p 3000:3000 \
  --env POSTGRES_HOST=host.docker.internal \
  --env-file .env.local \
  ts-ai-dev
```

## Notes
- `.dockerignore` keeps image size and context small.
- The Dockerfile uses `pnpm fetch` for deterministic, cached deps installation.
- Stop the container with Ctrl+C (or `docker rm -f <container>` if detached).
