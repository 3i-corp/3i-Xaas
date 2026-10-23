# ADR-001: iii Wallet Multi-Currency Ledger and Transaction Controls

- **Status:** Proposed — baseline approved for architecture planning only
- **Date:** 2026-10-24
- **Scope:** iii Wallet and shared 3i-XaaS Core
- **Decision owners:** Product, Engineering, Compliance/Legal, Payment Provider

## Context

iii Wallet is intended to support multiple 3i-XaaS products and, subject to provider availability and applicable approvals, wallet payments, person-to-person transfers, mobile top-ups, bill payments, and virtual debit cards. It must not mix customer wallet funds with Market Center seller proceeds or company revenue.

This ADR records product baselines; it does **not** authorize real-money operations or establish that any regulatory approval or provider capability has been obtained.

## Decisions

### 1. Multi-currency from the first version

- Initial currencies: THB, USD, and KHR.
- Future currencies (including CNY and other market-specific currencies) must be addable through configuration and provider/product capability, not a redesign of the ledger.
- Every monetary account and ledger entry has exactly one currency.
- Never add unlike currencies directly. FX requires an explicit conversion transaction recording source amount/currency, destination amount/currency, rate, rate source and timestamp, fees, and linked ledger entries.
- Use integer minor units or a currency-aware exact decimal representation; never binary floating point for money. Currency precision must be configuration-driven and validated for each currency/provider.

### 2. Separate money by purpose and state

Keep distinct accounting and operational records for:
- customer funds available for eligible use;
- held/reserved funds;
- pending/unconfirmed funds;
- restricted funds;
- company fees/revenue and provider costs;
- refunds and rewards/cashback;
- seller proceeds and settlement obligations for Market Center.

Market Center seller proceeds are **not** automatically spendable iii Wallet balance. Seller settlement must use a provider-supported and legally reviewed flow.

A user may have currency-specific subaccounts, but balances and states must be derived from or reconcilable to immutable ledger entries. Any cached balance is a controlled projection, not the sole source of truth.

### 3. Stored-balance baseline

- Baseline cap: **THB 100,000 equivalent per Wallet account** for stored wallet value.
- Incoming transaction limits are a separate policy dimension and must not be inferred from the stored-balance cap.
- The exact aggregation boundary across currency subaccounts, FX valuation source, rate timestamp, rounding, and treatment of held/restricted/pending funds must be specified in a versioned policy before enforcement.
- A request that would exceed the applicable cap must be rejected or held for an explicitly approved exception; it must not silently over-credit the account.
- No interest-bearing balance feature in the initial version.

### 4. Daily transaction limits

Baseline: **THB 50,000 equivalent per day per transaction category**, with USD/KHR converted using a configured, auditable FX valuation policy.

Apply category-specific controls at minimum to:
- purchases of supported goods/services;
- incoming funds;
- outgoing transfers/withdrawals;
- virtual-card spending;
- mobile top-ups and bill payments when enabled.

The daily cap is a starting product policy, not regulatory authorization. Define the category taxonomy, timezone/day boundary, transaction states counted, multi-account aggregation, FX rate and rate timestamp, and how pending/failed/reversed transactions affect counters. Incoming limits remain independently configurable. Enforce the strictest applicable product, provider, country, account-verification, fraud and regulatory rule.

### 5. Transaction safety and ledger invariants

- Use an immutable double-entry ledger (or an equivalently rigorous accounting model) with balanced postings per currency and explicit transaction states.
- Posted entries are not edited or deleted; corrections use linked reversal/adjustment entries with audit history.
- Every financial write must be idempotent and protected against concurrent overspend/double-spend.
- Reserve/hold funds when the provider flow requires it; release or capture holds based on authoritative transaction events.
- Provider webhooks must be signature-verified, replay-safe, deduplicated by provider event ID, and processed idempotently.
- Reconcile internal records against provider settlement/transaction reports; expose unmatched and stale items for operational review.
- Never trust client-submitted balances, tenant IDs, FX rates, fee amounts, or transaction states.

### 6. Fees and loss-prevention policy

A shared, versioned Transaction Fee & Risk Policy Engine must calculate costs and enforce limits before a transaction is accepted. Policy dimensions include country, currency, product, transaction category, provider, payment method, account verification/risk tier, and effective time.

Account for provider/network fees, FX spread or cost, payout/transfer costs, card costs, refunds, chargebacks, taxes where applicable, and other known direct costs. If required costs or provider capabilities are unknown, fail closed, request confirmation, or route to a reviewed exception; do not assume the transaction is profitable.

A zero-fee or loss-leading promotion requires an approved budget, owner, cap, eligibility rules and expiry. The product priority is to avoid uncontrolled loss rather than maximize margin.

### 7. Refunds and cashback

- Refunds must reference the source transaction and enforce the refundable amount, currency, status, and idempotency rules.
- Present **iii Wallet as the first refund destination option** when supported and allowed; if selected, credit the appropriate wallet subaccount. If not selected or unavailable, refund to the original source where supported by the provider and transaction scheme. If neither path is available, create a visible exception for operations rather than silently rerouting funds.
- Cashback/rewards are separate transactions from refunds, have explicit campaign funding and budgets, and prevent duplicate awards.
- Support full/partial refunds, voids, reversals, failed refunds and refund reconciliation.

### 8. Virtual debit card

Prepare a separate Virtual Card module and provider adapter from the first architecture version, but gate real issuance/usage on:
- an eligible card issuer/program manager/provider and target-country support;
- contracts, compliance approvals and required KYC/AML controls;
- PCI/security boundary review and provider tokenization/hosted card-data controls;
- authorization, clearing, reversal, incremental authorization, FX, chargeback and refund handling;
- card-level and account-level limits and operational support.

Do not generate pretend payment-card credentials or store PAN/CVV in application tables. A virtual card must not block the release of independently approved Wallet Core capabilities.

### 9. Disputes and audit baseline

Create a minimal, extensible dispute model referencing source transactions and evidence. Keep an append-only event history, actor/reviewer, status changes, decision reason, resolution and linked refund/reversal. Opening a dispute must not automatically move funds unless a specific approved policy and authoritative provider process require it.

### 10. Provider-first real-money movement

Use provider adapters so Wallet business logic does not assume one provider. The provider/legal model must be validated per launch country and transaction type before real-money enablement. Provider-held funds, provider-managed settlement and an internal ledger are not interchangeable concepts; document who legally holds funds, who owes the customer, settlement timing and failure handling.

## Required invariants

1. Ledger postings balance per currency.
2. No spendable balance from unconfirmed funds.
3. No double-spend under concurrent requests.
4. Replaying a request/webhook cannot duplicate a financial effect.
5. Every reversal/refund references its original transaction.
6. Fees and FX rates used are persisted with provenance.
7. Wallet funds, merchant settlement proceeds, provider receivables and company revenue remain separate.
8. Limits are checked server-side against authoritative data.
9. Audit events contain no secrets or full sensitive card data.
10. Production money movement stays disabled until the release gates are signed off.

## Open decisions before schema/migrations

- Which legal entity and provider will support each launch country and capability?
- Is the THB 100,000 equivalent cap aggregated across all currency subaccounts of a Wallet account, and which states count toward it?
- Which authoritative FX source/rate timestamp and rounding rules govern limits?
- Exact daily-window timezone, aggregation scope and treatment of pending/reversed transactions.
- Whether transfers mean internal user-to-user only, external bank transfers, or both for each launch market.
- Card issuer/program manager, authorization funding model and supported currencies.
- Refund eligibility constraints imposed by each provider/payment method.
- Required dispute retention, evidence access and review/appeal policy.

## Consequences

- The initial build should start with audited policy/configuration and ledger invariants, not a simple mutable balance column.
- Currency, limit and provider behavior are data/configuration-driven.
- Some features may be present in the architecture but remain disabled by country/provider/approval gates.
