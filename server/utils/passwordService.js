// Password hashing & verification helper for Agrein — SHA-256 + per-user salt
// Uses the Node `crypto` module that otpService.js already pulls in, so no new
// dependencies are required on Render.
const crypto = require('crypto');

function hashPassword(plain) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(salt + String(plain)).digest('hex');
  return { salt, hash };
}

function verifyPassword(plain, salt, expectedHash) {
  if (!salt || !expectedHash) return false;
  const actual = crypto.createHash('sha256').update(String(salt) + String(plain)).digest('hex');
  const a = Buffer.from(actual, 'hex');
  const b = Buffer.from(expectedHash, 'hex');
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

module.exports = { hashPassword, verifyPassword };
