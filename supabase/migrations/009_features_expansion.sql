-- Migration 009: Features Expansion
-- Adds: verification tiers, PLI, Equity membership, booking contracts,
--        blog system, cancellation policies, notification preferences

-- ============================================================================
-- 1. NEW COLUMNS ON performer_profiles
-- ============================================================================

-- Verification tier: 'community' (default), 'insured', 'verified_pro' (Equity member)
ALTER TABLE public.performer_profiles ADD COLUMN IF NOT EXISTS verification_tier TEXT DEFAULT 'community' CHECK (verification_tier IN ('community', 'insured', 'verified_pro'));

-- Equity union membership
ALTER TABLE public.performer_profiles ADD COLUMN IF NOT EXISTS equity_member_id TEXT;
ALTER TABLE public.performer_profiles ADD COLUMN IF NOT EXISTS equity_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.performer_profiles ADD COLUMN IF NOT EXISTS equity_verified_at TIMESTAMPTZ;

-- PLI (Public Liability Insurance)
ALTER TABLE public.performer_profiles ADD COLUMN IF NOT EXISTS pli_document_url TEXT;
ALTER TABLE public.performer_profiles ADD COLUMN IF NOT EXISTS pli_expiry_date DATE;
ALTER TABLE public.performer_profiles ADD COLUMN IF NOT EXISTS pli_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.performer_profiles ADD COLUMN IF NOT EXISTS pli_verified_at TIMESTAMPTZ;
ALTER TABLE public.performer_profiles ADD COLUMN IF NOT EXISTS pli_provider TEXT;
ALTER TABLE public.performer_profiles ADD COLUMN IF NOT EXISTS pli_policy_number TEXT;

-- Cancellation policy
ALTER TABLE public.performer_profiles ADD COLUMN IF NOT EXISTS cancellation_policy TEXT DEFAULT 'standard' CHECK (cancellation_policy IN ('flexible', 'standard', 'strict'));

-- ============================================================================
-- 2. NEW TABLE: booking_contracts
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.booking_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  
  -- Contract content
  contract_text TEXT NOT NULL,
  contract_version INT DEFAULT 1,
  
  -- Performer signature
  performer_signed BOOLEAN DEFAULT FALSE,
  performer_signed_at TIMESTAMPTZ,
  performer_ip TEXT,
  
  -- Client signature
  client_signed BOOLEAN DEFAULT FALSE,
  client_signed_at TIMESTAMPTZ,
  client_ip TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'signed', 'voided')),
  
  -- Terms
  cancellation_terms TEXT,
  payment_terms TEXT,
  special_terms TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(booking_id, contract_version)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contracts_booking ON public.booking_contracts(booking_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.booking_contracts(status);

-- RLS
ALTER TABLE public.booking_contracts ENABLE ROW LEVEL SECURITY;

-- Both parties can read contracts for their bookings
CREATE POLICY "Booking parties can read contracts" ON public.booking_contracts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id
      AND (
        b.client_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.performer_profiles pp
          WHERE pp.id = b.performer_id AND pp.user_id = auth.uid()
        )
      )
    )
  );

-- Performers can create contracts for their bookings
CREATE POLICY "Performers can create contracts" ON public.booking_contracts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.performer_profiles pp ON pp.id = b.performer_id
      WHERE b.id = booking_id AND pp.user_id = auth.uid()
    )
  );

-- Both parties can update (sign) contracts
CREATE POLICY "Booking parties can update contracts" ON public.booking_contracts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id
      AND (
        b.client_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.performer_profiles pp
          WHERE pp.id = b.performer_id AND pp.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Service role full access to contracts" ON public.booking_contracts
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger for updated_at
CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON public.booking_contracts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 3. NEW TABLE: blog_posts
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 200),
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL CHECK (char_length(content) >= 50),
  excerpt TEXT CHECK (char_length(excerpt) <= 500),
  
  cover_image_url TEXT,
  
  -- Categorization
  category TEXT NOT NULL DEFAULT 'tips' CHECK (category IN ('tips', 'safety', 'business', 'technique', 'gear', 'industry', 'events', 'community')),
  tags TEXT[] DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  
  -- Stats
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  
  -- Moderation
  is_featured BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  moderated_at TIMESTAMPTZ,
  moderated_by UUID REFERENCES public.users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON public.blog_posts USING GIN(tags);

-- RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published, approved posts
CREATE POLICY "Anyone can read published posts" ON public.blog_posts
  FOR SELECT USING (status = 'published' AND is_approved = TRUE);

-- Authors can read their own posts (including drafts)
CREATE POLICY "Authors can read own posts" ON public.blog_posts
  FOR SELECT USING (auth.uid() = author_id);

-- Verified/insured performers and admins can create posts
CREATE POLICY "Verified performers can create posts" ON public.blog_posts
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
      SELECT 1 FROM public.performer_profiles pp
      WHERE pp.user_id = auth.uid()
      AND pp.profile_complete = TRUE
      AND pp.verification_tier IN ('insured', 'verified_pro')
    )
  );

-- Authors can update their own posts
CREATE POLICY "Authors can update own posts" ON public.blog_posts
  FOR UPDATE USING (auth.uid() = author_id);

-- Authors can delete their own draft posts
CREATE POLICY "Authors can delete own drafts" ON public.blog_posts
  FOR DELETE USING (auth.uid() = author_id AND status = 'draft');

CREATE POLICY "Service role full access to blog_posts" ON public.blog_posts
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 4. NEW TABLE: blog_comments
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 2000),
  
  is_approved BOOLEAN DEFAULT TRUE,
  is_flagged BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON public.blog_comments(post_id, created_at);
CREATE INDEX IF NOT EXISTS idx_blog_comments_author ON public.blog_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent ON public.blog_comments(parent_id);

-- RLS
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved comments on published posts
CREATE POLICY "Anyone can read approved comments" ON public.blog_comments
  FOR SELECT USING (
    is_approved = TRUE
    AND EXISTS (
      SELECT 1 FROM public.blog_posts bp
      WHERE bp.id = post_id AND bp.status = 'published' AND bp.is_approved = TRUE
    )
  );

-- Authors can read their own comments
CREATE POLICY "Authors can read own comments" ON public.blog_comments
  FOR SELECT USING (auth.uid() = author_id);

-- Any authenticated user can comment
CREATE POLICY "Authenticated users can comment" ON public.blog_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Authors can update their own comments
CREATE POLICY "Authors can update own comments" ON public.blog_comments
  FOR UPDATE USING (auth.uid() = author_id);

-- Authors can delete their own comments
CREATE POLICY "Authors can delete own comments" ON public.blog_comments
  FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Service role full access to blog_comments" ON public.blog_comments
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger for updated_at
CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON public.blog_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 5. NEW COLUMNS ON bookings (cancellation policy)
-- ============================================================================

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cancellation_policy TEXT DEFAULT 'standard' CHECK (cancellation_policy IN ('flexible', 'standard', 'strict'));
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS refund_amount_pence INT CHECK (refund_amount_pence >= 0);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS refund_processed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS refund_processed_at TIMESTAMPTZ;

-- ============================================================================
-- 6. NEW TABLE: notification_preferences
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  
  email_booking_requests BOOLEAN DEFAULT TRUE,
  email_booking_updates BOOLEAN DEFAULT TRUE,
  email_messages BOOLEAN DEFAULT TRUE,
  email_reviews BOOLEAN DEFAULT TRUE,
  email_blog_comments BOOLEAN DEFAULT TRUE,
  email_marketing BOOLEAN DEFAULT FALSE,
  email_pli_expiry BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own preferences" ON public.notification_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON public.notification_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.notification_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to notification_preferences" ON public.notification_preferences
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 7. GRANTS
-- ============================================================================

GRANT SELECT ON public.blog_posts TO anon;
GRANT ALL ON public.blog_posts TO authenticated;
GRANT SELECT ON public.blog_comments TO anon;
GRANT ALL ON public.blog_comments TO authenticated;
GRANT ALL ON public.booking_contracts TO authenticated;
GRANT ALL ON public.notification_preferences TO authenticated;

-- ============================================================================
-- 8. FUNCTION: generate_blog_slug
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_blog_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 0;
BEGIN
  base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  final_slug := base_slug;
  
  WHILE EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION generate_blog_slug(TEXT) TO authenticated;
