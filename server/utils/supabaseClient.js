// Supabase Database Client for Agrein Backend
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://hjksxxwucfnubtcellbm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase service-role credentials missing from environment variables.');
}

// Primary client used by controllers — service role bypasses RLS on the backend.
const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

function getSupabaseAdmin() {
  if (supabaseServiceKey) return supabase;
  return null;
}

module.exports = supabase;
module.exports.getSupabaseAdmin = getSupabaseAdmin;
