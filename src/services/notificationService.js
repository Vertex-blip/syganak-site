import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { formatDate } from '../utils/formatDate';

const localReadKey = 'syganaki-notification-reads';

const notificationSources = [
  {
    collectionName: 'applications',
    type: 'application',
    route: '/admin/applications',
    title: (data) => data.fullName || data.name || 'Application',
    body: (data) => data.program || data.phone || '',
  },
  {
    collectionName: 'inquiries',
    type: 'message',
    route: '/admin/inquiries',
    title: (data) => data.name || 'Message',
    body: (data) => data.subject || data.message || '',
  },
  {
    collectionName: 'news',
    type: 'upload',
    route: '/admin/news',
    title: (data) => data.title || 'News upload',
    body: (data) => data.category || data.excerpt || '',
  },
  {
    collectionName: 'gallery',
    type: 'upload',
    route: '/admin/gallery',
    title: (data) => data.title || 'Gallery upload',
    body: (data) => data.category || data.description || '',
  },
];

const readLocalMap = () => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(localReadKey) || '{}');
  } catch {
    return {};
  }
};

const writeLocalMap = (items) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(localReadKey, JSON.stringify(items));
  }
};

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.toDate === 'function') return value.toDate().getTime();
  if (value instanceof Date) return value.getTime();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const makeNotification = (source, id, data, language, read = false) => {
  const createdAt = data.createdAt || data.updatedAt || data.date;

  return {
    id: `${source.type}-${id}`,
    sourceId: id,
    sourceCollection: source.collectionName,
    type: source.type,
    route: source.route,
    title: source.title(data),
    body: source.body(data),
    image: data.image || '',
    status: data.status || '',
    createdAt,
    createdAtMs: toMillis(createdAt),
    date: formatDate(createdAt, language),
    read,
    rawData: data,
  };
};

const getLocalCollection = (collectionName) => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(`syganaki-${collectionName}`) || '[]');
  } catch {
    return [];
  }
};

const getLocalNotifications = (language) => {
  const readMap = readLocalMap();
  return notificationSources
    .flatMap((source) =>
      getLocalCollection(source.collectionName)
        .filter((item) => !item.deleted)
        .map((item) => makeNotification(source, item.id, item, language, Boolean(readMap[`${source.type}-${item.id}`]))),
    )
    .sort((a, b) => b.createdAtMs - a.createdAtMs)
    .slice(0, 60);
};

export const subscribeAdminNotifications = (user, language, callback) => {
  if (!isFirebaseConfigured || !user?.uid) {
    callback(getLocalNotifications(language));
    return () => {};
  }

  const sourceItems = {};
  let readMap = {};

  const emit = () => {
    const notifications = Object.values(sourceItems)
      .flat()
      .map((item) => ({ ...item, read: Boolean(readMap[item.id]) }))
      .sort((a, b) => b.createdAtMs - a.createdAtMs)
      .slice(0, 60);

    callback(notifications);
  };

  const unsubscribes = notificationSources.map((source) => {
    const sourceQuery = query(collection(db, source.collectionName), orderBy('createdAt', 'desc'), limit(20));
    return onSnapshot(
      sourceQuery,
      (snapshot) => {
        sourceItems[source.collectionName] = snapshot.docs
          .filter((document) => document.data().deleted !== true && document.data().archived !== true)
          .map((document) => makeNotification(source, document.id, document.data(), language))
          .filter((item) => item.title);
        emit();
      },
      (error) => {
        console.warn(`${source.collectionName} notification stream error:`, error);
        sourceItems[source.collectionName] = [];
        emit();
      },
    );
  });

  const readUnsubscribe = onSnapshot(
    collection(db, 'adminUsers', user.uid, 'notificationReads'),
    (snapshot) => {
      readMap = snapshot.docs.reduce((acc, document) => {
        acc[document.id] = document.data().read === true;
        return acc;
      }, {});
      emit();
    },
    (error) => {
      console.warn('Notification read stream error:', error);
      readMap = {};
      emit();
    },
  );

  return () => {
    unsubscribes.forEach((unsubscribe) => unsubscribe());
    readUnsubscribe();
  };
};

export const markNotificationRead = async (user, notificationId) => {
  if (!notificationId) return;

  if (!isFirebaseConfigured || !user?.uid) {
    const readMap = readLocalMap();
    writeLocalMap({ ...readMap, [notificationId]: true });
    return;
  }

  await setDoc(doc(db, 'adminUsers', user.uid, 'notificationReads', notificationId), {
    read: true,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const markNotificationsRead = async (user, notificationIds) => {
  const ids = Array.from(new Set(notificationIds.filter(Boolean)));
  if (!ids.length) return;

  if (!isFirebaseConfigured || !user?.uid) {
    const readMap = readLocalMap();
    ids.forEach((id) => {
      readMap[id] = true;
    });
    writeLocalMap(readMap);
    return;
  }

  await Promise.all(ids.map((id) => markNotificationRead(user, id)));
};
