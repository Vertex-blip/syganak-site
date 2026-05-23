import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock, GraduationCap, Layers, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchDataList } from '../services/dataService';
import { getInstituteContent } from '../data/instituteContent';

const ProgramDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const institute = useMemo(() => getInstituteContent(i18n.language), [i18n.language]);
  const fallbackPrograms = institute.programs;
  const [programs, setPrograms] = useState(fallbackPrograms);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadPrograms = async () => {
      setLoading(true);
      const data = await fetchDataList('programs', fallbackPrograms, i18n.language);
      if (active) {
        setPrograms(data);
        setLoading(false);
      }
    };

    loadPrograms();

    return () => {
      active = false;
    };
  }, [fallbackPrograms, i18n.language]);

  const program = programs.find((item) => String(item.id) === String(id));
  const opportunities = program?.opportunities || program?.outcomes || [];

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background pt-28">
        <Loader2 className="animate-spin text-accent-gold" size={42} />
      </div>
    );
  }

  if (!program) {
    return (
      <section className="section-y bg-background pt-32">
        <div className="container-custom max-w-3xl">
          <Link to="/programs" className="btn-ghost mb-8 w-fit">
            <ArrowLeft size={17} />
            {t('nav.programs')}
          </Link>
          <div className="premium-card p-8">
            <h1 className="font-serif text-3xl font-bold text-primary-dark">{t('common.not_found', { defaultValue: 'Not found' })}</h1>
            <p className="mt-3 text-slate-600">{t('programs.subtitle')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-primary-dark pb-16 pt-32 text-white sm:pt-40">
        <img src={program.image} alt={program.title} className="absolute inset-0 h-full w-full object-cover opacity-32" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/55" />
        <div className="islamic-pattern absolute inset-0 opacity-[0.12]" />
        <div className="container-custom relative z-10">
          <Link to="/programs" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/70 transition-colors hover:text-accent-gold">
            <ArrowLeft size={17} />
            {t('nav.programs')}
          </Link>
          <div className="max-w-4xl">
            <p className="section-eyebrow text-accent-gold">
              <GraduationCap size={16} />
              {program.duration}
            </p>
            <h1 className="font-serif text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">{program.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/76">{program.desc}</p>
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-custom">
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="space-y-4">
              <div className="premium-card p-6">
                <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary">
                  <Clock size={16} className="text-accent-gold" />
                  {t('programs.duration')}
                </div>
                <p className="font-serif text-2xl font-bold text-primary-dark">{program.duration}</p>
              </div>

              <div className="premium-card p-6">
                <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary">
                  <Layers size={16} className="text-accent-gold" />
                  {t('programs.format')}
                </div>
                <p className="text-base font-bold leading-7 text-primary-dark">{program.format}</p>
              </div>

              <Link to="/admission" className="btn-primary w-full justify-center py-4">
                {t('programs.apply')}
                <ArrowRight size={18} />
              </Link>
            </aside>

            <div className="space-y-6">
              {program.subjects?.length > 0 && (
                <div className="premium-card p-6 sm:p-8">
                  <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl font-bold text-primary-dark">
                    <BookOpen size={22} className="text-accent-gold" />
                    {t('programs.subjects')}
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {program.subjects.map((subject) => (
                      <div key={subject} className="flex gap-3 rounded-lg bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-700">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent-gold" />
                        {subject}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {opportunities.length > 0 && (
                <div className="premium-card p-6 sm:p-8">
                  <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl font-bold text-primary-dark">
                    <CheckCircle2 size={22} className="text-accent-gold" />
                    {t('programs.opportunities')}
                  </h2>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {opportunities.map((item) => (
                      <li key={item} className="flex gap-3 text-sm font-semibold leading-7 text-slate-700">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {program.structure?.length > 0 && (
                <div className="premium-card p-6 sm:p-8">
                  <h2 className="mb-5 font-serif text-2xl font-bold text-primary-dark">{t('programs.format')}</h2>
                  <div className="flex flex-wrap gap-2">
                    {program.structure.map((item) => (
                      <span key={item} className="rounded-full bg-accent-lightGold px-4 py-2 text-sm font-bold text-primary">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {program.books?.length > 0 && (
                <div className="premium-card p-6 sm:p-8">
                  <h2 className="mb-5 font-serif text-2xl font-bold text-primary-dark">{t('programs.books', { defaultValue: 'Books' })}</h2>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {program.books.map((book) => (
                      <div key={book} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                        {book}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramDetail;
