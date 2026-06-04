import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Loader2, Lock, Mail, ChevronLeft, Send, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { auth, isFirebaseConfigured } from '../firebase/config';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const getLoginError = (err) => {
    if (!isFirebaseConfigured) {
      return t('admin.firebase_missing', { defaultValue: 'Firebase configuration is missing. Check Vercel environment variables.' });
    }
    if (err?.code === 'auth/unauthorized-domain') {
      return t('admin.unauthorized_domain', { defaultValue: 'This domain is not allowed in Firebase Auth settings.' });
    }
    if (err?.code === 'auth/invalid-api-key' || err?.code === 'auth/api-key-not-valid') {
      return t('admin.invalid_firebase_key', { defaultValue: 'Firebase API key is invalid or missing.' });
    }
    if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found') {
      return t('admin.login_error', { defaultValue: 'Invalid email or password' });
    }
    if (err?.code === 'auth/too-many-requests') {
      return t('admin.too_many_login_attempts', { defaultValue: 'Too many attempts. Try again later or reset the password.' });
    }
    if (err?.code === 'auth/network-request-failed') {
      return t('admin.login_network_error', { defaultValue: 'Network error. Check the connection and try again.' });
    }
    if (err?.code) {
      return `${t('admin.login_error', { defaultValue: 'Login failed' })}: ${err.code}`;
    }
    return t('admin.login_error', { defaultValue: 'Invalid email or password' });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    if (!isFirebaseConfigured) {
      setError(getLoginError());
      setLoading(false);
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      console.error('Admin login failed:', err);
      setError(getLoginError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError(t('admin.email_required', { defaultValue: 'Enter email' }));
      return;
    }
    setLoading(true);
    setError('');
    if (!isFirebaseConfigured) {
      setError(getLoginError());
      setLoading(false);
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      console.error('Password reset failed:', err);
      setError(t('admin.reset_error', { defaultValue: 'Something went wrong. Check the email address.' }));
    } finally {
      setLoading(false);
    }
  };

  if (isForgotPassword) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary-dark p-4">
        <img src="/institute/hero-institute.jpeg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="islamic-pattern absolute inset-0 opacity-[0.10]" />

        <div className="premium-panel relative z-10 w-full max-w-md bg-white p-8">
          <button
            onClick={() => { setIsForgotPassword(false); setResetSent(false); setError(''); }}
            className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors"
          >
            <ChevronLeft size={16} />
            {t('common.back')}
          </button>

          {!resetSent ? (
            <>
              <div className="mb-7 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-gold/10 text-accent-gold">
                  <Mail size={30} />
                </div>
                <h1 className="text-3xl font-bold">{t('admin.forgot_password', { defaultValue: 'Password recovery' })}</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {t('admin.forgot_password_hint', { defaultValue: 'Enter your email to receive a password reset link.' })}
                </p>
              </div>

              {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}

              <form onSubmit={handleResetPassword} className="space-y-6">
                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-500">{t('admin.email', { defaultValue: 'Email address' })}</span>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-12 py-4 font-bold outline-none focus:border-accent-gold transition-all"
                      placeholder="admin@syganaki.kz"
                    />
                  </div>
                </label>

                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-3 py-4 shadow-xl shadow-accent-gold/20">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  {t('common.send')}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Send size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('admin.reset_sent', { defaultValue: 'Successfully sent!' })}</h2>
              <p className="text-slate-500 mb-8">
                {email} - {t('admin.reset_sent_desc', { defaultValue: 'Password reset instructions were sent to your email. Check your inbox.' })}
              </p>
              <button
                onClick={() => setIsForgotPassword(false)}
                className="btn-primary w-full"
              >
                {t('admin.return_login', { defaultValue: 'Return to login' })}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary-dark p-4">
      <img src="/institute/hero-institute.jpeg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="islamic-pattern absolute inset-0 opacity-[0.10]" />

      <form onSubmit={handleLogin} className="premium-panel relative z-10 w-full max-w-md bg-white p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/20">
            <Lock size={30} />
          </div>
          <h1 className="text-3xl font-bold">{t('admin.login_title')}</h1>
          <p className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-widest">{t('admin.login_subtitle')}</p>
        </div>

        {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}

        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-slate-500">Email</span>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-12 py-4 font-bold outline-none focus:border-primary transition-all"
                placeholder="admin@syganaki.kz"
              />
            </div>
          </label>

          <label className="block">
            <div className="mb-2 flex justify-between items-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500">{t('admin.password')}</span>
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-xs font-bold text-primary hover:text-accent-gold transition-colors"
              >
                {t('admin.forgot_password_link', { defaultValue: 'Forgot password?' })}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 py-4 pl-12 pr-14 font-bold outline-none focus:border-primary transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/70 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label={showPassword
                  ? t('admin.hide_password', { defaultValue: 'Hide password' })
                  : t('admin.show_password', { defaultValue: 'Show password' })}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <div className="pt-2">
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-3 py-4 shadow-xl shadow-primary/20">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
              {t('admin.login')}
            </button>
          </div>

          <Link to="/" className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors">
            <ChevronLeft size={16} />
            {t('admin.back_site')}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
