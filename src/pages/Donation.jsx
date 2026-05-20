import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, CreditCard, HeartHandshake, Info, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  KASPI_DONATION_URL,
  KASPI_FALLBACK_URL,
  KASPI_SUPPORT_NUMBER,
  WHATSAPP_NUMBER,
} from '../config/site';
import { buildWhatsAppLink } from '../utils/contactLinks';

const Donation = () => {
  const { t } = useTranslation();
  const supportItems = t('donation.items', { returnObjects: true, defaultValue: [] });
  const kaspiReady = Boolean(KASPI_DONATION_URL);
  const kaspiHref = KASPI_DONATION_URL || KASPI_FALLBACK_URL;

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-primary-dark pb-16 pt-32 text-white sm:pt-40">
        <img
          src="/institute/library.jpeg"
          alt={t('donation.title')}
          className="absolute inset-0 h-full w-full object-cover opacity-28"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/50" />
        <div className="islamic-pattern absolute inset-0 opacity-[0.12]" />
        <div className="container-custom relative z-10 max-w-4xl">
          <p className="section-eyebrow">{t('nav.support', { defaultValue: t('donation.title') })}</p>
          <h1 className="section-title text-white">{t('donation.title')}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{t('donation.subtitle')}</p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-custom grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
          <div className="space-y-6">
            <div className="premium-panel bg-white p-6 sm:p-8">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-lightGold text-primary">
                <HeartHandshake size={26} />
              </div>
              <h2 className="text-3xl font-bold">{t('donation.official_title')}</h2>
              <p className="mt-4 text-base leading-8 text-slate-600">{t('donation.official_text')}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {supportItems.map((item) => (
                <div key={item} className="premium-card flex gap-3 p-5">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-accent-gold" size={20} />
                  <p className="text-sm font-semibold leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="premium-panel sticky top-28 bg-white p-6 sm:p-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
              <CreditCard size={25} />
            </div>
            <h2 className="text-2xl font-bold">{t('donation.kaspi_title')}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{t('donation.kaspi_text')}</p>

            <a
              href={kaspiHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-7 w-full"
            >
              <CreditCard size={18} />
              {t('donation.kaspi_button')}
              <ArrowRight size={18} />
            </a>

            {!kaspiReady && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-7 text-amber-800">
                <Info className="mb-2 text-amber-600" size={18} />
                {t('donation.kaspi_fallback_note', {
                  phone: KASPI_SUPPORT_NUMBER,
                  defaultValue: t('donation.kaspi_todo'),
                })}
              </div>
            )}

            <a
              href={buildWhatsAppLink(WHATSAPP_NUMBER, t('donation.whatsapp_text'))}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost mt-3 w-full"
            >
              <Phone size={18} />
              {t('common.whatsapp')}
            </a>

            <Link to="/contacts" className="mt-5 inline-flex text-sm font-bold text-primary hover:text-accent-gold">
              {t('nav.contacts')}
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Donation;
