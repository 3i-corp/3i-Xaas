# 3i-XaaS License Policy Pilot — Phase Closeout Record

**As of:** 2026-10-30  
**PR:** https://github.com/3i-corp/3i-Xaas/pull/23  
**State:** Engineering baseline and evidence generator implemented; latest CI validation pending. Human policy approval and release authorization remain open.

## Completed and evidenced

- Business Owner confirmed GPL-3.0 is intentional for 3i-XaaS source code (2026-10-30).
- Root LICENSE remains unchanged.
- Main-branch npm lockfile inventory is recorded in `license-inventory-pilot.md`.
- Policy, inventory and closeout documents are maintained in this Draft PR.
- Root `package.json` retains its existing fields/scripts and adds license/evidence commands only.
- Local CI workflow retains its existing checks and read-only contents permission; it adds scanner validation, evidence generation and artifact upload.
- Scanner and policy files:
  - `scripts/license-compliance.mjs`
  - `scripts/test-license-compliance.mjs`
  - `config/license-policy.json`
- Evidence generator: `scripts/generate-evidence-package.mjs`.
- Batch 1 templates: ownership declaration, contributor/contractor rights review and approval record.
- Batch 2 templates: distribution assessment, compatibility review and scan-exceptions register.
- Batch 3 templates: artifact inventory and release-to-source traceability.
- Workstream ownership and handoff instructions: `docs/license-governance/README.md`.

## CI evidence

### Scanner implementation — Run #88

Run #88 was associated with commit `f7190d361e1ae9e62aa19be6f340fd381b99bc4b`.

- License parser/classifier self-tests: 14 passed.
- Lockfile entries scanned: 473.
- Results: 440 PASS, 33 REVIEW_REQUIRED, 0 FAIL.
- The five workspace links were classified as first-party ownership review items.
- Web Build Check Run #9 also completed successfully on that commit.
- The Supabase Local CI job reported success for all listed steps, including local Supabase startup and the integration test step. Docker image pulls encountered rate-limit responses and retried; retain this operational caveat when interpreting the run evidence.

### Evidence package implementation — latest validation pending

The following were added after Run #88:
- `npm run evidence:generate`
- A generator that runs the scanner, writes `license-scan.json`, creates an `evidence-manifest.json` with SHA-256 digests and records explicit scope limitations.
- Workflow upload of the generated directory as a GitHub Actions artifact with 14-day retention.
- Batch 1, 2 and 3 governance templates and the handoff workplan.

The latest PR head at the time of this record is `ff8fdb4781a40a731e250e25c176d5c235879c0f`. CI validation for this head is pending; do not treat the earlier Run #88 as validation of the new generator or artifact upload.

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

**Engineering baseline:** implemented; latest evidence-generator CI validation pending.  
**Legal / ownership / distribution review:** open.  
**Release enforcement:** not enabled.  
**Pilot approval:** not granted.
