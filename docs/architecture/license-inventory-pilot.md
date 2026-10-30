# 3i-XaaS Dependency License Inventory — Pilot Snapshot

**Status:** Evidence snapshot for review; not a legal opinion or complete SBOM  
**Repository:** 3i-corp/3i-XaaS  
**Ref inspected:** main  
**Lockfile:** package-lock.json, lockfileVersion 3  
**Lockfile blob SHA:** 618dc8aa05179e01a6b40542807dff5a63012b3d  
**Root LICENSE blob SHA:** f288702d2fa16d3cdf0035b15a9fcbc552cd88e7

## 1. Summary

| Measure | Observed |
|---|---:|
| node_modules entries in package-lock.json | 473 |
| Third-party entries with a license field | 468 |
| Local workspace links/aliases without license field | 5 |
| Distinct SPDX identifiers/expressions among third-party entries | 13 |

The five entries without a license field are workspace links, not automatically unknown third-party packages.

## 2. License expression counts

| License identifier / expression | Count |
|---|---:|
| MIT | 379 |
| Apache-2.0 | 31 |
| ISC | 17 |
| MPL-2.0 | 13 |
| LGPL-3.0-or-later | 10 |
| Apache-2.0 AND LGPL-3.0-or-later | 3 |
| Apache-2.0 AND LGPL-3.0-or-later AND MIT | 1 |
| BSD-2-Clause | 7 |
| BSD-3-Clause | 2 |
| BlueOak-1.0.0 | 1 |
| Python-2.0 | 1 |
| CC-BY-4.0 | 1 |
| CC0-1.0 | 1 |
| 0BSD | 1 |

Counts total 468 third-party entries. Counts are package-lock entries, not unique upstream projects, and optional platform variants are counted separately.

## 3. Packages requiring focused review

### LGPL-3.0-or-later — 10 optional platform packages
All listed at version 1.2.4:
- @img/sharp-libvips-darwin-arm64
- @img/sharp-libvips-darwin-x64
- @img/sharp-libvips-linux-arm
- @img/sharp-libvips-linux-arm64
- @img/sharp-libvips-linux-ppc64
- @img/sharp-libvips-linux-riscv64
- @img/sharp-libvips-linux-s390x
- @img/sharp-libvips-linux-x64
- @img/sharp-libvips-linuxmusl-arm64
- @img/sharp-libvips-linuxmusl-x64

### Composite expressions containing LGPL — 4 optional packages
- @img/sharp-wasm32@0.34.5 — Apache-2.0 AND LGPL-3.0-or-later AND MIT
- @img/sharp-win32-arm64@0.34.5 — Apache-2.0 AND LGPL-3.0-or-later
- @img/sharp-win32-ia32@0.34.5 — Apache-2.0 AND LGPL-3.0-or-later
- @img/sharp-win32-x64@0.34.5 — Apache-2.0 AND LGPL-3.0-or-later

These are optional platform packages in the lockfile. The actual deployment target and installed/shipped artifact must be verified before concluding which one is used in production.

### MPL-2.0 — 13 development entries
- axe-core@4.11.4
- lightningcss@1.32.0
- lightningcss-android-arm64@1.32.0
- lightningcss-darwin-arm64@1.32.0
- lightningcss-darwin-x64@1.32.0
- lightningcss-freebsd-x64@1.32.0
- lightningcss-linux-arm-gnueabihf@1.32.0
- lightningcss-linux-arm64-gnu@1.32.0
- lightningcss-linux-arm64-musl@1.32.0
- lightningcss-linux-x64-gnu@1.32.0
- lightningcss-linux-x64-musl@1.32.0
- lightningcss-win32-arm64-msvc@1.32.0
- lightningcss-win32-x64-msvc@1.32.0

All are marked dev=true in the lockfile. Review whether any covered source files are modified or distributed as part of the product.

### CC-BY-4.0 — 1 entry
- caniuse-lite@1.0.30001793

Determine the applicable attribution requirements for the included compatibility data and preserve attribution as required.

### Other non-default permissive identifiers
- minimatch@10.2.5 — BlueOak-1.0.0 (nested under @typescript-eslint/typescript-estree; dev dependency)
- argparse@2.0.1 — Python-2.0 (dev dependency)

Verify exact upstream license texts and include them in notices as required.

## 4. Local workspace links without license metadata

The five lockfile entries are:
- node_modules/@lotterynewsafe/metrics-runtime
- node_modules/@lotterynewsafe/room-runtime
- node_modules/@lotterynewsafe/runtime-core
- node_modules/@lotterynewsafe/websocket-runtime
- node_modules/web

The first four correspond to local packages whose package.json files were inspected and do not currently declare a license field. The web entry is a workspace link to apps/web. Do not classify these as unknown third-party dependencies. Establish company ownership and intended project licensing before adding license metadata.

Additional workspace records marked extraneous in the lockfile include:
- packages/digital-twin
- packages/event-bus
- packages/room-runtime/room-state-runtime
- packages/state-runtime

Some do not currently have a package.json at the corresponding path. Reconcile these records with the current workspace configuration and regenerate the lockfile only through a reviewed dependency-maintenance PR.

## 5. Project-level licensing issue

The repository root LICENSE is GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007 (GPL-3.0). This is separate from the third-party dependency inventory. It is a material project-level decision because it appears to state the license for repository source code.

Required action:
1. Confirm whether GPL-3.0 is intentionally applied to all 3i-XaaS source code.
2. If it is intentional, assess compatibility with the company's intended commercial and distribution model.
3. If it is legacy or incorrect, obtain legal/business approval and establish ownership/authority to change it before any modification.
4. Do not silently replace it with MIT, Apache-2.0, proprietary wording or another license.

## 6. Inventory limitations

This snapshot reads the npm lockfile license fields and repository files. It does not yet verify every upstream license text, package artifact, transitive distribution path, actual production install set, GitHub Actions, container/base images, system libraries, fonts/media/datasets, vendored code, or SaaS terms. It is not a complete SBOM and does not certify legal compliance.

## 7. Source evidence

- package.json: https://github.com/3i-corp/3i-Xaas/blob/main/package.json
- package-lock.json: https://github.com/3i-corp/3i-Xaas/blob/main/package-lock.json
- apps/web/package.json: https://github.com/3i-corp/3i-Xaas/blob/main/apps/web/package.json
- root LICENSE: https://github.com/3i-corp/3i-Xaas/blob/main/LICENSE
- packages/metrics-runtime/package.json
- packages/room-runtime/package.json
- packages/runtime-core/package.json
- packages/websocket-runtime/package.json

