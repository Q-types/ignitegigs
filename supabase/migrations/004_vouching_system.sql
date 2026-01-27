-- ============================================
-- IgniteGigs Performer Vouching System
-- Migration: 004_vouching_system.sql
--
-- Community-driven trust building:
-- - Experienced performers can vouch for newcomers
-- - 3 vouches from verified performers = "Community Trusted" badge
-- - Builds trust network, helps new performers get started
-- ============================================

-- ============================================
-- PERFORMER VOUCHES TABLE
-- ============================================
-- This is a simplified vouching system focused on building community trust
-- Different from peer_vouches which tracks specific skill endorsements

CREATE TABLE IF NOT EXISTS public.performer_vouches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Voucher is the performer giving the vouch
  voucher_id UUID NOT NULL REFERENCES public.performer_profiles(id) ON DELETE CASCADE,

  -- Vouchee is the performer receiving the vouch
  vouchee_id UUID NOT NULL REFERENCES public.performer_profiles(id) ON DELETE CASCADE,

  -- Optional message explaining the vouch
  message TEXT CHECK (char_length(message) <= 500),

  -- Type of vouch being given
  vouch_type TEXT NOT NULL DEFAULT 'skill' CHECK (
    vouch_type IN ('skill', 'professionalism', 'safety', 'reliability')
  ),

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Each performer can only vouch for another performer once (regardless of type)
  UNIQUE(voucher_id, vouchee_id),

  -- Cannot vouch for yourself
  CONSTRAINT cannot_vouch_self CHECK (voucher_id != vouchee_id)
);

-- Add comment for documentation
COMMENT ON TABLE public.performer_vouches IS 'Community trust vouches between performers. 3 vouches = Community Trusted badge.';
COMMENT ON COLUMN public.performer_vouches.vouch_type IS 'Type of endorsement: skill (technical ability), professionalism (conduct), safety (safe practices), reliability (shows up)';

-- ============================================
-- INDEXES FOR FAST LOOKUPS
-- ============================================

-- Index for looking up vouches received by a performer
CREATE INDEX IF NOT EXISTS idx_vouches_vouchee
  ON public.performer_vouches(vouchee_id);

-- Index for looking up vouches given by a performer
CREATE INDEX IF NOT EXISTS idx_vouches_voucher
  ON public.performer_vouches(voucher_id);

-- Composite index for checking if one performer has vouched for another
CREATE INDEX IF NOT EXISTS idx_vouches_voucher_vouchee
  ON public.performer_vouches(voucher_id, vouchee_id);

-- Index for vouch type analysis
CREATE INDEX IF NOT EXISTS idx_vouches_type
  ON public.performer_vouches(vouchee_id, vouch_type);

-- ============================================
-- ADD VOUCH TRACKING TO PERFORMER PROFILES
-- ============================================

-- Add vouch_count column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'performer_profiles'
    AND column_name = 'vouch_count'
  ) THEN
    ALTER TABLE public.performer_profiles
    ADD COLUMN vouch_count INTEGER DEFAULT 0 CHECK (vouch_count >= 0);
  END IF;
END $$;

-- Add community_trusted column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'performer_profiles'
    AND column_name = 'community_trusted'
  ) THEN
    ALTER TABLE public.performer_profiles
    ADD COLUMN community_trusted BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add index for community trusted performers
CREATE INDEX IF NOT EXISTS idx_performer_community_trusted
  ON public.performer_profiles(community_trusted)
  WHERE community_trusted = TRUE;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.performer_vouches ENABLE ROW LEVEL SECURITY;

-- Anyone can view vouches (public endorsements build trust)
CREATE POLICY "Vouches are publicly viewable"
  ON public.performer_vouches
  FOR SELECT
  USING (true);

-- Only verified/complete performers can create vouches
-- This ensures vouches come from established community members
CREATE POLICY "Verified performers can vouch"
  ON public.performer_vouches
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.performer_profiles
      WHERE id = voucher_id
      AND user_id = auth.uid()
      AND profile_complete = true
    )
  );

-- Performers can delete their own vouches (in case of changed opinion)
CREATE POLICY "Performers can delete own vouches"
  ON public.performer_vouches
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.performer_profiles
      WHERE id = voucher_id
      AND user_id = auth.uid()
    )
  );

-- Service role has full access for admin operations
CREATE POLICY "Service role full access to vouches"
  ON public.performer_vouches
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- FUNCTION: Update vouch count and badge
-- ============================================

CREATE OR REPLACE FUNCTION update_vouch_count()
RETURNS TRIGGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment vouch count
    UPDATE public.performer_profiles
    SET
      vouch_count = vouch_count + 1,
      community_trusted = (vouch_count + 1) >= 3,
      updated_at = NOW()
    WHERE id = NEW.vouchee_id;

  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement vouch count
    UPDATE public.performer_profiles
    SET
      vouch_count = GREATEST(0, vouch_count - 1),
      community_trusted = (GREATEST(0, vouch_count - 1)) >= 3,
      updated_at = NOW()
    WHERE id = OLD.vouchee_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER: Auto-update counts on vouch changes
-- ============================================

DROP TRIGGER IF EXISTS on_vouch_change ON public.performer_vouches;

CREATE TRIGGER on_vouch_change
  AFTER INSERT OR DELETE ON public.performer_vouches
  FOR EACH ROW
  EXECUTE FUNCTION update_vouch_count();

-- ============================================
-- HELPER FUNCTION: Get vouches for a performer
-- ============================================

CREATE OR REPLACE FUNCTION get_performer_vouches(p_performer_id UUID)
RETURNS TABLE (
  id UUID,
  voucher_id UUID,
  voucher_stage_name TEXT,
  voucher_avatar_url TEXT,
  voucher_user_id UUID,
  message TEXT,
  vouch_type TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pv.id,
    pv.voucher_id,
    pp.stage_name as voucher_stage_name,
    u.avatar_url as voucher_avatar_url,
    pp.user_id as voucher_user_id,
    pv.message,
    pv.vouch_type,
    pv.created_at
  FROM public.performer_vouches pv
  INNER JOIN public.performer_profiles pp ON pp.id = pv.voucher_id
  INNER JOIN public.users u ON u.id = pp.user_id
  WHERE pv.vouchee_id = p_performer_id
  ORDER BY pv.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- HELPER FUNCTION: Check if user can vouch
-- ============================================

CREATE OR REPLACE FUNCTION can_user_vouch(
  p_voucher_user_id UUID,
  p_vouchee_performer_id UUID
)
RETURNS TABLE (
  can_vouch BOOLEAN,
  reason TEXT,
  voucher_performer_id UUID,
  already_vouched BOOLEAN
) AS $$
DECLARE
  v_voucher_performer_id UUID;
  v_already_vouched BOOLEAN;
  v_profile_complete BOOLEAN;
BEGIN
  -- Get voucher's performer profile
  SELECT id, profile_complete
  INTO v_voucher_performer_id, v_profile_complete
  FROM public.performer_profiles
  WHERE user_id = p_voucher_user_id;

  -- Check if already vouched
  SELECT EXISTS(
    SELECT 1 FROM public.performer_vouches
    WHERE voucher_id = v_voucher_performer_id
    AND vouchee_id = p_vouchee_performer_id
  ) INTO v_already_vouched;

  -- Self-vouch check
  IF v_voucher_performer_id = p_vouchee_performer_id THEN
    RETURN QUERY SELECT false, 'Cannot vouch for yourself'::TEXT, v_voucher_performer_id, v_already_vouched;
    RETURN;
  END IF;

  -- No performer profile
  IF v_voucher_performer_id IS NULL THEN
    RETURN QUERY SELECT false, 'Must be a performer to vouch'::TEXT, v_voucher_performer_id, v_already_vouched;
    RETURN;
  END IF;

  -- Profile not complete
  IF NOT v_profile_complete THEN
    RETURN QUERY SELECT false, 'Must have a complete profile to vouch'::TEXT, v_voucher_performer_id, v_already_vouched;
    RETURN;
  END IF;

  -- Already vouched
  IF v_already_vouched THEN
    RETURN QUERY SELECT false, 'Already vouched for this performer'::TEXT, v_voucher_performer_id, v_already_vouched;
    RETURN;
  END IF;

  -- Can vouch
  RETURN QUERY SELECT true, NULL::TEXT, v_voucher_performer_id, v_already_vouched;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- INITIALIZE EXISTING DATA
-- ============================================
-- Sync vouch_count for any existing vouches (if migrating from peer_vouches)

UPDATE public.performer_profiles pp
SET
  vouch_count = (
    SELECT COUNT(*)
    FROM public.performer_vouches pv
    WHERE pv.vouchee_id = pp.id
  ),
  community_trusted = (
    SELECT COUNT(*) >= 3
    FROM public.performer_vouches pv
    WHERE pv.vouchee_id = pp.id
  );

-- ============================================
-- GRANTS
-- ============================================

GRANT SELECT ON public.performer_vouches TO anon;
GRANT ALL ON public.performer_vouches TO authenticated;
GRANT EXECUTE ON FUNCTION get_performer_vouches(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION can_user_vouch(UUID, UUID) TO anon, authenticated;
