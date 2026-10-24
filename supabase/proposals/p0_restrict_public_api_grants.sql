-- Execute as one atomic unit: any post-preflight error rolls back every ACL change.
BEGIN;

-- P0 security containment for the existing public API surface.
-- Scope: existing client/PUBLIC grants on the five inventoried application tables
-- and public sequences; global and public-schema defaults for postgres-created objects.
-- Does not change data, RLS policies, service_role grants, or existing function EXECUTE grants.
-- IMPORTANT: Supabase-managed supabase_admin default ACLs cannot be altered by
-- application migrations. See docs/architecture/P0-SECURITY-MIGRATION-REVIEW.md.

DO $preflight$
DECLARE
  missing_tables text[];
BEGIN
  IF current_user <> 'postgres' THEN
    RAISE EXCEPTION 'P0 security migration must run as postgres; current_user=%', current_user;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon')
     OR NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated')
     OR NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    RAISE EXCEPTION 'Expected Supabase API roles anon, authenticated, and service_role must exist';
  END IF;

  SELECT array_agg(expected.table_name)
    INTO missing_tables
  FROM (VALUES ('users'), ('categories'), ('products'), ('orders'), ('order_items')) AS expected(table_name)
  WHERE to_regclass(format('public.%I', expected.table_name)) IS NULL;

  IF missing_tables IS NOT NULL THEN
    RAISE EXCEPTION 'P0 migration requires the reviewed public schema baseline; missing tables: %', missing_tables;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname IN ('users', 'categories', 'products', 'orders', 'order_items')
      AND c.relkind IN ('r', 'p')
      AND NOT c.relrowsecurity
  ) THEN
    RAISE EXCEPTION 'P0 migration expects RLS enabled on all five inventoried application tables';
  END IF;

  -- Fail closed if any additional SELECT/ALL policy exists on categories or
  -- products. PostgreSQL combines applicable permissive policies with OR.
  IF (
    SELECT count(*) FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'categories'
      AND cmd IN ('SELECT', 'ALL')
  ) <> 1
  OR NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'categories'
      AND policyname = 'Public can read categories'
      AND permissive = 'PERMISSIVE'
      AND cmd = 'SELECT'
      AND roles @> ARRAY['anon', 'authenticated']::name[]
      AND roles <@ ARRAY['anon', 'authenticated']::name[]
      AND qual = 'true'
  ) THEN
    RAISE EXCEPTION 'Unexpected SELECT/ALL policy set for categories; review policy drift before proceeding';
  END IF;

  IF (
    SELECT count(*) FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'products'
      AND cmd IN ('SELECT', 'ALL')
  ) <> 1
  OR NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'products'
      AND policyname = 'Public can read published products'
      AND permissive = 'PERMISSIVE'
      AND cmd = 'SELECT'
      AND roles @> ARRAY['anon', 'authenticated']::name[]
      AND roles <@ ARRAY['anon', 'authenticated']::name[]
      AND qual = '(is_published = true)'
  ) THEN
    RAISE EXCEPTION 'Unexpected SELECT/ALL policy set for products; review policy drift before proceeding';
  END IF;
END
$preflight$;

-- Remove column-level grants as well as relation-level grants. Relation-level
-- REVOKE does not cancel a separate column ACL. Iterate only the five inventoried
-- application tables and only the three client/public principals.
DO $column_acl_revoke$
DECLARE
  col record;
BEGIN
  FOR col IN
    SELECT n.nspname, c.relname, a.attname
    FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname IN ('users', 'categories', 'products', 'orders', 'order_items')
      AND c.relkind IN ('r', 'p')
      AND a.attnum > 0
      AND NOT a.attisdropped
  LOOP
    EXECUTE format(
      'REVOKE ALL (%I) ON TABLE %I.%I FROM PUBLIC, anon, authenticated',
      col.attname, col.nspname, col.relname
    );
  END LOOP;
END
$column_acl_revoke$;

-- Remove direct and PUBLIC privileges. PUBLIC grants are inherited by client
-- roles, so revoking only from anon/authenticated is not sufficient.
REVOKE ALL PRIVILEGES ON TABLE
  public.users,
  public.orders,
  public.order_items,
  public.categories,
  public.products
FROM PUBLIC, anon, authenticated;

-- Categories and products remain intentionally readable through SELECT + their
-- exact preflight-verified RLS policies only.
GRANT SELECT ON TABLE public.categories, public.products TO anon, authenticated;

-- Existing sequences are not part of the public client API. Preserve service_role.
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC, anon, authenticated;

-- Global defaults are revoked because PostgreSQL combines global defaults with
-- schema-specific defaults; a schema-scoped REVOKE cannot cancel a global grant.
-- This affects future objects created by postgres across schemas, by design.
-- API-facing access must be granted explicitly in the migration defining the object.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres
  REVOKE ALL PRIVILEGES ON TABLES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres
  REVOKE ALL PRIVILEGES ON SEQUENCES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres
  REVOKE ALL PRIVILEGES ON FUNCTIONS FROM PUBLIC, anon, authenticated;

-- Also clear any existing public-schema-specific defaults, which are additive.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON TABLES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON SEQUENCES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON FUNCTIONS FROM PUBLIC, anon, authenticated;

COMMIT;
