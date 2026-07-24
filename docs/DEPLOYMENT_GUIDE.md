# Agrein Production Deployment Guide

## Deployment Stack

- **Frontend Platform**: Deployed on **Vercel** (`client/` root).
- **Backend API**: Deployed on **Railway / Render** (`server/` root).
- **Database Engine**: Deployed on **Supabase PostgreSQL**.
- **Payment Gateway**: **Interswitch Webpay & Transfer API**.

---

## Deployment Steps

### 1. Database Setup (Supabase)
1. Create a new Supabase project.
2. Go to SQL Editor in Supabase Console.
3. Paste and execute the contents of `supabase/schema.sql`.

### 2. Backend Deployment (Railway)
1. Connect GitHub repository to Railway.
2. Set Root Directory to `server`.
3. Configure environment variables from `.env.example`.
4. Build Command: `npm run build`
5. Start Command: `npm start`

### 3. Frontend Deployment (Vercel)
1. Import repository into Vercel.
2. Set Root Directory to `client`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add `VITE_API_URL` pointing to backend Railway domain.
