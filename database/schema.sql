-- Agrein Comprehensive Digital Agricultural Ecosystem Schema (PostgreSQL / Supabase)
-- Connecting Farmers to Buyers, One Harvest at a Time.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles & Users Table (RBAC Roles: BUYER, FARMER, ADMIN, DELIVERY_PARTNER)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    role VARCHAR(30) NOT NULL CHECK (role IN ('BUYER', 'FARMER', 'ADMIN', 'DELIVERY_PARTNER', 'farmer', 'buyer', 'admin')),
    avatar_url TEXT,
    state VARCHAR(100),
    lga VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    email_verified BOOLEAN DEFAULT false,
    is_suspended BOOLEAN DEFAULT false,
    suspension_reason TEXT,
    trust_score INT DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Farmer Profiles Table
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_name VARCHAR(255) NOT NULL,
    farm_location TEXT NOT NULL,
    farm_state VARCHAR(100) NOT NULL,
    farm_lga VARCHAR(100) NOT NULL,
    farm_size_acres NUMERIC(10, 2) DEFAULT 0.0,
    farm_type VARCHAR(100) NOT NULL, -- Crop, Livestock, Mixed
    crops_produced TEXT[],
    years_experience INT DEFAULT 1,
    gps_latitude NUMERIC(10, 6),
    gps_longitude NUMERIC(10, 6),
    intended_products TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 7-Stage Farmer Verification Lifecycle Table
CREATE TABLE IF NOT EXISTS public.farmer_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'PENDING_REVIEW' CHECK (status IN (
        'DRAFT', 'PENDING_REVIEW', 'UNDER_REVIEW', 'CHANGES_REQUIRED', 'APPROVED', 'REJECTED', 'SUSPENDED'
    )),
    nin_number VARCHAR(20),
    bvn_number VARCHAR(20),
    admin_notes TEXT,
    rejection_reason TEXT,
    changes_requested_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Verification Documents Table (Private Storage Metadata)
CREATE TABLE IF NOT EXISTS public.verification_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verification_id UUID NOT NULL REFERENCES public.farmer_verifications(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'government_id', 'farm_deed', 'farm_photo', 'profile_photo', 'agricultural_cert', 'coop_proof'
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    is_private BOOLEAN DEFAULT true,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Verification Audit Logs Table (Immutable Decision Trail)
CREATE TABLE IF NOT EXISTS public.verification_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verification_id UUID NOT NULL REFERENCES public.farmer_verifications(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES public.profiles(id),
    admin_id UUID NOT NULL REFERENCES public.profiles(id),
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'APPROVED', 'REQUESTED_CHANGES', 'REJECTED', 'SUSPENDED', 'REINSTATED'
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Farmer Trust Scores Table
CREATE TABLE IF NOT EXISTS public.farmer_trust_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INT DEFAULT 50 CHECK (score >= 0 AND score <= 100),
    star_rating NUMERIC(3, 2) DEFAULT 4.80,
    verification_points INT DEFAULT 30,
    order_completion_rate NUMERIC(5, 2) DEFAULT 98.50,
    delivery_speed_score INT DEFAULT 95,
    dispute_penalty INT DEFAULT 0,
    review_count INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Product Quality Details Table
CREATE TABLE IF NOT EXISTS public.product_quality_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL UNIQUE,
    harvest_date DATE NOT NULL,
    grade VARCHAR(20) DEFAULT 'Grade A' CHECK (grade IN ('Grade A', 'Grade B', 'Grade C', 'Export Premium')),
    shelf_life_days INT DEFAULT 14,
    production_method VARCHAR(100) DEFAULT 'Irrigated Organic',
    storage_conditions TEXT DEFAULT 'Cool Dry Storage (15-18°C)',
    processing_info TEXT,
    is_certified_organic BOOLEAN DEFAULT false,
    organic_cert_url TEXT,
    available_qty NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Buyer Protection Disputes Table
CREATE TABLE IF NOT EXISTS public.buyer_disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_code VARCHAR(100) UNIQUE NOT NULL,
    order_id VARCHAR(100) NOT NULL,
    buyer_id UUID NOT NULL REFERENCES public.profiles(id),
    farmer_id UUID NOT NULL REFERENCES public.profiles(id),
    reason VARCHAR(50) NOT NULL CHECK (reason IN (
        'NOT_DELIVERED', 'WRONG_PRODUCT', 'DAMAGED', 'POOR_QUALITY', 'QUANTITY_MISMATCH', 'SIGNIFICANTLY_DIFFERENT'
    )),
    description TEXT NOT NULL,
    evidence_urls TEXT[],
    status VARCHAR(30) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'UNDER_INVESTIGATION', 'REFUNDED', 'RELEASED', 'REJECTED')),
    admin_decision_notes TEXT,
    resolved_by UUID REFERENCES public.profiles(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Digital Wallets & Transactions Ledger
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    available_balance NUMERIC(12, 2) DEFAULT 0.00,
    escrow_held_balance NUMERIC(12, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'NGN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'escrow_lock', 'escrow_release', 'refund', 'subscription_fee')),
    amount NUMERIC(12, 2) NOT NULL,
    reference VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- 'verification', 'order', 'dispute', 'system'
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security (RLS)
ALTER TABLE public.farmer_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles visible to authenticated users" ON public.profiles FOR SELECT USING (true);

-- ============================================================================
-- Phase A — Realtime, Real Auth, Gated Dashboards
-- ============================================================================
-- Run this section in the Supabase SQL editor. All statements are idempotent
-- (CREATE / ALTER ... IF NOT EXISTS / DO blocks). Safe to re-run.

-- A.2. Add columns that controllers expect but the original schema omits.
--      phone_number already exists on profiles; only verification_status is new.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS verification_status VARCHAR(30) DEFAULT 'APPROVED';

-- A.1. New tables: products, orders, rfqs, rfq_bids, chat_messages.

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    crop_name VARCHAR(120) NOT NULL,
    description TEXT,
    price_per_unit NUMERIC(12, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL DEFAULT 'kg',
    available_qty NUMERIC(12, 2) NOT NULL DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    state VARCHAR(100),
    lga VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS products_farmer_id_idx ON public.products(farmer_id);
CREATE INDEX IF NOT EXISTS products_is_active_idx ON public.products(is_active);

-- FK for PostgREST: enables the joined `products` + `product_quality_details`
-- select used by /api/products. Without this relationship, embedded selects
-- return "Could not find a relationship ... in the schema cache" (HTTP 500).
-- Idempotent so re-running schema.sql is safe.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'product_quality_details_product_id_fkey'
    ) THEN
        ALTER TABLE public.product_quality_details
            ADD CONSTRAINT product_quality_details_product_id_fkey
            FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(60) UNIQUE NOT NULL,
    buyer_id UUID NOT NULL REFERENCES public.profiles(id),
    farmer_id UUID NOT NULL REFERENCES public.profiles(id),
    product_id UUID REFERENCES public.products(id),
    quantity NUMERIC(12, 2) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    escrow_status VARCHAR(30) DEFAULT 'PENDING' CHECK (escrow_status IN
        ('PENDING','PAID','IN_ESCROW','SHIPPED','DELIVERED','RELEASED','REFUNDED','CANCELLED')),
    payment_reference VARCHAR(120),
    shipping_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS orders_buyer_id_idx ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS orders_farmer_id_idx ON public.orders(farmer_id);
CREATE INDEX IF NOT EXISTS orders_escrow_status_idx ON public.orders(escrow_status);

CREATE TABLE IF NOT EXISTS public.rfqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES public.profiles(id),
    crop_name VARCHAR(120) NOT NULL,
    quantity NUMERIC(12, 2) NOT NULL,
    target_price NUMERIC(12, 2),
    delivery_state VARCHAR(100),
    notes TEXT,
    status VARCHAR(30) DEFAULT 'OPEN' CHECK (status IN
        ('OPEN','AWAITING_BIDS','CLOSED','AWARDED','CANCELLED')),
    winning_bid_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS rfqs_buyer_id_idx ON public.rfqs(buyer_id);
CREATE INDEX IF NOT EXISTS rfqs_status_idx ON public.rfqs(status);

CREATE TABLE IF NOT EXISTS public.rfq_bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES public.profiles(id),
    bid_price NUMERIC(12, 2) NOT NULL,
    message TEXT,
    status VARCHAR(30) DEFAULT 'SUBMITTED' CHECK (status IN
        ('SUBMITTED','ACCEPTED','REJECTED','WITHDRAWN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS rfq_bids_rfq_id_idx ON public.rfq_bids(rfq_id);
CREATE INDEX IF NOT EXISTS rfq_bids_farmer_id_idx ON public.rfq_bids(farmer_id);

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id),
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS chat_messages_order_id_idx ON public.chat_messages(order_id);

-- A.3. Realtime publication. Supabase Realtime ignores tables without a PK
--      and tables not in the publication; both conditions are satisfied below.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END$$;

-- Add tables idempotently. We DO block ignores already-present errors.
DO $$
DECLARE
  t TEXT;
  tables_to_add TEXT[] := ARRAY[
    'profiles',
    'products',
    'product_quality_details',
    'orders',
    'wallets',
    'wallet_transactions',
    'buyer_disputes',
    'farmer_verifications',
    'notifications',
    'rfqs',
    'rfq_bids',
    'chat_messages'
  ];
BEGIN
  FOREACH t IN ARRAY tables_to_add LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    EXCEPTION WHEN duplicate_object THEN
      -- already in the publication; ignore
      NULL;
    END;
  END LOOP;
END$$;

-- A.4. Row Level Security for the new tables. Service-role key bypasses RLS
--      on the backend; these policies only constrain client-side Supabase.

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Public can browse active products and open RFQs (marketplace UX).
DROP POLICY IF EXISTS "Public read active products" ON public.products;
CREATE POLICY "Public read active products" ON public.products
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Farmers manage own products" ON public.products;
CREATE POLICY "Farmers manage own products" ON public.products
  FOR ALL USING (auth.uid() = farmer_id)
  WITH CHECK (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Public read open RFQs" ON public.rfqs;
CREATE POLICY "Public read open RFQs" ON public.rfqs
  FOR SELECT USING (status = 'OPEN' OR status = 'AWAITING_BIDS');

DROP POLICY IF EXISTS "Buyers manage own RFQs" ON public.rfqs;
CREATE POLICY "Buyers manage own RFQs" ON public.rfqs
  FOR ALL USING (auth.uid() = buyer_id)
  WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Public read bids on open RFQs" ON public.rfq_bids;
CREATE POLICY "Public read bids on open RFQs" ON public.rfq_bids
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.rfqs r
      WHERE r.id = rfq_id
        AND (r.status = 'OPEN' OR r.status = 'AWAITING_BIDS')
    )
  );

DROP POLICY IF EXISTS "Farmers submit bids" ON public.rfq_bids;
CREATE POLICY "Farmers submit bids" ON public.rfq_bids
  FOR INSERT WITH CHECK (auth.uid() = farmer_id);

DROP POLICY IF EXISTS "Participants see their orders" ON public.orders;
CREATE POLICY "Participants see their orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = buyer_id
    OR auth.uid() = farmer_id
    OR EXISTS (SELECT 1 FROM public.profiles p
               WHERE p.id = auth.uid() AND UPPER(p.role) = 'ADMIN')
  );

DROP POLICY IF EXISTS "Buyers insert own orders" ON public.orders;
CREATE POLICY "Buyers insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Order status updates" ON public.orders;
CREATE POLICY "Order status updates" ON public.orders
  FOR UPDATE USING (
    auth.uid() = buyer_id
    OR auth.uid() = farmer_id
    OR EXISTS (SELECT 1 FROM public.profiles p
               WHERE p.id = auth.uid() AND UPPER(p.role) = 'ADMIN')
  );

DROP POLICY IF EXISTS "Participants read chat" ON public.chat_messages;
CREATE POLICY "Participants read chat" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id
        AND (o.buyer_id = auth.uid() OR o.farmer_id = auth.uid())
    )
    OR EXISTS (SELECT 1 FROM public.profiles p
               WHERE p.id = auth.uid() AND UPPER(p.role) = 'ADMIN')
  );

DROP POLICY IF EXISTS "Participants send chat" ON public.chat_messages;
CREATE POLICY "Participants send chat" ON public.chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id
        AND (o.buyer_id = auth.uid() OR o.farmer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Owner reads wallet" ON public.wallets;
CREATE POLICY "Owner reads wallet" ON public.wallets
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner reads transactions" ON public.wallet_transactions;
CREATE POLICY "Owner reads transactions" ON public.wallet_transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.wallets w
            WHERE w.id = wallet_id AND w.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Owner reads own notifications" ON public.notifications;
CREATE POLICY "Owner reads own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- Local-file compatibility shim
-- ============================================================================
-- Existing JWTs minted before the Supabase source-of-truth refactor carry
-- `usr-<timestamp>` ids from data/users.json. Storing that legacy id on the
-- row lets the lookup helpers match by either UUID or local_id during the
-- transition window. After all clients have re-minted tokens this column can
-- be dropped.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS local_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_local_id_unique_idx
  ON public.profiles (local_id)
  WHERE local_id IS NOT NULL;

