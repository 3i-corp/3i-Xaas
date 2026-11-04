> **3i-XaaS Payment Baseline:** v1.0 — 2026-11-04  
> **Scope approval:** Approved by the project owner for architecture and documentation scope.  
> **Repository disposition:** PR #24; independent review and merge are pending. This document is not yet a LOCKED repository baseline.  
> **Permitted use:** Detailed design and controlled non-production implementation planning. This baseline does not authorize production schema/permission changes, live credentials, real-money processing, card issuance, module activation, or deployment.  
> **Controlling policy:** Existing III Wallet ADR-001, Baseline Lock policy, Phase restrictions, and Release Gates remain in force.

# Payment Lifecycle & State Machine

## Payment Intent states
- CREATED: intent persisted; no provider confirmation.
- REQUIRES_ACTION: customer action required, e.g. PromptPay QR.
- PENDING: provider processing or awaiting authoritative result.
- SUCCEEDED: provider success confirmed after server-side verification.
- FAILED: provider confirms terminal failure.
- CANCELLED: cancelled before successful completion.
- EXPIRED: intent/QR expired with no confirmed payment.
- REQUIRES_REVIEW: conflicting, late or anomalous evidence requires review.

Refund is a separate aggregate: REQUESTED, PENDING, SUCCEEDED, FAILED, REQUIRES_REVIEW. Settlement is separate: UNKNOWN, PENDING, SETTLED, PARTIALLY_SETTLED, EXCEPTION.

## High-level transitions
    CREATED -> REQUIRES_ACTION -> PENDING -> SUCCEEDED
                                      |       |
                                      |       +--> Refund aggregate
                                      +--> FAILED
                                      +--> EXPIRED
                                      +--> REQUIRES_REVIEW
    CREATED / REQUIRES_ACTION -> CANCELLED
    Conflicting or late evidence -> REQUIRES_REVIEW

Transitions are server-validated. Terminal states are not overwritten by weaker evidence. Corrections use linked reversal/adjustment records.

## PromptPay flow
1. Create internal intent before provider call.
2. Persist provider attempt and correlation/idempotency data.
3. Return QR payload and provider expiry.
4. Accept provider notification through verified webhook inbox.
5. Verify signature per provider documentation.
6. Retrieve provider resource server-to-server and validate amount, currency, merchant account, reference and terminal status.
7. Transition to SUCCEEDED only when authoritative resource supports it.
8. Post wallet credit through idempotent ledger command.
9. If notification is absent, use bounded inquiry/reconciliation; never infer success from client redirect.
10. Late success after expiry enters controlled exception/refund/review path.

## Wallet posting
Payment SUCCEEDED does not imply wallet credit complete. Posting states: NOT_ELIGIBLE, PENDING, POSTED, FAILED_RETRYABLE, REQUIRES_REVIEW. Stable idempotency key ties posting to successful intent.

## Card lifecycle
Card authorization is separate: RECEIVED, APPROVED, DECLINED, REVERSED, CLEARED, EXPIRED, REQUIRES_REVIEW. Exact hold/capture semantics depend on selected issuer and must be defined in its adapter contract.

Provider events may duplicate, delay or arrive out of order. Persist event identity and outcome; conflicts create operational exceptions.

## Transition invariants

- Every transition records actor/source, occurred-at, recorded-at, correlation ID, evidence reference and prior/new state.
- A provider event cannot move a terminal state backwards. Contradictory evidence creates REQUIRES_REVIEW and a linked exception.
- Refund and settlement are separate aggregates; refund success does not rewrite the original payment success.
- Wallet Posting is a distinct idempotent financial action. A successful payment with failed/pending posting must be visible to operations and retried safely.
- Manual state correction requires maker-checker approval and an immutable audit entry; no direct database state edits.
