> **3i-XaaS Payment Baseline:** v1.0 — 2026-11-04  
> **Scope approval:** Approved by the project owner for architecture and documentation scope.  
> **Repository disposition:** PR #24; independent review and merge are pending. This document is not yet a LOCKED repository baseline.  
> **Permitted use:** Detailed design and controlled non-production implementation planning. This baseline does not authorize production schema/permission changes, live credentials, real-money processing, card issuance, module activation, or deployment.  
> **Controlling policy:** Existing III Wallet ADR-001, Baseline Lock policy, Phase restrictions, and Release Gates remain in force.

# ADR-PAYMENT-004: III Wallet V1 — Thailand, PromptPay Funding and Prepaid Virtual Card

- **Status:** Supplementary scope ADR — project-owner scope approved; independent review pending (not counted among the 12 baseline documents)
- **Date:** 2026-11-04
- **Scope:** III Wallet V1, Payment Core and iii-card

## Context
Existing ADR-001 establishes multi-currency-capable ledger principles and requires provider-first real-money movement, immutable balanced accounting, idempotency, reconciliation, distinct money states and gated virtual-card issuance. This ADR narrows the first product release to a Thailand-first THB funding path while preserving extensibility.

## Decisions
1. **Market/currency:** Thailand-first; V1 wallet funding and balance are THB. Currency-aware ledger design remains.
2. **Funding:** PromptPay QR through Omise adapter, subject to merchant onboarding and capability verification.
3. **Money movement:** Incoming top-up only. Withdrawals, bank payouts, P2P and seller settlements are out of V1.
4. **Ledger:** Follow immutable balanced ledger principles. Pending/unconfirmed funds are not spendable. Confirmed top-up produces one idempotent credit.
5. **Card model:** Prepaid virtual card. Spending is backed by eligible prefunded value and issuer-approved authorization/hold model.
6. **Network preference:** Visa or Mastercard. Final network depends on eligible issuer/program, country support, contracts, economics and compliance/security approval.
7. **Physical card:** No plastic manufacture, personalization, shipping or physical-card support in V1.
8. **Issuer separation:** Virtual Card is separate iii-card domain and adapter. Omise PromptPay does not imply Omise card issuing.
9. **Sensitive data:** PAN/CVV and sensitive authentication data are not stored in III xAAS. Use issuer-hosted/tokenized controls and formal PCI scope assessment.
10. **Future PSPs:** Payment Core remains provider-agnostic. 2C2P/Xendit are future candidates, not approved/enabled routes.

## Constraints inherited from ADR-001
Initial platform currencies remain THB, USD and KHR at architecture baseline; V1 product scope is THB only. Stored-balance and daily category limits in ADR-001 remain policy baselines and must be precisely configured/approved before enforcement. Provider-held funds, settlement obligations and internal wallet liabilities are distinct. Real-money movement remains disabled until release gates are signed.

## Consequences
Focused Thailand PromptPay path can be delivered without discarding multi-currency ledger design. Card issuance is separately gated and may lag wallet funding. Eligible issuer/program must be selected before card sandbox integration. Legal funds flow, licensing, safeguarding, KYC/AML, consumer disclosures, fees and settlement require qualified review. This ADR authorizes no production schema changes, live keys, real-money transactions, card issuance or public launch.

## Open decisions
Contracting entity and funds flow; Omise account/PromptPay enablement/settlement/fees/refunds/support SLA; card issuer/program/network; wallet-to-card funding and issuer settlement; KYC/AML tiers, limits, dispute handling, card fees, supported currencies and cross-border policy; pilot cohort, operational coverage and release thresholds.
