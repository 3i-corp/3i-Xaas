# Baseline Lock and Issue-Triage Policy

**Status:** Proposed for review  
**Applies to:** 3i-XaaS shared platform and its modules  
**Effective only after PR approval/merge:** Yes

## 1. Purpose

Keep verified work reusable and stable while preserving the ability to extend or revise it safely. A baseline lock records a known-good state; it does not make code immutable, certify production readiness, or authorize module activation.

## 2. Baseline states

- **LOCKED — verified baseline:** The scope, source revision, test evidence, and known limitations are recorded. Use as the starting point for later work. Change only through a reviewed, traceable change.
- **IN REVIEW — evidence incomplete:** Work exists but has not met the acceptance checks. Do not describe it as production-ready.
- **ISSUE — fix in the appropriate phase:** Record reproduction steps, impact, severity, suspected layer, owner/next action, and regression test. Fix and retest before changing status to LOCKED.
- **ENVIRONMENT BLOCKED — tool/device constraint:** Record the exact blocker and workaround. Do not misclassify it as an application defect; defer only the affected check, not unrelated work.
- **DEFERRED — intentionally out of scope:** Record the reason, risk, dependency, and trigger for revisiting it.

## 3. Minimum evidence to lock a baseline

1. Scope and acceptance criteria are explicit.
2. A commit/PR or versioned artifact identifies the exact state.
3. Relevant automated checks pass; test data and mocks are identified as such.
4. Security, compatibility, migration/rollback, and known limitations are reviewed where applicable.
5. No unresolved critical/high-severity issue is hidden by the status.
6. The status and evidence are recorded in the repository. A passing local/synthetic test is evidence for that test scope only; it is not proof of live-data correctness or production readiness.

## 4. Issue triage and sequencing

1. Reproduce and classify the issue: product/code, architecture/security, data/migration, integration, test coverage, or tool/device environment.
2. Fix code/design/data issues in the current or next appropriate phase; add a regression test.
3. If blocked only by tools/device, use CI, local containers, mocks, synthetic data, or another safe environment where practical. Record what was and was not validated.
4. Do not delay independent work because of an unrelated environment blocker.
5. Re-lock only after the relevant acceptance checks pass and the evidence is updated.

## 5. Safe testing, production changes, and release boundaries

- Synthetic/mock data and disposable local databases are allowed when useful; label them and keep them separate from live data.
- Use feature branches and pull requests. Do not push directly to `main`.
- **Standing production-change authorization (user-approved 2026-10-24):** Once the specific change has a **LOCKED / passed Baseline** and its evidence is recorded, the team may carry out the corresponding narrowly scoped Supabase Production database/schema/permission change only if the active phase plan and all other project gates permit that exact change. This authorization is subordinate to phase-specific constraints; it does not override a prohibition on Production schema changes (including the iii Wallet Core Readiness Audit's Phase 0), and is **not** permission to activate a module, expose production data, launch a service, or bypass project release gates.
- Before each production change, record the exact project/environment, baseline commit, proposed SQL or change set, current-state/drift checks, impact and compatibility analysis, backup/recovery evidence, rollback or forward-recovery plan, and post-change verification. Execute only the reviewed scope, then capture the result. Stop if actual state differs from the reviewed assumptions or if the change could cause data loss, broaden access unexpectedly, or activate a service prematurely; report the discrepancy before proceeding.
- Production changes must remain additive and compatibility-aware where possible. Do not convert a proposal into an active migration until the schema baseline and migration history are reconciled. A passing CI test alone is not evidence that live schema assumptions are current.
- **Core System Product Prototype acceptance gate (required before any live module/data activation):** (1) a versioned, reviewable prototype PR exists; (2) the cross-service information architecture covers the agreed service surfaces and key user/operator journeys; (3) every metric has a documented definition, unit, aggregation window, owner and limitations; (4) all sample values are clearly labeled synthetic and isolated from production credentials, APIs and databases; (5) primary workflows and responsive/accessibility basics are reviewed; (6) automated checks/build pass; (7) security/privacy boundaries and known gaps are documented; and (8) a reviewer records explicit acceptance against these criteria. Synthetic trends alone do not prove that real-service patterns have been validated. If approved anonymized reference aggregates are unavailable, record that as an open limitation and do not claim data calibration is complete.
- No live module/data activation or public service launch before the **Core System Product Prototype** gate above is met.
- **Full production service remains blocked until III Wallet is complete, passes required functional/security/integration/recovery tests, and is assessed ready to serve**, followed by a system-wide readiness review and explicit release approval. A Baseline Lock or a database change does not satisfy this gate.
- Secrets must never be committed or copied into logs or reports.
- A rollback plan must distinguish code rollback from database/data rollback; do not assume reverting a commit reverses data changes.
- Supabase-managed `supabase_admin` default ACLs and platform-owned objects require special handling; do not attempt unsupported changes to platform-managed defaults.

## 6. Initial evidence ledger (2026-10-24)

| Item | Status | Evidence and boundary |
|---|---|---|
| P0 least-privilege grants proposal | IN REVIEW | PR #9: https://github.com/joofjang2539-hash/3i-XaaS/pull/9 |
| P0 synthetic Supabase-local CI test (prior revision) | Test run passed | Workflow run: https://github.com/joofjang2539-hash/3i-XaaS/actions/runs/40043391104. This validates the disposable CI test scope only; it predates later hardening. |
| P0 hardening CI evidence | Historical evidence only; recheck current PR head before locking | Run #17: https://github.com/joofjang2539-hash/3i-XaaS/actions/runs/40045891394 passed for an earlier revision. Later P0 changes require a fresh successful CI run and review findings checked against the exact latest commit before locking. |
| Live Supabase grants/schema mutation | NOT PERFORMED | Proposal has not been applied to the real Supabase project. |
| Production module activation / full release | BLOCKED BY PROJECT GATES | Prototype gate first; full production service only after III Wallet completion, tests, and readiness review. |
| Repository policy in this document | PROPOSED | Must be reviewed and merged before it is an official repository policy. |

## 7. Review/update protocol

When updating a locked baseline, include: prior baseline/commit, reason for change, changed scope, new test evidence, compatibility/security impact, rollback approach, and any remaining deferred issues. Preserve the prior evidence rather than silently overwriting history.

For an authorized production change, record a separate change entry linked to the passed baseline, the exact reviewed SQL/change set, execution time and operator, verification results, and any follow-up issue. If post-change verification fails, stop further rollout, use the reviewed recovery plan, and report the result before proceeding.
