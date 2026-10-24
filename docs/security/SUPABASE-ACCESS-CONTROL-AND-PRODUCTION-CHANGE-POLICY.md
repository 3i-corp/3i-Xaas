# Supabase Access-Control and Production Change Policy

**Status:** Proposed for review. This document becomes repository policy only after approval and merge.  
**Scope:** Supabase roles, grants, RLS, database functions, sequences, migrations, and controlled Production changes.

## 1. Non-negotiable boundaries

- Treat Production as a protected environment. Use disposable local Supabase and synthetic fixtures for tests.
- A passing CI run validates only its declared fixture and workflow scope. It does not prove the live project's grants, RLS, schema, migration history, data integrity, or service readiness.
- No production SQL or schema change during III Wallet Phase 0 where the readiness audit prohibits it. Standing user authorization for scoped changes never overrides phase gates.
- No module/data activation before explicit acceptance of the Core System Product Prototype gate. No full production launch until III Wallet readiness, system-wide review, and explicit release approval.
- Never commit, paste into reports, or print secrets, service-role keys, database passwords, access tokens, or generated local credentials. Mask logs; rotate a credential if exposure is confirmed.
- Never assume a database rollback is equivalent to reverting application code.

## 2. Role and privilege principles

- Apply least privilege: grant only the minimum operations to the exact intended role and object.
- Distinguish direct grants, grants inherited through PostgreSQL `PUBLIC`, column-level ACLs, ownership/superuser behavior, RLS policies, and default privileges. Inspect effective access, not only a single grant list.
- RLS is not a substitute for correct grants; grants are not a substitute for RLS. Both must be reviewed.
- For client-accessible tables, define the expected policy set and test negative cases. Unexpected permissive policies, including applicable `ALL` policies, must fail closed. PostgreSQL combines applicable permissive policies, so an extra permissive policy can broaden access.
- Protect private tables such as user, order, order-item, wallet, identity, and billing records by default. Do not grant client access until an approved, specific access model and policy tests exist.
- Preserve service-role and owner access required for operation, but never expose service-role credentials to browsers or untrusted clients.
- Inspect table and column grants independently. Relation-level REVOKE alone does not necessarily remove column ACLs.
- Inspect both schema-scoped and global default ACLs. Global default-privilege changes may affect future objects across schemas and require explicit reviewed grants for API-facing objects.
- Do not attempt to modify Supabase-managed `supabase_admin` defaults or platform-owned objects through unsupported application migrations. Document the residual risk and platform boundary.

## 3. P0 proposal handling

The least-privilege SQL under `supabase/proposals/` is a proposal, not an active migration. Reviewers and operators must use [PR #9](https://github.com/joofjang2539-hash/3i-XaaS/pull/9) and its exact [P0 SQL proposal](https://github.com/joofjang2539-hash/3i-XaaS/blob/security/p0-restrict-public-api-grants/supabase/proposals/p0_restrict_public_api_grants.sql); do not treat it as approved or active until the required gates pass.

Before it can be considered for application:
1. Reconcile the current live schema and migration history with the repository.
2. Confirm the exact object inventory, owners, RLS state, policies, direct grants, PUBLIC grants, column ACLs, sequences, function privileges, and global/schema default ACLs.
3. Compare the observed state to the proposal preconditions. Stop on drift or unexpected objects; do not improvise a broader change.
4. Review the complete SQL, transaction behavior, preflight checks, and recovery procedure.
5. Run disposable-local tests for expected access, denied access, PUBLIC inheritance, column ACLs, global and schema defaults, service-role preservation, policy drift for SELECT and ALL, and rollback after an injected post-preflight failure.
6. Verify rejected preflight leaves the fixture state unchanged.
7. Obtain a current-head code review and successful CI on the exact commit.
8. Confirm phase gates permit the change. If Phase 0 still forbids Production schema changes, do not apply it.
9. Only after all prerequisites pass, obtain the applicable baseline/release approvals and record the exact reviewed SQL checksum.

## 4. Production change checklist

Before execution, record:
- Project identifier and confirmed environment (never infer Production from a project name).
- Exact approved baseline commit, PR, reviewers, and CI run URLs.
- Phase and release-gate status proving this change is allowed now.
- Live preflight results: schema/migration history, object ownership, effective privileges, RLS and policy set, defaults, dependencies, and drift.
- Exact SQL/change set and checksum, expected before/after state, blast radius, compatibility impact, and objects intentionally excluded.
- Backup/recovery evidence and a tested rollback or forward-recovery plan; identify whether recovery is transactional, code-only, or requires a compensating database change.
- Named operator, approval record, execution window, monitoring, and stop conditions.

During execution:
- Apply only the reviewed change set; do not combine unrelated changes.
- Stop on any unexpected object, ACL, policy, schema, migration-history, or data state.
- Do not bypass a failed preflight, broaden access to “make it work,” or activate a module as a side effect.

After execution:
- Verify grants and effective privileges, column ACLs, RLS policies, default ACLs, intended positive/negative access probes, application compatibility, and errors.
- Record actual SQL checksum, time/operator, results, deviations, recovery action, and follow-up work.
- If verification fails, stop further rollout and use the reviewed recovery plan. Do not claim success until verified.

## 5. Incident and drift response

If an unexpected privilege or policy is found, preserve evidence, stop the affected change, classify severity and exposure, and restrict access only through a separately reviewed and safe response. Do not delete user data or platform objects to force a clean baseline. Report possible credential exposure promptly and follow the credential-rotation process.

## 6. References

- Supabase: [Securing your API](https://supabase.com/docs/guides/api/securing-your-api)
- Supabase: [Can't change default privileges of supabase_admin in public schema](https://supabase.com/kb/troubleshooting/cant-change-the-default-privileges-of-supabase_admin-in-the-public-schema)
- PostgreSQL 17: [ALTER DEFAULT PRIVILEGES](https://www.postgresql.org/docs/17/sql-alterdefaultprivileges.html)
- PostgreSQL 17: [Row Security Policies](https://www.postgresql.org/docs/17/ddl-rowsecurity.html)
- PostgreSQL 17: [REVOKE](https://www.postgresql.org/docs/17/sql-revoke.html)

External references explain platform/database behavior; they do not replace a live project audit or this repository's approval gates.
