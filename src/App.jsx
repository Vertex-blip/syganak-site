import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const HistoryMission = lazy(() => import('./pages/HistoryMission'));
const Leadership = lazy(() => import('./pages/Leadership'));
const Programs = lazy(() => import('./pages/Programs'));
const ProgramDetail = lazy(() => import('./pages/ProgramDetail'));
const Teachers = lazy(() => import('./pages/Teachers'));
const Partners = lazy(() => import('./pages/Partners'));
const Graduates = lazy(() => import('./pages/Graduates'));
const Admission = lazy(() => import('./pages/Admission'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contacts = lazy(() => import('./pages/Contacts'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const Donation = lazy(() => import('./pages/Donation'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/Dashboard'));
const AdminApplications = lazy(() => import('./admin/Applications'));
const AdminNews = lazy(() => import('./admin/NewsManager'));
const AdminInquiries = lazy(() => import('./admin/Inquiries'));
const AdminGallery = lazy(() => import('./admin/GalleryManager'));
const AdminPrograms = lazy(() => import('./admin/ProgramsManager'));
const AdminContent = lazy(() => import('./admin/ContentManager'));
const AdminAssistant = lazy(() => import('./admin/AssistantManager'));
const AdminNotifications = lazy(() => import('./admin/Notifications'));
const Login = lazy(() => import('./admin/Login'));

import { useEffect } from 'react';
import i18n from './i18n';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase/config';

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background pt-24">
    <div className="h-11 w-11 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

function App() {
  useEffect(() => {
    const loadDynamicOverrides = async () => {
      try {
        let rows = [];
        if (isFirebaseConfigured) {
          const snapshot = await getDocs(collection(db, 'siteTexts'));
          rows = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          window.localStorage.setItem('syganaki-siteTexts', JSON.stringify(rows));
        } else {
          const raw = window.localStorage.getItem('syganaki-siteTexts');
          if (raw) {
            rows = JSON.parse(raw);
          }
        }

        if (rows && rows.length > 0) {
          const languages = ['kz', 'ru', 'en', 'ar'];
          languages.forEach((lang) => {
            const langRows = rows.filter((r) => r.language === lang && !r.deleted);
            if (langRows.length > 0) {
              const overrides = {};
              langRows.forEach((r) => {
                if (r.key && !r.key.endsWith('.customBlocks')) {
                  const parts = r.key.split('.');
                  let current = overrides;
                  for (let i = 0; i < parts.length - 1; i++) {
                    const part = parts[i];
                    if (!current[part]) current[part] = {};
                    current = current[part];
                  }
                  current[parts[parts.length - 1]] = r.value || '';
                }
              });
              i18n.addResourceBundle(lang, 'translation', overrides, true, true);
            }
          });
          // Dispatch custom event to notify all listeners that translations/overrides have updated
          window.dispatchEvent(new CustomEvent('syganaki-siteTexts-loaded'));
        }
      } catch (error) {
        console.warn('Failed to load dynamic site overrides:', error);
      }
    };

    loadDynamicOverrides();
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="history-mission" element={<HistoryMission />} />
          <Route path="leadership" element={<Leadership />} />
          <Route path="programs" element={<Programs />} />
          <Route path="programs/:id" element={<ProgramDetail />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="partners" element={<Partners />} />
          <Route path="graduates" element={<Graduates />} />
          <Route path="admission" element={<Admission />} />
          <Route path="news" element={<News />} />
          <Route path="news/:id" element={<NewsDetail />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="donation" element={<Donation />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="assistant" element={<AdminAssistant />} />
          <Route path="notifications" element={<AdminNotifications />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
