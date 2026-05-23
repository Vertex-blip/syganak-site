export const normalizeAssistantText = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s+-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const tokenizeAssistantText = (value) =>
  normalizeAssistantText(value)
    .split(' ')
    .filter((token) => token.length > 2 || /^\d+$/.test(token));

const hasAny = (text, terms) => terms.some((term) => text.includes(normalizeAssistantText(term)));

export const assistantScopeTerms = [
  'хусамуддин',
  'хусам ад дин',
  'ас-сығанақи',
  'сығанақи',
  'сыганаки',
  'syganaqi',
  'syganaki',
  'husamuddin',
  'институт',
  'islamic institute',
  'ислам институты',
  'исламский институт',
  'معهد',
  'حسام الدين',
  'الصغناقي',
  'қмдб',
  'думк',
  'dumk',
  'Қазақстан мұсылмандары діни басқармасы',
  'қабылдау',
  'оқуға түсу',
  'түсу',
  'поступление',
  'прием',
  'admission',
  'apply',
  'قبول',
  'бағдарлама',
  'бағдарламалар',
  'программа',
  'программы',
  'program',
  'programs',
  'برنامج',
  'برامج',
  'ислам ілімдері',
  'исламские науки',
  'islamic sciences',
  'العلوم الإسلامية',
  'құран ижаза',
  'құран ижәза',
  'куран иджаза',
  'quran ijazah',
  'ijazah',
  'إجازة القرآن',
  'ижаза',
  'араб тілі',
  'арабский язык',
  'arabic',
  'العربية',
  'ұстаз',
  'ұстаздар',
  'мұғалім',
  'преподаватель',
  'преподаватели',
  'teacher',
  'faculty',
  'مدرس',
  'оқытушы',
  'мекенжай',
  'адрес',
  'address',
  'байланыс',
  'телефон',
  'contact',
  'contacts',
  'whatsapp',
  'астана',
  'қабанбай батыр',
  'жатақхана',
  'общежитие',
  'dormitory',
  'тамақ',
  'питание',
  'meals',
  'шәкіртақы',
  'стипендия',
  'scholarship',
  'тегін',
  'бесплатно',
  'free',
  'оқу ақысы',
  'стоимость',
  'tuition',
  'құжат',
  'құжаттар',
  'документ',
  'документы',
  'document',
  'requirements',
  'емтихан',
  'экзамен',
  'exam',
  'сұхбат',
  'собеседование',
  'interview',
  'серіктес',
  'серіктестер',
  'партнер',
  'partners',
  'түлек',
  'түлектер',
  'выпускник',
  'graduates',
  'жаңалық',
  'жаңалықтар',
  'новости',
  'news',
  'іс-шара',
  'мероприятие',
  'events',
];

export const isInstituteQuestion = (message) => {
  const text = normalizeAssistantText(message);
  if (!text) return false;
  return hasAny(text, assistantScopeTerms);
};

export const scopeDeclineByLanguage = {
  kz: 'Мен тек Хусамуддин ас-Сығанақи ислам институтына қатысты сұрақтарға жауап беремін: қабылдау, оқу бағдарламалары, ұстаздар, байланыс, іс-шаралар және институт өмірі.',
  ru: 'Я отвечаю только на вопросы об исламском институте Хусамуддина ас-Сыганаки: поступление, программы, преподаватели, контакты, события и жизнь института.',
  en: 'I answer only questions about Husamuddin as-Syganaqi Islamic Institute: admission, programs, faculty, contacts, events, and institute life.',
  ar: 'أجيب فقط عن الأسئلة المتعلقة بمعهد حسام الدين الصغناقي: القبول والبرامج والأساتذة والتواصل والفعاليات وحياة المعهد.',
};

export const getScopeDecline = (language = 'kz') =>
  scopeDeclineByLanguage[language] || scopeDeclineByLanguage.kz;

export const buildAssistantContext = ({ institute, translation = {}, language = 'kz' }) => {
  const topbar = translation.topbar || {};
  const admission = translation.admission || {};
  const donation = translation.donation || {};

  const lines = [
    'OFFICIAL KNOWLEDGE BASE: Husamuddin as-Syganaqi Islamic Institute.',
    `Language requested by website: ${language}. Answer in the user's language when possible.`,
    `Name/title: ${institute.heroTitle || 'Husamuddin as-Syganaqi Islamic Institute'}.`,
    `Summary: ${institute.heroSubtitle || ''}`,
    `About: ${institute.aboutText || ''}`,
    `Mission: ${institute.mission || ''}`,
    `Legal basis: ${institute.legalText || ''}`,
    `Important: study at the institute is free; do not mention tuition fees as payable.`,
    `Contacts: address ${topbar.address || 'Astana, Kabanbay Batyr Avenue 36/4'}; phone ${topbar.phone || '+7 776 176 41 31'}; email ${topbar.email || 'info@syganaki.kz'}.`,
    `Admission steps: ${(admission.steps || []).map((step, index) => `${index + 1}. ${step.title}: ${step.desc}`).join(' ')}`,
    `Admission requirements: ${(admission.requirements || []).join('; ')}`,
    `Support/donation: ${donation.kaspi_title || 'Kaspi support'}; ${donation.kaspi_text || ''}`,
    `Programs: ${(institute.programs || [])
      .map(
        (program) =>
          `${program.title}: duration ${program.duration}; format ${program.format}; description ${program.desc}; subjects ${(program.subjects || []).join(', ')}; outcomes ${(program.outcomes || []).join(', ')}; books ${(program.books || []).join(', ')}.`,
      )
      .join('\n')}`,
    `Faculty: ${(institute.teachers || [])
      .map(
        (teacher) =>
          `${teacher.name}: ${teacher.role}; category ${teacher.category}; country ${teacher.country}; education ${(teacher.education || []).join(', ')}.`,
      )
      .join('\n')}`,
    `Partners: ${(institute.partners || []).map((partner) => `${partner.name}: ${partner.description}; ${partner.location}; ${partner.type}.`).join('\n')}`,
    `Graduates: ${institute.graduatesText || ''}`,
    `News/events: ${(institute.news || []).map((item) => `${item.date} - ${item.title}: ${item.excerpt}`).join('\n')}`,
  ];

  return lines.filter(Boolean).join('\n\n').slice(0, 18000);
};
