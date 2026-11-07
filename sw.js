// Service Worker para JoRi App
const CACHE_NAME = 'jori-app-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './auth-pairing.css',
  './auth-pairing.js',
  './auth-service.js',
  './auth-config.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

// Instalación: Precargar archivos esenciales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('Algunos recursos no se pudieron precachear:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activación: Limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia de Fetch:
// Network First para HTML y scripts dinámicos (para que siempre reciba las actualizaciones más recientes)
// Cache First con fallback para imágenes pesadas
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Solo peticiones GET
  if (request.method !== 'GET') return;

  // Ignorar llamadas a Supabase, Gun o Firebase para no interferir con la sincronización en tiempo real
  const url = new URL(request.url);
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gun')
  ) {
    return;
  }

  // Si es un documento HTML o script principal -> Network First
  if (request.mode === 'navigate' || request.destination === 'document' || request.destination === 'script') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request).then((res) => res || caches.match('./index.html')))
    );
    return;
  }

  // Para el resto (CSS, imágenes, fuentes) -> Cache First con actualización en segundo plano
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // En segundo plano intentamos actualizar la caché
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      });
    })
  );
});

