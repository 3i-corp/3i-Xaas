# 3i-XaaS Software License & Open-Source Compliance Policy
## Pilot Baseline v0.2 — Evidence-aligned draft

**Organization:** Innovative Intellect Insights Corp. (3i Corp)  
**Pilot repository:** 3i-corp/3i-XaaS  
**Status:** DRAFT — for Business Owner, Technical Owner and Legal review  
**Scope:** npm workspaces and dependencies represented by the root package-lock.json on main  
**Evidence snapshot:** main; package-lock.json lockfileVersion 3; root LICENSE identified as GNU GPL-3.0  
**Effective date:** Not effective until approved

> This document is an engineering compliance baseline, not legal advice. It does not grant rights, relicense company code, or establish ownership. The repository's existing GPL-3.0 license is a material open decision and must not be changed without explicit legal/business approval.

## 1. Purpose and principles

Establish a repeatable process to identify, classify, approve and retain evidence for software licenses used by 3i-XaaS. Apply transparency, least-risk selection, evidence-first review, separation of duties, scoped exceptions, and no silent bypass of compliance checks.

A successful build is not evidence of license compliance.

## 2. Pilot scope

This pilot covers:
- Direct and transitive npm packages represented in the root package-lock.json.
- npm workspaces under apps/* and packages/*.
- Dependencies used for production, development, build, test and optional platform targets.
- License and notice files present in the repository.

This snapshot does not yet cover GitHub Actions' third-party actions, container/base images, system packages, downloaded binaries not represented in npm lockfiles, SaaS/API terms, fonts, media, datasets, or separately vendored source. Those require separate inventory work before claiming repository-wide completeness.

## 3. Inventory evidence and baseline

The main-branch lockfile contains 473 node_modules entries:
- 468 third-party package entries have a license field.
- 5 entries are workspace links/local aliases without a third-party license field; these are not automatically missing third-party licenses.
- 13 distinct SPDX license identifiers/expressions were observed among the 468 third-party entries.
- 10 entries identify LGPL-3.0-or-later.
- 3 additional entries use composite expressions containing LGPL-3.0-or-later.
- 13 MPL-2.0 entries are marked dev dependencies in the lockfile.
- 1 CC-BY-4.0 entry is present.
- 5 license-field omissions correspond to local workspace aliases: four internal package links and the apps/web workspace link.

The root LICENSE file is GNU GPL version 3. This means the repository's own licensing posture is not yet aligned/settled merely by classifying third-party dependencies. Confirm whether GPL-3.0 is intentional for all repository source, whether it is legacy content, or whether separate licensing/ownership arrangements exist. Do not infer proprietary ownership or silently replace GPL-3.0.

See docs/architecture/license-inventory-pilot.md for the observed license counts, package names requiring review, and evidence references.

## 4. Classification for this Pilot

### 4.1 Generally acceptable subject to notice preservation
MIT, ISC, BSD-2-Clause, BSD-3-Clause, Apache-2.0, 0BSD, CC0-1.0, Python-2.0, and BlueOak-1.0.0 may be treated as generally acceptable for engineering intake, provided the exact upstream license is verified and required copyright, license, attribution and NOTICE material is retained.

This is an internal intake classification, not a blanket legal approval for every usage or distribution model.

### 4.2 Review required before production distribution or material use
- MPL-2.0: determine whether covered files are modified and what source-disclosure obligations apply.
- LGPL-3.0-or-later: determine the actual platform package selected, linking/deployment model, whether it is distributed or merely used in hosted infrastructure, and applicable relinking/source obligations.
- Any SPDX expression containing LGPL: review the full expression and the exact package/artifact; do not simplify it to Apache or MIT.
- CC-BY-4.0: identify the attributed material/data and retain attribution, license link and change notices as applicable.
- Any new or unrecognized license, custom license, dual-license choice, or package with ambiguous metadata.

### 4.3 Restricted by default pending legal review
GPL-2.0, GPL-3.0, AGPL-3.0, SSPL, Commons Clause, non-commercial/no-redistribution terms, source-available terms, and any license whose restrictions conflict with the intended product/distribution model.

Restricted by default is an internal approval gate, not a statement that the license is unlawful. The existing root GPL-3.0 file is an explicit unresolved project-level decision, not a dependency scan finding.

### 4.4 Unknown or absent third-party license
Unknown third-party license metadata must be REVIEW_REQUIRED or BLOCKED from release until verified from an authoritative upstream source. Never infer permission from the absence of a license.

Local workspace links are handled separately under section 5.

## 5. Internal workspace and project-source licensing

The lockfile's five no-license entries are local workspace aliases, not five unknown external libraries:
- apps/web (workspace link)
- packages/metrics-runtime
- packages/room-runtime
- packages/runtime-core
- packages/websocket-runtime

Their package.json files do not currently declare a license field. Other lockfile workspace records marked extraneous (including digital-twin, event-bus, state-runtime and nested room-state-runtime) also need reconciliation against the current workspace configuration.

Do not automatically add a proprietary license identifier. The company must first establish copyright ownership, contributor/contractor assignment, and the intended public/private distribution terms. After approval, align the root LICENSE, package metadata and repository documentation consistently.

## 6. Required intake evidence

For each direct or transitive third-party package, retain:
- Package name, exact resolved version and source/registry.
- SPDX license identifier or full license expression.
- Direct/transitive and production/development/optional classification.
- Upstream license/NOTICE evidence where metadata is ambiguous.
- Actual use and distribution/deployment model for review-required packages.
- Decision, reviewer, approver, date and exception expiry where applicable.

Preserve package-manager lockfiles. Do not replace a lockfile's license expression with a simplified label.

## 7. CI enforcement design

The License Compliance workflow should be implemented only after the policy file and scanner behavior are tested. It must:
1. Read the committed lockfile and version-controlled policy configuration.
2. Fail closed with CONFIGURATION_ERROR if policy configuration is missing or invalid.
3. Report package, version, license expression and dependency scope.
4. Distinguish PASS, REVIEW_REQUIRED, FAIL and CONFIGURATION_ERROR.
5. Never silently skip checks or convert an unknown license to PASS.
6. Produce an auditable report for each pull request.
7. Test known Allowed, Conditional, Restricted, Unknown and composite-expression fixtures.

Do not add this check to Branch Rulesets as a Required Check until its name, execution, failure behavior and PR reporting have been verified. Ruleset changes require separate governance approval.

## 8. Exception process

Every exception must be limited to a named package, version, repository, use case and time period. Record business reason, technical alternatives, distribution model, risk controls, reviewer, approver, decision date and expiry. The requester cannot be the sole approver. An exception does not amend the upstream license.

## 9. Roles

- Business Owner: approves the policy and business-risk exceptions.
- Technical Owner: owns inventory, tooling and implementation.
- Developer/AI Agent: supplies package and source evidence; cannot approve its own exception.
- Code Reviewer: verifies dependency changes and evidence in PR.
- Legal Advisor: reviews copyleft, attribution, source-disclosure and ownership questions.
- Repository Administrator: configures GitHub controls only after approval.

## 10. Pilot acceptance gates

The pilot is not complete until:
- Root GPL-3.0 intent and company source-licensing posture are resolved in writing.
- LGPL-containing sharp platform packages and MPL development packages are reviewed for actual use/distribution.
- CC-BY-4.0 attribution obligations are recorded.
- Internal workspace licensing/ownership and stale lockfile workspace entries are reconciled.
- A full inventory includes GitHub Actions and any other shipped/vendored artifacts in scope.
- The scanner is tested against all four policy outcomes and composite SPDX expressions.
- A PR demonstrates the check executing and reporting accurately.
- Business Owner and relevant legal/technical reviewers approve the policy.

Until these gates pass, this document remains a draft and must not be used to claim full compliance or authorize a production release.

## 11. Review cycle

Review at least every 90 days during the pilot, and whenever dependencies, distribution model, repository licensing, or product architecture materially changes.

## 12. Approval

Status: DRAFT — not effective  
Business Owner: ____________________  
Technical Owner: ____________________  
Legal Reviewer: ____________________  
Approval date: ____________________  
Effective date: ____________________
