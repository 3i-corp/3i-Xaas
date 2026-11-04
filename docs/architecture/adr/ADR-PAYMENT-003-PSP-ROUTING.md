# ADR-PAYMENT-003: Provider Capability and Routing Policy

- **Status:** Proposed — architecture planning only
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
