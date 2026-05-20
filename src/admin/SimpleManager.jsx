import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Check, Edit2, Image as ImageIcon, Loader2, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { db, isFirebaseConfigured } from '../firebase/config';
import { uploadNewsImage } from '../services/newsService';
import { fetchDataList } from '../services/dataService';
import { normalizeText } from '../utils/formatDate';

const getLocal = (name) => JSON.parse(window.localStorage.getItem(`syganaki-${name}`) || '[]');
const setLocal = (name, items) => window.localStorage.setItem(`syganaki-${name}`, JSON.stringify(items));

const initialValue = (field) => (field.type === 'array' ? (field.defaultValue || []) : (field.defaultValue || ''));
const makeInitial = (fields) => fields.reduce((acc, field) => ({ ...acc, [field.name]: initialValue(field) }), {});

const SimpleManager = ({ collectionName, title, fields, previewField = 'title', imageField = 'image', fallbackItems = [] }) => {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(makeInitial(fields));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saved, setSaved] = useState(false);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchDataList(collectionName, fallbackItems, i18n.language);
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [i18n.language, collectionName]);

  const filtered = useMemo(() => {
    const q = normalizeText(search);
    return items.filter((item) => !q || normalizeText(JSON.stringify(item)).includes(q));
  }, [items, search]);

  const openCreate = () => {
    setEditingId(null);
    setFormData(makeInitial(fields));
    setUploadError('');
    setSaved(false);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setFormData(fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.type === 'array'
        ? (Array.isArray(item[field.name]) ? item[field.name] : [])
        : (item[field.name] ?? field.defaultValue ?? ''),
    }), {}));
    setUploadError('');
    setSaved(false);
    setModalOpen(true);
  };

  const handleUpload = async (event, fieldName) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadNewsImage(file, collectionName === 'gallery' ? 'gallery' : 'news');
      setFormData((current) => ({ ...current, [fieldName]: url }));
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(t('admin.upload_error'));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const addArrayItem = (fieldName, inputId) => {
    const input = document.getElementById(inputId);
    const value = input?.value?.trim();
    if (!value) return;
    setFormData((current) => ({
      ...current,
      [fieldName]: [...(Array.isArray(current[fieldName]) ? current[fieldName] : []), value],
    }));
    input.value = '';
  };

  const removeArrayItem = (fieldName, index) => {
    setFormData((current) => ({
      ...current,
      [fieldName]: (Array.isArray(current[fieldName]) ? current[fieldName] : []).filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      if (!isFirebaseConfigured) {
        const current = getLocal(collectionName);
        if (editingId) {
          setLocal(collectionName, current.map((item) => (item.id === editingId ? { ...item, ...formData, updatedAt: new Date().toISOString() } : item)));
        } else {
          const id = crypto.randomUUID?.() || String(Date.now());
          setLocal(collectionName, [{ id, ...formData, createdAt: new Date().toISOString() }, ...current]);
        }
      } else if (editingId) {
        await setDoc(doc(db, collectionName, String(editingId)), { ...formData, updatedAt: serverTimestamp() }, { merge: true });
      } else {
        await addDoc(collection(db, collectionName), { ...formData, createdAt: serverTimestamp() });
      }
      setSaved(true);
      await loadItems();
      window.setTimeout(() => {
        setModalOpen(false);
        setSaved(false);
      }, 650);
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm(t('admin.delete_confirm', { defaultValue: 'Жоюды растайсыз ба?' }))) return;
    if (!isFirebaseConfigured) {
      const current = getLocal(collectionName);
      const exists = current.find((i) => String(i.id) === String(id));
      setLocal(collectionName, exists
        ? current.map((i) => (String(i.id) === String(id) ? { ...i, deleted: true } : i))
        : [...current, { id, deleted: true }]);
    } else {
      await setDoc(doc(db, collectionName, String(id)), { deleted: true, updatedAt: serverTimestamp() }, { merge: true });
    }
    await loadItems();
  };

  const renderField = (field) => {
    const inputId = `${collectionName}-${field.name}-input`;

    if (field.type === 'textarea') {
      return (
        <textarea
          value={formData[field.name]}
          onChange={(event) => setFormData({ ...formData, [field.name]: event.target.value })}
          className="admin-input min-h-[120px] resize-y leading-7"
          placeholder={field.placeholder}
          required={field.required}
        />
      );
    }

    if (field.type === 'image') {
      return (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={formData[field.name]}
              onChange={(event) => setFormData({ ...formData, [field.name]: event.target.value })}
              className="admin-input"
              placeholder={field.placeholder || '/institute/students.jpeg'}
              required={field.required}
            />
            <label className="btn-ghost cursor-pointer">
              {uploading ? <Loader2 size={17} className="animate-spin" /> : <Upload size={17} />}
              {t('admin.upload')}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => handleUpload(event, field.name)} className="hidden" />
            </label>
          </div>
          {formData[field.name] && (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <img src={formData[field.name]} alt="" className="aspect-[16/8] w-full object-cover" />
            </div>
          )}
        </div>
      );
    }

    if (field.type === 'array') {
      const values = Array.isArray(formData[field.name]) ? formData[field.name] : [];
      return (
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              id={inputId}
              className="admin-input"
              placeholder={field.placeholder || t('admin.list_item_placeholder', { defaultValue: 'Жаңа элемент енгізіңіз' })}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addArrayItem(field.name, inputId);
                }
              }}
            />
            <button type="button" onClick={() => addArrayItem(field.name, inputId)} className="btn-ghost">
              <Plus size={16} />
              {t('admin.add_item', { defaultValue: '+ Қосу' })}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {values.map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-2 rounded-full bg-accent-lightGold px-3 py-1.5 text-xs font-bold text-primary">
                {item}
                <button type="button" onClick={() => removeArrayItem(field.name, index)} className="text-primary/60 hover:text-red-600">
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        </div>
      );
    }

    return (
      <input
        value={formData[field.name]}
        onChange={(event) => setFormData({ ...formData, [field.name]: event.target.value })}
        className="admin-input"
        placeholder={field.placeholder}
        required={field.required}
        type={field.type || 'text'}
      />
    );
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
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-64 animate-pulse rounded-lg bg-white" />)}
        </div>
      ) : filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <article key={item.id} className="premium-card overflow-hidden">
              {imageField !== 'none' && (item[imageField] ? (
                <img src={item[imageField]} alt={item[previewField]} className="aspect-[16/9] w-full object-cover" />
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-slate-100 text-slate-300"><ImageIcon size={38} /></div>
              ))}
              <div className="p-5">
                <h2 className="line-clamp-2 font-serif text-xl font-bold text-primary-dark">{item[previewField] || title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{item.description || item.desc || item.fullDesc || item.answer || item.value}</p>
                <div className="mt-5 flex gap-2">
                  <button type="button" onClick={() => openEdit(item)} className="btn-ghost flex-1">
                    <Edit2 size={16} />
                    {t('admin.edit')}
                  </button>
                  <button type="button" onClick={() => removeItem(item.id)} className="rounded-lg border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="premium-card p-10 text-center">
          <ImageIcon className="mx-auto mb-4 text-slate-300" size={40} />
          <p className="font-bold text-slate-600">{t('common.not_found')}</p>
        </div>
      )}

      {createPortal(
        <AnimatePresence>
          {modalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 p-4">
              <motion.form initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.96 }} onSubmit={handleSubmit} className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 p-5">
                  <div>
                    <h2 className="text-xl font-bold text-primary-dark">{title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{t('admin.form_helper', { defaultValue: 'Барлық өрісті толтырып, сақтаңыз.' })}</p>
                  </div>
                  <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg bg-slate-100 p-2 text-slate-600"><X size={20} /></button>
                </div>
                <div className="max-h-[calc(92vh-90px)] space-y-4 overflow-y-auto p-5">
                  {fields.map((field) => (
                    <label key={field.name} className="block">
                      <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">{field.label}</span>
                      {renderField(field)}
                      {field.helper && <p className="mt-2 text-xs font-semibold text-slate-400">{field.helper}</p>}
                      {field.type === 'image' && uploadError && <p className="mt-2 text-xs font-bold text-red-600">{uploadError}</p>}
                    </label>
                  ))}
                  {saved && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{t('common.success')}</div>}
                  <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row">
                    <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost flex-1">{t('common.close')}</button>
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
        document.body,
      )}
    </div>
  );
};

export default SimpleManager;
