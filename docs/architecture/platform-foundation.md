# Core Platform Foundation

**Status:** Proposed working standard; changes to production controls remain subject to existing approval gates.

## 1. Purpose

The Core Platform provides shared foundations for independently scoped business applications. It should establish predictable build, identity, authorization, API, observability, and delivery conventions without prematurely coupling every future app to the same data model or runtime.

The current `apps/web` is a Core Platform skeleton. It is not evidence that the platform or any business app is production-ready.

## 2. Current repository baseline

- Root npm workspaces cover `apps/*` and `packages/*`.
- The repository uses npm and a root `package-lock.json`.
- The web app uses Next.js and React; exact versions belong in package manifests.
- GitHub Actions includes a web build workflow and local Supabase integration workflow.
- The current integration runner checks that local Supabase Auth health and REST/PostgREST endpoints respond successfully. It does **not** prove schema correctness, authorization, RLS, tenant isolation, or business behavior.
- A Supabase Edge Function health endpoint is a liveness probe only; it must not be described as database or product readiness.
- Production deployment workflows exist and must not be invoked as part of routine readiness work.

## 3. Target repository shape

Keep the proposed monorepo layout as the target, with gradual adoption:

- `apps/web`: Core Platform web shell and shared navigation/entry point.
- `apps/<business-app>`: an independently scoped application with its own routes, UI, permissions, and acceptance tests.
- `packages/ui`: shared UI primitives only after design conventions and at least one real consumer exist.
- `packages/config`: shared lint/TypeScript configuration when duplication justifies extraction.
- `packages/types`: shared domain types or schemas with clear ownership; avoid a dumping ground.
- `packages/api-client`: typed clients generated from or validated against stable contracts.
- `packages/auth`: shared authentication helpers only after the identity and authorization model is documented.
- `contracts/api`, `contracts/data`, `contracts/events`: versioned contracts, compatibility notes, and ownership.
- `supabase/migrations`, `supabase/tests`: migration history and automated authorization/schema tests, after schema inspection and approval gates.
- `docs/architecture`, `docs/app-specs`, `docs/security`, `docs/decisions`, `docs/ai-builder`: architecture, app requirements, threat models, decisions, and builder standards.

Do not create empty packages simply to match a diagram. Each package must have a stated responsibility, owner, consumer, and test strategy.

## 4. Platform boundaries

1. **Authentication is not authorization.** Every protected operation must enforce server-side role, ownership, and tenant boundaries.
2. **Contracts precede integrations.** Define request/response shapes, errors, versioning, idempotency, and compatibility before exposing stable APIs.
3. **Data ownership is explicit.** A business app must document its data owner, sensitivity, retention, access policy, and cross-app dependencies.
4. **Shared code stays small.** Extract common code only when behavior is genuinely shared; avoid speculative abstractions.
5. **Environment boundaries are real.** Local, test, staging, and production configuration must be separated. Secrets are never committed.
6. **Observability is part of delivery.** Important operations need safe logs, request correlation, actionable errors, and operational ownership.
7. **Deployments are gated.** CI validates code; it does not grant production-release authorization.

## 5. Minimum CI progression

### Existing evidence
- Install dependencies using the committed npm lockfile.
- Build the Core Web application.
- Start an ephemeral local Supabase stack and run the existing smoke tests.

### Required next improvements
- Add lint/typecheck checks where configured and make their scope explicit.
- Test schema migrations against a disposable local database.
- Add RLS and unauthorized-access tests, including cross-tenant denial cases, once the approved data model exists.
- Add unit and integration tests for each business app's acceptance criteria.
- Add dependency and secret scanning with actionable reporting.
- Ensure workflow triggers cover every relevant source path.
- Confirm the exact required-check names and branch protections through a separate, read-only governance review before proposing any ruleset changes.

## 6. Readiness gates

- **Gate A — Repository baseline:** current branches, PRs, workflows, package manager, migrations, and deployment paths documented.
- **Gate B — Core foundation:** build/lint/typecheck conventions, security boundaries, error handling, and observability standards agreed.
- **Gate C — App specification accepted:** target users, workflows, roles, data, external systems, non-functional needs, and acceptance tests documented.
- **Gate D — App implementation verified:** tests exercise meaningful behavior; CI results correspond to the exact PR head.
- **Gate E — Release readiness:** security, privacy, operations, rollback, environment configuration, and legal/provider requirements reviewed and explicitly approved.

A green build or smoke test satisfies only the checks it ran. It does not automatically pass any later gate.

## 7. Change control

- Work through branches and pull requests.
- Do not push directly to `main`.
- Do not alter branch rulesets, required checks, production configuration, production schema, or production permissions without explicit approval.
- Inspect the current Supabase schema and migration history before proposing schema changes.
- Use simulated data in development and tests. Real-money movement remains prohibited until the relevant product, legal, provider, security, and operational gates are complete.
