# 3i-XaaS License Policy Pilot — Phase Closeout Record

**As of:** 2026-10-30  
**PR:** https://github.com/3i-corp/3i-Xaas/pull/23  
**State:** Technical implementation in validation; policy approval and release authorization remain open.

## Completed and evidenced

- Business Owner confirmed GPL-3.0 is intentional for 3i-XaaS source code (2026-10-30).
- Root LICENSE was preserved unchanged.
- Main-branch npm lockfile inventory was recorded in `license-inventory-pilot.md`.
- Policy and inventory documents were added to the pilot PR.
- Supabase Local CI & Integration Tests Run #83 completed successfully on commit `29916c732da1a7a52967d6299ee7774111ea4eab`; job steps show dependency installation, local Supabase startup, integration test execution, status reporting and shutdown all succeeded.
- A dependency-license scanner and version-controlled policy configuration were added:
  - `scripts/license-compliance.mjs`
  - `scripts/test-license-compliance.mjs`
  - `config/license-policy.json`
- Root npm scripts expose `test:license` and `license:check`.
- Existing Local CI workflow now runs scanner self-tests and the dependency scan after `npm ci`.
- Scanner behavior is intentionally conservative:
  - PASS for configured permissive intake licenses.
  - REVIEW_REQUIRED for GPL-3.0 third-party packages, LGPL, MPL, CC-BY and first-party workspace ownership metadata.
  - FAIL for restricted, unknown, malformed or missing third-party license metadata.
  - CONFIGURATION_ERROR exits non-zero for invalid/missing policy or lockfile configuration.
  - SPDX AND/OR expressions are evaluated without reducing a composite expression to its most permissive component.
- Conditional findings are reported in the GitHub Actions step summary. The current pilot configuration blocks FAIL and CONFIGURATION_ERROR; it does not yet make REVIEW_REQUIRED a merge or release gate.

## Validation still in progress

- The CI run triggered by the scanner implementation must complete on the latest PR HEAD. A previous successful run is not evidence that the new scanner has passed.
- Inspect the scanner self-test and scan output, including all 473 lockfile entries and the 5 recognized workspace links.
- Confirm the scanner report counts against the inventory snapshot and review any discrepancies.
- Verify the npm lockfile remains unchanged and `npm ci` remains reproducible.

## Required owner / legal decisions — not delegated to automation

1. Confirm company copyright ownership and contributor/contractor rights for all first-party source.
2. Confirm the GPL-3.0 scope for each repository deliverable and any third-party files.
3. Document the actual delivery model for server code, browser/client bundles, SDKs, agents, on-premise packages and marketplace extensions.
4. Decide the actual production-selected sharp/libvips artifacts and document LGPL obligations where applicable.
5. Review MPL-covered development packages and determine whether any covered files are modified or conveyed.
6. Record CC-BY-4.0 attribution for the relevant caniuse-lite material, if applicable to shipped artifacts.
7. Inventory GitHub Actions, container/base images, system packages, fonts, media, datasets, vendored code and downloaded binaries.
8. Demonstrate release-to-source correspondence, notices, build/install instructions and archive retention for each conveyed artifact.
9. Obtain Business Owner, Technical Owner and Legal Reviewer approval; define expiry and owner for exceptions.

## Governance boundary

This PR remains Draft and must not be merged solely because CI passes. Do not add a Required Check, change Branch Rulesets, change the root LICENSE, modify dependencies or lockfiles, or authorize production distribution until the relevant owners approve the corresponding decision. A passing scanner is evidence of policy execution, not a legal opinion, complete SBOM or compliance certification.

## Phase status

**Engineering baseline:** implemented, pending CI verification.  
**Legal / ownership / distribution review:** open.  
**Release enforcement:** not enabled.  
**Pilot approval:** not granted.
