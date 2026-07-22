# 🚀 Agrein Production Deployment Guide (Vercel + Render + Supabase)

This guide provides step-by-step instructions to take the **Agrein Digital Agriculture Marketplace** live using **100% Free Tier** services:
- **Frontend App:** [Vercel](https://vercel.com) (React 18 + Vite SPA)
- **Backend API:** [Render](https://render.com) (Node.js + Express + TypeScript)
- **Database:** [Supabase](https://supabase.com) (Managed PostgreSQL)
- **Code Repository:** [GitHub](https://github.com)

---

## 📑 Table of Contents
1. [Prerequisites](#-prerequisites)
2. [Step 1: Push Code to GitHub](#-step-1-push-code-to-github)
3. [Step 2: Database Setup on Supabase](#-step-2-database-setup-on-supabase)
4. [Step 3: Backend API Deployment on Render](#-step-3-backend-api-deployment-on-render)
5. [Step 4: Frontend UI Deployment on Vercel](#-step-4-frontend-ui-deployment-on-vercel)
6. [Step 5: Post-Deployment Verification](#-step-5-post-deployment-verification)
7. [⚡ Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 🛠️ Prerequisites

Before you start, make sure you have free accounts on:
1. [GitHub Account](https://github.com/signup)
2. [Supabase Account](https://supabase.com/dashboard/sign-up)
3. [Render Account](https://render.com/register)
4. [Vercel Account](https://vercel.com/signup)

---

## 📦 Step 1: Push Code to GitHub

1. Open your terminal or PowerShell inside the root project directory:
   ```bash
   cd c:\Users\akobe\Documents\Project\agrein
   ```

2. Initialize Git, stage all project files, and commit:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit ready for cloud deployment"
   ```

3. Go to [GitHub - Create a New Repository](https://github.com/new):
   - **Repository Name:** `agrein`
   - **Visibility:** Public or Private
   - Do **NOT** initialize with README or .gitignore (since we already have them).
   - Click **Create repository**.

4. Connect your local folder to GitHub and push your code:
   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/agrein.git
   git branch -M main
   git push -u origin main
   ```

---

## 🗄️ Step 2: Database Setup on Supabase

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **New Project**:
   - **Name:** `agrein-db`
   - **Database Password:** *Enter a strong password and save it securely!*
   - **Region:** Select the closest region to your users (e.g., *EU West / London* or *US East*).
   - Click **Create new project**.

3. **Get Your PostgreSQL Connection String:**
   - In Supabase, navigate to **Project Settings** (gear icon at bottom left) -> **Database**.
   - Under **Connection string**, select **URI**.
   - Copy the URI. It looks like this:
     `postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres`
   - Replace `[YOUR-PASSWORD]` with the actual password you set when creating the database.

4. **Run Database Schemas and Seed Data:**
   - In Supabase, click on **SQL Editor** in the left sidebar menu.
   - Click **New query**.
   - Open [database/schema.sql](file:///c:/Users/akobe/Documents/Project/agrein/database/schema.sql) in your code editor, copy all contents, paste into the Supabase SQL Editor, and click **Run**.
   - Open a new query tab, copy all contents from [database/seed.sql](file:///c:/Users/akobe/Documents/Project/agrein/database/seed.sql), paste into Supabase SQL Editor, and click **Run**.

---

## ⚙️ Step 3: Backend API Deployment on Render

1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** (top right) -> **Web Service**.
3. Choose **Build and deploy from a Git repository** and connect your GitHub account.
4. Select your `agrein` repository from the list.
5. Fill in the **Web Service Settings**:
   - **Name:** `agrein-server`
   - **Region:** Select closest region.
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `node dist/index.js`
   - **Instance Type:** `Free`

6. Scroll down to **Environment Variables** and click **Add Environment Variable** for each key below:

   | Key | Example / Recommended Value |
   | :--- | :--- |
   | `PORT` | `5000` |
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | `agrein_super_secret_jwt_key_production_2026` |
   | `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres` |
   | `CORS_ORIGIN` | `*` |
   | `INTERSWITCH_MERCHANT_CODE` | `MX2609` |
   | `INTERSWITCH_PAY_ITEM_ID` | `10101` |
   | `INTERSWITCH_ENV` | `sandbox` |

7. Click **Create Web Service**.
8. Wait a few minutes for Render to build and start your server.
9. Once live, Render will give you a public URL (e.g., `https://agrein-server.onrender.com`).
10. Verify backend health by visiting: `https://agrein-server.onrender.com/api/health` in your browser. You should see `{"status":"healthy","platform":"Agrein"}`.

---

## 🌐 Step 4: Frontend UI Deployment on Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project**.
3. Import your `agrein` repository from GitHub.
4. Configure the **Project Settings**:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click *Edit* and set to `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. Expand the **Environment Variables** section and add:

   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://agrein-server.onrender.com/api` *(Your Render server URL + `/api`)* |
   | `VITE_INTERSWITCH_MERCHANT_CODE` | `MX2609` |
   | `VITE_INTERSWITCH_PAY_ITEM_ID` | `10101` |
   | `VITE_INTERSWITCH_ENV` | `sandbox` |

6. Click **Deploy**.
7. Vercel will build and deploy your React frontend within 1-2 minutes.
8. Once finished, Vercel will provide your live URL (e.g., `https://agrein.vercel.app` or `https://agrein-client.vercel.app`).

---

## ✅ Step 5: Post-Deployment Verification

1. Open your Vercel live application URL in a web browser.
2. Test login with pre-seeded test accounts (Password for all is **`password123`**):
   - **Admin:** `admin@agrein.com`
   - **Farmer:** `farmer.kole@agrein.com`
   - **Buyer:** `buyer.emeka@agrein.com`
   - **Delivery Rider:** `delivery.tunde@agrein.com`
3. Check key live features:
   - Browse products on the Marketplace page (`/products`).
   - View spot prices on Market Intelligence (`/market-intelligence`).
   - Access the AgreinPay Wallet (`/wallet`).
   - Test AI AgriBot assistant (`/agribot`).

---

## ⚡ Troubleshooting & FAQs

### 1. API Calls Fail / Network Errors on Vercel Frontend
- **Cause:** Incorrect `VITE_API_URL` environment variable or missing `/api` suffix.
- **Solution:** Ensure `VITE_API_URL` on Vercel is set to `https://<YOUR-RENDER-SERVICE>.onrender.com/api`. After updating environment variables in Vercel, navigate to **Deployments** -> **Redeploy** to re-bake the environment variables into the Vite bundle.

### 2. Render Database Connection Error
- **Cause:** Password in `DATABASE_URL` contains special characters (`@`, `#`, `%`, `!`, `:`) that are not URL-encoded.
- **Solution:** URL-encode special characters in password (e.g., replace `@` with `%40`, `#` with `%23`).

### 3. Render Inactivity Delay (Cold Starts)
- **Note:** Render's free tier puts web services to sleep after 15 minutes of inactivity. The first request after sleep may take 30-45 seconds to wake up. Subsequent requests will be fast!

### 4. Page Refresh Returns 404 on Vercel
- **Solution:** The project includes [client/vercel.json](file:///c:/Users/akobe/Documents/Project/agrein/client/vercel.json) which handles single-page app rewrites automatically so deep links like `/products` work on page refresh.

---

*Made with ❤️ for African Agriculture. Powered by Agrein Technologies.*
