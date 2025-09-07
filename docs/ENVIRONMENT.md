# Environment

- `.env.local` (never commit) must include:
  - `SPACE_TRADERS_ACCOUNT_TOKEN`: your SpaceTraders account token

- Next app reads `.env.local`; Nest service uses `dotenv` in `apps/spacetraders-service/src/main.ts`.
- CORS: Enabled in Nest for localhost development.
