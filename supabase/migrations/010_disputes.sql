-- Migration 010: Dispute Resolution System
-- Adds disputes table for handling booking disputes between clients and performers

-- ============================================================================
-- 1. NEW TABLE: disputes
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id),
  raised_by UUID NOT NULL REFERENCES auth.users(id),
  raised_against UUID NOT NULL REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved_refund', 'resolved_warning', 'resolved_no_action', 'closed')),
  admin_notes TEXT,
  resolution TEXT,
  refund_amount_pence INTEGER,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_disputes_booking ON public.disputes(booking_id);
CREATE INDEX IF NOT EXISTS idx_disputes_raised_by ON public.disputes(raised_by);
CREATE INDEX IF NOT EXISTS idx_disputes_raised_against ON public.disputes(raised_against);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_created ON public.disputes(created_at DESC);

-- ============================================================================
-- 2. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Users can read disputes they raised
CREATE POLICY "Users can read disputes they raised" ON public.disputes
  FOR SELECT USING (auth.uid() = raised_by);

-- Users can read disputes raised against them
CREATE POLICY "Users can read disputes against them" ON public.disputes
  FOR SELECT USING (auth.uid() = raised_against);

-- Authenticated users can create disputes (further validation in app logic)
CREATE POLICY "Authenticated users can create disputes" ON public.disputes
  FOR INSERT WITH CHECK (auth.uid() = raised_by);

-- Service role has full access (for admin operations)
CREATE POLICY "Service role full access to disputes" ON public.disputes
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================================
-- 3. TRIGGERS
-- ============================================================================

-- Updated_at trigger
CREATE TRIGGER update_disputes_updated_at
  BEFORE UPDATE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 4. GRANTS
-- ============================================================================

GRANT SELECT ON public.disputes TO anon;
GRANT ALL ON public.disputes TO authenticated;
