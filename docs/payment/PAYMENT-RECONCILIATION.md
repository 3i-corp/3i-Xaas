# Payment & Wallet Reconciliation Model

## Layers
1. Payment: internal Intent/Attempt against provider payment resource.
2. Wallet: eligible successful payment against exactly one wallet credit.
3. Settlement: provider transactions, fees, refunds and settlement batches against bank evidence where available.
4. Card: issuer authorization, clearing, reversal, refund and settlement against card holds and ledger postings.

## Matching keys
Use internal intent/attempt IDs, provider account/merchant ID, provider resource/event IDs, amount, currency, transaction date and settlement batch/reference. Do not match solely by amount/time.

## Exceptions
- Provider success without wallet credit.
- Wallet credit without confirmed provider success (critical).
- Amount/currency/reference mismatch.
- Duplicate event or financial posting.
- Pending beyond configured threshold.
- Late success after QR/intent expiry.
- Provider transaction missing internally or internal transaction missing from provider report.
- Fee/settlement mismatch.
- Refund/void status mismatch.
- Card authorization/clearing/reversal mismatch.

## Rules and cadence
Reconciliation is repeatable/idempotent. Never silently edit posted ledger entries. Corrections require linked reversal/adjustment and approval. Unknown status remains pending/review. Every exception has owner, severity, age, evidence, resolution and audit trail. Define provider-specific schedule after reviewing reporting capabilities; daily reconciliation at minimum before pilot.
