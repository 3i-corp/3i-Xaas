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
