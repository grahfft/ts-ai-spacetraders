# Quickstart

- Install: `pnpm install`
- Lint (auto-fix): `pnpm run lint`
- Test: `pnpm run test`
- Build all: `pnpm run build`
- Dev UI: `pnpm start` (Next.js app)

Env:
- Copy `.env.example` → `.env.local`, set `SPACE_TRADERS_ACCOUNT_TOKEN`.

Add a new component lib:
- Use Nx generators; export under `libs/components/*`, add tests.
