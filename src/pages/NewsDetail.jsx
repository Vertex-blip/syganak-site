import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarDays, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchNewsArticle } from '../services/newsService';
import { getInstituteContent } from '../data/instituteContent';
import { sanitizeHtml } from '../utils/security';
import { SITE_URL } from '../config/site';

const setMeta = (selector, attr, value) => {
  if (!value) return;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    const match = selector.match(/\[(name|property)="([^"]+)"\]/);
    if (match) element.setAttribute(match[1], match[2]);
    document.head.appendChild(element);
  }
  element.setAttribute(attr, value);
};

const setCanonical = (href) => {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const NewsDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const institute = getInstituteContent(i18n.language);
  const fallback = useMemo(() => institute.news, [i18n.language]);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    window.scrollTo({ top: 0, behavior: 'auto' });
    setLoading(true);
    fetchNewsArticle(id, fallback, i18n.language).then((item) => {
      if (active) {
        setArticle(item);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [fallback, id, i18n.language]);

  useEffect(() => {
    if (!article) return;
    const canonicalBase = SITE_URL || window.location.origin;
    const title = `${article.title} | ${t('nav.news')}`;
    const description = article.excerpt || t('news.subtitle');
    const canonical = `${canonicalBase}/news/${article.id}`;
    const image = article.image?.startsWith('http') ? article.image : `${canonicalBase}${article.image || institute.baseImages.seminar}`;

    document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:type"]', 'content', 'article');
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[property="og:image"]', 'content', image);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', image);
    setCanonical(canonical);
  }, [article, institute.baseImages.seminar, t]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background pt-24">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container-custom flex min-h-screen flex-col items-center justify-center bg-background text-center">
        <h1 className="text-3xl font-bold">{t('common.not_found')}</h1>
        <Link to="/news" className="btn-primary mt-6">
          <ArrowLeft size={18} />
          {t('common.back_to_news')}
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-background">
      <section className="relative overflow-hidden bg-primary-dark pb-16 pt-32 text-white sm:pt-40">
        <img src={article.image} alt={article.title} className="absolute inset-0 h-full w-full object-cover opacity-28" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/50" />
        <div className="islamic-pattern absolute inset-0 opacity-[0.12]" />
        <div className="container-custom relative z-10 max-w-5xl">
          <Link to="/news" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/65 hover:text-accent-gold">
            <ArrowLeft size={17} />
            {t('common.back_to_news')}
          </Link>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent-gold px-3 py-1 text-xs font-extrabold text-primary-dark">{article.category}</span>
            <span className="inline-flex items-center gap-2 text-sm text-white/65">
              <CalendarDays size={16} />
              {article.date}
            </span>
          </div>
          <h1 className="max-w-4xl font-serif text-4xl font-extrabold leading-tight text-white sm:text-5xl">{article.title}</h1>
        </div>
      </section>

      <section className="section-y">
        <div className="container-custom grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="order-2 lg:order-1">
            <div className="premium-card sticky top-28 p-5">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">{t('common.category')}</p>
              <p className="font-bold text-primary">{article.category}</p>
              <button
                type="button"
                onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}
                className="btn-ghost mt-5 w-full"
              >
                <Share2 size={16} />
                {t('common.share', { defaultValue: 'Share' })}
              </button>
            </div>
          </aside>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="order-1 lg:order-2">
            <img src={article.image} alt={article.title} className="mb-8 aspect-[16/8] w-full rounded-lg object-cover shadow-2xl" />
            <div className="premium-panel bg-white p-6 sm:p-10">
              <div
                className="prose prose-slate max-w-none prose-p:leading-8 prose-p:text-slate-700 prose-a:text-primary prose-strong:text-primary-dark"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content || `<p>${article.excerpt}</p>`) }}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </article>
  );
};

export default NewsDetail;
