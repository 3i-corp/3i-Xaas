# Payment Provider Evaluation — Thailand and Cambodia

- **Status:** Evaluation plan — no provider selected for Production
- **Date:** 2026-10-29
- **Scope:** Shared 3i-XaaS Core Payment API; initial merchant checkout for approved products/services
- **Decision owners:** Product, Engineering, Finance/Operations, Compliance/Legal
- **Related:** [ADR-001 — iii Wallet Multi-Currency Ledger and Transaction Controls](adr/ADR-001-iii-wallet-multi-currency-ledger.md); [iii Wallet Core Readiness Audit](iii-wallet-core-readiness-audit.md)

## 1. Purpose and guardrails

Evaluate payment providers for a planned Thailand and Cambodia launch without prematurely binding 3i-XaaS products or iii Wallet to one provider.

This document records a candidate shortlist and the evidence required for a decision. It does **not** confirm that any merchant account is approved, that a provider supports the intended legal entity, that all country/currency/payment-method combinations are available, or that real-money operations are authorized.

The first integration scope is merchant checkout for approved goods/services and subscriptions. It does not authorize stored-value issuance, person-to-person transfers, third-party seller payouts, or other regulated money movement.

## 2. Candidate shortlist

| Candidate | Current rationale | Initial role in evaluation | Evidence still required |
| --- | --- | --- | --- |
| **Omise** | The project owner reports that an Omise account has already been registered. Existing registration may reduce onboarding effort, but account status and eligibility are not yet verified in this repository. | Evaluate first for Thailand checkout; retain as a candidate, not a production selection. | Merchant account approval/activation; legal entity and country eligibility; PromptPay availability; supported charge and settlement currencies; settlement bank and timing; current pricing; refund and dispute behavior; API/webhook and reconciliation evidence. |
| **2C2P** | The project owner agrees to evaluate 2C2P for the regional launch. Public channel documentation lists Thailand and Cambodia-related payment options, but this does not prove one contract or merchant account covers the project's entities and desired flows. | Regional candidate; request a written proposal covering both launch markets. | Eligibility by legal entity; exact TH/KH methods (including PromptPay and KHQR where needed); currencies accepted and settled; per-country contracts and bank accounts; pricing/FX; settlement timing; refunds/chargebacks; marketplace and recurring-payment restrictions; sandbox and reconciliation capabilities. |
| **Beam Checkout** | Public materials describe a Thailand-focused checkout path with PromptPay-related capabilities. | Optional Thailand-specific comparator only; not required for the first implementation. | Merchant eligibility; final PromptPay fees and payout schedule; event/API behavior; supported business model; settlement and reconciliation details. |
| **ABA PayWay** | Public documentation describes Cambodia payment capabilities including ABA/KHQR and KHR/USD options. | Potential Cambodia-specific fallback if the regional provider cannot meet Cambodia requirements. | Merchant and legal-entity eligibility; commercial quote; settlement currencies/accounts; integration and operational support; refund and reconciliation capabilities. |

Provider-specific facts must be rechecked against current official documentation and a written provider response before implementation or launch. Public feature lists are not a substitute for contract approval.

## 3. Provisional evaluation approach

1. **Verify the existing Omise account** through the provider dashboard or account team. Record only non-secret account status, legal entity, country, enabled methods, accepted/settlement currencies, and contract/pricing evidence. Do not place API secrets, access tokens, bank details, or customer information in this repository.
2. **Request a comparable 2C2P proposal** for Thailand and Cambodia. Ask whether both markets can be served under the intended corporate structure, whether separate merchant accounts/contracts are required, and which currencies can be accepted and settled in each market.
3. **Use the same scorecard** for each provider:
   - legal-entity and country eligibility;
   - required payment methods by market;
   - accepted currency versus settlement currency;
   - total fees, FX, refunds, chargebacks and payout costs;
   - API maturity, signed webhooks, idempotency and status-query support;
   - settlement reports, reconciliation and exception handling;
   - support SLA, incident communication and account operations;
   - recurring-payment, SaaS, marketplace or payout restrictions relevant to the actual product.
4. **Choose the smallest viable initial scope.** Do not integrate all candidates at once. Prefer one provider for the first approved checkout flow, with a second adapter only when a documented country/method gap or business-continuity requirement justifies it.
5. **Keep the provider decision reversible.** Provider-specific logic must remain behind a Core Payment API and adapter boundary.

## 4. Target architecture

```text
3i-XaaS products (Billing / Subscription / Commerce)
                         |
                         v
                 Core Payment API
                         |
           +-------------+-------------+
           |             |             |
           v             v             v
      Omise adapter  2C2P adapter  Optional local adapter
           |             |             |
           +-------------+-------------+
                         |
                Provider checkout/API
                         |
              Signed provider webhooks
                         |
                         v
          Verify -> deduplicate -> transition
             -> audit -> reconcile -> notify
```

The diagram is a target design, not an implementation claim. Only adapters approved for a specific country, currency, product and transaction type may be enabled.

### Core Payment API responsibilities

- Create an internal payment/order reference before calling a provider.
- Persist provider, merchant-account reference, country, payment method, order amount/currency and idempotency reference.
- Keep accepted/transaction currency separate from settlement currency and record FX/fees where applicable.
- Model at least `CREATED`, `PENDING`, `SUCCEEDED`, `FAILED`, `EXPIRED`, `CANCELLED`, `REFUND_PENDING`, `REFUNDED`, and an operational `REVIEW_REQUIRED` state where appropriate.
- Verify webhook authenticity, deduplicate provider event IDs, handle retries/out-of-order delivery, and make state transitions idempotent.
- Never treat a browser redirect alone as proof of payment. When status is ambiguous, query/reconcile the existing transaction instead of creating a duplicate charge.
- Keep provider secrets in approved secret storage and out of source code, logs, test fixtures and documentation.
- Provide reconciliation views/reports for provider transactions, fees, refunds, settlement batches and unmatched items.

## 5. Boundaries with iii Wallet and Market Center

- A successful merchant checkout is not automatically a credit to a user's spendable iii Wallet balance.
- The merchant payment record, provider receivable, company revenue/fees, customer wallet funds and Market Center seller proceeds must remain separate.
- Wallet ledger postings require their own approved transaction rules and authoritative evidence; provider webhooks must not directly bypass ledger invariants.
- Marketplace split payments or seller payouts are out of the initial checkout scope unless a provider contract, legal review and separate release gate explicitly approve them.
- Real-money movement remains disabled until all applicable provider, legal/compliance, security, reconciliation and operational release gates are signed off.

## 6. Evidence and release gates

### Gate A — Commercial and legal eligibility

- Written confirmation of the contracting legal entity and supported launch country.
- Exact payment methods, transaction currencies and settlement currencies by merchant account.
- Signed/approved commercial terms, fee schedule, settlement timeline, refund and dispute conditions.
- Explicit confirmation of any restrictions affecting SaaS subscriptions, digital services, Wallet, marketplace or payouts.

### Gate B — Technical readiness in Sandbox

- Credentials are held outside source control and separated from production credentials.
- Tests cover success, decline/failure, pending/timeout, duplicate requests, webhook retries, invalid signatures, out-of-order events, refunds and status reconciliation.
- Idempotency and duplicate-charge prevention are demonstrated.
- Logs and audit trails exclude secrets and unnecessary sensitive payment data.

### Gate C — Operational reconciliation

- Provider transaction and settlement reports can be obtained and matched to internal references.
- Fees, taxes, FX, refunds, chargebacks and net settlement are represented distinctly.
- Unmatched, delayed and contradictory statuses have a documented manual-review path and owner.

### Gate D — Production approval

Production use requires a separate explicit approval after Gates A–C pass, applicable legal/compliance review is complete, and rollback/incident handling is documented. Merging this document or passing CI is not production approval.

## 7. Immediate next actions

1. Confirm the Omise account's current status and registered legal entity through the provider dashboard/account team.
2. Obtain a written 2C2P proposal using the same TH/KH eligibility, methods, currencies, settlement, fees and support questions.
3. Compare both using the scorecard above and record evidence without exposing secrets.
4. Select one initial checkout path only after the evidence is reviewed.
5. Revisit Beam and ABA PayWay only if they close a documented country or payment-method gap.

## 8. Decision log

- **Agreed direction:** Evaluate 2C2P for the Thailand–Cambodia launch.
- **Known project input:** An Omise account has been registered; its approval/activation and capabilities remain unverified here.
- **Not decided:** Production provider, legal-entity mapping, supported method/currency matrix, fees, settlement arrangement, and launch authorization.
- **Not performed by this document:** No provider account changes, credential handling, Supabase schema/migration changes, real-money transaction, or production activation.
