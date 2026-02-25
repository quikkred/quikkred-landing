// QuikkredAgent Service Worker
// Push notifications + network-first fetch (no aggressive caching)

const SW_VERSION = '1.0.0';

// Push notification handler
self.addEventListener('push', (event) => {
  let data = { title: 'Quikkred', body: 'You have a new notification', url: '/' };

  try {
    if (event.data) {
      const payload = event.data.json();
      data = {
        title: payload.title || data.title,
        body: payload.body || data.body,
        url: payload.url || payload.data?.url || data.url,
      };
    }
  } catch {
    // Use defaults
  }

  const options = {
    body: data.body,
    icon: '/logo-256.png',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    tag: 'quikkred-notification',
    renotify: true,
    data: { url: data.url },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.postMessage({ type: 'NOTIFICATION_CLICK', url });
          return;
        }
      }
      // Open new window
      return clients.openWindow(url);
    })
  );
});

// Fetch handler — network-first, no aggressive caching (avoid Next.js conflicts)
self.addEventListener('fetch', (event) => {
  // Only handle same-origin navigation requests
  if (event.request.mode !== 'navigate') return;

  event.respondWith(
    fetch(event.request).catch(() => {
      // Offline fallback — just let the browser handle it
      return caches.match('/') || new Response('Offline', { status: 503 });
    })
  );
});

// Install — skip waiting
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Activate — claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
