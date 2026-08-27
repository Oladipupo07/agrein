// One-off migration: reads data/users.json and upserts every record into the
// Supabase `profiles` table. Use this whenever the local file has drifted ahead
// of Supabase (typically after a deploy that lacked the live sync code, or a
// Supabase outage that swallowed earlier writes).
//
// Usage (from /server):
//   node scripts/backfillUsersToSupabase.js
//
// Safe to re-run — the upsert is keyed on `email`.

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

const USERS_DB_PATH = path.join(__dirname, '..', '..', 'data', 'users.json');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in server/.env');
  process.exit(1);
}

function loadLocalUsers() {
  if (!fs.existsSync(USERS_DB_PATH)) {
    console.error('❌ No data/users.json file found at', USERS_DB_PATH);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(USERS_DB_PATH, 'utf8')) || [];
}

function toProfilePayload(u) {
  // The Supabase `id` column is a UUID. Local ids look like `usr-1787043912356`,
  // so we let the DB default (uuid_generate_v4) generate one and key the upsert
  // on email instead. This avoids "invalid input syntax for type uuid" errors.
  //
  // We also persist the legacy local_id so the middleware can resolve either
  // format during the transition window. `local_id` is an optional column —
  // the schema migration may not have run yet, in which case we omit it.
  const payload = {
    email: u.email,
    full_name: u.full_name || (u.email || '').split('@')[0],
    phone_number: u.phone_number || null,
    role: (u.role || 'BUYER').toUpperCase(),
    email_verified: Boolean(u.email_verified),
    is_verified: Boolean(u.is_verified),
    verification_status: u.verification_status || 'APPROVED',
    created_at: u.created_at || new Date().toISOString()
  };
  if (typeof u.id === 'string' && !u.id.includes('-')) {
    payload.local_id = u.id;
  }
  return payload;
}

async function main() {
  const users = loadLocalUsers();
  console.log(`📂 Found ${users.length} users in data/users.json`);

  // Show what Supabase already has so we can compare after the run.
  const { count: existing } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  console.log(`🗄️  Supabase currently has ${existing} profiles`);

  let created = 0;
  let updated = 0;
  let failed = 0;
  let localIdBackfilled = 0;
  const failures = [];

  for (const user of users) {
    if (!user.email) {
      console.warn('  ⚠️ Skipping user with no email:', user.id);
      continue;
    }

    const payload = toProfilePayload(user);

    // `onConflict: 'email'` makes this an upsert keyed on the unique email column.
    let result = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'email' })
      .select('id, email, local_id, created_at')
      .single();

    // If `local_id` column doesn't exist (migration not yet applied), retry without it.
    if (result.error && /local_id/i.test(result.error.message)) {
      const { local_id, ...retryPayload } = payload;
      result = await supabase
        .from('profiles')
        .upsert(retryPayload, { onConflict: 'email' })
        .select('id, email, created_at')
        .single();
    }

    const { data, error } = result;

    if (error) {
      failed += 1;
      failures.push({ email: user.email, reason: error.message });
      console.error(`  ❌ ${user.email}:`, error.message);
      continue;
    }

    if (payload.local_id && data.local_id === payload.local_id) {
      localIdBackfilled += 1;
    }

    // Heuristic: if Supabase created_at is within a second of our payload, it's a fresh insert.
    const wasInsert = data && payload.created_at
      && Math.abs(new Date(data.created_at).getTime() - new Date(payload.created_at).getTime()) < 1000;
    if (wasInsert) {
      created += 1;
      console.log(`  ✨ Created  ${user.email} → ${data.id}${data.local_id ? ` (local_id=${data.local_id})` : ''}`);
    } else {
      updated += 1;
      console.log(`  📝 Updated  ${user.email} → ${data.id}${data.local_id ? ` (local_id=${data.local_id})` : ''}`);
    }
  }

  const { count: after } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  console.log('\n=== Backfill summary ===');
  console.log(`  Local users read      : ${users.length}`);
  console.log(`  Supabase before       : ${existing}`);
  console.log(`  Supabase after        : ${after}`);
  console.log(`  Newly created         : ${created}`);
  console.log(`  Updated existing      : ${updated}`);
  console.log(`  local_id backfilled   : ${localIdBackfilled}`);
  console.log(`  Failed                : ${failed}`);
  if (failures.length) {
    console.log('\n  Failures:');
    failures.forEach(f => console.log(`    - ${f.email}: ${f.reason}`));
  }
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
  });
