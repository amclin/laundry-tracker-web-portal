/* eslint-env browser, serviceworker, es6 */

'use strict';

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