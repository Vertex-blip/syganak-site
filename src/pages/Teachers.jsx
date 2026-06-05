import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Award, FileText, GraduationCap, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getInstituteContent } from '../data/instituteContent';

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

const initials = (name) =>
  String(name || '')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

const TeacherImage = ({ teacher }) => {
  if (teacher.image) {
    return <img src={teacher.image} alt={teacher.name} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-primary-dark text-4xl font-serif font-bold text-accent-gold">
      {initials(teacher.name)}
    </div>
  );
};

const resumeLabels = {
  kz: 'Түйіндеме',
  ru: 'Резюме',
  en: 'Resume',
  ar: 'السيرة الذاتية',
};

const Teachers = () => {
  const { t, i18n } = useTranslation();
  const institute = getInstituteContent(i18n.language);
  const resumeLabel = resumeLabels[i18n.language] || resumeLabels.kz;
  const phdCount = institute.teachers.filter((teacher) => String(teacher.degree).includes('PhD')).length;
  const internationalCount = institute.teachers.filter((teacher) => !['Қазақстан', 'Казахстан', 'Kazakhstan', 'كازاخستان'].includes(teacher.country)).length;

  const stats = [
    { icon: Users, value: institute.teachers.length, label: t('teachers.specialists') },
    { icon: Award, value: phdCount, label: t('teachers.phd') },
    { icon: GraduationCap, value: internationalCount, label: t('teachers.international', { defaultValue: 'International faculty' }) },
  ];
  const getTeacherBio = (teacher) => teacher.shortInfo || teacher.role;

  return (
    <div className="overflow-hidden bg-background">
      <section className="relative overflow-hidden bg-primary-dark pb-16 pt-32 text-white sm:pt-40">
        <img src={institute.baseImages.studyGroup} alt={t('teachers.title')} className="absolute inset-0 h-full w-full object-cover opacity-50" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/72 to-primary-dark/30" />
        <div className="islamic-pattern absolute inset-0 opacity-[0.12]" />
        <div className="container-custom relative z-10 max-w-4xl">
          <p className="section-eyebrow">{institute.teacherEyebrow}</p>
          <h1 className="section-title text-white">{institute.teacherTitle}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{institute.teacherText}</p>
          <Link to="/programs" className="btn-primary mt-8">
            {t('nav.programs')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="-mt-8 pb-8">
        <div className="container-custom relative z-20 grid gap-4 md:grid-cols-3">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="premium-panel bg-white p-6">
              <Icon className="mb-4 text-accent-gold" size={30} />
              <p className="font-serif text-4xl font-extrabold text-primary-dark">{value}</p>
              <p className="mt-2 text-sm font-bold text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} className="mb-10 max-w-3xl">
            <p className="section-eyebrow">{institute.teacherEyebrow}</p>
            <h2 className="section-title">{t('nav.teachers')}</h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {institute.teachers.map((teacher, index) => (
              <motion.article
                key={teacher.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={fadeUp}
                transition={{ delay: Math.min(index * 0.04, 0.24) }}
                className="premium-card group flex min-h-[420px] flex-col items-center p-7 text-center"
              >
                <div className="h-40 w-40 overflow-hidden rounded-full bg-slate-100 ring-4 ring-accent-lightGold/80">
                  <TeacherImage teacher={teacher} />
                </div>

                <div className="mt-6 flex flex-1 flex-col items-center">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent-gold">{teacher.label}</p>
                  <h3 className="mt-3 text-xl font-bold leading-tight text-primary-dark">{teacher.name}</h3>
                  <p className="mt-3 max-w-sm text-sm font-semibold leading-7 text-slate-600">{getTeacherBio(teacher)}</p>

                  <div className="mt-auto pt-6">
                    {teacher.resume ? (
                      <a
                        href={teacher.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/15 bg-white px-4 py-2 text-sm font-extrabold text-primary transition hover:border-primary hover:bg-primary hover:text-white"
                      >
                        <FileText size={16} />
                        {resumeLabel}
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-extrabold text-slate-400"
                      >
                        <FileText size={16} />
                        {resumeLabel}
                      </button>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-primary-dark text-white">
        <div className="container-custom grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="section-eyebrow">{t('nav.admission')}</p>
            <h2 className="section-title max-w-3xl text-white">{t('teachers.cta_title', { defaultValue: institute.programTitle })}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">{t('teachers.cta_desc', { defaultValue: institute.aboutText })}</p>
          </div>
          <Link to="/admission" className="btn-primary">
            {t('nav.apply')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Teachers;
