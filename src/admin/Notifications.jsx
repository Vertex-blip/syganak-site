import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Circle, Image as ImageIcon, Inbox, MessageSquare, Newspaper, CheckCircle2, Clock, Phone, Trash2, X, MessageCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { auth, db, isFirebaseConfigured } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { formatDate } from '../utils/formatDate';
import {
  markNotificationRead,
  markNotificationsRead,
  subscribeAdminNotifications,
} from '../services/notificationService';

const typeIcon = {
  application: Inbox,
  message: MessageSquare,
  upload: ImageIcon,
};

const notificationTone = {
  application: 'bg-blue-50 text-blue-700',
  message: 'bg-emerald-50 text-emerald-700',
  upload: 'bg-amber-50 text-amber-700',
};

const Notifications = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [marking, setMarking] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeAdminNotifications(auth.currentUser, i18n.language, setNotifications);
    return () => unsubscribe();
  }, [i18n.language]);

  const unread = useMemo(() => notifications.filter((item) => !item.read), [notifications]);
  const visible = useMemo(() => {
    if (filter === 'unread') return notifications.filter((item) => !item.read);
    if (filter === 'read') return notifications.filter((item) => item.read);
    return notifications;
  }, [filter, notifications]);

  const toWa = (phone) => {
    const digits = String(phone || '').replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  };

  const badge = (value = 'new') => {
    const map = {
      new: ['bg-blue-50 text-blue-700', Clock, t('admin.new')],
      viewed: ['bg-slate-100 text-slate-700', Clock, t('admin.viewed', { defaultValue: 'Қаралды' })],
      contacted: ['bg-amber-50 text-amber-700', Phone, t('admin.contacted', { defaultValue: 'Байланысты' })],
      processed: ['bg-amber-50 text-amber-700', Phone, t('admin.processed')],
      completed: ['bg-emerald-50 text-emerald-700', CheckCircle2, t('admin.completed', { defaultValue: 'Аяқталды' })],
      accepted: ['bg-emerald-50 text-emerald-700', CheckCircle2, t('admin.accepted')],
      rejected: ['bg-red-50 text-red-700', XCircle, t('admin.rejected')],
    };
    const [classes, Icon, label] = map[value] || map.new;
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${classes}`}>
        <Icon size={13} />
        {label}
      </span>
    );
  };

  const changeStatus = async (item, nextStatus, e) => {
    e?.stopPropagation();
    const collectionName = item.sourceCollection;
    const docId = item.sourceId;

    if (!isFirebaseConfigured) {
      const localKey = `syganaki-${collectionName}`;
      const readLocal = () => JSON.parse(window.localStorage.getItem(localKey) || '[]');
      const writeLocal = (items) => window.localStorage.setItem(localKey, JSON.stringify(items));

      const localItems = readLocal();
      const nextItems = localItems.map((localItem) => (localItem.id === docId ? { ...localItem, status: nextStatus } : localItem));
      writeLocal(nextItems);

      setSelectedNotification((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: nextStatus,
          rawData: {
            ...prev.rawData,
            status: nextStatus,
          },
        };
      });
      return;
    }

    try {
      await updateDoc(doc(db, collectionName, docId), { status: nextStatus });
      setSelectedNotification((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: nextStatus,
          rawData: {
            ...prev.rawData,
            status: nextStatus,
          },
        };
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const archiveItem = async (item, e) => {
    e?.stopPropagation();
    if (!window.confirm(t('admin.archive_confirm', { defaultValue: 'Архивке жіберуді растайсыз ба?' }))) return;
    const collectionName = item.sourceCollection;
    const docId = item.sourceId;

    if (!isFirebaseConfigured) {
      const localKey = `syganaki-${collectionName}`;
      const readLocal = () => JSON.parse(window.localStorage.getItem(localKey) || '[]');
      const writeLocal = (items) => window.localStorage.setItem(localKey, JSON.stringify(items));

      const localItems = readLocal();
      const nextItems = localItems.map((localItem) => (localItem.id === docId ? { ...localItem, archived: true } : localItem)).filter((localItem) => !localItem.archived);
      writeLocal(nextItems);

      setSelectedNotification(null);
      return;
    }

    try {
      await updateDoc(doc(db, collectionName, docId), { archived: true });
      setSelectedNotification(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const openNotification = async (item) => {
    await markNotificationRead(auth.currentUser, item.id);
    if ((item.type === 'message' || item.type === 'application') && item.rawData) {
      setSelectedNotification(item);
    } else {
      navigate(item.route);
    }
  };

  const markAllRead = async () => {
    setMarking(true);
    try {
      await markNotificationsRead(auth.currentUser, unread.map((item) => item.id));
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="premium-card p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <Bell size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary-dark">{t('admin.notifications')}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t('admin.notifications_desc')}</p>
            </div>
          </div>
        </div>

        <button type="button" onClick={markAllRead} disabled={marking || unread.length === 0} className="btn-primary">
          <CheckCheck size={18} />
          {t('admin.mark_all_read')}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {[
          ['all', t('common.all'), notifications.length],
          ['unread', t('admin.unread'), unread.length],
          ['read', t('admin.read'), notifications.length - unread.length],
        ].map(([value, label, count]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-bold ${
              filter === value ? 'bg-primary text-white shadow-lg' : 'border border-slate-200 bg-white text-slate-600 hover:bg-accent-lightGold'
            }`}
          >
            {label} {count > 0 ? `(${count})` : ''}
          </button>
        ))}
      </div>

      {visible.length ? (
        <div className="grid gap-3">
          {visible.map((item) => {
            const Icon = typeIcon[item.type] || Newspaper;
            return (
              <article key={item.id} className={`premium-card overflow-hidden ${item.read ? 'bg-white' : 'border-primary/20 bg-white shadow-[0_18px_60px_rgba(5,24,17,0.12)]'}`}>
                <button
                  type="button"
                  onClick={() => openNotification(item)}
                  className="grid w-full gap-4 p-4 text-left sm:grid-cols-[auto_1fr_auto] sm:items-center"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${notificationTone[item.type] || 'bg-slate-50 text-slate-700'}`}>
                    <Icon size={21} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {!item.read && <Circle size={9} className="fill-red-500 text-red-500" />}
                      <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-extrabold text-slate-500">
                        {t(`admin.notification_${item.type}`)}
                      </span>
                      {item.date && <span className="text-xs font-semibold text-slate-400">{item.date}</span>}
                    </div>
                    <h3 className="mt-2 line-clamp-1 font-serif text-xl font-bold text-primary-dark">{item.title}</h3>
                    {item.body && <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{item.body}</p>}
                  </div>
                  {item.image ? (
                    <img src={item.image} alt="" className="hidden h-16 w-24 rounded-lg object-cover sm:block" />
                  ) : (
                    <span className="hidden text-xs font-bold uppercase tracking-[0.14em] text-primary sm:block">
                      {t('admin.open')}
                    </span>
                  )}
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="premium-card p-10 text-center">
          <Bell className="mx-auto mb-4 text-slate-300" size={38} />
          <p className="font-bold text-slate-600">{t('admin.no_notifications')}</p>
        </div>
      )}

      {/* Detail Modal — rendered via Portal to escape stacking context */}
      {selectedNotification && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 p-4"
          onClick={() => setSelectedNotification(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-primary-dark">
                {selectedNotification.rawData.fullName || selectedNotification.rawData.name || '—'}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="rounded-lg bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 px-6 py-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    {selectedNotification.type === 'application' ? t('admission.program') : t('contacts.subject')}
                  </p>
                  {selectedNotification.type === 'application' ? (
                    <p className="mt-1 font-semibold text-primary-dark">
                      {selectedNotification.rawData.program || '—'}
                    </p>
                  ) : (
                    <span className="mt-1 inline-block rounded-full bg-accent-lightGold px-3 py-1 text-xs font-bold text-primary">
                      {selectedNotification.rawData.subject || '—'}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">{t('common.date')}</p>
                  <p className="mt-1 font-semibold text-slate-700">
                    {selectedNotification.date || formatDate(selectedNotification.rawData.createdAt, i18n.language)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">{t('admin.status')}</p>
                  <div className="mt-1">{badge(selectedNotification.rawData.status)}</div>
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">{t('admission.phone')}</p>
                  <a href={`tel:${selectedNotification.rawData.phone}`} className="mt-1 inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
                    <Phone size={14} /> {selectedNotification.rawData.phone}
                  </a>
                </div>
              </div>

              {selectedNotification.rawData.message && (
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">{t('admission.message')}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700 whitespace-pre-wrap">{selectedNotification.rawData.message}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 border-t border-slate-100 px-6 py-4">
              <a
                href={toWa(selectedNotification.rawData.phone)}
                target="_blank"
                rel="noreferrer"
                onClick={() => changeStatus(selectedNotification, 'processed')}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white hover:bg-emerald-600"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a
                href={`tel:${selectedNotification.rawData.phone}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <Phone size={16} />
              </a>
              {selectedNotification.type === 'application' ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => { changeStatus(selectedNotification, 'accepted', e); }}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { changeStatus(selectedNotification, 'rejected', e); }}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    <XCircle size={16} />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={(e) => changeStatus(selectedNotification, 'processed', e)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
                >
                  <CheckCircle2 size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={(e) => archiveItem(selectedNotification, e)}
                className="flex items-center justify-center rounded-xl border border-red-200 px-3 py-2.5 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Notifications;
