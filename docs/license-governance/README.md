# 3i-XaaS License Governance Workplan

**Status:** Working plan — approval gates remain open  
**PR:** https://github.com/3i-corp/3i-Xaas/pull/23  
**Project license intent:** GPL-3.0 for 3i-XaaS source code, confirmed by the Business Owner on 2026-10-30.

## Work split and accountable roles

| Workstream | Work performed by engineering | Accountable human owner | Return evidence / acceptance |
|---|---|---|---|
| Batch 1 — Legal & Business | Prepare declaration, contributor-rights and approval templates; prepare source pack references | Business Owner coordinates company records; authorized company signatories make declarations; Legal Reviewer assesses rights | Completed declarations, relevant agreements, signed approval record, unresolved-rights list |
| Batch 2 — Technical & License | Maintain npm scanner, parser tests, CI execution, distribution/compatibility templates and exception register | Technical Owner validates actual deployment and shipped artifacts; Legal Reviewer decides legal implications | CI run URL, scan output, production dependency selection, distribution matrix, reviewed exceptions |
| Batch 3 — Evidence & Delivery | Generate per-run scan evidence, SHA-256 manifest and workflow artifact; maintain traceability template | Technical Owner supplies release/source mapping; authorized Release Approver approves any release | Downloaded workflow artifact, verified digests, completed release traceability and approval record |

## Engineering scope completed / in progress

- npm lockfile scan covers 473 entries in the inspected baseline.
- Latest validated scanner run at the time of the initial implementation: 440 PASS, 33 REVIEW_REQUIRED, 0 FAIL.
- Parser/classifier self-tests: 14 passed.
- First-party workspace paths are matched against the five lockfile links.
- Per-run evidence generator and workflow artifact upload have been added to the pilot branch; their new CI validation is pending.
- Legal/business templates are intentionally blank and unsigned.

## Human decisions that automation cannot make

1. Confirm the legal entity that owns each first-party work and the scope of that ownership.
2. Verify employee, contractor, vendor and external contributor agreements; identify missing assignments or permissions.
3. Confirm the actual delivery model and which components are conveyed to recipients.
4. Confirm which optional/platform packages are installed and shipped in each production target.
5. Decide the disposition of LGPL, MPL and CC-BY findings based on actual artifacts and legal review.
6. Approve any exception with named scope, owner, rationale, evidence and expiry.
7. Approve release-to-source correspondence, notices and the applicable Corresponding Source package.
8. Obtain formal Business Owner, Technical Owner, Legal Reviewer and Release Approver decisions.

## Suggested handoff sequence

1. Business Owner gathers ownership, contributor and contractor evidence and returns the completed Batch 1 templates.
2. Technical Owner completes the delivery matrix and confirms actual production dependency/artifact selection.
3. Legal Reviewer reviews the completed evidence and records any conditions or exceptions.
4. Engineering regenerates the evidence package against the final candidate commit and links it to the release record.
5. Authorized approvers decide whether the pilot can be accepted and whether a separate release gate is warranted.

## Gemini Notebook source pack

Use this repository index, the policy and inventory documents, the completed Batch 1/2 templates, CI run logs and the official GNU GPLv3 sources as Notebook source material. Upload and Notebook creation are a separate user-controlled step; this repository does not claim a Notebook has been created.

Official sources:
- GNU GPLv3 full text: https://www.gnu.org/licenses/gpl-3.0.html
- GNU GPL FAQ: https://www.gnu.org/licenses/gpl-faq.html

Repository sources:
- docs/architecture/license-policy-pilot.md
- docs/architecture/license-inventory-pilot.md
- docs/architecture/license-pilot-phase-closeout.md
- config/license-policy.json
- scripts/license-compliance.mjs
- scripts/generate-evidence-package.mjs
- docs/license-governance/batch-1-legal-business/
- docs/license-governance/batch-2-technical/
- docs/license-governance/batch-3-evidence/

## Governance boundary

A passing CI run is evidence that the configured scanner executed; it is not a legal opinion, complete SBOM, ownership determination, compliance certification or release authorization. Keep PR #23 Draft until the technical evidence and human approval gates are complete. Do not change root LICENSE, dependencies, lockfile, Branch Rulesets, Required Checks, Supabase or Vercel settings as part of this pilot without separate explicit approval.
