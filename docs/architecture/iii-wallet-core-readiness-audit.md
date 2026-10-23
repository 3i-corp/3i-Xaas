# iii Wallet Core Readiness Audit — Baseline

- **Audit date:** 2026-10-24
- **Repository:** `joofjang2539-hash/3i-Xaas`
- **Branch reviewed:** `main`
- **Purpose:** Establish a pre-implementation baseline for iii Wallet; not a production certification.

## Executive summary

**Status: Not ready for real-money production; suitable to begin a controlled Core-readiness and architecture phase.**

The repository has initial CI and Supabase infrastructure scaffolding, but the reviewed baseline does not establish a production wallet ledger, tenant-scoped financial schema/RLS, stable Wallet API contracts, provider reconciliation, risk/limit enforcement, or operational recovery for money movement. No real-money Wallet schema or provider integration should be assumed to exist.

## Repository evidence reviewed

- Root `package.json`: workspaces are `apps/*` and `packages/*`; scripts include `dev:web`, `dev:ws`, and `test:integration`.
- `supabase/config.toml`: local Supabase project configuration is present.
- `scripts/test-integration.mjs`: integration smoke tests check local Auth health and REST/PostgREST reachability only.
- `.github/workflows/supabase-local-ci.yml`: starts local Supabase and runs the smoke test when prerequisites exist. Its explanatory comments still state the config/script are not present; those comments are stale and should be corrected in a small maintenance change.
- `.github/workflows/deploy-edge-functions.yml`: validates Edge Function source and gates deployment to the configured Supabase project from `main` or manual dispatch from `main`; deployment requires GitHub environment secrets.
- `README.md`: minimal project description; no architecture or production readiness guidance.
- No committed Supabase migrations or stable financial API contract were found in the reviewed default-branch files. This is consistent with the open health-function PR context, but must be rechecked before schema work.
- PR #4, `feat: add secure Supabase Edge Function health endpoint`, is open as of the audit. Its review contains a P2 finding that the 405 response should include an `Allow: GET, HEAD, OPTIONS` header. This should be resolved before merging that PR. Its health endpoint is a liveness probe only, not a database or Wallet readiness check.

## Readiness matrix

| Area | Baseline status | Required next step |
|---|---|---|
| Product requirements | Initial limits/currencies confirmed | Record in ADR and versioned policy; resolve open interpretations |
| Identity / tenant model | Not verified as production-ready | Audit Auth, profiles, tenant membership, role checks and account lifecycle |
| Financial ledger | Not found in reviewed main files | Design double-entry ledger, invariants, reversals, holds and reconciliation |
| Multi-currency | No Wallet implementation verified | Define THB/USD/KHR precision, FX provenance and future currency configuration |
| RLS / data access | Not verified | Inspect actual schema and policies; test cross-tenant and unauthorized access |
| Payment provider | No production Wallet adapter verified | Select provider(s) by legal entity, country, capability and contract eligibility |
| Idempotency / concurrency | Not verified for financial writes | Define request keys, unique constraints, locking/atomic balance checks and replay tests |
| Limits / fee policy | Product baseline now documented | Build server-side versioned policy engine and boundary tests |
| Refunds / cashback | Baseline policy documented, implementation not verified | Build linked, idempotent flows and reconciliation |
| Virtual card | Architecture requirement only | Provider discovery, issuer/program manager review, sandbox and launch gates |
| Disputes | Baseline model required | Define evidence, event history, resolution and linked financial actions |
| Observability / operations | Only infrastructure liveness work visible | Add transaction metrics, alerting, runbooks, support tools and incident procedures |
| Backup / recovery | Not verified | Define RPO/RTO, backup verification, restore drills and disaster recovery |
| Compliance | Not verified | Obtain country/product-specific legal and provider approval before enabling money movement |
| CI/CD | Basic workflows present | Add migration lint/tests, RLS tests, ledger invariants, provider contract tests and controlled deployment approval |

## Confirmed product baselines

- Initial currencies: THB, USD and KHR; future currencies such as CNY should be configurable.
- Stored wallet value cap: THB 100,000 equivalent per Wallet account; incoming limits are separate.
- Daily limit: THB 50,000 equivalent per transaction category, with USD/KHR conversion under an auditable FX policy.
- No interest-bearing balance in the initial version.
- Intended future capabilities include user-to-user transfers, supported purchases, mobile top-ups, bill payments and virtual debit card.
- Refund flow should offer iii Wallet first where eligible; otherwise refund to the original source where supported.
- Cashback is distinct from a refund and requires funded campaign controls.
- Market Center seller proceeds remain separate from spendable iii Wallet balance.
- Provider/legal approval is a launch gate; these limits are a product baseline, not permission to operate.

## Recommended execution sequence

### Phase 0 — Finish repository and baseline audit
1. Review all current branches and open PRs; resolve or explicitly disposition PR #4 review finding.
2. Inspect app/package structure, current Supabase migrations (if any), Auth/profile model, RLS policies, secrets configuration and deployment environments.
3. Correct stale CI comments and ensure integration tests really run in PR CI.
4. Record the current architecture and missing pieces without making production schema changes.

### Phase 1 — ADRs and threat model
1. Approve ADR-001 for Wallet multi-currency ledger and transaction controls.
2. Add ADRs for tenant isolation, provider boundary, ledger/reversal model, idempotency/reconciliation, and production deployment gates.
3. Threat-model double-spend, replay, forged webhooks, tenant crossover, privilege escalation, account takeover, provider outage and FX/rounding errors.

### Phase 2 — Non-production foundation
1. Add migrations only after schema inspection; additive and reversible where possible.
2. Implement ledger primitives and property/invariant tests with simulated funds only.
3. Add tenant/RLS tests, concurrent transaction tests, idempotency tests, refund/reversal tests and reconciliation fixtures.
4. Do not enable external money movement or use production customer funds in this phase.

### Phase 3 — Provider sandbox
1. Select providers based on target country, legal entity, wallet/balance model, P2P transfer, card issuance, local rails and settlement capability.
2. Implement adapters and webhook verification.
3. Run sandbox scenarios, failure/replay tests and reconciliation.

### Phase 4 — Production readiness gate
Require documented sign-off for legal/provider approval, security review, independent ledger review, limits/fee policy, KYC/risk operations, support and dispute handling, monitoring/alerts, backup/restore, incident response, and a rollback/disable plan. Real-money launch is prohibited until all required gates are met.

## Change governance

- Work on feature branches and open PRs; never push directly to `main`.
- No destructive migration without review, compatibility plan and recovery strategy.
- Keep secrets out of source, logs, issues and audit artifacts.
- A green CI run does not itself authorize production deployment or real-money processing.
