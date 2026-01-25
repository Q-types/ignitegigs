-- ============================================
-- IgniteGigs Initial Database Schema
-- Migration: 001_initial_schema.sql
--
-- Stack: Supabase (Postgres 15) with PostGIS
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- CUSTOM TYPES / ENUMS
-- ============================================

-- User types
CREATE TYPE user_type_enum AS ENUM ('performer', 'client', 'both');

-- Media types
CREATE TYPE media_type_enum AS ENUM ('video', 'photo');

-- Booking status
CREATE TYPE booking_status_enum AS ENUM (
  'inquiry',      -- Initial request
  'pending',      -- Awaiting performer response
  'accepted',     -- Performer accepted, awaiting deposit
  'confirmed',    -- Deposit paid
  'completed',    -- Event done, final payment made
  'cancelled',    -- Cancelled by either party
  'declined',     -- Performer declined
  'disputed'      -- Payment dispute
);

-- Review types
CREATE TYPE reviewer_type_enum AS ENUM ('client', 'performer');

-- Event types
CREATE TYPE event_type_enum AS ENUM ('wedding', 'corporate', 'festival', 'private', 'birthday', 'other');

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE public.users (
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

-- Indexes for users
CREATE INDEX idx_users_email ON public.users (email);
CREATE INDEX idx_users_user_type ON public.users (user_type);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own record (on signup)
CREATE POLICY "Users can insert own record" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Service role can do everything (for admin operations)
CREATE POLICY "Service role has full access" ON public.users
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- PERFORMER PROFILES TABLE
-- ============================================
CREATE TABLE public.performer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Basic Info
  stage_name TEXT,
  bio TEXT,
  tagline TEXT, -- "Mesmerizing fire performances for unforgettable events"

  -- Location (PostGIS enabled)
  location_name TEXT NOT NULL, -- "Manchester, UK"
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_point GEOGRAPHY(POINT, 4326), -- PostGIS geography for spatial queries
  travel_radius_miles INT DEFAULT 50 CHECK (travel_radius_miles >= 0 AND travel_radius_miles <= 500),

  -- Performance Types (arrays for GIN indexing)
  performer_category TEXT[] NOT NULL DEFAULT '{}', -- ['fire', 'led', 'aerial', 'circus']
  act_types TEXT[] NOT NULL DEFAULT '{}', -- ['fire_poi', 'fire_breathing', 'led_hoop']

  -- Pricing (in pence for UK)
  min_rate_pence INT CHECK (min_rate_pence >= 0),
  hourly_rate_pence INT CHECK (hourly_rate_pence >= 0),
  event_rate_pence INT CHECK (event_rate_pence >= 0), -- Typical event flat rate

  -- Stripe Connect
  stripe_account_id TEXT,
  stripe_onboarding_complete BOOLEAN DEFAULT FALSE,

  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  verification_badges TEXT[] DEFAULT '{}', -- ['insurance', 'dbs', 'peer_verified']
  insurance_verified_at TIMESTAMPTZ,

  -- Stats (denormalized for performance)
  avg_rating DECIMAL(3,2) DEFAULT 0 CHECK (avg_rating >= 0 AND avg_rating <= 5),
  total_reviews INT DEFAULT 0 CHECK (total_reviews >= 0),
  total_bookings INT DEFAULT 0 CHECK (total_bookings >= 0),
  response_rate DECIMAL(5,2) DEFAULT 0 CHECK (response_rate >= 0 AND response_rate <= 100), -- Percentage
  response_time_hours INT CHECK (response_time_hours >= 0), -- Average response time

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  profile_complete BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performer search
-- PostGIS spatial index for location-based queries
CREATE INDEX idx_performer_location_gist ON public.performer_profiles
  USING GIST (location_point);

-- Alternative index using ST_MakePoint for queries without geography column
CREATE INDEX idx_performer_location_point ON public.performer_profiles
  USING GIST (ST_SetSRID(ST_MakePoint(location_lng, location_lat), 4326));

-- GIN indexes for array columns (category and act type search)
CREATE INDEX idx_performer_category_gin ON public.performer_profiles
  USING GIN (performer_category);

CREATE INDEX idx_performer_act_types_gin ON public.performer_profiles
  USING GIN (act_types);

-- B-tree indexes for filtering
CREATE INDEX idx_performer_active ON public.performer_profiles (is_active, is_verified);
CREATE INDEX idx_performer_featured ON public.performer_profiles (is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_performer_user_id ON public.performer_profiles (user_id);
CREATE INDEX idx_performer_rating ON public.performer_profiles (avg_rating DESC) WHERE is_active = TRUE;

-- Enable RLS
ALTER TABLE public.performer_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for performer_profiles
-- Anyone can read active profiles (public marketplace)
CREATE POLICY "Anyone can read active profiles" ON public.performer_profiles
  FOR SELECT USING (is_active = TRUE);

-- Performers can read their own profile (even if inactive)
CREATE POLICY "Performers can read own profile" ON public.performer_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Performers can update their own profile
CREATE POLICY "Performers can update own profile" ON public.performer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Performers can insert their own profile
CREATE POLICY "Performers can insert own profile" ON public.performer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Performers can delete their own profile
CREATE POLICY "Performers can delete own profile" ON public.performer_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Service role has full access
CREATE POLICY "Service role full access to profiles" ON public.performer_profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- PERFORMER MEDIA TABLE
-- ============================================
CREATE TABLE public.performer_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  performer_id UUID NOT NULL REFERENCES public.performer_profiles(id) ON DELETE CASCADE,

  media_type media_type_enum NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  cloudinary_public_id TEXT,

  title TEXT,
  description TEXT,

  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0 CHECK (sort_order >= 0),

  -- Video specific metadata
  duration_seconds INT CHECK (duration_seconds >= 0),
  width INT,
  height INT,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for media
CREATE INDEX idx_media_performer ON public.performer_media (performer_id, sort_order);
CREATE INDEX idx_media_type ON public.performer_media (performer_id, media_type);
CREATE INDEX idx_media_primary ON public.performer_media (performer_id) WHERE is_primary = TRUE;

-- Enable RLS
ALTER TABLE public.performer_media ENABLE ROW LEVEL SECURITY;

-- RLS Policies for performer_media
-- Anyone can read media for active performers
CREATE POLICY "Anyone can read performer media" ON public.performer_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.performer_profiles pp
      WHERE pp.id = performer_id AND pp.is_active = TRUE
    )
  );

-- Performers can read their own media
CREATE POLICY "Performers can read own media" ON public.performer_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.performer_profiles pp
      WHERE pp.id = performer_id AND pp.user_id = auth.uid()
    )
  );

-- Performers can manage their own media
CREATE POLICY "Performers can insert own media" ON public.performer_media
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.performer_profiles pp
      WHERE pp.id = performer_id AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Performers can update own media" ON public.performer_media
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.performer_profiles pp
      WHERE pp.id = performer_id AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Performers can delete own media" ON public.performer_media
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.performer_profiles pp
      WHERE pp.id = performer_id AND pp.user_id = auth.uid()
    )
  );

-- Service role has full access
CREATE POLICY "Service role full access to media" ON public.performer_media
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- AVAILABILITY TABLE
-- ============================================
CREATE TABLE public.availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  performer_id UUID NOT NULL REFERENCES public.performer_profiles(id) ON DELETE CASCADE,

  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  is_booked BOOLEAN DEFAULT FALSE, -- True if confirmed booking exists
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(performer_id, date)
);

-- Indexes for availability lookup
CREATE INDEX idx_availability_lookup ON public.availability (performer_id, date, is_available);
CREATE INDEX idx_availability_date_range ON public.availability (performer_id, date)
  WHERE is_available = TRUE AND is_booked = FALSE;

-- Enable RLS
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies for availability
-- Anyone can read availability for active performers
CREATE POLICY "Anyone can read performer availability" ON public.availability
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.performer_profiles pp
      WHERE pp.id = performer_id AND pp.is_active = TRUE
    )
  );

-- Performers can read their own availability
CREATE POLICY "Performers can read own availability" ON public.availability
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.performer_profiles pp
      WHERE pp.id = performer_id AND pp.user_id = auth.uid()
    )
  );

-- Performers can manage their own availability
CREATE POLICY "Performers can insert own availability" ON public.availability
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.performer_profiles pp
      WHERE pp.id = performer_id AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Performers can update own availability" ON public.availability
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.performer_profiles pp
      WHERE pp.id = performer_id AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Performers can delete own availability" ON public.availability
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.performer_profiles pp
      WHERE pp.id = performer_id AND pp.user_id = auth.uid()
    )
  );

-- Service role has full access
CREATE POLICY "Service role full access to availability" ON public.availability
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Parties
  performer_id UUID NOT NULL REFERENCES public.performer_profiles(id),
  client_id UUID NOT NULL REFERENCES public.users(id),

  -- Status
  status booking_status_enum DEFAULT 'inquiry' NOT NULL,

  -- Event Details
  event_date DATE NOT NULL,
  event_time TIME,
  event_end_time TIME,
  event_duration_hours DECIMAL(4,1) CHECK (event_duration_hours > 0),
  event_location TEXT NOT NULL,
  event_location_lat DECIMAL(10, 8),
  event_location_lng DECIMAL(11, 8),
  event_type event_type_enum,
  event_details TEXT,
  guest_count INT CHECK (guest_count > 0),

  -- Special requirements
  special_requirements TEXT,
  venue_type TEXT, -- indoor, outdoor, both

  -- Pricing (in pence for UK currency)
  quoted_price_pence INT NOT NULL CHECK (quoted_price_pence >= 0),
  agreed_price_pence INT CHECK (agreed_price_pence >= 0),
  deposit_pence INT CHECK (deposit_pence >= 0),
  platform_fee_pence INT CHECK (platform_fee_pence >= 0), -- 8% of agreed_price
  performer_payout_pence INT CHECK (performer_payout_pence >= 0), -- agreed_price - platform_fee

  -- Payment Status
  deposit_paid BOOLEAN DEFAULT FALSE,
  deposit_paid_at TIMESTAMPTZ,
  final_paid BOOLEAN DEFAULT FALSE,
  final_paid_at TIMESTAMPTZ,

  -- Stripe
  stripe_payment_intent_id TEXT,
  stripe_deposit_payment_intent_id TEXT,
  stripe_final_payment_intent_id TEXT,
  stripe_transfer_id TEXT,

  -- Cancellation
  cancelled_by UUID REFERENCES public.users(id),
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  responded_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT valid_event_times CHECK (event_end_time IS NULL OR event_time IS NULL OR event_end_time > event_time),
  CONSTRAINT valid_agreed_price CHECK (agreed_price_pence IS NULL OR agreed_price_pence >= quoted_price_pence * 0.5)
);

-- Indexes for booking lookups
CREATE INDEX idx_booking_performer ON public.bookings (performer_id, status);
CREATE INDEX idx_booking_client ON public.bookings (client_id, status);
CREATE INDEX idx_booking_date ON public.bookings (event_date);
CREATE INDEX idx_booking_status ON public.bookings (status);
CREATE INDEX idx_booking_performer_date ON public.bookings (performer_id, event_date)
  WHERE status IN ('confirmed', 'accepted');
CREATE INDEX idx_booking_created ON public.bookings (created_at DESC);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings
-- Get the user_id for a performer
CREATE OR REPLACE FUNCTION get_performer_user_id(p_performer_id UUID)
RETURNS UUID AS $$
  SELECT user_id FROM public.performer_profiles WHERE id = p_performer_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Clients can read their own bookings
CREATE POLICY "Clients can read own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = client_id);

-- Performers can read bookings for their profile
CREATE POLICY "Performers can read their bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.performer_profiles pp
      WHERE pp.id = performer_id AND pp.user_id = auth.uid()
    )
  );

-- Clients can create booking requests
CREATE POLICY "Clients can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Clients can update their own bookings (limited updates)
CREATE POLICY "Clients can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = client_id);

-- Performers can update bookings for their profile (accept/decline/complete)
CREATE POLICY "Performers can update their bookings" ON public.bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.performer_profiles pp
      WHERE pp.id = performer_id AND pp.user_id = auth.uid()
    )
  );

-- Service role has full access
CREATE POLICY "Service role full access to bookings" ON public.bookings
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id),

  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 5000),

  -- Message type for system messages
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'attachment')),
  attachment_url TEXT,

  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for messages
CREATE INDEX idx_messages_booking ON public.messages (booking_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages (sender_id);
CREATE INDEX idx_messages_unread ON public.messages (booking_id) WHERE read_at IS NULL;

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
-- Only booking participants can read messages
CREATE POLICY "Booking participants can read messages" ON public.messages
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

-- Booking participants can send messages
CREATE POLICY "Booking participants can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
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

-- Participants can mark messages as read
CREATE POLICY "Participants can update message read status" ON public.messages
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

-- Service role has full access
CREATE POLICY "Service role full access to messages" ON public.messages
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id),

  reviewer_id UUID NOT NULL REFERENCES public.users(id),
  reviewee_id UUID NOT NULL REFERENCES public.users(id),

  reviewer_type reviewer_type_enum NOT NULL,

  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT CHECK (char_length(content) <= 2000),

  -- Specific ratings (optional)
  professionalism_rating INT CHECK (professionalism_rating BETWEEN 1 AND 5),
  communication_rating INT CHECK (communication_rating BETWEEN 1 AND 5),
  value_rating INT CHECK (value_rating BETWEEN 1 AND 5),
  punctuality_rating INT CHECK (punctuality_rating BETWEEN 1 AND 5),

  is_public BOOLEAN DEFAULT TRUE,

  -- Response from reviewee
  response TEXT CHECK (char_length(response) <= 1000),
  response_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Each booking can only have one review per reviewer type
  UNIQUE(booking_id, reviewer_type)
);

-- Indexes for reviews
CREATE INDEX idx_reviews_reviewee ON public.reviews (reviewee_id, is_public);
CREATE INDEX idx_reviews_reviewer ON public.reviews (reviewer_id);
CREATE INDEX idx_reviews_booking ON public.reviews (booking_id);
CREATE INDEX idx_reviews_rating ON public.reviews (reviewee_id, rating) WHERE is_public = TRUE;

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
-- Anyone can read public reviews
CREATE POLICY "Anyone can read public reviews" ON public.reviews
  FOR SELECT USING (is_public = TRUE);

-- Reviewers can read their own reviews
CREATE POLICY "Reviewers can read own reviews" ON public.reviews
  FOR SELECT USING (auth.uid() = reviewer_id);

-- Reviewees can read reviews about them
CREATE POLICY "Reviewees can read their reviews" ON public.reviews
  FOR SELECT USING (auth.uid() = reviewee_id);

-- Booking participants can create reviews (must be after completed booking)
CREATE POLICY "Participants can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id
    AND EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id
      AND b.status = 'completed'
      AND (
        (b.client_id = auth.uid() AND reviewer_type = 'client')
        OR EXISTS (
          SELECT 1 FROM public.performer_profiles pp
          WHERE pp.id = b.performer_id AND pp.user_id = auth.uid() AND reviewer_type = 'performer'
        )
      )
    )
  );

-- Reviewees can respond to reviews
CREATE POLICY "Reviewees can respond to reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = reviewee_id)
  WITH CHECK (auth.uid() = reviewee_id);

-- Service role has full access
CREATE POLICY "Service role full access to reviews" ON public.reviews
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- PEER VOUCHES TABLE
-- ============================================
CREATE TABLE public.peer_vouches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  voucher_id UUID NOT NULL REFERENCES public.performer_profiles(id),
  vouchee_id UUID NOT NULL REFERENCES public.performer_profiles(id),

  skill_area TEXT NOT NULL CHECK (skill_area IN (
    'fire_safety',
    'led_tech',
    'professionalism',
    'creativity',
    'reliability',
    'stage_presence',
    'technical_skill',
    'audience_engagement'
  )),
  message TEXT CHECK (char_length(message) <= 500),

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Each performer can only vouch for another performer once per skill
  UNIQUE(voucher_id, vouchee_id, skill_area),
  -- Cannot vouch for yourself
  CONSTRAINT cannot_vouch_self CHECK (voucher_id != vouchee_id)
);

-- Indexes for peer vouches
CREATE INDEX idx_vouches_vouchee ON public.peer_vouches (vouchee_id);
CREATE INDEX idx_vouches_voucher ON public.peer_vouches (voucher_id);
CREATE INDEX idx_vouches_skill ON public.peer_vouches (vouchee_id, skill_area);

-- Enable RLS
ALTER TABLE public.peer_vouches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for peer_vouches
-- Anyone can read vouches for active performers
CREATE POLICY "Anyone can read performer vouches" ON public.peer_vouches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.performer_profiles pp
      WHERE pp.id = vouchee_id AND pp.is_active = TRUE
    )
  );

-- Performers can create vouches
CREATE POLICY "Performers can create vouches" ON public.peer_vouches
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.performer_profiles pp
      WHERE pp.id = voucher_id AND pp.user_id = auth.uid()
    )
  );

-- Performers can delete their own vouches
CREATE POLICY "Performers can delete own vouches" ON public.peer_vouches
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.performer_profiles pp
      WHERE pp.id = voucher_id AND pp.user_id = auth.uid()
    )
  );

-- Service role has full access
CREATE POLICY "Service role full access to vouches" ON public.peer_vouches
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- SAVED PERFORMERS TABLE (Client favorites)
-- ============================================
CREATE TABLE public.saved_performers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  performer_id UUID NOT NULL REFERENCES public.performer_profiles(id) ON DELETE CASCADE,

  notes TEXT, -- Client's private notes about the performer
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(client_id, performer_id)
);

-- Indexes for saved performers
CREATE INDEX idx_saved_client ON public.saved_performers (client_id);
CREATE INDEX idx_saved_performer ON public.saved_performers (performer_id);

-- Enable RLS
ALTER TABLE public.saved_performers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for saved_performers
-- Users can read their own saved performers
CREATE POLICY "Users can read own saved performers" ON public.saved_performers
  FOR SELECT USING (auth.uid() = client_id);

-- Users can save performers
CREATE POLICY "Users can save performers" ON public.saved_performers
  FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Users can update their saved performer notes
CREATE POLICY "Users can update own saved performers" ON public.saved_performers
  FOR UPDATE USING (auth.uid() = client_id);

-- Users can remove saved performers
CREATE POLICY "Users can remove saved performers" ON public.saved_performers
  FOR DELETE USING (auth.uid() = client_id);

-- Service role has full access
CREATE POLICY "Service role full access to saved" ON public.saved_performers
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update location_point from lat/lng
CREATE OR REPLACE FUNCTION update_location_point()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.location_lat IS NOT NULL AND NEW.location_lng IS NOT NULL THEN
    NEW.location_point = ST_SetSRID(ST_MakePoint(NEW.location_lng, NEW.location_lat), 4326)::geography;
  ELSE
    NEW.location_point = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update performer stats when a review is added
CREATE OR REPLACE FUNCTION update_performer_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_performer_profile_id UUID;
BEGIN
  -- Get the performer profile id for the reviewee
  SELECT id INTO v_performer_profile_id
  FROM public.performer_profiles
  WHERE user_id = NEW.reviewee_id;

  -- Only update if this is a client review of a performer
  IF v_performer_profile_id IS NOT NULL AND NEW.reviewer_type = 'client' THEN
    UPDATE public.performer_profiles
    SET
      avg_rating = (
        SELECT COALESCE(AVG(rating)::DECIMAL(3,2), 0)
        FROM public.reviews
        WHERE reviewee_id = NEW.reviewee_id
        AND reviewer_type = 'client'
        AND is_public = TRUE
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM public.reviews
        WHERE reviewee_id = NEW.reviewee_id
        AND reviewer_type = 'client'
        AND is_public = TRUE
      ),
      updated_at = NOW()
    WHERE id = v_performer_profile_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update performer total_bookings when booking is completed
CREATE OR REPLACE FUNCTION update_performer_booking_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE public.performer_profiles
    SET
      total_bookings = total_bookings + 1,
      updated_at = NOW()
    WHERE id = NEW.performer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to mark availability as booked when booking is confirmed
CREATE OR REPLACE FUNCTION update_availability_on_booking()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    -- Mark the date as booked
    INSERT INTO public.availability (performer_id, date, is_available, is_booked)
    VALUES (NEW.performer_id, NEW.event_date, FALSE, TRUE)
    ON CONFLICT (performer_id, date)
    DO UPDATE SET is_booked = TRUE, is_available = FALSE, updated_at = NOW();
  ELSIF OLD.status = 'confirmed' AND NEW.status IN ('cancelled', 'declined') THEN
    -- Unmark the date as booked
    UPDATE public.availability
    SET is_booked = FALSE, is_available = TRUE, updated_at = NOW()
    WHERE performer_id = NEW.performer_id AND date = NEW.event_date;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate platform fee (8%)
CREATE OR REPLACE FUNCTION calculate_platform_fee()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.agreed_price_pence IS NOT NULL THEN
    NEW.platform_fee_pence = CEIL(NEW.agreed_price_pence * 0.08);
    NEW.performer_payout_pence = NEW.agreed_price_pence - NEW.platform_fee_pence;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Updated_at triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_performer_profiles_updated_at
  BEFORE UPDATE ON public.performer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_availability_updated_at
  BEFORE UPDATE ON public.availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Location point trigger
CREATE TRIGGER update_performer_location_point
  BEFORE INSERT OR UPDATE OF location_lat, location_lng ON public.performer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_location_point();

-- Performer stats trigger (on review insert/update)
CREATE TRIGGER update_performer_stats_on_review
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_performer_stats();

-- Performer booking count trigger
CREATE TRIGGER update_performer_booking_count_trigger
  AFTER INSERT OR UPDATE OF status ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_performer_booking_count();

-- Availability update trigger
CREATE TRIGGER update_availability_on_booking_trigger
  AFTER INSERT OR UPDATE OF status ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_availability_on_booking();

-- Platform fee calculation trigger
CREATE TRIGGER calculate_platform_fee_trigger
  BEFORE INSERT OR UPDATE OF agreed_price_pence ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION calculate_platform_fee();

-- ============================================
-- HELPER FUNCTIONS FOR QUERIES
-- ============================================

-- Function to search performers by location (returns performers within radius)
CREATE OR REPLACE FUNCTION search_performers_by_location(
  search_lat DECIMAL,
  search_lng DECIMAL,
  radius_miles INT DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  stage_name TEXT,
  location_name TEXT,
  distance_miles DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pp.id,
    pp.user_id,
    pp.stage_name,
    pp.location_name,
    (ST_Distance(
      pp.location_point,
      ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography
    ) / 1609.344)::DECIMAL(10,2) as distance_miles
  FROM public.performer_profiles pp
  WHERE pp.is_active = TRUE
    AND pp.location_point IS NOT NULL
    AND ST_DWithin(
      pp.location_point,
      ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography,
      radius_miles * 1609.344 -- Convert miles to meters
    )
  ORDER BY distance_miles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to search performers by category
CREATE OR REPLACE FUNCTION search_performers_by_category(
  categories TEXT[]
)
RETURNS SETOF public.performer_profiles AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.performer_profiles pp
  WHERE pp.is_active = TRUE
    AND pp.performer_category && categories
  ORDER BY pp.avg_rating DESC, pp.total_reviews DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to search performers by act type
CREATE OR REPLACE FUNCTION search_performers_by_act_type(
  act_types_filter TEXT[]
)
RETURNS SETOF public.performer_profiles AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.performer_profiles pp
  WHERE pp.is_active = TRUE
    AND pp.act_types && act_types_filter
  ORDER BY pp.avg_rating DESC, pp.total_reviews DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to get performer's availability for a date range
CREATE OR REPLACE FUNCTION get_performer_availability(
  p_performer_id UUID,
  start_date DATE,
  end_date DATE
)
RETURNS TABLE (
  date DATE,
  is_available BOOLEAN,
  is_booked BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.date::DATE,
    COALESCE(a.is_available, TRUE) as is_available,
    COALESCE(a.is_booked, FALSE) as is_booked
  FROM generate_series(start_date, end_date, '1 day'::interval) d(date)
  LEFT JOIN public.availability a ON a.performer_id = p_performer_id AND a.date = d.date::DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- INITIAL DATA / SEED DATA NOTES
-- ============================================
-- Seed data should be added via supabase/seed.sql
-- Categories: fire, led, aerial, circus, dance, magic, stilt, juggling
-- Act types: fire_poi, fire_breathing, fire_eating, fire_hoop, led_poi, led_hoop,
--            aerial_silk, aerial_hoop, trapeze, acrobatics, contortion, stilt_walking,
--            juggling, magic_close_up, magic_stage, contemporary_dance, etc.

-- ============================================
-- GRANTS (for RLS to work properly)
-- ============================================
-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant access to sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
