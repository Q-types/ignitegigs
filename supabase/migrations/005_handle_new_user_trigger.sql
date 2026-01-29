-- ============================================
-- IgniteGigs: Auto-create public.users on auth signup
-- Migration: 005_handle_new_user_trigger.sql
--
-- This trigger automatically creates a record in public.users
-- whenever a new user signs up via Supabase Auth (any method:
-- email/password, OAuth, magic link, etc.).
--
-- Without this trigger, the public.users record must be created
-- manually in application code, which can fail silently and
-- cause "Unable to create account" errors.
-- ============================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
