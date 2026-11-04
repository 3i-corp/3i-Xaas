> **3i-XaaS Payment Baseline:** v1.0 — 2026-11-04  
> **Scope approval:** Approved by the project owner for architecture and documentation scope.  
> **Repository disposition:** PR #24; independent review and merge are pending. This document is not yet a LOCKED repository baseline.  
> **Permitted use:** Detailed design and controlled non-production implementation planning. This baseline does not authorize production schema/permission changes, live credentials, real-money processing, card issuance, module activation, or deployment.  
> **Controlling policy:** Existing III Wallet ADR-001, Baseline Lock policy, Phase restrictions, and Release Gates remain in force.

# Payment Core & III Wallet V1 — Architecture

## 1. Principles
- Provider-agnostic Payment Core; Omise is first adapter.
- Payment orchestration is separate from wallet accounting.
- Wallet Ledger is immutable and currency-balanced.
- Virtual Card is a separate domain and external issuer integration.
- Provider/country/method capability is explicitly configured and validated.
- No client-side trust for amount, owner, status, fee, balance or provider event.
- Payment success, settlement and wallet credit are distinct.

## 2. Logical topology
    Wallet App / Product Services
              |
       III Wallet API
              |
        Payment Core API
    Intent / Attempt / State Machine
       Idempotency / Policy
              |
       Provider Adapter
        /           \
     Omise       Future PSPs
   PromptPay    2C2P / Xendit
        |
   Verified Event Inbox
        |
   Payment State Update
        |
    Wallet Posting
        |
   III Wallet Ledger

    III Wallet Ledger <--> Card Funding Boundary
                                |
                           iii-card API
                                |
                         Card Issuer Adapter
                                |
                         Visa / Mastercard

## 3. Component ownership
**Payment Core:** owns intents, attempts, provider selection, canonical transitions, idempotency, normalized errors, webhook inbox/outbox, refund/void commands and provider reconciliation references. It does not own wallet balance.

**Provider adapters:** implement shared contracts for create, retrieve, cancel/void, refund, webhook verification/normalization and reconciliation import where supported. Capability declarations include country, currency, method, merchant account, operation and settlement behavior.

**Wallet Ledger:** owns wallet accounts and immutable journal entries. It posts credit only after verified successful-funding event and wallet policy acceptance. Posting is atomic/idempotent and balanced per currency.

**iii-card:** owns card product state, issuer references, authorization/clearing/reversal/dispute events and card controls. Issuer owns card credentials/network processing. Authorization funding uses a separately reviewed reservation/debit contract.

**Reconciliation/Operations:** compares internal payment/ledger records with provider transaction and settlement evidence. Exposes unmatched, mismatched, stale and duplicate cases.

## 4. Repository boundaries
    docs/payment/
    docs/architecture/adr/
    packages/payment-core/
    packages/payment-contracts/
    packages/payment-adapters/omise/
    packages/payment-adapters/2c2p/       # future, disabled
    packages/payment-adapters/xendit/     # future, disabled
    packages/iii-wallet/
    packages/iii-card/

Package directories added with this documentation change are architectural boundaries only, not executable services.

## 5. Data concepts
PaymentIntent; PaymentAttempt; ProviderEvent; WalletAccount; LedgerTransaction/LedgerPosting; Refund; ReconciliationItem; CardAccount/VirtualCard; CardAuthorization. Each has stable internal IDs and links to external references where applicable.

## 6. Security boundaries
Provider secrets stay server-side in approved secret storage. Webhook payloads are minimized/retained under policy. PAN/CVV never enter application logs, analytics or ordinary database tables. Tenant scope derives from authenticated server context. Amounts use integer minor units or exact currency-aware decimals. Schema/migrations are later reviewed deliverables and remain blocked by current gates.

## 7. Deployment
Existing backend/Supabase Edge Function architecture may be evaluated where appropriate. This document does not authorize live Supabase inspection, schema mutation, secret changes or deployment. Runtime placement requires a separate implementation ADR after governance gates permit it.

## 8. Repository layout alignment

The repository is an npm-workspaces monorepo with apps/* and packages/* workspaces. Therefore the approved conceptual domains map to repository paths under packages/, rather than introducing new root-level workspace directories:

```text
packages/
├── payment-core/
│   ├── payment-intents/
│   ├── payment-attempts/
│   ├── payment-webhooks/
│   ├── reconciliation/
│   └── provider-routing/
├── payment-contracts/
├── payment-adapters/
│   ├── omise/              # first adapter; enable after account/capability checks
│   ├── 2c2p/                # future; disabled
│   └── xendit/              # future; disabled
├── iii-wallet/
│   ├── accounts/
│   ├── ledger/
│   ├── topups/
│   └── balances/
└── iii-card/
    ├── card-issuer-adapter/
    ├── virtual-cards/
    ├── authorizations/
    └── card-transactions/
```

These are package/domain boundaries, not a mandate to create empty runtime services. Each package must be added only with an agreed contract, ownership, tests and implementation phase. payment-core never owns wallet balances; iii-wallet owns the ledger; iii-card owns card lifecycle and issuer integration. Cross-domain writes occur only through versioned APIs/events.

## 8. Repository layout alignment

The repository is an npm-workspaces monorepo with apps/* and packages/* workspaces. The approved conceptual domains therefore map under packages/, rather than creating root-level workspace directories:

```text
packages/
├── payment-core/{payment-intents,payment-attempts,payment-webhooks,reconciliation,provider-routing}/
├── payment-contracts/
├── payment-adapters/{omise,2c2p,xendit}/
├── iii-wallet/{accounts,ledger,topups,balances}/
└── iii-card/{card-issuer-adapter,virtual-cards,authorizations,card-transactions}/
```

Omise is the intended first adapter, subject to exact account/capability verification. 2C2P and Xendit remain future and disabled. These are package/domain boundaries, not a mandate to create empty runtime services. Payment Core does not own wallet balances; iii-wallet owns the ledger; iii-card owns card lifecycle and issuer integration. Cross-domain writes occur only through versioned APIs/events.
