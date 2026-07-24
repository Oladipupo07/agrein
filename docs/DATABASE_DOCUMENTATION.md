# Database Documentation & ERD Specification

Database Engine: **PostgreSQL 14+ / Supabase**
Schema Migration File: `supabase/schema.sql`

## Core Tables

| Table Name | Primary Purpose | Key Foreign Keys |
| :--- | :--- | :--- |
| `users` | Base identity table for all platform roles | N/A |
| `farmers` | Profile extension for farmers & farm verification | `user_id` -> `users.id` |
| `buyers` | Profile extension for corporate/individual buyers | `user_id` -> `users.id` |
| `products` | Produce catalog listings with stock & QR traceability | `farmer_id`, `category_id` |
| `traceability_logs` | Farm-to-Table QR audit trail | `product_id` -> `products.id` |
| `orders` | Sales orders & delivery status | `buyer_id` -> `buyers.id` |
| `escrow_transactions` | Interswitch payment hold ledger | `order_id`, `buyer_id`, `farmer_id` |
| `wallets` | User available & escrow balances | `user_id` -> `users.id` |
| `wallet_transactions` | Double-entry ledger for funding & payouts | `wallet_id` -> `wallets.id` |
| `rfqs` | Reverse marketplace demand requests | `buyer_id` -> `buyers.id` |
| `rfq_bids` | Farmer bids submitted for RFQ contracts | `rfq_id`, `farmer_id` |
| `commodity_prices` | Regional market price indices | N/A |
| `cooperatives` | Farmer cooperative societies | `leader_user_id` -> `users.id` |
