import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchNewsList } from '../services/newsService';
import { normalizeText } from '../utils/formatDate';
import { getInstituteContent } from '../data/instituteContent';

const News = () => {
  const { t, i18n } = useTranslation();
  const institute = useMemo(() => getInstituteContent(i18n.language), [i18n.language]);
  const fallback = institute.news;
  const allCategory = t('common.all');
  const [news, setNews] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(allCategory);
  const categories = useMemo(
    () => [allCategory, ...Array.from(new Set(news.map((item) => item.category).filter(Boolean)))],
    [allCategory, news],
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchNewsList(fallback, i18n.language).then((items) => {
      if (active) {
        setNews(items);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [fallback, i18n.language]);

  useEffect(() => {
    setCategory(allCategory);
  }, [allCategory]);

  const filteredNews = useMemo(() => {
    const search = normalizeText(query);

    return news.filter((item) => {
      const matchesSearch =
        !search ||
        normalizeText(item.title).includes(search) ||
        normalizeText(item.excerpt).includes(search);
      const matchesCategory = category === allCategory || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [allCategory, category, news, query]);

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-primary-dark pb-16 pt-32 text-white sm:pt-40">
        <img src="/institute/students.jpeg" alt={t('news.title')} className="absolute inset-0 h-full w-full object-cover opacity-28" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/55" />
        <div className="islamic-pattern absolute inset-0 opacity-[0.12]" />
        <div className="container-custom relative z-10 max-w-4xl">
          <p className="section-eyebrow">{t('nav.news')}</p>
          <h1 className="section-title text-white">{t('news.title')}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{t('news.subtitle')}</p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-custom">
          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('news.search_placeholder')}
                className="input-premium pl-12"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-lg px-4 py-3 text-sm font-bold ${category === item ? 'bg-primary text-white shadow-lg' : 'border border-slate-200 bg-white text-slate-600 hover:bg-accent-lightGold'
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-[420px] animate-pulse rounded-lg bg-white" />)
              : filteredNews.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="premium-card overflow-hidden"
                >
                  <Link to={`/news/${item.id}`} className="block">
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                      <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1"><CalendarDays size={14} />{item.date}</span>
                        <span className="rounded-full bg-accent-lightGold px-3 py-1 font-bold text-primary">{item.category}</span>
                      </div>
                      <h2 className="line-clamp-2 font-serif text-2xl font-bold text-primary-dark">{item.title}</h2>
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{item.excerpt}</p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-primary">
                        {t('common.read_more')}
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
          </div>

          {!loading && filteredNews.length === 0 && (
            <div className="premium-panel bg-white p-10 text-center text-slate-500">{t('common.not_found')}</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;
