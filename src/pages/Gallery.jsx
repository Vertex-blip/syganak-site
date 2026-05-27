import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Loader2, X } from 'lucide-react';
import { fetchDataList } from '../services/dataService';
import { getInstituteContent } from '../data/instituteContent';

const Gallery = () => {
  const { t, i18n } = useTranslation();
  const institute = getInstituteContent(i18n.language);
  const fallbackItems = institute.gallery;
  const categories = institute.galleryCategories;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const loadGallery = async () => {
      setLoading(true);
      const data = await fetchDataList('gallery', fallbackItems, i18n.language);
      setItems(data);
      setLoading(false);
    };
    loadGallery();
  }, [i18n.language]);

  useEffect(() => {
    setActiveCategory(categories[0]);
  }, [i18n.language]);

  const visibleItems = items.filter((item) => activeCategory === categories[0] || item.category === activeCategory);

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-primary-dark pb-16 pt-32 text-white sm:pt-40">
        <img src="/institute/award-ceremony.jpg" alt={t('gallery.title')} className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/72 to-primary-dark/30" />
        <div className="islamic-pattern absolute inset-0 opacity-[0.12]" />
        <div className="container-custom relative z-10 max-w-4xl">
          <p className="section-eyebrow">{t('nav.gallery')}</p>
          <h1 className="section-title text-white">{t('gallery.title')}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{t('gallery.subtitle')}</p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-custom">
          <div className="mb-8 flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-lg px-4 py-3 text-sm font-bold ${
                  activeCategory === category ? 'bg-primary text-white shadow-lg' : 'border border-slate-200 bg-white text-slate-600 hover:bg-accent-lightGold'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-accent-gold" size={40} />
            </div>
          ) : (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
              {visibleItems.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative mb-4 break-inside-avoid overflow-hidden rounded-lg bg-slate-100 shadow-md ${index % 3 === 1 ? 'aspect-[4/3]' : 'aspect-[4/5]'}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setPreview(item)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') setPreview(item);
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/85 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-gold">{item.category}</p>
                    <h3 className="mt-1 font-serif text-xl font-bold text-white">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {preview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary-dark/90 p-4 backdrop-blur-xl" onClick={() => setPreview(null)}>
          <button type="button" onClick={() => setPreview(null)} className="absolute right-4 top-4 rounded-lg bg-white/10 p-3 text-white hover:bg-white/20" aria-label={t('common.close')}>
            <X size={24} />
          </button>
          <figure className="max-h-[88vh] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <img src={preview.image} alt={preview.title} className="max-h-[78vh] w-full rounded-lg object-contain shadow-2xl" />
            <figcaption className="mt-4 text-center text-white">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-gold">{preview.category}</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-white">{preview.title}</h2>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
};

export default Gallery;
