// Agrein Progressive Web App Service Worker
// Provides offline functionality, caching strategy, and background sync

const CACHE_NAME = 'agrein-v5';
const APP_SHELL_CACHE = 'agrein-shell-v5';
const RUNTIME_CACHE = 'agrein-runtime-v5';
const OFFLINE_URL = '/offline.html';

const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/app.js',
  '/public/styles.css',
  '/public/offline.html',
  '/client/data/mockData.js',
  '/client/utils/storageManager.js',
  '/client/utils/supabaseClient.js',
  '/client/utils/realtime.js',
  '/client/components/Navbar.js',
  '/client/components/Hero.js',
  '/client/components/ProductCatalog.js',
  '/client/components/ProductModal.js',
  '/client/components/CartDrawer.js',
  '/client/components/Footer.js',
  '/client/components/PwaInstallBanner.js',
  '/client/components/SwUpdateToast.js'
];

// Install Service Worker & Cache Assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then(cache => {
      console.log('[SW] Caching app shell v5…');
      // addAll is atomic — one failure fails the whole install, so we add
      // files individually and tolerate misses (e.g. during partial deploys).
      return Promise.all(
        APP_SHELL_URLS.map(url => cache.add(url).catch(err => {
          console.warn('[SW] shell add failed for', url, err.message);
        }))
      );
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
          // Drop everything except our three named caches. Bumping the v5
          // suffix on CACHE_NAME above evicts every existing visitor's stale
          // cache in one shot, per the agrein-sw-stale-cache memory.
          if (cacheName !== APP_SHELL_CACHE && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Strategy: Network-First for navigations/API, Cache-First for static
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET
  if (request.method !== 'GET') return;

  // ── Navigation requests (the user opens/refreshes a page) ──
  // Network-first with offline.html fallback so the address bar always
  // shows the URL but the user lands on a friendly page when offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(APP_SHELL_CACHE).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(OFFLINE_URL).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // ── API requests ──
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request).then(response =>
          response || new Response(
            JSON.stringify({ error: 'Network unavailable', offline: true }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          )
        ))
    );
    return;
  }

  // ── Static assets: cache-first with background revalidate ──
  event.respondWith(
    caches.match(request).then(cached => {
      const networkFetch = fetch(request).then(response => {
        if (response && response.status === 200 && response.type !== 'error') {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => null);
      return cached || networkFetch || caches.match('/index.html');
    })
  );
});

// Allow the page to ask the new SW to take over immediately. The app calls
// this from registration.waiting via SKIP_WAITING when the user accepts an
// "App updated" toast.
self.addEventListener('message', event => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data.type === 'CHECK_UPDATE') {
    self.registration.update();
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
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌾</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%22%23059669%22/></svg>',
    tag: 'agrein-notification',
    requireInteraction: false
  };

  event.waitUntil(self.registration.showNotification('Agrein Update', options));
});

console.log('[SW] Service Worker v5 loaded');
