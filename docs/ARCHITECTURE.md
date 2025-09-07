# Architecture

- Apps
  - create-agent-ui (Next.js): UI, API routes under `app/api/*`.
  - spacetraders-service (NestJS): composes API modules.
- Libs
  - components/chakra-provider: Chakra v2 provider.
  - components/create-agent-form: `CreateNewAgentForm` UI.
  - core/spacetraders: framework-agnostic `registerAgent`.
  - api/create-agent-module: NestJS module/controller/service.
- Path aliases: `@spacetraders/*` in `tsconfig.base.json`.
- Error contracts: Nest `HttpException({ statusCode, message }, status)`.
