// Agrein User Database File Manager
// Persists user records to a local JSON file (fallback when Supabase is unavailable)
// In production, replace with actual database

const fs = require('fs');
const path = require('path');

const USERS_DB_PATH = path.join(__dirname, '../../data/users.json');

// Ensure data directory exists
const dataDir = path.dirname(USERS_DB_PATH);
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (e) {
    console.warn('[UserDB] Could not create data directory:', e.message);
  }
}

const UserDatabase = {
  /**
   * Load all users from file
   * @returns {Array} Array of user records
   */
  loadAll() {
    try {
      if (!fs.existsSync(USERS_DB_PATH)) {
        return [];
      }
      const data = fs.readFileSync(USERS_DB_PATH, 'utf8');
      return JSON.parse(data) || [];
    } catch (e) {
      console.warn('[UserDB] Error loading users:', e.message);
      return [];
    }
  },

  /**
   * Save all users to file
   * @param {Array} users - Array of user records
   * @returns {Boolean} Success status
   */
  saveAll(users) {
    try {
      fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2), 'utf8');
      console.log(`[UserDB] ✅ Saved ${users.length} users to ${USERS_DB_PATH}`);
      return true;
    } catch (e) {
      console.warn('[UserDB] Error saving users:', e.message);
      return false;
    }
  },

  /**
   * Find user by email
   * @param {String} email - User email
   * @returns {Object|null} User record or null
   */
  findByEmail(email) {
    const users = this.loadAll();
    return users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  /**
   * Find user by ID
   * @param {String} id - User ID
   * @returns {Object|null} User record or null
   */
  findById(id) {
    const users = this.loadAll();
    return users.find(u => u.id === id) || null;
  },

  /**
   * Create or update user
   * @param {Object} user - User data
   * @returns {Object} Saved user record
   */
  upsert(user) {
    if (!user || !user.email) {
      throw new Error('User must have email');
    }

    const users = this.loadAll();
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());

    if (existingIndex >= 0) {
      // Update existing user
      users[existingIndex] = { ...users[existingIndex], ...user, updated_at: new Date().toISOString() };
      console.log(`[UserDB] 📝 Updated user: ${user.email}`);
    } else {
      // Create new user
      const newUser = {
        ...user,
        id: user.id || `usr-${Date.now()}`,
        created_at: user.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      users.push(newUser);
      console.log(`[UserDB] ✨ Created new user: ${user.email}`);
    }

    this.saveAll(users);
    return existingIndex >= 0 ? users[existingIndex] : users[users.length - 1];
  },

  /**
   * Delete user by ID
   * @param {String} id - User ID
   * @returns {Boolean} Success status
   */
  delete(id) {
    const users = this.loadAll();
    const initialLength = users.length;
    const filtered = users.filter(u => u.id !== id);

    if (filtered.length < initialLength) {
      this.saveAll(filtered);
      console.log(`[UserDB] 🗑️ Deleted user: ${id}`);
      return true;
    }
    return false;
  },

  /**
   * Get all users (optionally filtered by role)
   * @param {String} role - Optional role filter (BUYER, FARMER, ADMIN)
   * @returns {Array} Filtered user records
   */
  getAll(role = null) {
    let users = this.loadAll();
    if (role) {
      users = users.filter(u => u.role === role.toUpperCase());
    }
    return users;
  },

  /**
   * Get user count statistics
   * @returns {Object} Count by role
   */
  getStats() {
    const users = this.loadAll();
    return {
      total: users.length,
      farmers: users.filter(u => u.role === 'FARMER').length,
      buyers: users.filter(u => u.role === 'BUYER').length,
      admins: users.filter(u => u.role === 'ADMIN').length,
      verified: users.filter(u => u.is_verified).length,
      unverified: users.filter(u => !u.is_verified).length
    };
  },

  /**
   * Clear all data (for testing)
   */
  clear() {
    try {
      fs.unlinkSync(USERS_DB_PATH);
      console.log('[UserDB] ⚠️ All user data cleared');
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Export data for backup
   * @returns {String} JSON string of all users
   */
  export() {
    return JSON.stringify(this.loadAll(), null, 2);
  },

  /**
   * Import data from JSON string
   * @param {String} jsonData - JSON string of users
   * @returns {Boolean} Success status
   */
  import(jsonData) {
    try {
      const users = JSON.parse(jsonData);
      if (!Array.isArray(users)) throw new Error('Data must be an array');
      this.saveAll(users);
      console.log(`[UserDB] 📥 Imported ${users.length} users`);
      return true;
    } catch (e) {
      console.error('[UserDB] Import failed:', e.message);
      return false;
    }
  }
};

module.exports = { UserDatabase };
