# Release Gates and Acceptance Criteria

**Status:** Proposed for review; effective only after approval and merge.  
**Rule:** Gates are sequential. Passing an earlier gate does not waive a later gate.

## Gate 0 — Phase and baseline control

Required:
- Current phase and its permitted actions are documented.
- Phase-specific prohibitions are respected. In particular, III Wallet Core Readiness Audit Phase 0 prohibits Production schema changes.
- Work is on a feature branch and reviewed through a PR; no direct push to `main`.
- The exact artifact/commit, acceptance criteria, CI evidence, review findings, residual risks, and recovery plan are recorded.

Exit: evidence is complete and the relevant reviewer explicitly accepts the baseline. A green CI badge alone is insufficient.

## Gate 1 — Supabase security proposal review

Required before considering any P0 grant change:
- Reconcile live schema and migration history when the phase permits live inspection/change.
- Review object inventory, role membership/effective privileges, PUBLIC grants, relation and column ACLs, RLS and complete policy sets, sequences, functions, and global/schema default ACLs.
- Test negative access, PUBLIC inheritance, column-level grants, SELECT/ALL policy drift, service-role preservation, global/schema defaults, preflight state preservation, and transactional rollback in disposable local CI.
- Verify CI passed and current-head review findings are resolved or explicitly accepted with rationale.
- Keep proposal outside active migrations until schema/migration history and phase gates allow promotion.
- Record Supabase-managed default-ACL limitations and residual risks.

Exit: reviewed evidence and approvals are complete. This gate does not itself authorize Production application.

## Gate 2 — Core System Product Prototype

Required acceptance criteria:
1. Versioned, reviewable prototype PR.
2. Agreed cross-service surfaces and key user/operator journeys are represented.
3. Each metric documents definition, unit, aggregation window, owner, source/provenance, freshness, and limitations.
4. Sample values are unmistakably synthetic and isolated from Production credentials, APIs, databases, payments, wallet balances, and customer records.
5. Primary workflows, responsive behavior, and accessibility basics are reviewed.
6. Automated checks/build pass on the exact reviewed commit.
7. Security/privacy boundaries, known gaps, and non-goals are documented.
8. A reviewer explicitly records acceptance against these criteria.
9. If approved anonymized aggregate reference data is not available, calibration remains an explicit open limitation. Hand-authored trends must not be described as measured, forecast, or calibrated real-service behavior.

Exit: explicit review acceptance is recorded. No production data or module activation before this exit.

## Gate 3 — III Wallet readiness

Required:
- Functional behavior and state transitions are specified and tested.
- Security, authorization, ledger integrity, idempotency, concurrency, error handling, reconciliation, and recovery tests are complete as applicable to the implementation.
- Integration contracts with Identity, Billing, API Platform, and other dependent surfaces are reviewed.
- Failure modes, monitoring, operational ownership, backup/recovery, and incident handling are documented.
- No unresolved critical/high-severity defects; remaining lower-severity issues have owners, impact, and accepted mitigation.
- Evidence is tied to exact commits and test runs.

Exit: reviewers explicitly assess III Wallet as complete and ready to serve. Do not infer readiness from a prototype, passing unit tests alone, or schema changes.

## Gate 4 — System-wide production readiness

Required:
- All required service/module gates have passed and cross-service integration is tested.
- Production schema/migration state is reconciled; changes are narrowly scoped, approved, compatible, recoverable, and verified.
- Access controls, secrets management, observability, alerting, operational ownership, backup/recovery, and incident response are reviewed.
- Rollout/rollback or forward-recovery plan and success/stop criteria are explicit.
- Security/privacy, data retention, and user-impact review are complete.
- A release decision names the scope, operator, timing, monitoring, and rollback conditions.

Exit: explicit release approval. Only the approved scope may be activated.

## Mandatory stop conditions

Stop and report instead of proceeding if:
- CI fails, is missing, or does not correspond to the reviewed commit.
- A material current-head review finding remains unaddressed.
- Live schema, migration history, grants, policies, ownership, or data differs from reviewed assumptions.
- A phase restriction conflicts with the proposed action.
- Recovery is untested or expected impact is unclear.
- A proposed action could expose data, broaden access unexpectedly, cause data loss, or activate a service prematurely.

## Evidence record template

For every gate, record:
- Gate and decision: PASS / IN REVIEW / BLOCKED / DEFERRED.
- Scope and acceptance criteria.
- Commit SHA, PR, CI run(s), and current-head review evidence.
- Test environment and whether data is synthetic, anonymized, or live.
- Security/compatibility analysis and known limitations.
- Recovery plan and stop conditions.
- Reviewer/approver and timestamp.
- Next permitted action and actions still prohibited.

## Relationship to Baseline Lock

Baseline Lock records a verified engineering state; it is not production-readiness certification, approval to apply arbitrary SQL, permission to activate modules, or a launch decision. The user's standing authorization for scoped Supabase Production changes is subordinate to all phase restrictions and gates above.
