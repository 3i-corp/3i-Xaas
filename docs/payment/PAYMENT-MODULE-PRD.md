# PRD — Payment Module & III Wallet V1

- **Status:** Draft — review required
- **Version:** 0.1
- **Market:** Thailand
- **Wallet currency:** THB for V1
- **Funding provider/method:** Omise PromptPay QR, subject to merchant onboarding and capability confirmation
- **Card:** Prepaid virtual; Visa or Mastercard subject to eligible issuer/program
- **Wallet movement:** Incoming top-up only

## 1. Objective
Deliver a controlled first release of III Wallet for Thailand. A customer initiates a THB top-up, pays through PromptPay QR, and receives wallet credit only after authoritative provider confirmation. Establish provider-independent payment contracts and a separate virtual-card boundary.

## 2. Actors
- Wallet customer: initiates top-up, views balance/history and manages eligible card controls.
- Payment Core: creates intents/attempts, coordinates providers and exposes normalized states.
- Omise adapter: translates internal commands and normalizes Omise responses/events.
- Wallet Ledger: records immutable balanced postings and derives spendable balance.
- Card Issuer/Program Manager: external provider for issuance, authorization and card lifecycle; not assumed to be Omise.
- Operations/Compliance: monitors exceptions, reconciliation, controls and disputes.

## 3. Functional requirements

### 3.1 PromptPay funding
1. Authenticated customer requests a THB top-up within configurable policy limits.
2. Backend creates a unique Payment Intent and idempotency key.
3. Backend requests PromptPay QR through the Omise adapter.
4. Customer sees QR, amount, expiry and normalized status.
5. Provider notifications are verified, deduplicated and processed idempotently.
6. Backend independently retrieves/validates the provider resource before success.
7. Wallet credit is posted once only after authoritative confirmation and policy checks.
8. Expired, failed, cancelled, duplicate, late and mismatched events are safely handled.
9. Customer can view top-up history and pending/success/failure status.

### 3.2 Wallet
- THB wallet with available, pending, held/reserved and restricted states where applicable.
- Immutable double-entry ledger or equivalently rigorous balanced accounting.
- Balance derived from ledger or a controlled, reconcilable projection.
- No withdrawals, external payouts, P2P transfers or seller settlement in V1.
- No interest-bearing balance in V1.
- Existing stored-value and daily category limit baselines in ADR-001 remain subject to separately approved, versioned policy. This PRD does not reinterpret or waive them.

### 3.3 Prepaid Virtual Card
- Separate iii-card module and issuer adapter.
- Virtual only; no plastic manufacture, personalization, shipping or physical-card operations.
- Spending backed by eligible prefunded value and issuer-approved authorization/hold mechanics.
- Desired network: Visa or Mastercard; final selection depends on issuer/program, country coverage, contracts and compliance approval.
- Lifecycle: request/issue, activate if required, freeze/unfreeze, replace/terminate, status inquiry.
- Authorization, clearing, reversal, refund and dispute events represented and reconciled.
- No PAN/CVV in application tables, logs, analytics or support tools. Use issuer-hosted/tokenized display and controls.
- Issuer availability, funding mechanics, verification, fees, limits and supported currencies are discovery gates.

## 4. Non-functional requirements
Server-side authorization; idempotent payment/ledger writes; concurrency-safe balance reservation/debit; append-only audit history; webhook signature verification/replay protection/deduplication; provider-independent versioned contracts; observability; server-side secret management; no binary floating point for money; explicit currency/provider capability configuration.

## 5. Out of scope
Withdrawals, payouts, P2P, third-party merchant acquiring, seller settlements, multi-currency wallet spend, FX, physical cards, cash advances, credit/overdraft, rewards/cashback, bill pay and mobile top-ups.

## 6. Success criteria
- PromptPay sandbox top-up succeeds end-to-end and credits exactly once.
- Duplicate/replayed webhooks and client retries cannot duplicate credit.
- Invalid signature, amount/currency mismatch, stale event and provider timeout do not create spendable balance.
- Ledger postings balance and reconcile to payment intent/attempt.
- Expiry, failure, refund/void and operational exception scenarios pass.
- Card issuer feasibility documented; issuance disabled until issuer and compliance gates pass.
- Operations identify unmatched, stale and failed provider transactions.
- Independent security, product, finance and compliance reviews recorded before pilot.

## 7. Open decisions
Confirm contracting/legal entity and who legally holds funds; Omise merchant account, PromptPay enablement, settlement account, fees, refund behavior and support SLA; issuer/program/network; KYC/AML, safeguarding, payment-services, consumer disclosure, privacy and PCI obligations with qualified specialists; top-up limits, fees, QR expiry and support SLAs.

## 8. Release boundary
Implementation begins in local/test and provider sandbox only. Production money movement, live card issuance and customer launch remain disabled until governance and release gates are independently approved.
