// Service Worker para AlarmaPro
const CACHE_NAME = 'alarmapro-v1';
const urlsToCache = [
  '/AlarmaPro/',
  '/AlarmaPro/index.html',
  '/AlarmaPro/manifest.json',
  '/AlarmaPro/clock.png',
  '/AlarmaPro/clock1.png',
  '/AlarmaPro/clockT.png',
  '/AlarmaPro/og-image.png',
  '/AlarmaPro/sounds/alarm-26718.mp3',
  '/AlarmaPro/sounds/alarm-no3-14864.mp3',
  '/AlarmaPro/sounds/biohazard-alarm-143105.mp3',
  '/AlarmaPro/sounds/facility-siren-loopable-100687.mp3',
  '/AlarmaPro/sounds/reliable-safe-327618.mp3'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación y limpieza de caches antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estrategia de cache: primero red, luego cache como fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la respuesta es válida, clonarla y almacenarla en cache
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, intentar recuperar desde cache
        return caches.match(event.request);
      })
  );
});
