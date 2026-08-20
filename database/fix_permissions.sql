-- Agrein — PostgREST permissions + relationship fix
-- Run once in Supabase SQL Editor (https://supabase.com/dashboard/project/hjksxxwucfnubtcellbm/sql/new)
-- Symptom that prompted this: Render log spam
--   [productController] joined select failed, falling back: permission denied for schema public
--   [productController] joined select unavailable, using fallback: permission denied for schema public
-- Root cause: the service_role had lost USAGE on the `public` schema and/or GRANTs on the
-- tables it needs to read, and PostgREST also needs a FK from product_quality_details.product_id
-- -> products.id in order to resolve `select('*, product_quality_details(*)')`.

BEGIN;

-- 1. Schema-level grants. PostgREST cannot expose anything in `public` unless
--    the connecting role has USAGE on the schema.
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- 2. Table-level grants for the service_role (used by server/controllers/*).
--    We re-grant on every table in public.* so this script is idempotent and
--    safe to re-run after future migrations.
GRANT ALL ON ALL TABLES    IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- 3. Lock down the anon role to SELECT only by default; RLS policies still
--    gate which rows it can read.
GRANT USAGE ON SCHEMA public TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon;

-- 4. Make sure the embedded join actually resolves. productController.js relies
--    on `select('*, product_quality_details(*)')`, which PostgREST can only
--    auto-detect when an explicit FK exists.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_type = 'FOREIGN KEY'
      AND table_name = 'product_quality_details'
      AND constraint_name = 'product_quality_details_product_id_fkey'
  ) THEN
    ALTER TABLE public.product_quality_details
      ADD CONSTRAINT product_quality_details_product_id_fkey
      FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 5. Note: we do NOT issue `ALTER ROLE service_role BYPASSRLS` here — Supabase
--    reserves that role and blocks ALTER on it from non-superusers (SQLSTATE
--    42501). The Supabase-managed `service_role` already has BYPASSRLS by
--    default, so this is unnecessary. If you ever need to confirm, run as a
--    superuser:
--      SELECT rolname, rolbypassrls FROM pg_roles WHERE rolname = 'service_role';

COMMIT;

-- 6. Reload PostgREST schema cache so GRANTs and the new FK take effect
--    immediately, without waiting for the next deploy.
NOTIFY pgrst, 'reload schema';

-- ----------------------------------------------------------------------------
-- Verification queries (run these AFTER the script above, in the same session
-- or a fresh query). Expected results:
--   * No rows from the FK check (good — we already added it idempotently).
--   * `joinedErr` from productController should disappear in Render logs.
-- ----------------------------------------------------------------------------

-- SELECT conname, conrelid::regclass, confrelid::regclass
--   FROM pg_constraint
--  WHERE conrelid = 'public.product_quality_details'::regclass
--    AND contype = 'f';

-- SELECT grantee, privilege_type
--   FROM information_schema.role_table_grants
--  WHERE table_schema = 'public'
--    AND grantee = 'service_role'
--  ORDER BY table_name, privilege_type;
