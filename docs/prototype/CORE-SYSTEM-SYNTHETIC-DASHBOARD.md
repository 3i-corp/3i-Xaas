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

## Gate 2 acceptance matrix (current status)

| # | Acceptance criterion | Evidence in this PR | Status |
|---|---|---|---|
| 1 | Versioned, reviewable prototype PR | This PR and the `/prototype` route | EVIDENCED |
| 2 | Agreed service surfaces and key user/operator journeys | Five service surfaces and service/metric selection are present. End-to-end cross-service journeys have not been agreed or demonstrated. | PARTIAL — BLOCKING |
| 3 | Every metric has definition, unit, aggregation window, owner, provenance, freshness, limitations | Definitions, units, monthly window, provenance, freshness and limitations are documented. Owners remain TBD; adoption-index numerator/denominator is undefined. | PARTIAL — BLOCKING |
| 4 | Synthetic values isolated from production credentials/APIs/DB | Hand-authored values only; code has no Supabase/API integration and displays a synthetic-data warning | EVIDENCED BY CODE REVIEW; isolated synthetic-only implementation |
| 5 | Primary workflows, responsive behavior and accessibility basics reviewed | Service and metric controls; responsive Tailwind layouts; selected states use `aria-pressed`, chart has an accessible label, table has caption and scoped headers. No human responsive/keyboard/screen-reader review record yet. The plotted six-month values are also exposed in a screen-reader-only semantic data table. | PARTIAL — REVIEW EVIDENCE REQUIRED |
| 6 | Automated checks/build pass | GitHub Actions [Run #47](https://github.com/joofjang2539-hash/3i-XaaS/actions/runs/40066013273) passed on exact reviewed head `1e6add10276d5148096b28c0cbef8f5b44d5736b`. Follow-up accessibility fixes are in a newer commit and require a new exact-head CI run. | Run #47 PASS on prior head; new-head CI pending |
| 7 | Security/privacy boundaries and known gaps documented | Synthetic-only boundary, no live integrations, non-operational metric limitations, and outstanding data-calibration caveat documented | EVIDENCED |
| 8 | Independent reviewer explicitly accepts all criteria | No independent acceptance record yet | BLOCKED |

### Adoption index proposal — not yet approved
For prototype semantics only, a possible future definition is: monthly distinct eligible active entities completing a named service-specific key action divided by monthly distinct eligible entities for that service, multiplied by 100. The eligible population, key action, exclusions, identity resolution, privacy thresholds, and owner must be agreed separately for each service. This proposal is **not** the calculation used to generate the hand-authored values and must not be represented as an approved KPI.

The matrix intentionally distinguishes code/document evidence from human acceptance. Do not mark Gate 2 accepted until blocking rows have evidence and an independent reviewer records an explicit decision against all eight criteria.

## Prototype workflows and review scope
Currently demonstrated: select one of five service surfaces, switch between Activity and Adoption index, inspect the six monthly synthetic points, and compare the per-service October snapshot. The prototype does not yet demonstrate full end-to-end user/operator journeys across service boundaries. The responsive and accessibility changes are implementation measures, not a substitute for a documented manual review.

## Intended next steps
1. Agree named accountable metric owners and service-specific metric contracts.
2. Agree and implement the adoption-index calculation only after its denominator and key action are approved.
3. Review and record primary cross-service user/operator journeys.
4. Perform and record responsive, keyboard-only, and screen-reader checks on supported viewport sizes.
5. Gather permitted, anonymized aggregate reference data per service and record provenance before calibrating synthetic curves.
6. Validate totals, time windows, missingness, duplicate events, and cross-service comparability.
7. Keep all production data and module activation blocked until the project’s release gates are met.

## Governance
This prototype does not satisfy Baseline Lock by itself and does not authorize production activation.
