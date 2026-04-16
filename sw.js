const CACHE_NAME = 'codice-v50'; // Subimos de versión para aplicar cambios
const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
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

// Instalación: Cacheamos todo el ecosistema
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Códice Bíblico: Cacheando ecosistema completo...');
      return cache.addAll(ASSETS);
    })
  );
});

// Activación: Borramos la versión v17 y anteriores
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('Códice Bíblico: Limpiando caché antigua:', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// Fetch: Estrategia "Cache First" (Velocidad máxima)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});