-- ============================================================================
-- AGREIN AGRICULTURAL COMMERCE ECOSYSTEM - DATABASE SCHEMA
-- PostgreSQL / Supabase Migration Script
-- Target DBMS: PostgreSQL 14+
-- ============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('farmer', 'buyer', 'delivery_partner', 'exporter', 'admin');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'disputed');
CREATE TYPE escrow_status AS ENUM ('held', 'released', 'disputed', 'refunded');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'escrow_hold', 'escrow_release', 'refund', 'fee', 'bulk_payout');
CREATE TYPE payment_channel AS ENUM ('interswitch_card', 'interswitch_transfer', 'interswitch_ussd', 'interswitch_qr', 'wallet');
CREATE TYPE rfq_status AS ENUM ('open', 'negotiating', 'awarded', 'closed', 'cancelled');
CREATE TYPE delivery_status AS ENUM ('assigned', 'picked_up', 'in_transit', 'delivered', 'failed');

-- ----------------------------------------------------------------------------
-- USERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'buyer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- FARMERS EXTENSION TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE farmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(255) NOT NULL,
    farm_location VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    lga VARCHAR(100) NOT NULL,
    farm_size_hectares DECIMAL(10,2),
    primary_crops TEXT[], -- Array of crops grown
    nin_number VARCHAR(11),
    bvn_number VARCHAR(11),
    farm_images TEXT[],
    verification_status verification_status DEFAULT 'unverified',
    trust_score DECIMAL(3,2) DEFAULT 4.5, -- Range 0.0 to 5.0
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- BUYERS EXTENSION TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE buyers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    buyer_type VARCHAR(50) DEFAULT 'individual', -- individual, restaurant, hotel, supermarket, food_processor, exporter
    company_name VARCHAR(255),
    shipping_address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- CATEGORIES
-- ----------------------------------------------------------------------------
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- PRODUCTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    unit VARCHAR(50) NOT NULL, -- kg, ton, bag, crate, basket
    price_per_unit DECIMAL(12,2) NOT NULL,
    min_order_quantity DECIMAL(10,2) DEFAULT 1,
    available_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
    origin_location VARCHAR(255) NOT NULL,
    harvest_date DATE,
    is_organic BOOLEAN DEFAULT FALSE,
    is_bulk_available BOOLEAN DEFAULT TRUE,
    qr_traceability_code VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE
);

-- ----------------------------------------------------------------------------
-- FARM-TO-TABLE TRACEABILITY LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE traceability_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL, -- Harvest, Quality Check, Packaging, Transit, Handover
    location VARCHAR(255) NOT NULL,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verifier_notes TEXT,
    temperature_humidity VARCHAR(100)
);

-- ----------------------------------------------------------------------------
-- WALLETS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    available_balance DECIMAL(14,2) DEFAULT 0.00 CHECK (available_balance >= 0),
    escrow_balance DECIMAL(14,2) DEFAULT 0.00 CHECK (escrow_balance >= 0),
    currency VARCHAR(3) DEFAULT 'NGN',
    pin_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- ORDERS & ORDER ITEMS
-- ----------------------------------------------------------------------------
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES buyers(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    commission_amount DECIMAL(12,2) DEFAULT 0.00,
    logistics_fee DECIMAL(12,2) DEFAULT 0.00,
    status order_status DEFAULT 'pending',
    delivery_address TEXT NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    farmer_id UUID REFERENCES farmers(id),
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL
);

-- ----------------------------------------------------------------------------
-- INTERSWITCH ESCROW TRANSACTIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE escrow_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES users(id),
    farmer_id UUID REFERENCES users(id),
    amount DECIMAL(14,2) NOT NULL,
    interswitch_ref VARCHAR(100) UNIQUE NOT NULL,
    payment_channel payment_channel NOT NULL,
    status escrow_status DEFAULT 'held',
    dispute_reason TEXT,
    released_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- WALLET TRANSACTIONS LEDGER
-- ----------------------------------------------------------------------------
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(14,2) NOT NULL,
    reference VARCHAR(100) NOT NULL UNIQUE,
    interswitch_ref VARCHAR(100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'success',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- DELIVERY PARTNERS & SMART LOGISTICS
-- ----------------------------------------------------------------------------
CREATE TABLE delivery_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    vehicle_type VARCHAR(50), -- Truck, Van, Motorcycle, Cold-Chain Trailer
    vehicle_reg_number VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 4.8
);

CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    delivery_partner_id UUID REFERENCES delivery_partners(id),
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    status delivery_status DEFAULT 'assigned',
    current_lat DECIMAL(10,8),
    current_lng DECIMAL(11,8),
    estimated_arrival TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- REVERSE MARKETPLACE (RFQ)
-- ----------------------------------------------------------------------------
CREATE TABLE rfqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES buyers(id) ON DELETE CASCADE,
    crop_name VARCHAR(100) NOT NULL,
    quantity_required DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    target_price_per_unit DECIMAL(12,2),
    delivery_location VARCHAR(255) NOT NULL,
    deadline_date DATE NOT NULL,
    description TEXT,
    status rfq_status DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rfq_bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    proposed_price_per_unit DECIMAL(12,2) NOT NULL,
    offered_quantity DECIMAL(10,2) NOT NULL,
    fulfillment_date DATE NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'submitted', -- submitted, accepted, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- COMMODITY PRICES & MARKET INTELLIGENCE
-- ----------------------------------------------------------------------------
CREATE TABLE commodity_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commodity_name VARCHAR(100) NOT NULL, -- Maize, Rice, Cassava, Tomatoes, Cocoa, Ginger, Sesame, Soybeans
    market_location VARCHAR(100) NOT NULL, -- Lagos, Dawanau Kano, Mile 12, Bodija Ibadan
    price_per_unit DECIMAL(12,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    price_change_percentage DECIMAL(5,2), -- e.g. +2.5 or -1.2
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- COOPERATIVES
-- ----------------------------------------------------------------------------
CREATE TABLE cooperatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    state VARCHAR(100) NOT NULL,
    description TEXT,
    leader_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cooperative_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cooperative_id UUID REFERENCES cooperatives(id) ON DELETE CASCADE,
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- leader, treasurer, secretary, member
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cooperative_id, farmer_id)
);

-- ----------------------------------------------------------------------------
-- COMMUNITY & AGRI-LEARNING
-- ----------------------------------------------------------------------------
CREATE TABLE learning_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- Pest Control, Soil Health, Export Prep, Modern Farming
    content TEXT NOT NULL,
    video_url TEXT,
    author_name VARCHAR(100) DEFAULT 'Agrein Agricultural Experts',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE forum_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General Discussion',
    upvotes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE forum_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- ----------------------------------------------------------------------------
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_farmer ON products(farmer_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_escrow_interswitch_ref ON escrow_transactions(interswitch_ref);
CREATE INDEX idx_commodity_prices_date ON commodity_prices(commodity_name, recorded_date);
CREATE INDEX idx_rfqs_status ON rfqs(status);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can manage their own wallet" ON wallets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Buyers can view their own orders" ON orders FOR SELECT USING (auth.uid() IN (SELECT user_id FROM buyers WHERE id = buyer_id));
