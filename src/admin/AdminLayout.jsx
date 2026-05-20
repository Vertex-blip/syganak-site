import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  Bell,
  Bot,
  CheckCircle2,
  ChevronDown,
  FileText,
  Globe,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  Settings,
  User,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { hasAdminAccess } from '../services/adminAuth';
import { subscribeAdminNotifications } from '../services/notificationService';
import { getPushPermissionState, registerAdminPushToken, subscribeForegroundAdminPush } from '../services/pushNotificationService';

const PushNotificationsCard = ({ user }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState('checking');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    getPushPermissionState().then((state) => {
      if (mounted) setStatus(state);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let unsubscribe = () => {};
    subscribeForegroundAdminPush((payload) => {
      const title = payload?.notification?.title || payload?.data?.title;
      if (title && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('syganaki-admin-push', { detail: payload }));
      }
    }).then((cleanup) => {
      unsubscribe = cleanup;
    });
    return () => unsubscribe();
  }, []);

  const enable = async () => {
    setBusy(true);
    try {
      const result = await registerAdminPushToken(user);
      setStatus(result.status);
    } catch (error) {
      console.warn('Push registration failed:', error);
      setStatus('error');
    } finally {
      setBusy(false);
    }
  };

  const statusLabel = {
    checking: t('admin.push_checking', { defaultValue: 'Тексерілуде' }),
    granted: t('admin.push_enabled', { defaultValue: 'қосылған' }),
    denied: t('admin.push_denied', { defaultValue: 'рұқсат берілмеген' }),
    unsupported: t('admin.push_unsupported', { defaultValue: 'браузер қолдамайды' }),
    default: t('admin.push_disabled', { defaultValue: 'қосылмаған' }),
    'missing-vapid-key': t('admin.push_missing_key', { defaultValue: 'VAPID key қажет' }),
    error: t('admin.push_error', { defaultValue: 'қате' }),
  };

  if (status === 'granted') {
    return (
      <div className="hidden items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 md:flex">
        <CheckCircle2 size={15} />
        {t('admin.push_status')}: {statusLabel[status]}
      </div>
    );
  }

  if (status === 'unsupported') {
    return (
      <div className="hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500 md:block">
        {t('admin.push_status')}: {statusLabel[status]}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={enable}
      disabled={busy || status === 'denied' || status === 'checking'}
      className="inline-flex min-h-[38px] items-center gap-2 rounded-lg border border-accent-gold/40 bg-accent-lightGold px-3 py-2 text-xs font-extrabold text-primary-dark hover:border-accent-gold disabled:opacity-60"
      title={statusLabel[status]}
    >
      <Bell size={15} />
      {busy ? t('common.loading') : t('admin.enable_push', { defaultValue: 'Push' })}
    </button>
  );
};

const ADMIN_LANGUAGES = [
  { code: 'kz', label: 'Қазақша', short: 'KZ' },
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'en', label: 'English', short: 'ENG' },
  { code: 'ar', label: 'العربية', short: 'AR' },
];

const AdminLayout = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentLang = ADMIN_LANGUAGES.find((l) => l.code === i18n.language) || ADMIN_LANGUAGES[0];

  const changeAdminLanguage = (code) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  const unreadNotifications = useMemo(
    () => notifications.filter((item) => !item.read),
    [notifications],
  );

  const prevUnreadCount = React.useRef(0);

  useEffect(() => {
    const current = unreadNotifications.length;
    const prev = prevUnreadCount.current;
    if (current > prev && prev >= 0 && 'Notification' in window) {
      const newest = unreadNotifications[0];
      if (Notification.permission === 'granted' && newest) {
        new Notification(newest.title || 'Жаңа хабарлама', {
          body: newest.body || '',
          icon: '/logo.png',
        });
      }
    }
    prevUnreadCount.current = current;
  }, [unreadNotifications]);

  const counts = useMemo(
    () => ({
      notifications: unreadNotifications.length,
      applications: unreadNotifications.filter((item) => item.type === 'application').length,
      inquiries: unreadNotifications.filter((item) => item.type === 'message').length,
      uploads: unreadNotifications.filter((item) => item.type === 'upload').length,
    }),
    [unreadNotifications],
  );

  const menuItems = [
    { icon: LayoutDashboard, label: t('admin.dashboard'), path: '/admin' },
    { icon: Bell, label: t('admin.notifications'), path: '/admin/notifications', badge: counts.notifications },
    { icon: Inbox, label: t('admin.applications'), path: '/admin/applications', badge: counts.applications },
    { icon: MessageSquare, label: t('admin.inquiries'), path: '/admin/inquiries', badge: counts.inquiries },
    { icon: Newspaper, label: t('admin.news'), path: '/admin/news', badge: counts.uploads },
    { icon: Image, label: t('admin.gallery'), path: '/admin/gallery', badge: counts.uploads },
    { icon: Settings, label: t('admin.programs'), path: '/admin/programs' },
    { icon: FileText, label: t('admin.content'), path: '/admin/content' },
    { icon: Bot, label: t('admin.assistant'), path: '/admin/assistant' },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/admin/login');
      } else {
        try {
          const allowed = await hasAdminAccess(currentUser);
          if (!allowed) {
            setAccessDenied(true);
            await signOut(auth);
          } else {
            setUser(currentUser);
          }
        } catch {
          setAccessDenied(true);
          await signOut(auth);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user && isFirebaseConfigured) return;
    const unsubscribe = subscribeAdminNotifications(user, i18n.language, setNotifications);
    return () => unsubscribe();
  }, [i18n.language, user]);

  const handleLogout = async () => {
    if (!window.confirm(t('admin.logout_confirm', { defaultValue: 'Шығуды растайсыз ба?' }))) return;
    await signOut(auth);
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="premium-panel max-w-md bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-primary-dark">{t('admin.unauthorized', { defaultValue: 'You do not have access to this section.' })}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">{t('admin.security_note', { defaultValue: 'Admin access is protected by Firebase Auth and the admin role.' })}</p>
          <Link to="/admin/login" className="btn-primary mt-6">{t('admin.login')}</Link>
        </div>
      </div>
    );
  }

  const currentTitle = menuItems.find((item) => item.path === location.pathname)?.label || t('admin.dashboard');
  const totalNew = counts.notifications;

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 lg:flex">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[86vw] transform bg-primary-dark text-white shadow-2xl transition-transform duration-300 lg:static lg:max-w-none lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <Link to="/" className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white p-1.5">
                <img src="/logo.png" alt={t('brand.name')} className="h-full w-full object-contain" />
              </span>
              <span className="min-w-0">
                <span className="block font-serif text-sm font-bold leading-snug">{t('brand.name')}</span>
                <span className="block text-[10px] font-extrabold uppercase tracking-[0.22em] text-accent-gold">Admin</span>
              </span>
            </Link>
            <button type="button" className="rounded-lg bg-white/10 p-2 lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {menuItems.map(({ icon: Icon, label, path, badge }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/admin'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-lg px-4 py-3 text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-accent-gold text-primary-dark shadow-lg'
                      : 'text-white/65 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={19} />
                  {label}
                </div>
                {badge > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4 space-y-2">
            <PushNotificationsCard user={user} />
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" className="rounded-lg bg-slate-100 p-2 text-primary lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={21} />
            </button>
            <h1 className="truncate text-lg font-extrabold text-primary-dark">{currentTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <PushNotificationsCard user={user} />

            {/* Language switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                className="flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 text-xs font-bold text-slate-600 hover:bg-accent-lightGold hover:text-primary-dark"
              >
                <Globe size={15} className="opacity-70" />
                {currentLang.short}
                <ChevronDown size={13} className={`opacity-60 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close language menu"
                    className="fixed inset-0 z-[90]"
                    onClick={() => setLangOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-[100] mt-2 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl">
                    {ADMIN_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => changeAdminLanguage(lang.code)}
                        className={`flex w-full items-center justify-between rounded px-3 py-2 text-xs font-semibold transition-colors ${
                          currentLang.code === lang.code
                            ? 'bg-primary/10 text-primary-dark'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                        }`}
                      >
                        <span>{lang.label}</span>
                        <span className="opacity-50">{lang.short}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigate('/admin/notifications')}
              className="relative rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-accent-lightGold hover:text-primary"
              aria-label={t('admin.notifications')}
            >
              <Bell size={20} />
              {totalNew > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-100 transition-colors"
              >
                <div className="hidden text-right sm:block">
                  <p className="max-w-[220px] truncate text-xs font-bold text-slate-700">{user?.email}</p>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Administrator</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                  <User size={20} />
                </div>
              </button>
              {profileOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    className="fixed inset-0 z-[90]"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-[100] mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
                    <div className="border-b border-slate-100 p-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-lg">
                          <User size={26} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-primary-dark">{user?.email}</p>
                          <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-accent-gold">Administrator</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="rounded-lg bg-slate-50 px-4 py-3">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">{t('admin.email', { defaultValue: 'Email' })}</p>
                        <p className="mt-1 text-xs font-bold text-slate-700">{user?.email}</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 px-4 py-3">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">{t('admin.status', { defaultValue: 'Мәртебе' })}</p>
                        <p className="mt-1 text-xs font-bold text-emerald-600">{t('admin.admin_panel_subtitle', { defaultValue: 'Әкімшілік басқару панелі' })}</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 px-4 py-3">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">UID</p>
                        <p className="mt-1 truncate text-xs font-bold text-slate-500">{user?.uid || '—'}</p>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 p-3">
                      <button
                        type="button"
                        onClick={() => { setProfileOpen(false); handleLogout(); }}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-extrabold text-red-700 hover:bg-red-100 transition-colors"
                      >
                        <LogOut size={16} />
                        {t('admin.logout')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="p-3 sm:p-6 lg:p-8">
          <Outlet context={{ user, notifications }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
