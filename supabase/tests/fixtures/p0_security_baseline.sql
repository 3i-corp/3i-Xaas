-- TEST-ONLY fixture. Destructive to the selected database.
-- scripts/test-p0-security.sh guards this behind P0_TEST_ALLOW_RESET=1 and the
-- exact local Supabase container name. Never run against shared/staging/production.
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(320) UNIQUE,
  password_hash varchar(255),
  first_name varchar(100),
  last_name varchar(100),
  role varchar(50) NOT NULL DEFAULT 'customer',
  is_active boolean NOT NULL DEFAULT true,
  email_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(200) NOT NULL,
  slug varchar(200) UNIQUE NOT NULL,
  description text,
  parent_id uuid REFERENCES public.categories(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.categories(id),
  name varchar(200) NOT NULL,
  sku varchar(100) UNIQUE NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_published boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  status varchar(50) NOT NULL DEFAULT 'pending',
  total numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id),
  product_id uuid NOT NULL REFERENCES public.products(id),
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price numeric NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories"
  ON public.categories FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public can read published products"
  ON public.products FOR SELECT TO anon, authenticated USING (is_published = true);

-- Simulate direct and PUBLIC grants observed as potential exposure paths.
GRANT ALL PRIVILEGES ON TABLE
  public.users, public.categories, public.products, public.orders, public.order_items
TO anon, authenticated, service_role, PUBLIC;
-- Simulate column-level grants that relation-level REVOKE alone would leave behind.
GRANT SELECT (email) ON TABLE public.users TO anon, authenticated, PUBLIC;

CREATE SEQUENCE public.p0_existing_sequence;
GRANT ALL PRIVILEGES ON SEQUENCE public.p0_existing_sequence TO anon, authenticated, service_role, PUBLIC;

-- Seed both global and schema-specific defaults to ensure the tests catch
-- additive ACL behavior; keep service_role defaults to test that they survive.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres
  GRANT ALL PRIVILEGES ON TABLES TO anon, authenticated, service_role, PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres
  GRANT ALL PRIVILEGES ON SEQUENCES TO anon, authenticated, service_role, PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres
  GRANT EXECUTE ON FUNCTIONS TO anon, authenticated, service_role, PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT ALL PRIVILEGES ON TABLES TO anon, authenticated, service_role, PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT ALL PRIVILEGES ON SEQUENCES TO anon, authenticated, service_role, PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO anon, authenticated, service_role, PUBLIC;

INSERT INTO public.users (id, email, password_hash)
VALUES ('00000000-0000-4000-8000-000000000001', 'p0-fixture@example.invalid', 'not-a-real-hash');

INSERT INTO public.categories (id, name, slug)
VALUES ('00000000-0000-4000-8000-000000000002', 'P0 Test Category', 'p0-test-category');

INSERT INTO public.products (id, category_id, name, sku, price, is_published)
VALUES
  ('00000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000002', 'Published Fixture', 'P0-PUBLISHED', 1, true),
  ('00000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000002', 'Unpublished Fixture', 'P0-UNPUBLISHED', 1, false);

INSERT INTO public.orders (id, user_id, status, total)
VALUES ('00000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000001', 'pending', 1);

INSERT INTO public.order_items (id, order_id, product_id, quantity, unit_price)
VALUES ('00000000-0000-4000-8000-000000000006', '00000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000003', 1, 1);
