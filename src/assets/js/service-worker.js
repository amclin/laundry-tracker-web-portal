(function() {
  'use strict';

const config = require('./config.js')

/****** CACHING *******/
const filesToCache = config.serviceworker.cache.filesToCache;
const staticCacheName = config.serviceworker.cache.staticCacheName;

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
            return caches.match(config.serviceworker.cache.pages['404']);
          }
          return caches.open(staticCacheName).then(function(cache) {
            // Don't cache anything with "test" in the URL
            if (event.request.url.indexOf('test') >= 0) {
              return response;
            }
            // Don't cache any requests to the API gateway
            if (event.request.url.indexOf(config.gateway) >= 0) {
              return response;
            }
            // Cache everything else
            cache.put(event.request.url, response.clone());
            return response;
          });
        });
      }).catch(function(error) {
        console.log('Error, ', error);
        return caches.match(config.serviceworker.cache.pages.offline);
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

/**
 * Prepares a push notification object
 * @param object event Data from subscription
 * @return object Formatted notification object with messages
 **/
function prepareNotfication(event) {
  const messages = config.serviceworker.notifications.messages
  const icons = config.serviceworker.notifications.icons
  const badges = icons
  // Default values
  var machine = {}
  var state = 'default'
  var title = config.serviceworker.notifications.title
  var body = messages[state]
  var icon = icons['washer'][state]
  var badge = badges['washer'][state]
  // Extract data
  var data = {}

  try {
    data = JSON.parse(event)
  } catch(err) {
    console.warn('Failed to parse push notification:',err)
  }
  
  if (data.machines) {
    // Get the data for only the first machine
    // so we don't spam the user with messages
    machine = config.machines.find(function(el) {
      return el.id === data.machines[0].id
    })
    state = machine.state ? 'on' : 'off'

    // Write the correct message
    message = messages[state]
    message.replace('%s', machine.name)

    // Select the right images
    badge = icons[machine.type][state]
    icon = icons[machine.type][state]
  }
  
  return {
    title: title,
    options: {
      body: body,
      icon: icon,
      badge: badge
    }
  }
}

/****** Notifications ******/
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.')
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`)

  const notification = prepareNotfication(event)

  event.waitUntil(self.registration.showNotification(notification.title, notification.options));
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('http://localhost:8888/')
  );
});

})();