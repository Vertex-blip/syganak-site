import React from 'react';
import { useTranslation } from 'react-i18next';
import SimpleManager from './SimpleManager';
import { getInstituteContent } from '../data/instituteContent';

const ProgramsManager = () => {
  const { t, i18n } = useTranslation();
  return (
    <SimpleManager
      collectionName="programs"
      fallbackItems={getInstituteContent(i18n.language).programs}
      title={t('admin.programs')}
      fields={[
        { name: 'title', label: t('admin.program_title', { defaultValue: 'Бағдарлама атауы' }), required: true, placeholder: t('admin.program_title_ph', { defaultValue: 'Мысалы: Исламтану' }) },
        { name: 'desc', label: t('admin.short_description', { defaultValue: 'Қысқаша сипаттама' }), type: 'textarea', required: true, placeholder: t('admin.short_description_ph', { defaultValue: 'Бағдарламаның қысқаша сипаттамасын енгізіңіз...' }) },
        { name: 'fullDesc', label: t('admin.full_description', { defaultValue: 'Толық сипаттама' }), type: 'textarea', placeholder: t('admin.full_description_ph', { defaultValue: 'Толық ақпаратты енгізіңіз...' }) },
        { name: 'duration', label: t('programs.duration'), required: true, placeholder: '4 жыл' },
        { name: 'format', label: t('programs.format'), required: true, placeholder: t('admin.program_format_ph', { defaultValue: 'Күндізгі бөлім' }) },
        { name: 'image', label: t('admin.image'), type: 'image', helper: t('admin.upload_hint') },
        { name: 'subjects', label: t('programs.subjects'), type: 'array', placeholder: t('admin.subject_add_ph', { defaultValue: 'Пән атауын енгізіңіз' }) },
        { name: 'opportunities', label: t('programs.opportunities'), type: 'array', placeholder: t('admin.opportunity_add_ph', { defaultValue: 'Мүмкіндікті енгізіңіз' }) },
        { name: 'order', label: t('admin.display_order', { defaultValue: 'Көрсету реті' }), type: 'number', placeholder: '1' },
      ]}
    />
  );
};

export default ProgramsManager;
