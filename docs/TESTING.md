# Testing

- Unit tests only (for now):
  - UI components: React Testing Library with JSDOM.
  - Core libs: Jest, mock axios as needed.
  - Next API: Extract handler functions for unit tests.
  - Nest API: Test controllers/services with `@nestjs/testing`.

Commands:
- Run all: `pnpm run test`
- Run specific: `pnpm exec nx test <project>`
