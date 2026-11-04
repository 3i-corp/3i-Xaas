# Payment & III Wallet V1 — Phased Roadmap

**Status:** Proposed plan; no production implementation authorization  
**Market:** Thailand | **Initial PSP:** Omise PromptPay | **Card:** prepaid virtual only

| Phase | Workstream | Deliverables | Exit criteria |
|---|---|---|---|
| P0 | Product/governance/feasibility | PRD, legal funds-flow map, Omise onboarding checklist, issuer RFI, risk register | Owners named; open decisions tracked |
| P1 | Domain contracts/architecture | Payment interfaces, canonical states, API/events, capability model, ADRs | Independent architecture review |
| P2 | Wallet ledger foundation | THB accounts, balanced immutable ledger, idempotency, holds, limits, audit | Ledger invariants and concurrency tests pass locally |
| P3 | Omise PromptPay sandbox | QR creation, charge retrieval, webhook validation, recovery, expiry/failure | Sandbox scenarios pass; exactly-once credit demonstrated |
| P4 | Reconciliation/operations | Provider matching, settlement/fee records, exception queue, dashboards/runbooks | Reconciliation tests pass; owners assigned |
| P5 | Virtual card issuer discovery/sandbox | Issuer/program selection, network feasibility, tokenized controls, authorization events | Eligible issuer and compliance/security approval |
| P6 | Integrated pilot readiness | Threat model, privacy/PCI boundary review, UAT, load/recovery tests | All release gates signed; pilot/rollback approved |
| P7 | Controlled pilot | Limited rollout, daily reconciliation, incident review, KPI report | Explicit go/no-go; critical risks closed |

## Sequencing rules
- P0–P4 establish wallet funding. P5 discovery can run in parallel after P0, but issuance is gated.
- Payment Core must not depend on Omise-specific response fields outside its adapter.
- Wallet Ledger is authoritative for internal obligations; provider status/settlement is external evidence.
- Payment success, provider settlement and wallet credit are separate facts.
- No automatic PSP failover while the original provider attempt has an unknown status.
- No production SQL, live keys, real-money transactions, card issuance or deployment in this planning branch.

## Initial backlog
1. Map legal funds flow and Omise merchant prerequisites.
2. Confirm PromptPay sandbox/live capability, QR expiry, webhook behavior, refunds and settlement reports.
3. Finalize Payment Intent/Attempt contracts.
4. Specify ledger posting templates for pending, success, reversal and refund.
5. Define webhook inbox, signature verification, deduplication and replay controls.
6. Define reconciliation evidence and exception ownership.
7. Issue RFI to eligible prepaid virtual-card issuers supporting Visa and/or Mastercard in Thailand.
8. Produce threat model and data classification before card-data integration.

Each phase records scope, commit, test environment, limitations, security/compliance review, recovery plan, accountable owner and reviewer. Phase completion is not production release approval.
