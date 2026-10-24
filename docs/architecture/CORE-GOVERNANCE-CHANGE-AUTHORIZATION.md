# 3i-XaaS Core Governance — Policy Amendment & Scope Expansion Authorization

- **Status:** Proposed governance contract; requires review and approval before enforcement changes
- **Date:** 2026-10-24
- **Applies to:** 3i-XaaS Core System, its shared platform controls, and any service or builder requesting changes to those controls
- **Related documents:** `BUILDER-HANDOFF-CORE-SYSTEM.md`, `SECURITY-MIGRATION-ENVIRONMENT-REMEDIATION-PLAN.md`
- **Execution boundary:** This document is policy design only. It does not modify database grants, secrets, repository protections, deployments, or production services.

## 1. Purpose and precedence

This policy establishes how the Core System's foundational rules may be amended, narrowed, expanded, or bypassed. The Core System is intended to be a production-grade shared platform. Earlier settings, inherited grants, legacy service assumptions, builder output, and previous processing behavior do not automatically override the currently approved Core policy.

For resources governed by the Core System, the approved Core policy is authoritative. A legacy or connected service that is affected must adapt its own integration, configuration, or permissions within its own authorized boundary. Do not weaken Core controls solely to preserve a legacy integration.

This policy is itself protected. Changes to this policy, its approval requirements, the authorization implementation, or controls that enforce it are treated as protected changes. A proposed change cannot authorize itself.

## 2. Protected policy scope

The following six principles are protected:

1. **Core Policy precedence:** Core-approved security, identity, authorization, tenancy, data-access, and operational rules govern Core-managed resources.
2. **Service-scoped permissions:** shared resources use explicit, least-privilege, server-enforced grants and service boundaries.
3. **No inherited authority by default:** legacy grants, default privileges, roles, RLS, builder behavior, or prior configuration do not create an exception to Core policy.
4. **Service-owner compatibility:** an affected legacy or connected service must adapt within its own authorized scope; Core security is not weakened merely for compatibility.
5. **Auditable changes:** changes require evidence, tests, impact review, and recovery/rollback planning.
6. **Separate design, approval, and execution:** documentation or PR approval alone does not authorize a production database change or deployment; live execution requires a separate, explicit approval gate.

A change is protected if it edits any of these principles or changes their meaning or enforceability indirectly, including through role/grant changes, RLS, default privileges, functions, CI/CD workflows, environment configuration, secrets handling, APIs, service accounts, tenant resolution, builder instructions, or approval logic.

## 3. Change classification

Every proposed change must be classified before implementation:

- **Class A — Routine implementation:** does not change the six principles, the scope of a permission, the approval path, the trust boundary, or enforcement. Standard PR review and applicable tests are required.
- **Class B — Protected policy or scope change:** changes, expands, narrows, overrides, or indirectly weakens any protected principle or enforcement control. Requires the protected authorization process in Section 4.
- **Class C — Production execution:** applies a migration, changes live grants/policies/secrets/configuration, processes real data, or deploys to a live environment. Requires all applicable Class B approvals plus a separate explicit approval for the specific production action, target, scope, and timing.

If classification is uncertain, treat the change as Class B until reviewed. File names, commit messages, or the author's declared intent do not determine classification; assess the effective behavior and side effects.

## 4. Required authorization for protected changes

For every Class B change, **both** of the following are required:

1. The actor must pass normal identity, repository/environment permission, and role authorization. A correct challenge response does not replace authentication or authorization.
2. At least **one** of the two creator-authorization methods below must be verified and recorded. These are alternatives (OR), not a requirement to pass both:
   - **Method A — Creator authorization for amendment:** verify that the creator/authorized policy owner explicitly approves the specified change to one or more protected principles.
   - **Method B — Additional change confirmation:** verify the configured additional confirmation for the specified protected change.

The configured confirmation values must not be embedded in source code, documentation, SQL, commit messages, browser code, prompts, or logs. Store them only in an approved server-side secret/authorization system, restrict who can read or rotate them, and do not return them to the client. The user-provided values are short and therefore have limited resistance to guessing; before production enforcement, prefer replacing static values with a stronger, high-entropy confirmation mechanism or an authenticated, one-time approval challenge. If static values are temporarily retained, treat them only as a supplemental check, add strict rate limits and alerting, never log submitted values, and provide a rotation procedure.

The system must record the approval event and scope, not the submitted secret/answer. At minimum record: request ID, actor identity, approver identity or verified creator authority, method A or B, affected policy clauses, change summary, target environment, PR/commit reference, timestamp, expiration/revocation status, and resulting decision. Do not store plaintext challenge responses or reusable tokens in the audit record.

An approval applies only to the reviewed scope and version. Any material change to the diff, requested scope, target environment, or implementation invalidates the prior approval and requires re-authorization. Approval cannot be inferred from silence, a green CI run, admin status alone, or an unrelated prior approval.

## 5. Enforcement requirements

The eventual implementation must enforce the policy server-side, not solely in UI, builder prompts, branch naming, or contributor convention.

- Fail closed if actor identity, authority, approval scope, or confirmation validity cannot be established.
- Bind approvals to the exact PR/commit and declared scope; revalidate before merge and before any protected execution.
- Require PR-only changes and prevent direct pushes to the protected default branch where repository controls permit.
- Use protected GitHub environments and required reviewers for production release; a PR merge is not production approval.
- Ensure the author cannot self-approve where separation of duties is required by repository/organization capability. If the project has a single authorized creator and independent review is unavailable, record that limitation and use the strongest available technical safeguards; do not claim independent review occurred.
- Protect the authorization code, workflow, secret references, branch protections, and audit sink against changes made by the same unapproved change.
- Apply rate limits, monitoring, secret redaction, expiration, revocation, and rotation to confirmation flows.
- Emergency handling must not silently bypass the protected authorization rule. Any emergency exception must have explicit authorized approval, minimal scope, expiry, and an auditable follow-up review.

## 6. PR and evidence checklist

A Class B PR must include:

- The protected clauses affected and why the change is needed.
- Before/after behavior and explicit permission/scope delta.
- Threat/impact analysis, including connected and legacy services.
- Tests proving authorized changes can proceed and unauthorized, missing, expired, replayed, wrong-scope, or modified-after-approval requests are rejected.
- Confirmation that challenge values and production secrets are absent from diffs, artifacts, client bundles, and logs.
- Migration/recovery or rollback plan where applicable.
- Evidence that the approval is bound to the reviewed diff and target.
- Clear statement of what has and has not been executed.

A Class C change additionally requires a separate approval identifying the exact production project/environment, operation, timing/window, backup/recovery evidence, pre-checks, post-checks, and abort criteria. Do not infer this approval from approval of a document or PR.

## 7. Acceptance tests for the eventual authorization implementation

At minimum, automated tests must cover:

1. No identity or insufficient role → denied.
2. Valid identity but no creator authorization method → denied.
3. Method A valid for exact protected scope → allowed to continue through PR checks.
4. Method B valid for exact protected scope → allowed to continue through PR checks.
5. Both methods absent/invalid/expired/revoked → denied.
6. Approval for a different PR, commit, clause, environment, or scope → denied.
7. Diff or scope changes after approval → approval invalidated.
8. Replayed, brute-forced, or rate-limit-exceeding confirmations → denied and security event recorded without logging the submitted value.
9. Protected policy/authorization implementation edited without independent valid authorization → denied.
10. PR authorization never silently authorizes live database changes or deployment.
11. A routine Class A change is not unnecessarily blocked, provided it does not alter protected scope or enforcement.
12. Audit records contain sufficient metadata but no plaintext challenge responses or reusable secrets.

## 8. Rollout sequence

1. Review and approve this policy as a document; it is not yet an active technical control.
2. Map GitHub branch rules, review settings, GitHub Environments, Supabase roles, secret storage, and current authorization paths without changing production.
3. Define the creator/policy-owner identity and how it is verified; confirm whether independent review is available.
4. Implement the smallest server-side authorization and audit mechanism in a feature branch using synthetic/local fixtures.
5. Add negative tests and inspect generated bundles, CI artifacts, and logs for secret leakage.
6. Open a PR with actual test results; do not merge automatically.
7. Separately propose any repository-setting changes and any production changes for explicit approval.
8. Verify post-change controls and document limitations before calling the policy enforced.

## 9. Non-goals and safety boundaries

- This policy does not create new permissions by itself.
- It does not authorize live database changes, data deletion, secret rotation, merging, or deployment.
- It does not treat a static confirmation phrase as strong authentication.
- It does not allow a service to inherit broad Core access because it was previously connected.
- It does not remove or modify legacy resources; those require dependency, ownership, retention, and migration review.

Until the authorization mechanism is implemented and verified, this document must be described as a **proposed governance contract**, not as an already enforced production control.
