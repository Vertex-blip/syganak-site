import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getInstituteContent } from '../data/instituteContent';

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

const partnerVisuals = {
  dumk: { mark: 'ҚМДБ', image: '/institute/official-mufti-lecture.jpg' },
  'nur-mubarak': { mark: 'NMU', image: '/institute/official-international-seminar.jpg' },
  ircica: { mark: 'IRCICA', image: '/institute/official-seminar-hall.jpg' },
  'al-azhar': { mark: 'AZHAR', image: '/institute/lecture-class.jpg' },
  haseki: { mark: 'HASEKI', image: '/institute/official-tashkent-conference.jpg' },
};

const Partners = () => {
  const { t, i18n } = useTranslation();
  const institute = getInstituteContent(i18n.language);

  return (
    <div className="overflow-hidden bg-background">
      <section className="relative overflow-hidden bg-primary-dark pb-16 pt-32 text-white sm:pt-40">
        <img src={institute.baseImages.international} alt={t('partners.title')} className="absolute inset-0 h-full w-full object-cover opacity-28" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/55" />
        <div className="islamic-pattern absolute inset-0 opacity-[0.12]" />
        <div className="container-custom relative z-10 max-w-4xl">
          <p className="section-eyebrow">{t('nav.partners')}</p>
          <h1 className="section-title text-white">{t('partners.title')}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{t('partners.subtitle')}</p>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-custom">
          <div className="mb-10 max-w-3xl">
            <p className="section-eyebrow">{institute.eventEyebrow}</p>
            <h2 className="section-title">{t('partners.academic_title', { defaultValue: institute.eventTitle })}</h2>
            <p className="section-copy mt-4">{t('partners.academic_desc', { defaultValue: institute.news[3]?.excerpt })}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {institute.partners.map((partner, index) => {
              const visual = partnerVisuals[partner.id] || partnerVisuals.ircica;
              return (
              <motion.a
                key={partner.id}
                href={partner.url}
                target="_blank"
                rel="noreferrer"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={fadeUp}
                transition={{ delay: index * 0.05 }}
                className="group flex min-h-[430px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_18px_60px_rgba(5,24,17,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-accent-gold/50 hover:shadow-[0_30px_90px_rgba(5,24,17,0.15)]"
              >
                <div className="relative h-44 overflow-hidden bg-primary-dark">
                  <img
                    src={visual.image}
                    alt={partner.name}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-primary-dark/10 to-transparent" />
                  <div className="absolute bottom-4 left-5 flex h-16 min-w-[4rem] items-center justify-center rounded-lg border border-white/30 bg-white px-4 text-center text-sm font-extrabold tracking-[0.08em] text-primary-dark shadow-xl">
                    {visual.mark}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="mb-4 w-fit rounded-full bg-accent-lightGold px-3 py-1 text-xs font-extrabold text-primary">{partner.type}</span>
                  <h3 className="font-serif text-2xl font-bold leading-tight text-primary-dark">{partner.name}</h3>
                  <p className="mt-3 flex items-center gap-2 text-sm font-bold text-accent-gold">
                    <MapPin size={15} />
                    {partner.location}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{partner.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 border-t border-slate-100 pt-5 text-sm font-extrabold text-primary group-hover:text-accent-gold">
                    {t('partners.visit_site')}
                    <ExternalLink size={16} />
                  </span>
                </div>
              </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-y bg-background">
        <div className="container-custom grid gap-6 lg:grid-cols-2">
          {institute.news.slice(3, 5).map((item) => (
            <Link key={item.id} to={`/news/${item.id}`} className="premium-card group overflow-hidden">
              <img src={item.image} alt={item.title} loading="lazy" className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="p-6">
                <p className="section-eyebrow">{item.category}</p>
                <h3 className="font-serif text-2xl font-bold text-primary-dark">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-y bg-primary-dark text-white">
        <div className="container-custom grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="section-eyebrow">{t('nav.contacts')}</p>
            <h2 className="section-title max-w-3xl text-white">{t('partners.contact_title', { defaultValue: t('partners.title') })}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">{t('partners.contact_desc', { defaultValue: t('contacts.subtitle') })}</p>
          </div>
          <Link to="/contacts" className="btn-primary">
            {t('nav.contacts')}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Partners;
