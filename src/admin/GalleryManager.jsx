import React from 'react';
import { useTranslation } from 'react-i18next';
import SimpleManager from './SimpleManager';
import { getInstituteContent } from '../data/instituteContent';
import useMarkSectionRead from '../hooks/useMarkSectionRead';

const GalleryManager = () => {
  const { t, i18n } = useTranslation();
  useMarkSectionRead('upload');
  return (
    <SimpleManager
      collectionName="gallery"
      fallbackItems={getInstituteContent(i18n.language).gallery}
      title={t('admin.gallery')}
      fields={[
        { name: 'title', label: t('admin.title_field'), required: true, placeholder: t('admin.gallery_title_ph', { defaultValue: 'Фото атауын енгізіңіз' }) },
        { name: 'category', label: t('common.category'), required: true, placeholder: t('admin.gallery_category_ph', { defaultValue: 'Мысалы: Кампус' }) },
        { name: 'description', label: t('admin.description'), type: 'textarea', placeholder: t('admin.gallery_desc_ph', { defaultValue: 'Фото туралы қысқаша сипаттама...' }) },
        { name: 'image', label: t('admin.image'), type: 'image', required: true, helper: t('admin.upload_hint') },
      ]}
    />
  );
};

export default GalleryManager;
