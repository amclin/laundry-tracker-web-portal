(function() {
  'use strict';

/****** CACHING *******/
var filesToCache = [
  'assets/css/app.css',
  'assets/data/config.json',
  'assets/img/my-icons-collection/svg/001-dryer.svg',
  'assets/img/my-icons-collection/svg/002-washing-machine.svg',
  'assets/js/app.js',
  'assets/js/main.js',
  'assets/templates/machines.html',
  'index.html',
  '404.html',
  'offline.html'
];

var staticCacheName = 'pages-cache-v2';

  self.addEventListener('install', function(event) {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
      caches.open(staticCacheName)
      .then(function(cache) {
        return cache.addAll(filesToCache);
      })
    );
  });

  self.addEventListener('fetch', function(event) {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }
        console.log('Network request for ', event.request.url);
        return fetch(event.request).then(function(response) {
          if (response.status === 404) {
            return caches.match('404.html');
          }
          return caches.open(staticCacheName).then(function(cache) {
            if (event.request.url.indexOf('test') < 0) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          });
        });
      }).catch(function(error) {
        console.log('Error, ', error);
        return caches.match('offline.html');
      })
    );
  });

  self.addEventListener('activate', function(event) {
    console.log('Activating new cache service worker...');

    var cacheWhitelist = [staticCacheName];

    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });


/****** Notifications ******/
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Laundry Monitor';
  const options = {
    body: event.data.text(),
    icon: 'assets/img/my-icons-collection/png/002-washing-machine.png',
    badge: 'assets/img/my-icons-collection/png/002-washing-machine.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('http://localhost:8888/')
  );
});

})();