# 3i-XaaS

3i-XaaS is a workspace for building a shared platform and independently scoped business applications.

> **Current status:** Core Platform skeleton and development infrastructure only. A passing build or CI workflow does not mean a business application is production-ready.

## Repository layout

- `apps/web` — Core Platform web application (currently a skeleton).
- `apps/*` — Business applications, added only after an app specification is accepted.
- `packages/*` — Shared packages with explicit ownership and real consumers.
- `supabase/` — Local Supabase configuration, migrations, functions, and tests.
- `contracts/` — Versioned API, data, and event contracts as they are established.
- `docs/architecture/` — Architecture decisions, readiness audits, and platform constraints.
- `docs/app-specs/` — Business application specifications and acceptance criteria.
- `docs/ai-builder/` — App Factory workflow and builder handoff standards.
- `scripts/` — Development and test automation.
- `.github/workflows/` — CI and controlled deployment workflows.

## Development baseline

- Package manager: **npm** with the root `package-lock.json` and npm workspaces.
- Workspace patterns: `apps/*` and `packages/*`.
- Core web: Next.js and React; see `apps/web/package.json` for exact versions and scripts.
- Local integration smoke tests: `npm run test:integration`.
- Web production build: `npm run build --workspace=apps/web`.

Do not add a second package-manager lockfile or workspace definition without a coordinated migration.

## Working safely

1. Create a feature branch and open a pull request; do not push directly to `main`.
2. Keep changes narrow, reviewable, and covered by relevant checks.
3. Treat CI success as evidence only for the checks that actually ran.
4. Never put credentials, service-role keys, or private customer data in source, logs, issues, or test fixtures.
5. Do not change production schema, permissions, deployment settings, branch rulesets, or required checks without the required explicit approval.
6. Do not enable real-money movement or claim production readiness until the documented product, security, operational, legal, and provider gates are satisfied.

## Start here

- [Platform foundation](docs/architecture/platform-foundation.md)
- [App Factory standard](docs/ai-builder/APP-FACTORY-STANDARD.md)
- [Application specification template](docs/app-specs/APP-SPEC-TEMPLATE.md)
- [Pull request template](.github/PULL_REQUEST_TEMPLATE.md)
