# Business Application Specification

> Copy this file to `docs/app-specs/<app-id>.md` only when a real app proposal is ready. Mark unknowns explicitly; do not invent business or security requirements.

## 1. Identity and ownership

- **App ID:**
- **Working name:**
- **Business owner:**
- **Technical owner:**
- **Status:** Draft / In review / Accepted / Implementing / Released
- **Target users and countries:**

## 2. Problem and outcomes

- **Problem being solved:**
- **Current workflow and pain points:**
- **Desired outcomes:**
- **Success measures and how they will be measured:**
- **Out of scope:**

## 3. Users, roles, and permissions

List user types and the actions each role may perform. Include who can view, create, edit, approve, export, delete, or administer each resource.

| Role | Resource/action | Allowed? | Conditions |
|---|---|---|---|
| | | | |

Document authentication requirements, account lifecycle, tenant boundaries, delegated access, and server-side authorization.

## 4. User journeys and acceptance criteria

For each primary journey, document the trigger, steps, expected result, errors, and authorization rules.

### Journey 1

- **Actor and goal:**
- **Preconditions:**
- **Main flow:**
- **Alternate/error flows:**
- **Acceptance criteria:**

## 5. Data and privacy

- **Data entities and ownership:**
- **Sensitivity/classification:**
- **Source of truth:**
- **Retention and deletion:**
- **Audit requirements:**
- **Tenant isolation requirements:**
- **RLS/server-side authorization expectations:**
- **Personal data or regulated data involved:**

## 6. API, events, and integrations

- **Required APIs:**
- **External systems/providers:**
- **Authentication and webhook verification:**
- **Contracts and versioning:**
- **Idempotency, retries, timeouts, and rate limits:**
- **Failure and reconciliation behavior:**

## 7. UX and accessibility

- **Routes/screens:**
- **Navigation:**
- **Responsive/device requirements:**
- **Accessibility requirements:**
- **Loading, empty, success, error, and unauthorized states:**
- **Languages/locales and currency/date formatting:**

## 8. Non-functional requirements

- **Performance targets:**
- **Availability/reliability expectations:**
- **Expected scale:**
- **Observability and alerting:**
- **Backup/recovery needs:**
- **Security/threat scenarios:**
- **Compliance/legal/provider dependencies:**

## 9. Architecture and dependencies

- **Standalone app or shared platform capability:**
- **Proposed app boundary:**
- **Shared packages needed and why:**
- **Data/migration impact:**
- **Deployment environments:**
- **Feature flags and rollback strategy:**

## 10. Verification plan

Map each acceptance criterion to a test. Include unit, integration, authorization/RLS, end-to-end, accessibility, performance, and failure/replay tests as applicable.

| Requirement/criterion | Test type | Expected evidence |
|---|---|---|
| | | |

## 11. Delivery plan and release gate

- **Small implementation milestones:**
- **Dependencies and unresolved decisions:**
- **Support/operational owner:**
- **Release and rollback plan:**
- **Explicit approvals required:**
- **Known limitations:**

## 12. Acceptance

- [ ] Business owner accepts scope and success measures.
- [ ] Roles, data ownership, privacy, and tenant boundaries are documented.
- [ ] Integrations and failure behavior are documented.
- [ ] Acceptance criteria are testable.
- [ ] Security and operational risks have owners.
- [ ] Open questions are resolved or explicitly accepted.
