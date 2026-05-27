import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Instagram, Loader2, Mail, MapPin, Phone, Send, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { saveInquiry } from '../services/formService';
import { isValidKazakhstanPhone } from '../utils/security';
import { MAP_URL } from '../config/site';
import { getInstituteContent } from '../data/instituteContent';

const ContactCard = ({ icon, title, children }) => (
  <div className="premium-card p-6">
    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-lightGold text-primary">
      {icon}
    </div>
    <h3 className="text-lg font-bold">{title}</h3>
    <div className="mt-3 text-sm leading-7 text-slate-600">{children}</div>
  </div>
);

const Contacts = () => {
  const { t, i18n } = useTranslation();
  const [overrideVersion, setOverrideVersion] = useState(0);

  useEffect(() => {
    const handleLoaded = () => setOverrideVersion((v) => v + 1);
    window.addEventListener('syganaki-siteTexts-loaded', handleLoaded);
    return () => window.removeEventListener('syganaki-siteTexts-loaded', handleLoaded);
  }, []);

  const institute = useMemo(() => getInstituteContent(i18n.language), [i18n.language, overrideVersion]);
  const subjects = t('contacts.subjects', { returnObjects: true });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: subjects ? subjects[0] : '',
    message: '',
    website: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const isValid = useMemo(
    () => formData.name.trim().length >= 2 && isValidKazakhstanPhone(formData.phone) && formData.message.trim().length >= 5,
    [formData],
  );

  const mapError = (err) => {
    if (err.message === 'rate_limited') return t('common.too_many_requests', { defaultValue: t('common.error') });
    if (err.message === 'invalid_phone') return t('admission.invalid_phone');
    if (err.message === 'spam_detected') return t('admission.spam_error');
    return t('common.error');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!isValid) {
      setError(t('admission.invalid_phone'));
      return;
    }

    setLoading(true);
    try {
      await saveInquiry(formData);
      setSubmitted(true);
      setFormData({ name: '', phone: '', subject: subjects[0], message: '', website: '' });
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-primary-dark pb-16 pt-32 text-white sm:pt-40">
        <img src="/institute/official-campus-sign.jpg" alt={t('contacts.title')} className="absolute inset-0 h-full w-full object-cover opacity-50" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/72 to-primary-dark/30" />
        <div className="islamic-pattern absolute inset-0 opacity-[0.12]" />
        <div className="container-custom relative z-10 max-w-4xl">
          <p className="section-eyebrow">{t('nav.contacts')}</p>
          <h1 className="section-title text-white">{t('contacts.title')}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{t('contacts.subtitle')}</p>
        </div>
      </section>

      <section id="admission-office" className="-mt-8 scroll-mt-28 pb-8">
        <div className="container-custom relative z-20 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ContactCard icon={<MapPin size={24} />} title={t('contacts.address_title')}>
            <a href={MAP_URL} target="_blank" rel="noreferrer" className="font-bold text-primary hover:text-accent-gold">{t('topbar.address')}</a>
          </ContactCard>
          <ContactCard icon={<Phone size={24} />} title={t('contacts.phone_title')}>
            <a href={`tel:${t('topbar.phone')}`} className="font-bold text-primary hover:text-accent-gold">{t('topbar.phone')}</a>
          </ContactCard>
          <ContactCard icon={<Mail size={24} />} title={t('contacts.email_title')}>
            <a href={`mailto:${t('topbar.email')}`} className="font-bold text-primary hover:text-accent-gold">{t('topbar.email')}</a>
          </ContactCard>
          <ContactCard icon={<Clock size={24} />} title={t('contacts.hours_title')}>
            {t('contacts.hours')}
          </ContactCard>
        </div>
      </section>

      <section className="section-y pt-8">
        <div className="container-custom grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="premium-panel bg-white p-6 sm:p-8">
            <h2 className="text-3xl font-bold">{t('contacts.form_title')}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{t('contacts.form_subtitle')}</p>
            {error && <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                tabIndex="-1"
                autoComplete="off"
                value={formData.website}
                onChange={(event) => setFormData({ ...formData, website: event.target.value })}
                className="hidden"
                aria-hidden="true"
              />
              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">{t('admission.name')}</span>
                <input
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  className="input-premium"
                  placeholder={t('admission.name_placeholder')}
                  required
                  minLength={2}
                  autoComplete="name"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">{t('admission.phone')}</span>
                <input
                  value={formData.phone}
                  onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                  className="input-premium"
                  placeholder="+7 777 123 45 67"
                  required
                  type="tel"
                  autoComplete="tel"
                />
                <span className="mt-2 block text-xs font-semibold text-slate-500">{t('admission.phone_help')}</span>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">{t('contacts.subject')}</span>
                <select
                  value={formData.subject}
                  onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
                  className="input-premium"
                >
                  {subjects.map((subject) => (
                    <option key={subject}>{subject}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">{t('admission.message')}</span>
                <textarea
                  value={formData.message}
                  onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                  className="input-premium min-h-[140px] resize-none"
                  placeholder={t('contacts.message_placeholder')}
                  required
                  minLength={5}
                />
              </label>
              <button type="submit" disabled={loading || !isValid} className="btn-primary w-full">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                {loading ? t('common.sending') : t('common.send')}
              </button>
              <p className="text-xs leading-6 text-slate-500">{t('admission.privacy_note')}</p>
            </form>
          </motion.div>

          <div className="space-y-5">
            <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm">
              <iframe
                title={t('contacts.map_title')}
                className="h-[360px] w-full border-0"
                src="/2gis-map.html"
                loading="lazy"
              />
            </div>
            <div className="premium-card p-6">
              <h3 className="text-xl font-bold">{t('contacts.socials_title')}</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/h.syganaki.kz' },
                  { label: 'Telegram', icon: Send, href: 'https://t.me/+77761764131' },
                ].map(({ label, icon: Icon, href }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 font-bold text-slate-700 hover:border-accent-gold hover:bg-accent-lightGold">
                    <Icon size={20} className="text-accent-gold" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Dynamic Blocks Section */}
      {institute.customBlocks?.contacts?.length > 0 && (
        <section className="section-y bg-white border-t border-slate-100">
          <div className="container-custom">
            <div className="mb-10 max-w-3xl">
              <p className="section-eyebrow">{t('common.additional_info', { defaultValue: 'Қосымша ақпарат' })}</p>
              <h2 className="section-title text-balance">
                {t('contacts.custom_blocks_title', { defaultValue: 'Байланыс бойынша қосымша мәліметтер' })}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {institute.customBlocks.contacts.map((block, index) => (
                <motion.div
                  key={block.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: index * 0.05 }}
                  className="premium-card p-6 bg-white border border-slate-100/80 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {block.badge && (
                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-[0.12em] text-accent-gold bg-accent-lightGold px-2.5 py-1 rounded-md mb-4">
                      {block.badge}
                    </span>
                  )}
                  <h4 className="text-lg font-bold text-primary-dark font-serif leading-snug">{block.title}</h4>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{block.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {submitted && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-primary-dark/70 p-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-2xl">
            <button type="button" onClick={() => setSubmitted(false)} className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100" aria-label={t('common.close')}>
              <X size={19} />
            </button>
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={42} />
            </div>
            <h3 className="text-2xl font-bold">{t('contacts.success_title')}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{t('contacts.success_desc')}</p>
            <button type="button" onClick={() => setSubmitted(false)} className="btn-primary mt-7 w-full">
              {t('common.close')}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
