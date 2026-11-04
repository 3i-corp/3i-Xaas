> **3i-XaaS Payment Baseline:** v1.0 — 2026-11-04  
> **Scope approval:** Approved by the project owner for architecture and documentation scope.  
> **Repository disposition:** PR #24; independent review and merge are pending. This document is not yet a LOCKED repository baseline.  
> **Permitted use:** Detailed design and controlled non-production implementation planning. This baseline does not authorize production schema/permission changes, live credentials, real-money processing, card issuance, module activation, or deployment.  
> **Controlling policy:** Existing III Wallet ADR-001, Baseline Lock policy, Phase restrictions, and Release Gates remain in force.

# ADR-PAYMENT-003: Provider Capability and Routing Policy

- **Status:** Baseline v1.0 — project-owner scope approved; independent review pending
- **Date:** 2026-11-04
- **Scope:** Payment Core provider selection and future multi-PSP expansion

## Context
Capability varies by country, legal entity, merchant account, currency, method, operation and contract. A generic provider name does not prove a specific merchant account can process a transaction.

## Decision
Represent eligibility as explicit, versioned capability configuration. A route is eligible only when launch country, legal entity, merchant account, currency, method, operation, risk policy and operational status are approved.

V1 uses the approved Omise Thailand PromptPay route only. 2C2P and Xendit remain future candidates until separately validated.

Do not automatically fail over an uncertain/timed-out payment until the original provider attempt is resolved. Routing policy changes are audited and reviewed.

## Consequences
Provider selection is configuration-driven and explainable. Failover may be unavailable during ambiguous outages; safety takes precedence over duplicate-payment risk. This ADR approves no provider, merchant account or country capability.

## Routing guardrails

V1 permits only a separately verified Omise Thailand PromptPay sandbox route. Production eligibility remains disabled until merchant onboarding, legal/compliance, security and release gates are complete. 2C2P and Xendit are future candidates only. Routing changes require versioned configuration, audit history, test coverage and independent review.
