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

## Intended next steps
1. Approve a metric contract per service (definition, owner, unit, aggregation, source, freshness and access boundary).
2. Gather permitted, anonymized aggregate reference data per service and record provenance before calibrating synthetic curves.
3. Validate totals, time windows, missingness, duplicate events, and cross-service comparability.
4. Keep all production data and module activation blocked until the project’s release gates are met.

## Governance
This prototype does not satisfy Baseline Lock by itself and does not authorize production activation.
