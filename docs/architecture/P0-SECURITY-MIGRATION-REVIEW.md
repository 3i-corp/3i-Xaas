# P0 Security Migration Proposal — Grants & Default Privileges

- **Status:** Proposed implementation; local-only tests must pass before review completion
- **SQL proposal (not yet in migration chain):** `supabase/proposals/p0_restrict_public_api_grants.sql`
- **Test runner:** `scripts/test-p0-security.sh`
- **Target live project (read-only audit reference only):** `nxbervftnchjhpaxjqqu`
- **Execution boundary:** No live SQL was applied. This PR must not deploy or apply the migration to a shared environment.

## 1. Latest read-only baseline

The read-only audit observed PostgreSQL 17 on the connected Supabase project. The five inventoried application tables were owned by `postgres` and had RLS enabled at the time of the audit. Recheck the live state and schema/migration history before any future shared-environment proposal.

| Object | Observed before state | Proposed state after migration |
|---|---|---|
| `public.users` | `anon` and `authenticated` had broad grants including SELECT/DML/TRUNCATE/REFERENCES/TRIGGER | No direct or PUBLIC-inherited table privileges for either client role |
| `public.orders` | `anon` and `authenticated` had broad grants including SELECT/DML/TRUNCATE/REFERENCES/TRIGGER | No direct or PUBLIC-inherited table privileges for either client role |
| `public.order_items` | No direct grants to client roles were observed in the audit; still treated as protected | Explicitly revoke PUBLIC and client-role privileges |
| `public.categories` | SELECT granted; policy `Public can read categories` allowed reads | SELECT only, and only with the exact reviewed policy set |
| `public.products` | SELECT granted; policy `Public can read published products` filtered by `is_published = true` | SELECT only, and only with the exact reviewed policy set |
| Public sequences | Audit observed broad client-role sequence defaults for objects created by `postgres` | Revoke existing PUBLIC/client-role privileges |
| Future objects created by `postgres` | Global and schema-specific defaults may combine; global PUBLIC EXECUTE can also grant access | Revoke PUBLIC/client-role defaults globally and in `public`; explicit grants required |
| Existing `service_role` grants | Present on application tables and in PostgreSQL defaults at audit time | Not revoked or changed by this proposal |

## 2. Fail-closed preflight

Before changing grants, the SQL requires the expected roles, all five tables, and RLS to exist. For both `categories` and `products`, it also requires the exact expected SELECT policy and rejects any additional SELECT/ALL policy. This strict check is intentional: PostgreSQL combines applicable permissive policies with OR, so an extra permissive policy could weaken the intended published-product filter.

The migration revokes column-level and relation-level table privileges from `PUBLIC`, `anon`, and `authenticated`, then grants SELECT only on categories and products to the two client roles. It also revokes existing sequence privileges from those principals.

## 3. Global and schema-specific default privileges

PostgreSQL combines global default ACLs with schema-specific default ACLs. A schema-scoped REVOKE cannot cancel a grant inherited from a global default. The proposal therefore revokes table, sequence, and function defaults from `PUBLIC`, `anon`, and `authenticated` globally for objects created by `postgres`, and repeats the revokes in `public` to clear schema-specific defaults.

**Scope consequence:** global default-privilege changes affect future objects created by `postgres` across schemas, not only `public`. This is deliberate least-privilege behavior, but must be reviewed against application and platform object creation before any shared-environment application. Required API-facing access must be explicitly granted in the migration that defines the object. Existing function grants are not changed.

Supabase-managed `supabase_admin` default ACLs are not changed. Supabase documents that these defaults cannot be changed by an application migration. Mitigations and residual risk:

- Application migrations must run as `postgres`; application-owned objects must not be created as `supabase_admin`.
- Keep extensions and platform-managed objects out of `public` where supported; do not move managed objects as part of P0.
- Add read-only ownership/default-ACL drift checks and investigate application objects owned by `supabase_admin`.
- Review the Supabase Data API “Automatically expose new tables” setting separately; this PR does not change Dashboard settings.
- This proposal does not claim to neutralize every platform-managed default ACL.

References: [Supabase — Can't change the default privileges of supabase_admin in the public schema](https://supabase.com/kb/troubleshooting/cant-change-the-default-privileges-of-supabase_admin-in-the-public-schema) and [Securing your API](https://supabase.com/docs/guides/api/securing-your-api).

## 4. Local-only test strategy

The test runner refuses to run unless `P0_TEST_ALLOW_RESET=1` is set and the exact local container `supabase_db_3i-xaas-local` is running. It never connects to a remote project. The fixture is destructive to that disposable local database only.

The synthetic fixture now seeds:
1. Direct relation-level grants to client roles and `PUBLIC` on the five application tables, a separate column-level grant on `users.email`, and grants on a sequence.
2. Broad global and `public`-schema default ACLs for tables, sequences, and functions, including grants to `PUBLIC`.
3. Synthetic rows and only the two expected public-read policies.

Before applying the proposal, CI injects unexpected SELECT and ALL policies on both `categories` and `products`. Each attempt must fail with the expected preflight error and assert that seeded table/column grants remain unchanged, proving the preflight rejects drift before any grant change. CI then applies the proposal to the clean synthetic fixture and checks:
- No effective client-role access to protected tables, a separately granted protected column, or existing sequences.
- SELECT-only access to categories and the published product row.
- Future tables, sequences, and functions created by `postgres` do not grant privileges to `anon` or `authenticated`, while the fixture's `service_role` defaults remain.
- Negative operations against protected tables are denied.
- Injected extra permissive categories/products SELECT and ALL policies each make the proposal fail closed before privilege changes, with seeded grants asserted unchanged.

The SQL remains an unsequenced proposal and is not an active migration. The local CI result is evidence for this synthetic fixture only, not proof that the live Supabase ACLs or application flows are safe.

## 5. Recovery and rollback plan

### Before any shared-environment application

- Re-read the current grants, global and schema-specific default ACLs, policy definitions, table ownership, and migration history.
- Confirm a recoverable schema/metadata export and identify the exact operator and environment.
- Test this proposal and dependent application flows in an isolated environment.
- Apply the user's standing authorization only after the relevant Baseline is locked/passed, and only for the exact reviewed, narrowly scoped change. Re-confirm approval only if scope expands, assumptions differ, recovery is inadequate, or a material risk remains unresolved.

### If a local test fails

- Stop the test and preserve the failing CI output.
- Discard/recreate only the disposable local stack, then rerun after fixing the proposal or fixture.
- Do not apply the proposal remotely to “see whether it works.”

### If a future approved shared-environment change causes a regression

- Stop further rollout and do not deploy dependent changes.
- Use the recorded pre-change grant/default-ACL snapshot and application logs to identify the specific required permission.
- Prefer a forward corrective migration granting only the minimum permission to the intended role after reviewing RLS and data-access implications.
- Do not automatically restore broad grants to `anon`/`authenticated` on `users` or `orders`; that would reintroduce the known exposure. Any exact ACL restoration requires separate explicit approval and documented risk acceptance.
- Verify the intended service flow and negative security tests after recovery.

## 6. Approval and execution gates

- This PR is for review and local CI only.
- No production migration, data mutation, secret change, merge, or deployment is authorized by this document.
- Before any future live application, report actual CI results, reviewed SQL, current drift, migration-history reconciliation, recovery evidence, global default-ACL impact, and residual `supabase_admin` risk. The user's standing authorization applies only after the relevant Baseline is locked/passed and only while the reviewed scope and safety conditions remain true; stop and report any mismatch.
