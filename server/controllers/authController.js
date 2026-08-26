// User Authentication & Role Controller for Agrein with Email OTP Verification
//
// Architecture (post-refactor):
//   - Supabase `profiles` is the source of truth for all user RECORDS
//     (email, role, verification_status, full_name, phone_number, etc).
//   - `data/users.json` is the source of truth for password material
//     (`passwordHash`, `passwordSalt`). Supabase `profiles` has no password
//     columns, so passwords cannot live there without a schema change.
//   - `registeredUsers` (the in-memory array) is a write-through cache for the
//     password file, kept hot so login doesn't hit the disk on every request.
//   - On every record write we update Supabase first (await), then mirror to
//     the local cache + file. Reads prefer Supabase; the local cache is a
//     fallback for password verification.
const otpService = require('../utils/otpService');
const passwordService = require('../utils/passwordService');
const { UserDatabase } = require('../utils/userDatabase');
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
// We keep a per-email key/value cache of passwordSalt + passwordHash so the
// login flow doesn't re-read users.json on every request. The cache is loaded
// from disk on startup and updated whenever a registration or password change
// mutates the file.
//
// Why we keep passwords out of Supabase: the existing schema doesn't have
// password columns on `profiles`. Adding them would be a separate migration.
// Until then, this file remains the only place password material lives.

let registeredUsers = UserDatabase.loadAll();

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
  // Persist to disk best-effort.
  try { UserDatabase.upsert(record); } catch (e) {
    console.warn('[authController] local password persist failed:', e.message);
  }
}

// ----------------------------------------------------------------------------
// Startup: seed admin only if not already present anywhere
// ----------------------------------------------------------------------------
//
// The previous implementation re-seeded the admin every time the local file
// was empty (which happens after every Render redeploy). That broke admin
// login because the password hash changed. Now we only seed if neither the
// local cache nor Supabase has the admin email yet — so the seed runs at
// most once per environment.

async function ensureAdminSeeded() {
  const adminEmail = 'akobeoladipupo@gmail.com';

  // Hot cache hit?
  if (registeredUsers.some(u => u.email && u.email.toLowerCase() === adminEmail)) {
    console.log('✅ Admin user present in local cache');
  }

  // Supabase hit?
  let supabaseAdmin = null;
  try {
    supabaseAdmin = await findProfileByEmail(adminEmail);
  } catch (_) { /* swallow */ }
  if (supabaseAdmin) {
    console.log('✅ Admin user present in Supabase');
    // Mirror password into cache from disk if not already there.
    if (!getCachedPassword(adminEmail)) {
      const fromDisk = registeredUsers.find(u => u.email && u.email.toLowerCase() === adminEmail);
      if (!fromDisk) {
        // No local record — can't recover the original password hash from Supabase.
        console.warn('⚠️ Admin exists in Supabase but not locally. Password reset required.');
      }
    }
    return;
  }

  // Neither place has the admin — seed it.
  const adminSeed = passwordService.hashPassword('password123');
  const adminUser = {
    id: 'usr-admin-01',
    full_name: 'Akobe Oladipupo',
    email: adminEmail,
    phone_number: '08000000001',
    role: 'ADMIN',
    email_verified: true,
    is_verified: true,
    verification_status: 'APPROVED',
    passwordSalt: adminSeed.salt,
    passwordHash: adminSeed.hash,
    created_at: new Date().toISOString()
  };

  // Persist to Supabase first.
  const sb = getSupabaseAdmin();
  if (sb) {
    const payload = { ...adminUser };
    delete payload.passwordHash;
    delete payload.passwordSalt;
    const { error } = await sb.from('profiles').upsert(payload, { onConflict: 'email' });
    if (error) {
      console.error('[ensureAdminSeeded] ❌ Supabase seed failed:', error.message);
    } else {
      console.log('✅ Admin user seeded into Supabase');
    }
  }

  // Save password to local file + cache.
  setCachedPassword(adminUser.email, adminUser.id, adminSeed.salt, adminSeed.hash);
  console.log('✅ Admin password seeded locally (password: password123)');
}

// Fire-and-forget so module load doesn't block. Errors are logged inside.
ensureAdminSeeded().catch(err => console.error('[ensureAdminSeeded] fatal:', err));

// ----------------------------------------------------------------------------
// Record helpers: Supabase-first, with a graceful fallback to local file for
// offline reads. The local file is treated as a hint, not authoritative.
// ----------------------------------------------------------------------------

// Fetch a user record (without password) from Supabase. Falls back to the
// local file if Supabase errors. Returns null when nothing is found.
async function findUserRecordByEmail(email) {
  if (!email) return null;
  const norm = String(email).toLowerCase();
  const sb = getSupabaseAdmin();
  if (sb) {
    const profile = await findProfileByEmail(norm);
    if (profile) {
      return profileToRecord(profile);
    }
    // Supabase reachable but no row — user genuinely doesn't exist.
    return null;
  }
  // No Supabase: fall back to local file (offline mode).
  const local = registeredUsers.find(u => u.email && u.email.toLowerCase() === norm);
  return local ? localToRecord(local) : null;
}

async function findUserRecordById(id) {
  if (!id) return null;
  const sb = getSupabaseAdmin();
  if (sb) {
    const profile = await findProfileById(id);
    if (profile) return profileToRecord(profile);
    return null;
  }
  const local = registeredUsers.find(u => u.id === id);
  return local ? localToRecord(local) : null;
}

// Convert a Supabase profile row to the shape the rest of the controller uses.
// The local cache contributes password material so login can still verify.
function profileToRecord(profile) {
  if (!profile) return null;
  const cred = getCachedPassword(profile.email);
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
    passwordSalt: cred ? cred.salt : null,
    passwordHash: cred ? cred.hash : null
  };
}

// Convert a local-file record to the same shape (for offline fallback).
function localToRecord(local) {
  return {
    id: local.local_id || local.id,
    local_id: local.local_id || local.id,
    full_name: local.full_name || '',
    email: local.email,
    phone_number: local.phone_number || '',
    role: String(local.role || 'BUYER').toUpperCase(),
    email_verified: Boolean(local.email_verified),
    is_verified: Boolean(local.is_verified),
    verification_status: local.verification_status || 'APPROVED',
    state: local.state || '',
    lga: local.lga || '',
    city: local.city || '',
    address: local.address || '',
    marketing_consent: Boolean(local.marketing_consent),
    created_at: local.created_at,
    updated_at: local.updated_at,
    deletion_pending: Boolean(local.deletion_pending),
    deletion_requested_at: local.deletion_requested_at || null,
    deletion_scheduled_for: local.deletion_scheduled_for || null,
    deletion_request_reason: local.deletion_request_reason || null,
    passwordSalt: local.passwordSalt,
    passwordHash: local.passwordHash
  };
}

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
        // Offline fallback.
        users = registeredUsers.map(localToRecord);
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

      // Check for an existing verified account with this email.
      const existing = await findProfileByEmail(normalizedEmail);
      if (existing && existing.email_verified) {
        return res.status(400).json({ success: false, message: 'An account with this email address already exists. Please log in.' });
      }

      const { salt, hash } = passwordService.hashPassword(password);
      const localId = `usr-${Date.now()}`;

      // Compose the payload that will live in Supabase.
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
      const carryLocalId = existing ? (existing.local_id || localId) : localId;
      let upsertRes = await sb.from('profiles').upsert({ ...profilePayload, local_id: carryLocalId }, { onConflict: 'email' }).select('*').single();
      if (upsertRes.error && /local_id/i.test(upsertRes.error.message)) {
        upsertRes = await sb.from('profiles').upsert(profilePayload, { onConflict: 'email' }).select('*').single();
      }
      const { data: persisted, error } = upsertRes;
      if (error) {
        console.error('[register] ❌ Supabase upsert failed:', error.message);
        return res.status(500).json({ success: false, message: 'Could not create account. Please try again.' });
      }

      // Mirror password material into local cache + file. If this fails the
      // user can still be verified via OTP, but they'll need a password reset
      // before login — surface that as a non-blocking warning.
      let passwordPersisted = true;
      try {
        setCachedPassword(persisted.email, persisted.id, salt, hash);
      } catch (e) {
        passwordPersisted = false;
        console.warn('[register] ⚠️ local password persist failed:', e.message);
      }

      // Generate OTP. If mailer dispatch fails, the user can still verify via
      // the demo code path (rawOtp is logged to the server console).
      const target = profileToRecord(persisted);
      otpService.generateOtp(target.email);

      res.status(201).json({
        success: true,
        requiresEmailVerification: true,
        message: `We've sent a 6-digit verification code to ${target.email}.`,
        email: target.email,
        role: target.role,
        expiresInSeconds: 300,
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

      // Email verification gate for non-admins
      if (!user.email_verified && user.role !== 'ADMIN') {
        otpService.generateOtp(normalizedEmail);
        return res.status(403).json({
          success: false,
          emailVerificationRequired: true,
          email: normalizedEmail,
          message: "Email verification required. We've sent a new verification code to your email."
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
    console.warn('[findUserById] fallback:', e.message);
    return registeredUsers.find(u => u.id === id) ? localToRecord(registeredUsers.find(u => u.id === id)) : null;
  }
};

// Offline-only helpers (used as fallbacks inside findUserBy*).
function findUserRecordByEmailOffline(email) {
  if (!email) return null;
  const norm = String(email).toLowerCase();
  const local = registeredUsers.find(u => u.email && u.email.toLowerCase() === norm);
  return local ? localToRecord(local) : null;
}

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
