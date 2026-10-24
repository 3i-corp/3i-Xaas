# Core System Product Prototype — Synthetic Data

## Purpose
A read-only dashboard prototype to review cross-service information architecture before any real module or Production data is enabled.

## Route
Open `/prototype` in the Next.js web app.

## Data status and limitations
- All values are hand-authored synthetic scenario values for May–October.
- The prototype does not call Supabase, APIs, payment systems, or customer records.
- Growth patterns are illustrative assumptions, not verified forecasts or measurements from real services.
- Activity units differ by service and must not be summed as if they represented a common business metric.
- Reliability percentages are illustrative and are not SLO evidence.
- No real users, financial values, wallet balances, or identifiable records are included.

## Synthetic metric contracts (prototype-only; not approved for operational reporting)

All contracts below describe hand-authored scenario values, not observed service telemetry. Values cover monthly buckets from May through October; no actual dataset is connected. The service owner is recorded as a role to be assigned, not as a confirmed named accountable owner.

| Metric / service | Definition | Unit | Aggregation window | Owner | Source / provenance | Freshness | Limitations |
|---|---|---|---|---|---|---|---|
| Activity — Commerce | Count of illustrative catalog/order scenario events | Synthetic Commerce events | Calendar month | Commerce product/engineering owner — TBD | Hand-authored in-code scenario assumptions | Static prototype values; no refresh pipeline | Not actual orders or traffic; not comparable with other services |
| Activity — III Wallet | Count of illustrative wallet-journey scenario events | Synthetic Wallet journey events | Calendar month | Wallet product/ledger owner — TBD | Hand-authored in-code scenario assumptions | Static prototype values; no refresh pipeline | Not transactions, balances, or money movement; not production evidence |
| Activity — Identity | Count of illustrative account/access scenario events | Synthetic Identity events | Calendar month | Identity product/engineering owner — TBD | Hand-authored in-code scenario assumptions | Static prototype values; no refresh pipeline | Not actual users, logins, or access events |
| Activity — API Platform | Count of illustrative API-request scenario events | Synthetic API request events | Calendar month | API Platform owner — TBD | Hand-authored in-code scenario assumptions | Static prototype values; no refresh pipeline | Not actual request telemetry; not comparable with other services |
| Activity — Billing | Count of illustrative invoice/cycle scenario events | Synthetic Billing events | Calendar month | Billing product/engineering owner — TBD | Hand-authored in-code scenario assumptions | Static prototype values; no refresh pipeline | Not invoices, charges, or financial records |
| Adoption index — each service | Illustrative proportion/index used to demonstrate a trend view; numerator and denominator are not yet specified | Scenario percentage (0–100) | Calendar month | Respective service owner — TBD | Hand-authored in-code scenario assumptions | Static prototype values; no refresh pipeline | No agreed calculation or denominator; not a real adoption KPI |
| Reliability — each service | Illustrative monthly reliability indicator shown in the service snapshot | Scenario percentage | Calendar month | Respective service/SRE owner — TBD | Hand-authored in-code scenario assumptions | Static prototype values; no monitoring source | Not calculated from uptime/error events and not SLO evidence |

The contracts make missing accountability and definitions visible; the TBD owner assignments, adoption-index calculation, and operational metric sources must be agreed before Gate 2 can pass.

## Prototype workflows and review scope

Currently demonstrated: select one of five service surfaces, switch between Activity and Adoption index, inspect the six monthly synthetic points, and compare the per-service October snapshot. The prototype does not yet demonstrate full end-to-end user/operator journeys across service boundaries, and no reviewer record confirming responsive behavior, keyboard/accessibility checks, or explicit acceptance against all eight Gate 2 criteria is present.

## Intended next steps
1. Approve a metric contract per service (definition, owner, unit, aggregation, source, freshness and access boundary).
2. Gather permitted, anonymized aggregate reference data per service and record provenance before calibrating synthetic curves.
3. Validate totals, time windows, missingness, duplicate events, and cross-service comparability.
4. Keep all production data and module activation blocked until the project’s release gates are met.

## Governance
This prototype does not satisfy Baseline Lock by itself and does not authorize production activation.
