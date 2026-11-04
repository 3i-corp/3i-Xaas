# ADR-PAYMENT-002: Payment Lifecycle and Wallet Credit Boundary

- **Status:** Proposed — architecture planning only
- **Date:** 2026-11-04
- **Scope:** Payment Core, III Wallet Ledger and provider event processing

## Context
Provider confirmation, provider settlement and internal wallet credit are different financial facts. Webhooks can be duplicated, delayed, reordered or forged.

## Decision
Maintain separate aggregates/states for Payment Intent, Payment Attempt, Refund, Settlement and Wallet Posting. Wallet credit is permitted only after verified/correlated provider evidence and server-side retrieval of the authoritative provider resource, followed by wallet policy checks.

All transitions are server-validated. Webhook processing is durable, deduplicated and idempotent. Ledger postings are immutable, balanced and idempotent. Corrections use linked reversals/adjustments.

Unknown/conflicting/late evidence is routed to review. Client redirects and QR display are never proof of payment.

## Consequences
A Payment Intent may be SUCCEEDED while Wallet Posting remains pending/review. Settlement may occur later than payment success and wallet credit. Operations reconcile each layer independently. Exactly-once financial effect uses durable idempotency and transaction constraints, not assumptions about webhook delivery.
