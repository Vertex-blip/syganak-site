import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Loader2,
  MessageCircle,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buildWhatsAppLink, saveApplication } from '../services/formService';
import { fetchDataList } from '../services/dataService';
import { getInstituteContent } from '../data/instituteContent';
import { isValidKazakhstanPhone } from '../utils/security';
import { WHATSAPP_NUMBER } from '../config/site';

const Admission = () => {
  const { t, i18n } = useTranslation();
  const [overrideVersion, setOverrideVersion] = useState(0);

  useEffect(() => {
    const handleLoaded = () => setOverrideVersion((v) => v + 1);
    window.addEventListener('syganaki-siteTexts-loaded', handleLoaded);
    return () => window.removeEventListener('syganaki-siteTexts-loaded', handleLoaded);
  }, []);

  const institute = useMemo(() => getInstituteContent(i18n.language), [i18n.language, overrideVersion]);
  const fallbackPrograms = institute.programs;
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  const steps = t('admission.steps', { returnObjects: true }).slice(0, 5);
  const requirements = t('admission.requirements', { returnObjects: true });
  const periods = t('admission.periods', { returnObjects: true, defaultValue: [] });
  const conditions = t('admission.conditions', { returnObjects: true, defaultValue: [] });
  const faqItems = t('faq.items', { returnObjects: true }).slice(0, 3);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    program: '',
    message: '',
    website: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPrograms = async () => {
      setLoadingPrograms(true);
      const data = await fetchDataList('programs', fallbackPrograms, i18n.language);
      setPrograms(data);
      if (data.length > 0 && !formData.program) {
        setFormData((prev) => ({ ...prev, program: data[0].title }));
      }
      setLoadingPrograms(false);
    };
    loadPrograms();
  }, [i18n.language]);

  const isValid = useMemo(
    () => formData.fullName.trim().length >= 2 && isValidKazakhstanPhone(formData.phone) && Boolean(formData.program),
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
      await saveApplication(formData);
      setSubmitted(true);
      const firstProgram = programs[0]?.title || fallbackPrograms[0]?.title || '';
      setFormData({ fullName: '', phone: '', program: firstProgram, message: '', website: '' });
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-primary-dark pb-16 pt-32 text-white sm:pt-40">
        <img src="/institute/student-life.jpg" alt={t('admission.title')} className="absolute inset-0 h-full w-full object-cover opacity-50" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/72 to-primary-dark/30" />
        <div className="islamic-pattern absolute inset-0 opacity-[0.12]" />
        <div className="container-custom relative z-10 max-w-4xl">
          <p className="section-eyebrow">{t('nav.admission')}</p>
          <h1 className="section-title text-white">{t('admission.title')}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{t('admission.subtitle')}</p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-custom grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="premium-card p-5">
                <CalendarDays className="mb-4 text-accent-gold" size={28} />
                <h3 className="text-xl font-bold">{t('admission.periods_title')}</h3>
                <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  {periods.map((item) => <p key={item}>{item}</p>)}
                </div>
              </div>
              <div className="premium-card p-5">
                <ShieldCheck className="mb-4 text-accent-gold" size={28} />
                <h3 className="text-xl font-bold">{t('admission.conditions_title')}</h3>
                <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  {conditions.map((item) => <p key={item}>{item}</p>)}
                </div>
              </div>
            </div>

            <div className="premium-panel bg-white p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <ShieldCheck className="text-accent-gold" size={30} />
                <h2 className="text-3xl font-bold">{t('admission.features_title')}</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {institute.aboutPoints.map(([title, desc]) => (
                  <div key={title} className="rounded-lg bg-slate-50 p-4">
                    <h3 className="font-bold text-primary-dark">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
                  </div>
                ))}
                <div className="rounded-lg bg-accent-lightGold/50 p-4">
                  <h3 className="font-bold text-primary-dark">{t('admission.certificate_title')}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{t('admission.certificate_note')}</p>
                </div>
              </div>
            </div>

            <div className="premium-panel bg-white p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <FileText className="text-accent-gold" size={30} />
                <h2 className="text-3xl font-bold">{t('admission.programs_title')}</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {fallbackPrograms.slice(0, 2).map((program) => (
                  <div key={program.id} className="rounded-lg border border-slate-200 bg-white p-5">
                    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-accent-gold">{program.duration}</p>
                    <h3 className="mt-2 text-xl font-bold text-primary-dark">{program.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{program.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-7 flex items-center gap-3">
                <ShieldCheck className="text-accent-gold" size={30} />
                <h2 className="text-3xl font-bold">{t('admission.steps_title')}</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="premium-card p-6"
                  >
                    <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent-lightGold font-serif text-xl font-extrabold text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div id="documents" className="premium-panel scroll-mt-28 bg-white p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <FileText className="text-accent-gold" size={30} />
                <h2 className="text-3xl font-bold">{t('admission.docs_title')}</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {requirements.map((item) => (
                  <div key={item} className="flex gap-3 rounded-lg bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="premium-panel bg-white p-6 sm:p-8">
              <h2 className="text-3xl font-bold">{t('faq.title')}</h2>
              <div className="mt-6 space-y-4">
                {faqItems.map((item) => (
                  <div key={item.question} className="rounded-lg border border-slate-200 bg-white p-4">
                    <h3 className="font-bold text-primary-dark">{item.question}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Dynamic Blocks Section */}
            {institute.customBlocks?.admission?.length > 0 && (
              <div className="space-y-6">
                <div className="mb-6">
                  <p className="section-eyebrow">{t('common.additional_info', { defaultValue: 'Қосымша ақпарат' })}</p>
                  <h2 className="text-3xl font-bold text-primary-dark">
                    {t('admission.custom_blocks_title', { defaultValue: 'Қосымша талаптар мен мәліметтер' })}
                  </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {institute.customBlocks.admission.map((block, index) => (
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
            )}
          </div>

          <aside id="application" className="premium-panel sticky top-24 scroll-mt-28 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold">{t('admission.form_title')}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{t('admission.form_subtitle')}</p>

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
                  value={formData.fullName}
                  onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
                  className="input-premium"
                  required
                  minLength={2}
                  autoComplete="name"
                  placeholder={t('admission.name_placeholder')}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">{t('admission.phone')}</span>
                <input
                  value={formData.phone}
                  onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                  className="input-premium"
                  required
                  type="tel"
                  placeholder="+7 777 123 45 67"
                  autoComplete="tel"
                />
                <span className="mt-2 block text-xs font-semibold text-slate-500">{t('admission.phone_help')}</span>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">{t('admission.program')}</span>
                <select
                  value={formData.program}
                  onChange={(event) => setFormData({ ...formData, program: event.target.value })}
                  className="input-premium"
                  disabled={loadingPrograms}
                >
                  {programs.map((program) => (
                    <option key={program.id}>{program.title}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">{t('admission.message')}</span>
                <textarea
                  value={formData.message}
                  onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                  className="input-premium min-h-[118px] resize-none"
                  placeholder={t('admission.message_placeholder')}
                />
              </label>
              <button type="submit" disabled={loading || !isValid} className="btn-primary w-full">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                {loading ? t('common.sending') : t('admission.send')}
              </button>
              <a
                href={buildWhatsAppLink(WHATSAPP_NUMBER, t('admission.whatsapp_text'))}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost w-full"
              >
                <MessageCircle size={18} />
                {t('common.whatsapp')}
              </a>
              <p className="text-xs leading-6 text-slate-500">{t('admission.privacy_note')}</p>
            </form>
          </aside>
        </div>
      </section>

      {submitted && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-primary-dark/70 p-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-2xl">
            <button type="button" onClick={() => setSubmitted(false)} className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100" aria-label={t('common.close')}>
              <X size={19} />
            </button>
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={42} />
            </div>
            <h3 className="text-2xl font-bold">{t('admission.success')}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{t('admission.success_desc')}</p>
            <button type="button" onClick={() => setSubmitted(false)} className="btn-primary mt-7 w-full">
              {t('common.close')}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Admission;
