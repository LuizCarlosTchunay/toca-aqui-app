
const CACHE_NAME = 'toca-aqui-v2';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/lovable-uploads/66d87de3-4ebd-4f4b-9d3f-c9bbb3e3c4ef.png',
  '/lovable-uploads/f12c55d4-4a13-4004-b92b-80e3a67ecd61.png',
  '/lovable-uploads/e246f252-69f3-421e-bb5b-dd658b4def09.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened, adding resources...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('All resources cached successfully');
        // Take control immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('Service Worker activated and ready');
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Serving from cache:', event.request.url);
          return cachedResponse;
        }

        console.log('Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the response for future use
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
            // Return a basic offline page if available
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
            throw error;
          });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  const title = 'Toca Aqui';
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do Toca Aqui!',
    icon: '/lovable-uploads/66d87de3-4ebd-4f4b-9d3f-c9bbb3e3c4ef.png',
    badge: '/lovable-uploads/66d87de3-4ebd-4f4b-9d3f-c9bbb3e3c4ef.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: '/?utm_source=notification'
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir App',
        icon: '/lovable-uploads/66d87de3-4ebd-4f4b-9d3f-c9bbb3e3c4ef.png'
      }
    ],
    requireInteraction: false,
    silent: false
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked');
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/?utm_source=notification')
  );
});

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
