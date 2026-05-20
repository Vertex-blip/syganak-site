import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Image,
  MapPin,
  Phone,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getInstituteContent } from '../data/instituteContent';
import { fetchNewsList } from '../services/newsService';
import { MAP_URL } from '../config/site';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const featuredTeacherIds = [
  ['bagdat-manabayev', '/institute/featured-director.png'],
  ['zhaksylyk-rakhymbay', '/institute/featured-zhaksylyk.png'],
  ['azamat-baizakov', '/institute/featured-azamat.png'],
  ['temirzhan-muratov', '/institute/featured-temirzhan.png'],
];

const Home = () => {
  const { t, i18n } = useTranslation();
  const [overrideVersion, setOverrideVersion] = useState(0);

  useEffect(() => {
    const handleLoaded = () => setOverrideVersion((v) => v + 1);
    window.addEventListener('syganaki-siteTexts-loaded', handleLoaded);
    return () => window.removeEventListener('syganaki-siteTexts-loaded', handleLoaded);
  }, []);

  const institute = useMemo(() => getInstituteContent(i18n.language), [i18n.language, overrideVersion]);
  const [latestNews, setLatestNews] = useState(institute.news.slice(0, 3));
  const programs = institute.programs.slice(0, 2);
  const gallery = institute.gallery.slice(0, 4);

  const featuredTeachers = useMemo(
    () =>
      featuredTeacherIds
        .map(([id, image]) => {
          const teacher = institute.teachers.find((item) => item.id === id);
          return teacher ? { ...teacher, image } : null;
        })
        .filter(Boolean),
    [institute.teachers],
  );

  useEffect(() => {
    let active = true;
    fetchNewsList(institute.news, i18n.language).then((items) => {
      if (active) setLatestNews(items.slice(0, 3));
    });
    return () => {
      active = false;
    };
  }, [i18n.language, institute.news]);

  return (
    <div className="overflow-hidden bg-background">
      <section className="relative min-h-screen overflow-hidden bg-primary-dark pt-24 text-white lg:pt-28">
        <img
          src={institute.baseImages.hero}
          alt={t('brand.name')}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/88 to-primary-dark/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-transparent to-primary-dark/15" />
        <div className="islamic-pattern absolute inset-y-0 left-0 w-1/2 opacity-[0.10]" />

        <div className="container-custom relative z-10 flex min-h-[calc(100vh-6rem)] flex-col justify-center pb-20 pt-12 sm:pb-28 lg:min-h-[calc(100vh-7rem)] lg:pt-18">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.65 }} className="max-w-4xl">
            <p className="section-eyebrow text-accent-gold">{institute.heroBadge}</p>
            <h1 className="max-w-4xl font-serif text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              {institute.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
              {institute.heroSubtitle}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/admission" className="btn-primary">
                <GraduationCap size={18} />
                {t('nav.admission')}
              </Link>
              <Link to="/about" className="btn-secondary">
                {t('nav.about')}
                <ArrowRight size={18} />
              </Link>
            </div>

            <a
              href={MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex max-w-xl items-center gap-2 text-sm font-semibold text-white/70 hover:text-accent-gold"
            >
              <MapPin size={17} className="shrink-0 text-accent-gold" />
              {t('topbar.address')}
            </a>
          </motion.div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-custom">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-3xl">
              <p className="section-eyebrow">
                <BookOpen size={16} />
                {t('home.programs_eyebrow')}
              </p>
              <h2 className="section-title text-balance">{t('home.programs_title')}</h2>
              <p className="section-copy mt-4">{t('home.programs_desc')}</p>
            </div>
            <Link to="/programs" className="btn-ghost">
              {t('home.all_programs')}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {programs.map((program, index) => (
              <motion.article
                key={program.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={fadeUp}
                transition={{ delay: index * 0.04 }}
                className="premium-card overflow-hidden"
              >
                <img
                  src={program.image}
                  alt={program.title}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover"
                  width="680"
                  height="383"
                />
                <div className="p-6 sm:p-7">
                  <span className="inline-flex items-center gap-2 rounded-full bg-accent-lightGold px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-primary">
                    <GraduationCap size={15} />
                    {program.duration}
                  </span>
                  <h3 className="mt-5 font-serif text-2xl font-bold leading-tight text-primary-dark">{program.title}</h3>
                  <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-600">{program.desc}</p>
                  {program.subjects?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {program.subjects.slice(0, 4).map((subject) => (
                        <span key={subject} className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
                          {subject}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-custom">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-3xl">
              <p className="section-eyebrow">
                <Users size={16} />
                {t('home.featured_teachers_eyebrow')}
              </p>
              <h2 className="section-title text-balance">{t('home.featured_teachers_title')}</h2>
              <p className="section-copy mt-4">{t('home.featured_teachers_desc')}</p>
            </div>
            <Link to="/teachers" className="btn-ghost">
              {t('home.all_teachers')}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featuredTeachers.map((teacher, index) => (
              <motion.article
                key={teacher.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={fadeUp}
                transition={{ delay: index * 0.04 }}
                className="premium-card overflow-hidden"
              >
                <div className="aspect-[4/4.35] overflow-hidden bg-slate-100">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                    width="360"
                    height="392"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-gold">{teacher.category}</p>
                  <h3 className="mt-2 font-serif text-xl font-bold leading-tight text-primary-dark">{teacher.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-600">{teacher.role}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="section-eyebrow">{t('home.news_eyebrow')}</p>
              <h2 className="section-title text-balance">{t('news.title')}</h2>
            </div>
            <Link to="/news" className="btn-ghost">
              {t('home.all_news')}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {latestNews.map((item) => (
              <Link key={item.id} to={`/news/${item.id}`} className="premium-card overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover"
                  width="420"
                  height="236"
                />
                <div className="p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={14} />
                      {item.date}
                    </span>
                    <span className="rounded-full bg-accent-lightGold px-3 py-1 font-bold text-primary">{item.category}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold leading-tight text-primary-dark">{item.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-600">{item.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-custom grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="relative overflow-hidden rounded-lg bg-primary-dark p-6 text-white shadow-[0_24px_80px_rgba(5,24,17,0.16)] sm:p-8">
            <div className="islamic-pattern absolute inset-0 opacity-[0.12]" />
            <div className="relative z-10 max-w-3xl">
              <p className="section-eyebrow text-accent-gold">{t('nav.admission')}</p>
              <h2 className="section-title text-white">{t('home.admission_cta_title')}</h2>
              <p className="mt-4 text-base leading-8 text-white/72">{t('home.admission_cta_desc')}</p>
              <Link to="/admission" className="btn-primary mt-7">
                {t('nav.apply')}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="premium-panel bg-white p-6 sm:p-8">
            <p className="section-eyebrow">{t('home.contact_eyebrow')}</p>
            <h2 className="text-3xl font-bold">{t('home.contact_title')}</h2>
            <div className="mt-6 space-y-4 text-sm font-semibold text-slate-700">
              <a href={`tel:${t('topbar.phone')}`} className="flex items-center gap-3 hover:text-accent-gold">
                <Phone className="text-accent-gold" size={19} />
                {t('topbar.phone')}
              </a>
              <a href={MAP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-accent-gold">
                <MapPin className="text-accent-gold" size={19} />
                {t('topbar.address')}
              </a>
            </div>
            <Link to="/contacts" className="btn-ghost mt-7">
              {t('nav.contacts')}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Dynamic Blocks Section */}
      {institute.customBlocks?.home?.length > 0 && (
        <section className="section-y bg-white border-t border-slate-100">
          <div className="container-custom">
            <div className="mb-10 max-w-3xl">
              <p className="section-eyebrow">{t('common.additional_info', { defaultValue: 'Қосымша ақпарат' })}</p>
              <h2 className="section-title text-balance">
                {t('home.custom_blocks_title', { defaultValue: 'Институттың маңызды жаңалықтары мен ерекшеліктері' })}
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {institute.customBlocks.home.map((block, index) => (
                <motion.div
                  key={block.id || index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={fadeUp}
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

      <section className="section-y bg-background">
        <div className="container-custom">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-3xl">
              <p className="section-eyebrow">
                <Image size={16} />
                {t('nav.gallery')}
              </p>
              <h2 className="section-title text-balance">{t('home.gallery_short_title')}</h2>
              <p className="section-copy mt-4">{t('home.gallery_short_desc')}</p>
            </div>
            <Link to="/gallery" className="btn-ghost">
              {t('home.all_gallery')}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((item, index) => (
              <motion.article
                key={item.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={fadeUp}
                transition={{ delay: index * 0.04 }}
                className="premium-card overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                  width="360"
                  height="270"
                />
                <div className="p-4">
                  <span className="rounded-full bg-accent-lightGold px-3 py-1 text-xs font-bold text-primary">{item.category}</span>
                  <h3 className="mt-3 line-clamp-2 text-base font-bold text-primary-dark">{item.title}</h3>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
