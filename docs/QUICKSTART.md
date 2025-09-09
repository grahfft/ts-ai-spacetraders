# Quickstart

- Install: `pnpm install`
- Lint (auto-fix): `pnpm run lint`
- Test: `pnpm run test`
- Build all: `pnpm run build`
- Dev UI: `pnpm start` (Next.js app)

Env:
- Copy `.env.example` → `.env.local`, set `SPACE_TRADERS_ACCOUNT_TOKEN`.
 - Set `NEXT_PUBLIC_SERVICE_URL` to your Nest base URL with prefix (e.g., `http://localhost:3001/api`).
 - The backend uses the `SPACE_TRADERS_ACCOUNT_TOKEN` from the server env for listing/persisting; no browser localStorage required.

Add a new component lib:
- Use Nx generators; export under `libs/components/*`, add tests.

API Access:
- UI must proxy through the Nest service; do not call external APIs directly from the UI.
