> **3i-XaaS Payment Baseline:** v1.0 — 2026-11-04  
> **Scope approval:** Approved by the project owner for architecture and documentation scope.  
> **Repository disposition:** PR #24; independent review and merge are pending. This document is not yet a LOCKED repository baseline.  
> **Permitted use:** Detailed design and controlled non-production implementation planning. This baseline does not authorize production schema/permission changes, live credentials, real-money processing, card issuance, module activation, or deployment.  
> **Controlling policy:** Existing III Wallet ADR-001, Baseline Lock policy, Phase restrictions, and Release Gates remain in force.

# PSP Capability Matrix — Initial Evaluation

**Purpose:** shortlist for provider abstraction; not provider approval or commercial commitment.

| Dimension | Omise / Opn Payments | 2C2P | Xendit |
|---|---|---|---|
| V1 role | Initial Thailand PromptPay adapter | Future candidate | Future candidate |
| API model | Charges / Sources and webhooks | Payment API / hosted payment page and other modes | Payment Requests and related APIs |
| PromptPay | Confirm exact merchant account and enablement | Confirm Thailand merchant/channel capability | Confirm Thailand merchant/channel capability |
| Card acquiring | Confirm merchant account and method eligibility | Confirm contract/channel availability | Confirm contract/channel availability |
| Refund/void | Confirm method/status constraints | Confirm operation sequence/eligibility | Confirm country/operation constraints |
| Settlement | Confirm reports, schedule, fees, settlement account | Confirm reporting and settlement model | Confirm reporting and settlement model |

## Selection gates
Thailand legal entity and merchant eligibility; supported methods/currencies for actual merchant account; PromptPay QR, expiry, inquiry and notification behavior; refund/void/reversal; settlement currency/timing/fees/reserves; API/sandbox/support SLA; privacy/security/contracts; regulated role and funds-flow responsibilities reviewed by qualified counsel.

Do not infer country support from generic marketing material or another merchant's account. Do not route production transactions until exact account/product/method/country is approved and tested.

## V1 routing disposition

The matrix is an evaluation framework, not evidence that any provider or merchant account is currently enabled. Omise PromptPay is the intended first sandbox integration subject to confirming the exact legal entity, merchant account, product, country, method, currency, webhook and settlement capabilities. 2C2P and Xendit remain disabled future candidates. Routing configuration must fail closed when any required capability or approval is absent.
