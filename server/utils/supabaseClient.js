// Supabase Database Client for Agrein Backend
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://hjksxxwucfnubtcellbm.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase service-role credentials missing from environment variables.');
}

const supabaseKey = supabaseServiceKey || supabaseAnonKey;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

function getSupabaseAdmin() {
  if (supabaseServiceKey && supabase) return supabase;
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

/**
 * Probe whether the `password_hash` and `password_salt` columns exist on
 * `public.profiles`. Used at server boot to refuse to start when the schema
 * migration hasn't been applied — without these columns, every new account
 * created on Render will be unable to log in on the next deploy (Render's
 * free-tier filesystem is ephemeral and wipes data/users.json).
 *
 * Returns an object: { ok, missing: [...] }
 */
async function profilesHasPasswordColumns() {
  const sb = getSupabaseAdmin();
  if (!sb) return { ok: false, missing: ['password_hash', 'password_salt'], reason: 'No Supabase admin client (missing service-role key).' };
  try {
    const { error } = await sb
      .from('profiles')
      .select('password_hash, password_salt')
      .limit(1);

    if (!error) {
      return { ok: true, missing: [] };
    }

    const missing = [];
    const { error: hashErr } = await sb.from('profiles').select('password_hash').limit(1);
    if (hashErr) missing.push('password_hash');

    const { error: saltErr } = await sb.from('profiles').select('password_salt').limit(1);
    if (saltErr) missing.push('password_salt');

    if (missing.length > 0) {
      return { ok: false, missing, reason: error.message };
    }

    return { ok: true, missing: [] };
  } catch (e) {
    return { ok: false, missing: ['password_hash', 'password_salt'], reason: e.message };
  }
}

const clientExport = supabase || {};
clientExport.supabase = supabase;
clientExport.getSupabaseAdmin = getSupabaseAdmin;
clientExport.findProfileByEmail = findProfileByEmail;
clientExport.findProfileById = findProfileById;
clientExport.profilesHasPasswordColumns = profilesHasPasswordColumns;

module.exports = clientExport;
