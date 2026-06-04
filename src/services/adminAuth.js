import { doc, getDoc } from 'firebase/firestore';
import { getIdTokenResult } from 'firebase/auth';
import { db, isFirebaseConfigured } from '../firebase/config';

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || 'admin@syganaki.kz')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const hasConfiguredAdminEmail = (user) =>
  Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));

export const hasAdminAccess = async (user) => {
  if (!user || !isFirebaseConfigured) return false;

  const token = await getIdTokenResult(user, true);
  if (token.claims?.admin === true || token.claims?.role === 'admin') {
    return true;
  }

  if (hasConfiguredAdminEmail(user)) {
    return true;
  }

  const roleDoc = await getDoc(doc(db, 'adminRoles', user.uid));
  return roleDoc.exists() && roleDoc.data()?.role === 'admin';
};
