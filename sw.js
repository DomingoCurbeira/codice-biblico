const CACHE_NAME = 'codice-v63'; // Subimos de versión para aplicar cambios
const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/global-hub.js',
  '/manifest.json',
  
  // Iconos PWA
  '/img/icon-192.png',
  '/img/icon-512.png',
  
  // Imágenes de Compartir (Nuevas)
  '/img/og-home.jpg',
  '/img/og-virtus.jpg',
  '/img/og-cronos.jpg',
  '/img/og-huellas.jpg',
  '/img/og-escriba.jpg',
  '/img/og-mana.jpg',
  '/img/og-aimagen.jpg',
  '/img/og-aposento.jpg',
  '/img/og-etymos.jpg',
  '/img/og-onomastiko.jpg',
  
  // Opcional: Puedes añadir las páginas de inicio de cada módulo para que funcionen offline
  '/juego/index.html',
  '/cronos/index.html',
  '/mana/index.html',
  '/huellas/index.html',
  '/notas/index.html',
  '/etymos/index.html',
  '/onomastiko/index.html',
  '/a_imagen_de_Dios/index.html',
  '/aposento/index.html'
];

// 1. Instalación: Cacheamos lo esencial
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Códice Bíblico: Preparando despensa...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Fuerza a este SW a activarse de inmediato
});

// 2. Activación: Limpieza de versiones viejas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('Códice Bíblico: Tirando ingredientes viejos:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim(); // Toma el control de las pestañas abiertas de inmediato
});

// 3. Fetch: Estrategia Stale-While-Revalidate
self.addEventListener('fetch', (e) => {
  // Solo gestionamos peticiones GET (evita errores con Analytics o formularios)
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(e.request).then((cachedResponse) => {
        const fetchedResponse = fetch(e.request).then((networkResponse) => {
          // Si la red responde bien, actualizamos la caché en silencio
          if (networkResponse && networkResponse.status === 200) {
            cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Si falla la red (offline) y no hay caché, podrías retornar una página de error
          return cachedResponse;
        });

        // Retornamos la respuesta rápida (caché) o la lenta (red)
        return cachedResponse || fetchedResponse;
      });
    })
  );
});