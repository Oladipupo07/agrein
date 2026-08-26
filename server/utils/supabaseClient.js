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

// Profiles are looked up by either the canonical Supabase UUID (`id`) or by
// `local_id` — the legacy `usr-<timestamp>` string minted before the
// source-of-truth refactor. New code prefers UUID, but the local_id fallback
// lets existing JWTs keep working through the transition window.
//
// Returns the row in the same shape as `profiles.*` (lowercase column names).
async function findProfileByEmail(email) {
  const sb = getSupabaseAdmin();
  if (!sb || !email) return null;
  const normalized = String(email).toLowerCase().trim();
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .eq('email', normalized)
    .maybeSingle();
  if (error) {
    console.warn('[supabaseClient] findProfileByEmail failed for', normalized, '—', error.message);
    return null;
  }
  return data || null;
}

async function findProfileById(id) {
  const sb = getSupabaseAdmin();
  if (!sb || !id) return null;
  const value = String(id).trim();

  // Try the canonical UUID column first.
  const { data: byUuid, error: uuidErr } = await sb
    .from('profiles')
    .select('*')
    .eq('id', value)
    .maybeSingle();
  if (uuidErr) {
    console.warn('[supabaseClient] findProfileById UUID lookup failed:', uuidErr.message);
  }
  if (byUuid) return byUuid;

  // Fall back to local_id (legacy `usr-<timestamp>` strings).
  const { data: byLocal, error: localErr } = await sb
    .from('profiles')
    .select('*')
    .eq('local_id', value)
    .maybeSingle();
  if (localErr) {
    console.warn('[supabaseClient] findProfileById local_id lookup failed:', localErr.message);
    return null;
  }
  return byLocal || null;
}

module.exports = supabase;
module.exports.getSupabaseAdmin = getSupabaseAdmin;
module.exports.findProfileByEmail = findProfileByEmail;
module.exports.findProfileById = findProfileById;
