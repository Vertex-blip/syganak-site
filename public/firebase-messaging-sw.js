/* global firebase */
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyD9zVgvI6yUCdG8lU62bWy5H7d-Qhp9a3I',
  authDomain: 'islam-site.firebaseapp.com',
  projectId: 'islam-site',
  storageBucket: 'islam-site.firebasestorage.app',
  messagingSenderId: '615124835928',
  appId: '1:615124835928:web:bf0a09449f818db515f42d',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const data = payload.data || {};
  const title = notification.title || data.title || 'Жаңа хабарлама';
  const options = {
    body: notification.body || data.body || '',
    icon: '/logo.png',
    badge: '/logo.png',
    data: {
      url: data.click_action || data.url || '/admin/notifications',
    },
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification?.data?.url || '/admin/notifications';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const existing = clientList.find((client) => client.url.includes(self.location.origin));
      if (existing) {
        existing.focus();
        existing.navigate(targetUrl);
        return;
      }
      clients.openWindow(targetUrl);
    }),
  );
});
