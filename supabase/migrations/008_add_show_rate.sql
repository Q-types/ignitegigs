-- Migration: 008_add_show_rate
-- Description: Add per-show rate pricing column to performer_profiles
-- Date: 2026-01-30

-- Add show_rate_pence column for per-show pricing
ALTER TABLE public.performer_profiles
  ADD COLUMN IF NOT EXISTS show_rate_pence INT CHECK (show_rate_pence >= 0);

-- Comment for documentation
COMMENT ON COLUMN public.performer_profiles.show_rate_pence IS 'Per-show flat rate in pence (GBP). Most performers price per show rather than per hour.';
