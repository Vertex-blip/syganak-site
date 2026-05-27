import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getInstituteContent } from '../data/instituteContent';

const leadershipIds = [
  ['bagdat-manabayev', 'director'],
  ['zhaksylyk-rakhymbay', 'deputy'],
  ['azamat-baizakov', 'academicHead'],
  ['temirzhan-muratov', 'quranHead'],
];

const Leadership = () => {
  const { t, i18n } = useTranslation();
  const institute = getInstituteContent(i18n.language);
  const positions = t('leadership.positions', { returnObjects: true, defaultValue: {} });
  const leaders = leadershipIds
    .map(([id, positionKey]) => {
      const teacher = institute.teachers.find((item) => item.id === id);
      return teacher ? { ...teacher, position: positions[positionKey] || teacher.role } : null;
    })
    .filter(Boolean);
  const director = leaders[0];
  const management = leaders.slice(1);
  const getLeaderBio = (leader) =>
    leader.bio ||
    t('teachers.bio_fallback', {
      role: leader.role,
      degree: leader.degree,
      country: leader.country,
    });

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-primary-dark pb-16 pt-32 text-white sm:pt-40">
        <img src="/institute/official-opening-audience.jpg" alt={t('leadership.title')} className="absolute inset-0 h-full w-full object-cover opacity-50" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/72 to-primary-dark/30" />
        <div className="islamic-pattern absolute inset-0 opacity-[0.12]" />
        <div className="container-custom relative z-10 max-w-4xl">
          <p className="section-eyebrow">{t('nav.institute')}</p>
          <h1 className="section-title text-white">{t('leadership.title')}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{t('leadership.subtitle')}</p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-custom">
          <div className="mb-10 max-w-3xl">
            <p className="section-eyebrow">{t('leadership.eyebrow')}</p>
            <h2 className="section-title">{t('leadership.list_title')}</h2>
          </div>

          {director && (
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              className="mb-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_24px_80px_rgba(5,24,17,0.10)]"
            >
              <div className="grid lg:grid-cols-[430px_1fr]">
                <div className="relative min-h-[430px] overflow-hidden bg-slate-100">
                  <img src={director.image} alt={director.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-accent-lightGold text-primary">
                    <UserCheck size={28} />
                  </div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-gold">{director.position}</p>
                  <h3 className="mt-3 font-serif text-3xl font-bold leading-tight text-primary-dark sm:text-4xl">{director.name}</h3>
                  <p className="mt-4 text-base font-semibold leading-7 text-slate-700">{director.role}</p>
                  <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-600">{getLeaderBio(director)}</p>
                  {director.education?.length > 0 && (
                    <div className="mt-7 rounded-lg bg-slate-50 p-5">
                      <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                        <BookOpen size={15} />
                        {t('teachers.education')}
                      </p>
                      <ul className="space-y-2 text-sm leading-6 text-slate-700">
                        {director.education.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          )}

          <div className="grid gap-5 md:grid-cols-3">
            {management.map((leader, index) => (
              <motion.article
                key={leader.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.05 }}
                className="premium-card overflow-hidden"
              >
                <div className="flex h-full flex-col">
                  <div className="aspect-[4/4.2] overflow-hidden bg-slate-100">
                    <img src={leader.image} alt={leader.name} loading="lazy" className="h-full w-full object-cover object-top" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-lightGold text-primary">
                      <UserCheck size={24} />
                    </div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-gold">{leader.position}</p>
                    <h3 className="mt-2 font-serif text-2xl font-bold leading-tight text-primary-dark">{leader.name}</h3>
                    <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{leader.role}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{getLeaderBio(leader)}</p>
                    {leader.education?.length > 0 && (
                      <div className="mt-5 border-t border-slate-100 pt-4">
                        <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                          <BookOpen size={14} />
                          {t('teachers.education')}
                        </p>
                        <p className="line-clamp-2 text-sm leading-6 text-slate-600">{leader.education.join('; ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-10">
            <Link to="/teachers" className="btn-ghost">
              {t('nav.teachers')}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Leadership;
