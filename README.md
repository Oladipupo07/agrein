# Agrein 🌾

> **Connecting Farmers to Buyers, One Harvest at a Time.**

Agrein is a modern agricultural marketplace platform designed to bridge the gap between farmers and consumers/bulk buyers across Africa. The platform enables farmers to showcase and sell their agricultural produce directly to buyers at fair market prices, while providing buyers with transparent access to organic, freshly harvested crops backed by escrow protection and temperature-controlled logistics.

---

## 💳 Payment Integration

Agrein uses **Interswitch** as its primary payment gateway to provide secure and seamless transactions between buyers and farmers.

### Supported Payment Methods
* **Debit/Credit Cards**: Verve, Visa, Mastercard
* **Bank Transfers**: Direct Interswitch Bank Settlement
* **USSD Payments**: USSD shortcodes across major Nigerian banks (*737#, *901#, *894#, etc.)
* **QR Payments**: Quickteller QR code scan
* **Verve Cards**: Full native Verve card support

### Interswitch Authentication Mechanisms
Agrein supports both Interswitch authentication protocols:

1. **OAuth 2.0 Authentication (Passport API)**:
   - Concatenates `CLIENT_ID:SECRET_KEY` and encodes into Base64 format.
   - Obtains Bearer Access Token via `POST /passport/oauth/token?grant_type=client_credentials` header `Authorization: Basic <Base64>`.
   - Attaches `Authorization: Bearer <access_token>` to all transaction & re-query endpoints.

2. **InterswitchAuth (Legacy HMAC Signatures)**:
   - Calculates request `Nonce` (32-char hex string) and `Timestamp` (Unix epoch seconds).
   - Base64 encodes `CLIENT_ID` for header `Authorization: InterswitchAuth <Base64(CLIENT_ID)>`.
   - Computes SHA-1 Signature: `SHA1(httpMethod & urlencode(endpoint) & timestamp & nonce & clientId & secretKey)`.
   - Attaches `SignatureMethod: SHA1`, `Signature`, `Nonce`, and `Timestamp` headers.

### Payment Flow
```
Buyer ──► Adds Products to Cart ──► Checkout ──► Interswitch Gateway (OAuth 2.0 / InterswitchAuth) ──► Payment Verification ──► Order Confirmation ──► Farmer Receives Notification ──► Delivery Process Begins
```

---

## 🌟 Key Features

### 🚜 Farmer Features
* **User & Profile Management**: Complete farmer onboarding with farm location, size in hectares, and bank verification.
* **Product Listing & Management**: List crops with unit pricing (kg, bag, tuber, ton), harvest date, organic tags, and available inventory.
* **Sales Analytics & Revenue Dashboard**: Track monthly revenue trends, active listings, and escrow clearances.
* **Interswitch Instant Withdrawals**: Directly request payouts to local bank accounts with full transaction history.
* **AI Price Advisor**: Receive AI-driven recommendations on whether to hold crop inventory or sell based on seasonal demand forecasts.

### 🛒 Buyer Features
* **Interactive Marketplace Catalog**: Search, filter by state, category, or organic verification status.
* **Dynamic Cart & Order Calculator**: Automatically compute produce subtotal and coldchain freight fees.
* **Interswitch Payment Gateway**: Securely check out using Card (Verve/Visa/Mastercard), Bank Transfer, USSD, or QR code under 256-bit SSL encryption with 100% Escrow Protection.
* **Live Order & ColdChain Tracking**: Real-time 5-stage progress timeline (Order Placed -> Farm Quality Packaging -> Dispatched -> In Transit -> Delivered) with direct driver contact.
* **Wishlist & Re-ordering**: Save favorite harvests and re-order in one click.

### 🛡️ Admin Features
* **Platform GMV & Analytics**: Monitor platform sales metrics across 36 states.
* **Farmer Verification Queue**: Audit and verify smallholder farmer identities and farm land sizes.
* **Escrow Dispute Center**: Resolve buyer-seller disputes with hold and release escrow controls.

### 🤖 AI & Future Innovations
* **AI Crop Price Predictor**: Forecast crop commodity prices up to 6 months out with a 94%+ confidence score.
* **Geospatial Farm Finder**: Map local farms nearby with active crop inventory.
* **Buyer-Farmer Direct Chat**: In-app messaging for contract negotiations.

---

## 🏗️ Tech Stack

| Category | Technology |
|---|---|
| **Frontend** | HTML5, JavaScript (ES6+), Tailwind CSS v3, FontAwesome Icons |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL / Supabase |
| **Authentication** | Supabase Auth / JWT |
| **Primary Payment Gateway** | Interswitch Webpay |
| **Logistics** | Agrein ColdChain Logistics API |

---

## 📂 Project Structure

```bash
agrein/
├── client/
│   ├── components/
│   │   ├── Navbar.js             # Navigation, dark mode toggle, role portal switcher
│   │   ├── Hero.js               # Tagline, CTAs, live market price ticker, stats
│   │   ├── ProductCatalog.js     # Search, state filter, category tabs, harvest grid
│   │   ├── ProductModal.js       # Detailed crop view, specs, dynamic price calculator
│   │   ├── FarmerDashboard.js    # Revenue metrics, sales chart, inventory, withdrawals
│   │   ├── BuyerDashboard.js     # Active ColdChain order tracker timeline, order history
│   │   ├── AdminDashboard.js     # GMV analytics, farmer verification, dispute escrow
│   │   ├── AIPredictor.js        # AI Crop Price Forecasting engine
│   │   ├── NearbyFarms.js        # Geospatial farm discovery tool
│   │   ├── CheckoutModal.js      # Interswitch Webpay payment gateway simulator
│   │   ├── ChatDrawer.js         # Buyer-Farmer messaging overlay
│   │   ├── CartDrawer.js         # Slide-over procurement cart
│   │   └── Footer.js             # Platform links, newsletter, compliance badges
│   └── data/
│       └── mockData.js           # Mock crop dataset, farmer & buyer profiles, market index
│
├── server/
│   ├── controllers/
│   │   ├── productController.js  # CRUD endpoints for agricultural products
│   │   ├── orderController.js    # Order processing & Interswitch initialization
│   │   └── aiController.js       # Commodity price prediction endpoint
│   ├── routes/
│   │   └── api.js                # Express API routes
│   ├── utils/
│   │   └── interswitch.js        # Interswitch Webpay helper methods
│   ├── index.js                  # Main Express server file
│   └── package.json              # Backend dependencies
│
├── database/
│   └── schema.sql                # PostgreSQL database schema & Supabase RLS policies
│
├── index.html                    # Single Page Web App entry point
├── styles.css                    # Design system, glassmorphic styles, custom dark mode
├── app.js                        # Client state orchestrator & event handler
└── README.md
```

---

## 🚀 Quick Start & Local Setup

### 1. View Frontend Web Application
Simply open `index.html` in any web browser or use a live server extension.

### 2. Backend Server Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 💳 Interswitch Payment Gateway Setup

Set your Interswitch merchant credentials in `server/.env`:
```env
INTERSWITCH_MERCHANT_CODE=MX104928
INTERSWITCH_PAY_ITEM_ID=101
INTERSWITCH_SECRET_KEY=your_interswitch_secret_key
INTERSWITCH_ENV=test
PORT=5000
```

The server initializes transactions using Interswitch Webpay collections and verifies payments against Interswitch Re-query APIs.

---

## 📧 Transactional Email (OTP Delivery)

The registration and password-reset flows send a 6-digit OTP code to the user's email.

### Production / Render (recommended)
Agrein uses [Brevo](https://www.brevo.com) for transactional email. Brevo's HTTPS API listens on port 443, which **Render's free tier does not block** — unlike SMTP ports 25/465/587, which is why Gmail SMTP "works locally but never delivers on Render".

Sign up at https://app.brevo.com, get an API key at **Settings → SMTP & API → API Keys**, then:
```env
BREVO_API_KEY=xkeysib-...
MAIL_FROM_ADDRESS=akobeoladipupo@gmail.com
MAIL_FROM_NAME=Agrein Market
```

Free tier: 300 emails / day.

### Local Development Fallback
For local dev, Gmail SMTP via App Passwords still works (no Render network restrictions). The mailer auto-detects which path is configured.

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=akobeoladipupo@gmail.com
SMTP_PASS=your_gmail_app_password
```

Generate a Gmail App Password at https://myaccount.google.com/apppasswords (requires 2-Step Verification on the Gmail account).

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

Built with ❤️ to empower smallholder farmers and transform agricultural commerce across Africa.
