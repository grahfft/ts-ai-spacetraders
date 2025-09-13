# Testing Strategy

This document outlines our chosen principles and the alternatives we considered, so you can understand what we use by default and what to reach for when the context changes.

## Chosen Principles (What we default to)

- **BDD for key flows**
  - We express important behaviors in business terms (Given–When–Then) and keep tests readable and outcome‑oriented.
- **Testing Trophy distribution** (Static → Integration → Unit → E2E)
  - We favor static analysis and integration tests for the best cost‑to‑confidence ratio, with a handful of e2e checks.
- **Screenplay‑style journeys over raw Page Objects**
  - Page Objects provide low‑level actions; journey/flow objects orchestrate readable user flows and return the next “state” (page).
- **Jest mocks via DI for external services**
  - We avoid global HTTP interceptors; we inject and override clients (e.g., `SPACETRADERS_HTTP`) in tests.

## Alternatives (When/why you might choose them)

- **Traditional testing (non‑BDD)**
  - Use it for internal/technical modules where business language adds little value; keep behavior‑focused names.
- **Testing Pyramid**
  - Favor this for computation‑heavy, pure‑logic domains where unit tests provide high confidence at very low cost.
- **Pure Page Objects (no flows)**
  - Acceptable for very small suites or when journeys are trivial; migrate to flows as scenarios multiply.
- **HTTP interception (nock/msw) or Testcontainers**
  - Interception: useful for black‑box libraries you cannot DI; Testcontainers: use when you need production‑like infra (e.g., DB) in tests.
- **Cypress or other e2e runners**
  - Choose if a team standard mandates it; Playwright is our default for speed and cross‑browser support.

## Layers and Frameworks (Concrete mapping)

- **Static (Chosen)**
  - TypeScript strict + ESLint across all packages
  - Alternative: additional rulesets (e.g., Sonar) if mandated

- **Integration (Preferred)**
  - Backend (Nest): `@nestjs/testing` + `supertest`; override `SPACETRADERS_HTTP` with Jest mocks
  - Frontend: Next API routes with Jest; components with React Testing Library
  - Alternative: Testcontainers Postgres for DB fidelity when needed

- **Unit**
  - Pure functions and focused services (e.g., hashing, token selection) with Jest
  - Minimal mocking, prefer constructor injection

- **E2E (UI)**
  - Playwright with Page Objects + Screenplay flows for critical journeys (create agent, navigate to details, accept contract)
  - Use roles/test‑ids for stable selectors
  - Alternative: Cypress if required by platform/team

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

## Patterns: Page Object vs. Screenplay

- **Page Object Pattern**
  - Focus: Encapsulate a single page/screen’s locators and actions
  - Pros: Simple, low cognitive load; great for reuse of element interactions
  - Cons: Test flow logic often leaks into specs; cross-page orchestration duplicated across tests

- **Screenplay Pattern** (a.k.a. Journey/Flow layer with Actors, Tasks, and Questions)
  - Focus: Model user behavior (Tasks) and assertions (Questions); Page Objects remain as low-level building blocks
  - Pros: Readable, narrative tests; behavior reuse across journeys; flows compose cleanly
  - Cons: Slightly more structure; up-front indirection can feel heavier for very small suites

### How we apply it here

- We keep Page Objects under `apps/spacetraders-ui-e2e/tests/pages/*` (e.g., `AgentsPage`, `AgentDetailsPage`).
- We add a light “Screenplay-style” flows layer under `tests/flows/*` (e.g., `AgentsJourney`) to orchestrate steps:
  - The flow returns the next “state” (page) to enable chained, readable journeys.
  - Specs call flows so they read like user scenarios (Given/When/Then), while Page Objects hold selectors and atomic actions.

Example flow usage (abbreviated):

```ts
const agentsJourney = new AgentsJourney(page);
const agentDetailsPage = await agentsJourney.createAgent('T12345', 'COSMIC');
await agentsJourney.navigateToContracts(agentDetailsPage);
await agentDetailsPage.acceptFirstContract();
```

Use Page Objects for element-level interactions; use the Screenplay-style journeys to express business flows.

## BDD vs. Traditional Testing

- **BDD (Behavior‑Driven Development)**
  - Focus: business outcomes and user behavior; specs written in ubiquitous language
  - Artifacts: Given/When/Then scenarios (we use BDD‑style naming and journeys; Gherkin optional)
  - Collaboration: product + dev + test align on acceptance criteria before coding
  - Strengths: shared understanding, living documentation, reduces “built the wrong thing” risk
  - Trade‑offs: some overhead to curate scenarios; avoid duplicating low‑value cases

- **Traditional Testing**
  - Focus: code correctness at unit/integration/system layers
  - Artifacts: unit tests, integration tests, e2e tests primarily authored by engineers
  - Strengths: fast feedback, high isolation for logic, easy defect localization
  - Trade‑offs: can miss behavior gaps if tests are too implementation‑centric or over‑mocked

Our approach: use BDD for key flows (journeys and e2e), and traditional layering elsewhere with behavior‑focused test names.

## Testing Trophy vs. Testing Pyramid

- **Testing Pyramid (Triangle)**
  - Emphasis: many unit tests at the base; fewer integration; very few e2e
  - Pros: fast, cheap; great for logic‑heavy code
  - Cons: risk of over‑mocking; integration gaps can slip through

- **Testing Trophy**
  - Emphasis: strong static analysis, a healthy layer of integration tests, fewer unit tests, a handful of e2e
  - Pros: better cost‑to‑confidence; validates how components work together without e2e flakiness
  - Cons: slower than pure unit; requires good test data/contracts

Our stance: follow the Testing Trophy. Concretely:
- Static: strict TS + ESLint
- Integration (preferred): Nest + supertest, Next route tests, RTL for components
- Unit: focused, high‑value logic
- E2E: Playwright journeys for critical paths only

## Conventions

- Co‑locate tests under each library/app: `src/lib/*.spec.ts(x)` or `tests/*.spec.ts`
- Name tests after behaviors (e.g., `accept-contract.spec.ts`)
- Prefer scenario‑oriented structure over implementation details
- Keep mocks at module boundaries; verify observable effects (status codes, JSON, UI state)

## Commands

- Run all tests: `pnpm run test`
- Run project tests: `pnpm exec nx test <project>`
- Run UI e2e (Playwright): `pnpm exec nx run spacetraders-ui-e2e:e2e`
