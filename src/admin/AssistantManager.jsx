import React from 'react';
import { useTranslation } from 'react-i18next';
import SimpleManager from './SimpleManager';

const AssistantManager = () => {
  const { t } = useTranslation();
  return (
    <SimpleManager
      collectionName="assistantFaq"
      title={t('admin.assistant')}
      imageField="none"
      fields={[
        { name: 'question', label: t('admin.question'), required: true, placeholder: t('admin.question_ph', { defaultValue: 'Сұрақты енгізіңіз' }) },
        { name: 'answer', label: t('admin.answer'), type: 'textarea', required: true, placeholder: t('admin.answer_ph', { defaultValue: 'Жауап мәтінін енгізіңіз...' }) },
        { name: 'language', label: t('admin.language'), required: true, defaultValue: 'kz', helper: t('admin.language_helper', { defaultValue: 'kz, ru, en немесе ar' }) },
      ]}
      previewField="question"
    />
  );
};

export default AssistantManager;
