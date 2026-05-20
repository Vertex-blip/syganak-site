import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Instagram, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getInstituteContent } from '../data/instituteContent';
import { MAP_URL } from '../config/site';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [overrideVersion, setOverrideVersion] = useState(0);

  useEffect(() => {
    const handleLoaded = () => setOverrideVersion((v) => v + 1);
    window.addEventListener('syganaki-siteTexts-loaded', handleLoaded);
    return () => window.removeEventListener('syganaki-siteTexts-loaded', handleLoaded);
  }, []);

  const institute = useMemo(() => getInstituteContent(i18n.language), [i18n.language, overrideVersion]);
  const programs = institute.programs.slice(0, 4);

  const navLinks = [
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.admission'), path: '/admission' },
    { label: t('nav.programs'), path: '/programs' },
    { label: t('nav.news'), path: '/news' },
    { label: t('nav.contacts'), path: '/contacts' },
    { label: t('nav.support', { defaultValue: t('donation.title', { defaultValue: 'Support' }) }), path: '/donation' },
  ];

  const secondaryLinks = [
    { label: t('nav.teachers'), path: '/teachers' },
    { label: t('nav.gallery'), path: '/gallery' },
    { label: t('nav.faq'), path: '/faq' },
    { label: t('nav.partners'), path: '/partners' },
  ];

  return (
    <footer className="relative overflow-hidden bg-primary-dark text-white">
      <div className="islamic-pattern absolute inset-0 opacity-[0.08]" />
      <div className="container-custom relative z-10 py-14 sm:py-18">
        {/* Custom Dynamic Blocks Section */}
        {institute.customBlocks?.footer?.length > 0 && (
          <div className="mb-12 border-b border-white/10 pb-8">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-accent-gold">{t('common.additional_info', { defaultValue: 'Қосымша хабарландырулар' })}</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {institute.customBlocks.footer.map((block, index) => (
                <div key={block.id || index} className="rounded-lg border border-white/10 bg-white/5 p-5 hover:bg-white/8 transition-colors">
                  {block.badge && (
                    <span className="inline-block text-[9px] font-extrabold uppercase tracking-[0.1em] text-primary bg-accent-gold px-2 py-0.5 rounded mb-3">
                      {block.badge}
                    </span>
                  )}
                  <h4 className="text-base font-bold text-white leading-snug">{block.title}</h4>
                  <p className="mt-2 text-xs text-white/70 leading-relaxed whitespace-pre-wrap">{block.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.75fr_0.75fr_1fr]">
          <div>
            <Link to="/" className="mb-6 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white p-1.5">
                <img src="/logo.png" alt={t('brand.name')} className="h-full w-full object-contain" />
              </span>
              <span>
                <span className="block font-serif text-xl font-bold leading-tight">{t('brand.name')}</span>
                <span className="block text-[10px] font-extrabold uppercase tracking-[0.28em] text-accent-gold">{t('brand.type')}</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-7 text-white/68">{t('footer.description')}</p>
            <div className="mt-7 flex gap-3">
              {[
                { icon: Instagram, href: 'https://www.instagram.com/h.syganaki.kz', label: 'Instagram' },
                { icon: Send, href: 'https://t.me/+77761764131', label: 'Telegram' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/8 text-white hover:border-accent-gold hover:bg-accent-gold hover:text-primary-dark"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-extrabold uppercase tracking-[0.18em] text-accent-gold">{t('footer.navigation')}</h3>
            <div className="space-y-3">
              {navLinks.map((item) => (
                <Link key={item.path} to={item.path} className="block text-sm font-semibold text-white/68 hover:text-accent-gold">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-extrabold uppercase tracking-[0.18em] text-accent-gold">{t('footer.education')}</h3>
            <div className="space-y-3">
              {programs.map((program) => (
                <Link key={program.id} to="/programs" className="block text-sm font-semibold text-white/68 hover:text-accent-gold">
                  {program.title}
                </Link>
              ))}
              {secondaryLinks.map((item) => (
                <Link key={item.path} to={item.path} className="block text-sm font-semibold text-white/68 hover:text-accent-gold">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-extrabold uppercase tracking-[0.18em] text-accent-gold">{t('footer.contacts')}</h3>
            <div className="space-y-4 text-sm text-white/70">
              <p className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-accent-gold" />
                <a href={MAP_URL} target="_blank" rel="noreferrer" className="hover:text-accent-gold">{t('topbar.address')}</a>
              </p>
              <a href={`tel:${t('topbar.phone')}`} className="flex gap-3 hover:text-accent-gold">
                <Phone size={18} className="shrink-0 text-accent-gold" />
                <span>{t('topbar.phone')}</span>
              </a>
              <a href={`mailto:${t('topbar.email')}`} className="flex gap-3 hover:text-accent-gold">
                <Mail size={18} className="shrink-0 text-accent-gold" />
                <span>{t('topbar.email')}</span>
              </a>
              <p className="flex gap-3">
                <Clock size={18} className="shrink-0 text-accent-gold" />
                <span>{t('contacts.hours')}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs font-semibold text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('footer.copyright')}</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/contacts" className="hover:text-white">{t('footer.privacy')}</Link>
            <Link to="/faq" className="hover:text-white">{t('footer.offer')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
