# Agrein 🌾

> **Connecting Farmers to Buyers, One Harvest at a Time.**

Agrein is an enterprise-grade full-stack agricultural marketplace platform engineered to streamline direct farm-to-market trade across Nigeria. By bridging smallholder farmers, bulk aggregators, corporate buyers, and logistics providers, Agrein solves structural supply chain inefficiencies through verified farmer profiles, escrow-secured payments, transparent batch traceability, and AI-driven market intelligence.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [🌾 Farmer Experience](#-farmer-experience)
  - [🛒 Buyer & Consumer Experience](#-buyer--consumer-experience)
  - [🛡️ Admin & Moderation Console](#️-admin--moderation-console)
  - [🤖 AI & Agro-Intelligence Modules](#-ai--agro-intelligence-modules)
  - [📦 Ecosystem & Value-Chain Tools](#-ecosystem--value-chain-tools)
- [Technology Stack](#technology-stack)
- [Project Architecture & Structure](#project-architecture--structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Authentication & Role Management](#authentication--role-management)
- [Farmer Verification & Escrow Lifecycle](#farmer-verification--escrow-lifecycle)
- [PWA & Offline Capabilities](#pwa--offline-capabilities)
- [Deployment](#deployment)
- [License](#license)

---

## 🌟 Overview

Agrein combines a high-performance Single Page Application (SPA) with a resilient Node.js/Express backend, Supabase/PostgreSQL persistence, and live payment processing.

- **Direct Trade**: Eliminates exploitative middlemen by allowing farmers to list produce directly at fair market prices.
- **Trust & Verification**: Multi-step farmer onboarding with identity verification (NIN/BVN), farm geo-tagging, document review, and dynamic trust scoring.
- **Escrow-Secured Payments**: Integration with Interswitch Web Checkout holding funds securely until buyer confirmation or dispute resolution.
- **Data-Driven Farming**: AI price forecasting, agronomy disease diagnosis, real-time weather analytics, and commodity index tracking.
- **End-to-End Traceability**: Batch QR code generation enabling buyers to trace farm origin, harvest dates, and logistics milestones.

---

## ✨ Key Features

### 🌾 Farmer Experience
- **Tiered Onboarding & Identity Vetting**: Guided multi-step verification uploading farm proof, certificates, NIN, and GPS location.
- **Real-Time Verification Tracking**: Instant status polling, pending review alerts, request-for-changes notifications, and appeal workflows.
- **Produce & Catalog Management**: Create, update, and manage inventory with unit pricing, minimum order quantities (MOQ), harvest dates, and image galleries.
- **Sales & Earnings Dashboard**: Monitor revenue, pending payouts, order fulfillment statuses, and customer reviews.
- **Farmer Trust Score & Badges**: Dynamic credibility rating calculated from order fulfillment rates, verification tier, and buyer feedback.
- **Reverse RFQ Bidding**: Bid on bulk buyer requests and negotiate wholesale contracts.

### 🛒 Buyer & Consumer Experience
- **Interactive Marketplace Catalog**: Instant full-text search, multi-category filters (Cereals, Tubers, Fruits, Vegetables, Livestock), and state-level location filtering.
- **Cart & Seamless Checkout**: Multiple payment methods with integrated Interswitch redirect checkout and digital wallet deductions.
- **Order Tracking & Digital Invoicing**: Track order milestones from farm packing to final dispatch.
- **Buyer Dispute Management**: Open formal disputes for damaged or delayed shipments with admin escalation.
- **Wishlist & Farm Following**: Bookmark favorite items and receive alerts for fresh harvests from trusted farms.

### 🛡️ Admin & Moderation Console
- **Farmer Verification Dossier**: Comprehensive inspection tool to review KYC documents, verify farmland details, approve, reject, or request document updates.
- **User Directory & Account Controls**: Search, filter by role (`BUYER`, `FARMER`, `ADMIN`), block/unblock malicious actors, and manually update verification states.
- **Account Deletion Queue**: Review and process account deletion and GDPR compliance requests.
- **Dispute Resolution Suite**: Mediate buyer-farmer escrow disputes, initiate full/partial refunds, or release payouts to farmers.
- **Platform Analytics & GMV Metrics**: Real-time 30-day Gross Merchandise Value (GMV), active user counts, and transaction volume trends.

### 🤖 AI & Agro-Intelligence Modules
- **AI Price Predictor**: Machine learning trend projections predicting seasonal price fluctuations across major Nigerian commodity hubs.
- **AgroDoctor AI**: Computer vision-ready crop health diagnostic assistant recommending immediate remedial treatments for pest and disease outbreaks.
- **AI Customer Support Bot**: 24/7 automated assistant addressing platform queries, shipping rules, and transaction questions.

### 📦 Ecosystem & Value-Chain Tools
- **Smart Logistics**: Integrated fleet partners with automatic freight rate calculators and shipment tracking.
- **Cooperative Marketplace**: Form agricultural cooperatives, pool produce for bulk export, and share logistical costs.
- **Traceability & QR Batches**: Cryptographically verifiable batch traces for food safety compliance.
- **Commodity Price Index & Weather Dashboard**: Live mandi/market rates and microclimate forecasts for agricultural planning.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | HTML5, Modern ES6+ JavaScript, Tailwind CSS | Modular component-driven Single Page Application |
| **Styling & Assets** | Tailwind CSS CLI, PostCSS, Autoprefixer | Production minified utility styling and responsive layout |
| **Backend API** | Node.js (>= 18.0.0), Express 4.x | RESTful API with route modularity, security middlewares, and validation |
| **Database** | PostgreSQL, Supabase | Relational data store, Realtime subscriptions, and Row Level Security (RLS) |
| **Authentication** | JSON Web Tokens (JWT), Argon2/PBKDF2 Hashing | Secure JWT session management with email OTP verification |
| **Email Service** | Brevo (Sendinblue) API & SMTP Fallback | Transactional emails for OTPs, onboarding updates, and order confirmations |
| **Payments** | Interswitch Web Checkout, Paystack Hooks | Direct bank card, USSD, and QR payments with server-to-server signature validation |
| **PWA & Storage** | Service Workers, Cache Storage API, LocalStorage | Progressive Web App with offline asset caching and install prompts |
| **Deployment** | Render (`render.yaml`) | Production container orchestration with auto-deploy configuration |

---

## 📂 Project Architecture & Structure

```bash
agrein/
├── client/                     # Frontend modular UI components & state
│   ├── components/             # 40+ UI screens, dashboards, modals & widgets
│   │   ├── AccountSettings.js
│   │   ├── AdminDashboard.js
│   │   ├── AdminReviewScreen.js
│   │   ├── AgroDoctorAI.js
│   │   ├── AIPredictor.js
│   │   ├── AuthModal.js
│   │   ├── BuyerDashboard.js
│   │   ├── CheckoutModal.js
│   │   ├── FarmerDashboard.js
│   │   ├── FarmerVerificationView.js
│   │   ├── Navbar.js
│   │   ├── ProductCatalog.js
│   │   ├── SmartLogistics.js
│   │   ├── SuspendedAccountView.js
│   │   ├── TraceabilityModal.js
│   │   └── ...
│   ├── data/
│   │   └── mockData.js         # Fallback and demo mock datasets
│   └── utils/
│       ├── realtime.js         # Supabase real-time event listeners
│       ├── storageManager.js   # Local storage and state synchronization
│       └── supabaseClient.js   # Client-side Supabase SDK instance
├── database/                   # Database schemas and migrations
│   ├── schema.sql              # Master PostgreSQL & Supabase database schema
│   └── fix_permissions.sql     # RLS policies and permission grants
├── public/                     # Compiled production assets
│   └── styles.css              # Output compiled Tailwind CSS bundle
├── server/                     # Node.js / Express backend
│   ├── controllers/            # Controller handlers for all API resources
│   │   ├── aiController.js
│   │   ├── aiDoctorController.js
│   │   ├── aiSupportController.js
│   │   ├── authController.js
│   │   ├── cooperativeController.js
│   │   ├── disputeController.js
│   │   ├── farmController.js
│   │   ├── logisticsController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── rfqController.js
│   │   ├── traceabilityController.js
│   │   ├── verificationController.js
│   │   └── walletController.js
│   ├── middleware/             # Auth token validation and role guards
│   │   └── auth.js
│   ├── routes/                 # Express route definitions
│   │   └── api.js
│   ├── scripts/                # Database backfill & migration scripts
│   │   ├── backfillUsersToSupabase.js
│   │   └── migratePasswordsToSupabase.js
│   ├── tests/                  # Integration & payment redirect test suites
│   ├── utils/                  # Payment gateways, mailer, password helpers
│   │   ├── interswitch.js
│   │   ├── mailer.js
│   │   ├── otpService.js
│   │   ├── passwordService.js
│   │   ├── paystack.js
│   │   ├── supabaseClient.js
│   │   └── userDatabase.js
│   ├── .env.example            # Backend environment template
│   ├── index.js                # Express server entry point
│   └── package.json            # Backend package manifest
├── src/                        # CSS source files
│   ├── custom.css
│   └── tailwind.css
├── app.js                      # Main frontend orchestrator & SPA router
├── index.html                  # Main SPA entry point
├── manifest.json               # Web app manifest for PWA installation
├── package.json                # Root package manifest & workspace scripts
├── postcss.config.js           # PostCSS configuration
├── render.yaml                 # Render cloud deployment blueprint
├── robots.txt                  # Search engine crawl directives
├── server.ps1                  # Lightweight PowerShell local static preview server
├── sitemap.xml                 # SEO sitemap index
├── sw.js                       # Service Worker for offline asset caching
└── tailwind.config.js          # Tailwind CSS theme configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Supabase Account**: (Optional for basic local demo mode; required for live database persistence, RLS, and auth)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Oladipupo07/agrein.git
   cd agrein
   ```

2. **Install root and backend dependencies:**
   ```bash
   npm install
   ```
   *(The root `postinstall` script automatically installs server dependencies inside `server/`)*

### Environment Configuration

Create a `.env` file inside the `server/` directory:

```bash
cp server/.env.example server/.env
```

Populate `server/.env` with your credentials:

```env
# ─── Runtime ───
PORT=5000
NODE_ENV=development

# ─── Authentication ───
JWT_SECRET=your_super_secret_jwt_key_here

# ─── Supabase / PostgreSQL ───
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@YOUR_PROJECT.supabase.co:5432/postgres
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

# ─── Interswitch Web Checkout (Payments) ───
INTERSWITCH_ENV=sandbox
INTERSWITCH_MERCHANT_CODE=MX_YOUR_MERCHANT_CODE
INTERSWITCH_PAY_ITEM_ID=YOUR_PAY_ITEM_ID
INTERSWITCH_CLIENT_ID=IKIA_YOUR_CLIENT_ID
INTERSWITCH_SECRET_KEY=YOUR_SECRET_KEY

# ─── Public Site URL ───
APP_URL=http://localhost:5000

# ─── Brevo Transactional Email ───
BREVO_API_KEY=xkeysib-YOUR_BREVO_KEY
MAIL_FROM_ADDRESS=no-reply@agrein.market
MAIL_FROM_NAME="Agrein Marketplace"
```

### Database Setup

1. Open your Supabase SQL Editor.
2. Run the SQL statements found in `database/schema.sql`.
3. If setting up permissions or updating schema policies, execute `database/fix_permissions.sql`.

### Running the Application

1. **Compile Tailwind CSS:**
   ```bash
   npm run build
   ```

2. **Start the development server with live reload:**
   ```bash
   cd server
   npm run dev
   ```

3. **Or run production server from root:**
   ```bash
   npm start
   ```

4. **Access the application:**
   Open [http://localhost:5000](http://localhost:5000) in your web browser.

---

## 📜 Available Scripts

### Root Directory (`/`)
- `npm install` - Installs root dependencies and triggers server dependency installation.
- `npm run build` - Compiles and minifies Tailwind CSS to `public/styles.css`.
- `npm start` - Starts the backend server located in `server/index.js`.

### Server Directory (`/server`)
- `npm run dev` - Launches backend server with `nodemon` for auto-reloading during development.
- `npm run build:css` - Direct Tailwind CSS compilation.
- `npm test` - Executes the Interswitch redirect and payment integration test suite.

---

## 📡 API Reference

All API routes are served under `/api`.

### 🔐 Authentication & Accounts (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (`BUYER` or `FARMER`) & send OTP | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `POST` | `/api/auth/verify-otp` | Verify email OTP code | No |
| `POST` | `/api/auth/resend-otp` | Resend verification OTP code | No |
| `POST` | `/api/auth/forgot-password` | Send password reset OTP | No |
| `POST` | `/api/auth/reset-password` | Reset password using OTP | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `PUT` | `/api/auth/profile` | Update user profile information | Yes |
| `POST` | `/api/auth/change-password` | Change account password | Yes |
| `POST` | `/api/auth/request-deletion` | Queue account for deletion | Yes |
| `POST` | `/api/auth/cancel-deletion` | Cancel pending deletion request | Yes |

### 🌾 Farmer & Verification (`/api/farmers`, `/api/verification`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/farmers/verification` | Fetch farmer's verification dossier | Yes |
| `POST` | `/api/farmers/verification` | Submit verification details and documents | Yes |
| `PUT` | `/api/farmers/verification` | Re-submit verification after changes requested | Yes |
| `POST` | `/api/farmers/documents` | Upload KYC identity and farmland documents | Yes |
| `GET` | `/api/farmers/verification/status` | Get current verification status | Yes |
| `GET` | `/api/farmers/verification-status-public`| Public status polling by email | No |
| `GET` | `/api/farmers/trust-score` | Get farmer trust rating and review counts | Yes |

### 🛡️ Admin Moderation (`/api/admin`)
| Method | Endpoint | Description | Roles |
|---|---|---|---|
| `GET` | `/api/admin/users` | List all registered users with role & status filters | `ADMIN` |
| `POST` | `/api/admin/users/:id/toggle-block` | Block or unblock a user account | `ADMIN` |
| `POST` | `/api/admin/users/update-verification` | Manually update user verification status | `ADMIN` |
| `POST` | `/api/admin/users/create-admin` | Provision a new administrative user | `ADMIN` |
| `GET` | `/api/admin/farmer-verifications` | Get list of pending farmer verification dossiers | `ADMIN` |
| `GET` | `/api/admin/farmer-verifications/:id`| Retrieve full farmer verification dossier | `ADMIN` |
| `POST` | `/api/admin/farmer-verifications/:id/approve` | Approve farmer verification | `ADMIN` |
| `POST` | `/api/admin/farmer-verifications/:id/reject` | Reject farmer verification | `ADMIN` |
| `POST` | `/api/admin/farmer-verifications/:id/request-changes` | Request document modifications from farmer | `ADMIN` |
| `POST` | `/api/admin/farmers/:id/suspend` | Suspend a farmer account | `ADMIN` |
| `POST` | `/api/admin/farmers/:id/reinstate` | Reinstate a suspended farmer | `ADMIN` |
| `GET` | `/api/admin/deletion-requests` | View pending account deletion queue | `ADMIN` |
| `POST` | `/api/admin/deletion-requests/:id/resolve` | Approve/process deletion request | `ADMIN` |
| `GET` | `/api/admin/metrics/gmv` | Retrieve 30-day Gross Merchandise Value | `ADMIN` |

### 🍎 Products & Orders (`/api/products`, `/api/orders`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/products` | Retrieve active product catalog with filters | No |
| `GET` | `/api/products/:id` | Get details for a single product | No |
| `POST` | `/api/products` | Create a new product listing | Approved `FARMER` |
| `PUT` | `/api/products/:id` | Update product details | Approved `FARMER` |
| `DELETE` | `/api/products/:id` | Delete product listing | Approved `FARMER` |
| `POST` | `/api/orders` | Create an order and initialize Interswitch checkout | Yes |
| `POST` | `/api/orders/payment-response` | Webhook / redirect callback for payment confirmation | No |
| `GET` | `/api/orders/verify/:reference/:amount` | Query and verify transaction status | No |
| `GET` | `/api/orders/list` | List user's placed or received orders | Yes |

### 🤖 AI, Support & Ecosystem
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/predict-price` | Predict agricultural commodity price trends |
| `POST` | `/api/ai/diagnose-crop` | AgroDoctor crop disease detection and remedies |
| `POST` | `/api/support/chat` | AI Support Bot interactive inquiry handling |
| `GET` | `/api/support/suggestions` | Suggested prompt queries for quick support |
| `GET` | `/api/logistics/partners` | List verified logistics and freight operators |
| `POST` | `/api/logistics/calculate-cost` | Calculate estimated shipping cost by weight and state |
| `GET` | `/api/cooperatives` | Explore agricultural cooperatives |
| `GET` | `/api/traceability/:batchId` | Retrieve full provenance trace for produce batch |

---

## 🔒 Farmer Verification & Escrow Lifecycle

```
[Farmer Signs Up] ──> [Uploads NIN / Farm Proof] ──> [Status: PENDING]
                                                          │
                    ┌─────────────────────────────────────┴─────────────────────────────────────┐
                    ▼                                     ▼                                     ▼
          [Admin Requests Changes]               [Admin Approves Farmer]               [Admin Rejects Application]
                    │                                     │                                     │
                    ▼                                     ▼                                     ▼
        [Farmer Updates Documents]              [Can List Produce & Sell]             [Not Allowed to Sell]
```

1. **Farmer Onboarding**: Farmers complete a multi-step profile submission including government ID (NIN), farmland coordinates, photos, and cooperative affiliations.
2. **Admin Review**: Dedicated verification screens display the dossier, allowing administrators to inspect proof, verify location validity, and take action.
3. **Escrow Trade Flow**: When a buyer places an order, funds are deposited into escrow. The farmer fulfills and ships the order; once delivery is validated by the buyer or tracking milestone, escrow funds are credited to the farmer's digital wallet.

---

## 📱 PWA & Offline Capabilities

Agrein is configured as an installable Progressive Web Application (PWA):
- **Web App Manifest (`manifest.json`)**: Configures display modes, brand theme colors (`#15803d`), and app icons.
- **Service Worker (`sw.js`)**: Caches static assets, CSS stylesheets, and core navigation routes to provide fast reload times and offline resilience.
- **In-App Install Banner (`PwaInstallBanner.js`)**: Detects browser install eligibility and presents native prompts.
- **Service Worker Update Toast (`SwUpdateToast.js`)**: Notifies active users when a new application version is deployed.

---

## ☁️ Deployment

Agrein includes ready-to-deploy configuration for cloud platforms such as **Render**:

1. Link your GitHub repository to Render.
2. Render detects `render.yaml` and provisions the Web Service using the configuration:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/status`
3. Configure your production environment variables in the Render Dashboard matching `.env.example`.
4. Run migrations from `database/schema.sql` on your production Supabase database.

---

## 📄 License

This project is open-source and distributed under the [MIT License](file:///package.json).

---

<div align="center">
  <sub>Built with ❤️ for Nigerian Agriculture & Farmers.</sub>
</div>
