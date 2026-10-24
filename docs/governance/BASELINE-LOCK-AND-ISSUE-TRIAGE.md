# Baseline Lock and Issue-Triage Policy

**Status:** Proposed for review  
**Applies to:** 3i-XaaS shared platform and its modules  
**Effective only after PR approval/merge:** Yes

## 1. Purpose

Keep verified work reusable and stable while preserving the ability to extend or revise it safely. A baseline lock records a known-good state; it does not make code immutable, certify production readiness, or authorize deployment.

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

## 5. Safe testing and release boundaries

- Synthetic/mock data and disposable local databases are allowed when useful; label them and keep them separate from live data.
- Use feature branches and pull requests. Do not push directly to `main`.
- No production SQL, live-data mutation, merge, or deployment without a separate explicit approval after reporting the scope, evidence, risks, and rollback plan.
- Secrets must never be committed or copied into logs or reports.
- Database changes must be additive and compatibility-aware where possible. Do not convert a proposal into an active migration until the schema baseline and migration history are reconciled.
- A rollback plan must distinguish code rollback from database/data rollback; do not assume reverting a commit reverses data changes.

## 6. Initial evidence ledger (2026-10-24)

| Item | Status | Evidence and boundary |
|---|---|---|
| P0 least-privilege grants proposal | IN REVIEW | PR #9: https://github.com/joofjang2539-hash/3i-XaaS/pull/9 |
| P0 synthetic Supabase-local CI test | Test run passed | Workflow run: https://github.com/joofjang2539-hash/3i-XaaS/actions/runs/40043391104. This validates the disposable CI test scope only. |
| Live Supabase grants/schema mutation | NOT PERFORMED | Proposal has not been applied to the real Supabase project. |
| Production merge/deployment of P0 | NOT AUTHORIZED / NOT PERFORMED | Requires a separate review and explicit approval. |
| Repository policy in this document | PROPOSED | Must be reviewed and merged before it is an official repository policy. |

## 7. Review/update protocol

When updating a locked baseline, include: prior baseline/commit, reason for change, changed scope, new test evidence, compatibility/security impact, rollback approach, and any remaining deferred issues. Preserve the prior evidence rather than silently overwriting history.
