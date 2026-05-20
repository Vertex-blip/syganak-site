import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getInstituteContent } from '../data/instituteContent';
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

const Seo = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const institute = getInstituteContent(i18n.language);

  useEffect(() => {
    const path = location.pathname;
    const route = path.split('/')[1] || 'home';
    const routeTitles = {
      home: t('brand.name'),
      about: t('nav.about'),
      'history-mission': t('nav.history_mission'),
      leadership: t('nav.leadership'),
      programs: t('nav.programs'),
      teachers: t('nav.teachers'),
      partners: t('nav.partners'),
      graduates: t('nav.graduates'),
      admission: t('nav.admission'),
      news: t('nav.news'),
      gallery: t('nav.gallery'),
      faq: t('nav.faq'),
      contacts: t('nav.contacts'),
      donation: t('donation.title', { defaultValue: t('nav.support', { defaultValue: t('brand.name') }) }),
    };

    const routeDescriptions = {
      home: institute.heroSubtitle,
      about: institute.aboutText,
      'history-mission': t('historyMission.subtitle', { defaultValue: institute.mission }),
      leadership: t('leadership.subtitle', { defaultValue: institute.teacherText }),
      programs: t('programs.subtitle'),
      teachers: institute.teacherText,
      partners: t('partners.subtitle'),
      graduates: institute.graduatesText,
      admission: t('admission.subtitle'),
      news: t('news.subtitle'),
      gallery: t('gallery.subtitle'),
      faq: t('faq.subtitle'),
      contacts: t('contacts.subtitle'),
      donation: t('donation.subtitle', { defaultValue: institute.heroSubtitle }),
    };

    const routeImages = {
      home: institute.baseImages.hero,
      about: institute.baseImages.about,
      'history-mission': institute.baseImages.seminar,
      leadership: institute.baseImages.campusSign,
      programs: institute.baseImages.lecture,
      teachers: institute.baseImages.studyGroup,
      partners: institute.baseImages.international,
      graduates: institute.baseImages.graduates,
      admission: institute.baseImages.students,
      news: institute.baseImages.seminar,
      gallery: institute.baseImages.campus,
      contacts: institute.baseImages.hero,
      donation: institute.baseImages.library || institute.baseImages.hero,
    };

    const canonicalBase = SITE_URL || window.location.origin;
    const title = routeTitles[route] ? `${routeTitles[route]} | ${t('brand.type')}` : `${t('brand.name')} | ${t('brand.type')}`;
    const description = routeDescriptions[route] || institute.heroSubtitle;
    const canonical = `${canonicalBase}${path === '/' ? '' : path}`;
    const image = `${canonicalBase}${routeImages[route] || institute.baseImages.hero}`;

    document.title = title;
    document.documentElement.lang = i18n.language === 'kz' ? 'kk' : i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[name="robots"]', 'content', path.startsWith('/admin') ? 'noindex, nofollow' : 'index, follow');
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[property="og:image"]', 'content', image);
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', image);
    setCanonical(canonical);
  }, [i18n.language, institute, location.pathname, t]);

  return null;
};

export default Seo;
