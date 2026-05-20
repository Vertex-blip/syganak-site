import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import AIAssistant from '../components/AIAssistant';
import Seo from '../components/Seo';

const MainLayout = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetId = decodeURIComponent(location.hash.slice(1));
    window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, [location.pathname, location.hash]);

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className={`flex min-h-screen flex-col ${isArabic ? 'has-arabic-content' : ''}`}>
      <Seo />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <AIAssistant />
    </div>
  );
};

export default MainLayout;
