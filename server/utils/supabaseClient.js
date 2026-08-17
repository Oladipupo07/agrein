// Supabase Database Client for Agrein Backend
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://hjksxxwucfnubtcellbm.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials missing from environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
