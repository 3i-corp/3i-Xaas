# Baseline Lock and Issue-Triage Policy

**Status:** Proposed for review  
**Applies to:** 3i-XaaS shared platform and its modules  
**Effective only after PR approval/merge:** Yes

## 1. Purpose

Keep verified work reusable and stable while preserving the ability to extend or revise it safely. A baseline lock records a known-good state; it does not make code immutable, certify production readiness, or authorize module activation.

## 2. Baseline states

- **LOCKED — verified baseline:** Scope, source revision, test evidence, reviewer, and known limitations are recorded. Change only through a reviewed, traceable change.
- **IN REVIEW — evidence incomplete:** Work exists but has not met acceptance checks. Do not describe it as production-ready.
- **ISSUE — fix in the appropriate phase:** Record reproduction steps, impact, severity, suspected layer, owner/next action, and regression test. Fix and retest before changing status to LOCKED.
- **ENVIRONMENT BLOCKED — tool/device constraint:** Record the exact blocker and workaround. Do not misclassify it as an application defect; defer only the affected check, not unrelated work.
- **DEFERRED — intentionally out of scope:** Record reason, risk, dependency, and trigger for revisiting it.

## 3. Minimum evidence to lock a baseline

1. Scope and acceptance criteria are explicit.
2. A commit/PR or versioned artifact identifies the exact state.
3. Relevant automated checks pass; test data and mocks are identified as such.
4. Security, compatibility, migration/rollback, and known limitations are reviewed where applicable.
5. No unresolved critical/high-severity issue is hidden by the status.
6. Current review findings are checked against the exact commit being locked.
7. Status, evidence links, residual risks, and explicit reviewer acceptance are recorded in the repository.
8. CI success validates only the checks and test scope that actually ran; it is not proof of live-data correctness or production readiness.

## 4. Issue triage and sequencing

1. Reproduce and classify: product/code, architecture/security, data/migration, integration, test coverage, or tool/device environment.
2. Fix code/design/data issues in the current or next appropriate phase; add a regression test.
3. If blocked only by tools/device, use CI, local containers, mocks, synthetic data, or another safe environment where practical. Record what was and was not validated.
4. Do not delay independent work because of an unrelated environment blocker.
5. Re-lock only after relevant acceptance checks pass and evidence is updated.
6. Review comments on outdated lines are historical context, not proof that the latest revision is approved. Confirm each material finding is addressed and obtain review on the current head.

## 5. Safe testing, production changes, and release boundaries

- Synthetic/mock data and disposable local databases are allowed when useful; label them and keep them separate from live data.
- Use feature branches and pull requests. Do not push directly to `main`.
- **Standing production-change authorization (user-approved 2026-10-24):** After the specific change has a LOCKED/passed Baseline and evidence is recorded, a narrowly scoped Supabase Production database/schema/permission change may proceed only if the active phase plan and all other project gates permit that exact change. This authorization is subordinate to phase-specific constraints; it does not override any prohibition on Production schema changes, including the III Wallet Core Readiness Audit's Phase 0. It does not authorize module activation, production data exposure, service launch, or bypassing release gates.
- Before any permitted production change, record exact project/environment, baseline commit, reviewed SQL/change set and checksum, current-state/drift checks, impact and compatibility analysis, backup/recovery evidence, rollback or forward-recovery plan, operator/time, and post-change verification. Execute only reviewed scope. Stop if actual state differs from assumptions or the change could cause data loss, unexpectedly broaden access, or activate a service prematurely.
- Keep changes additive and compatibility-aware where possible. Do not convert a proposal into an active migration until schema baseline and migration history are reconciled. Passing CI alone does not establish live schema assumptions.
- **Core System Product Prototype acceptance gate (required before any live module/data activation):** (1) a versioned, reviewable prototype PR exists; (2) cross-service information architecture covers agreed service surfaces and key user/operator journeys; (3) every metric has documented definition, unit, aggregation window, owner, source/provenance, freshness and limitations; (4) all sample values are clearly labeled synthetic and isolated from production credentials, APIs and databases; (5) primary workflows, responsive behavior and accessibility basics are reviewed; (6) automated checks/build pass; (7) security/privacy boundaries and known gaps are documented; and (8) a reviewer explicitly accepts the prototype against these criteria. Synthetic trends alone do not prove real-service patterns. If approved anonymized reference aggregates are unavailable, record this as an open limitation; do not claim calibration is complete.
- No live module/data activation or public service launch before the prototype gate is met and explicitly accepted.
- **Full production service remains blocked until III Wallet is complete, passes required functional/security/integration/recovery tests, and is assessed ready to serve**, followed by a system-wide readiness review and explicit release approval. A Baseline Lock or database change does not satisfy this gate.
- Secrets must never be committed or copied into logs/reports. Redact credentials and tokens from CI output.
- A rollback plan must distinguish code rollback from database/data rollback; reverting a commit does not reverse data changes.
- Supabase-managed `supabase_admin` default ACLs and platform-owned objects require special handling; do not attempt unsupported changes to platform-managed defaults.
- See [Supabase Access-Control and Production Change Policy](../security/SUPABASE-ACCESS-CONTROL-AND-PRODUCTION-CHANGE-POLICY.md) and [Release Gates and Acceptance Criteria](RELEASE-GATES-AND-ACCEPTANCE.md) for operational checklists.

## 6. Evidence ledger (2026-10-24; CI rechecked)

| Item | Status | Evidence and boundary |
|---|---|---|
| P0 least-privilege grants proposal | IN REVIEW | [PR #9](https://github.com/joofjang2539-hash/3i-XaaS/pull/9), head `5da76236996117959984a4132b51036831dc0abe`. CI [Run #29](https://github.com/joofjang2539-hash/3i-XaaS/actions/runs/40050063859) passed on this head. Review threads still include unresolved findings; obtain a current-head review and check each material finding before lock. |
| Baseline Lock and issue triage policy | IN REVIEW | [PR #10](https://github.com/joofjang2539-hash/3i-XaaS/pull/10), current head `c2454b4d6a1844f31ae105346358545588b63b12`. CI [Run #41](https://github.com/joofjang2539-hash/3i-XaaS/actions/runs/40054739593) passed on that exact head; the Local CI and Supabase integration test job completed successfully. Codex review on the same head reported no major issues and no unresolved findings: [review receipt](https://github.com/joofjang2539-hash/3i-XaaS/pull/10#issuecomment-6378828763). Historical evidence only: [Run #40](https://github.com/joofjang2539-hash/3i-XaaS/actions/runs/40053818995) passed on `e1a49498fe6f7b6df796f65940b029ac6ba8e876`; [Run #38](https://github.com/joofjang2539-hash/3i-XaaS/actions/runs/40052472833) passed on earlier head `b0ca713bf2d0b1758834a7b0c76e446aa23eecf2). PR remains in review pending an independent approval; the governance document review is separate from Baseline Lock acceptance. No Production action, module/data activation, or launch is authorized. |
| Core System Product Prototype | IN REVIEW | [PR #11](https://github.com/joofjang2539-hash/3i-XaaS/pull/11), head `c445fa5bba713bc149d9942b081cd7143bc57d2e`. CI [Run #30](https://github.com/joofjang2539-hash/3i-XaaS/actions/runs/40050266719) passed. Values are hand-authored illustrative synthetic scenarios, not calibrated against approved anonymized reference aggregates. Reviewer acceptance and reference-data limitation remain open. |
| Live Supabase grants/schema mutation | NOT PERFORMED | P0 SQL remains a proposal outside the active migration chain. Live schema/migration history and ACLs must be rechecked only when phase gates permit. |
| Production module activation / full release | BLOCKED BY PROJECT GATES | Prototype gate first; full production service only after III Wallet completion, required tests, readiness review, and explicit release approval. |
| Repository policy in this document | PROPOSED | Not official until approved and merged. |

## 7. Review/update protocol

When updating a locked baseline, include prior baseline/commit, reason for change, changed scope, new test evidence, compatibility/security impact, recovery approach, and deferred issues. Preserve prior evidence rather than silently overwriting history.

For an authorized production change, record a separate change entry linked to the passed baseline, exact reviewed SQL/change-set checksum, execution time/operator, verification results, and follow-up issue. If post-change verification fails, stop further rollout, use the reviewed recovery plan, and report before proceeding.
