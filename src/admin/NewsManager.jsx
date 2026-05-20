import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Edit2, Image as ImageIcon, Loader2, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { deleteNewsArticle, fetchNewsList, saveNewsArticle, uploadNewsImage } from '../services/newsService';
import { normalizeText } from '../utils/formatDate';
import { getInstituteContent } from '../data/instituteContent';
import useMarkSectionRead from '../hooks/useMarkSectionRead';

const initialForm = {
  title: '',
  category: '',
  image: '',
  excerpt: '',
  content: '',
};

const CUSTOM_CATEGORY = '__custom__';

const NewsManager = () => {
  const { t, i18n } = useTranslation();
  useMarkSectionRead('upload');
  const institute = getInstituteContent(i18n.language);
  const categories = [t('common.all'), ...Array.from(new Set(institute.news.map((item) => item.category)))].filter((item) => item !== t('common.all'));
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ ...initialForm, category: categories[0] });
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const loadNews = async () => {
    setLoading(true);
    const list = await fetchNewsList(institute.news, i18n.language);
    setItems(list);
    setLoading(false);
  };

  useEffect(() => {
    loadNews();
  }, [i18n.language]);

  const filtered = useMemo(() => {
    const q = normalizeText(search);
    return items.filter((item) => !q || normalizeText(item.title).includes(q) || normalizeText(item.category).includes(q));
  }, [items, search]);

  const openCreate = () => {
    setEditingId(null);
    setFormData({ ...initialForm, category: categories[0] });
    setUploadError('');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      category: item.category || categories[0],
      image: item.image || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
    });
    setUploadError('');
    setModalOpen(true);
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadNewsImage(file);
      setFormData((current) => ({ ...current, image: url }));
    } catch (error) {
      console.error('News image upload error:', error);
      setUploadError(t('admin.upload_error'));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await saveNewsArticle({
        ...formData,
        content: formData.content?.trim() ? formData.content : formData.excerpt,
      }, editingId);
      setModalOpen(false);
      await loadNews();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.delete'))) return;
    await deleteNewsArticle(id);
    await loadNews();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="admin-input pl-11" placeholder={t('admin.search')} />
        </div>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus size={18} />
          {t('admin.add')}
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-72 animate-pulse rounded-lg bg-white" />)}
        </div>
      ) : filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <article key={item.id} className="premium-card overflow-hidden">
              <div className="relative aspect-[16/9] bg-slate-100">
                {item.image ? <img src={item.image} alt={item.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-300"><ImageIcon size={38} /></div>}
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary shadow-sm">{item.category}</div>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold text-slate-500">{item.date}</p>
                <h2 className="mt-2 line-clamp-2 font-serif text-xl font-bold text-primary-dark">{item.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{item.excerpt}</p>
                <div className="mt-5 flex gap-2">
                  <button type="button" onClick={() => openEdit(item)} className="btn-ghost flex-1">
                    <Edit2 size={16} />
                    {t('admin.edit')}
                  </button>
                  <button type="button" onClick={() => handleDelete(item.id)} className="rounded-lg border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="premium-card p-10 text-center text-slate-500">{t('common.not_found')}</div>
      )}

      {createPortal(
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 p-4"
            >
              <motion.form
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              onSubmit={handleSubmit}
              className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <h2 className="text-xl font-bold">{editingId ? t('admin.edit') : t('admin.add')} {t('admin.news')}</h2>
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg bg-slate-100 p-2 text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[calc(92vh-80px)] space-y-4 overflow-y-auto p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">{t('admin.title_field')}</span>
                    <input
                      value={formData.title}
                      onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                      className="admin-input"
                      placeholder={t('admin.news_title_ph', { defaultValue: 'Жаңалық тақырыбын енгізіңіз' })}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">{t('common.category')}</span>
                    <select
                      value={categories.includes(formData.category) ? formData.category : CUSTOM_CATEGORY}
                      onChange={(event) => {
                        const value = event.target.value;
                        setFormData({ ...formData, category: value === CUSTOM_CATEGORY ? '' : value });
                      }}
                      className="admin-input"
                    >
                      {categories.map((item) => <option key={item}>{item}</option>)}
                      <option value={CUSTOM_CATEGORY}>{t('admin.custom_category')}</option>
                    </select>
                    {!categories.includes(formData.category) && (
                      <input
                        value={formData.category}
                        onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                        className="admin-input mt-3"
                        placeholder={t('admin.custom_category')}
                        required
                      />
                    )}
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">{t('admin.image')}</span>
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <input value={formData.image} onChange={(event) => setFormData({ ...formData, image: event.target.value })} className="admin-input" placeholder="/institute/students.jpeg" required />
                    <label className="btn-ghost cursor-pointer">
                      {uploading ? <Loader2 size={17} className="animate-spin" /> : <Upload size={17} />}
                      {t('admin.upload')}
                      <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                    </label>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-400">{t('admin.upload_hint')}</p>
                  {uploadError && <p className="mt-2 text-xs font-bold text-red-600">{uploadError}</p>}
                </label>

                {formData.image && (
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-inner">
                    <img src={formData.image} alt="" className="aspect-[16/8] w-full object-cover" />
                  </div>
                )}

                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">{t('admin.excerpt')}</span>
                  <textarea
                    value={formData.excerpt}
                    onChange={(event) => setFormData({ ...formData, excerpt: event.target.value })}
                    className="admin-input min-h-[90px] resize-y leading-7"
                    placeholder={t('admin.excerpt_ph', { defaultValue: 'Қысқаша мәтінді енгізіңіз...' })}
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">{t('admin.full_text', { defaultValue: 'Толық мәтін' })}</span>
                  <textarea
                    value={formData.content}
                    onChange={(event) => setFormData({ ...formData, content: event.target.value })}
                    className="admin-input min-h-[180px] resize-y leading-7"
                    placeholder={t('admin.full_text_ph', { defaultValue: 'Жаңалық мәтінін енгізіңіз...' })}
                  />
                  <p className="mt-2 text-xs font-semibold text-slate-400">
                    {t('admin.full_text_helper', { defaultValue: 'Бұл мәтін жаңалықтың толық бетінде көрсетіледі.' })}
                  </p>
                </label>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">
                    {t('admin.preview', { defaultValue: 'Алдын ала көру' })}
                  </p>
                  <article className="overflow-hidden rounded-lg bg-white shadow-sm">
                    {formData.image && <img src={formData.image} alt="" className="aspect-[16/7] w-full object-cover" />}
                    <div className="p-4">
                      <span className="rounded-full bg-accent-lightGold px-3 py-1 text-xs font-bold text-primary">{formData.category || t('common.category')}</span>
                      <h3 className="mt-3 font-serif text-2xl font-bold text-primary-dark">{formData.title || t('admin.title_field')}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600 whitespace-pre-wrap">
                        {formData.content || formData.excerpt || t('admin.full_text_ph', { defaultValue: 'Жаңалық мәтінін енгізіңіз...' })}
                      </p>
                    </div>
                  </article>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost flex-1">
                    {t('common.close')}
                  </button>
                  <button type="submit" disabled={saving || uploading} className="btn-primary flex-1">
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                    {t('admin.save')}
                  </button>
                </div>
              </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default NewsManager;
