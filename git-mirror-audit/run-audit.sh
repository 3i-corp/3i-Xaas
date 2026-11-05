#!/usr/bin/env bash
# Create and verify a Git mirror, including Git LFS objects, and write an audit bundle.
# Usage: SOURCE_URL=... BACKUP_URL=... ./git-mirror-audit/run-audit.sh [output-dir]
set -Eeuo pipefail
umask 077

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${1:-${AUDIT_OUTPUT_DIR:-"$SCRIPT_DIR/reports"}}"
: "${SOURCE_URL:?Set SOURCE_URL to the source Git remote URL}"
: "${BACKUP_URL:?Set BACKUP_URL to the dedicated backup Git remote URL}"

for tool in git git-lfs python3 sha256sum; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "Required command not found: $tool" >&2
    exit 2
  fi
done
if ! git lfs version >/dev/null 2>&1; then
  echo "Git LFS is installed but unavailable; run 'git lfs install' and retry." >&2
  exit 2
fi

# A mirror push can delete refs present only at the destination. Require an explicit opt-in.
if [[ "${CONFIRM_MIRROR_REPLACE:-}" != "true" ]]; then
  cat >&2 <<'NOTICE'
This audit will update the backup with `git push --mirror`. That operation can
remove destination refs that do not exist at the source. Review the destination
and set CONFIRM_MIRROR_REPLACE=true only if replacing its refs is intended.
NOTICE
  exit 2
fi

mkdir -p -- "$OUTPUT_DIR"
OUTPUT_DIR="$(cd -- "$OUTPUT_DIR" && pwd)"
WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/git-mirror-audit.XXXXXXXX")"
cleanup() { rm -rf -- "$WORK_DIR"; }
trap cleanup EXIT

SOURCE_REPO="$WORK_DIR/source.git"
TARGET_REPO="$WORK_DIR/target.git"
STATUS_FILE="$WORK_DIR/status.tsv"
: > "$STATUS_FILE"

record_status() { printf '%s\t%s\n' "$1" "$2" >> "$STATUS_FILE"; }
run_logged() {
  local name="$1"; shift
  if "$@" >"$OUTPUT_DIR/$name" 2>&1; then
    record_status "$name" PASS
    return 0
  else
    local rc=$?
    record_status "$name" "FAIL(exit $rc)"
    return "$rc"
  fi
}

write_refs() {
  local repo="$1" destination="$2"
  {
    printf 'ref\tobject_id\n'
    git -C "$repo" for-each-ref --format='%(refname)%09%(objectname)' | LC_ALL=C sort
  } > "$destination"
}

write_comparison() {
  python3 - "$OUTPUT_DIR/source-refs.tsv" "$OUTPUT_DIR/target-refs.tsv" "$OUTPUT_DIR/ref-comparison.tsv" <<'PY'
import csv, sys

def load(path):
    with open(path, newline='', encoding='utf-8') as f:
        rows = csv.reader(f, delimiter='\t')
        next(rows, None)
        return {row[0]: row[1] for row in rows if len(row) >= 2}

source, target = load(sys.argv[1]), load(sys.argv[2])
with open(sys.argv[3], 'w', newline='', encoding='utf-8') as f:
    out = csv.writer(f, delimiter='\t', lineterminator='\n')
    out.writerow(['status', 'ref', 'source_object_id', 'target_object_id'])
    for ref in sorted(source.keys() | target.keys()):
        s, t = source.get(ref, ''), target.get(ref, '')
        status = 'MATCH' if s and s == t else ('MISSING_SOURCE' if not s else ('MISSING_TARGET' if not t else 'MISMATCH'))
        out.writerow([status, ref, s, t])
PY
}

write_verify() {
  local repo="$1" refs_file="$2" destination="$3" label="$4"
  {
    printf 'Repository: %s\n' "$label"
    printf 'Ref object verification:\n'
    local failed=0 ref oid
    while IFS=$'\t' read -r ref oid; do
      [[ "$ref" == ref || -z "$ref" ]] && continue
      if git -C "$repo" cat-file -e "$oid^{object}" 2>/dev/null; then
        printf 'OK\t%s\t%s\n' "$ref" "$oid"
      else
        printf 'MISSING_OBJECT\t%s\t%s\n' "$ref" "$oid"
        failed=1
      fi
    done < "$refs_file"
    printf '\nLFS pointer inventory (ref-wide):\n'
    if git -C "$repo" lfs ls-files --all --long; then :; else
      printf 'LFS_INVENTORY_FAILED\n'; failed=1
    fi
    printf '\nLFS object integrity check (Git LFS fsck scope):\n'
    if git -C "$repo" lfs fsck --objects --pointers; then :; else
      printf 'LFS_FSCK_FAILED\n'; failed=1
    fi
    return "$failed"
  } > "$destination" 2>&1
}

# Start with a useful summary even when a later stage fails.
finish() {
  local result="$1" source_count=0 target_count=0 matching=0 comparison_bad=0
  if [[ -f "$OUTPUT_DIR/source-refs.tsv" ]]; then source_count=$(($(wc -l < "$OUTPUT_DIR/source-refs.tsv") - 1)); fi
  if [[ -f "$OUTPUT_DIR/target-refs.tsv" ]]; then target_count=$(($(wc -l < "$OUTPUT_DIR/target-refs.tsv") - 1)); fi
  if [[ -f "$OUTPUT_DIR/ref-comparison.tsv" ]]; then
    matching=$(awk -F '\t' 'NR>1 && $1=="MATCH" {n++} END {print n+0}' "$OUTPUT_DIR/ref-comparison.tsv")
    comparison_bad=$(awk -F '\t' 'NR>1 && $1!="MATCH" {n++} END {print n+0}' "$OUTPUT_DIR/ref-comparison.tsv")
  fi
  {
    printf 'Git mirror and LFS audit summary\n'
    printf 'Generated (UTC): %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    printf 'Source URL: %s\nBackup URL: %s\n' "$SOURCE_URL" "$BACKUP_URL"
    printf 'Source refs: %s\nTarget refs: %s\nMatching refs: %s\nRef comparison mismatches/missing: %s\n' "$source_count" "$target_count" "$matching" "$comparison_bad"
    printf 'Overall result: %s\n\nStage results:\n' "$result"
    if [[ -s "$STATUS_FILE" ]]; then cat "$STATUS_FILE"; fi
    printf '\nScope notes:\n- Git refs and reachable Git objects are audited; this does not back up GitHub issues, pull requests, releases/attachments, settings, secrets, Actions artifacts, or other service metadata.\n- Git LFS objects are fetched and pushed separately. Confirm storage/transfer quota and perform a restore test.\n- SHA256SUMS.txt covers the report files except itself.\n'
  } > "$OUTPUT_DIR/audit-summary.txt"
}

on_error() {
  local rc=$?
  trap - ERR
  finish "FAILED (exit $rc)"
  (cd "$OUTPUT_DIR" && sha256sum source-fsck.txt target-fsck.txt source-refs.tsv target-refs.tsv ref-comparison.tsv commit-tree-ancestry.tsv source-refs-verify.txt target-refs-verify.txt audit-summary.txt 2>/dev/null > SHA256SUMS.txt) || true
  echo "Audit failed; partial reports are in: $OUTPUT_DIR" >&2
  exit "$rc"
}
trap on_error ERR

# Source clone and checks.
run_logged source-fsck.txt git clone --mirror "$SOURCE_URL" "$SOURCE_REPO"
run_logged source-fsck.txt git -C "$SOURCE_REPO" fsck --full --strict
write_refs "$SOURCE_REPO" "$OUTPUT_DIR/source-refs.tsv"
{
  printf 'commit\tparents\n'
  git -C "$SOURCE_REPO" rev-list --all --parents | awk '{commit=$1; $1=""; sub(/^ /, ""); print commit "\t" $0}' | LC_ALL=C sort
} > "$OUTPUT_DIR/commit-tree-ancestry.tsv"
run_logged source-refs-verify.txt git -C "$SOURCE_REPO" lfs fetch --all origin
# Add pointer and object verification details while retaining the fetch log.
if ! write_verify "$SOURCE_REPO" "$OUTPUT_DIR/source-refs.tsv" "$WORK_DIR/source-verify-details.txt" source; then
  record_status source-lfs-verification FAIL
else
  record_status source-lfs-verification PASS
fi
cat "$WORK_DIR/source-verify-details.txt" >> "$OUTPUT_DIR/source-refs-verify.txt"

# Do not propagate an unhealthy/incomplete source to the destination.
if grep -q $'\tFAIL' "$STATUS_FILE"; then
  finish 'FAILED: source validation did not pass; backup was not updated'
  (cd "$OUTPUT_DIR" && sha256sum source-fsck.txt source-refs.tsv commit-tree-ancestry.tsv source-refs-verify.txt audit-summary.txt > SHA256SUMS.txt)
  exit 1
fi

# Mirror push can remove destination-only refs; guarded by explicit opt-in above.
run_logged target-fsck.txt git -C "$SOURCE_REPO" push --mirror "$BACKUP_URL"
run_logged target-fsck.txt git -C "$SOURCE_REPO" lfs push --all "$BACKUP_URL"
run_logged target-fsck.txt git clone --mirror "$BACKUP_URL" "$TARGET_REPO"
run_logged target-fsck.txt git -C "$TARGET_REPO" fsck --full --strict
write_refs "$TARGET_REPO" "$OUTPUT_DIR/target-refs.tsv"
run_logged target-refs-verify.txt git -C "$TARGET_REPO" lfs fetch --all origin
if ! write_verify "$TARGET_REPO" "$OUTPUT_DIR/target-refs.tsv" "$WORK_DIR/target-verify-details.txt" target; then
  record_status target-lfs-verification FAIL
else
  record_status target-lfs-verification PASS
fi
cat "$WORK_DIR/target-verify-details.txt" >> "$OUTPUT_DIR/target-refs-verify.txt"
write_comparison

if awk -F '\t' 'NR>1 && $1!="MATCH" {bad=1} END {exit !bad}' "$OUTPUT_DIR/ref-comparison.tsv"; then
  record_status ref-comparison FAIL
else
  record_status ref-comparison PASS
fi

if grep -q $'\tFAIL' "$STATUS_FILE"; then
  finish FAILED
  RESULT=1
else
  finish PASS
  RESULT=0
fi
(cd "$OUTPUT_DIR" && sha256sum source-fsck.txt target-fsck.txt source-refs.tsv target-refs.tsv ref-comparison.tsv commit-tree-ancestry.tsv source-refs-verify.txt target-refs-verify.txt audit-summary.txt > SHA256SUMS.txt)
echo "Audit result: $(grep '^Overall result:' "$OUTPUT_DIR/audit-summary.txt" | cut -d' ' -f3-)"
echo "Reports: $OUTPUT_DIR"
exit "$RESULT"
