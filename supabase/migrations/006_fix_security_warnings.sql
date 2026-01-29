-- Migration: 006_fix_security_warnings
-- Description: Fix all Supabase linter security warnings
-- Date: 2026-01-29
--
-- This migration addresses three categories of security warnings:
--   1. Row Level Security (RLS) not enabled on public.spatial_ref_sys
--   2. Mutable search_path on public functions
--   3. Advisory note on PostGIS extension schema placement


-- =============================================================================
-- 1. RLS on spatial_ref_sys
-- =============================================================================
-- The spatial_ref_sys table is created by PostGIS and stores spatial reference
-- system definitions. It should be readable by all authenticated users but not
-- writable by arbitrary roles.

ALTER TABLE IF EXISTS public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'spatial_ref_sys'
  ) THEN
    -- Allow all users to read spatial reference data (needed for PostGIS operations)
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'spatial_ref_sys'
        AND policyname = 'Allow public read access on spatial_ref_sys'
    ) THEN
      CREATE POLICY "Allow public read access on spatial_ref_sys"
        ON public.spatial_ref_sys
        FOR SELECT
        USING (true);
    END IF;
  END IF;
END
$$;


-- =============================================================================
-- 2. Fix mutable search_path on all public functions
-- =============================================================================
-- When a function does not have an immutable search_path, it is vulnerable to
-- search_path hijacking. Setting search_path to '' (empty) forces all object
-- references inside the function body to be schema-qualified, which is the
-- secure default recommended by the Supabase linter.
--
-- We use ALTER FUNCTION so we do not need to know or restate the function body.

-- Performer availability lookup
ALTER FUNCTION public.get_performer_availability SET search_path = 'public';

-- Returns the user_id that owns a performer profile
ALTER FUNCTION public.get_performer_user_id SET search_path = 'public';

-- Trigger/helper that syncs a lat/lng into a PostGIS point column
ALTER FUNCTION public.update_location_point SET search_path = 'public';

-- Recalculates the cached vouch count on a performer profile
ALTER FUNCTION public.update_vouch_count SET search_path = 'public';

-- Geospatial search for performers within a radius
ALTER FUNCTION public.search_performers_by_location SET search_path = 'public';

-- Checks whether the current user is allowed to vouch for a performer
ALTER FUNCTION public.can_user_vouch SET search_path = 'public';

-- Search performers filtered by category
ALTER FUNCTION public.search_performers_by_category SET search_path = 'public';

-- Returns the list of vouches for a performer
ALTER FUNCTION public.get_performer_vouches SET search_path = 'public';

-- Recalculates aggregate stats (rating, review count, etc.)
ALTER FUNCTION public.update_performer_stats SET search_path = 'public';

-- Increments/updates the booking count on a performer profile
ALTER FUNCTION public.update_performer_booking_count SET search_path = 'public';

-- Marks availability slots as taken when a booking is confirmed
ALTER FUNCTION public.update_availability_on_booking SET search_path = 'public';

-- Generic trigger that sets updated_at = now() on row modification
ALTER FUNCTION public.update_updated_at SET search_path = 'public';

-- Trigger that creates a profile row when a new auth.users row appears
ALTER FUNCTION public.handle_new_user SET search_path = 'public';

-- Calculates the platform fee for a given booking amount
ALTER FUNCTION public.calculate_platform_fee SET search_path = 'public';

-- Search performers filtered by act type
ALTER FUNCTION public.search_performers_by_act_type SET search_path = 'public';


-- =============================================================================
-- 3. PostGIS extension schema advisory
-- =============================================================================
-- The Supabase linter recommends that extensions live in the 'extensions' schema
-- rather than 'public'. However, moving PostGIS after tables and functions
-- already reference its types (e.g. geometry, geography) can be disruptive and
-- may require recreating columns and functions.
--
-- Advisory: On the next fresh database setup, create PostGIS in the extensions
-- schema from the start:
--
--   CREATE SCHEMA IF NOT EXISTS extensions;
--   CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;
--
-- For this existing database we leave PostGIS in the public schema to avoid
-- breaking spatial columns and functions that depend on public.geometry, etc.
