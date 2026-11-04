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
