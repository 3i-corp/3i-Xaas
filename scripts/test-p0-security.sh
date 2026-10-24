#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIGRATION_FILE="$ROOT_DIR/supabase/proposals/p0_restrict_public_api_grants.sql"
FIXTURE_FILE="$ROOT_DIR/supabase/tests/fixtures/p0_security_baseline.sql"
ASSERTIONS_FILE="$ROOT_DIR/supabase/tests/p0_security_assertions.sql"
DB_CONTAINER="supabase_db_3i-xaas-local"

if [[ "${P0_TEST_ALLOW_RESET:-}" != "1" ]]; then
  echo "Refusing to run destructive P0 fixture without P0_TEST_ALLOW_RESET=1." >&2
  exit 2
fi

for file in "$MIGRATION_FILE" "$FIXTURE_FILE" "$ASSERTIONS_FILE"; do
  if [[ ! -f "$file" ]]; then
    echo "Required P0 security test file not found: $file" >&2
    exit 2
  fi
done

if ! docker ps --format '{{.Names}}' | grep -Fxq "$DB_CONTAINER"; then
  echo "Refusing to run: expected disposable local Supabase container '$DB_CONTAINER' is not running." >&2
  echo "Start the local stack from this repository's supabase/config.toml first." >&2
  exit 2
fi

run_psql() {
  docker exec -i "$DB_CONTAINER" psql -X -v ON_ERROR_STOP=1 -U postgres -d postgres "$@"
}

echo "P0 security test: preparing a disposable local-only fixture."
run_psql < "$FIXTURE_FILE"

assert_preflight_left_grants_unchanged() {
  run_psql <<'SQL'
DO $assert_unchanged$
BEGIN
  IF NOT has_table_privilege('anon', 'public.users', 'SELECT')
     OR NOT has_column_privilege('anon', 'public.users', 'email', 'SELECT')
     OR NOT has_table_privilege('authenticated', 'public.orders', 'INSERT') THEN
    RAISE EXCEPTION 'FAIL: rejected preflight changed fixture grants before authorization checks completed';
  END IF;
END
$assert_unchanged$;
SQL
}

expect_policy_drift_rejected() {
  local table_name="$1"
  local policy_name="$2"
  local policy_sql="$3"
  local output
  run_psql -c "$policy_sql"
  output="$(mktemp)"
  if run_psql < "$MIGRATION_FILE" >"$output" 2>&1; then
    echo "::error::Migration unexpectedly accepted policy drift: table=$table_name policy=$policy_name" >&2
    cat "$output" >&2
    rm -f "$output"
    exit 1
  fi
  if ! grep -Fq "Unexpected SELECT/ALL policy set for $table_name" "$output"; then
    echo "::error::Migration failed for an unexpected reason during policy-drift probe: table=$table_name policy=$policy_name" >&2
    cat "$output" >&2
    rm -f "$output"
    exit 1
  fi
  rm -f "$output"
  assert_preflight_left_grants_unchanged
  run_psql -c "DROP POLICY \"$policy_name\" ON public.$table_name;"
  echo "PASS fail-closed preflight: table=$table_name policy=$policy_name; fixture grants unchanged"
}

echo "P0 security test: verify SELECT/ALL policy drift is rejected before any grant changes."
expect_policy_drift_rejected "products" "P0 unexpected permissive products SELECT" \
  'CREATE POLICY "P0 unexpected permissive products SELECT" ON public.products FOR SELECT TO anon USING (true);'
expect_policy_drift_rejected "products" "P0 unexpected permissive products ALL" \
  'CREATE POLICY "P0 unexpected permissive products ALL" ON public.products FOR ALL TO anon USING (true) WITH CHECK (true);'
expect_policy_drift_rejected "categories" "P0 unexpected permissive categories SELECT" \
  'CREATE POLICY "P0 unexpected permissive categories SELECT" ON public.categories FOR SELECT TO anon USING (true);'
expect_policy_drift_rejected "categories" "P0 unexpected permissive categories ALL" \
  'CREATE POLICY "P0 unexpected permissive categories ALL" ON public.categories FOR ALL TO anon USING (true) WITH CHECK (true);'

echo "P0 security test: inject a post-preflight failure and verify transaction rollback."
faulty_migration="$(mktemp)"
python3 - "$MIGRATION_FILE" "$faulty_migration" <<'PY'
from pathlib import Path
import sys
source = Path(sys.argv[1]).read_text()
needle = "FROM PUBLIC, anon, authenticated;\n\n-- Categories"
replacement = "FROM PUBLIC, anon, authenticated;\n\nSELECT 1 / 0; -- injected failure for rollback test\n\n-- Categories"
if source.count(needle) != 1:
    raise SystemExit("Could not identify the exact post-revoke injection point")
Path(sys.argv[2]).write_text(source.replace(needle, replacement))
PY
fault_output="$(mktemp)"
if run_psql < "$faulty_migration" >"$fault_output" 2>&1; then
  echo "::error::Injected post-preflight failure unexpectedly succeeded." >&2
  cat "$fault_output" >&2
  rm -f "$faulty_migration" "$fault_output"
  exit 1
fi
if ! grep -Eiq 'division by zero' "$fault_output"; then
  echo "::error::Injected rollback probe failed for an unexpected reason." >&2
  cat "$fault_output" >&2
  rm -f "$faulty_migration" "$fault_output"
  exit 1
fi
rm -f "$faulty_migration" "$fault_output"
assert_preflight_left_grants_unchanged
echo "PASS transaction rollback: post-preflight failure leaves fixture grants unchanged"

echo "P0 security test: applying the exact migration file to the clean synthetic fixture (not recording migration history)."
run_psql < "$MIGRATION_FILE"

echo "P0 security test: checking grants, RLS-visible reads, and future object defaults."
run_psql < "$ASSERTIONS_FILE"

expect_denied() {
  local role="$1"
  local label="$2"
  local statement="$3"
  local output
  output="$(mktemp)"
  if printf 'SET ROLE %s;\n%s\nRESET ROLE;\n' "$role" "$statement" | run_psql >"$output" 2>&1; then
    echo "::error::Expected denial but operation succeeded: role=$role operation=$label" >&2
    cat "$output" >&2
    rm -f "$output"
    exit 1
  fi
  if ! grep -Eiq 'permission denied|must be owner' "$output"; then
    echo "::error::Operation failed for an unexpected reason: role=$role operation=$label" >&2
    cat "$output" >&2
    rm -f "$output"
    exit 1
  fi
  echo "PASS denied: role=$role operation=$label"
  rm -f "$output"
}

for role in anon authenticated; do
  expect_denied "$role" "SELECT public.users" "SELECT * FROM public.users;"
  expect_denied "$role" "SELECT protected users.email column" "SELECT email FROM public.users;"
  expect_denied "$role" "SELECT public.orders" "SELECT * FROM public.orders;"
  expect_denied "$role" "SELECT public.order_items" "SELECT * FROM public.order_items;"
  expect_denied "$role" "INSERT public.users" "INSERT INTO public.users (id, email) VALUES (gen_random_uuid(), 'p0-negative@example.invalid');"
  expect_denied "$role" "UPDATE public.orders" "UPDATE public.orders SET status = status WHERE false;"
  expect_denied "$role" "DELETE public.order_items" "DELETE FROM public.order_items WHERE false;"
  expect_denied "$role" "TRUNCATE public.users" "TRUNCATE TABLE public.users;"
  expect_denied "$role" "TRUNCATE public.orders" "TRUNCATE TABLE public.orders;"
done

echo "PASS P0 security migration and negative privilege tests on the disposable local Supabase database."
