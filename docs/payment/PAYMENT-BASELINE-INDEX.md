# Payment / III Wallet / III Card — Baseline Index v1.0

- **Baseline version:** 1.0
- **Date:** 2026-11-04
- **Scope approval:** Project owner approved the documentation and architecture scope.
- **Repository state:** PR #24 is open as Draft. Independent review, CI validation on the final head, and merge are pending. This is an approved scope baseline, not yet a LOCKED repository baseline.
- **Implementation boundary:** After independent review and repository baseline lock, implementation proceeds in the sequence in PAYMENT-ROADMAP.md, beginning with non-production contracts and ledger foundations.
- **Production boundary:** No production schema/permission change, live credential, real-money processing, live card issuance, module activation, or deployment is authorized by this document.

## The 12 baseline documents

### Payment specifications (9)

1. [Payment Module PRD](PAYMENT-MODULE-PRD.md) — product scope, actors, requirements, non-goals and release criteria.
2. [Payment Roadmap](PAYMENT-ROADMAP.md) — phased delivery, dependencies and exit criteria.
3. [Payment Architecture](PAYMENT-ARCHITECTURE.md) — domain ownership, integration topology and repository mapping.
4. [Payment State Machine](PAYMENT-STATE-MACHINE.md) — intent, attempt, refund, settlement and wallet-posting states.
5. [Payment API Specification](PAYMENT-API-SPECIFICATION.md) — API conventions, endpoint direction and event contracts.
6. [Payment Security Policy](PAYMENT-SECURITY-POLICY.md) — trust boundaries, financial controls and card-data protection.
7. [Payment Reconciliation](PAYMENT-RECONCILIATION.md) — payment, wallet, settlement and card reconciliation.
8. [PSP Comparison Matrix](PSP-COMPARISON-MATRIX.md) — capability evaluation and routing gates.
9. [Payment Test Plan](PAYMENT-TEST-PLAN.md) — functional, financial-invariant, security and recovery tests.

### Architecture decision records (3)

10. [ADR-PAYMENT-001 Provider Abstraction](../architecture/adr/ADR-PAYMENT-001-PROVIDER-ABSTRACTION.md).
11. [ADR-PAYMENT-002 Transaction Lifecycle](../architecture/adr/ADR-PAYMENT-002-TRANSACTION-LIFECYCLE.md).
12. [ADR-PAYMENT-003 PSP Routing](../architecture/adr/ADR-PAYMENT-003-PSP-ROUTING.md).

## Supplementary scope record

[ADR-PAYMENT-004 III Wallet V1 Thailand](../architecture/adr/ADR-PAYMENT-004-III-WALLET-V1-THAILAND.md) records the Thailand-first THB PromptPay and prepaid virtual-card product boundary. It is supplementary and is not counted among the 12 baseline documents.

## Existing III Wallet baseline remains controlling

This baseline extends, and does not replace, [ADR-001 iii Wallet Multi-Currency Ledger and Transaction Controls](../architecture/adr/ADR-001-iii-wallet-multi-currency-ledger.md) and the [iii Wallet Core Readiness Audit](../architecture/iii-wallet-core-readiness-audit.md).

- Platform ledger architecture remains currency-aware for THB, USD and KHR.
- Thailand V1 funding and spendable wallet product scope is THB only.
- Existing stored-balance and daily transaction limit baselines remain in force; detailed aggregation/FX/time-window rules must be versioned before enforcement.
- Wallet Ledger is authoritative for internal wallet obligations. Payment success, provider settlement and wallet credit are distinct facts.
- No production readiness, regulatory permission, provider eligibility or card-issuer capability is inferred.

## Repository mapping

The current root package.json defines npm workspaces as apps/* and packages/*. Therefore domain packages belong under packages/:

- packages/payment-core/
- packages/payment-contracts/
- packages/payment-adapters/omise/ (first adapter candidate; exact account capability remains to be verified)
- packages/payment-adapters/2c2p/ and packages/payment-adapters/xendit/ (future, disabled)
- packages/iii-wallet/
- packages/iii-card/

This is a logical boundary map. It does not authorize empty scaffolds, executable services, database migrations or deployment.

## Baseline lock checklist

- [ ] All 12 documents reviewed together for consistency.
- [ ] Existing III Wallet ADR-001 and readiness audit conflicts resolved or explicitly preserved as constraints.
- [ ] Product, Engineering, Finance, Security and Compliance/Legal review recorded.
- [ ] CI and Markdown/link checks pass on the exact PR head.
- [ ] Required independent GitHub approval on the exact current head is recorded.
- [ ] Residual risks, open decisions and implementation phase entry criteria are recorded.
- [ ] PR is merged under repository governance before this becomes a LOCKED repository baseline.
