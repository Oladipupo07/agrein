// Agrein User Data Persistence Utility
// Manages localStorage for user sessions, settings, and cached data
// Ensures user accounts persist across page reloads and deployments

const StorageManager = {
  // Storage keys
  KEYS: {
    CURRENT_USER: 'agrein_user',
    USER_TOKEN: 'agrein_token',
    USER_ROLE: 'agrein_role',
    CART: 'agrein_cart',
    WISHLIST: 'agrein_wishlist',
    PREFERENCES: 'agrein_prefs',
    DARK_MODE: 'agrein_dark_mode',
    CURRENT_VIEW: 'agrein_current_view',
    ALL_USERS: 'agrein_all_users', // Local user database backup
  },

  /**
   * Save current user to localStorage
   * @param {Object} user - User object { id, email, full_name, role, verification_status, token }
   */
  saveUser(user) {
    if (!user || !user.email) return false;
    try {
      localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
      localStorage.setItem(this.KEYS.USER_TOKEN, user.token || '');
      localStorage.setItem(this.KEYS.USER_ROLE, user.role || 'BUYER');
      return true;
    } catch (e) {
      console.warn('❌ Failed to save user to localStorage:', e.message);
      return false;
    }
  },

  /**
   * Retrieve current user from localStorage
   * @returns {Object|null} User object or null if not found/expired
   */
  getUser() {
    try {
      const userJson = localStorage.getItem(this.KEYS.CURRENT_USER);
      if (!userJson) return null;
      
      const user = JSON.parse(userJson);
      
      // Validate user object has required fields
      if (!user.email || !user.id) return null;
      
      return user;
    } catch (e) {
      console.warn('⚠️ Error retrieving user from localStorage:', e.message);
      return null;
    }
  },

  /**
   * Clear current user from localStorage (logout)
   */
  clearUser() {
    try {
      localStorage.removeItem(this.KEYS.CURRENT_USER);
      localStorage.removeItem(this.KEYS.USER_TOKEN);
      localStorage.removeItem(this.KEYS.USER_ROLE);
      return true;
    } catch (e) {
      console.warn('❌ Failed to clear user from localStorage:', e.message);
      return false;
    }
  },

  /**
   * Save shopping cart to localStorage
   * @param {Array} cart - Cart items array
   */
  saveCart(cart) {
    if (!Array.isArray(cart)) return false;
    try {
      localStorage.setItem(this.KEYS.CART, JSON.stringify(cart));
      return true;
    } catch (e) {
      console.warn('⚠️ Failed to save cart:', e.message);
      return false;
    }
  },

  /**
   * Retrieve shopping cart from localStorage
   * @returns {Array} Cart items or empty array
   */
  getCart() {
    try {
      const cartJson = localStorage.getItem(this.KEYS.CART);
      return cartJson ? JSON.parse(cartJson) : [];
    } catch (e) {
      console.warn('⚠️ Failed to retrieve cart:', e.message);
      return [];
    }
  },

  /**
   * Save wishlist to localStorage
   * @param {Array} wishlist - Product IDs array
   */
  saveWishlist(wishlist) {
    if (!Array.isArray(wishlist)) return false;
    try {
      localStorage.setItem(this.KEYS.WISHLIST, JSON.stringify(wishlist));
      return true;
    } catch (e) {
      console.warn('⚠️ Failed to save wishlist:', e.message);
      return false;
    }
  },

  /**
   * Retrieve wishlist from localStorage
   * @returns {Array} Wishlist product IDs or empty array
   */
  getWishlist() {
    try {
      const wishlistJson = localStorage.getItem(this.KEYS.WISHLIST);
      return wishlistJson ? JSON.parse(wishlistJson) : [];
    } catch (e) {
      console.warn('⚠️ Failed to retrieve wishlist:', e.message);
      return [];
    }
  },

  /**
   * Save user preferences (theme, language, etc.)
   * @param {Object} prefs - Preferences object
   */
  savePreferences(prefs) {
    try {
      localStorage.setItem(this.KEYS.PREFERENCES, JSON.stringify(prefs));
      return true;
    } catch (e) {
      console.warn('⚠️ Failed to save preferences:', e.message);
      return false;
    }
  },

  /**
   * Retrieve user preferences
   * @returns {Object} Preferences object or empty object
   */
  getPreferences() {
    try {
      const prefsJson = localStorage.getItem(this.KEYS.PREFERENCES);
      return prefsJson ? JSON.parse(prefsJson) : {};
    } catch (e) {
      console.warn('⚠️ Failed to retrieve preferences:', e.message);
      return {};
    }
  },

  /**
   * Save dark mode preference
   * @param {Boolean} enabled - Dark mode enabled flag
   */
  setDarkMode(enabled) {
    try {
      localStorage.setItem(this.KEYS.DARK_MODE, enabled ? '1' : '0');
      return true;
    } catch (e) {
      console.warn('⚠️ Failed to save dark mode:', e.message);
      return false;
    }
  },

  /**
   * Get dark mode preference
   * @returns {Boolean} Dark mode enabled
   */
  isDarkMode() {
    try {
      const darkMode = localStorage.getItem(this.KEYS.DARK_MODE);
      return darkMode === '1';
    } catch (e) {
      return false;
    }
  },

  /**
   * Save all registered users (local backup)
   * @param {Array} users - Array of user objects
   */
  saveAllUsers(users) {
    if (!Array.isArray(users)) return false;
    try {
      localStorage.setItem(this.KEYS.ALL_USERS, JSON.stringify(users));
      return true;
    } catch (e) {
      console.warn('⚠️ Failed to save users database:', e.message);
      return false;
    }
  },

  /**
   * Get all registered users from local backup
   * @returns {Array} Array of user objects
   */
  getAllUsers() {
    try {
      const usersJson = localStorage.getItem(this.KEYS.ALL_USERS);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (e) {
      console.warn('⚠️ Failed to retrieve users database:', e.message);
      return [];
    }
  },

  /**
   * Check if user is authenticated
   * @returns {Boolean} True if user exists and has token
   */
  isAuthenticated() {
    const user = this.getUser();
    const token = localStorage.getItem(this.KEYS.USER_TOKEN);
    return !!(user && user.email && token);
  },

  /**
   * Clear all Agrein data from localStorage
   * Useful for account deletion or factory reset
   */
  clearAll() {
    try {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('✅ All Agrein data cleared from localStorage');
      return true;
    } catch (e) {
      console.warn('❌ Failed to clear all data:', e.message);
      return false;
    }
  },

  /**
   * Get approximate storage usage
   * @returns {Object} { used, available, percentage }
   */
  getStorageInfo() {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (key.startsWith('agrein_')) {
          totalSize += localStorage[key].length + key.length;
        }
      }
      const usedMB = (totalSize / 1024 / 1024).toFixed(2);
      return { used: usedMB + ' MB', items: Object.keys(localStorage).filter(k => k.startsWith('agrein_')).length };
    } catch (e) {
      return { used: '? MB', items: 0 };
    }
  },

  /**
   * Debug: Log all stored data
   */
  debug() {
    console.log('📦 Agrein localStorage contents:');
    for (let key in localStorage) {
      if (key.startsWith('agrein_')) {
        try {
          const value = localStorage.getItem(key);
          const parsed = value.length < 100 ? JSON.parse(value) : value.substring(0, 100) + '...';
          console.log(`  ${key}:`, parsed);
        } catch (e) {
          console.log(`  ${key}:`, localStorage.getItem(key));
        }
      }
    }
    console.log('Storage info:', this.getStorageInfo());
  }
};

// Export for both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StorageManager };
}
