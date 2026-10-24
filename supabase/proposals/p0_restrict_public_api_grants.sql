-- P0 security containment for the existing public API surface.
-- Scope: only anon/authenticated grants on the five inventoried application tables,
-- public sequences, and future objects created by postgres. Does not change data,
-- RLS policies, service_role grants, or existing function EXECUTE grants.
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

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'categories'
      AND policyname = 'Public can read categories'
      AND permissive = 'PERMISSIVE'
      AND cmd = 'SELECT'
      AND roles @> ARRAY['anon', 'authenticated']::name[]
      AND qual = 'true'
  ) THEN
    RAISE EXCEPTION 'Expected public SELECT policy for categories is missing or changed; review policy drift before proceeding';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'products'
      AND policyname = 'Public can read published products'
      AND permissive = 'PERMISSIVE'
      AND cmd = 'SELECT'
      AND roles @> ARRAY['anon', 'authenticated']::name[]
      AND qual = '(is_published = true)'
  ) THEN
    RAISE EXCEPTION 'Expected published-products SELECT policy is missing or changed; review policy drift before proceeding';
  END IF;
END
$preflight$;

-- Remove existing API-role privileges from protected application tables.
-- Categories and products remain intentionally readable through SELECT + their
-- existing RLS policies only. No application data or policy is changed.
REVOKE ALL PRIVILEGES ON TABLE
  public.users,
  public.orders,
  public.order_items,
  public.categories,
  public.products
FROM anon, authenticated;

GRANT SELECT ON TABLE public.categories, public.products TO anon, authenticated;

-- Existing sequences are not part of the public client API. Preserve service_role.
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;

-- Future objects created by postgres must be private by default. Grant access
-- explicitly in the migration that creates each API-facing object.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON TABLES FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON SEQUENCES FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON FUNCTIONS FROM anon, authenticated;

-- PostgreSQL's default PUBLIC EXECUTE is global; a schema-scoped REVOKE cannot
-- remove it. Functions that need to be called by an API role must be explicitly
-- granted in the migration that defines them.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
