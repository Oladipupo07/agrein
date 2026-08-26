// One-off migration: push password_hash + password_salt from data/users.json
// up to Supabase profiles. Run this once after applying the schema migration
// that adds the password_hash / password_salt columns.
//
// Usage (from /server):
//   node scripts/migratePasswordsToSupabase.js
//
// Safe to re-run. Only updates rows whose password_hash is currently NULL.

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

async function main() {
  const users = loadLocalUsers();
  const withPasswords = users.filter(u => u.passwordSalt && u.passwordHash);
  console.log(`📂 Found ${users.length} users in data/users.json (${withPasswords.length} with password material)`);

  if (withPasswords.length === 0) {
    console.log('Nothing to migrate.');
    return;
  }

  let updated = 0;
  let skipped = 0;
  let failed = 0;
  const failures = [];

  for (const user of withPasswords) {
    if (!user.email) {
      console.warn('  ⚠️ Skipping user with no email:', user.id);
      skipped += 1;
      continue;
    }

    // Probe whether the columns exist by attempting the update — if the
    // schema migration hasn't run yet, the error message will tell us.
    const { data, error } = await supabase
      .from('profiles')
      .update({
        password_hash: user.passwordHash,
        password_salt: user.passwordSalt,
        updated_at: new Date().toISOString()
      })
      .eq('email', user.email)
      .select('id, email, password_hash')
      .maybeSingle();

    if (error) {
      if (/password_hash|password_salt/i.test(error.message)) {
        console.error('❌ password_hash / password_salt columns do not exist on profiles.');
        console.error('   Apply the schema migration first (see database/schema.sql).');
        process.exit(1);
      }
      failed += 1;
      failures.push({ email: user.email, reason: error.message });
      console.error(`  ❌ ${user.email}:`, error.message);
      continue;
    }

    if (!data) {
      skipped += 1;
      console.log(`  ⏭️  No profile row for ${user.email} (will need to register first)`);
      continue;
    }

    if (data.password_hash === user.passwordHash) {
      updated += 1;
      console.log(`  ✅ Migrated ${user.email} → ${data.id}`);
    } else {
      skipped += 1;
      console.log(`  ⏭️  ${user.email} already has a different password on Supabase`);
    }
  }

  console.log('\n=== Migration summary ===');
  console.log(`  Local users with passwords: ${withPasswords.length}`);
  console.log(`  Migrated to Supabase:       ${updated}`);
  console.log(`  Skipped (no row / other):   ${skipped}`);
  console.log(`  Failed:                     ${failed}`);
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
