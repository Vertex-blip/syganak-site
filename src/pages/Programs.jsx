import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle2, Clock, GraduationCap, Layers, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchDataList } from '../services/dataService';
import { getInstituteContent } from '../data/instituteContent';

const Programs = () => {
  const { t, i18n } = useTranslation();
  const institute = getInstituteContent(i18n.language);
  const fallbackPrograms = institute.programs;
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrograms = async () => {
      setLoading(true);
      const data = await fetchDataList('programs', fallbackPrograms, i18n.language);
      setPrograms(data);
      setLoading(false);
    };
    loadPrograms();
  }, [i18n.language]);

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-primary-dark pb-16 pt-32 text-white sm:pt-40">
        <img src="/institute/lecture-class.jpg" alt={t('programs.title')} className="absolute inset-0 h-full w-full object-cover opacity-28" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/55" />
        <div className="islamic-pattern absolute inset-0 opacity-[0.12]" />
        <div className="container-custom relative z-10 max-w-4xl">
          <p className="section-eyebrow">{t('nav.programs')}</p>
          <h1 className="section-title text-white">{t('programs.title')}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{t('programs.subtitle')}</p>
        </div>
      </section>

      <section id="format" className="section-y bg-white scroll-mt-28">
        <div className="container-custom">
          <div className="mb-10 max-w-3xl">
            <p className="section-eyebrow">
              <Layers size={16} />
              {t('nav.study_format')}
            </p>
            <h2 className="section-title">{t('programs.format_title')}</h2>
            <p className="section-copy mt-4">{t('programs.format_desc')}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {fallbackPrograms.slice(0, 2).map((program) => (
              <div key={program.id} className="premium-card p-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-accent-lightGold px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-primary">
                  <Clock size={15} />
                  {program.duration}
                </span>
                <h3 className="mt-5 font-serif text-2xl font-bold text-primary-dark">{program.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{program.format}</p>
                {program.structure?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {program.structure.map((item) => (
                      <span key={item} className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="directions" className="section-y scroll-mt-28">
        <div className="container-custom space-y-8">
          <div className="max-w-3xl">
            <p className="section-eyebrow">
              <BookOpen size={16} />
              {t('nav.program_directions')}
            </p>
            <h2 className="section-title">{t('programs.directions_title')}</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-accent-gold" size={40} />
            </div>
          ) : (
            programs.map((program, index) => (
              <motion.article
                key={program.id || index}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-90px' }}
                transition={{ delay: index * 0.04 }}
                className="premium-card overflow-hidden"
              >
                <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
                  <div className="relative min-h-[320px] overflow-hidden bg-primary-dark">
                    <img src={program.image} alt={program.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-700 hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-gold text-primary-dark shadow-xl">
                        <GraduationCap size={24} />
                      </span>
                      <h2 className="font-serif text-3xl font-bold text-white">{program.title}</h2>
                      <p className="mt-3 max-w-md text-sm leading-7 text-white/72">{program.desc}</p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 lg:p-10">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg bg-accent-lightGold/50 border border-accent-gold/10 p-5">
                        <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary">
                          <Clock size={16} className="text-accent-gold" />
                          {t('programs.duration')}
                        </div>
                        <p className="font-bold text-primary-dark text-lg">{program.duration}</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 border border-slate-100 p-5">
                        <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary">
                          <Layers size={16} className="text-accent-gold" />
                          {t('programs.format')}
                        </div>
                        <p className="font-bold text-primary-dark text-lg">{program.format}</p>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-8 md:grid-cols-2">
                      {program.subjects && Array.isArray(program.subjects) && (
                        <div>
                          <h3 className="mb-5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary/40">
                            <BookOpen size={16} />
                            {t('programs.subjects')}
                          </h3>
                          <ul className="space-y-3">
                            {program.subjects.map((subject) => (
                              <li key={subject} className="flex gap-3 text-sm font-bold text-slate-600">
                                <CheckCircle2 size={18} className="shrink-0 text-accent-gold" />
                                {subject}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {(program.opportunities || program.outcomes) && Array.isArray(program.opportunities || program.outcomes) && (
                        <div>
                          <h3 className="mb-5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary/40">
                            <CheckCircle2 size={16} />
                          {t('programs.opportunities')}
                          </h3>
                          <ul className="space-y-3">
                            {(program.opportunities || program.outcomes).map((opportunity) => (
                              <li key={opportunity} className="flex gap-3 text-sm font-bold text-slate-600">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold" />
                                {opportunity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {program.structure && Array.isArray(program.structure) && (
                      <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
                        <h3 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-primary/50">
                          {t('programs.format')}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {program.structure.map((item) => (
                            <span key={item} className="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {program.books && Array.isArray(program.books) && (
                      <div className="mt-8">
                        <h3 className="mb-4 text-xs font-extrabold uppercase tracking-widest text-primary/50">
                          {t('programs.books', { defaultValue: 'Books' })}
                        </h3>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {program.books.map((book) => (
                            <div key={book} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                              {book}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-10 border-t border-slate-100 pt-8">
                      <Link to="/admission" className="btn-primary w-full py-4 sm:w-auto">
                        {t('programs.apply')}
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Programs;
