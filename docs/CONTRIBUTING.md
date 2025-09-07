# Contributing

- Follow patterns in `docs/PATTERNS.md`.
- Always add tests first.
- Use `@spacetraders/*` path aliases and deep imports where applicable.
- UI goes under `libs/components/*`; core logic under `libs/core/*`; Nest modules under `libs/api/*`.
- Keep Next tsconfig lean (no dist `.next/types` include).
- Run lint/tests/build before pushing:
  - `pnpm run lint`
  - `pnpm run test`
  - `pnpm run build`
