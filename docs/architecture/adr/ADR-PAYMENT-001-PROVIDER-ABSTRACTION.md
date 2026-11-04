# ADR-PAYMENT-001: Provider-Agnostic Payment Core

- **Status:** Proposed — architecture planning only
- **Date:** 2026-11-04
- **Scope:** 3i-XaaS Payment Core and III Wallet V1
- **Decision owners:** Product, Engineering, Finance, Compliance/Legal, Payment Provider

## Context
III Wallet V1 starts in Thailand with Omise PromptPay. Other providers such as 2C2P or Xendit may be needed later. Coupling wallet rules to one provider increases future change cost.

## Decision
Create a provider-agnostic Payment Core with stable internal contracts and provider-specific adapters. Omise is first. Future adapters are added only after country, capability and merchant-account validation.

Adapter capabilities include create payment, retrieve authoritative payment, cancel/void where supported, refund, verify/normalize webhook and import/reconcile provider evidence where supported. Unsupported operations must be declared, never silently emulated.

Domain layer uses internal IDs, integer minor units/exact currency values, canonical states and normalized errors. Provider raw statuses/payloads remain adapter concerns.

## Consequences
New providers can be added without changing Wallet Ledger behavior. Capability differences must be modeled/tested. Provider routing/failover requires authoritative status resolution. Omise-specific features cannot leak into generic contracts. No live credentials or real-money operation is authorized.
