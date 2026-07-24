# Agrein API Specifications

Base URL: `/api`

## Endpoints Summary

### Payments & Escrow (`/api/payments`)
- `POST /initialize`: Generate Interswitch payment parameters for Webpay, USSD, or QR.
- `POST /verify`: Verify transaction reference with Interswitch API.
- `POST /escrow/release`: Release locked funds to farmer wallet upon delivery confirmation.
- `POST /webhook`: Handle incoming Interswitch webhooks.

### Wallet Ledger (`/api/wallet`)
- `GET /balance`: Retrieve user available balance and escrow funds.
- `POST /deposit`: Fund wallet via Interswitch.
- `POST /withdraw`: Initiate payout to Nigerian bank account.

### Marketplace & Products (`/api/products`)
- `GET /`: Search and filter catalog products.
- `GET /:id`: Retrieve product details and farm traceability passport.

### Reverse Marketplace (`/api/rfq`)
- `GET /`: List active purchase requests.
- `POST /`: Publish a new bulk RFQ request.
- `POST /:id/bids`: Submit a farmer bid.

### AI Agronomy & Prices (`/api/ai`)
- `GET /commodity-prices`: Live market price index & 30-day forecast.
- `POST /diagnose-crop`: Run leaf disease diagnostic via Computer Vision AI.
- `POST /assistant-chat`: Chat with agricultural advisory bot.
