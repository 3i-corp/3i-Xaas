# 3i-XaaS Core System — Builder Handoff Pack

- **Status:** Proposed implementation contract; requires review before product or database changes
- **Date:** 2026-10-24
- **Repository:** `joofjang2539-hash/3i-XaaS`
- **Primary builder workflow:** Lovable first; Bolt.new may assist; Base44 is optional
- **Source of truth:** GitHub for versioned code, decisions, API contracts, migrations and tests; Supabase for runtime data and Auth; builders are implementation tools, not architectural sources of truth.

## 1. Mission and scope

Build a shared, extensible Core System for products developed by the same company or explicitly authorized by the relevant data owner. Product families include:

- iii Wallet
- Rider
- Market Center
- Dating
- General Web Apps and future products

The goal is to reuse identity, tenant isolation, access control, product entitlements, audit, billing/usage, notifications, integration contracts and operational controls. Product UIs may differ; they must not create separate, conflicting versions of core identity, permissions, tenant boundaries or money movement.

This pack does not certify legal authorization, provider availability, compliance or production readiness. Those remain explicit launch gates.

## 2. Existing assets: preserve, adapt, remove only with evidence

Earlier Wallet, Market and Dating implementations existed but were incomplete and were not built against a shared Core. Do not assume all prior work is disposable or production-ready.

Classify each existing schema, table, function, route, UI, package, workflow and dataset before changing it:

1. **Keep:** useful, safe, tested, and compatible with the target architecture.
2. **Adapt:** useful but requires a migration, adapter, contract, security boundary or refactor.
3. **Quarantine/deprecate:** unclear ownership, unknown consumers, incomplete or unsafe; block new dependencies and collect evidence.
4. **Remove:** redundant or out of specification, with no retained business/data value, and only after dependency review, backup/export where applicable, a migration/recovery plan, and reviewed PR approval.

Do not delete production or user data merely because it is empty today or appears unused. Do not run destructive SQL, clean up live Supabase, or deploy schema changes as part of builder-generated work without a separately reviewed and approved change.

## 3. Architecture principles

- Start with a **modular monolith + shared platform Core**. Split services only when a measured need justifies it.
- Platform-first: define shared contracts and policies before product-specific implementation.
- Additive migrations and backward-compatible API changes by default.
- Tenant isolation is enforced server-side; never trust a client-supplied tenant ID or role.
- Supabase Auth is the intended identity provider unless a reviewed ADR establishes otherwise. Do not create a second password/authentication system. Existing `public.users.password_hash` must be assessed as legacy data/schema and must not be used for new authentication.
- Keep service-role keys, provider secrets, signing secrets and database passwords server-side only. Never place them in browser code, builder prompts, committed files, screenshots or logs.
- UI builders must use documented API contracts or typed adapters; they must not invent tables, columns, RLS policies, financial calculations or authorization rules.
- Separate test/sandbox from live production. Simulated money is not redeemable, transferable to real money, or represented as a real provider transaction.
- All changes flow through feature branches and pull requests; no direct push to `main`.

## 4. Proposed shared Core domains

These are logical domains to validate against the live schema and existing code before implementing; they are not an instruction to create all tables immediately.

- **Identity:** Supabase Auth user identity; application profile; account lifecycle.
- **Organizations and tenancy:** organizations/tenants, memberships, roles and product access; define one canonical term in an ADR before schema creation.
- **Authorization:** server-side policy checks, least privilege and tenant-scoped access.
- **Product registry and entitlements:** products, tenant-product enablement, plans and entitlements.
- **Audit and operations:** append-oriented audit events, security-relevant events, support and incident workflows.
- **Billing and usage:** plan billing, usage metering and company revenue, separate from customer wallet funds and seller proceeds.
- **Notifications and integrations:** versioned webhook contracts, signature validation, retry and replay controls.
- **API governance:** versioning, consistent error format, idempotency and contract tests.

Before adding tables, map each domain to current objects and decide whether to reuse, extend, adapt or replace them through a migration.

## 5. Product boundaries

### iii Wallet

- Initial currencies: THB, USD, KHR; additional currencies such as CNY are configuration-driven.
- Stored-balance baseline: THB 100,000 equivalent per Wallet account. Incoming limits are a separate policy.
- Daily baseline: THB 50,000 equivalent per day per transaction category, converted using a versioned, auditable FX policy.
- Exact aggregation boundary, FX source/timestamp, precision/rounding, timezone/day boundary, transaction states counted and treatment of holds/reversals must be decided before enforcement.
- Use immutable double-entry ledger semantics (or a rigorously equivalent accounting model), balanced postings per currency, idempotency, concurrency-safe overspend prevention, holds/reservations, linked reversals/adjustments, provider webhook signature verification, replay protection, deduplication and reconciliation.
- No interest-bearing balance in the initial version.
- Refund to iii Wallet only when supported and eligible; otherwise return to the original source when supported. If neither route is available, create an explicit operations exception.
- Cashback is a separate, campaign-funded, capped and idempotent flow.
- Market Center seller proceeds and settlement obligations are not spendable Wallet balances by default.
- Virtual cards are an adapter/module architecture only until issuer/provider, country, legal, compliance, KYC and security gates are approved. Never generate fake PAN/CVV or store sensitive card data.

### Rider

- Reuse identity, tenant/product entitlement, notifications, audit and approved payment contracts.
- Keep dispatch, location, trip lifecycle, safety, and rider/driver-specific policy in a product module.
- Access to precise location and personal data must be purpose-limited and authorized.

### Market Center

- Reuse tenant, catalog identity, product entitlement, audit and integration contracts.
- Keep order, inventory, seller, refund and settlement domain rules explicit.
- Seller proceeds must remain distinct from iii Wallet customer funds.
- Use provider-supported seller payout/settlement flows only after country and legal/provider review.

### Dating

- Reuse identity, tenant/product entitlement, safety reporting, notifications and audit.
- Keep matching, visibility, consent, moderation and product-specific privacy rules in its module.
- Apply least privilege to sensitive profile data; do not share data with other products without an approved purpose and authorization.

### General Web Apps

- Use the shared identity and tenant model only where applicable.
- Integrations must be explicitly authorized by the application/data owner, scoped to minimum required permissions, revocable and auditable.
- Do not assume every app is entitled to access every tenant's data.

## 6. API contract conventions

The following are candidate resource groups for contract design, not approved endpoints ready for production:

- `/v1/me`
- `/v1/tenants`
- `/v1/tenants/{tenantId}/products`
- `/v1/tenants/{tenantId}/entitlements`
- Wallet-specific balance, transaction, transfer, hold, refund and reconciliation resources to be designed in a dedicated Wallet API contract.
- `/v1/webhooks/{provider}/{eventFamily}` or a similarly explicit versioned route, with provider-specific signature verification.

Every write contract must define authentication, authorization, tenant resolution, request/response schema, stable error codes, idempotency requirements, audit event, rate limit, retry semantics and tests. Financial endpoints must never accept client-authoritative balances, FX rates, fees, transaction status or ownership. Verify webhook signatures against raw request bytes where required by the provider; deduplicate provider event IDs and make processing idempotent.

## 7. Live Supabase baseline and blocking findings

The read-only audit observed the live project `nxbervftnchjhpaxjqqu` with existing `public.users`, `categories`, `products`, `orders` and `order_items` tables. This is a snapshot, not a complete schema inventory or a declaration that the objects are safe for production.

The audit observed the following issues; re-verify them before remediation because state can change:

1. `anon` and `authenticated` had broad direct grants on `public.users` and `public.orders`, including `TRUNCATE`. RLS does not restrict TRUNCATE. Treat as a **security blocker** until privilege scope and exposure are verified and corrected through a reviewed, tested change.
2. RLS was enabled without policies on `users`, `orders` and `order_items`; this is not a substitute for reviewing grants, function privileges, views and server-side access.
3. `public.users.password_hash` exists while Supabase Auth is also present. Do not use this column for new authentication; review lineage, consumers and retention before deciding whether to migrate or remove it.
4. Security Advisor flagged `update_updated_at_column()` for missing explicit `search_path`; inspect function definition and callers before changing it.
5. No migration history was returned and no `supabase/migrations/` or `supabase/schemas/` files were found in the reviewed GitHub tree. Capture and reconcile the live schema before creating a migration baseline. Never blindly reset or overwrite the live database.
6. No live Edge Functions were listed at the time of the audit. The health function's source and local tests do not mean it is deployed.
7. Local CI passed after the health-function change. The deploy workflow failed its deployment-secret validation; no successful deployment should be inferred from that run.
8. Existing CI smoke tests check local Auth health and REST/PostgREST reachability; they do not validate Wallet rules, tenant isolation, RLS negative cases or the web app production build.
9. The existing app entrypoint needs a proper build/typecheck before it is treated as build-ready.

**Gate:** do not connect an AI builder to live production writes, apply migrations, or enable money movement until security grants/RLS, auth-source-of-truth, migration drift, and environment separation are reviewed and tested.

## 8. AI Builder workflow

### Before building

1. Read this pack, current ADRs, API contracts and repo instructions.
2. Inspect existing modules, schema, migrations, tests and dependencies; report what can be kept/adapted/removed.
3. State the intended files, APIs, migrations and test cases before implementation.
4. Ask for no secrets. Use environment variable names/placeholders only.
5. Build against mock fixtures or an isolated local/staging Supabase project with synthetic data.

### While building

- Implement UI against existing or approved API contracts.
- If a required endpoint/schema is missing, create a proposal or typed mock adapter; do not silently invent production schema.
- Never use live financial data for demonstrations.
- Keep accessibility, responsive layout, error/loading/empty states and authorization failures in scope.
- Do not put service-role credentials in client code.

### Before handoff

- Provide a file-by-file summary and note preserved/adapted/deprecated assets.
- Include tests and their actual results; distinguish tests run from tests not run.
- Verify build, lint, typecheck, unit/integration tests and security/tenant negative tests where configured.
- Open a PR with migration and rollback/recovery notes. Do not merge or deploy automatically.
- Request explicit approval before the next phase or any live-environment change.

## 9. Required testing gates

1. **Static/build:** formatting, lint, typecheck, production build for affected apps.
2. **Contract:** schema validation, stable error responses, auth requirements and idempotency.
3. **Tenant security:** anonymous denial, unauthorized user denial, cross-tenant read/write denial, role escalation denial.
4. **Database security:** least-privilege grants, RLS positive and negative cases, function `search_path`, secrets exposure scan.
5. **Wallet simulation:** exact arithmetic, balanced postings, insufficient funds, concurrent spending, duplicate requests/webhooks, replay attempts, cap/daily limit boundaries, holds/capture/release, reversals/refunds and reconciliation exceptions.
6. **Product regression:** existing useful Wallet/Market/Dating/Rider workflows remain compatible or are explicitly deprecated.
7. **Deployment:** migration dry run against a disposable environment, backup/recovery plan, approval gate, and post-deploy verification before production changes.

A green smoke test alone is not proof of production readiness.

## 10. Data migration and removal policy

- Inventory objects, row counts, constraints, policies, grants, indexes, triggers, functions, views, dependencies, API callers and ownership.
- Determine whether records are test/demo, operational, personal, financial or legally retained.
- Export/backup before any destructive operation; validate restore or rollback strategy.
- Prefer additive changes, compatibility views/adapters and staged cutover.
- Never drop or truncate live tables just because a builder generated a new schema.
- Any data deletion requires documented scope, dependency review, retention/legal review where relevant, a reviewed PR and explicit approval.

## 11. Current work sequence

1. Recheck PR #4/#5 and CI/deploy status; document remaining issues.
2. Read-only inventory of the actual repository and connected Supabase; identify existing assets and security/drift risks.
3. Review this Builder Handoff Pack and confirm the canonical Core terminology, product boundaries and migration policy.
4. Implement approved, narrowly scoped changes in feature branches and PRs; test each change before asking approval for the next step.
5. Build product UIs with the selected AI builder against contracts and mock/local data first.
6. Run simulation, security, regression and deployment-readiness tests before any production rollout.

## 12. Decisions still requiring explicit resolution

Do not silently fill in these policy choices:

- Canonical naming: `tenant` vs `organization`, and whether they are the same concept or separate layers.
- Company-owned products versus external authorized applications: authorization evidence, tenant isolation, data-sharing scope and revocation.
- Roles, support/admin access, break-glass process and audit requirements.
- Wallet policy details listed in ADR-001: FX source, precision, daily boundary, aggregation, held/pending/reversed transaction treatment, and category taxonomy.
- Country/provider/legal eligibility for every money movement, payout, refund and card feature.
- Data retention/deletion policy and treatment of legacy `password_hash` records.
- Production backup/recovery targets and deployment approval ownership.

Until resolved, use conservative defaults, synthetic data and fail-closed behavior.


## 13. Protected Core policy amendments

The six Core principles are protected against direct and indirect changes. Any change that alters their meaning or enforcement—including permissions, RLS, default privileges, tenant boundaries, secrets handling, CI/CD, builder instructions or approval logic—must follow [Core Governance — Policy Amendment & Scope Expansion Authorization](./CORE-GOVERNANCE-CHANGE-AUTHORIZATION.md). At least one creator-authorization method must be verified in addition to normal identity and role authorization. Approval is scoped to the reviewed change and does not authorize live database operations or deployment. The governance document is proposed until technical enforcement is implemented and verified.
