import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, firebaseApp, isFirebaseConfigured } from '../firebase/config';

const TOKEN_COLLECTION = 'notificationTokens';

const tokenId = (token) => {
  try {
    return btoa(token).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '').slice(0, 180);
  } catch {
    return token.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 180);
  }
};

export const isPushSupported = async () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return false;
  try {
    const { isSupported } = await import('firebase/messaging');
    return isSupported();
  } catch {
    return false;
  }
};

export const getPushPermissionState = async () => {
  const supported = await isPushSupported();
  if (!supported) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return 'default';
};

export const registerAdminPushToken = async (user) => {
  if (!user?.uid || !isFirebaseConfigured) {
    return { status: 'unsupported' };
  }

  const supported = await isPushSupported();
  if (!supported) return { status: 'unsupported' };

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return { status: permission === 'denied' ? 'denied' : 'default' };

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    return { status: 'missing-vapid-key' };
  }

  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  const { getMessaging, getToken } = await import('firebase/messaging');
  const messaging = getMessaging(firebaseApp);
  const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });

  if (!token) return { status: 'default' };

  await setDoc(
    doc(db, 'adminUsers', user.uid, TOKEN_COLLECTION, tokenId(token)),
    {
      token,
      uid: user.uid,
      email: user.email || '',
      userAgent: navigator.userAgent || '',
      enabled: true,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );

  return { status: 'granted', token };
};

export const disableAdminPushToken = async (user, token) => {
  if (!user?.uid || !token || !isFirebaseConfigured) return;
  await deleteDoc(doc(db, 'adminUsers', user.uid, TOKEN_COLLECTION, tokenId(token)));
};

export const subscribeForegroundAdminPush = async (callback) => {
  const supported = await isPushSupported();
  if (!supported || Notification.permission !== 'granted') return () => {};

  const { getMessaging, onMessage } = await import('firebase/messaging');
  const messaging = getMessaging(firebaseApp);
  return onMessage(messaging, callback);
};
