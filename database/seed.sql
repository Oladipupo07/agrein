-- Agrein Database Seed File

-- Insert Categories
INSERT INTO categories (id, name, description, image_url) VALUES
(1, 'Fruits', 'Fresh agricultural fruits straight from orchards.', 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&q=80&w=400'),
(2, 'Vegetables', 'Organic and fresh vegetables grown by local farmers.', 'https://images.unsplash.com/photo-1566385101042-1a010c129fa6?auto=format&fit=crop&q=80&w=400'),
(3, 'Grains', 'Rice, maize, beans, millet, and other stable grains.', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400'),
(4, 'Livestock', 'Cattle, sheep, goats, and pigs raised under standard conditions.', 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=400'),
(5, 'Poultry', 'Fresh eggs, chickens, turkeys, and other domestic fowls.', 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=400'),
(6, 'Seafood', 'Fresh and smoked fish, shrimps, crabs, and other aquatic products.', 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=400'),
(7, 'Dairy', 'Fresh milk, butter, cheese, and local wara.', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400'),
(8, 'Cash Crops', 'Cocoa, oil palm, rubber, cotton, and cashews for domestic and export markets.', 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=400')
ON CONFLICT (id) DO NOTHING;

-- Insert Mock Users
-- Note: password_hash values are mock (bcrypt hashes of 'password123')
-- Admin User
INSERT INTO users (id, email, password_hash, full_name, phone_number, role, status, avatar_url) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@agrein.com', '$2a$10$pLwWn9Bv6g5KkFqT6.P8e.56b/8RkP9c9WjS7Xyq2zVlU3.2n21f.', 'Chidi Egwu', '+2348012345678', 'admin', 'active', 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin')
ON CONFLICT (id) DO NOTHING;

-- Farmer 1 (Approved)
INSERT INTO users (id, email, password_hash, full_name, phone_number, role, status, avatar_url) VALUES
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'farmer.kole@agrein.com', '$2a$10$pLwWn9Bv6g5KkFqT6.P8e.56b/8RkP9c9WjS7Xyq2zVlU3.2n21f.', 'Kole Adebayo', '+2348023456789', 'farmer', 'active', 'https://api.dicebear.com/7.x/adventurer/svg?seed=kole')
ON CONFLICT (id) DO NOTHING;

INSERT INTO farmers (user_id, farm_name, farm_address, state, verification_status, payout_details, ratings, balance) VALUES
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Green Horizon Farm', 'Plot 45, Farm Settlement Road, Ikorodu', 'Lagos', 'approved', '{"bank_name": "Access Bank", "account_number": "0123456789", "account_name": "Kole Adebayo"}', 4.8, 150000.00)
ON CONFLICT (user_id) DO NOTHING;

-- Farmer 2 (Pending approval for testing)
INSERT INTO users (id, email, password_hash, full_name, phone_number, role, status, avatar_url) VALUES
('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'farmer.fatima@agrein.com', '$2a$10$pLwWn9Bv6g5KkFqT6.P8e.56b/8RkP9c9WjS7Xyq2zVlU3.2n21f.', 'Fatima Bello', '+2348034567890', 'farmer', 'active', 'https://api.dicebear.com/7.x/adventurer/svg?seed=fatima')
ON CONFLICT (id) DO NOTHING;

INSERT INTO farmers (user_id, farm_name, farm_address, state, verification_status, payout_details, ratings, balance) VALUES
('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Kano Grain Empire', 'KM 12, Hadejia Road, Kano', 'Kano', 'pending', '{"bank_name": "GTBank", "account_number": "0987654321", "account_name": "Fatima Bello"}', 0.0, 0.00)
ON CONFLICT (user_id) DO NOTHING;

-- Buyer 1
INSERT INTO users (id, email, password_hash, full_name, phone_number, role, status, avatar_url) VALUES
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'buyer.emeka@agrein.com', '$2a$10$pLwWn9Bv6g5KkFqT6.P8e.56b/8RkP9c9WjS7Xyq2zVlU3.2n21f.', 'Emeka Okafor', '+2348045678901', 'buyer', 'active', 'https://api.dicebear.com/7.x/adventurer/svg?seed=emeka')
ON CONFLICT (id) DO NOTHING;

INSERT INTO buyers (user_id, delivery_address, state, balance) VALUES
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Flat 4B, Pine Court, Lekki Phase 1', 'Lagos', 50000.00)
ON CONFLICT (user_id) DO NOTHING;

-- Delivery Partner 1
INSERT INTO users (id, email, password_hash, full_name, phone_number, role, status, avatar_url) VALUES
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'delivery.tunde@agrein.com', '$2a$10$pLwWn9Bv6g5KkFqT6.P8e.56b/8RkP9c9WjS7Xyq2zVlU3.2n21f.', 'Tunde Alao', '+2348056789012', 'delivery_partner', 'active', 'https://api.dicebear.com/7.x/adventurer/svg?seed=tunde')
ON CONFLICT (id) DO NOTHING;

-- Insert Mock Products for Farmer Kole (Approved)
-- Product 1: Grains (Rice)
INSERT INTO products (id, farmer_id, name, description, category_id, price, quantity, quantity_unit, availability_status, delivery_estimate, rating, image_urls) VALUES
('f01ebc99-9c0b-4ef8-bb6d-6bb9bd380f11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Local Stone-Free Rice (Ofada)', 'Premium quality local Ofada rice. Grown and processed in Ikorodu. Hand-sorted, 100% stone-free, rich in nutrients, and delicious.', 3, 25000.00, 50.00, 'bags', 'in_stock', '1-2 days', 4.7, ARRAY['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600'])
ON CONFLICT (id) DO NOTHING;

-- Product 2: Vegetables (Tomatoes)
INSERT INTO products (id, farmer_id, name, description, category_id, price, quantity, quantity_unit, availability_status, delivery_estimate, rating, image_urls) VALUES
('f02ebc99-9c0b-4ef8-bb6d-6bb9bd380f22', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Fresh Roma Tomatoes (Crate)', 'A basket/crate of fresh, firm, and fully ripe red Roma tomatoes. Excellent for stews, sauces, and salads. Directly harvested on order day.', 2, 12000.00, 20.00, 'crates', 'in_stock', 'Same day', 4.9, ARRAY['https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600'])
ON CONFLICT (id) DO NOTHING;

-- Product 3: Fruits (Sweet Oranges)
INSERT INTO products (id, farmer_id, name, description, category_id, price, quantity, quantity_unit, availability_status, delivery_estimate, rating, image_urls) VALUES
('f03ebc99-9c0b-4ef8-bb6d-6bb9bd380f33', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Sweet Seedless Oranges (Bag)', 'Bag of naturally sweetened seedless oranges. Juicy and loaded with Vitamin C. Cleaned and packed.', 1, 8000.00, 35.00, 'bags', 'in_stock', '1-2 days', 4.5, ARRAY['https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=600'])
ON CONFLICT (id) DO NOTHING;

-- Product 4: Livestock (Goat)
INSERT INTO products (id, farmer_id, name, description, category_id, price, quantity, quantity_unit, availability_status, delivery_estimate, rating, image_urls) VALUES
('f04ebc99-9c0b-4ef8-bb6d-6bb9bd380f44', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Healthy Male Goat (Medium)', 'Medium-sized healthy male goat. Vaccinated and pasture-fed. Weight approx. 20kg. Suitable for ceremonies or direct meat processing.', 4, 35000.00, 10.00, 'pieces', 'in_stock', '2-3 days', 4.8, ARRAY['https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&q=80&w=600'])
ON CONFLICT (id) DO NOTHING;

-- Insert Mock Reviews
INSERT INTO reviews (id, product_id, reviewer_id, rating, comment) VALUES
('e01ebc99-9c0b-4ef8-bb6d-6bb9bd380e11', 'f02ebc99-9c0b-4ef8-bb6d-6bb9bd380f22', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 5, 'Super fresh tomatoes! Will definitely buy again.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, product_id, reviewer_id, rating, comment) VALUES
('e02ebc99-9c0b-4ef8-bb6d-6bb9bd380e22', 'f01ebc99-9c0b-4ef8-bb6d-6bb9bd380f11', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 4, 'Very clean rice. Found no stones at all. Good texture when cooked.')
ON CONFLICT (id) DO NOTHING;

-- Insert Mock Notifications
INSERT INTO notifications (id, user_id, title, message, is_read) VALUES
('de1ebc99-9c0b-4ef8-bb6d-6bb9bd380d11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Welcome to Agrein!', 'Your farmer account has been approved. You can now start listing products and earning.', false)
ON CONFLICT (id) DO NOTHING;
