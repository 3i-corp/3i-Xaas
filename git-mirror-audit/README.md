# Git mirror and Git LFS audit

This directory contains a manual, auditable mirror-and-verify utility. It creates the report bundle discussed for `git-mirror-audit/`:

- `source-fsck.txt`, `target-fsck.txt`
- `source-refs.tsv`, `target-refs.tsv`, `ref-comparison.tsv`
- `commit-tree-ancestry.tsv`
- `source-refs-verify.txt`, `target-refs-verify.txt`
- `audit-summary.txt`, `SHA256SUMS.txt`

The audit checks Git refs and reachable Git objects and transfers LFS objects separately. It does **not** export GitHub Issues/PRs, Releases and attachments, Wiki, settings, secrets, Actions artifacts, or other GitHub service metadata. Back up those independently if they are in scope.

## Prerequisites

- Git, Git LFS, Python 3, and `sha256sum` installed.
- Read access to the source and write access to the dedicated backup repository.
- Authentication configured through SSH keys or a credential manager. Do not put PATs or passwords in URLs, shell history, reports, or workflow files.
- The backup repository should be dedicated to this mirror. Keep an independent/offline or immutable copy as well; another repo under the same account is not a fully independent backup.

## Run

From the repository root, set the source and destination URLs, inspect the backup first, then explicitly allow mirror replacement:

```bash
SOURCE_URL='git@github.com:OWNER/SOURCE.git' \
BACKUP_URL='git@github.com:OWNER/DEDICATED-BACKUP.git' \
CONFIRM_MIRROR_REPLACE=true \
./git-mirror-audit/run-audit.sh
```

Optionally pass an output directory, or set `AUDIT_OUTPUT_DIR`:

```bash
./git-mirror-audit/run-audit.sh /secure/path/audit-2026-11-05
```

The default report location is `git-mirror-audit/reports/`. Reports may contain repository URLs and ref names; protect them according to the repository's confidentiality requirements.

### Important destructive behavior

`git push --mirror` synchronizes all refs and can delete destination refs that are absent from the source. The script refuses to run unless `CONFIRM_MIRROR_REPLACE=true` is set. Do not use this against a destination containing independent work. The tool does not delete any source data.

## Interpreting results

- `source-fsck.txt` and `target-fsck.txt`: Git object database integrity output. A clean `git fsck` may produce an empty file; consult the overall result in `audit-summary.txt`.
- `source-refs.tsv` and `target-refs.tsv`: ref names and object IDs captured at each end.
- `ref-comparison.tsv`: one row per ref, with `MATCH`, `MISSING_SOURCE`, `MISSING_TARGET`, or `MISMATCH`. A successful mirror has only `MATCH` rows.
- `commit-tree-ancestry.tsv`: commit IDs and parent commit IDs reachable through refs.
- `*-refs-verify.txt`: LFS fetch logs, ref object checks, the `git lfs ls-files --all --long` pointer inventory, and `git lfs fsck` output. LFS storage is separate from Git object storage; check GitHub LFS quotas.
- `audit-summary.txt`: stage status and scope notes.
- `SHA256SUMS.txt`: checksums of the generated report files other than the checksum manifest itself. Verify with `sha256sum -c SHA256SUMS.txt` from the report directory.

A successful audit is not a substitute for a restore drill. Periodically clone the backup into a clean location, fetch LFS, check out an important branch/tag, and validate representative large files. Keep timestamped snapshots/retention so an accidental deletion mirrored from the source can be recovered.

## Suggested operational checklist

- [ ] Confirm source and destination URLs and destination ownership/access controls.
- [ ] Confirm the backup is dedicated and destination-only refs can safely be replaced.
- [ ] Run the audit using a least-privilege credential and protected report storage.
- [ ] Require `Overall result: PASS`; check all rows in `ref-comparison.tsv` are `MATCH`.
- [ ] Verify `SHA256SUMS.txt` and retain the reports with the backup snapshot.
- [ ] Confirm LFS quota/transfer budget and test restoring LFS content.
- [ ] Maintain a separate versioned/offline/immutable backup and test recovery periodically.
- [ ] Document separately how non-GitHub-Git data (Issues/PRs, releases, wiki, settings, secrets, artifacts) is exported and restored.
