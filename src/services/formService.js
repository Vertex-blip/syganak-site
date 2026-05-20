import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import {
  canSubmitForm,
  isHoneypotFilled,
  isValidKazakhstanPhone,
  normalizeKazakhstanPhone,
  sanitizeFormPayload,
} from '../utils/security';
export { buildWhatsAppLink } from '../utils/contactLinks';

const saveLocal = (collectionName, data) => {
  const key = `syganaki-${collectionName}`;
  const current = JSON.parse(window.localStorage.getItem(key) || '[]');
  const item = {
    id: crypto.randomUUID?.() || String(Date.now()),
    ...data,
    createdAt: new Date().toISOString(),
  };
  window.localStorage.setItem(key, JSON.stringify([item, ...current]));
  return Promise.resolve({ id: item.id });
};

export const saveApplication = (data) => {
  if (isHoneypotFilled(data)) {
    return Promise.reject(new Error('spam_detected'));
  }
  if (!isValidKazakhstanPhone(data.phone)) {
    return Promise.reject(new Error('invalid_phone'));
  }
  if (!canSubmitForm('application', 90_000)) {
    return Promise.reject(new Error('rate_limited'));
  }
  const clean = sanitizeFormPayload(
    { fullName: data.fullName, phone: normalizeKazakhstanPhone(data.phone), program: data.program, message: data.message },
    { fullName: 120, phone: 40, program: 120, message: 1000 },
  );
  const payload = {
    ...clean,
    status: 'new',
    source: 'website',
    isRead: false,
  };
  return isFirebaseConfigured
    ? addDoc(collection(db, 'applications'), {
        ...payload,
        createdAt: serverTimestamp(),
      })
    : saveLocal('applications', payload);
};

export const saveInquiry = (data) => {
  if (isHoneypotFilled(data)) {
    return Promise.reject(new Error('spam_detected'));
  }
  if (!isValidKazakhstanPhone(data.phone)) {
    return Promise.reject(new Error('invalid_phone'));
  }
  if (!canSubmitForm('inquiry', 60_000)) {
    return Promise.reject(new Error('rate_limited'));
  }
  const clean = sanitizeFormPayload(
    { name: data.name, phone: normalizeKazakhstanPhone(data.phone), subject: data.subject, message: data.message, type: data.type || 'contact_form' },
    { name: 120, phone: 40, subject: 120, message: 1200, type: 60 },
  );
  const payload = {
    ...clean,
    status: 'new',
    type: clean.type || 'contact_form',
    source: 'website',
    isRead: false,
  };
  return isFirebaseConfigured
    ? addDoc(collection(db, 'inquiries'), {
        ...payload,
        createdAt: serverTimestamp(),
      })
    : saveLocal('inquiries', payload);
};
