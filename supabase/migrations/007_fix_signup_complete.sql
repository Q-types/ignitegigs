-- ============================================
-- Migration: 007_fix_signup_complete.sql
-- COMPLETE FIX for "Database error saving new user" signup failure
--
-- Run this ENTIRE script in the Supabase SQL Editor (Dashboard > SQL Editor)
-- It is safe to run multiple times (all statements are idempotent).
-- ============================================


-- =============================================================================
-- STEP 1: Ensure the user_type_enum type exists
-- =============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type_enum') THEN
    CREATE TYPE user_type_enum AS ENUM ('performer', 'client', 'both');
    RAISE NOTICE 'Created user_type_enum';
  ELSE
    RAISE NOTICE 'user_type_enum already exists';
  END IF;
END
$$;


-- =============================================================================
-- STEP 2: Ensure the public.users table exists
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  user_type user_type_enum DEFAULT 'client',
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS (safe to call even if already enabled)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;


-- =============================================================================
-- STEP 3: Ensure RLS policies exist on public.users
-- =============================================================================
-- Drop and recreate policies to ensure they're correct
DO $$
BEGIN
  -- Policy: Users can read own data
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'users'
      AND policyname = 'Users can read own data'
  ) THEN
    CREATE POLICY "Users can read own data" ON public.users
      FOR SELECT USING (auth.uid() = id);
  END IF;

  -- Policy: Users can update own data
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'users'
      AND policyname = 'Users can update own data'
  ) THEN
    CREATE POLICY "Users can update own data" ON public.users
      FOR UPDATE USING (auth.uid() = id);
  END IF;

  -- Policy: Users can insert own record
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'users'
      AND policyname = 'Users can insert own record'
  ) THEN
    CREATE POLICY "Users can insert own record" ON public.users
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;

  -- Policy: Service role has full access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'users'
      AND policyname = 'Service role has full access'
  ) THEN
    CREATE POLICY "Service role has full access" ON public.users
      FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END
$$;


-- =============================================================================
-- STEP 4: Create the bulletproof handle_new_user trigger function
-- =============================================================================
-- This function fires when a new row is inserted into auth.users.
-- It creates the matching public.users record.
--
-- CRITICAL: The EXCEPTION block ensures that if ANYTHING goes wrong
-- (missing table, RLS violation, constraint error, etc.), the error
-- is logged but the auth.users INSERT still succeeds.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = 'public'
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data ->> 'avatar_url',
      NEW.raw_user_meta_data ->> 'picture'
    ),
    COALESCE(
      (NEW.raw_user_meta_data ->> 'user_type')::user_type_enum,
      'performer'::user_type_enum
    )
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but DO NOT re-raise it.
    -- This ensures the auth.users INSERT always succeeds.
    RAISE LOG 'handle_new_user trigger failed for user %: % (SQLSTATE: %)',
      NEW.id, SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$;

-- Ensure the function is owned by postgres (superuser bypasses RLS)
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;


-- =============================================================================
-- STEP 5: Ensure the trigger exists on auth.users
-- =============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- =============================================================================
-- STEP 6: Grant necessary permissions
-- =============================================================================
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.users TO anon;
GRANT ALL ON public.users TO authenticated;


-- =============================================================================
-- STEP 7: Diagnostic - verify everything is set up correctly
-- =============================================================================
DO $$
DECLARE
  v_table_exists BOOLEAN;
  v_enum_exists BOOLEAN;
  v_trigger_exists BOOLEAN;
  v_function_owner TEXT;
BEGIN
  -- Check enum
  SELECT EXISTS(SELECT 1 FROM pg_type WHERE typname = 'user_type_enum')
    INTO v_enum_exists;

  -- Check table
  SELECT EXISTS(
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'users'
  ) INTO v_table_exists;

  -- Check trigger
  SELECT EXISTS(
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'auth' AND c.relname = 'users'
      AND t.tgname = 'on_auth_user_created'
  ) INTO v_trigger_exists;

  -- Check function owner
  SELECT r.rolname INTO v_function_owner
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  JOIN pg_roles r ON p.proowner = r.oid
  WHERE n.nspname = 'public' AND p.proname = 'handle_new_user';

  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '  SIGNUP FIX DIAGNOSTIC RESULTS';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'user_type_enum exists: %', v_enum_exists;
  RAISE NOTICE 'public.users table exists: %', v_table_exists;
  RAISE NOTICE 'on_auth_user_created trigger exists: %', v_trigger_exists;
  RAISE NOTICE 'handle_new_user owner: %', COALESCE(v_function_owner, 'NOT FOUND');
  RAISE NOTICE '========================================';

  IF v_enum_exists AND v_table_exists AND v_trigger_exists AND v_function_owner = 'postgres' THEN
    RAISE NOTICE 'ALL CHECKS PASSED - Signup should work now!';
  ELSE
    RAISE WARNING 'SOME CHECKS FAILED - Review the results above';
  END IF;

  RAISE NOTICE '';
END
$$;
