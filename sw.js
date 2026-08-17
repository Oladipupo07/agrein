// Agrein Progressive Web App Service Worker
// Provides offline functionality, caching strategy, and background sync

const CACHE_NAME = 'agrein-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/public/styles.css',
  '/client/data/mockData.js',
  '/client/components/Navbar.js',
  '/client/components/Hero.js',
  '/client/components/ProductCatalog.js',
  '/client/components/ProductModal.js',
  '/client/components/CartDrawer.js',
  '/client/components/Footer.js'
];

// Install Service Worker & Cache Assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching app shell...');
      // Only cache critical files, skip large assets
      return cache.addAll(urlsToCache).catch(err => {
        console.warn('[SW] Some files failed to cache:', err);
        // Continue installation even if some files fail
      });
    })
  );
  self.skipWaiting(); // Activate new SW immediately
});

// Activate Service Worker & Clean Old Caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of clients immediately
});

// Fetch Strategy: Network-First for API, Cache-First for Assets
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests: Network-first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful API responses
          if (response && response.status === 200) {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached API response on network failure
          return caches.match(request).then(response => {
            return response || new Response(
              JSON.stringify({ error: 'Network unavailable', offline: true }),
              { 
                status: 503, 
                headers: { 'Content-Type': 'application/json' } 
              }
            );
          });
        })
    );
    return;
  }

  // Static assets: Cache-first with network fallback
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(request).then(response => {
          // Only cache successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, clonedResponse);
          });
          return response;
        });
      })
      .catch(() => {
        // Return offline page or generic fallback
        return caches.match('/index.html');
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background Sync for order confirmations
self.addEventListener('sync', event => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(
      fetch('/api/orders/sync', { method: 'POST' })
        .then(response => response.json())
        .catch(err => console.warn('[SW] Background sync failed:', err))
    );
  }
});

// Push Notifications for order updates
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const options = {
    body: event.data.text ? event.data.text() : 'Order Update',
    icon: '/data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌾</text></svg>',
    badge: '/data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%22%23059669%22/></svg>',
    tag: 'agrein-notification',
    requireInteraction: false
  };

  event.waitUntil(self.registration.showNotification('Agrein Update', options));
});

console.log('[SW] Service Worker loaded successfully');
