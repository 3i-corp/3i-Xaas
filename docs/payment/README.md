# Payment & III Wallet V1

**Baseline index:** [PAYMENT-BASELINE-INDEX.md](PAYMENT-BASELINE-INDEX.md) — 12-document Baseline v1.0 inventory and lock checklist.

**Status:** Draft for independent review  
**Market:** Thailand | **Initial PSP:** Omise | **Funding:** PromptPay QR  
**Card:** Prepaid virtual only; Visa or Mastercard subject to issuer approval  
**Wallet movement:** Incoming top-up only; no withdrawal/payout

## Scope baseline
V1 is a Thailand-first III Wallet release. Customers fund a THB wallet through PromptPay using Omise. A separate Virtual Card module is planned with a prepaid funding model. Network and issuer are selected only after country, commercial, program, compliance and technical validation. No physical card production or delivery in V1.

Payment Core is provider-agnostic. Omise is the first adapter, not a hard-coded dependency. 2C2P, Xendit and future providers may be added through the same contracts after validation.

## Documents

The 12 baseline documents are enumerated in PAYMENT-BASELINE-INDEX.md. ADR-PAYMENT-004 is a supplementary product-scope record and is not counted in the 12.
- PRD: PAYMENT-MODULE-PRD.md
- Roadmap: PAYMENT-ROADMAP.md
- Architecture: PAYMENT-ARCHITECTURE.md
- Lifecycle: PAYMENT-STATE-MACHINE.md
- API/event outline: PAYMENT-API-SPECIFICATION.md
- Security: PAYMENT-SECURITY-POLICY.md
- Reconciliation: PAYMENT-RECONCILIATION.md
- Provider matrix: PSP-COMPARISON-MATRIX.md
- Test plan: PAYMENT-TEST-PLAN.md
- ADRs: ../architecture/adr/ADR-PAYMENT-001-PROVIDER-ABSTRACTION.md through ADR-PAYMENT-004-III-WALLET-V1-THAILAND.md

## Explicit exclusions
No live processing, live keys, production schema/migrations or deployment. No withdrawals, payouts, P2P transfers or seller settlement. No physical cards. Omise PromptPay does not imply card issuing. PAN/CVV must not be stored in III xAAS.

These are proposed artifacts and do not supersede the project baseline or release gates. Production money movement remains disabled until independent governance, provider, compliance, security and release approvals.
