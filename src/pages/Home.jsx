import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Image,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getInstituteContent } from '../data/instituteContent';
import { fetchNewsList } from '../services/newsService';
import { MAP_URL, WHATSAPP_NUMBER } from '../config/site';
import { buildWhatsAppLink } from '../utils/contactLinks';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const cardViewport = { once: true, margin: '-80px' };

const featuredTeacherIds = [
  ['bagdat-manabayev', '/institute/featured-director.png'],
  ['zhaksylyk-rakhymbay', '/institute/featured-zhaksylyk.png'],
  ['azamat-baizakov', '/institute/featured-azamat.png'],
  ['temirzhan-muratov', '/institute/featured-temirzhan.png'],
];

const SectionHeader = ({ eyebrow, title, description, action, icon: Icon }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={cardViewport}
    variants={fadeUp}
    transition={{ duration: 0.5 }}
    className="mb-5 flex w-full flex-col gap-5 sm:mb-6 lg:flex-row lg:items-center lg:justify-between"
  >
    <div className="min-w-0 max-w-[21rem] sm:max-w-3xl">
      <p className="section-eyebrow">
        {Icon && <Icon size={16} />}
        {eyebrow}
      </p>
      <h2 className="section-title break-words text-balance">{title}</h2>
      {description && <p className="section-copy mt-4 max-w-[21rem] break-words sm:max-w-2xl">{description}</p>}
    </div>
    {action}
  </motion.div>
);

const Home = () => {
  const { t, i18n } = useTranslation();
  const [overrideVersion, setOverrideVersion] = useState(0);

  useEffect(() => {
    const handleLoaded = () => setOverrideVersion((v) => v + 1);
    window.addEventListener('syganaki-siteTexts-loaded', handleLoaded);
    return () => window.removeEventListener('syganaki-siteTexts-loaded', handleLoaded);
  }, []);

  const institute = useMemo(() => getInstituteContent(i18n.language), [i18n.language, overrideVersion]);
  const [latestNews, setLatestNews] = useState(institute.news.slice(0, 8));
  const newsCarouselRef = useRef(null);
  const teachersCarouselRef = useRef(null);
  const programs = institute.programs.slice(0, 2);
  const gallery = institute.gallery.slice(0, 6);

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
      if (active) setLatestNews(items.slice(0, 8));
    });
    return () => {
      active = false;
    };
  }, [i18n.language, institute.news]);

  const scrollNews = (direction) => {
    const carousel = newsCarouselRef.current;
    if (!carousel) return;
    const distance = Math.max(320, Math.floor(carousel.clientWidth * 0.82));
    carousel.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  const scrollTeachers = (direction) => {
    const carousel = teachersCarouselRef.current;
    if (!carousel) return;
    const distance = Math.max(280, Math.floor(carousel.clientWidth * 0.75));
    carousel.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  return (
    <div className="overflow-hidden bg-background">
      <section className="relative min-h-screen overflow-hidden bg-primary-dark pt-24 text-white lg:pt-28">
        <img
          src={institute.baseImages.hero}
          alt={t('brand.name')}
          className="absolute inset-0 h-full w-full scale-105 object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/92 via-primary-dark/72 to-primary-dark/24" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/10 to-primary-dark/10" />
        <div className="islamic-pattern absolute inset-y-0 left-0 w-1/2 opacity-[0.10]" />

        <div className="container-custom relative z-10 flex min-h-[calc(100vh-6rem)] flex-col justify-center pb-16 pt-10 sm:pb-20 lg:min-h-[calc(100vh-7rem)]">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.65 }} className="max-w-4xl">
            <p className="section-eyebrow text-accent-gold">{institute.heroBadge}</p>
            <h1 className="max-w-[20rem] break-words font-serif text-3xl font-extrabold leading-[1.12] text-white sm:max-w-4xl sm:text-5xl sm:leading-[1.08] lg:text-6xl">
              {institute.heroTitle}
            </h1>
            <p className="mt-6 max-w-[20rem] break-words text-base leading-8 text-white/78 sm:max-w-2xl sm:text-lg">
              {institute.heroSubtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
              className="mt-7 inline-flex max-w-xl items-center gap-2 text-sm font-semibold text-white/72 hover:text-accent-gold"
            >
              <MapPin size={17} className="shrink-0 text-accent-gold" />
              {t('topbar.address')}
            </a>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-12">
        <div className="container-custom">
          <SectionHeader
            eyebrow={t('home.programs_eyebrow')}
            title={t('home.programs_title')}
            description={t('home.programs_desc')}
            icon={BookOpen}
            action={
              <Link to="/programs" className="btn-ghost shrink-0">
                {t('home.all_programs')}
                <ArrowRight size={16} />
              </Link>
            }
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial="hidden"
                whileInView="visible"
                viewport={cardViewport}
                variants={fadeUp}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/programs/${program.id}`}
                  className="group premium-card flex h-full min-w-0 flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent-gold/45 hover:shadow-xl"
                >
                  <div className="overflow-hidden">
                    <img
                      src={program.image}
                      alt={program.title}
                      loading="lazy"
                      className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      width="680"
                      height="383"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col p-6 sm:p-7">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent-lightGold px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-primary">
                      <GraduationCap size={15} />
                      {program.duration}
                    </span>
                    <h3 className="mt-5 break-words font-serif text-2xl font-bold leading-tight text-primary-dark">{program.title}</h3>
                    <p className="mt-3 line-clamp-4 break-words text-sm leading-7 text-slate-600">{program.desc}</p>
                    {program.subjects?.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {program.subjects.slice(0, 4).map((subject) => (
                          <span key={subject} className="max-w-full break-words rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
                            {subject}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbf7ef] py-10 sm:py-12">
        <div className="container-custom">
          <div className="mb-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => scrollTeachers(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-primary shadow-sm transition-colors hover:border-accent-gold hover:bg-accent-lightGold"
              aria-label={t('common.back')}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scrollTeachers(1)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-primary shadow-sm transition-colors hover:border-accent-gold hover:bg-accent-lightGold"
              aria-label={t('common.more')}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div
            ref={teachersCarouselRef}
            className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 scroll-smooth no-scrollbar"
          >
            {featuredTeachers.map((teacher, index) => (
              <motion.article
                key={teacher.id}
                initial="hidden"
                whileInView="visible"
                viewport={cardViewport}
                variants={fadeUp}
                transition={{ delay: index * 0.04 }}
                className="group premium-card flex w-[78vw] shrink-0 snap-start flex-col items-center p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent-gold/45 hover:shadow-xl sm:w-[340px] xl:w-[calc((100%_-_3.75rem)/4)]"
              >
                <div className="h-48 w-48 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-[0_18px_45px_rgba(5,24,17,0.16)] sm:h-56 sm:w-56">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    width="224"
                    height="224"
                  />
                </div>
                <div className="mt-6 flex min-w-0 flex-1 flex-col items-center">
                  {teacher.id === 'bagdat-manabayev' ? (
                    <>
                      <h3 className="break-words text-base font-extrabold uppercase leading-snug tracking-[0.03em] text-primary-dark">
                        МАНАБАЕВ БАҒДАТ МАХАНҰЛЫ
                      </h3>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                        PhD доктор, институт басшысы
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="break-words font-serif text-xl font-bold leading-tight text-primary-dark">{teacher.name}</h3>
                      <p className="mt-2 line-clamp-3 break-words text-sm font-semibold leading-6 text-slate-600">{teacher.role}</p>
                    </>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-12">
        <div className="container-custom">
          <SectionHeader
            eyebrow={t('home.news_eyebrow')}
            title={t('news.title')}
            icon={CalendarDays}
            action={
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollNews(-1)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-primary shadow-sm transition-colors hover:border-accent-gold hover:bg-accent-lightGold"
                  aria-label={t('common.back')}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollNews(1)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-primary shadow-sm transition-colors hover:border-accent-gold hover:bg-accent-lightGold"
                  aria-label={t('common.more')}
                >
                  <ChevronRight size={20} />
                </button>
                <Link to="/news" className="btn-ghost">
                  {t('home.all_news')}
                  <ArrowRight size={16} />
                </Link>
              </div>
            }
          />

          <div
            ref={newsCarouselRef}
            className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 scroll-smooth no-scrollbar"
          >
            {latestNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial="hidden"
                whileInView="visible"
                viewport={cardViewport}
                variants={fadeUp}
                transition={{ delay: index * 0.04 }}
                className="flex w-[84vw] shrink-0 snap-start sm:w-[390px] lg:w-[31.5%]"
              >
                <Link
                  to={`/news/${item.id}`}
                  className="group premium-card flex h-full min-w-0 flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent-gold/45 hover:shadow-xl"
                >
                  <div className="overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      width="420"
                      height="236"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={14} />
                        {item.date}
                      </span>
                      <span className="rounded-full bg-accent-lightGold px-3 py-1 font-bold text-primary">{item.category}</span>
                    </div>
                    <h3 className="break-words font-serif text-xl font-bold leading-tight text-primary-dark">{item.title}</h3>
                    <p className="mt-2 line-clamp-3 flex-1 break-words text-sm leading-7 text-slate-600">{item.excerpt}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-10 sm:py-12">
        <div className="container-custom">
          <SectionHeader
            eyebrow={t('nav.gallery')}
            title={t('home.gallery_short_title')}
            description={t('home.gallery_short_desc')}
            icon={Image}
            action={
              <Link to="/gallery" className="btn-ghost shrink-0">
                {t('home.all_gallery')}
                <ArrowRight size={16} />
              </Link>
            }
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item, index) => (
              <motion.article
                key={item.id}
                initial="hidden"
                whileInView="visible"
                viewport={cardViewport}
                variants={fadeUp}
                transition={{ delay: index * 0.04 }}
                className="group relative min-h-[240px] overflow-hidden rounded-lg border border-white/70 bg-primary-dark shadow-[0_18px_50px_rgba(5,24,17,0.10)] transition-all duration-300 hover:-translate-y-1 hover:border-accent-gold/45 hover:shadow-xl"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  width="420"
                  height="300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/86 via-primary-dark/18 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="rounded-full bg-accent-gold px-3 py-1 text-xs font-extrabold text-primary-dark">{item.category}</span>
                  <h3 className="mt-3 line-clamp-2 break-words font-serif text-xl font-bold leading-tight text-white">{item.title}</h3>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-12">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary-dark via-primary to-[#0b2f24] p-6 text-white shadow-[0_28px_90px_rgba(5,24,17,0.22)] sm:p-8 lg:p-10">
            <div className="islamic-pattern absolute inset-0 opacity-[0.10]" />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
              <div className="max-w-3xl">
                <p className="section-eyebrow text-accent-gold">{t('nav.admission')}</p>
                <h2 className="font-serif text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                  {t('home.admission_cta_title')}
                </h2>
                <p className="mt-4 text-base leading-8 text-white/74 sm:text-lg">{t('home.admission_cta_desc')}</p>
                <div className="mt-6 flex flex-col gap-3 text-sm font-semibold text-white/72 sm:flex-row sm:flex-wrap sm:items-center">
                  <a href={`tel:${t('topbar.phone')}`} className="inline-flex items-center gap-2 hover:text-accent-gold">
                    <Phone className="text-accent-gold" size={17} />
                    {t('topbar.phone')}
                  </a>
                  <a href={MAP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-accent-gold">
                    <MapPin className="text-accent-gold" size={17} />
                    {t('topbar.address')}
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link to="/admission#application" className="btn-primary w-full">
                  {t('nav.apply')}
                  <ArrowRight size={18} />
                </Link>
                <a
                  href={buildWhatsAppLink(WHATSAPP_NUMBER, t('donation.whatsapp_text', { defaultValue: t('common.whatsapp') }))}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary w-full"
                >
                  <MessageCircle size={18} />
                  {t('common.whatsapp')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
