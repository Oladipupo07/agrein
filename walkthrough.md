# Walkthrough - Agrein Agricultural Marketplace

We have successfully developed the Agrein digital marketplace! Below is a summary of the files created, structural design, and testing guides to verify the implementation.

## Files Created

- **Monorepo Setup:**
  - [package.json](file:///c:/Users/akobe/Documents/Project/agrein/package.json): Orchestrates client & server tasks concurrently.
  - [README.md](file:///c:/Users/akobe/Documents/Project/agrein/README.md): Primary project setup documentation.

- **PostgreSQL Database (`/database`):**
  - [schema.sql](file:///c:/Users/akobe/Documents/Project/agrein/database/schema.sql): Complete SQL schema (Users, Products, Orders, Transactions, Reviews, Deliveries, and Chat).
  - [seed.sql](file:///c:/Users/akobe/Documents/Project/agrein/database/seed.sql): Agricultural seed records.

- **Express TS Backend (`/server`):**
  - [package.json](file:///c:/Users/akobe/Documents/Project/agrein/server/package.json) & [tsconfig.json](file:///c:/Users/akobe/Documents/Project/agrein/server/tsconfig.json): Node & TS dependencies.
  - [index.ts](file:///c:/Users/akobe/Documents/Project/agrein/server/src/index.ts): Main Express entry.
  - [db.ts](file:///c:/Users/akobe/Documents/Project/agrein/server/src/services/db.ts): Database client adapter. Operates with PostgreSQL, with an automatic pre-seeded in-memory fallback for local dev.
  - [auth.ts (Middleware)](file:///c:/Users/akobe/Documents/Project/agrein/server/src/middleware/auth.ts): Session validation checks.
  - [auth.ts (Route)](file:///c:/Users/akobe/Documents/Project/agrein/server/src/routes/auth.ts): Login/Register.
  - [products.ts (Route)](file:///c:/Users/akobe/Documents/Project/agrein/server/src/routes/products.ts): Category queries & crop lists.
  - [orders.ts (Route)](file:///c:/Users/akobe/Documents/Project/agrein/server/src/routes/orders.ts): Basket checkouts and escrow releases.
  - [payments.ts (Route)](file:///c:/Users/akobe/Documents/Project/agrein/server/src/routes/payments.ts): Interswitch requery verification.
  - [deliveries.ts (Route)](file:///c:/Users/akobe/Documents/Project/agrein/server/src/routes/deliveries.ts): Milestone tracking dispatches.
  - [messages.ts (Route)](file:///c:/Users/akobe/Documents/Project/agrein/server/src/routes/messages.ts): Real-time chat routes.
  - [analytics.ts (Route)](file:///c:/Users/akobe/Documents/Project/agrein/server/src/routes/analytics.ts): Dashboards stat summaries & notifications.

- **React TS Frontend (`/client`):**
  - [index.html](file:///c:/Users/akobe/Documents/Project/agrein/client/index.html) & [vite.config.ts](file:///c:/Users/akobe/Documents/Project/agrein/client/vite.config.ts): Vite base bundler configurations.
  - [tailwind.config.js](file:///c:/Users/akobe/Documents/Project/agrein/client/tailwind.config.js) & [postcss.config.js](file:///c:/Users/akobe/Documents/Project/agrein/client/postcss.config.js): Custom styling themes.
  - [index.css](file:///c:/Users/akobe/Documents/Project/agrein/client/src/index.css): Core scrolls, animations, and skeleton declares.
  - [main.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/main.tsx) & [App.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/App.tsx): Routing trees & providers binding.
  - [api.ts](file:///c:/Users/akobe/Documents/Project/agrein/client/src/services/api.ts): API clients.
  - [useAuth.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/hooks/useAuth.tsx) & [useCart.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/hooks/useCart.tsx): Context wrappers.
  - [Navbar.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/components/Navbar.tsx) & [Footer.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/components/Footer.tsx): Navigation pages.
  - [InterswitchMock.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/components/InterswitchMock.tsx): Simulated Interswitch modal.
  - [DashboardLayout.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/layouts/DashboardLayout.tsx): Sidebar layouts.
  - **Pages:**
    - [Home.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/pages/Home.tsx): Landing page.
    - [Products.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/pages/Products.tsx): Product listings.
    - [ProductDetail.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/pages/ProductDetail.tsx): Details view & slide-out chat.
    - [About.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/pages/About.tsx) & [Contact.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/pages/Contact.tsx): Core info.
    - [Login.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/pages/Login.tsx) & [Register.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/pages/Register.tsx): Registration portals.
    - [FarmerDashboard.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/pages/FarmerDashboard.tsx): Farmer analytics & listings controls.
    - [BuyerDashboard.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/pages/BuyerDashboard.tsx): Shopping Cart, checkout forms, and escrow releases.
    - [AdminDashboard.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/pages/AdminDashboard.tsx): Approvals logs, registries, and dispute mediations.
    - [DeliveryDashboard.tsx](file:///c:/Users/akobe/Documents/Project/agrein/client/src/pages/DeliveryDashboard.tsx): Dispatched orders milestones updates.

---

## Verification & Testing Steps

### 1. Start Development Servers
Start the development servers by running:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 2. Testing Authentication Flow
- Click **Log In** in the navbar.
- Note the demo accounts list at the bottom of the card.
- Authenticate with `buyer.emeka@agrein.com` and password `password123`.
- Verify that the profile icon mounts in the navbar and provides dropdown links.

### 3. Testing Marketplace & Cart Flow
- Navigate to the **Marketplace** page.
- Apply filters (e.g. category `Grains`, or State `Lagos`). Search for a crop like "Rice".
- Click a product card to open **Product Detail**.
- Adjust the quantity selector, and click **Add to Cart**.
- Open the Cart tab in the buyer dashboard by clicking the cart badge in the navbar.
- Verify that your items are displayed correctly with subtotal summaries.

### 4. Testing Interswitch Escrow Checkout
- On your Cart page, click **Proceed to Checkout**.
- Enter your shipping details (e.g. Lagos), and click **Initialize Interswitch Checkout**.
- The dark blue **Interswitch Webpay** checkout frame will pop up.
- Enter credit card digits (e.g. mock card number: `5061123456789012`, expiry: `12/28`, CVV: `123`, PIN: `1111`).
- Click **Pay**. The system processes payment via backend webhook requery, updates the order to `paid`, and redirects you to your orders tracking history list.

### 5. Testing Delivery Partner Dispatch
- Sign out of the buyer account, and log in with the Delivery Rider details (`delivery.tunde@agrein.com`).
- On the dashboard overview, look at **Pending Farm Pickups**.
- Identify the order you just paid for and click **Accept Dispatch**.
- The order is assigned to you. Click **Update Status** and mark the milestone as `picked_up` (picked up from farm).
- Finally, click **Update Status** again and transition it to `delivered` (delivered to buyer coordinates).

### 6. Verification of Escrow Split & Release
- Sign out of the delivery account, and log back in as the Buyer (`buyer.emeka@agrein.com`).
- Navigate to the **My Orders** tab.
- Locate the delivered order. You will see a green banner: **Package Delivered!**
- Click **Confirm Receipt**. This releases the escrow.
- Sign out and log in as the Farmer (`farmer.kole@agrein.com`).
- Go to the **Earnings & Payouts** tab.
- Verify that the farmer's balance has increased by 95% of the total amount (after the 5% platform commission deduction). The transactions table logs the payout transaction.
