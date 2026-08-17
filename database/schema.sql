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

