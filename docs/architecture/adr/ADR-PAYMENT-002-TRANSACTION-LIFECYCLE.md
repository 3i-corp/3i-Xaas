> **3i-XaaS Payment Baseline:** v1.0 — 2026-11-04  
> **Scope approval:** Approved by the project owner for architecture and documentation scope.  
> **Repository disposition:** PR #24; independent review and merge are pending. This document is not yet a LOCKED repository baseline.  
> **Permitted use:** Detailed design and controlled non-production implementation planning. This baseline does not authorize production schema/permission changes, live credentials, real-money processing, card issuance, module activation, or deployment.  
> **Controlling policy:** Existing III Wallet ADR-001, Baseline Lock policy, Phase restrictions, and Release Gates remain in force.

# ADR-PAYMENT-002: Payment Lifecycle and Wallet Credit Boundary

- **Status:** Baseline v1.0 — project-owner scope approved; independent review pending
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

## Required implementation invariants

Persist intent before external side effects; persist each attempt independently; use durable idempotency keys; process verified events through a durable inbox; retrieve authoritative provider state; separate payment success from settlement and wallet posting; use immutable balanced ledger postings; route unknown/contradictory evidence to review; and preserve linked reversals rather than mutating posted history.
