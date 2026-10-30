# 3i-XaaS Software License & Open-Source Compliance Policy
## Pilot Baseline v0.3 — GPL-3.0 confirmed

**Organization:** Innovative Intellect Insights Corp. (3i Corp)  
**Pilot repository:** 3i-corp/3i-XaaS  
**Status:** DRAFT — for Business Owner, Technical Owner and Legal review  
**Project license intent:** GPL-3.0 is intentional for 3i-XaaS source code, as confirmed by the Business Owner on 2026-10-30.  
**Scope:** npm workspaces and dependencies represented by the root package-lock.json on main  
**Effective date:** Not effective until formal approval

> This is an engineering policy draft, not legal advice. The confirmation establishes project intent; it does not independently establish copyright ownership, contributor assignments, or compliance for every dependency and distribution scenario.

## 1. Purpose and principles

Identify, classify, approve and retain evidence for licenses used by 3i-XaaS. Apply transparency, evidence-first review, separation of duties, scoped exceptions and no silent bypass of compliance checks.

A successful build is not evidence of license compliance. GPL-3.0 is the intended license for the project's own source code and must not be classified as prohibited for the project itself.

## 2. Business and licensing model

3i-XaaS intentionally uses GPL-3.0 for its project source. GPL-3.0 does not prohibit commercial activity: the company may charge for copies, support, customization and services. When conveying covered copies or modified/combined works, the company must meet the applicable GPL-3.0 conditions, including license notices, recipients' rights and Corresponding Source obligations for object-code distribution.

Mere remote interaction with a program over a network, without transfer of a copy, is not by itself conveying under GPL-3.0. This differs from AGPL-3.0, which has a network-interaction source-offer provision. The actual delivery model, software boundaries and combined-work analysis still matter.

Business models requiring specific review:
- SaaS/hosted service: verify whether users receive copies or only interact remotely; review downloadable clients, agents, SDKs and on-premise components separately.
- On-premise/self-hosted distribution: establish a process to provide exact Corresponding Source, license texts and required notices for each released version.
- Customization and integrations: assess whether the code forms one combined/derivative work or separate independent works; repository or process separation alone does not decide this.
- Marketplace and third-party extensions: define technical and licensing boundaries; do not promise proprietary licensing for code that is part of a GPL-covered combined work without a valid separate permission/right.
- Enterprise contracts: commercial terms, support and warranties must not take away recipients' GPL rights.

Do not use this policy to infer that all company products, unrelated services, customer data, trademarks, hosted operations or independent programs are automatically GPL-licensed. Scope must be assessed work by work.

## 3. Pilot scope and limitations

This pilot covers:
- Direct and transitive npm packages represented in the root package-lock.json.
- npm workspaces under apps/* and packages/*.
- Production, development, build, test and optional platform dependencies.
- Root project LICENSE and repository license/notice files.

Not yet covered: GitHub Actions third-party actions, containers/base images, system packages, downloaded binaries outside npm lockfiles, SaaS/API terms, fonts, media, datasets, vendored code, generated assets and all upstream license texts. Do not claim repository-wide compliance until these are inventoried.

## 4. Inventory evidence

The inspected main-branch lockfile has 473 node_modules entries:
- 468 third-party package entries with a license field.
- 5 local workspace links/aliases without a third-party license field.
- 14 distinct license identifiers/expressions in the observed list (corrected from the prior draft's count of 13).
- 10 entries identify LGPL-3.0-or-later.
- 4 additional entries use composite expressions containing LGPL-3.0-or-later.
- 13 MPL-2.0 entries are marked dev dependencies.
- 1 CC-BY-4.0 entry.

Counts are lockfile entries, not unique upstream projects; optional platform variants are counted separately. See docs/architecture/license-inventory-pilot.md.

## 5. Classification for this GPL-3.0 project

### 5.1 Project source — GPL-3.0
GPL-3.0 is the intentional project license, not a prohibited dependency category. Maintain the root LICENSE and clear notices identifying which project files/work are covered. Confirm company copyright ownership and contributor/contractor rights. Do not change the root license without explicit Business Owner and legal approval.

### 5.2 Generally acceptable intake, subject to exact terms and notices
MIT, ISC, BSD-2-Clause, BSD-3-Clause, Apache-2.0, 0BSD, CC0-1.0, Python-2.0 and BlueOak-1.0.0 can generally be considered for use in a GPL-3.0 project, subject to verification of the exact license, preservation of notices/attribution and any additional terms. Apache-2.0 is compatible with GPL-3.0 (not GPL-2.0-only); preserve Apache notices and applicable NOTICE material.

This is an intake classification, not blanket approval for every artifact, use or distribution.

### 5.3 Review required
- GPL-3.0 third-party packages: potentially compatible when the combined work is conveyed under GPL-3.0; verify exact version, source, notices and combined-work scope.
- GPL-2.0-only: do not combine or distribute as part of a GPL-3.0-only combined work without a valid compatibility route or permission. GPL-2.0-or-later requires checking the actual option and notices.
- LGPL-3.0-or-later: GPL-3.0 compatibility exists under the applicable terms, but verify actual package selected, linking/combination, distribution and Corresponding Source obligations. Do not assume optional packages are shipped.
- LGPL-2.1 and other LGPL versions: assess version-specific compatibility and relinking/source requirements; do not treat all LGPL versions as interchangeable.
- MPL-2.0: review file-level copyleft, modifications, notices and the applicable GPL secondary-license option/compatibility provisions.
- Any SPDX expression containing multiple licenses: preserve and interpret the full expression; do not simplify it to the most permissive component.
- CC-BY-4.0: identify the material/data and meet attribution, license-link and change-notice requirements as applicable.
- Dual-license, custom, source-available or ambiguous metadata: document the selected option and obtain review.

### 5.4 Restricted by default pending legal review
AGPL-3.0, SSPL, Commons Clause, non-commercial/no-redistribution terms, and any terms that conflict with the product's intended distribution or service model. AGPL-3.0 is not the project's chosen license; its network-source provision and interaction with GPL-3.0 must be assessed before combination or distribution. Restricted by default is an internal gate, not a claim that the license is unlawful.

### 5.5 Unknown or absent third-party license
Unknown third-party license metadata is REVIEW_REQUIRED or BLOCKED from release until verified from an authoritative upstream source. Never infer permission from absence of a license.

## 6. Internal workspace and ownership

The five lockfile entries without license fields are local workspace links/aliases, not automatically unknown third-party packages:
- apps/web
- packages/metrics-runtime
- packages/room-runtime
- packages/runtime-core
- packages/websocket-runtime

Their package metadata does not currently declare a license field. Align package-level metadata and source headers with the confirmed GPL-3.0 project intent only after verifying that the company has the rights to license all included contributions. Identify third-party files and separately licensed material; the root LICENSE does not override third-party copyrights or licenses.

Other lockfile workspace records marked extraneous (digital-twin, event-bus, state-runtime and nested room-state-runtime) need reconciliation against current workspace configuration.

## 7. Distribution and release obligations

For every release that conveys a covered program:
- Preserve copyright, license, warranty and modification notices.
- Include a copy of GPL-3.0 and identify covered work.
- For object-code distribution, provide Corresponding Source using a GPL-permitted method and ensure it corresponds to the exact released binary/version.
- Include build/install scripts and source components required by the GPL definition of Corresponding Source, subject to its stated exclusions.
- For User Products where applicable, assess Installation Information requirements.
- Ensure EULA, enterprise terms, technical controls and DRM do not impose restrictions inconsistent with GPL rights.
- Maintain release-to-source traceability and archive the exact source, lockfile, notices and build instructions.

Legal review is required to determine the exact obligations for each product delivery method and jurisdiction.

## 8. Required intake evidence

For each direct/transitive third-party package, retain package name, exact version, source/registry, SPDX identifier/full expression, dependency scope (prod/dev/optional), upstream license/NOTICE evidence where needed, actual use/distribution model, decision, reviewer, approver and exception expiry.

Preserve lockfiles and full SPDX expressions. Generate and retain an SBOM for release candidates when tooling is available.

## 9. CI enforcement design

The License Compliance workflow must:
1. Read committed lockfiles and version-controlled policy configuration.
2. Fail closed with CONFIGURATION_ERROR if policy configuration is missing or invalid.
3. Report package, version, full license expression and dependency scope.
4. Distinguish PASS, REVIEW_REQUIRED, FAIL and CONFIGURATION_ERROR.
5. Evaluate GPL-3.0 as the project's intended license; do not blanket-block it.
6. Apply compatibility rules conservatively and flag GPL-2.0-only, LGPL variants, MPL, AGPL, custom and unknown expressions for contextual review.
7. Never silently skip checks or convert unknown licenses to PASS.
8. Test Allowed, Conditional, Restricted, Unknown and composite-expression fixtures.
9. Produce auditable reports on each pull request and release candidate.

Do not add the check to Branch Rulesets as a Required Check until its name, execution, failure behavior and PR reporting are verified. Ruleset changes require separate governance approval.

## 10. Exceptions

Each exception must name package, version, repository, use case, distribution model, risk controls, reviewer, approver, decision date and expiry. The requester cannot be the sole approver. An exception cannot amend an upstream license or waive rights of third-party copyright holders.

## 11. Roles

- Business Owner: approves policy, business model and risk exceptions.
- Technical Owner: owns inventory, tooling and implementation.
- Developer/AI Agent: supplies evidence; cannot approve its own exception.
- Code Reviewer: verifies dependency changes and PR evidence.
- Legal Advisor: reviews copyleft, compatibility, source-disclosure, ownership and contracts.
- Repository Administrator: configures GitHub controls only after approval.

## 12. Pilot acceptance gates

The pilot is not complete until:
- GPL-3.0 scope, copyright ownership, contributor/contractor rights and source notices are confirmed.
- SaaS versus copy-conveying delivery models are documented for each product surface.
- LGPL sharp platform packages and MPL development packages are assessed for actual use and distribution.
- CC-BY-4.0 attribution obligations are recorded.
- Internal workspace metadata and stale lockfile workspace entries are reconciled.
- GitHub Actions, containers, vendored assets and other shipped artifacts are inventoried.
- Release source-correspondence and notice-generation process is demonstrated.
- Scanner is tested against all policy outcomes and composite expressions.
- A PR demonstrates the check executing accurately.
- Business Owner and relevant legal/technical reviewers approve the final policy.

Until these gates pass, this document remains a draft and is not a compliance certification or production-release authorization.

## 13. Review cycle

Review at least every 90 days during the pilot and whenever dependencies, distribution model, repository licensing or product architecture materially changes.

## 14. Approval

Status: DRAFT — not effective  
Business Owner: ____________________  
Technical Owner: ____________________  
Legal Reviewer: ____________________  
Approval date: ____________________  
Effective date: ____________________
