import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { CheckCircle2, Clock, MessageCircle, Phone, Search, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { db, isFirebaseConfigured } from '../firebase/config';
import { formatDate, normalizeText } from '../utils/formatDate';
import useMarkSectionRead from '../hooks/useMarkSectionRead';

const localKey = 'syganaki-inquiries';
const readLocal = () => JSON.parse(window.localStorage.getItem(localKey) || '[]');
const writeLocal = (items) => window.localStorage.setItem(localKey, JSON.stringify(items));

const toWa = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  return `https://wa.me/${digits}`;
};

const Inquiries = () => {
  const { t, i18n } = useTranslation();
  useMarkSectionRead('message');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setItems(readLocal().filter((item) => !item.archived && !item.deleted));
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
        date: formatDate(item.data().createdAt, i18n.language)
      })).filter((item) => !item.archived && !item.deleted));
      setLoading(false);
    }, (error) => {
      console.error('Error fetching inquiries:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [i18n.language]);

  const changeStatus = async (id, nextStatus, e) => {
    e?.stopPropagation();
    if (!isFirebaseConfigured) {
      const nextItems = items.map((item) => (item.id === id ? { ...item, status: nextStatus } : item));
      setItems(nextItems);
      writeLocal(nextItems);
      if (selected?.id === id) setSelected((prev) => ({ ...prev, status: nextStatus }));
      return;
    }
    try {
      await updateDoc(doc(db, 'inquiries', id), { status: nextStatus });
      if (selected?.id === id) setSelected((prev) => ({ ...prev, status: nextStatus }));
    } catch (error) {
      console.error('Error updating inquiry status:', error);
    }
  };

  const archiveItem = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm(t('admin.archive_confirm', { defaultValue: 'Архивке жіберуді растайсыз ба?' }))) return;
    if (!isFirebaseConfigured) {
      const nextItems = items.map((item) => (item.id === id ? { ...item, archived: true } : item)).filter((item) => !item.archived);
      setItems(nextItems);
      writeLocal(nextItems);
      setSelected(null);
      return;
    }
    try {
      await updateDoc(doc(db, 'inquiries', id), { archived: true });
      setSelected(null);
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };

  const filtered = useMemo(() => {
    const q = normalizeText(search);
    return items.filter((item) => {
      const matchSearch =
        !q ||
        normalizeText(item.name).includes(q) ||
        normalizeText(item.phone).includes(q) ||
        normalizeText(item.subject).includes(q);
      const matchStatus = status === 'all' || (item.status || 'new') === status;
      return matchSearch && matchStatus;
    });
  }, [items, search, status]);

  const badge = (value = 'new') => {
    const map = {
      new: ['bg-blue-50 text-blue-700', Clock, t('admin.new')],
      viewed: ['bg-slate-100 text-slate-700', Clock, t('admin.viewed', { defaultValue: 'Қаралды' })],
      contacted: ['bg-amber-50 text-amber-700', Phone, t('admin.contacted', { defaultValue: 'Байланысты' })],
      processed: ['bg-amber-50 text-amber-700', Phone, t('admin.processed')],
      completed: ['bg-emerald-50 text-emerald-700', CheckCircle2, t('admin.completed', { defaultValue: 'Аяқталды' })],
    };
    const [classes, Icon, label] = map[value] || map.new;
    return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${classes}`}><Icon size={13} />{label}</span>;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="admin-input pl-11" placeholder={t('admin.search')} />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-input lg:w-56">
          <option value="all">{t('common.all')}</option>
          <option value="new">{t('admin.new')}</option>
          <option value="viewed">{t('admin.viewed', { defaultValue: 'Қаралды' })}</option>
          <option value="contacted">{t('admin.contacted', { defaultValue: 'Байланысты' })}</option>
          <option value="processed">{t('admin.processed')}</option>
          <option value="completed">{t('admin.completed', { defaultValue: 'Аяқталды' })}</option>
        </select>
      </div>

      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-5 py-4">{t('admission.name')}</th>
                <th className="px-5 py-4">{t('contacts.subject')}</th>
                <th className="px-5 py-4">{t('admission.message')}</th>
                <th className="px-5 py-4">{t('common.date')}</th>
                <th className="px-5 py-4">{t('admin.status')}</th>
                <th className="px-5 py-4 text-right">{t('admin.edit')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-500">{t('common.loading')}</td></tr>
              ) : filtered.length ? (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelected(item)}
                  >
                    <td className="px-5 py-4">
                      <p className="font-bold text-primary-dark">{item.name}</p>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                        <Phone size={12} />{item.phone}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-accent-lightGold px-3 py-1 text-xs font-bold text-primary">{item.subject}</span>
                    </td>
                    <td className="max-w-sm truncate px-5 py-4 text-slate-500">{item.message}</td>
                    <td className="px-5 py-4 text-slate-500">{item.date || formatDate(item.createdAt, i18n.language)}</td>
                    <td className="px-5 py-4">{badge(item.status)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={toWa(item.phone)}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => { e.stopPropagation(); changeStatus(item.id, 'processed'); }}
                          className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                          title="WhatsApp"
                        >
                          <MessageCircle size={16} />
                        </a>
                        <button type="button" onClick={(e) => changeStatus(item.id, 'viewed', e)} className="rounded-lg px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100">{t('admin.viewed', { defaultValue: 'Қаралды' })}</button>
                        <button type="button" onClick={(e) => changeStatus(item.id, 'contacted', e)} className="rounded-lg px-2 py-1 text-xs font-bold text-amber-700 hover:bg-amber-50">{t('admin.contacted', { defaultValue: 'Байланысты' })}</button>
                        <button type="button" onClick={(e) => changeStatus(item.id, 'completed', e)} className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"><CheckCircle2 size={16} /></button>
                        <button type="button" onClick={(e) => archiveItem(item.id, e)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-500">{t('common.not_found')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal — rendered via Portal to escape stacking context */}
      {selected && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-primary-dark">{selected.name || '—'}</h2>
              <button type="button" onClick={() => setSelected(null)} className="rounded-lg bg-slate-100 p-2 text-slate-500 hover:bg-slate-200">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 px-6 py-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">{t('contacts.subject')}</p>
                  <span className="mt-1 inline-block rounded-full bg-accent-lightGold px-3 py-1 text-xs font-bold text-primary">{selected.subject || '—'}</span>
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">{t('common.date')}</p>
                  <p className="mt-1 font-semibold text-slate-700">{selected.date || formatDate(selected.createdAt, i18n.language)}</p>
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">{t('admin.status')}</p>
                  <div className="mt-1">{badge(selected.status)}</div>
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">{t('admission.phone')}</p>
                  <a href={`tel:${selected.phone}`} className="mt-1 inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
                    <Phone size={14} /> {selected.phone}
                  </a>
                </div>
              </div>

              {selected.message && (
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">{t('admission.message')}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700 whitespace-pre-wrap">{selected.message}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 border-t border-slate-100 px-6 py-4">
              <a
                href={toWa(selected.phone)}
                target="_blank"
                rel="noreferrer"
                onClick={() => changeStatus(selected.id, 'processed')}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white hover:bg-emerald-600"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a
                href={`tel:${selected.phone}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <Phone size={16} />
              </a>
              <button
                type="button"
                onClick={(e) => changeStatus(selected.id, 'processed', e)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
              >
                <CheckCircle2 size={16} />
              </button>
              <button
                type="button"
                onClick={(e) => archiveItem(selected.id, e)}
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

export default Inquiries;
