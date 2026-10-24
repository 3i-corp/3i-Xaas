-- P0 migration assertions; execute only against the disposable local fixture.
DO $assert_existing_grants$
DECLARE
  role_name text;
  table_name text;
  privilege_name text;
  protected_tables text[] := ARRAY['users', 'orders', 'order_items'];
  read_tables text[] := ARRAY['categories', 'products'];
  privileges text[] := ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER', 'MAINTAIN'];
BEGIN
  FOREACH role_name IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    FOREACH table_name IN ARRAY protected_tables LOOP
      FOREACH privilege_name IN ARRAY privileges LOOP
        IF has_table_privilege(role_name, format('public.%I', table_name), privilege_name) THEN
          RAISE EXCEPTION 'FAIL: role % still has % on protected table public.%', role_name, privilege_name, table_name;
        END IF;
      END LOOP;
    END LOOP;

    FOREACH privilege_name IN ARRAY ARRAY['USAGE', 'SELECT', 'UPDATE'] LOOP
      IF has_sequence_privilege(role_name, 'public.p0_existing_sequence', privilege_name) THEN
        RAISE EXCEPTION 'FAIL: role % still has % on existing public sequence', role_name, privilege_name;
      END IF;
    END LOOP;

    FOREACH table_name IN ARRAY read_tables LOOP
      IF NOT has_table_privilege(role_name, format('public.%I', table_name), 'SELECT') THEN
        RAISE EXCEPTION 'FAIL: role % lost required SELECT on public.%', role_name, table_name;
      END IF;
      FOREACH privilege_name IN ARRAY ARRAY['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER', 'MAINTAIN'] LOOP
        IF has_table_privilege(role_name, format('public.%I', table_name), privilege_name) THEN
          RAISE EXCEPTION 'FAIL: role % still has % on read-only table public.%', role_name, privilege_name, table_name;
        END IF;
      END LOOP;
    END LOOP;
  END LOOP;

  IF has_column_privilege('anon', 'public.users', 'email', 'SELECT')
     OR has_column_privilege('authenticated', 'public.users', 'email', 'SELECT') THEN
    RAISE EXCEPTION 'FAIL: client role retains column-level SELECT on protected public.users.email';
  END IF;

  IF NOT has_table_privilege('service_role', 'public.users', 'INSERT')
     OR NOT has_table_privilege('service_role', 'public.orders', 'DELETE')
     OR NOT has_sequence_privilege('service_role', 'public.p0_existing_sequence', 'USAGE') THEN
    RAISE EXCEPTION 'FAIL: P0 unexpectedly removed existing service_role grants';
  END IF;
END
$assert_existing_grants$;

-- Check RLS-visible public read behavior under each client role.
SET ROLE anon;
DO $assert_anon_public_reads$
BEGIN
  IF (SELECT count(*) FROM public.categories) <> 1 THEN
    RAISE EXCEPTION 'FAIL: anon cannot read categories as expected';
  END IF;
  IF (SELECT count(*) FROM public.products) <> 1 THEN
    RAISE EXCEPTION 'FAIL: anon must see only the one published product fixture';
  END IF;
END
$assert_anon_public_reads$;
RESET ROLE;

SET ROLE authenticated;
DO $assert_authenticated_public_reads$
BEGIN
  IF (SELECT count(*) FROM public.categories) <> 1 THEN
    RAISE EXCEPTION 'FAIL: authenticated cannot read categories as expected';
  END IF;
  IF (SELECT count(*) FROM public.products) <> 1 THEN
    RAISE EXCEPTION 'FAIL: authenticated must see only the one published product fixture';
  END IF;
END
$assert_authenticated_public_reads$;
RESET ROLE;

-- Probe defaults for new objects created by postgres after the migration.
CREATE TABLE public.__p0_default_acl_table (id integer);
CREATE SEQUENCE public.__p0_default_acl_sequence;
CREATE FUNCTION public.__p0_default_acl_function() RETURNS integer
  LANGUAGE sql AS 'SELECT 1';

DO $assert_default_privileges$
DECLARE
  role_name text;
  privilege_name text;
BEGIN
  FOREACH role_name IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    FOREACH privilege_name IN ARRAY ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER', 'MAINTAIN'] LOOP
      IF has_table_privilege(role_name, 'public.__p0_default_acl_table', privilege_name) THEN
        RAISE EXCEPTION 'FAIL: future table default gives % privilege to %', privilege_name, role_name;
      END IF;
    END LOOP;

    FOREACH privilege_name IN ARRAY ARRAY['USAGE', 'SELECT', 'UPDATE'] LOOP
      IF has_sequence_privilege(role_name, 'public.__p0_default_acl_sequence', privilege_name) THEN
        RAISE EXCEPTION 'FAIL: future sequence default gives % privilege to %', privilege_name, role_name;
      END IF;
    END LOOP;

    IF has_function_privilege(role_name, 'public.__p0_default_acl_function()', 'EXECUTE') THEN
      RAISE EXCEPTION 'FAIL: future function is executable by % through direct or PUBLIC defaults', role_name;
    END IF;
  END LOOP;

  IF NOT has_table_privilege('service_role', 'public.__p0_default_acl_table', 'SELECT')
     OR NOT has_sequence_privilege('service_role', 'public.__p0_default_acl_sequence', 'USAGE')
     OR NOT has_function_privilege('service_role', 'public.__p0_default_acl_function()', 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL: P0 unexpectedly removed default service_role privileges';
  END IF;
END
$assert_default_privileges$;

DROP FUNCTION public.__p0_default_acl_function();
DROP SEQUENCE public.p0_existing_sequence;
DROP SEQUENCE public.__p0_default_acl_sequence;
DROP TABLE public.__p0_default_acl_table;

SELECT 'PASS: existing grants, PUBLIC inheritance, public-read RLS behavior, and global/schema-specific postgres defaults' AS p0_result;
