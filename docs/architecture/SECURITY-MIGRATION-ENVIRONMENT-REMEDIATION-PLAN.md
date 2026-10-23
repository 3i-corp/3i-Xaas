# 3i-XaaS Security, Migration Drift & Environment Remediation Plan

- **Status:** Read-only findings and proposed remediation sequence; no fixes applied
- **Date:** 2026-10-24
- **Target project:** Supabase `nxbervftnchjhpaxjqqu`
- **Repository:** `joofjang2539-hash/3i-XaaS`
- **Related handoff:** `docs/architecture/BUILDER-HANDOFF-CORE-SYSTEM.md`
- **Execution gate:** Each implementation phase requires its own reviewed PR, test evidence and explicit approval before any live database change or deployment.

## 1. Executive summary

The latest read-only inspection reconfirmed a material database security risk and found an additional systemic issue in default privileges. The correct response is not to add broad RLS policies blindly. First constrain public access, then establish the authentication/tenant model, then add narrowly scoped policies and versioned migrations.

No SQL changes, data changes, migrations, grants, function changes or deployments were made during this audit.

## 2. Latest read-only evidence

### Existing public tables

The connected live project currently reports these five `public` tables:

| Table | Observed rows | RLS | Current interpretation |
|---|---:|---|---|
| `users` | 0 | Enabled | Legacy user/profile table with `password_hash`; not a new authentication source |
| `categories` | 4 | Enabled | Public read policy exists |
| `products` | 3 | Enabled | Public read policy exists for published products |
| `orders` | 0 | Enabled | Order domain; no RLS policies found |
| `order_items` | 0 | Enabled | Order line items; no RLS policies found |

`public.users` includes `id`, `email`, `password_hash`, `first_name`, `last_name`, `role`, `is_active`, `email_verified_at`, timestamps. `orders.user_id` references `public.users.id`, not directly `auth.users.id`. This is an identity-mapping design issue to resolve before policy authoring.

### Current policies

Only two policies were returned from `pg_policies` for the public schema:

- `categories`: `SELECT` allowed for `anon` and `authenticated`.
- `products`: `SELECT` allowed for `anon` and `authenticated` when `is_published = true`.

No policies were found on `users`, `orders`, or `order_items`. RLS being enabled without policies blocks ordinary row access through RLS but is not sufficient protection when direct grants, functions, views or privileged server access are involved.

### Current table grants

The read-only `information_schema.role_table_grants` query returned `anon` and `authenticated` grants on both `public.users` and `public.orders` for `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `REFERENCES`, and `TRIGGER`. This is a high-priority least-privilege issue. `TRUNCATE` is not controlled by RLS. Do not assume the current zero row count makes this safe.

`categories` and `products` currently have `SELECT` grants only for `anon` and `authenticated`; their public-read use case should be preserved only as explicitly intended.

### Default privileges — additional systemic issue

Current default ACLs in schema `public` show broad defaults for objects created by both `postgres` and `supabase_admin`:

- Tables: `anon` and `authenticated` receive broad table privileges, including write privileges and `TRUNCATE`.
- Functions: `anon` and `authenticated` receive `EXECUTE`.
- Sequences: `anon` and `authenticated` receive `USAGE`, `SELECT` and `UPDATE`.

This means a future table/function/sequence could inherit unsafe access unless each migration overrides it. Default privileges are creator-specific, so remediation must inspect each actual object creator and avoid a blanket change that unexpectedly breaks existing application flows. The service-role grants and intended public-read grants must be deliberately accounted for.

### Function and trigger

`public.update_updated_at_column()` currently has no explicit function `search_path`; it is not marked `SECURITY DEFINER`. It is used by update triggers on `categories`, `orders`, `products`, and `users`. It currently references no schema objects other than trigger record fields and `CURRENT_TIMESTAMP`, so a hardened empty search path is a candidate, subject to testing. `PUBLIC`, `anon`, and `authenticated` currently have `EXECUTE` grants; review whether client execution is needed and remove unnecessary execute grants in a reviewed migration.

### Migration and deployment state

- The Supabase migration listing returned no migration records.
- The reviewed repository tree contains no `supabase/migrations/` or `supabase/schemas/` baseline.
- Local Supabase config uses `project_id = "3i-xaas-local"`, which is appropriate for separating the local stack from the live project, but this alone does not establish full environment isolation.
- The previous Local CI run for the health-function PR completed successfully. The deploy workflow failed its deployment-secret validation; this is not evidence of a successful production deployment.
- PR #6 remains open at the latest direct GitHub PR status read. Its Local CI run #40038539231 completed successfully. PR #6 is documentation-only and did not fix live security issues.
- The current smoke test is not a replacement for build, migration, RLS, tenant isolation or Wallet invariant tests.

## 3. Priority and proposed phases

### P0 — Contain exposure; do not enable builder writes

1. Keep AI builders and client applications disconnected from live write credentials.
2. Reconfirm table, sequence, function, view, schema and default privileges immediately before remediation.
3. Preserve public `SELECT` for categories and published products only if product requirements still require it.
4. Prepare a narrowly scoped migration proposal to remove `anon`/`authenticated` DML, `TRUNCATE`, `REFERENCES` and `TRIGGER` privileges from `users` and `orders`; review `order_items` and all other objects as well.
5. Prepare default-privilege changes for each relevant object creator so future application objects do not automatically grant broad privileges to `anon` or `authenticated`. Explicitly grant only required permissions in each migration. Review effects on `service_role` and Supabase-managed objects before approval.
6. Do not add permissive RLS policies to compensate for missing access. A table should remain inaccessible through client roles until a valid identity/tenant authorization design and negative tests exist.

**Required tests:** anonymous and authenticated attempts to read/write/truncate protected data must fail; intended public category/published-product reads must still work; service-side operations must be explicitly tested; default ACLs for future objects must be verified in a disposable local database.

### P1 — Define identity and tenant authorization before policies

1. Confirm Supabase Auth as the canonical identity provider.
2. Trace whether `public.users` has any external consumers or historical lineage. The latest row count is zero, but do not infer there is no dependency.
3. Decide the canonical relationship between `auth.users.id`, application profile ID, `orders.user_id`, tenant/organization and memberships.
4. Do not use `public.users.password_hash` for new authentication. Do not remove the column until dependencies, retention requirements, backups and a reviewed migration are established.
5. Decide the canonical term and semantics for `tenant` and `organization`; do not create parallel identity/tenant tables just to match a proposed naming list.
6. Write policy specifications and tests for customer, tenant member, tenant admin, platform operator and support access, including explicit denial of cross-tenant reads/writes and role escalation.

**Required tests:** users cannot access another user's orders; members cannot cross tenant boundaries; anonymous requests cannot read protected data; support/admin access is narrowly scoped and audited.

### P2 — Harden function and routine privileges

1. Create a reviewed migration to set an explicit safe `search_path` on `update_updated_at_column()` (candidate: empty path, as the function does not currently need schema object resolution).
2. Remove unnecessary `EXECUTE` grants from `PUBLIC`, `anon`, and `authenticated` if confirmed unnecessary; verify trigger behavior after privilege changes.
3. Inventory all public functions, views, triggers and security-definer routines, including ownership, search path, grants and caller requirements.

**Required tests:** timestamp triggers still work on all four tables; direct client invocation is denied where not required; function behavior is unchanged for legitimate updates.

### P3 — Reconcile schema drift and establish migration history

1. Export/capture the live schema and metadata in a controlled, versioned audit artifact. Keep secrets and production row data out of Git.
2. Compare the live schema against repository code, policies, grants, triggers, indexes, constraints, extensions and functions.
3. Determine the exact provenance of existing objects and any manual dashboard changes. Record unknowns explicitly.
4. Build a baseline migration that represents the current intended schema, not a guessed replacement. Review it against the captured live schema and a disposable local database.
5. Use Supabase migration repair/baseline procedures only after exact comparison and approval; do not blindly replay a baseline against live or reset the live project.
6. Apply subsequent changes as additive migrations with compatibility windows, validation queries and forward recovery/rollback notes.
7. Add migration linting and drift checks to CI; ensure CI targets only the local/ephemeral database.

**Required tests:** a fresh local database builds from migrations; schema diff after migration is expected; RLS/grants/function tests pass; existing categories/products remain available; no live data is changed by the test.

### P4 — Separate local, preview/staging and production

1. Document environment IDs/URLs by name only; never commit keys, database passwords or service-role secrets.
2. Local CI must use local/ephemeral Supabase and synthetic data, with no production credentials.
3. AI Builder previews use mock adapters or a separate staging project with synthetic data and least-privilege credentials.
4. Production deployment uses a restricted GitHub Environment, required reviewer approval, narrowly scoped secrets, explicit project-ref guard and manual release gate.
5. Investigate the current deploy workflow's secret validation using workflow job logs and repository environment configuration; do not guess which secret is missing and do not weaken the guard.
6. Add a no-deploy validation path for pull requests. Production deploy should not run from ordinary PRs.
7. Rotate any credential only if a concrete exposure or compromise is established; never paste secrets into chat or logs.

**Required tests:** PR CI cannot write to live Supabase; wrong project ref blocks deployment; absent secrets fail safely; staging deploy targets staging; production deploy requires approval and target confirmation.

### P5 — Expand CI and application readiness

1. Correct stale workflow comments.
2. Add format/lint/typecheck/build steps for affected apps, starting with `apps/web`.
3. Add tests for RLS/grants, tenant isolation, migration application, secret scanning and Edge Function behavior.
4. Keep Wallet tests simulated: exact money arithmetic, double-entry balance, idempotency, concurrency, limit boundaries, holds, reversals, webhook replay and reconciliation.
5. Distinguish smoke test success from product readiness; publish a per-check report with skipped/not-run tests.

## 4. Legacy product preservation and removal

The repo includes archived experiments and an incomplete web app, but repository presence alone cannot prove a component is safe to delete or unused elsewhere. For every Wallet, Market, Dating, Rider, web UI, runtime package, database object or dataset:

- map dependencies and callers;
- classify keep/adapt/quarantine/remove;
- record data owner and retention requirements;
- test the replacement path before cutover;
- back up/export where applicable;
- remove only through a reviewed PR and explicit approval.

Do not delete old schemas or data as part of P0 security containment. Access restrictions and deletion are separate changes.

## 5. Execution boundaries

This document is a plan only. The following actions have **not** been performed and require a separate reviewed implementation change and approval:

- revoke or grant database privileges;
- change default privileges;
- add/change RLS policies;
- alter functions, triggers, tables or columns;
- create or repair migration history;
- delete or transform data;
- configure or rotate GitHub/Supabase secrets;
- deploy Edge Functions or application code;
- merge a PR.

## 6. Acceptance criteria before any live fix

- Current live grants, policies and default privileges captured and reviewed.
- Baseline backup/schema export and recovery procedure confirmed.
- Exact proposed SQL is reviewed in a PR and tested against local/ephemeral Supabase.
- Positive and negative access tests pass.
- Existing public-read behavior is preserved only where required.
- No production data or schema changes occur during CI.
- Explicit user approval recorded before executing any live change.
- Post-change advisor/grant/policy checks and regression tests have a recorded result.
