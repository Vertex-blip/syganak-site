import { getInstituteContent } from '../data/instituteContent';
import {
  buildAssistantContext,
  getScopeDecline,
  isInstituteQuestion,
  normalizeAssistantText,
  tokenizeAssistantText,
} from '../data/assistantScope';

const endpoint = import.meta.env.VITE_AI_ASSISTANT_ENDPOINT || '';

const scopeAnswer = (t) =>
  t('assistant.out_of_scope', {
    defaultValue: getScopeDecline(),
  });

const scoreEntry = (entry, questionTokens, questionText) => {
  const haystack = normalizeAssistantText([entry.title, entry.answer, ...(entry.tags || [])].join(' '));
  let score = 0;

  questionTokens.forEach((token) => {
    if (haystack.includes(token)) score += token.length > 4 ? 3 : 1;
  });

  const title = normalizeAssistantText(entry.title);
  if (title && questionText.includes(title)) score += 8;
  return score;
};

const buildKb = (t, language) => {
  const institute = getInstituteContent(language);
  const steps = t('admission.steps', { returnObjects: true, defaultValue: [] });
  const requirements = t('admission.requirements', { returnObjects: true, defaultValue: [] });

  return [
    {
      id: 'about',
      title: institute.aboutEyebrow,
      answer: `${institute.aboutText} ${institute.missionTitle}: ${institute.mission}`,
      tags: [institute.heroTitle, institute.heroSubtitle, institute.legalText, ...institute.aboutPoints.flat()],
    },
    {
      id: 'admission',
      title: t('admission.title'),
      answer: `${t('admission.subtitle')} ${steps.map((step, index) => `${index + 1}. ${step.title}: ${step.desc}`).join(' ')}`,
      tags: [t('nav.admission'), t('nav.apply'), t('admission.form_title'), t('admission.whatsapp_text'), ...requirements],
    },
    {
      id: 'requirements',
      title: t('admission.docs_title'),
      answer: `${t('admission.docs_title')}: ${requirements.join('; ')}`,
      tags: ['document', 'docs', 'құжат', 'документ', 'requirements', ...requirements],
    },
    {
      id: 'contacts',
      title: t('nav.contacts'),
      answer: `${t('topbar.address')}. ${t('contacts.phone_title')}: ${t('topbar.phone')}. ${t('contacts.email_title')}: ${t('topbar.email')}.`,
      tags: [t('topbar.address'), t('topbar.phone'), t('topbar.email'), 'address', 'phone', 'телефон', 'мекенжай', 'адрес'],
    },
    {
      id: 'programs',
      title: t('programs.title'),
      answer: `${t('programs.title')}: ${institute.programs.map((program) => `${program.title} (${program.duration})`).join('; ')}.`,
      tags: ['program', 'programs', 'бағдарлама', 'программа', ...institute.programs.map((program) => program.title)],
    },
    {
      id: 'teachers',
      title: institute.teacherEyebrow,
      answer: `${institute.teacherText} ${institute.teachers.map((teacher) => `${teacher.name} - ${teacher.role}`).join('; ')}`,
      tags: institute.teachers.flatMap((teacher) => [teacher.name, teacher.role, teacher.category, teacher.country, ...(teacher.education || [])]),
    },
    {
      id: 'partners',
      title: t('nav.partners'),
      answer: institute.partners.map((partner) => `${partner.name}: ${partner.description}`).join(' '),
      tags: institute.partners.flatMap((partner) => [partner.name, partner.type, partner.location, partner.description]),
    },
    {
      id: 'graduates',
      title: institute.graduatesEyebrow,
      answer: institute.graduatesText,
      tags: ['graduate', 'employment', 'түлек', 'выпускник', 'жұмыс', 'работа'],
    },
    ...institute.programs.map((program) => ({
      id: `program-${program.id}`,
      title: program.title,
      answer: `${program.title}: ${program.duration}. ${program.format}. ${program.desc} ${t('programs.subjects')}: ${program.subjects.join(', ')}. ${t('programs.opportunities')}: ${(program.outcomes || []).join(', ')}.`,
      tags: [program.title, program.duration, program.format, ...(program.subjects || []), ...(program.outcomes || []), ...(program.books || [])],
    })),
    ...institute.news.map((item) => ({
      id: `news-${item.id}`,
      title: item.title,
      answer: `${item.title}: ${item.excerpt}`,
      tags: [item.category, item.date, item.title, item.excerpt],
    })),
  ];
};

const getFirestoreFaq = async ({ message, language }) => {
  try {
    const [{ collection, getDocs, query, where }, { db, isFirebaseConfigured }] = await Promise.all([
      import('firebase/firestore'),
      import('../firebase/config'),
    ]);

    if (!isFirebaseConfigured) return null;
    const q = query(collection(db, 'assistantFaq'), where('language', '==', language));
    const snap = await getDocs(q);
    const faqs = snap.docs.map((doc) => doc.data());
    const text = normalizeAssistantText(message);
    const questionTokens = tokenizeAssistantText(message);

    const best = faqs
      .map((faq) => ({
        answer: faq.answer,
        score: scoreEntry({ title: faq.question, answer: faq.answer, tags: [faq.question, faq.answer] }, questionTokens, text),
      }))
      .sort((a, b) => b.score - a.score)[0];

    return best?.score > 3 ? best.answer : null;
  } catch {
    return null;
  }
};

export const askAssistant = async ({ message, language, t }) => {
  if (!isInstituteQuestion(message)) {
    return scopeAnswer(t);
  }

  const localAnswer = localAssistantAnswer(message, t, language);
  const faqAnswer = await getFirestoreFaq({ message, language });
  if (faqAnswer) return faqAnswer;
  if (!endpoint) return localAnswer;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        message,
        language,
        scope: 'husamuddin-as-syganaqi-institute-only',
        context: buildAssistantContext({ institute: getInstituteContent(language), language }),
      }),
    });

    if (!response.ok) return localAnswer;
    const data = await response.json();
    return data.answer || data.message || localAnswer;
  } finally {
    window.clearTimeout(timeout);
  }
};

export const localAssistantAnswer = (question, t, language = 'kz') => {
  if (!isInstituteQuestion(question)) return scopeAnswer(t);

  const kb = buildKb(t, language);
  const questionText = normalizeAssistantText(question);
  const questionTokens = tokenizeAssistantText(question);
  const ranked = kb
    .map((entry) => ({
      ...entry,
      score: scoreEntry(entry, questionTokens, questionText),
    }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  if (!best || best.score < 2) {
    return t('assistant.fallback');
  }

  const related = ranked
    .slice(1, 3)
    .filter((entry) => entry.score > 1)
    .map((entry) => entry.title);

  return related.length
    ? `${best.answer}\n\n${t('assistant.related', { defaultValue: 'Related:' })} ${related.join(', ')}`
    : best.answer;
};

export { isInstituteQuestion };
