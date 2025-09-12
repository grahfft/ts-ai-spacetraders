# Testing Strategy

We lean towards Behavior-Driven Development (BDD) for feature flows and adopt the Testing Trophy distribution for test types.

## Principles

- **BDD (Behavior-Driven Development)**
  - Express features in business terms; prioritize acceptance criteria (Given–When–Then) to guide implementation.
  - Use readable scenarios as living documentation for critical flows (e.g., Register Agent, Accept Contract).

- **Testing Trophy** (Static → Integration → Unit → E2E)
  - Emphasize static checks and integration tests for cost-effective confidence.
  - Keep a small, meaningful set of unit tests for pure logic and edge cases.
  - Maintain a few high-value e2e tests to validate wiring across the stack.

## Layers and Frameworks

- **Static**
  - TypeScript strictness + ESLint across all packages

- **Integration (preferred)**
  - Backend (Nest): `@nestjs/testing` + `supertest` for HTTP; **Jest mocks** for external HTTP via DI (no nock)
    - Pattern: provide `SPACETRADERS_HTTP` (axios client) via Nest DI and override with Jest in tests
  - Frontend: Next API routes and components tested with React Testing Library (where appropriate) and Playwright for cross-page flows

- **Unit**
  - Pure functions and small services (e.g., hashing/token selection) with Jest
  - Minimal mocking, prefer constructor injection where needed

- **E2E (UI)**
  - Playwright with **Page Object Model**
  - Critical journeys only (create agent, navigate to details, accept contract)
  - Use test IDs or stable roles/selectors

## Current Tooling

- Test Runner: Jest
- Backend integration: `@nestjs/testing`, `supertest`
- HTTP mocking: Jest mocks (DI-based), not nock
- UI: React Testing Library (unit/integration), Playwright (e2e with POM)

## Conventions

- Co-locate tests under each library/app: `src/lib/*.spec.ts(x)` or `tests/*.spec.ts`
- Name tests after behaviors (e.g., `accept-contract.spec.ts`)
- Prefer arranging tests around scenarios instead of implementation details
- Keep mocks at module boundaries; verify observable behavior (status, JSON, UI state)

## Commands

- Run all tests: `pnpm run test`
- Run project tests: `pnpm exec nx test <project>`
- Run UI e2e (Playwright): `pnpm exec nx run spacetraders-ui-e2e:e2e`

## Example BDD Scenario (Accept Contract)

Given an agent exists with available contracts
When the user navigates to the agent details and accepts a contract
Then the contract is marked as accepted and no longer shows the Accept action

## User Journeys (Gherkin Examples)

Feature: Agent management

- Scenario: Create a new agent and view details
  - Given I am on the Agents page
  - When I open the Create Agent modal and submit a valid symbol and faction
  - Then I land on the Agent details page for the new agent

- Scenario: Navigate from agents list to details
  - Given I am on the Agents page
  - When I click Details for an existing agent
  - Then I see the Agent details page

- Scenario: Accept a contract from the summary section
  - Given I am on the Agent details page (Summary section)
  - And I can see an unaccepted contract listed
  - When I click Accept on that contract
  - Then the contract shows as Accepted

- Scenario: Accept a contract from the Contracts section
  - Given I am on the Agent details page (Contracts section)
  - And I expand a contract row
  - When I click Accept
  - Then the contract shows as Accepted and remains expanded

- Scenario: Contracts details are collapsible
  - Given I am on the Contracts section
  - When I click a contract header
  - Then I see details including deliveries and terms

