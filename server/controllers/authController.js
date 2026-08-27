// User Authentication & Role Controller for Agrein
//
// Architecture:
//   - Supabase `profiles` is the source of truth for ALL user fields including
//     password_hash / password_salt. Login survives Render free-tier
//     redeploys because nothing is stored on the local filesystem.
//   - `registeredUsers` is a tiny in-memory hot cache for password material
//     within the current process — it's re-populated from Supabase on every
//     login, so it never persists across deploys and never touches disk.
//   - `data/users.json` is no longer used. It exists on disk from older
//     builds but no code reads or writes it.
const otpService = require('../utils/otpService');
const passwordService = require('../utils/passwordService');
const supabaseClient = require('../utils/supabaseClient');
const { getSupabaseAdmin, findProfileByEmail, findProfileById } = supabaseClient;
const jwt = require('jsonwebtoken');

// Inline the JWT expiry so this module doesn't depend on the middleware's
// export shape. The middleware exports a function; some deploys have seen
// `expiresIn is not a function` if that import was reshaped — keeping the
// value here makes the contract local and unmissable.
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '12h';

function mintToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      vs: user.verification_status || 'APPROVED'
    },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Strip the password material before returning a user record to clients.
function toClientUser(user) {
  if (!user) return null;
  const { passwordHash, passwordSalt, ...safe } = user;
  return safe;
}

// ----------------------------------------------------------------------------
// Password material cache
// ----------------------------------------------------------------------------
//
// In-memory only. Populated by login + register (writes go to Supabase; this
// is just a per-process fast path). Wiped on every server restart, which is
// fine because Supabase is the real source of truth.

const registeredUsers = [];

function getCachedPassword(email) {
  if (!email) return null;
  const norm = String(email).toLowerCase();
  const u = registeredUsers.find(x => x.email && x.email.toLowerCase() === norm);
  if (!u) return null;
  return { salt: u.passwordSalt, hash: u.passwordHash, id: u.id };
}

function setCachedPassword(email, id, salt, hash) {
  if (!email) return;
  const norm = String(email).toLowerCase();
  const idx = registeredUsers.findIndex(x => x.email && x.email.toLowerCase() === norm);
  const record = {
    id: id || (idx >= 0 ? registeredUsers[idx].id : `usr-${Date.now()}`),
    email: norm,
    passwordSalt: salt,
    passwordHash: hash
  };
  if (idx >= 0) {
    registeredUsers[idx] = { ...registeredUsers[idx], ...record };
  } else {
    registeredUsers.push(record);
  }

  // Persist to Supabase (the real source of truth). Failures are logged but
  // do not block the response — the caller will surface 503 if Supabase is
  // down entirely. Without this write succeeding, the account cannot log in.
  const sb = getSupabaseAdmin();
  if (!sb) return;
  sb.from('profiles').update({
    password_hash: hash,
    password_salt: salt,
    updated_at: new Date().toISOString()
  }).eq('email', norm).then(({ error }) => {
    if (error) {
      console.warn('[setCachedPassword] Supabase password write failed for', norm, '—', error.message);
    }
  }).catch(e => {
    console.warn('[setCachedPassword] Supabase password write threw:', e.message);
  });
}

// ----------------------------------------------------------------------------
// Startup: seed admin only if not already present in Supabase
// ----------------------------------------------------------------------------
//
// Runs once per process. If Supabase already has the admin row, we leave it
// alone — including any pre-existing password (which is what makes admin login
// survive redeploys). If Supabase is empty for this email, we seed both the
// profile row and the password columns with the default `password123`.
//
// There is no local-file fallback anymore. The admin's password either lives
// in Supabase or it doesn't.

async function ensureAdminSeeded() {
  const adminEmail = 'akobeoladipupo@gmail.com';

  let supabaseAdmin = null;
  try {
    supabaseAdmin = await findProfileByEmail(adminEmail);
  } catch (_) { /* swallow */ }

  if (supabaseAdmin) {
    console.log('✅ Admin user present in Supabase');

    // If the row exists but has no password columns populated (legacy data
    // from before the schema migration), the admin will need a password reset.
    const hasPasswordOnProfile = supabaseAdmin.password_hash && supabaseAdmin.password_salt;
    if (!hasPasswordOnProfile) {
      console.warn('⚠️ Admin row has no password_hash / password_salt — login will fail until a password reset is performed.');
    }
    return;
  }

  // Supabase has no admin row — seed it.
  const adminSeed = passwordService.hashPassword('password123');
  const sb = getSupabaseAdmin();
  if (!sb) {
    console.error('[ensureAdminSeeded] Supabase admin client unavailable — cannot seed admin.');
    return;
  }

  const profilePayload = {
    email: adminEmail,
    full_name: 'Akobe Oladipupo',
    phone_number: '08000000001',
    role: 'ADMIN',
    email_verified: true,
    is_verified: true,
    verification_status: 'APPROVED'
  };

  // Upsert the profile row first (with local_id fallback for the legacy column).
  let profileRes = await sb.from('profiles')
    .upsert({ ...profilePayload, local_id: 'usr-admin-01' }, { onConflict: 'email' })
    .select('*')
    .single();
  if (profileRes.error && /local_id/i.test(profileRes.error.message)) {
    profileRes = await sb.from('profiles')
      .upsert(profilePayload, { onConflict: 'email' })
      .select('*')
      .single();
  }
  if (profileRes.error) {
    console.error('[ensureAdminSeeded] ❌ Supabase seed failed:', profileRes.error.message);
    return;
  }
  console.log('✅ Admin profile seeded into Supabase');

  // Then write the password columns.
  const { error: pwErr } = await sb.from('profiles').update({
    password_hash: adminSeed.hash,
    password_salt: adminSeed.salt,
    updated_at: new Date().toISOString()
  }).eq('email', adminEmail);
  if (pwErr) {
    console.error('[ensureAdminSeeded] ❌ admin password write failed:', pwErr.message);
    return;
  }
  console.log('✅ Admin password seeded into Supabase (default password: password123)');

  // Populate the in-memory cache so a subsequent login in this process
  // doesn't have to round-trip Supabase just for password material.
  setCachedPassword(adminEmail, profileRes.data.id, adminSeed.salt, adminSeed.hash);
}

// Fire-and-forget so module load doesn't block. Errors are logged inside.
ensureAdminSeeded().catch(err => console.error('[ensureAdminSeeded] fatal:', err));

// ----------------------------------------------------------------------------
// Record helpers: Supabase-only. No more local-file fallback for user records.
// ----------------------------------------------------------------------------

// Fetch a user record (with password material) from Supabase by email.
// Returns null when nothing is found or Supabase is unreachable.
async function findUserRecordByEmail(email) {
  if (!email) return null;
  const norm = String(email).toLowerCase();
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const profile = await findProfileByEmail(norm);
  return profile ? profileToRecord(profile) : null;
}

async function findUserRecordById(id) {
  if (!id) return null;
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const profile = await findProfileById(id);
  return profile ? profileToRecord(profile) : null;
}

// Convert a Supabase profile row to the shape the rest of the controller uses.
// Password material comes from the password_hash / password_salt columns on
// profiles — Supabase is the only source of truth. The in-memory cache is a
// per-process fast path: it may be populated for users who registered or
// logged in within this process. If neither has it (e.g. another instance
// registered the user), we treat the user as needing a password reset.
function profileToRecord(profile) {
  if (!profile) return null;
  let salt = profile.password_salt || null;
  let hash = profile.password_hash || null;
  if (!salt || !hash) {
    const cred = getCachedPassword(profile.email);
    if (cred) {
      salt = salt || cred.salt;
      hash = hash || cred.hash;
    }
  }
  return {
    id: profile.id,
    local_id: profile.local_id || null,
    full_name: profile.full_name || '',
    email: profile.email,
    phone_number: profile.phone_number || '',
    role: String(profile.role || 'BUYER').toUpperCase(),
    email_verified: Boolean(profile.email_verified),
    is_verified: Boolean(profile.is_verified),
    verification_status: profile.verification_status || 'APPROVED',
    state: profile.state || '',
    lga: profile.lga || '',
    city: profile.city || '',
    address: profile.address || '',
    marketing_consent: Boolean(profile.marketing_consent),
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    deletion_pending: Boolean(profile.deletion_pending),
    deletion_requested_at: profile.deletion_requested_at || null,
    deletion_scheduled_for: profile.deletion_scheduled_for || null,
    deletion_request_reason: profile.deletion_request_reason || null,
    passwordSalt: salt,
    passwordHash: hash
  };
}

// No more local-file fallback — `localToRecord` removed. All records come from
// Supabase via `profileToRecord` above.

// Persist a record to Supabase. Returns the canonical Supabase UUID. Local
// cache is updated with any new password material.
async function persistUserToSupabase(user) {
  const sb = getSupabaseAdmin();
  if (!sb) return null;

  // Strip password fields — they're not in the schema. Strip legacy `id`
  // unless it's already a UUID; Supabase generates one otherwise.
  const payload = {
    email: user.email,
    full_name: user.full_name,
    phone_number: user.phone_number || null,
    role: String(user.role || 'BUYER').toUpperCase(),
    email_verified: Boolean(user.email_verified),
    is_verified: Boolean(user.is_verified),
    verification_status: user.verification_status || 'APPROVED',
    state: user.state || null,
    lga: user.lga || null,
    city: user.city || null,
    address: user.address || null,
    marketing_consent: Boolean(user.marketing_consent),
    created_at: user.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // local_id is added by an optional migration (see database/schema.sql). If
  // the column hasn't been added yet we silently drop the field rather than
  // fail the upsert — backward-compat for the brief window before the
  // migration is applied.
  if (user.local_id || (typeof user.id === 'string' && !user.id.includes('-'))) {
    payload.local_id = user.local_id || user.id;
  }

  // Build a select that includes local_id only if we know the column exists.
  // Probe by trying with local_id first; on schema-cache error retry without.
  let result = await sb.from('profiles').upsert(payload, { onConflict: 'email' }).select('id, email, local_id').single();
  if (result.error && /local_id/i.test(result.error.message)) {
    delete payload.local_id;
    result = await sb.from('profiles').upsert(payload, { onConflict: 'email' }).select('id, email').single();
  }
  const { data, error } = result;

  if (error) {
    console.error('[persistUserToSupabase] ❌ upsert failed for', user.email, '—', error.message);
    return null;
  }

  // Mirror password material into the local cache + file.
  if (user.passwordSalt && user.passwordHash) {
    setCachedPassword(user.email, data.id, user.passwordSalt, user.passwordHash);
  }

  return data;
}

// ----------------------------------------------------------------------------
// Controller
// ----------------------------------------------------------------------------

const authController = {
  // Query all registered users — Supabase is the source of truth.
  async getRegisteredUsers(req, res) {
    try {
      const { role, q } = req.query;
      const sb = getSupabaseAdmin();
      let users = [];

      if (sb) {
        const { data, error } = await sb.from('profiles').select('*');
        if (error) throw error;
        users = (data || []).map(profileToRecord);
      } else {
        users = [];
      }

      // Filter by Role
      if (role && role !== 'ALL') {
        const normRole = role.toUpperCase();
        users = users.filter(u => u.role === normRole);
      }

      // Search Query Filter
      if (q) {
        const search = q.toLowerCase();
        users = users.filter(u =>
          (u.full_name && u.full_name.toLowerCase().includes(search)) ||
          (u.email && u.email.toLowerCase().includes(search)) ||
          (u.phone_number && String(u.phone_number).includes(search))
        );
      }

      const safeUsers = users.map(toClientUser);

      res.json({
        success: true,
        total: safeUsers.length,
        counts: {
          total: safeUsers.length,
          farmers: safeUsers.filter(u => u.role === 'FARMER').length,
          buyers: safeUsers.filter(u => u.role === 'BUYER').length,
          admins: safeUsers.filter(u => u.role === 'ADMIN').length
        },
        users: safeUsers
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Admin: Update a farmer's verification status.
  async updateUserVerificationStatus(req, res) {
    try {
      const { email, status } = req.body;
      if (!email || !status) {
        return res.status(400).json({ success: false, message: 'Email and verification status are required.' });
      }
      const normalizedEmail = email.toLowerCase();
      const sb = getSupabaseAdmin();
      if (!sb) return res.status(503).json({ success: false, message: 'Auth database unavailable.' });

      const newStatus = status.toUpperCase();
      const updates = { verification_status: newStatus, updated_at: new Date().toISOString() };
      if (newStatus === 'APPROVED') updates.is_verified = true;

      const { data, error } = await sb
        .from('profiles')
        .update(updates)
        .eq('email', normalizedEmail)
        .select('*')
        .maybeSingle();
      if (error) throw error;
      if (!data) return res.status(404).json({ success: false, message: 'User not found in database.' });

      const updated = profileToRecord(data);
      res.json({
        success: true,
        message: `Verification status updated to ${updated.verification_status} for ${updated.email}.`,
        user: toClientUser(updated)
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Public Sign Up for BUYER and FARMER -> Triggers Email OTP
  async register(req, res) {
    try {
      const { fullName, email, phone, password, role } = req.body;

      if (!fullName || !email || !password || !role) {
        return res.status(400).json({ success: false, message: 'Full name, email, password, and role are required.' });
      }

      const normalizedRole = role.toUpperCase();
      const normalizedEmail = email.toLowerCase();

      // Security Alert: Prohibit public creation of ADMIN or DELIVERY_PARTNER roles
      if (normalizedRole === 'ADMIN' || normalizedRole === 'DELIVERY_PARTNER') {
        return res.status(403).json({
          success: false,
          message: 'Security Alert: Administrator accounts cannot be created via public registration.'
        });
      }

      if (!password || password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
      }

      const sb = getSupabaseAdmin();
      if (!sb) {
        return res.status(503).json({ success: false, message: 'Auth database unavailable. Please try again shortly.' });
      }

      // Check for an existing account with this email.
      const existing = await findProfileByEmail(normalizedEmail);
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email address already exists. Please log in.' });
      }

      const { salt, hash } = passwordService.hashPassword(password);
      const localId = `usr-${Date.now()}`;

      // Compose the payload that will live in Supabase.
      // Both Farmers and Buyers require Email OTP verification.
      const profilePayload = {
        email: normalizedEmail,
        full_name: fullName,
        phone_number: phone || null,
        role: normalizedRole,
        email_verified: false,
        is_verified: false,
        verification_status: normalizedRole === 'FARMER' ? 'NOT_STARTED' : 'APPROVED'
      };

      // local_id is optional (depends on the schema migration). Try it first;
      // if the column doesn't exist yet, retry without.
      let upsertRes = await sb.from('profiles').upsert({ ...profilePayload, local_id: localId }, { onConflict: 'email' }).select('*').single();
      if (upsertRes.error && /local_id/i.test(upsertRes.error.message)) {
        upsertRes = await sb.from('profiles').upsert(profilePayload, { onConflict: 'email' }).select('*').single();
      }
      const { data: persisted, error } = upsertRes;
      if (error) {
        console.error('[register] ❌ Supabase upsert failed:', error.message);
        return res.status(500).json({ success: false, message: 'Could not create account. Please try again.' });
      }

      // Mirror password material into local cache + file. (Supabase is the
      // real source of truth via the password_hash / password_salt columns.)
      let passwordPersisted = true;
      try {
        setCachedPassword(persisted.email, persisted.id, salt, hash);
      } catch (e) {
        passwordPersisted = false;
        console.warn('[register] ⚠️ local password persist failed:', e.message);
      }

      const target = profileToRecord(persisted);

      // Dispatch 6-digit Email OTP to both Farmers and Buyers
      otpService.generateOtp(normalizedEmail);

      res.status(201).json({
        success: true,
        requiresOtp: true,
        message: `Account created for ${target.email}. A 6-digit verification code has been sent to your email.`,
        email: target.email,
        role: target.role,
        passwordPersisted
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Verify 6-digit OTP
  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and 6-digit verification code are required.' });
      }

      const result = otpService.verifyOtp(email, otp);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          reason: result.reason,
          message: result.message,
          attemptsRemaining: result.attemptsRemaining
        });
      }

      const normalizedEmail = email.toLowerCase();
      const sb = getSupabaseAdmin();
      if (!sb) {
        return res.status(503).json({ success: false, message: 'Auth database unavailable.' });
      }

      let profile = await findProfileByEmail(normalizedEmail);
      if (!profile) {
        // OTP was valid but we have no profile — create a default buyer.
        const { data, error } = await sb.from('profiles').upsert({
          email: normalizedEmail,
          full_name: normalizedEmail.split('@')[0],
          role: 'BUYER',
          email_verified: true,
          is_verified: false,
          verification_status: 'APPROVED'
        }, { onConflict: 'email' }).select('*').single();
        if (error) throw error;
        profile = data;
      } else {
        // Flip email_verified and (for new farmers) push into the KYC queue.
        const updates = { email_verified: true, updated_at: new Date().toISOString() };
        if (profile.role === 'FARMER' && profile.verification_status === 'NOT_STARTED') {
          updates.verification_status = 'PENDING';
        }
        const { data, error } = await sb.from('profiles').update(updates).eq('email', normalizedEmail).select('*').single();
        if (error) throw error;
        profile = data;
      }

      const user = profileToRecord(profile);
      const redirectView = user.role === 'FARMER' ? 'farmer-verification' : 'buyer-dashboard';

      res.json({
        success: true,
        message: '✓ Email Verified Successfully. Your email has been verified.',
        email_verified: true,
        user: {
          ...toClientUser(user),
          token: mintToken(user)
        },
        redirectView
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Resend OTP
  async resendOtp(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email address required.' });
      }

      const result = otpService.resendOtp(email);
      if (!result.success) {
        return res.status(429).json({
          success: false,
          inCooldown: true,
          secondsLeft: result.secondsLeft,
          message: result.message
        });
      }

      res.json({
        success: true,
        message: result.message,
        email,
        expiresInSeconds: 300
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // User Login — verifies email + password.
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required.' });
      }

      const normalizedEmail = email.toLowerCase();
      const sb = getSupabaseAdmin();

      // Locate the user record. Supabase first; local file as offline fallback.
      let user = null;
      if (sb) {
        const profile = await findProfileByEmail(normalizedEmail);
        if (profile) user = profileToRecord(profile);
      } else {
        user = findUserRecordByEmail(normalizedEmail);
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      // Password verification — from the local cache.
      if (!user.passwordHash || !passwordService.verifyPassword(password, user.passwordSalt, user.passwordHash)) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      // Check if email has been verified via 6-digit OTP
      if (!user.email_verified) {
        otpService.generateOtp(normalizedEmail);
        return res.status(403).json({
          success: false,
          emailVerificationRequired: true,
          email: user.email,
          role: user.role,
          message: 'Please verify your email address. A 6-digit verification code has been sent to your email.'
        });
      }

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          ...toClientUser(user),
          token: mintToken(user)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Secure Admin-Only creation of new Administrator accounts
  async createAdminAccount(req, res) {
    try {
      const { fullName, email, password } = req.body || {};

      if (req.user && req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Forbidden: Only existing Admins can create new Admin accounts.' });
      }

      if (!fullName || !email || !password) {
        return res.status(400).json({ success: false, message: 'fullName, email, and password are required.' });
      }
      const normalizedEmail = String(email).toLowerCase();
      if (!normalizedEmail.includes('@')) {
        return res.status(400).json({ success: false, message: 'A valid email is required.' });
      }
      if (String(password).length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
      }

      const sb = getSupabaseAdmin();
      if (!sb) return res.status(503).json({ success: false, message: 'Auth database unavailable.' });

      const existing = await findProfileByEmail(normalizedEmail);
      if (existing) {
        return res.status(409).json({ success: false, message: 'An account with that email already exists.' });
      }

      const { salt, hash } = passwordService.hashPassword(password);
      const localId = `usr-${Date.now()}`;

      const adminPayload = {
        email: normalizedEmail,
        full_name: fullName,
        role: 'ADMIN',
        email_verified: true,
        is_verified: true,
        verification_status: 'APPROVED'
      };
      let adminRes = await sb.from('profiles').upsert({ ...adminPayload, local_id: localId }, { onConflict: 'email' }).select('*').single();
      if (adminRes.error && /local_id/i.test(adminRes.error.message)) {
        adminRes = await sb.from('profiles').upsert(adminPayload, { onConflict: 'email' }).select('*').single();
      }
      const { data, error } = adminRes;
      if (error) throw error;

      setCachedPassword(data.email, data.id, salt, hash);

      const newAdmin = profileToRecord(data);
      res.status(201).json({
        success: true,
        message: `Admin account created for ${fullName} (${normalizedEmail}).`,
        admin: toClientUser(newAdmin)
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Self-service: flag this account for deletion. After 14 days an Admin can
  // approve the purge. The user may cancel any time before approval.
  async requestAccountDeletion(req, res) {
    try {
      const email = (req.user && req.user.email) || (req.headers['x-user-email'] || '').toLowerCase();
      if (!email) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }
      const user = await findUserRecordByEmail(email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Account not found.' });
      }

      if (user.role === 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Administrator accounts cannot self-delete. Please contact another Agrein administrator.'
        });
      }

      if (user.deletion_pending) {
        return res.status(400).json({
          success: false,
          alreadyPending: true,
          scheduledFor: user.deletion_scheduled_for || null,
          message: 'A deletion request is already pending for this account.'
        });
      }

      const { reason } = req.body || {};
      const requestedAt = new Date();
      const scheduledFor = new Date(requestedAt.getTime() + DELETION_GRACE_DAYS * 24 * 60 * 60 * 1000);

      const sb = getSupabaseAdmin();
      if (!sb) return res.status(503).json({ success: false, message: 'Auth database unavailable.' });

      const updates = {
        deletion_pending: true,
        deletion_requested_at: requestedAt.toISOString(),
        deletion_scheduled_for: scheduledFor.toISOString(),
        deletion_request_reason: (reason || '').trim() || 'No reason provided.',
        updated_at: new Date().toISOString()
      };
      const { error } = await sb.from('profiles').update(updates).eq('email', email);
      if (error) throw error;

      logDeletionAudit({
        action: 'DELETION_REQUESTED',
        user_id: user.id,
        user_email: user.email,
        user_role: user.role,
        actor_email: user.email,
        reason: updates.deletion_request_reason,
        scheduled_for: updates.deletion_scheduled_for
      });

      res.json({
        success: true,
        message: `Deletion requested. Your account will be permanently removed on ${scheduledFor.toDateString()} unless cancelled.`,
        scheduledFor: updates.deletion_scheduled_for,
        daysRemaining: DELETION_GRACE_DAYS
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Self-service: cancel a pending deletion request within the 14-day window.
  async cancelAccountDeletion(req, res) {
    try {
      const email = (req.user && req.user.email) || (req.headers['x-user-email'] || '').toLowerCase();
      if (!email) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }
      const user = await findUserRecordByEmail(email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Account not found.' });
      }
      if (!user.deletion_pending) {
        return res.status(400).json({ success: false, message: 'No deletion request is currently pending for this account.' });
      }

      const sb = getSupabaseAdmin();
      if (!sb) return res.status(503).json({ success: false, message: 'Auth database unavailable.' });

      const { error } = await sb.from('profiles').update({
        deletion_pending: false,
        deletion_requested_at: null,
        deletion_scheduled_for: null,
        deletion_request_reason: null,
        updated_at: new Date().toISOString()
      }).eq('email', email);
      if (error) throw error;

      logDeletionAudit({
        action: 'DELETION_CANCELLED_BY_USER',
        user_id: user.id,
        user_email: user.email,
        user_role: user.role,
        actor_email: user.email,
        previous_scheduled_for: user.deletion_scheduled_for
      });

      res.json({
        success: true,
        message: 'Deletion request cancelled. Your account is fully restored.'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Admin: list every account flagged for deletion.
  async adminGetDeletionQueue(req, res) {
    try {
      const sb = getSupabaseAdmin();
      let requests = [];
      if (sb) {
        const { data, error } = await sb.from('profiles').select('*').eq('deletion_pending', true);
        if (error) throw error;
        requests = (data || []).map(profileToRecord).map(u => ({
          ...toClientUser(u),
          days_remaining: u.deletion_scheduled_for
            ? Math.max(0, Math.ceil((new Date(u.deletion_scheduled_for).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
            : null
        }));
      }
      res.json({
        success: true,
        requests,
        auditLogs: mockDeletionAuditLogs.slice(0, 50),
        metrics: {
          total_pending: requests.length,
          grace_window_days: DELETION_GRACE_DAYS
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Admin: approve (purge) or reject (restore) a pending deletion request.
  async adminResolveDeletionRequest(req, res) {
    try {
      const { id } = req.params;
      const { decision, reason } = req.body || {};
      if (!decision || (decision !== 'APPROVE' && decision !== 'CANCEL')) {
        return res.status(400).json({ success: false, message: "decision must be 'APPROVE' or 'CANCEL'." });
      }
      if (!reason || !reason.trim()) {
        return res.status(400).json({ success: false, message: 'Mandatory reason required when resolving a deletion request.' });
      }

      const user = await findUserRecordById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Account not found.' });
      }
      if (!user.deletion_pending) {
        return res.status(400).json({ success: false, message: 'No deletion request is pending for this account.' });
      }

      const actorEmail = (req.user && req.user.email) || 'admin@agrein.ng';
      const sb = getSupabaseAdmin();
      if (!sb) return res.status(503).json({ success: false, message: 'Auth database unavailable.' });

      if (decision === 'APPROVE') {
        const { error } = await sb.from('profiles').delete().eq('id', user.id);
        if (error) throw error;
        // Best-effort: drop the local password cache entry too.
        const idx = registeredUsers.findIndex(u => u.email && u.email.toLowerCase() === user.email.toLowerCase());
        if (idx >= 0) registeredUsers.splice(idx, 1);

        logDeletionAudit({
          action: 'ACCOUNT_PURGED_BY_ADMIN',
          user_id: user.id,
          user_email: user.email,
          user_role: user.role,
          actor_email: actorEmail,
          reason: reason.trim()
        });
        return res.json({
          success: true,
          message: `Account ${user.email} has been permanently removed.`,
          purgedUser: { id: user.id, email: user.email }
        });
      }

      // CANCEL: clear pending flags
      const { error } = await sb.from('profiles').update({
        deletion_pending: false,
        deletion_requested_at: null,
        deletion_scheduled_for: null,
        deletion_request_reason: null,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
      if (error) throw error;

      logDeletionAudit({
        action: 'DELETION_REJECTED_BY_ADMIN',
        user_id: user.id,
        user_email: user.email,
        user_role: user.role,
        actor_email: actorEmail,
        reason: reason.trim()
      });
      res.json({
        success: true,
        message: `Deletion request for ${user.email} rejected. Account restored.`,
        restoredUser: { id: user.id, email: user.email }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Public: request a 6-digit OTP for password reset. Always return success
  // + a generic message even when no account exists — prevents enumeration.
  async forgotPassword(req, res) {
    try {
      const { email } = req.body || {};
      const GENERIC = 'If an account exists for that email, a 6-digit code has been sent.';

      if (!email) {
        return res.status(400).json({ success: false, message: 'Email address required.' });
      }

      const normalizedEmail = String(email).toLowerCase();
      const user = await findUserRecordByEmail(normalizedEmail);

      if (!user) {
        console.log(`[forgotPassword] No account for ${normalizedEmail} (returning generic success).`);
        return res.json({ success: true, message: GENERIC, expiresInSeconds: 300 });
      }

      otpService.generateOtp(normalizedEmail);
      res.json({ success: true, message: GENERIC, expiresInSeconds: 300 });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Public: verify OTP + write a new password.
  async resetPassword(req, res) {
    try {
      const { email, otp, newPassword } = req.body || {};

      if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: 'Email, verification code, and new password are required.' });
      }

      const normalizedEmail = String(email).toLowerCase();
      const user = await findUserRecordByEmail(normalizedEmail);
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found for that email.' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
      }
      if (!/[A-Z]/.test(newPassword)) {
        return res.status(400).json({ success: false, message: 'New password must contain at least 1 uppercase letter (A-Z).' });
      }
      if (!/[a-z]/.test(newPassword)) {
        return res.status(400).json({ success: false, message: 'New password must contain at least 1 lowercase letter (a-z).' });
      }
      if (!/[0-9]/.test(newPassword)) {
        return res.status(400).json({ success: false, message: 'New password must contain at least 1 number (0-9).' });
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        return res.status(400).json({ success: false, message: 'New password must contain at least 1 special character.' });
      }

      const otpResult = otpService.verifyOtp(normalizedEmail, otp);
      if (!otpResult.success) {
        return res.status(400).json({
          success: false,
          reason: otpResult.reason,
          message: otpResult.message,
          attemptsRemaining: otpResult.attemptsRemaining
        });
      }

      const { salt, hash } = passwordService.hashPassword(newPassword);
      setCachedPassword(normalizedEmail, user.id, salt, hash);

      res.json({
        success: true,
        message: 'Password reset successfully. You can now log in with your new password.'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Authenticated profile update — caller identified by x-user-email header
  async updateProfile(req, res) {
    try {
      const { fullName, phone, state, lga, city, address, marketingConsent } = req.body || {};
      const email = (req.user && req.user.email) || (req.headers['x-user-email'] || '').toLowerCase();
      if (!email) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const sb = getSupabaseAdmin();
      if (!sb) return res.status(503).json({ success: false, message: 'Auth database unavailable.' });

      const existing = await findProfileByEmail(email);
      if (!existing) return res.status(404).json({ success: false, message: 'Account not found.' });

      const nextFullName = (fullName || existing.full_name || '').trim();
      if (!nextFullName) {
        return res.status(400).json({ success: false, message: 'Full name is required.' });
      }

      const updates = {
        full_name: nextFullName,
        phone_number: phone || existing.phone_number || null,
        state: state || existing.state || null,
        lga: lga || existing.lga || null,
        city: city || existing.city || null,
        address: address || existing.address || null,
        updated_at: new Date().toISOString()
      };
      if (typeof marketingConsent !== 'undefined') {
        updates.marketing_consent = Boolean(marketingConsent === true || marketingConsent === 'true' || marketingConsent === 'yes' || marketingConsent === 'YES' || marketingConsent === 1 || marketingConsent === '1');
      }

      const { data, error } = await sb.from('profiles').update(updates).eq('email', email).select('*').single();
      if (error) throw error;

      const user = profileToRecord(data);
      res.json({
        success: true,
        message: 'Profile updated successfully.',
        user: toClientUser(user)
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Authenticated password change — caller identified by x-user-email header
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Current and new password are required.' });
      }

      const email = (req.user && req.user.email) || (req.headers['x-user-email'] || '').toLowerCase();
      if (!email) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const user = await findUserRecordByEmail(email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Account not found.' });
      }

      if (!passwordService.verifyPassword(currentPassword, user.passwordSalt, user.passwordHash)) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
      }

      const { salt, hash } = passwordService.hashPassword(newPassword);
      setCachedPassword(email, user.id, salt, hash);

      res.json({
        success: true,
        message: 'Password updated successfully. Please use your new password next time you sign in.'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Used by middleware/auth.js to look up user records. Async because Supabase
// is the source of truth. Falls back to the local cache if Supabase errors.
authController.findUserByEmail = async (email) => {
  if (!email) return null;
  try {
    return await findUserRecordByEmail(email);
  } catch (e) {
    console.warn('[findUserByEmail] fallback:', e.message);
    return findUserRecordByEmailOffline(email);
  }
};

authController.findUserById = async (id) => {
  if (!id) return null;
  try {
    return await findUserRecordById(id);
  } catch (e) {
    console.warn('[findUserById] error:', e.message);
    return null;
  }
};

// `findUserRecordByEmailOffline` removed — there is no local-file fallback
// for user records anymore. All reads go through Supabase.

// Append-only audit log of deletion-related actions (in-memory only; survives
// the lifetime of the server process — useful for debugging without writing
// audit records to disk or Supabase).
let mockDeletionAuditLogs = [];

function logDeletionAudit(entry) {
  const log = {
    id: `dlog-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    created_at: new Date().toISOString(),
    ...entry
  };
  mockDeletionAuditLogs.unshift(log);
  if (mockDeletionAuditLogs.length > 200) mockDeletionAuditLogs.length = 200;
  return log;
}

const DELETION_GRACE_DAYS = 14;

module.exports = authController;
