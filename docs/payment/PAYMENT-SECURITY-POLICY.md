> **3i-XaaS Payment Baseline:** v1.0 — 2026-11-04  
> **Scope approval:** Approved by the project owner for architecture and documentation scope.  
> **Repository disposition:** PR #24; independent review and merge are pending. This document is not yet a LOCKED repository baseline.  
> **Permitted use:** Detailed design and controlled non-production implementation planning. This baseline does not authorize production schema/permission changes, live credentials, real-money processing, card issuance, module activation, or deployment.  
> **Controlling policy:** Existing III Wallet ADR-001, Baseline Lock policy, Phase restrictions, and Release Gates remain in force.

# Payment & Wallet Security Policy — V1 Baseline

## Trust boundaries
Customer clients are untrusted. Payment Core/adapters execute server-side. Webhooks are untrusted until cryptographically verified and correlated. Wallet Ledger accepts only authenticated internal commands. Issuer owns PAN/CVV and network credentials.

## Mandatory controls
1. Verify provider webhook signatures using documented algorithms and raw request bytes.
2. Enforce replay protection, timestamp tolerance where supported, unique event identity and idempotent processing.
3. Retrieve provider payment resource server-to-server before wallet credit.
4. Validate merchant account, amount, currency, internal reference, method and terminal state.
5. Unique idempotency constraints for intent, attempt, provider event and ledger posting.
6. Protect ledger writes against concurrent duplicates and overspending.
7. Apply authorization, account status, limits, velocity and risk rules server-side.
8. Keep provider secrets in approved secret storage; never commit keys.
9. Do not store PAN/CVV or sensitive authentication data. Use issuer-hosted/tokenized interfaces.
10. Redact secrets, personal data and payment credentials from logs/support exports.
11. Maintain append-only audit records for administrative and financial actions.
12. Least privilege and tenant isolation across APIs, database policies and operational tools.

## PCI/card boundary
Prefer issuer-hosted/tokenized capture, storage and processing. III xAAS stores opaque issuer references, token IDs, card status and permitted masked display attributes only. PCI scope requires assessment by a qualified assessor; this document does not declare PCI compliance.

## Operations
Alert on webhook failures, backlog, stale pending payments, provider errors and reconciliation breaks. Manual adjustments require maker-checker controls. No direct balance editing; corrections use linked approved reversal/adjustment. Define incident response, key rotation, provider outage, backup/restore and recovery objectives before pilot.

## Release gates
Threat model, privacy, legal/compliance, provider onboarding, issuer approval, penetration testing and operational readiness must be evidenced before production activation. Sandbox success is not production authorization.

## Financial control requirements

- Separate maker and checker for manual adjustments, refunds above policy thresholds, route-policy changes, limit overrides and emergency actions.
- Apply tenant/account authorization on every read and write; derive ownership from verified server context.
- Use atomic ledger posting and reservation controls; reject negative/over-limit available balance and concurrent double spend.
- Store minimal provider payload evidence with access controls and retention limits; never expose raw webhook payloads to clients.
- Rotate provider credentials through approved secret-management procedures; access must be environment-scoped and least-privileged.
- Production release requires independent security, finance/ledger, compliance/legal and operations acceptance plus the project's sequential release gates.

## Financial control requirements

- Separate maker and checker for manual adjustments, refunds above policy thresholds, route-policy changes, limit overrides and emergency actions.
- Apply tenant/account authorization on every read and write; derive ownership from verified server context.
- Use atomic ledger posting and reservation controls; reject negative/over-limit available balance and concurrent double spend.
- Store minimal provider payload evidence with access controls and retention limits; never expose raw webhook payloads to clients.
- Rotate provider credentials through approved secret-management procedures; access must be environment-scoped and least-privileged.
- Production release requires independent security, finance/ledger, compliance/legal and operations acceptance plus the project's sequential release gates.
