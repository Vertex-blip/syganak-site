import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getInstituteContent } from '../data/instituteContent';

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

const partnerLogos = {
  dumk: {
    src: '/institute/partners/dumk-logo.svg',
    className: 'h-24 w-24',
  },
  'nur-mubarak': {
    src: '/institute/partners/nur-mubarak-logo.webp',
    className: 'h-28 w-28',
  },
  ircica: {
    src: '/institute/partners/ircica-logo.png',
    className: 'h-24 w-40',
  },
  'al-azhar': {
    src: '/institute/partners/al-azhar-logo.png',
    className: 'h-28 w-28',
  },
  haseki: {
    src: '/institute/partners/haseki-diyanet-logo.png',
    className: 'h-24 w-24',
  },
};

const Partners = () => {
  const { t, i18n } = useTranslation();
  const institute = getInstituteContent(i18n.language);

  return (
    <div className="overflow-hidden bg-background">
      <section className="relative overflow-hidden bg-primary-dark pb-16 pt-32 text-white sm:pt-40">
        <img src="/institute/official-tashkent-conference.jpg" alt={t('partners.title')} className="absolute inset-0 h-full w-full object-cover opacity-50" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/72 to-primary-dark/30" />
        <div className="islamic-pattern absolute inset-0 opacity-[0.12]" />
        <div className="container-custom relative z-10 max-w-4xl">
          <p className="section-eyebrow">{t('nav.partners')}</p>
          <h1 className="section-title text-white">{t('partners.title')}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{t('partners.subtitle')}</p>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="section-eyebrow justify-center">{institute.eventEyebrow}</p>
            <h2 className="section-title">{t('partners.academic_title', { defaultValue: institute.eventTitle })}</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {institute.partners.map((partner, index) => {
              const logo = partnerLogos[partner.id] || partnerLogos.ircica;
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
                  className="group flex min-h-[300px] flex-col items-center rounded-lg border border-slate-200 bg-white p-6 text-center shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-accent-gold/60 hover:shadow-[0_22px_60px_rgba(5,24,17,0.13)]"
                >
                  <div className="flex h-32 w-full items-center justify-center">
                    <img
                      src={logo.src}
                      alt={`${partner.name} logo`}
                      loading="lazy"
                      className={`${logo.className} object-contain transition-transform duration-300 group-hover:scale-105`}
                    />
                  </div>
                  <div className="mt-5 flex flex-1 flex-col items-center">
                    <h3 className="text-xl font-extrabold leading-tight text-primary-dark">{partner.name}</h3>
                    <p className="mt-4 text-sm font-semibold text-slate-500">{partner.location}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-extrabold text-primary group-hover:text-accent-gold">
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
