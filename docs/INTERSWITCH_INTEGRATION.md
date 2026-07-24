# Interswitch Payment Gateway & Escrow Integration Guide

Official Interswitch Documentation Source:
- Home Docs: https://docs.interswitchgroup.com/docs/home
- Developer Portal: https://docs.interswitchgroup.com
- LLM Index: https://docs.interswitchgroup.com/llms.txt

---

## Architecture Overview

Agrein implements a dedicated Interswitch Payment Service layer located at `server/src/services/interswitch.ts`.
This layer manages:

1. **OAuth2 Bearer Token Authentication** using Interswitch Client Credentials (`client_id` + `client_secret`).
2. **Webpay Inline & Redirect Payloads** using SHA-512 cryptographic digests.
3. **Multi-Channel Payments**:
   - Verve, Visa, Mastercard
   - Bank Transfer
   - USSD (`*737#` style shortcode payload)
   - Quick Response (QR Code) payload generator
4. **Marketplace Escrow State Machine**:
   ```
   Buyer Order ➔ Interswitch Webpay Payment ➔ Agrein Escrow Held ➔ Dispatch ➔ Buyer Delivery Confirmation ➔ Released to Farmer Wallet
   ```
5. **Webhook Integrity Verification**: HMAC SHA-512 signature validation on all notification callbacks (`/api/payments/webhook`).

---

## Environment Variables Setup

```env
INTERSWITCH_ENV=sandbox # or 'production'
INTERSWITCH_MERCHANT_CODE=MX2607
INTERSWITCH_PAY_ITEM_ID=101
INTERSWITCH_CLIENT_ID=IKIA...
INTERSWITCH_CLIENT_SECRET=secret_...
INTERSWITCH_MAC_KEY=25F9C10B7C6E...
INTERSWITCH_WEBHOOK_SECRET=whsec_interswitch_agrein_2026
```

---

## API Flow Example

### 1. Payment Initialization
`POST /api/payments/initialize`
```json
{
  "amount": 48000,
  "email": "buyer@agrein.ng",
  "channel": "card",
  "orderId": "ORD-99120"
}
```

### 2. Payment Verification
`POST /api/payments/verify`
```json
{
  "transactionRef": "AGR_1721811200_441",
  "amount": 48000
}
```

### 3. Escrow Release
`POST /api/payments/escrow/release`
```json
{
  "transactionRef": "AGR_1721811200_441",
  "farmerId": "farm_101"
}
```
*Platform commission (3%) is automatically deducted before crediting the Farmer's wallet balance.*
