# Patterns & Conventions

- Tests-first development: write unit tests before adding code.
- Libraries
  - components/*: React components, tested with RTL/JSDOM.
  - core/*: framework-agnostic logic, consumable by Next/Nest.
  - api/*: NestJS modules/controllers/services only.
- Next API route: extract handler functions for unit testing.
- Env vars
  - `.env.local` for local secrets; `SPACE_TRADERS_ACCOUNT_TOKEN` required.
- Lint & Build
  - Project-scoped ESLint targets; auto-fix enabled.
  - Avoid including dist `.next/types` in tsconfig includes.
- Error handling
  - Nest controllers throw `HttpException({ statusCode, message }, status)`.
- Paths: use `@spacetraders/*` aliases, deep import subpaths for minimal bundles.

## API Access Pattern (MANDATORY)

- The UI must never call external services directly.
- Always proxy UI API requests through our Nest backend (and future backend services) for:
  - persistence (database writes/reads)
  - authentication/authorization
  - consistent error handling and audit
- Example:
  - UI route `app/api/create-new-agent` forwards to `POST {NEXT_PUBLIC_SERVICE_URL}/agents/register`.
  - `spacetraders-service` performs the SpaceTraders call and persists the `Agent` record before returning.
