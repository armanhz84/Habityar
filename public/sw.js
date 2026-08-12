const CACHE_NAME = 'habityar-pwa-cache-v1';
const PRE_CACHE_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/app_logo.png'
];

// Helper to check if request is an API call
const isApiRequest = (url) => url.pathname.startsWith('/api/');

// 1. Install event: precache essential shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching core app shell...');
        return cache.addAll(PRE_CACHE_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Activate event: clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((allCaches) => {
      return Promise.all(
        allCaches.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch event: Stale-While-Revalidate for app assets, live network for API
self.addEventListener('fetch', (event) => {
  // Wake up checking loop in the background on any network access
  checkBackgroundAlarms();
  
  const requestUrl = new URL(event.request.url);

  // If it's a POST or a non-GET request, process via normal fetch
  if (event.request.method !== 'GET') {
    // If it is a coach chat API request and fails (network offline), return a friendly offline guidance response
    if (isApiRequest(requestUrl)) {
      event.respondWith(
        fetch(event.request).catch(() => {
          const offlineResponse = {
            message: '⚠️ ارتباط با شبکه برقرار نیست. مربی هوشمند برای پردازش پاسخ‌های عمیق نیاز به اتصال اینترنت دارد. عادات و نوتیفیکیشن‌های شما همچنان کاملاً فعال و در دسترس هستند!',
            status: 'offline'
          };
          return new Response(JSON.stringify(offlineResponse), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
      );
    }
    return;
  }

  // Handle GET API calls dynamically (always try network, fail to offline msg if needed)
  if (isApiRequest(requestUrl)) {
    event.respondWith(
      fetch(event.request).catch(() => {
        const offlineResponse = {
          message: 'اتصال به شبکه برقرار نیست. این بخش موقتاً در دسترس نیست.',
          status: 'offline'
        };
        return new Response(JSON.stringify(offlineResponse), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Handle standard application assets (HTML, Icons, JS, CSS, fonts) using Stale-While-Revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Verify valid response before putting in cache
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // If network fails entirely, cachedResponse will keep the app running
          console.log('[Service Worker] Serving cached fallback:', event.request.url);
        });

        // Return cached response immediately for instant loading, fallback to live fetch
        return cachedResponse || fetchPromise;
      });
    })
  );
});

// === Background Alarms & Notification Engine ===

async function checkBackgroundAlarms() {
  try {
    const cache = await caches.open('habityar-alarms-cache');
    const response = await cache.match('/active-alarms');
    if (!response) return;

    const alarms = await response.json();
    const now = Date.now();
    let updated = false;

    for (const alarm of alarms) {
      if (alarm.isActive && alarm.triggerAt <= now) {
        // Trigger OS level push notification
        self.registration.showNotification(`⏰ یادآور عادت: ${alarm.habitName}`, {
          body: `امروز وقتشه! فعالیت مهم "${alarm.habitName}" رو پرقدرت پیش ببر و به رویاهات نزدیک‌تر شو.`,
          icon: '/app_logo.png',
          badge: '/app_logo.png',
          dir: 'rtl',
          requireInteraction: true,
          tag: `habityar-alarm-${alarm.id}`,
          vibrate: [200, 100, 200],
          data: {
            url: '/',
            alarmId: alarm.id
          }
        });

        // Deactivate that alarm after triggering
        alarm.isActive = false;
        updated = true;
      }
    }

    if (updated) {
      await cache.put('/active-alarms', new Response(JSON.stringify(alarms)));
    }
  } catch (err) {
    console.error('[Service Worker] Error checking background alarms:', err);
  }
}

// Check on background message from main window
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_ALARMS') {
    checkBackgroundAlarms();
  }
});

// Periodically run background check when SW is alive
let intervalId = null;
if (!intervalId) {
  intervalId = setInterval(checkBackgroundAlarms, 15000); // scan every 15 seconds
}

// Intercept push events
self.addEventListener('push', (event) => {
  event.waitUntil(checkBackgroundAlarms());
});

// Listen for notification click to open app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data ? event.notification.data.url : '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // If a window is already open, focus it
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

