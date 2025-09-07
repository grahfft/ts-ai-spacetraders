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
