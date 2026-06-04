import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Building2,
  FileText,
  Library,
  ShieldCheck,
  Target,
  User,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getInstituteContent } from '../data/instituteContent';

const PageHero = ({ title, subtitle }) => (
  <section className="relative overflow-hidden bg-primary-dark pb-16 pt-32 text-white sm:pt-40">
    <img src="/institute/official-campus-yard.jpg" alt={title} className="absolute inset-0 h-full w-full object-cover opacity-50" loading="eager" />
    <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/72 to-primary-dark/30" />
    <div className="islamic-pattern absolute inset-0 opacity-[0.10]" />
    <div className="container-custom relative z-10 max-w-4xl">
      <p className="section-eyebrow">{title}</p>
      <h1 className="section-title text-white">{title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{subtitle}</p>
    </div>
  </section>
);

const About = () => {
  const { t, i18n } = useTranslation();
  const [overrideVersion, setOverrideVersion] = useState(0);

  useEffect(() => {
    const handleLoaded = () => setOverrideVersion((v) => v + 1);
    window.addEventListener('syganaki-siteTexts-loaded', handleLoaded);
    return () => window.removeEventListener('syganaki-siteTexts-loaded', handleLoaded);
  }, []);

  const institute = useMemo(() => getInstituteContent(i18n.language), [i18n.language, overrideVersion]);
  const values = t('about.values', { returnObjects: true });
  const stats = institute.stats.map(([value, label]) => ({ value, label }));
  const documents = t('about.documents', { returnObjects: true, defaultValue: [] });
  const materialItems = t('about.material_items', { returnObjects: true, defaultValue: [] });
  const leadership = institute.teachers.find((teacher) => teacher.id === 'bagdat-manabayev') || institute.teachers[0];

  return (
    <div className="bg-background">
      <PageHero title={t('about.title')} subtitle={t('about.subtitle')} />

      <section className="section-y bg-white">
        <div className="container-custom grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <img src="/institute/library.jpeg" alt={t('about.history_title')} className="aspect-[4/3] w-full rounded-lg object-cover shadow-2xl" loading="lazy" />
            <div className="premium-panel absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-px overflow-hidden bg-slate-200/70">
              {stats.slice(0, 3).map((item) => (
                <div key={item.label} className="bg-white/92 p-4 text-center">
                  <p className="font-serif text-2xl font-extrabold text-primary">{item.value}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="section-eyebrow">{institute.aboutEyebrow}</p>
            <h2 className="section-title">{t('about.history_title')}</h2>
            <p className="section-copy mt-6">{t('about.history')}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="premium-card p-6">
                <Target className="mb-4 text-accent-gold" size={30} />
                <h3 className="text-xl font-bold">{t('about.mission_title')}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{t('about.mission')}</p>
              </div>
              <div className="premium-card p-6">
                <ShieldCheck className="mb-4 text-accent-gold" size={30} />
                <h3 className="text-xl font-bold">{t('about.vision_title')}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{t('about.vision')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom">
          <div className="mb-10 max-w-3xl">
            <p className="section-eyebrow">{t('about.official_info_eyebrow')}</p>
            <h2 className="section-title">{t('about.official_info_title')}</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {institute.aboutPoints.map(([title, desc], index) => {
              const icons = [Award, Building2, ShieldCheck, Library];
              const Icon = icons[index] || ShieldCheck;
              return (
                <div key={title} className="premium-card p-6">
                  <Icon className="mb-5 text-accent-gold" size={30} />
                  <h3 className="text-xl font-bold text-primary-dark">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="premium-panel bg-white p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-primary-dark">{t('about.activity_title')}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{t('about.activity_desc')}</p>
            </div>
            <div className="premium-panel bg-white p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-primary-dark">{institute.legalTitle}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{institute.legalText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary-dark py-16 text-white">
        <div className="container-custom">
          <div className="mb-10 max-w-3xl">
            <p className="section-eyebrow">{t('about.values_title')}</p>
            <h2 className="section-title text-white">{t('about.values_title')}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {values.map((value, index) => {
              const icons = [ShieldCheck, Award, Users];
              const Icon = icons[index] || ShieldCheck;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="glass-dark p-7"
                >
                  <Icon className="mb-5 text-accent-gold" size={34} />
                  <h3 className="text-2xl font-bold text-white">{value.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/68">{value.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="license" className="section-y bg-background scroll-mt-28">
        <div className="container-custom grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="premium-panel bg-white p-6 sm:p-8">
            <FileText className="mb-5 text-accent-gold" size={34} />
            <h2 className="text-3xl font-bold">{t('about.documents_title')}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{t('about.documents_desc')}</p>
            <div className="mt-6 space-y-3">
              {documents.map((document) => (
                <div key={document.title} className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                  <h3 className="font-bold text-primary-dark">{document.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{document.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="premium-panel overflow-hidden bg-white p-0">
              <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                <div className="relative min-h-[260px] bg-slate-100">
                  <img
                    src={leadership?.image || '/institute/director.jpg'}
                    alt={leadership?.name || t('about.leadership_title')}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-lightGold text-primary">
                    <User size={24} />
                  </div>
                  <p className="section-eyebrow">{t('nav.leadership')}</p>
                  <h2 className="text-3xl font-bold">{t('about.leadership_title')}</h2>
                  <p className="mt-3 font-serif text-2xl font-bold leading-tight text-primary-dark">{leadership?.name}</p>
                  <p className="mt-2 text-base font-semibold leading-7 text-slate-700">{leadership?.role}</p>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{leadership?.bio}</p>
                  <Link to="/leadership" className="btn-ghost mt-6">
                    {t('nav.leadership')}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="premium-panel bg-white p-6 sm:p-8">
              <Building2 className="mb-5 text-accent-gold" size={34} />
              <h2 className="text-3xl font-bold">{t('about.material_title')}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{t('about.material_desc')}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {materialItems.map((item) => (
                  <div key={item} className="flex gap-3 rounded-lg bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                    <Library size={18} className="mt-0.5 shrink-0 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Dynamic Blocks Section */}
      {institute.customBlocks?.about?.length > 0 && (
        <section className="section-y bg-white border-t border-slate-100">
          <div className="container-custom">
            <div className="mb-10 max-w-3xl">
              <p className="section-eyebrow">{t('common.additional_info', { defaultValue: 'Қосымша ақпарат' })}</p>
              <h2 className="section-title text-balance">
                {t('about.custom_blocks_title', { defaultValue: 'Институт ерекшеліктері мен қосымша мәліметтер' })}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {institute.customBlocks.about.map((block, index) => (
                <motion.div
                  key={block.id || index}
                  initial={{ opacity: 0, y: 20 }}
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

      <section className="pb-16">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-lg bg-white p-6 shadow-[0_20px_70px_rgba(5,24,17,0.08)] sm:p-8 lg:flex lg:items-center lg:justify-between">
            <div>
              <p className="section-eyebrow">{t('nav.contacts')}</p>
              <h2 className="text-3xl font-bold">{t('about.cta_title')}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{t('about.cta_desc')}</p>
            </div>
            <Link to="/contacts" className="btn-primary mt-6 lg:mt-0">
              {t('nav.contacts')}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
