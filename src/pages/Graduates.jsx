import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, GraduationCap, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getInstituteContent } from '../data/instituteContent';

const Graduates = () => {
  const { t, i18n } = useTranslation();
  const institute = getInstituteContent(i18n.language);
  const stats = t('graduatesPage.stats', { returnObjects: true, defaultValue: [] });
  const roles = t('graduatesPage.roles', { returnObjects: true, defaultValue: [] });

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-primary-dark pb-16 pt-32 text-white sm:pt-40">
        <img src={institute.baseImages.graduates} alt={t('graduatesPage.title')} className="absolute inset-0 h-full w-full object-cover opacity-28" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/55" />
        <div className="islamic-pattern absolute inset-0 opacity-[0.12]" />
        <div className="container-custom relative z-10 max-w-4xl">
          <p className="section-eyebrow">{institute.graduatesEyebrow}</p>
          <h1 className="section-title text-white">{t('graduatesPage.title')}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{institute.graduatesText}</p>
        </div>
      </section>

      <section className="-mt-8 pb-8">
        <div className="container-custom relative z-20 grid gap-4 md:grid-cols-3">
          {Array.isArray(stats) &&
            stats.map((item, index) => {
              const Icon = [GraduationCap, Users, Briefcase][index] || GraduationCap;
              return (
                <div key={item.label} className="premium-panel bg-white p-6">
                  <Icon className="mb-4 text-accent-gold" size={30} />
                  <p className="font-serif text-4xl font-extrabold text-primary-dark">{item.value}</p>
                  <p className="mt-2 text-sm font-bold text-slate-600">{item.label}</p>
                </div>
              );
            })}
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-custom grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="section-eyebrow">{t('graduatesPage.outcomes_eyebrow')}</p>
            <h2 className="section-title">{t('graduatesPage.outcomes_title')}</h2>
            <p className="section-copy mt-5">{t('graduatesPage.outcomes_desc')}</p>
            <Link to="/programs" className="btn-primary mt-8">
              {t('nav.programs')}
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {Array.isArray(roles) &&
              roles.map((role, index) => (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: index * 0.04 }}
                  className="premium-card p-5"
                >
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-lightGold font-serif text-lg font-extrabold text-primary">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-bold text-primary-dark">{role}</h3>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Graduates;
