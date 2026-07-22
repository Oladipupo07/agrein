# Agrein - Production Digital Agricultural Marketplace Platform

> *"Connecting Farmers to Buyers, One Harvest at a Time."*

Agrein is a modern, enterprise-grade digital agriculture marketplace ecosystem designed to directly connect smallholder farmers with buyers (food processors, wholesalers, supermarkets, hotels, and consumers) across Nigeria and Africa.

The platform eliminates predatory intermediate middlemen, enabling farmers to retain **95% of their harvest profits** while offering buyers direct access to verified, fresh, and affordable agricultural produce.

---

## 📑 Table of Contents

- [Executive Summary & Features](#-executive-summary--features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Local Quickstart & Operation](#-local-quickstart--operation)
- [Supabase Setup & Database Integration Guide](#-supabase-setup--database-integration-guide)
- [Interswitch Payment Gateway Integration Guide](#-interswitch-payment-gateway-integration-guide)
- [Ecosystem Modules & Routes](#-ecosystem-modules--routes)
- [Environment Variables Reference](#-environment-variables-reference)
- [Pre-seeded Test Accounts](#-pre-seeded-test-accounts)
- [Senior Developer Audit & Security Architecture](#-senior-developer-audit--security-architecture)
- [Production Deployment Guide](#-production-deployment-guide)

---

## 🚀 Executive Summary & Features

- **Direct Farmer-to-Buyer Marketplace:** Connects rural producers directly with individual and bulk corporate buyers.
- **5% Escrow Payout Model:** Holds buyer checkout payments safely in escrow until physical delivery sign-off, releasing 95% to the farmer and retaining a 5% platform fee.
- **Interswitch Webpay Integration:** Secure card, USSD, and bank transfer payments via Interswitch Webpay gateway with server-side transaction requery.
- **B2B Bulk RFQ Portal:** Bulk procurement request portal allowing buyers to post large order demands and receive competitive farmer bids.
- **AgriBot AI Assistant:** AI-powered farming advisor for crop diagnostics, price forecasting, weather advisory, and export guidance.
- **Farm-to-Table Traceability:** Unique batch QR codes tracking products through planting, harvest, quality checks, cold chain storage, and transit.
- **Digital Wallet (`AgreinPay`):** Wallet engine with real-time balance tracking, escrow visibility, and instant bank withdrawals.
- **Farmer Verification System:** Multi-tier trust score engine verifying NIN, BVN, farm geolocations, and government certificates.
- **Global Export Marketplace:** Dedicated export listings linking Grade A commodities (Sesame, Cocoa, Cashew, Ginger) to international importers.
- **Farmer Cooperatives Network:** Directory enabling farmers to aggregate harvests for bulk pricing and shared logistics.
- **AgriFarm Academy & Community Forum:** Course learning management system and 50k+ farmer community discussion board.

---

## 🏗️ Architecture & Tech Stack

```
agrein/
├── client/                      # React 18 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/          # Navbar (Mega Menu), Footer, Interswitch Modal, AgriBot, Weather Widget
│   │   ├── pages/               # Marketplace, RFQ, Wallet, Subscriptions, Traceability, Forum, Dashboards
│   │   ├── layouts/             # DashboardLayout & PublicLayout wrappers
│   │   ├── hooks/               # useAuth, useCart state management
│   │   └── services/            # Axios API wrappers (api.ts)
│   ├── index.html
│   └── vite.config.ts
│
├── server/                      # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/         # Logic handlers for auth, products, orders, payments
│   │   ├── routes/              # Express API namespaces (15+ routes)
│   │   ├── services/            # db.ts (Pg Pool client with memory DB fallback)
│   │   ├── config.ts            # Environment variables loader
│   │   └── index.ts             # Express server entry point
│   └── tsconfig.json
│
└── database/                    # PostgreSQL Schemas & Seed Data
    ├── schema.sql               # Full DDL table definitions with foreign keys & indexes
    └── seed.sql                 # Sample categories, users, products, and reviews
```

### Stack Overview
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide Icons, Framer Motion, TanStack Query, Recharts.
- **Backend:** Node.js, Express.js, TypeScript, JWT (`jsonwebtoken`), Bcrypt (`bcryptjs`), CORS.
- **Database:** PostgreSQL (Supabase / Neon / AWS RDS) + automatic zero-setup in-memory fallback.
- **Payments:** Interswitch Webpay Gateway (Inline & Server-to-Server Requery API).

---

## 💻 Local Quickstart & Operation

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **NPM** (v9.0.0 or higher) or Yarn / PNPM

### Step 1: Clone and Install Dependencies
```bash
# Navigate to project root
cd agrein

# Install root orchestrator and subproject dependencies
npm run install:all
```

### Step 2: Configure Environment Files
Copy the template `.env.example` files to `.env`:

```bash
# Server environment file
cp server/.env.example server/.env

# Client environment file
cp client/.env.example client/.env
```

### Step 3: Run Development Servers
Start both the Express API server (`http://localhost:5000`) and the Vite React frontend (`http://localhost:5173`) in parallel:

```bash
npm run dev
```

Visit **`http://localhost:5173`** in your browser to access Agrein!

---

## 🗄️ Supabase Setup & Database Integration Guide

Agrein is engineered to work seamlessly with **Supabase PostgreSQL** in production while gracefully falling back to a pre-seeded mock database during local prototyping if `DATABASE_URL` is omitted.

### Step-by-Step Supabase Setup

1. **Create a Supabase Account & Project:**
   - Go to [https://supabase.com](https://supabase.com) and click **Start your project**.
   - Create a new organization and project named **`agrein-production`**.
   - Set a strong database password and select a cloud region close to your primary users (e.g., *EU West / London* or *South Africa*).

2. **Execute Database Schema & Seed Scripts:**
   - In your Supabase Dashboard, click on **SQL Editor** from the left navigation sidebar.
   - Click **New Query**, open `database/schema.sql` from this codebase, paste the full content into the editor, and click **Run**.
   - Next, create another query, paste the content of `database/seed.sql`, and click **Run** to populate categories, test users, products, and reviews.

3. **Retrieve Database Connection String:**
   - Go to **Project Settings** -> **Database**.
   - Under **Connection string**, select **URI**.
   - Copy the string format:
     ```text
     postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
     ```
   - Replace `[YOUR-PASSWORD]` with your actual database password.

4. **Retrieve Supabase API Credentials:**
   - Go to **Project Settings** -> **API**.
   - Copy your **Project URL** (`https://[PROJECT-REF].supabase.co`).
   - Copy the **`anon` public key** and **`service_role` secret key**.

5. **Connect to Agrein Server:**
   Paste your database URI into `server/.env`:
   ```env
   DATABASE_URL=postgresql://postgres:YourPassword@db.ref.supabase.co:5432/postgres
   SUPABASE_URL=https://ref.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
   ```

*Note: Agrein's database client (`server/src/services/db.ts`) automatically configures SSL connection parameters (`rejectUnauthorized: false`) when it detects a Supabase connection URL.*

---

## 💳 Interswitch Payment Gateway Integration Guide

Agrein integrates with **Interswitch Webpay** to provide card payments (Verve, Mastercard, Visa), Paycode, and USSD transfers.

### Step 1: Obtain Interswitch Merchant Account
1. Register a merchant account on the **Quickteller Business Portal** at [https://quicktellerbusiness.com/](https://quicktellerbusiness.com/).
2. Complete business KYC verification (CAC documentation, bank account details).
3. Log into the **Quickteller Business Dashboard** -> **Developer Tools** -> **API Keys**.

### Step 2: Retrieve API Keys & Merchant Identifiers
Collect the following credentials from your portal:
- **Merchant Code (`merchant_code`):** Your unique merchant ID (e.g., `MX2609` for test sandbox).
- **Pay Item ID (`pay_item_id`):** Identifies the specific service/product collection item (e.g., `10101`).
- **Secret Key (`secret_key`):** SHA-512 signing key used for transaction requery requests.
- **Client ID & Client Secret:** Used for OAuth 2.0 token requests.

### Step 3: Interswitch Sandbox vs Production URLs

| Environment | Inline JS Script URL | Transaction Requery API URL |
| :--- | :--- | :--- |
| **Sandbox (Testing)** | `https://qa.interswitchng.com/collections/w/inline` | `https://qa.interswitchng.com/collections/api/v2/gettransaction.json` |
| **Production** | `https://newwebpay.interswitchng.com/inline-pay.js` | `https://newwebpay.interswitchng.com/collections/api/v2/gettransaction.json` |

### Step 4: Configure Agrein Environment Variables
Update your environment files with your Interswitch credentials:

**In `server/.env`:**
```env
INTERSWITCH_MERCHANT_CODE=MX2609
INTERSWITCH_PAY_ITEM_ID=10101
INTERSWITCH_SECRET_KEY=your_interswitch_secret_key
INTERSWITCH_CLIENT_ID=your_client_id
INTERSWITCH_ENV=sandbox
```

**In `client/.env`:**
```env
VITE_INTERSWITCH_MERCHANT_CODE=MX2609
VITE_INTERSWITCH_PAY_ITEM_ID=10101
VITE_INTERSWITCH_ENV=sandbox
```

### Step 5: Test Cards for Interswitch Sandbox
Use the following test card numbers in the sandbox environment:

| Card Brand | Test Card Number | Expiry | CVV | PIN |
| :--- | :--- | :--- | :--- | :--- |
| **Verve** | `5061 0000 0000 0001` | `12/28` | `123` | `1111` |
| **Mastercard** | `5123 4500 0000 0008` | `10/27` | `456` | `2222` |
| **Visa** | `4111 1111 1111 1111` | `08/26` | `789` | `3333` |

### Step 6: Transaction Requery Flow
1. The buyer initiates payment on checkout.
2. The frontend triggers Interswitch inline checkout modal with `merchant_code`, `pay_item_id`, `amount`, and a unique transaction reference (e.g., `AGR-PAY-1721649200-842`).
3. Upon completion, the client calls `POST /api/payments/verify` with the transaction reference.
4. The server queries Interswitch Requery API using SHA-512 hashed signature (`txnref + amount + merchant_code + secret_key`).
5. On HTTP `00` response code (Success), the server updates order status to `paid`, creates a transaction audit record, and holds funds in escrow.

---

## 🌐 Ecosystem Modules & Routes

| Route | Page Component | Feature Description |
| :--- | :--- | :--- |
| `/` | `Home.tsx` | Landing page with Hero, Stats, Ticker, Weather Widget, Testimonials |
| `/products` | `Products.tsx` | Marketplace catalog with search, category & state filters |
| `/products/:id` | `ProductDetail.tsx` | Detailed product listing with reviews & farmer profile |
| `/rfq` | `RfqPortal.tsx` | B2B bulk request for quotation portal with farmer bidding |
| `/verification` | `VerificationCenter.tsx` | Farmer verification portal (NIN/BVN/Farm coordinates) |
| `/cooperatives` | `CooperativesPage.tsx` | Cooperative group directory for joint pooling & transport |
| `/market-intelligence` | `MarketIntelligencePage.tsx` | AI commodity spot prices and 30-day forecast engine |
| `/wallet` | `WalletPage.tsx` | AgreinPay digital wallet with deposit & withdrawal flows |
| `/subscriptions` | `SubscriptionPage.tsx` | Tiered pricing plans (*Starter*, *Pro Farmer*, *Export Elite*) |
| `/learning` | `LearningCenterPage.tsx` | AgriFarm Academy course hub with progress tracking |
| `/export` | `ExportMarketplacePage.tsx` | Global commodity export marketplace with certifications |
| `/community` | `CommunityForumPage.tsx` | 50K+ farmer discussion forum with tags & likes |
| `/traceability` | `TraceabilityPage.tsx` | Farm-to-table batch QR lookup & timeline tracking |
| `/agribot` | `AiAssistantPage.tsx` | Interactive AgriBot AI farming chat advisor |
| `/dashboard/farmer` | `FarmerDashboard.tsx` | Farmer management portal (revenue, listings, orders) |
| `/dashboard/buyer` | `BuyerDashboard.tsx` | Buyer purchase portal (cart, checkout, tracking, reviews) |
| `/dashboard/admin` | `AdminDashboard.tsx` | Admin control panel (farmer approvals, platform metrics) |
| `/dashboard/delivery` | `DeliveryDashboard.tsx` | Rider portal (assigned dispatches, status updates) |

---

## 🔐 Environment Variables Reference

### `server/.env`
```env
JWT_SECRET=agrein_super_secret_jwt_key_production_2026
PORT=5000
DATABASE_URL=postgresql://postgres:password@db.ref.supabase.co:5432/postgres
SUPABASE_URL=https://ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
INTERSWITCH_MERCHANT_CODE=MX2609
INTERSWITCH_PAY_ITEM_ID=10101
INTERSWITCH_SECRET_KEY=your_interswitch_secret_key
INTERSWITCH_ENV=sandbox
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### `client/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_INTERSWITCH_MERCHANT_CODE=MX2609
VITE_INTERSWITCH_PAY_ITEM_ID=10101
VITE_INTERSWITCH_ENV=sandbox
VITE_SUPABASE_URL=https://ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🔑 Pre-seeded Test Accounts

All pre-seeded test accounts use the common password: **`password123`**

| Role | Email | Name | Default State |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@agrein.com` | Chidi Egwu | Platform Management |
| **Farmer** | `farmer.kole@agrein.com` | Kole Adebayo | Oyo State (Vegetables/Grains) |
| **Farmer** | `farmer.fatima@agrein.com` | Fatima Bello | Kano State (Cereals/Legumes) |
| **Buyer** | `buyer.emeka@agrein.com` | Emeka Okafor | Lagos State |
| **Delivery Rider** | `delivery.tunde@agrein.com` | Tunde Bakare | Lagos / West Region |

---

## 👨‍💻 Senior Developer Audit & Security Architecture

1. **Authentication & Password Hashing:**
   - Password hashing via `bcryptjs` with salt rounds set to `10`.
   - Stateless JWT authentication tokens with signature verification in Express middleware (`server/src/middleware/auth.ts`).

2. **Escrow Commission Protection:**
   - Transaction fees enforced at controller level: 95% credited to farmer balance, 5% retained in platform escrow.
   - Withdrawal requests verified against available balance before payout dispatches.

3. **Graceful Database Resilience:**
   - `server/src/services/db.ts` uses PostgreSQL connection pooling with automatic SSL fallback.
   - If `DATABASE_URL` is missing during local evaluation, the application seamlessly uses an in-memory mock database pre-populated with identical schemas and relationships.

4. **Performance & Lazy Loading:**
   - React SPA components are code-split using `React.lazy` and `Suspense` loaders to minimize initial JS bundle size.
   - Axios interceptors handle automatic `Authorization: Bearer <token>` injection and response error normalization.

---

## 📦 Production Deployment Guide

For a complete step-by-step walkthrough on deploying **Agrein** for free using **Vercel**, **Render**, and **Supabase**, refer to our dedicated guide:

👉 **[Complete Cloud Deployment Guide (Vercel + Render + Supabase)](file:///c:/Users/akobe/Documents/Project/agrein/DEPLOYMENT.md)**

### Summary Stack Configuration:
- **Frontend (Vercel):** Root directory `client`, Build command `npm run build`, Output `dist`, Env `VITE_API_URL`.
- **Backend (Render):** Root directory `server`, Build command `npm run build`, Start command `node dist/index.js`, Env `DATABASE_URL`, `JWT_SECRET`.
- **Database (Supabase):** PostgreSQL database. Run [database/schema.sql](file:///c:/Users/akobe/Documents/Project/agrein/database/schema.sql) followed by [database/seed.sql](file:///c:/Users/akobe/Documents/Project/agrein/database/seed.sql) in SQL Editor.

---

*Made with ❤️ for African Agriculture. Powered by Agrein Technologies.*
