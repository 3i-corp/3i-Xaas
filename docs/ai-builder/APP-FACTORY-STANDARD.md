# App Factory Standard

**Purpose:** Turn an accepted business application specification into a reviewable, testable application without inventing missing product or security requirements.

## Factory workflow

1. **Intake** — collect the problem, users, outcomes, target environment, constraints, and business owner.
2. **Specification** — complete `docs/app-specs/APP-SPEC-TEMPLATE.md`; identify open questions and assumptions.
3. **Architecture and risk review** — define app boundaries, data classification, roles, tenant boundaries, integrations, threat scenarios, and failure behavior.
4. **Contract first** — agree API/data/event contracts and compatibility expectations before implementation depends on them.
5. **Plan** — break work into small PR-sized changes with testable acceptance criteria.
6. **Scaffold** — create `apps/<app-id>` only after the specification is accepted. Follow the existing npm workspace conventions.
7. **Implement** — build vertical slices with explicit loading, empty, success, error, and unauthorized states.
8. **Verify** — run relevant lint/typecheck/build/unit/integration/security checks; ensure checks ran rather than being skipped.
9. **Review** — inspect the diff, dependency changes, secret exposure, permissions, migrations, accessibility, and operational readiness.
10. **Release gate** — deploy only through the approved environment and process, after explicit release approval.

## Application isolation rules

- Each app has a unique stable ID, a clear purpose, and a named business owner.
- Each app declares its routes, capabilities, permission model, data ownership, integrations, and dependencies.
- Shared packages are optional; do not import internal modules from another app to bypass a contract.
- Reuse shared UI/config/types only where the interface and ownership are stable.
- Every server-side action enforces authorization. Hiding a button is not an access-control mechanism.
- Tenant identity must come from a trusted server-side context and be verified against the requested resource.
- Secrets and privileged service keys remain server-side and must never be shipped to browsers.
- Database changes require migration review and RLS/authorization tests. Production schema and permission changes follow the separate approval gates.

## Minimum app acceptance criteria

An app is not accepted merely because it compiles. It must demonstrate:

- Core user journeys match the specification.
- Input validation and meaningful error handling are implemented.
- Loading, empty, success, failure, and unauthorized states are present where relevant.
- Authentication and authorization are tested at the server/API/data boundary.
- Sensitive data is minimized and never exposed to unauthorized users.
- APIs and events follow versioned contracts.
- Relevant unit/integration tests cover acceptance criteria and important failure cases.
- Accessibility, responsive behavior, and supported browsers/devices are addressed.
- Logging and diagnostics are useful but do not expose credentials or sensitive payloads.
- Build and required test jobs pass on the exact PR commit.
- Deployment, rollback, support ownership, and known limitations are documented before release.

## AI builder behavior

AI-assisted implementation must:

- Treat the accepted specification and repository conventions as the source of truth.
- Surface conflicts and unresolved requirements rather than silently choosing risky defaults.
- Keep changes small, explain assumptions, and link each change to acceptance criteria.
- Never fabricate successful test results, security reviews, provider approval, or production readiness.
- Never run production deployment, change branch protections, or modify production schema/permissions without the required approval.
- Include a concise handoff: files changed, decisions made, tests actually run, remaining risks, and next step.

## Definition of Done

A factory output is ready for review only when the app specification is accepted, implementation maps to its acceptance criteria, relevant checks have real evidence, security boundaries are tested, documentation is updated, and a pull request is open. Merge and release remain separate approval decisions.
