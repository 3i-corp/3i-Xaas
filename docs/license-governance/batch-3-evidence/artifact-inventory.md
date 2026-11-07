# Generated Evidence Package — Artifact Inventory

The CI workflow generates a per-run evidence directory under `artifacts/license-compliance/generated-per-run/`, intended for workflow-artifact upload rather than committing generated evidence as an approval record.

Expected contents:
- `license-scan.json` — full npm lockfile scan output
- `evidence-manifest.json` — run metadata and SHA-256 input digests
- `README.md` — scope, limitations and review instructions

This covers the npm lockfile scan only. It is not a complete SBOM and does not inventory GitHub Actions, container/base images, system packages, fonts, media, datasets, vendored code or all shipped binaries.
