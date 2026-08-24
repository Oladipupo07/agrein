# Agrein

Agrein is a full-stack agricultural marketplace prototype for connecting farmers, buyers, and admins in a single platform. The app is designed around direct farm-to-market trade in Nigeria, with farmer verification, produce listing, order checkout, escrow-style payment flows, and AI-assisted market insights.

This repo contains:
- a static frontend SPA served from the project root
- a Node.js + Express API in the `server/` folder
- Supabase/PostgreSQL-ready database schema in `database/schema.sql`
- PWA metadata, deployment config, and demo marketplace logic

## Overview

Agrein includes:
- product browsing and catalog filtering
- buyer cart and checkout flow
- farmer dashboard for listings and sales
- admin verification and moderation screens
- role-based access to dashboards
- OTP-based authentication
- Interswitch payment integration hooks
- AI price prediction and agronomy diagnosis interfaces
- logistics, cooperative, traceability, and wallet modules

## Tech stack

- Frontend: HTML, JavaScript, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL / Supabase
- Auth: JWT + email OTP flow
- Payments: Interswitch integration utilities
- Email: Brevo API with SMTP fallback
- Deployment: Render config included in `render.yaml`

## Project structure

```bash
.
├── app.js                     # main client-side app orchestrator
├── index.html                 # SPA entry point and script loading
├── manifest.json              # PWA manifest
├── public/
│   └── styles.css             # compiled Tailwind CSS
├── src/
│   ├── custom.css
│   └── tailwind.css
├── client/
│   ├── components/
│   ├── data/
│   └── utils/
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── index.js               # Express app entry point
│   └── package.json
├── database/
│   └── schema.sql             # database schema and related SQL
├── render.yaml                # Render deployment config
├── sw.js                      # service worker
├── tailwind.config.js
├── postcss.config.js
├── robots.txt
├── sitemap.xml
├── README.md
└── server.ps1
```

## Features

### Buyer experience
- catalog browsing with search and state/category filters
- add-to-cart and checkout flow
- wallet and order tracking screens
- dispute management for order issues
- secure payment flow using Interswitch hooks

### Farmer experience
- profile and farm onboarding
- product listing management
- sales dashboard
- verification workflow
- trust score and approval status tracking

### Admin experience
- user directory and role filtering
- farmer verification review
- dispute resolution
- account deletion queue and moderation tools

### Business modules included
- AI price prediction
- crop health diagnosis
- logistics partner view
- cooperative marketplace
- reverse RFQ/offer flow
- traceability and QR batch references
- subscription plans and digital wallet

## Running locally

### Prerequisites
- Node.js 18+
- npm
- a Supabase project (optional for demo mode; some flows degrade gracefully without it)

### 1. Install backend dependencies

```bash
cd server
npm install
```

### 2. Create environment variables

Create a `server/.env` file with the variables below:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_postgres_connection_string
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

INTERSWITCH_ENV=sandbox
INTERSWITCH_MERCHANT_CODE=your_merchant_code
INTERSWITCH_PAY_ITEM_ID=your_pay_item_id
INTERSWITCH_CLIENT_ID=your_client_id
INTERSWITCH_SECRET_KEY=your_secret_key

BREVO_API_KEY=your_brevo_api_key
MAIL_FROM_ADDRESS=your@email.com
MAIL_FROM_NAME=Agrein Market
```

> The app reads these variables in the backend at runtime. If some keys are missing, the server still starts in a demo-friendly mode, but payment or database-backed flows may behave differently.

### 3. Start the backend

```bash
cd server
npm run dev
```

The Express app will serve the frontend root and expose the API under `/api`.

### 4. Open the app

Open this in a browser:

```text
http://localhost:5000/
```

The backend serves static assets from the project root, so the frontend is accessible via the same app server.

## Available scripts

From `server/`:

```bash
npm run dev
npm run build
npm start
```

`npm run build` compiles the Tailwind styles into `public/styles.css`.

## API status

The backend exposes a health check at:

```text
http://localhost:5000/api/status
```

Example response:

```json
{
  "status": "online",
  "name": "Agrein Marketplace API",
  "version": "1.0.0",
  "tagline": "Connecting Farmers to Buyers, One Harvest at a Time."
}
```

## Authentication and user flow

The app uses a JWT-based backend flow with OTP email verification for registration and password resets.

Routes include:
- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/verify-otp`
- `/api/auth/resend-otp`
- `/api/auth/forgot-password`
- `/api/auth/reset-password`
- `/api/auth/change-password`

The role system includes:
- `BUYER`
- `FARMER`
- `ADMIN`

## Database and persistence

The project includes a comprehensive SQL schema in `database/schema.sql` for:
- profiles
- farmer profiles
- farmer verification records
- wallet and transaction tables
- orders and products
- RFQs and bids
- dispute records
- notifications
- chat message tables

The app is built to use Supabase in production, while also keeping a local fallback data layer in the backend for demo or offline-friendly usage.

## Deployment

A Render deployment configuration is already provided in `render.yaml`.

Key runtime settings include:
- Node runtime
- backend root at `server/`
- `PORT=10000`
- production environment variables for JWT, Supabase, Interswitch, and Brevo
- health check at `/api/status`

## Notes

- This project is a product/demo-oriented marketplace frontend and backend scaffold rather than a strict enterprise monorepo.
- A number of sections are intentionally UI-driven and rely on demo data or mock state for presentation.
- Payment, verification, and database-backed features are wired to real external services when keys are configured.

## License

This project is distributed under the MIT license.

## Project intent

Agrein is intended to show a realistic agricultural commerce experience for Nigerian smallholder farmers and buyers, with a focus on trust, traceability, sell-through efficiency, and digital financial access.
