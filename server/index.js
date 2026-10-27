// Agrein Server Main Entry Point
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const path = require('path');
const apiRoutes = require('./routes/api');
const { profilesHasPasswordColumns } = require('./utils/supabaseClient');

// Refuse to boot in production if the profiles.password_hash /
// password_salt columns don't exist. Without them, every new account created
// on Render loses its password on the next deploy (data/users.json is ephemeral
// on Render's free tier). Better to crash here than to silently break login.
async function bootApp() {
  if (process.env.NODE_ENV === 'production') {
    const result = await profilesHasPasswordColumns();
    if (!result.ok) {
      console.error('\n❌ Boot aborted: required columns are missing on public.profiles.');
      console.error(`   Missing: ${result.missing.join(', ')}`);
      if (result.reason) console.error(`   Reason: ${result.reason}`);
      console.error('   Apply this migration in Supabase → SQL Editor:');
      console.error('   ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;');
      console.error('   ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_salt TEXT;\n');
      process.exit(1);
    }
    console.log('✅ profiles.password_hash + password_salt columns present');
  }

  const app = express();
  const PORT = process.env.PORT || 5000;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve compiled CSS from public/ first (overrides any repo-root styles.css)
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Serve Static Frontend Files
  app.use(express.static(path.join(__dirname, '..')));

  // API Prefix
  app.use('/api', apiRoutes);

  // Root Status fallback for API status check if needed or /api status
  app.get('/api/status', (req, res) => {
    res.json({
      status: 'online',
      name: 'Agrein Auth & Email Service',
      version: '2.0.0'
    });
  });

  // Page Routes
  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login.html'));
  });

  app.get(['/register', '/signup'], (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'register.html'));
  });

  app.get('/farmer-onboarding', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'farmer-onboarding.html'));
  });


  // SPA fallback for HTML5 history API navigation
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, message: 'API route not found' });
    }
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });

  if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🌾 Agrein Backend running on 0.0.0.0:${PORT}`);
    });
  }

  return app;
}

if (require.main !== module) {
  // Imported by tests — start the boot async and let the caller await the app.
  module.exports = bootApp();
} else {
  // Main entry — kick off the boot.
  bootApp().catch(err => {
    console.error('[boot] fatal:', err && err.message);
    process.exit(1);
  });
}
