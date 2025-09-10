# Environment

- `.env.local` (never commit) must include:
  - `SPACE_TRADERS_ACCOUNT_TOKEN`: your SpaceTraders account token
  - `NEXT_PUBLIC_SERVICE_URL` or `SERVICE_URL`: Nest API base, e.g. `http://localhost:3001/api`
  - `CORS_ORIGINS` (Nest only, optional): comma-separated allowed origins, e.g. `http://localhost:4200,http://localhost:3000`

- Next app reads `.env.local`; Nest service uses `dotenv` in `apps/spacetraders-service/src/main.ts`.
- CORS: Enabled in Nest for localhost development.

## Non-Docker deployment

- Backend (Nest):
  - Set env: `SPACE_TRADERS_ACCOUNT_TOKEN`, `CORS_ORIGINS` (allowed site origins)
  - Start: `pnpm exec nx run spacetraders-service:serve`
- Frontend (Next):
  - Set env: `NEXT_PUBLIC_SERVICE_URL=http://<your-backend-host>:<port>/api`
  - Start dev: `pnpm exec nx run spacetraders-ui:dev`
  - Or build/start prod: `pnpm exec nx run spacetraders-ui:build` and serve with your platform
