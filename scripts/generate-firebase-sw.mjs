import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const loadDotEnv = () => {
  const envPath = resolve('.env');
  if (!existsSync(envPath)) return {};

  return readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .reduce((acc, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return acc;
      const [key, ...parts] = trimmed.split('=');
      acc[key.trim()] = parts.join('=').trim().replace(/^["']|["']$/g, '');
      return acc;
    }, {});
};

const localEnv = loadDotEnv();
const env = (name) => process.env[name] || localEnv[name] || '';

const config = {
  apiKey: env('VITE_FIREBASE_API_KEY'),
  authDomain: env('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: env('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: env('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: env('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: env('VITE_FIREBASE_APP_ID'),
};

const serviceWorker = `/* global firebase */
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js');

const firebaseConfig = ${JSON.stringify(config, null, 2)};

if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.messagingSenderId && firebaseConfig.appId) {
  firebase.initializeApp(firebaseConfig);

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
}

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
`;

writeFileSync(resolve(process.argv[2] || 'dist/firebase-messaging-sw.js'), serviceWorker);
