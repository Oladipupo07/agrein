// Agrein Server Main Entry Point
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const path = require('path');
const apiRoutes = require('./routes/api');
const { assertInterswitchConfig } = require('./utils/interswitch');

// Refuse to boot in LIVE mode without Interswitch credentials. Better to crash
// here than to charge real cards with an empty merchant_code.
try {
  assertInterswitchConfig();
} catch (e) {
  console.error('\n❌ Boot aborted:', e.message, '\n');
  process.exit(1);
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
    name: 'Agrein Marketplace API',
    version: '1.0.0',
    tagline: 'Connecting Farmers to Buyers, One Harvest at a Time.'
  });
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 Agrein Backend running on 0.0.0.0:${PORT}`);
  });
}

module.exports = app;
