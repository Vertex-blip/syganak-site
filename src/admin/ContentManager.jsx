import React, { useEffect, useMemo, useState } from 'react';
import { collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { Check, FileText, Loader2, Save, Plus, Trash2, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { db, isFirebaseConfigured } from '../firebase/config';
import { getInstituteContent } from '../data/instituteContent';

const localKey = 'syganaki-siteTexts';

const sections = [
  {
    id: 'home',
    titleKey: 'admin.content_home',
    fields: [
      ['home.heroTitle', 'admin.content_main_title', 'textarea'],
      ['home.heroSubtitle', 'admin.content_short_desc', 'textarea'],
      ['home.heroButton', 'admin.content_button_text', 'text'],
    ],
  },
  {
    id: 'about',
    titleKey: 'admin.content_about',
    fields: [
      ['about.text', 'admin.content_about_text', 'textarea'],
      ['about.mission', 'admin.content_mission', 'textarea'],
      ['about.values', 'admin.content_values', 'textarea'],
    ],
  },
  {
    id: 'admission',
    titleKey: 'admin.content_admission',
    fields: [
      ['admission.text', 'admin.content_admission_text', 'textarea'],
      ['admission.documents', 'admin.content_documents', 'textarea'],
      ['admission.requirements', 'admin.content_requirements', 'textarea'],
    ],
  },
  {
    id: 'contacts',
    titleKey: 'admin.content_contacts',
    fields: [
      ['contacts.phone', 'admin.content_phone', 'text'],
      ['contacts.email', 'admin.content_email', 'text'],
      ['contacts.address', 'admin.content_address', 'textarea'],
      ['contacts.hours', 'admin.content_hours', 'text'],
    ],
  },
  {
    id: 'footer',
    titleKey: 'admin.content_footer',
    fields: [
      ['footer.description', 'admin.content_footer_text', 'textarea'],
      ['footer.copyright', 'admin.content_copyright', 'textarea'],
      ['footer.socials', 'admin.content_socials', 'textarea'],
    ],
  },
];

const readLocal = () => {
  try {
    return JSON.parse(window.localStorage.getItem(localKey) || '[]');
  } catch {
    return [];
  }
};

const writeLocal = (items) => window.localStorage.setItem(localKey, JSON.stringify(items));

const docId = (language, key) => `${language}_${key.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

const getDefaultText = (lang, key, i18n) => {
  const content = getInstituteContent(lang);
  switch (key) {
    case 'home.heroTitle':
      return content.heroTitle || i18n.t('hero.title', { lng: lang }) || '';
    case 'home.heroSubtitle':
      return content.heroSubtitle || i18n.t('hero.subtitle', { lng: lang }) || '';
    case 'home.heroButton':
      return i18n.t('nav.admission', { lng: lang }) || 'Поступление';
    case 'about.text':
      return i18n.t('about.history', { lng: lang }) || '';
    case 'about.mission':
      return i18n.t('about.mission', { lng: lang }) || '';
    case 'about.values':
      if (content.aboutPoints && content.aboutPoints.length > 0) {
        return content.aboutPoints.map(([t, d]) => `${t}: ${d}`).join('\n');
      }
      const vals = i18n.t('about.values', { lng: lang, returnObjects: true }) || [];
      if (Array.isArray(vals)) {
        return vals.map(item => `${item.title}: ${item.desc}`).join('\n');
      }
      return '';
    case 'admission.text':
      return i18n.t('admission.subtitle', { lng: lang }) || '';
    case 'admission.documents':
      const reqs = i18n.t('admission.requirements', { lng: lang, returnObjects: true }) || [];
      return Array.isArray(reqs) ? reqs.join('\n') : '';
    case 'admission.requirements':
      const conds = i18n.t('admission.conditions', { lng: lang, returnObjects: true }) || [];
      return Array.isArray(conds) ? conds.join('\n') : '';
    case 'contacts.phone':
      return i18n.t('topbar.phone', { lng: lang }) || '+7 776 176 41 31';
    case 'contacts.email':
      return i18n.t('topbar.email', { lng: lang }) || 'info@syganaki.kz';
    case 'contacts.address':
      return i18n.t('topbar.address', { lng: lang }) || 'Астана, проспект Кабанбай батыра 36/4';
    case 'contacts.hours':
      return i18n.t('contacts.hours', { lng: lang }) || 'Пн-Пт: 09:00 - 18:00';
    case 'footer.description':
      return i18n.t('footer.description', { lng: lang }) || '';
    case 'footer.copyright':
      return i18n.t('footer.copyright', { lng: lang }) || '';
    case 'footer.socials':
      return 'Instagram: https://instagram.com/h.syganaki.kz\nTelegram: https://t.me/+77761764131';
    default:
      return '';
  }
};

const ContentManager = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const tabParam = searchParams.get('tab');
  const initialActive = sections.some((s) => s.id === tabParam) ? tabParam : sections[0].id;
  
  const [active, setActive] = useState(initialActive);
  const [language, setLanguage] = useState(i18n.language || 'kz');
  const [values, setValues] = useState({});
  const [existingIds, setExistingIds] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Dynamic custom blocks input state
  const [newBlock, setNewBlock] = useState({ title: '', badge: '', description: '' });

  const activeSection = useMemo(() => sections.find((section) => section.id === active) || sections[0], [active]);
  
  const allKeys = useMemo(() => {
    const fieldsKeys = sections.flatMap((section) => section.fields.map(([key]) => key));
    const blocksKeys = sections.map((section) => `${section.id}.customBlocks`);
    return [...fieldsKeys, ...blocksKeys];
  }, []);

  const blocksKey = `${active}.customBlocks`;
  const blocksList = useMemo(() => {
    try {
      return JSON.parse(values[blocksKey] || '[]');
    } catch {
      return [];
    }
  }, [values, blocksKey]);

  useEffect(() => {
    setLanguage(i18n.language || 'kz');
  }, [i18n.language]);

  useEffect(() => {
    if (tabParam && sections.some((s) => s.id === tabParam)) {
      setActive(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const nextValues = {};
      const nextIds = {};
      try {
        const rows = isFirebaseConfigured
          ? (await getDocs(collection(db, 'siteTexts'))).docs.map((item) => ({ id: item.id, ...item.data() }))
          : readLocal();

        rows
          .filter((item) => item.language === language && !item.deleted)
          .forEach((item) => {
            nextValues[item.key] = item.value || '';
            nextIds[item.key] = item.id;
          });

        // Pre-populate missing or empty database values with live site defaults
        allKeys.forEach((key) => {
          if (nextValues[key] === undefined || nextValues[key] === '') {
            if (!key.endsWith('.customBlocks')) {
              nextValues[key] = getDefaultText(language, key, i18n);
            }
          }
        });
      } catch (error) {
        console.warn('siteTexts load error:', error);
      } finally {
        setValues(nextValues);
        setExistingIds(nextIds);
        setLoading(false);
      }
    };

    load();
  }, [language]);

  const updateBlocks = (nextList) => {
    setValues((prev) => ({
      ...prev,
      [blocksKey]: JSON.stringify(nextList),
    }));
  };

  const handleAddBlock = () => {
    if (!newBlock.title.trim()) return;
    const nextList = [...blocksList, { ...newBlock, id: Date.now().toString() }];
    updateBlocks(nextList);
    setNewBlock({ title: '', badge: '', description: '' });
  };

  const handleDeleteBlock = (index) => {
    const nextList = blocksList.filter((_, i) => i !== index);
    updateBlocks(nextList);
  };

  const handleMoveBlock = (index, direction) => {
    const nextList = [...blocksList];
    const targetIndex = index + direction;
    if (targetIndex >= 0 && targetIndex < nextList.length) {
      const temp = nextList[index];
      nextList[index] = nextList[targetIndex];
      nextList[targetIndex] = temp;
      updateBlocks(nextList);
    }
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      if (!isFirebaseConfigured) {
        const current = readLocal();
        const withoutCurrent = current.filter((item) => !(item.language === language && allKeys.includes(item.key)));
        const nextRows = allKeys.map((key) => ({
          id: existingIds[key] || docId(language, key),
          key,
          language,
          value: values[key] || '',
          updatedAt: new Date().toISOString(),
        }));
        writeLocal([...nextRows, ...withoutCurrent]);
      } else {
        await Promise.all(allKeys.map((key) => setDoc(
          doc(db, 'siteTexts', existingIds[key] || docId(language, key)),
          {
            key,
            language,
            value: values[key] || '',
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        )));
      }
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="premium-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary-dark">{t('admin.content')}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {t('admin.content_desc', { defaultValue: 'Сайт мәтіндерін түсінікті бөлімдер арқылы өзгертіңіз.' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <div className="premium-card p-3">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => {
                setActive(section.id);
                setSearchParams({ tab: section.id });
              }}
              className={`mb-1 flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-extrabold ${
                active === section.id ? 'bg-primary text-white shadow-lg' : 'text-slate-600 hover:bg-accent-lightGold hover:text-primary'
              }`}
            >
              {t(section.titleKey)}
              {active === section.id && <Check size={16} />}
            </button>
          ))}
        </div>

        <div className="premium-card overflow-hidden">
          <div className="border-b border-slate-100 p-5">
            <h3 className="text-xl font-bold text-primary-dark">{t(activeSection.titleKey)}</h3>
            <p className="mt-1 text-sm text-slate-500">{t('admin.content_helper', { defaultValue: 'Өрістерді толтырып, барлық өзгерісті бір рет сақтаңыз.' })}</p>
          </div>
          <div className="space-y-5 p-5">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-lg bg-slate-100" />)
            ) : (
              activeSection.fields.map(([key, labelKey, type]) => (
                <label key={key} className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">{t(labelKey)}</span>
                  {type === 'textarea' ? (
                    <textarea
                      value={values[key] || ''}
                      onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
                      className="admin-input min-h-[130px] resize-y leading-7"
                      placeholder={t('admin.content_placeholder', { defaultValue: 'Мәтінді енгізіңіз...' })}
                    />
                  ) : (
                    <input
                      value={values[key] || ''}
                      onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
                      className="admin-input"
                      placeholder={t('admin.content_placeholder', { defaultValue: 'Мәтінді енгізіңіз...' })}
                    />
                  )}
                </label>
              ))
            )}

            {/* Custom Dynamic Blocks builder section */}
            {!loading && (
              <div className="mt-8 border-t border-slate-100 pt-6 space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-primary-dark">
                    {t('admin.custom_blocks_title', { defaultValue: 'Қосымша ақпараттық блоктар (Динамикалық блоктар)' })}
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    {t('admin.custom_blocks_desc', { defaultValue: 'Бөлімнің соңында көрсетілетін жаңа блоктарды немесе тізімдерді қосыңыз.' })}
                  </p>
                </div>

                <div className="premium-card bg-slate-50/50 p-5 border border-slate-200/60 rounded-xl space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Блок тақырыбы (Title)</span>
                      <input 
                        type="text" 
                        value={newBlock.title} 
                        onChange={e => setNewBlock({ ...newBlock, title: e.target.value })} 
                        className="admin-input bg-white"
                        placeholder="Тақырыпты енгізіңіз..." 
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Белгі (Badge / Тақырып үсті)</span>
                      <input 
                        type="text" 
                        value={newBlock.badge} 
                        onChange={e => setNewBlock({ ...newBlock, badge: e.target.value })} 
                        className="admin-input bg-white"
                        placeholder="Мысалы: Жаңа, Маңызды..." 
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Толық сипаттамасы (Description)</span>
                    <textarea 
                      value={newBlock.description} 
                      onChange={e => setNewBlock({ ...newBlock, description: e.target.value })} 
                      className="admin-input bg-white min-h-[100px] resize-y leading-relaxed" 
                      placeholder="Сипаттамасын енгізіңіз..." 
                    />
                  </label>
                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      onClick={handleAddBlock}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark transition-all"
                    >
                      <Plus size={16} />
                      Блокты қосу
                    </button>
                  </div>
                </div>

                {blocksList.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">Қосылған блоктар тізімі</h5>
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm">
                      {blocksList.map((block, index) => (
                        <div key={block.id || index} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {block.badge && (
                                <span className="inline-flex items-center rounded-full bg-accent-lightGold px-2.5 py-0.5 text-xs font-semibold text-primary">
                                  {block.badge}
                                </span>
                              )}
                              <h6 className="font-bold text-primary-dark text-base">{block.title}</h6>
                            </div>
                            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{block.description}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-4">
                            <button 
                              type="button" 
                              onClick={() => handleMoveBlock(index, -1)}
                              disabled={index === 0}
                              className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30 transition-colors"
                            >
                              <ArrowUp size={16} />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleMoveBlock(index, 1)}
                              disabled={index === blocksList.length - 1}
                              className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30 transition-colors"
                            >
                              <ArrowDown size={16} />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleDeleteBlock(index)}
                              className="p-1 hover:bg-red-50 text-red-500 rounded transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visual Live Preview (Пример) */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-background shadow-md">
                  <div className="bg-primary-dark px-4 py-3 text-white flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent-gold flex items-center gap-2">
                      <Eye size={14} />
                      Сайтта қалай көрінеді (Пример)
                    </span>
                    <span className="text-[10px] font-bold text-white/50">Реалды стиль мен орналасуы</span>
                  </div>
                  <div className="p-6 bg-slate-50/40">
                    {blocksList.length > 0 ? (
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {blocksList.map((block, index) => (
                          <div key={block.id || index} className="premium-card p-6 bg-white border border-slate-100/80 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                            {block.badge && (
                              <span className="inline-block text-[10px] font-extrabold uppercase tracking-[0.12em] text-accent-gold bg-accent-lightGold px-2.5 py-1 rounded-md mb-4">
                                {block.badge}
                              </span>
                            )}
                            <h4 className="text-lg font-bold text-primary-dark font-serif leading-snug">{block.title}</h4>
                            <p className="mt-3 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{block.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-sm font-semibold text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-white">
                        Жаңа блок қосылмады. Жоғарыдағы форма арқылы жаңа блоктарды қосып, олардың сайттағы примерін көре аласыз.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className={`text-sm font-bold text-emerald-600 transition-opacity ${saved ? 'opacity-100' : 'opacity-0'}`}>
              {t('common.success')}
            </p>
            <button type="submit" disabled={saving || loading} className="btn-primary">
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {t('admin.save')}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ContentManager;
