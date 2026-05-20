import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Globe2, Landmark, Languages, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getInstituteContent } from '../data/instituteContent';

const icons = [ShieldCheck, Globe2, Landmark, BookOpen, Languages, CheckCircle2];

const HistoryMission = () => {
  const { t, i18n } = useTranslation();
  const institute = getInstituteContent(i18n.language);
  const points = t('historyMission.points', { returnObjects: true, defaultValue: [] });

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-primary-dark pb-16 pt-32 text-white sm:pt-40">
        <img src={institute.baseImages.seminar} alt={t('historyMission.title')} className="absolute inset-0 h-full w-full object-cover opacity-28" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/55" />
        <div className="islamic-pattern absolute inset-0 opacity-[0.12]" />
        <div className="container-custom relative z-10 max-w-4xl">
          <p className="section-eyebrow">{t('nav.institute')}</p>
          <h1 className="section-title text-white">{t('historyMission.title')}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{t('historyMission.subtitle')}</p>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-custom grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="section-eyebrow">{institute.aboutEyebrow}</p>
            <h2 className="section-title">{institute.missionTitle}</h2>
            <p className="section-copy mt-5">{institute.mission}</p>
            <p className="section-copy mt-5">{t('historyMission.goal')}</p>
          </div>
          <div className="overflow-hidden rounded-lg shadow-[0_24px_80px_rgba(5,24,17,0.12)]">
            <img src={institute.baseImages.studyGroup} alt={t('historyMission.title')} className="aspect-[4/3] w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom">
          <div className="mb-10 max-w-3xl">
            <p className="section-eyebrow">{t('historyMission.directions_eyebrow')}</p>
            <h2 className="section-title">{t('historyMission.directions_title')}</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(points) &&
              points.map((point, index) => {
                const Icon = icons[index] || CheckCircle2;
                return (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ delay: index * 0.04 }}
                    className="premium-card p-6"
                  >
                    <Icon className="mb-5 text-accent-gold" size={30} />
                    <h3 className="text-xl font-bold text-primary-dark">{point.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{point.desc}</p>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      <section className="section-y bg-primary-dark text-white">
        <div className="container-custom grid gap-6 lg:grid-cols-2">
          <div className="glass-dark p-7">
            <h2 className="text-2xl font-bold text-white">{institute.legalTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-white/70">{institute.legalText}</p>
          </div>
          <div className="glass-dark p-7">
            <h2 className="text-2xl font-bold text-white">{t('historyMission.local_title')}</h2>
            <p className="mt-4 text-sm leading-7 text-white/70">{t('historyMission.local_desc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HistoryMission;
