import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, isFirebaseConfigured, storage } from '../firebase/config';
import { formatDate } from '../utils/formatDate';
import { validateImageFile } from '../utils/security';

const NEWS_COLLECTION = 'news';
const localKey = 'syganaki-news';
const FIREBASE_READ_TIMEOUT = 6000;

const withTimeout = (promise, timeout = FIREBASE_READ_TIMEOUT) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error('firebase_read_timeout')), timeout);
    }),
  ]);

const getLocalNews = () => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(window.localStorage.getItem(localKey) || '[]');
};

const setLocalNews = (items) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(localKey, JSON.stringify(items));
  }
};

export const mapNewsDoc = (document, language = 'kz') => {
  const data = document.data();
  const rawDate = data.createdAt || data.updatedAt || data.date;

  return {
    id: document.id,
    ...data,
    date: data.date || formatDate(rawDate, language),
  };
};

export const fetchNewsList = async (fallback = [], language = 'kz') => {
  let dbItems = [];

  if (!isFirebaseConfigured) {
    dbItems = getLocalNews();
  } else {
    try {
      const q = query(collection(db, NEWS_COLLECTION), orderBy('createdAt', 'desc'));
      const snapshot = await withTimeout(getDocs(q));
      dbItems = snapshot.docs.map((item) => mapNewsDoc(item, language));
    } catch (error) {
      console.warn('News fetch error:', error);
    }
  }

  const deletedIds = dbItems.filter((i) => i.deleted).map((i) => String(i.id));
  const validDbItems = dbItems.filter((i) => !i.deleted);

  const validFallback = fallback
    .map((f, idx) => ({ ...f, id: String(f.id || `fallback-${idx}`) }))
    .filter((f) => !deletedIds.includes(f.id) && !validDbItems.find((dbItem) => String(dbItem.id) === f.id));

  return [...validDbItems, ...validFallback];
};

export const fetchNewsArticle = async (id, fallback = [], language = 'kz') => {
  if (!isFirebaseConfigured) {
    const localItem = getLocalNews().find((item) => String(item.id) === String(id));
    return localItem || fallback.find((item) => String(item.id) === String(id)) || null;
  }

  try {
    const snap = await withTimeout(getDoc(doc(db, NEWS_COLLECTION, id)));
    if (snap.exists()) return mapNewsDoc(snap, language);
  } catch (error) {
    console.warn('Article fallback is used:', error);
  }

  return fallback.find((item) => String(item.id) === String(id)) || null;
};

export const saveNewsArticle = async (payload, editingId) => {
  if (!isFirebaseConfigured) {
    const items = getLocalNews();
    const now = new Date().toISOString();
    if (editingId) {
      setLocalNews(items.map((item) => (item.id === editingId ? { ...item, ...payload, updatedAt: now } : item)));
      return editingId;
    }

    const id = crypto.randomUUID?.() || String(Date.now());
    setLocalNews([{ id, ...payload, date: payload.date || new Date().toLocaleDateString(), createdAt: now }, ...items]);
    return id;
  }

  if (editingId) {
    await setDoc(doc(db, NEWS_COLLECTION, editingId), {
      ...payload,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return editingId;
  }

  const result = await addDoc(collection(db, NEWS_COLLECTION), {
    ...payload,
    createdAt: serverTimestamp(),
  });
  return result.id;
};

export const deleteNewsArticle = (id) => {
  if (!isFirebaseConfigured) {
    const current = getLocalNews();
    const exists = current.find(i => String(i.id) === String(id));
    if (exists) {
      setLocalNews(current.map(i => String(i.id) === String(id) ? { ...i, deleted: true } : i));
    } else {
      setLocalNews([...current, { id, deleted: true }]);
    }
    return Promise.resolve();
  }

  return setDoc(doc(db, NEWS_COLLECTION, id), { deleted: true }, { merge: true });
};

export const uploadNewsImage = async (file, folder = 'news') => {
  validateImageFile(file);

  const resizeImage = (f, output = 'data-url') =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          if (output === 'blob') {
            canvas.toBlob(
              (blob) => {
                if (!blob) reject(new Error('image_processing_failed'));
                else resolve(blob);
              },
              'image/jpeg',
              0.82,
            );
          } else {
            resolve(canvas.toDataURL('image/jpeg', 0.72));
          }
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  if (!isFirebaseConfigured) {
    return resizeImage(file);
  }

  // Try Firebase Storage; fall back to base64 if it fails (e.g. rules not configured)
  try {
    const allowedFolders = new Set(['news', 'gallery']);
    const targetFolder = allowedFolders.has(folder) ? folder : 'news';
    const blob = await resizeImage(file, 'blob');
    const safeBase = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 80) || 'image';
    const safeName = `${Date.now()}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}-${safeBase}.jpg`;
    const imageRef = ref(storage, `${targetFolder}/${safeName}`);
    const metadata = {
      contentType: 'image/jpeg',
      cacheControl: 'public,max-age=31536000,immutable',
    };

    const uploadPromise = uploadBytes(imageRef, blob, metadata).then(() => getDownloadURL(imageRef));
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000));

    return await Promise.race([uploadPromise, timeoutPromise]);
  } catch (storageError) {
    console.warn('Firebase Storage upload failed, falling back to base64:', storageError.message);
    // Fallback: store as base64 data URL
    return resizeImage(file);
  }
};
