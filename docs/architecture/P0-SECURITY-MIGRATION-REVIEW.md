# P0 Security Migration Proposal — Grants & Default Privileges

- **Status:** Proposed implementation; local-only tests are required in CI before review completion
- **SQL proposal (not yet in migration chain):** `supabase/proposals/p0_restrict_public_api_grants.sql`
- **Test runner:** `scripts/test-p0-security.sh`
- **Target live project (read-only audit reference only):** `nxbervftnchjhpaxjqqu`
- **Execution boundary:** No live SQL was applied. This PR must not deploy or apply the migration to a shared environment.

## 1. Latest read-only baseline

The current audit was refreshed before this proposal was authored. The connected Supabase project is healthy and runs PostgreSQL 17.11.0.003. The five inventoried application tables are all owned by `postgres` and have RLS enabled.

| Object | Observed before state | Proposed state after migration |
|---|---|---|
| `public.users` | `anon` and `authenticated` had broad grants including SELECT/DML/TRUNCATE/REFERENCES/TRIGGER | No direct table privileges for either client role |
| `public.orders` | `anon` and `authenticated` had broad grants including SELECT/DML/TRUNCATE/REFERENCES/TRIGGER | No direct table privileges for either client role |
| `public.order_items` | No direct grants to `anon`/`authenticated` were observed in the latest grant listing; still treated as protected | Explicitly revoke all direct table privileges from both client roles |
| `public.categories` | SELECT granted; RLS policy `Public can read categories` allows SELECT to `anon` and `authenticated` | SELECT only; preserve the existing policy |
| `public.products` | SELECT granted; RLS policy `Public can read published products` filters to `is_published = true` | SELECT only; preserve the existing policy |
| Public sequences | Default ACLs included broad client-role sequence privileges for objects created by `postgres` | Revoke existing sequence privileges from `anon`/`authenticated` |
| Future objects created by `postgres` in `public` | Default ACLs included client-role grants for tables, sequences and functions; function execution was also inherited through PUBLIC | Revoke client-role defaults; revoke global default PUBLIC EXECUTE for future functions created by `postgres`; explicit grants required |
| Existing `service_role` grants | Present on application tables and in PostgreSQL defaults | Not revoked or changed by this migration |

RLS policies are intentionally not rewritten here. The migration requires the expected public-read policies and RLS state to exist before it changes grants; if policy drift is detected, it fails before making changes.

## 2. Scope of the migration

The proposed SQL, when approved and later moved into the migration chain after schema baseline reconciliation:

1. Fails closed unless run as `postgres`, required Supabase roles and all five inventoried tables exist, RLS is enabled, and the two expected public-read policies match the reviewed state.
2. Revokes all table privileges from `anon` and `authenticated` on `users`, `orders`, `order_items`, `categories`, and `products`.
3. Re-grants only SELECT on `categories` and `products` to the two client roles.
4. Revokes all existing sequence privileges from the two client roles in `public`.
5. Restricts default table, sequence, and function privileges for objects created by `postgres` in `public`.
6. Revokes PostgreSQL's global default PUBLIC EXECUTE for functions created by `postgres`. Future functions required by an API role must receive an explicit grant in the migration that defines them.

It does **not** delete or update data, change RLS policies, change existing function grants, revoke existing `service_role` access, modify application code, or apply to a live project.

## 3. Supabase-managed default-privilege limitation

The read-only audit also observed broad defaults for objects created by `supabase_admin`. Supabase's current guidance states that the `supabase_admin` default ACLs cannot be changed by an application migration. This proposal deliberately does not attempt to alter them, because that can fail and should not be misrepresented as fixed.

Mitigations and residual risk:

- Application migrations must run as `postgres` and application-owned objects must not be created as `supabase_admin`.
- Keep extensions and platform-managed objects out of `public` where supported; do not move managed objects as part of P0.
- Add a read-only ownership/default-ACL check to ongoing drift review, and explicitly investigate any application table/function/sequence owned by `supabase_admin`.
- Review the Supabase Data API “Automatically expose new tables” setting separately; this PR does not change Dashboard settings.
- The P0 migration reduces risk for the current `postgres`-owned application objects and future `postgres`-created objects. It does not claim to neutralize every platform-managed default ACL.

Reference: [Supabase — Can't change the default privileges of supabase_admin in the public schema](https://supabase.com/kb/troubleshooting/cant-change-the-default-privileges-of-supabase_admin-in-the-public-schema) and [Securing your API](https://supabase.com/docs/guides/api/securing-your-api).

## 4. Local-only test strategy

The test runner refuses to run unless `P0_TEST_ALLOW_RESET=1` is set and the exact local container `supabase_db_3i-xaas-local` is running. It never connects to a remote project or reads a production URL. The fixture is destructive to that disposable local database only.

The test sequence is:

1. Create a synthetic baseline that mirrors the five reviewed tables, RLS, and public-read policies; seed only synthetic rows and deliberately simulate broad pre-migration grants.
2. Apply the exact migration SQL directly to the disposable local PostgreSQL database. It does not record migration history or run `supabase db reset`, because the repository still lacks a reconciled schema baseline.
3. Assert that `anon` and `authenticated` lack all relevant privileges on protected tables and write privileges on read-only tables.
4. Under each client role, assert categories remain readable and only the published product row is visible.
5. Create a temporary table, sequence, and function after the migration to verify the default privileges for new objects created by `postgres`; remove these probe objects after the assertions.
6. Attempt SELECT, INSERT, UPDATE, DELETE and TRUNCATE operations against protected tables under both client roles and require permission-denied/ownership errors.
7. Assert existing and default `service_role` access remains available in the fixture.

The CI job must report actual results. A green workflow is required before this proposal can be considered test-verified; source review alone is not a test pass.

## 5. Recovery and rollback plan

### Before any shared-environment application

- Capture the current grants, default ACLs, policy definitions, table ownership, and relevant advisor output.
- Confirm a recoverable schema/metadata export and identify the exact operator and environment.
- Test this migration and the dependent application flows in an isolated environment.
- Obtain separate approval for the exact project, SQL change, timing, and post-change checks.

### If a local test fails

- Stop the test and preserve the failing CI output.
- Discard/recreate only the disposable local stack, then rerun after fixing the migration or fixture.
- Do not apply the migration remotely to “see whether it works.”

### If a future approved shared-environment change causes a regression

- Stop further rollout and do not deploy dependent changes.
- Use the recorded pre-change grant/default-ACL snapshot and application logs to identify the specific required permission.
- Prefer a forward corrective migration that grants only the minimum permission to the intended role after reviewing its RLS/policy and data-access implications.
- Do not automatically restore broad grants to `anon`/`authenticated` on `users` or `orders`; doing so would reintroduce the known exposure. Any exact ACL restoration requires a separate explicit approval and documented risk acceptance.
- Verify both the intended service flow and the negative security tests after recovery.

## 6. Approval and execution gates

- This PR is for review and local CI only.
- No production migration, data mutation, secret change, merge, or deployment is authorized by this document.
- Before any future live application, report the actual CI outcome, reviewed SQL, current drift, recovery evidence, and residual `supabase_admin` default-ACL risk, then obtain separate explicit approval.
