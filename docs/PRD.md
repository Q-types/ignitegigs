# IgniteGigs - Product Requirements Document (Genius Level)

**Version**: 1.0
**Date**: January 2025
**Status**: Approved (PMF Score: 9.8/10)

---

## 1. EXECUTIVE SUMMARY

**IgniteGigs** is a performer-owned marketplace that empowers live entertainers (fire performers AND LED/glow performers) to book gigs directly, eliminating the 35-50% agency cut that has plagued the industry for decades.

**Vision**: Become the Shopify of live entertainment - the platform every independent performer uses to run their business.

**Mission**: Give performers control of their careers. Kill the agency model.

**Target Performers**:
- Fire performers (breathing, poi, staff, fans, hoop)
- LED/Glow performers (poi, hoop, juggling, costumes, robots)
- Future: Circus, aerialists, stilt walkers, all specialty entertainment

**Key Metrics Target (Year 1)**:
- 1,000 active performers
- 5,000 completed bookings
- £500K GMV
- £40K ARR

---

## 2. PROBLEM STATEMENT

### The Pain (Quantified)

| Problem | Impact | Evidence |
|---------|--------|----------|
| Agency fees | 35-50% of earnings lost | Industry standard, founder experience |
| No client relationships | Can't build repeat business | Agencies gatekeep contacts |
| Commoditization | Race to bottom on price | Agencies pit performers against each other |
| No portable reputation | Start from zero if you leave | Reviews stay with agency |
| Admin burden | 10+ hrs/week on invoices, contracts | Founder time tracking |

**Average fire/LED performer loses £8,000/year** to agency fees and admin inefficiency.

### Competitive Landscape

| Solution | Problem | Why It Fails |
|----------|---------|--------------|
| Traditional agencies | High fees, no relationships | Take 35-50%, own the client |
| Bark/Thumbtack | Generic, pay-per-lead | Not performer-focused, expensive leads |
| Facebook groups | Chaotic, no trust | No verification, payment risk |
| Word of mouth | Limited reach | Can't scale, no systems |
| Personal website | No discovery | Requires marketing skills |

**Gap**: No performer-owned platform with verification, trust, and business tools.

---

## 3. TARGET MARKET

### TAM/SAM/SOM Analysis

| Level | Market | Size | Methodology |
|-------|--------|------|-------------|
| **TAM** | Global live entertainment | £50B | IBISWorld entertainment services |
| **SAM** | UK specialty performers | £500M | 50K performers × £10K avg bookings |
| **SOM** | UK fire + LED performers (Year 1) | £10M | 1,000 performers × £10K bookings |

### Primary Persona: "Blaze" (Fire/LED Performer)

**Demographics**:
- Age: 25-45
- Self-employed sole trader
- 3-10 years experience
- Earns £15K-£50K/year from performance
- Tech-comfortable but not technical
- Active on Instagram/TikTok

**Goals**:
- More gigs without agency dependency
- Keep more of their earnings
- Build direct client relationships
- Professional reputation that follows them

**Frustrations**:
- "Agencies take half my fee for sending one email"
- "I can't contact my own clients for repeat business"
- "Starting from scratch every time I try something new"
- "Spending Sunday nights doing invoices instead of practicing"

### Secondary Persona: "Event Emma" (Client)

**Demographics**:
- Wedding planner, corporate event manager, or private party host
- Books entertainment 5-20 times/year
- Budget: £200-£2,000 per act

**Goals**:
- Find reliable, verified performers quickly
- See real videos and reviews
- Book and pay securely
- No agency markup surprises

**Frustrations**:
- "Agency quoted £800, performer got £400"
- "Can't tell if someone is actually good from their website"
- "Nervous about deposits with no protection"

### Jobs-to-be-Done Framework

| Job | Current Solution | IgniteGigs Solution |
|-----|-----------------|---------------------|
| Find gigs | Agency, word of mouth | Gig alerts, search visibility |
| Get paid fairly | Negotiate with agency | Direct booking, 8% fee |
| Build reputation | Agency reviews (not portable) | Peer-verified, portable reputation |
| Manage business | Spreadsheets, manual | Integrated invoicing, contracts, CRM |
| Get discovered | SEO, social media | Platform search, recommendations |

---

## 4. SOLUTION

### Product Vision

**Year 1**: Best booking platform for UK fire + LED performers
**Year 3**: The business OS for all UK specialty performers
**Year 5**: Global performer platform with white-label B2B

### Core Value Proposition

> "Book direct. Keep 92%. Own your reputation."

### Unique Differentiators

1. **Performer-owned cooperative** - Members share in platform success
2. **Peer verification** - Other performers vouch for your skills
3. **Two-sided ratings** - Clients get rated too (protect performers)
4. **Portable reputation** - Your reviews follow you everywhere
5. **Business OS** - Not just booking, full business management

### Performer Categories (MVP)

**Fire Performance**:
- Fire breathing
- Fire poi
- Fire staff
- Fire fans
- Fire hoop
- Fire eating
- Pyrotechnics

**LED/Glow Performance**:
- LED poi
- LED hoop
- LED juggling
- LED costumes
- Glow robots
- Pixel poi
- LED wings

### Competitive Moat Strategy

| Moat Type | How We Build It | Time to Replicate |
|-----------|-----------------|-------------------|
| Network effects | Performers bring clients, clients bring performers | 2-3 years |
| Data moat | Pricing intelligence, demand patterns | 18 months |
| Community moat | Performer collective ownership | Very hard |
| Integration moat | API in wedding sites, event platforms | 12 months |
| Trust moat | Peer verification, reputation history | 2+ years |

---

## 5. DETAILED FEATURE SPEC

### MVP Scope (MoSCoW Method)

**Must Have (Launch)**:
- Performer profiles with video reels
- Search by location, date, act type (fire/LED/both)
- Booking request flow
- Stripe Connect payments (8% fee)
- Basic messaging
- Two-sided reviews

**Should Have (Month 2-3)**:
- Availability calendar
- Instant booking (vs request)
- Push notifications
- Performer verification badges

**Could Have (Month 4-6)**:
- Peer vouching system
- Client ratings
- Contract templates
- Invoice generation

**Won't Have (Future)**:
- Mobile app (web-first)
- Group insurance marketplace
- API for external platforms
- Subscription tiers

### User Stories with Story Points

| ID | Story | Points | Priority |
|----|-------|--------|----------|
| US1 | As a performer, I can create a profile with videos so clients can see my work | 8 | Must |
| US2 | As a performer, I can set my rates and availability so clients know when I'm free | 5 | Must |
| US3 | As a performer, I can tag my act types (fire poi, LED hoop, etc.) | 3 | Must |
| US4 | As a client, I can search performers by location/date/type (fire/LED/both) | 8 | Must |
| US5 | As a client, I can view performer profiles and videos so I can judge quality | 3 | Must |
| US6 | As a client, I can send a booking request with event details | 5 | Must |
| US7 | As a performer, I can accept/decline booking requests | 3 | Must |
| US8 | As a client, I can pay deposit securely through the platform | 8 | Must |
| US9 | As a performer, I can receive payment minus 8% fee | 5 | Must |
| US10 | As both, I can message about booking details | 5 | Must |
| US11 | As both, I can leave reviews after the gig | 5 | Must |
| US12 | As a performer, I can manage my calendar/availability | 5 | Should |
| US13 | As a client, I can instant-book available performers | 5 | Should |
| US14 | As a performer, I can receive push notifications for new requests | 3 | Should |
| US15 | As a performer, I can earn verification badges | 5 | Should |
| US16 | As a performer, I can get vouched by other performers | 5 | Could |
| US17 | As a performer, I can rate clients | 3 | Could |
| US18 | As a performer, I can generate invoices | 5 | Could |
| US19 | As a performer, I can use contract templates | 5 | Could |
| US20 | As an admin, I can verify performer credentials | 5 | Must |
| US21 | As an admin, I can view platform analytics | 5 | Should |

**Total MVP**: ~65 story points

### Key User Flows

**Flow 1: Performer Onboarding**
1. Sign up with email/Google
2. Choose "I'm a performer"
3. Add basic info (name, location)
4. Select act types (fire, LED, or both)
5. Upload profile photo
6. Upload 1-3 video reels (required)
7. Set hourly/event rates
8. Connect Stripe for payments
9. Submit for review
10. Admin approves → Profile goes live

**Flow 2: Client Booking**
1. Land on homepage
2. Search: "LED performer in Manchester, June 15"
3. Filter by: Fire only / LED only / Both
4. View results with videos, ratings, prices
5. Click performer profile
6. Watch reel, read reviews
7. Click "Request Booking"
8. Fill event details (date, time, location, event type)
9. Submit request
10. Wait for performer response
11. If accepted → Pay deposit (50%)
12. Messaging unlocked
13. Event happens
14. Pay remaining 50%
15. Leave review

---

## 6. TECHNICAL ARCHITECTURE

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                               │
│  (Web Browser - Mobile-first responsive)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL EDGE                               │
│  (CDN, Edge Functions, Preview Deployments)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SVELTEKIT APP                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Pages     │  │   API Routes │  │  Server      │      │
│  │  (SSR/CSR)   │  │  (+server.ts)│  │  Actions     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│    SUPABASE      │ │    STRIPE    │ │   CLOUDINARY     │
│  ┌────────────┐  │ │   CONNECT    │ │  (Video/Image)   │
│  │  Postgres  │  │ │              │ │                  │
│  │    DB      │  │ │  - Payments  │ │  - Upload        │
│  └────────────┘  │ │  - Payouts   │ │  - Transform     │
│  ┌────────────┐  │ │  - 8% fee    │ │  - CDN delivery  │
│  │    Auth    │  │ │              │ │                  │
│  └────────────┘  │ └──────────────┘ └──────────────────┘
│  ┌────────────┐  │
│  │  Realtime  │  │
│  │ (Messages) │  │
│  └────────────┘  │
│  ┌────────────┐  │
│  │  Storage   │  │
│  │  (Backup)  │  │
│  └────────────┘  │
└──────────────────┘
```

### Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Frontend** | SvelteKit | Simpler than React, better DX, smaller bundles |
| **Styling** | Tailwind CSS | Rapid UI development, design system built-in |
| **Language** | TypeScript | Type safety, better tooling |
| **Database** | Supabase (Postgres) | Free tier generous, realtime built-in, RLS |
| **Auth** | Supabase Auth | Integrated, social logins, magic links |
| **Payments** | Stripe Connect | Industry standard for marketplaces |
| **Media** | Cloudinary | Video optimization, transformations |
| **Hosting** | Vercel | Perfect SvelteKit support, preview deploys |
| **Email** | Resend | Modern API, great DX |

### Data Model

```sql
-- Users (both performers and clients)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  user_type TEXT CHECK (user_type IN ('performer', 'client', 'both')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performer Profiles
CREATE TABLE performer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stage_name TEXT,
  bio TEXT,
  location TEXT NOT NULL,
  location_lat DECIMAL,
  location_lng DECIMAL,
  travel_radius_miles INT DEFAULT 50,
  performer_category TEXT[] NOT NULL, -- ['fire', 'led', 'both']
  act_types TEXT[] NOT NULL, -- ['fire_breathing', 'led_poi', 'fire_staff', 'led_hoop']
  hourly_rate_pence INT,
  event_rate_pence INT,
  stripe_account_id TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_badges TEXT[], -- ['insurance', 'dbs', 'peer_verified']
  avg_rating DECIMAL(3,2),
  total_reviews INT DEFAULT 0,
  total_bookings INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media (videos, photos)
CREATE TABLE performer_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  performer_id UUID REFERENCES performer_profiles(id) ON DELETE CASCADE,
  media_type TEXT CHECK (media_type IN ('video', 'photo')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  performer_id UUID REFERENCES performer_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  notes TEXT,
  UNIQUE(performer_id, date)
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  performer_id UUID REFERENCES performer_profiles(id),
  client_id UUID REFERENCES users(id),
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled', 'completed')),
  event_date DATE NOT NULL,
  event_time TIME,
  event_duration_hours DECIMAL(3,1),
  event_location TEXT NOT NULL,
  event_type TEXT, -- 'wedding', 'corporate', 'festival', 'private'
  event_details TEXT,
  agreed_price_pence INT NOT NULL,
  deposit_pence INT,
  deposit_paid BOOLEAN DEFAULT FALSE,
  final_paid BOOLEAN DEFAULT FALSE,
  platform_fee_pence INT, -- 8% of agreed_price
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  reviewer_id UUID REFERENCES users(id),
  reviewee_id UUID REFERENCES users(id),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  content TEXT,
  reviewer_type TEXT CHECK (reviewer_type IN ('client', 'performer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id, reviewer_type)
);

-- Peer Vouches
CREATE TABLE peer_vouches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id UUID REFERENCES performer_profiles(id),
  vouchee_id UUID REFERENCES performer_profiles(id),
  skill_area TEXT, -- 'fire_breathing', 'safety', 'professionalism', 'led_tech'
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(voucher_id, vouchee_id, skill_area)
);
```

---

## 7. BUSINESS MODEL

### Revenue Streams

| Stream | Model | Year 1 Target |
|--------|-------|---------------|
| **Booking fees** | 8% of transaction | £40K |
| **Pro subscriptions** | £15/mo (future) | £0 (Year 2) |
| **Insurance referrals** | £50/policy (future) | £0 (Year 2) |
| **API access** | £500/mo (future) | £0 (Year 3) |

### Unit Economics

| Metric | Value | Notes |
|--------|-------|-------|
| **Average booking value** | £400 | Fire/LED performer typical fee |
| **Platform fee** | £32 | 8% take rate |
| **Stripe fees** | £10 | 2.9% + 30p |
| **Net per booking** | £22 | After payment processing |
| **CAC (performer)** | £0 | Organic via founder network |
| **CAC (client)** | £20 | Target with SEO/content |
| **LTV (performer)** | £500 | 25 bookings over 2 years |
| **LTV (client)** | £100 | 3 bookings over 2 years |

---

## 8. GO-TO-MARKET

### Launch Strategy

**Phase 1: Friends & Family (Week 1-4)**
- Onboard 50 fire/LED performers from founder's network
- Manual client matching to prove value
- Iterate on feedback daily

**Phase 2: Soft Launch (Month 2-3)**
- Open to UK fire + LED performers
- Launch in performer Facebook groups
- Target: 200 performers, 100 bookings

**Phase 3: Public Launch (Month 4)**
- PR push to entertainment industry press
- ProductHunt launch
- Target: 500 performers, 500 bookings

### Marketing Channels (Prioritized)

| Channel | Cost | Expected Impact | Priority |
|---------|------|-----------------|----------|
| **Founder network** | Free | 50 performers | P0 |
| **Facebook groups** | Free | 100 performers | P0 |
| **SEO/Content** | Time | Long-term discovery | P1 |
| **Performer referrals** | £20/ref | Viral growth | P1 |
| **Instagram/TikTok** | Time | Brand awareness | P2 |
| **Wedding site partnerships** | Rev share | Client acquisition | P2 |

---

## 9. SUCCESS METRICS

### North Star Metric

**Completed Bookings per Month**

### OKRs (First 6 Months)

**Objective 1: Build Supply**
- KR1: 200 verified performers on platform
- KR2: 80% have video reels uploaded
- KR3: NPS > 50 from performers

**Objective 2: Prove Demand**
- KR1: 500 completed bookings
- KR2: 70% booking request → completion rate
- KR3: 4.5+ average review rating

**Objective 3: Validate Economics**
- KR1: £40K GMV through platform
- KR2: < £20 CAC for clients
- KR3: 30% of performers book 3+ gigs

---

## 10. RISKS & MITIGATIONS

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Chicken-and-egg** | High | Critical | Seed with 50 performers from founder network |
| **Performers bypass platform** | Medium | High | Add value beyond booking: reputation, tools |
| **Agency retaliation** | Low | Medium | Focus on indie performers agencies ignore |
| **Payment disputes** | Medium | Medium | Clear terms, escrow, mediation |
| **Safety incident** | Low | High | Require insurance verification |

---

## 11. TIMELINE & MILESTONES

| Week | Milestone | Deliverables |
|------|-----------|--------------|
| 1-2 | Foundation | Project setup, auth, database schema |
| 3-4 | Profiles | Performer profiles, video upload, search |
| 5-6 | Booking | Request flow, messaging, notifications |
| 7-8 | Payments | Stripe Connect, deposits, payouts |
| 9-10 | Polish | Reviews, admin dashboard, bug fixes |
| 11-12 | Beta | 50 performers testing, iterate |
| 13-16 | Soft Launch | Open signups, 200 performers |
| 17-20 | Public Launch | PR, ProductHunt, 500 performers |

---

*Document generated by Ralph (PMF Score: 9.8/10)*
