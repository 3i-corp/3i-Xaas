# Payment API & Event Contract — Outline

**Status:** Contract outline; endpoint schemas require implementation review.

## API conventions
- Authenticated server context and account authorization for all commands.
- Money as integer minor units plus ISO currency.
- Idempotency key on every mutating command.
- Client never supplies authoritative owner, provider status, fee, balance or settlement state.
- Expose normalized states, not raw provider payloads.

## Proposed endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /v1/wallet/top-ups | Create THB top-up and PromptPay attempt |
| GET | /v1/wallet/top-ups/{id} | Retrieve state and QR details if valid |
| GET | /v1/wallet/transactions | Wallet transaction history |
| GET | /v1/wallet/balance | Server-derived THB balance |
| POST | /v1/payments/{id}/cancel | Cancel where supported |
| POST | /v1/payments/{id}/refunds | Authorized refund request |
| POST | /v1/providers/{provider}/webhooks | Provider webhook ingress |
| GET/POST | /v1/virtual-cards | List/request card when issuer enabled |
| POST | /v1/virtual-cards/{id}/freeze | Freeze card |
| POST | /v1/virtual-cards/{id}/unfreeze | Unfreeze card |

Card endpoints remain unavailable until issuer/program is selected and enabled.

## Top-up command example
    {
      "amount": 100000,
      "currency": "THB",
      "payment_method": "PROMPTPAY"
    }

Example amount is 100,000 minor units (THB 1,000.00) if configured THB precision is two decimal places. Runtime validation uses currency configuration and provider constraints.

## Domain events
payment.intent.created.v1; payment.attempt.created.v1; payment.requires_action.v1; payment.succeeded.v1; payment.failed.v1; payment.expired.v1; payment.refund.updated.v1; wallet.credit.posted.v1; wallet.credit.exception.v1; provider.event.received.v1; provider.event.rejected.v1; provider.settlement.reconciled.v1; card.authorization.updated.v1; card.transaction.cleared.v1.

Each event includes event ID, schema version, timestamps, aggregate ID, correlation ID, account reference and minimized payload. No sensitive card data.

## Webhook security
Verify signature against exact raw request body and documented canonicalization. Deduplicate by provider/account/event identity. Acknowledge per provider requirements, enqueue durable processing and retrieve authoritative provider resource before financial posting.
