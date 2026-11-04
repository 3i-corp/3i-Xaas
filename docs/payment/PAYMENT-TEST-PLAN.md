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
