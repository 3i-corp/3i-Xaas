> **3i-XaaS Payment Baseline:** v1.0 — 2026-11-04  
> **Scope approval:** Approved by the project owner for architecture and documentation scope.  
> **Repository disposition:** PR #24; independent review and merge are pending. This document is not yet a LOCKED repository baseline.  
> **Permitted use:** Detailed design and controlled non-production implementation planning. This baseline does not authorize production schema/permission changes, live credentials, real-money processing, card issuance, module activation, or deployment.  
> **Controlling policy:** Existing III Wallet ADR-001, Baseline Lock policy, Phase restrictions, and Release Gates remain in force.

# Payment & III Wallet V1 — Test Plan

## PromptPay sandbox
- Create valid THB top-up and receive QR action.
- Reject zero, negative, malformed, over-limit and unsupported amounts.
- Verify QR expiry and expired-intent behavior.
- Success confirmed through authoritative provider resource.
- Failed, cancelled, expired, pending and unknown outcomes.
- Provider timeout before/after request acceptance.
- Missing, duplicate, delayed, reordered and replayed webhooks.
- Invalid signature/body tampering.
- Wrong merchant account, amount, currency or internal reference.
- Late success after expiry enters review/refund policy.
- Client retry and concurrent requests do not duplicate attempts/credits.

## Ledger and wallet
Balanced postings per currency; credit only after confirmed success; exactly-once credit under duplicate events/concurrent workers; pending funds not spendable; reversals link to original; limits enforced server-side; projection matches ledger; no client balance/tenant trust.

## Reconciliation
Detect provider success without wallet credit, wallet credit without provider success, missing/duplicate/mismatched provider records, fee/settlement mismatch; reruns do not duplicate adjustments.

## Virtual card (after issuer sandbox approval)
Issuance eligibility/KYC; tokenized display/no PAN-CVV leakage; freeze/unfreeze/termination; authorization approval/decline/insufficient funds; concurrent overspend protection; reversal/clearing/partial capture/refund/dispute; FX/cross-border where supported; issuer outage and reconciliation mismatch.

## Security/resilience
Authentication/authorization and tenant isolation; secret scanning; webhook signature/replay; rate limiting/abuse controls; dependency scanning and penetration test; backup/restore; incident recovery; load/concurrency testing at approved sandbox scale.

Record case ID, build/commit, environment, provider sandbox account, test-data class, result, evidence reference, defect severity, owner and reviewer. No production credentials or real customer financial data in fixtures.

## Acceptance and evidence rules

A test passes only when its result is tied to the exact commit, test environment and fixture/provider sandbox. Required evidence includes request/response correlation IDs with secrets redacted, ledger before/after assertions, webhook event IDs, reconciliation outputs and test-run logs. Synthetic fixtures must be clearly labeled. A test suite that does not exercise live-provider behavior must not be described as proving live-provider readiness. Critical financial invariants require deterministic tests and concurrency/replay coverage.
