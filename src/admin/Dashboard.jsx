import React, { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { ArrowRight, Clock, Image, Inbox, MessageSquare, Newspaper, Plus, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { db, isFirebaseConfigured } from '../firebase/config';
import { formatDate } from '../utils/formatDate';

const toMs = (value) => {
  if (!value) return 0;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.toDate === 'function') return value.toDate().getTime();
  return new Date(value).getTime() || 0;
};

const isToday = (value) => {
  const date = new Date(toMs(value));
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const StatCard = ({ title, value, icon: Icon, tone, to, sub }) => (
  <Link to={to} className="premium-card block p-5 hover:shadow-xl">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">{title}</p>
        <p className="mt-2 font-serif text-3xl font-extrabold text-primary-dark">{value}</p>
        {sub && <p className="mt-1 text-xs font-bold text-slate-400">{sub}</p>}
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${tone}`}>
        <Icon size={23} />
      </div>
    </div>
  </Link>
);

const RecentList = ({ title, items, empty, to, nameKey }) => {
  const { t, i18n } = useTranslation();
  return (
    <div className="premium-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <h2 className="text-xl font-bold text-primary-dark">{title}</h2>
        <Link to={to} className="text-sm font-extrabold text-primary hover:text-accent-gold">{t('common.all')}</Link>
      </div>
      <div className="divide-y divide-slate-100">
        {items.length ? items.map((item) => (
          <Link key={item.id} to={to} className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50">
            <div className="min-w-0">
              <p className="truncate font-bold text-primary-dark">{item[nameKey] || item.fullName || item.name}</p>
              <p className="truncate text-sm text-slate-500">{item.program || item.subject || item.message}</p>
            </div>
            <span className="shrink-0 text-xs font-semibold text-slate-400">{formatDate(item.createdAt, i18n.language)}</span>
          </Link>
        )) : (
          <div className="p-8 text-center text-sm font-semibold text-slate-400">{empty}</div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const context = useOutletContext();
  const notifications = context?.notifications || [];
  const [stats, setStats] = useState({ applications: [], inquiries: [], news: [], gallery: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      const local = (key) => JSON.parse(window.localStorage.getItem(`syganaki-${key}`) || '[]').filter((item) => !item.deleted && !item.archived);
      setStats({
        applications: local('applications'),
        inquiries: local('inquiries'),
        news: local('news'),
        gallery: local('gallery'),
      });
      setLoading(false);
      return;
    }

    const collections = ['applications', 'inquiries', 'news', 'gallery'];
    const unsubscribes = collections.map((name) => {
      const q = query(collection(db, name), orderBy('createdAt', 'desc'), limit(80));
      return onSnapshot(q, (snapshot) => {
        setStats((current) => ({
          ...current,
          [name]: snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).filter((item) => !item.deleted && !item.archived),
        }));
        setLoading(false);
      });
    });

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [i18n.language]);

  const unreadApplications = notifications.filter((item) => item.type === 'application' && !item.read).length;
  const unreadInquiries = notifications.filter((item) => item.type === 'message' && !item.read).length;

  const cards = [
    { title: t('admin.applications'), value: stats.applications.length, icon: Inbox, tone: 'bg-primary text-white', to: '/admin/applications', sub: `${unreadApplications} ${t('admin.unread')}` },
    { title: t('admin.inquiries'), value: stats.inquiries.length, icon: MessageSquare, tone: 'bg-emerald-600 text-white', to: '/admin/inquiries', sub: `${unreadInquiries} ${t('admin.unread')}` },
    { title: t('admin.news'), value: stats.news.length, icon: Newspaper, tone: 'bg-accent-gold text-primary-dark', to: '/admin/news' },
    { title: t('admin.gallery'), value: stats.gallery.length, icon: Image, tone: 'bg-slate-900 text-white', to: '/admin/gallery' },
    { title: t('admin.today_applications', { defaultValue: 'Бүгінгі өтінімдер' }), value: stats.applications.filter((item) => isToday(item.createdAt)).length, icon: Clock, tone: 'bg-blue-600 text-white', to: '/admin/applications' },
    { title: t('admin.today_inquiries', { defaultValue: 'Бүгінгі сұраныстар' }), value: stats.inquiries.filter((item) => isToday(item.createdAt)).length, icon: Clock, tone: 'bg-amber-500 text-primary-dark', to: '/admin/inquiries' },
  ];

  const recentApplications = useMemo(() => stats.applications.slice(0, 5), [stats.applications]);
  const recentInquiries = useMemo(() => stats.inquiries.slice(0, 5), [stats.inquiries]);

  const quickActions = [
    ['/admin/news', t('admin.add_news'), Newspaper],
    ['/admin/programs', t('admin.add_program', { defaultValue: 'Бағдарлама қосу' }), Plus],
    ['/admin/gallery', t('admin.add_gallery_photo', { defaultValue: 'Галереяға фото қосу' }), Image],
    ['/admin/content?tab=contacts', t('admin.change_contacts', { defaultValue: 'Контакт өзгерту' }), Settings],
  ];

  return (
    <div className="space-y-6">
      <div className="premium-card bg-primary-dark p-6 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent-gold">{t('admin.dashboard')}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map(([to, label, Icon]) => (
              <Link key={to} to={to} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-bold text-white hover:bg-white hover:text-primary-dark">
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => <StatCard key={card.title} {...card} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {loading ? (
          <>
            <div className="h-80 animate-pulse rounded-lg bg-white" />
            <div className="h-80 animate-pulse rounded-lg bg-white" />
          </>
        ) : (
          <>
            <RecentList title={t('admin.recent_applications', { defaultValue: 'Соңғы өтінімдер' })} items={recentApplications} empty={t('common.not_found')} to="/admin/applications" nameKey="fullName" />
            <RecentList title={t('admin.recent_inquiries', { defaultValue: 'Соңғы сұраныстар' })} items={recentInquiries} empty={t('common.not_found')} to="/admin/inquiries" nameKey="name" />
          </>
        )}
      </div>

      <Link to="/admin/notifications" className="btn-ghost">
        {t('admin.notifications')}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
};

export default Dashboard;
