const baseImages = {
  hero: '/institute/hero-institute.jpeg',
  campus: '/institute/official-campus-yard.jpg',
  campusSign: '/institute/official-campus-sign.jpg',
  about: '/institute/official-library-table.jpg',
  lecture: '/institute/official-opening-lecture.jpg',
  students: '/institute/official-classroom-wide.jpg',
  studyGroup: '/institute/official-study-group.jpg',
  seminar: '/institute/official-seminar-hall.jpg',
  mufti: '/institute/official-mufti-lecture.jpg',
  quranContest: '/institute/official-quran-competition.jpg',
  quranAward: '/institute/official-quran-award.jpg',
  international: '/institute/official-international-seminar.jpg',
  tashkent: '/institute/official-tashkent-conference.jpg',
  dormitory: '/institute/official-dormitory.jpg',
  classroom: '/institute/official-classroom-empty.jpg',
  graduates: '/institute/official-graduates-award.jpg',
  quran: '/institute/quran-ijaza.jpeg',
};

const L = (kz, ru, en, ar) => ({ kz, ru, en, ar });

const pick = (value, language) => {
  if (Array.isArray(value)) return value.map((item) => pick(item, language));
  if (value && typeof value === 'object' && 'kz' in value) {
    return value[language] || value.kz;
  }
  return value;
};

const localizeObject = (item, language) =>
  Object.entries(item).reduce((acc, [key, value]) => {
    if (key === 'categoryKey') return acc;
    acc[key] = pick(value, language);
    return acc;
  }, {});

const localized = {
  kz: {
    heroBadge: 'ҚМДБ қарасты жеке мекеме',
    heroTitle: 'Дәстүрлі ислам ілімін меңгерген мамандар даярлайтын институт',
    heroSubtitle:
      '2022 жылы ҚМДБ бастамасымен құрылған Хусамуддин ас-Сығанақи атындағы ислам институты классикалық еңбектерді, араб тілін және діни-ағартушылық қызмет мәдениетін жүйелі оқытады.',
    aboutEyebrow: 'Институт туралы',
    aboutTitle: 'Білім, тәрбие және қоғамға қызмет бір оқу жүйесіне біріктірілген',
    aboutText:
      'Институт имамдарға терең білім беруді, классикалық еңбектерді оқытуды, араб тілін жетік меңгертуді және діни мәселелерді сауатты түсіндіруге қабілетті маман қалыптастыруды мақсат етеді.',
    missionTitle: 'Миссия',
    mission:
      'Дәстүрлі рухани құндылықтарды сақтай отырып, жоғары рухани білімі бар, жауапты және қоғамға пайдалы мамандар дайындау.',
    legalTitle: 'Құқықтық негіз',
    legalText:
      'Қызмет Қазақстан Республикасының Конституциясы, білім туралы заңнама, діни қызмет және діни бірлестіктер туралы заң және оқу бағдарламалары негізінде ұйымдастырылады.',
    aboutPoints: [
      ['Тегін оқу', 'Білім алушылар үшін оқу ақысыз ұйымдастырылады.'],
      ['Жатақхана және тамақ', 'Жатақхана және үш мезгіл тамақтану қарастырылған.'],
      ['Шәкіртақы', 'Үздік үлгерім көрсеткен білім алушыларға шәкіртақы тағайындалады.'],
      ['Араб тілі', 'Дайындық курсында араб тілі B1 деңгейінен B2 деңгейіне дейін күшейтіледі.'],
    ],
    programEyebrow: 'Оқу бағдарламалары',
    programTitle: 'Институт екі негізгі бағыт бойынша даярлайды',
    teacherEyebrow: 'Ұстаздар құрамы',
    teacherTitle: 'Отандық және шетелдік тәжірибелі мамандар',
    teacherText:
      'Профессор-оқытушылар құрамында 4 PhD докторы, 1 магистр және бакалавр дәрежелі мамандар бар. Жалпы саны - 10 оқытушы.',
    eventEyebrow: 'Іс-шаралар',
    eventTitle: 'Ғылыми, рухани және қоғамдық белсенді орта',
    graduatesEyebrow: 'Түлектер',
    graduatesTitle: 'Түлектердің нақты нәтижелері',
    graduatesText:
      '2025 жылғы дерек бойынша институтта 50-ден астам түлек бар: «Ислам ілімдері» бағыты бойынша 14 түлек толық жұмысқа орналасқан, «Құран ижаза» бағыты бойынша 36 түлек бар.',
    galleryTitle: 'Кампус, оқу және институт өмірі',
    galleryCategories: ['Барлығы', 'Кампус', 'Оқу', 'Ұстаздар', 'Іс-шара', 'Студенттер'],
    stats: [
      ['2022', 'Құрылған жылы'],
      ['2', 'Негізгі бағдарлама'],
      ['10', 'Оқытушы'],
      ['50+', 'Түлек'],
    ],
  },
  ru: {
    heroBadge: 'Частное учреждение при ДУМК',
    heroTitle: 'Институт подготовки специалистов с глубокими исламскими знаниями',
    heroSubtitle:
      'Исламский институт имени Хусамуддина ас-Сыганаки, основанный в 2022 году по инициативе ДУМК, системно преподает классические труды, арабский язык и культуру духовно-просветительской работы.',
    aboutEyebrow: 'Об институте',
    aboutTitle: 'Знание, воспитание и служение обществу объединены в одну систему',
    aboutText:
      'Институт дает имамам глубокие знания, обучает классическим трудам, укрепляет арабский язык и готовит специалистов, способных грамотно объяснять религиозные вопросы.',
    missionTitle: 'Миссия',
    mission:
      'Сохраняя традиционные духовные ценности, готовить ответственных специалистов с высоким религиозным образованием и пользой для общества.',
    legalTitle: 'Правовая основа',
    legalText:
      'Работа ведется на основе Конституции Республики Казахстан, законодательства об образовании, закона о религиозной деятельности и религиозных объединениях, а также учебных программ.',
    aboutPoints: [
      ['Бесплатное обучение', 'Обучение для студентов института организовано бесплатно.'],
      ['Общежитие и питание', 'Предусмотрены общежитие и трехразовое питание.'],
      ['Стипендия', 'Студентам с высокой успеваемостью назначается стипендия.'],
      ['Арабский язык', 'На подготовительном курсе арабский язык усиливается с B1 до B2.'],
    ],
    programEyebrow: 'Программы обучения',
    programTitle: 'Институт готовит по двум основным направлениям',
    teacherEyebrow: 'Преподаватели',
    teacherTitle: 'Опытные отечественные и зарубежные специалисты',
    teacherText:
      'В составе преподавателей - 4 доктора PhD, 1 магистр и специалисты со степенью бакалавра. Всего работает 10 преподавателей.',
    eventEyebrow: 'Мероприятия',
    eventTitle: 'Научная, духовная и общественная среда',
    graduatesEyebrow: 'Выпускники',
    graduatesTitle: 'Реальные результаты выпускников',
    graduatesText:
      'По данным 2025 года в институте более 50 выпускников: 14 выпускников направления «Исламские науки» полностью трудоустроены, по направлению «Коран ижаза» - 36 выпускников.',
    galleryTitle: 'Кампус, обучение и жизнь института',
    galleryCategories: ['Все', 'Кампус', 'Обучение', 'Преподаватели', 'Событие', 'Студенты'],
    stats: [
      ['2022', 'Год основания'],
      ['2', 'Основные программы'],
      ['10', 'Преподавателей'],
      ['50+', 'Выпускников'],
    ],
  },
  en: {
    heroBadge: 'Private institution under DUMK',
    heroTitle: 'An institute preparing specialists with deep Islamic knowledge',
    heroSubtitle:
      'Founded in 2022 by the Spiritual Administration of Muslims of Kazakhstan, the Husamuddin as-Syganaqi Islamic Institute teaches classical texts, Arabic, and the culture of public religious service.',
    aboutEyebrow: 'About the institute',
    aboutTitle: 'Knowledge, character and public service in one academic system',
    aboutText:
      'The institute gives imams advanced knowledge, teaches classical works, strengthens Arabic, and prepares specialists who can explain religious questions responsibly.',
    missionTitle: 'Mission',
    mission:
      'To preserve traditional spiritual values while preparing responsible specialists with strong religious education and benefit for society.',
    legalTitle: 'Legal basis',
    legalText:
      'The institute operates under the Constitution of Kazakhstan, education legislation, the law on religious activity and religious associations, and approved academic programs.',
    aboutPoints: [
      ['Free study', 'Students study without tuition fees.'],
      ['Dormitory and meals', 'Dormitory accommodation and three daily meals are provided.'],
      ['Scholarship', 'High-performing students may receive a scholarship.'],
      ['Arabic language', 'The preparatory year raises Arabic from B1 to B2.'],
    ],
    programEyebrow: 'Academic programs',
    programTitle: 'The institute trains students in two main tracks',
    teacherEyebrow: 'Faculty',
    teacherTitle: 'Experienced local and international specialists',
    teacherText:
      'The faculty includes 4 PhD holders, 1 master-level specialist and bachelor-level teachers. The institute has 10 teachers in total.',
    eventEyebrow: 'Events',
    eventTitle: 'An active scholarly, spiritual and public environment',
    graduatesEyebrow: 'Graduates',
    graduatesTitle: 'Real graduate outcomes',
    graduatesText:
      'As of 2025, the institute has more than 50 graduates: 14 Islamic Sciences graduates are fully employed, and the Quran Ijazah track has 36 graduates.',
    galleryTitle: 'Campus, learning and institute life',
    galleryCategories: ['All', 'Campus', 'Learning', 'Faculty', 'Event', 'Students'],
    stats: [
      ['2022', 'Founded'],
      ['2', 'Main programs'],
      ['10', 'Teachers'],
      ['50+', 'Graduates'],
    ],
  },
  ar: {
    heroBadge: 'مؤسسة خاصة تابعة للإدارة الدينية لمسلمي كازاخستان',
    heroTitle: 'معهد يعد متخصصين ذوي معرفة إسلامية عميقة',
    heroSubtitle:
      'تأسس معهد حسام الدين الصغناقي الإسلامي عام 2022 بمبادرة الإدارة الدينية لمسلمي كازاخستان، ويدرّس المتون الكلاسيكية واللغة العربية وثقافة الخدمة الدعوية.',
    aboutEyebrow: 'عن المعهد',
    aboutTitle: 'العلم والتربية وخدمة المجتمع في نظام تعليمي واحد',
    aboutText:
      'يمنح المعهد الأئمة معرفة عميقة، ويدرّس الكتب الكلاسيكية، ويقوي اللغة العربية، ويعد متخصصين قادرين على شرح المسائل الدينية بمسؤولية.',
    missionTitle: 'الرسالة',
    mission:
      'حفظ القيم الروحية التقليدية وإعداد متخصصين مسؤولين ذوي تعليم ديني راسخ ونفع للمجتمع.',
    legalTitle: 'الأساس القانوني',
    legalText:
      'ينظم عمل المعهد وفق دستور كازاخستان وتشريعات التعليم وقانون النشاط الديني والجمعيات الدينية والبرامج التعليمية المعتمدة.',
    aboutPoints: [
      ['تعليم مجاني', 'الدراسة في المعهد مجانية للطلاب.'],
      ['السكن والطعام', 'يوفر السكن وثلاث وجبات يوميا.'],
      ['منحة', 'تمنح مكافأة للطلاب المتفوقين.'],
      ['اللغة العربية', 'ترفع السنة التمهيدية مستوى العربية من B1 إلى B2.'],
    ],
    programEyebrow: 'البرامج الدراسية',
    programTitle: 'يعد المعهد الطلاب في مسارين أساسيين',
    teacherEyebrow: 'هيئة التدريس',
    teacherTitle: 'متخصصون محليون ودوليون ذوو خبرة',
    teacherText:
      'تضم هيئة التدريس 4 حملة دكتوراه و1 ماجستير ومدرسين بدرجة البكالوريوس. ويعمل في المعهد 10 مدرسين.',
    eventEyebrow: 'الفعاليات',
    eventTitle: 'بيئة علمية وروحية ومجتمعية نشطة',
    graduatesEyebrow: 'الخريجون',
    graduatesTitle: 'نتائج حقيقية للخريجين',
    graduatesText:
      'بحسب بيانات 2025 لدى المعهد أكثر من 50 خريجا: توظف 14 خريجا من مسار العلوم الإسلامية، ولدى مسار إجازة القرآن 36 خريجا.',
    galleryTitle: 'الحرم والتعليم وحياة المعهد',
    galleryCategories: ['الكل', 'الحرم', 'التعليم', 'المدرسون', 'حدث', 'الطلاب'],
    stats: [
      ['2022', 'سنة التأسيس'],
      ['2', 'برنامجان أساسيان'],
      ['10', 'مدرسون'],
      ['50+', 'خريجون'],
    ],
  },
};

const programs = [
  {
    id: 'islamic-studies',
    title: L('Ислам ілімдері', 'Исламские науки', 'Islamic Sciences', 'العلوم الإسلامية'),
    duration: L('3 оқу жылы', '3 года обучения', '3 academic years', '3 سنوات دراسية'),
    format: L('1 жыл дайындық + 2 жыл негізгі оқу', '1 год подготовки + 2 года основного обучения', '1 preparatory year + 2 core years', 'سنة تمهيدية + سنتان أساسيتان'),
    image: baseImages.lecture,
    desc: L(
      'Бірінші жылы араб грамматикасы, риторика, аударма және тілдік дағдылар тереңдетіледі. Екінші және үшінші жылдары Құран, тәпсір, фиқһ, хадис және ақида пәндері толықтай араб тілінде жүргізіледі.',
      'В первый год углубленно изучаются арабская грамматика, риторика, перевод и языковые навыки. На втором и третьем курсах Коран, тафсир, фикх, хадис и акида преподаются полностью на арабском языке.',
      'The first year strengthens Arabic grammar, rhetoric, translation and language skills. In years two and three, Quran, tafsir, fiqh, hadith and aqidah are taught fully in Arabic.',
      'في السنة الأولى تدرس قواعد العربية والبلاغة والترجمة والمهارات اللغوية بعمق. وفي السنتين الثانية والثالثة تدرس مواد القرآن والتفسير والفقه والحديث والعقيدة بالعربية.'
    ),
    subjects: {
      kz: ['Араб грамматикасы', 'Риторика және аударма', 'Құран және тәпсір', 'Фиқһ', 'Хадис', 'Ақида'],
      ru: ['Арабская грамматика', 'Риторика и перевод', 'Коран и тафсир', 'Фикх', 'Хадис', 'Акида'],
      en: ['Arabic grammar', 'Rhetoric and translation', 'Quran and tafsir', 'Fiqh', 'Hadith', 'Aqidah'],
      ar: ['قواعد العربية', 'البلاغة والترجمة', 'القرآن والتفسير', 'الفقه', 'الحديث', 'العقيدة'],
    },
    outcomes: {
      kz: ['Араб тілін B1 деңгейінен B2 деңгейіне көтеру', 'Классикалық еңбектермен жұмыс', 'Имамдық және діни-ағартушылық қызметке дайындық', 'Оқу соңында сертификат алу'],
      ru: ['Повышение арабского с B1 до B2', 'Работа с классическими трудами', 'Подготовка к имамской и просветительской службе', 'Сертификат после завершения'],
      en: ['Arabic progress from B1 to B2', 'Work with classical texts', 'Preparation for imam and public religious service', 'Certificate after completion'],
      ar: ['رفع العربية من B1 إلى B2', 'العمل مع المتون الكلاسيكية', 'الإعداد للإمامة والخدمة الدعوية', 'شهادة عند التخرج'],
    },
    structure: {
      kz: ['Дайындық курс: 11 кітап', 'Негізгі оқу: 16 кітап', 'Жалпы мерзім: 3 жыл'],
      ru: ['Подготовительный курс: 11 книг', 'Основное обучение: 16 книг', 'Общий срок: 3 года'],
      en: ['Preparatory course: 11 books', 'Core study: 16 books', 'Total duration: 3 years'],
      ar: ['التمهيدي: 11 كتابا', 'الدراسة الأساسية: 16 كتابا', 'المدة: 3 سنوات'],
    },
    books: {
      kz: ['Қатр ән-Нәда', 'әл-Бәләға әл-Уадыха', 'әт-Татбиқ әс-Сарфи', 'Мәжмуға әс-Сарф', 'Мәжмуға ән-Наху', 'әл-Арабия бәйна ядәйк', 'Құран Кәрім', 'Тәпсір', 'Сахих хадистер', 'Фиқһ', 'Ақида', 'Логика'],
      ru: ['Катр ан-Нада', 'аль-Балага аль-Вадиха', 'ат-Татбик ас-Сарфи', 'Маджмуа ас-Сарф', 'Маджмуа ан-Наху', 'аль-Арабия байна ядайк', 'Коран Карим', 'Тафсир', 'Сахих хадисы', 'Фикх', 'Акида', 'Логика'],
      en: ['Qatr an-Nada', 'Al-Balagha al-Wadihah', 'At-Tatbiq as-Sarfi', 'Majmua as-Sarf', 'Majmua an-Nahw', 'Al-Arabiyyah Bayna Yadayk', 'Quran Karim', 'Tafsir', 'Sahih hadith texts', 'Fiqh', 'Aqidah', 'Logic'],
      ar: ['قطر الندى', 'البلاغة الواضحة', 'التطبيق الصرفي', 'مجموعة الصرف', 'مجموعة النحو', 'العربية بين يديك', 'القرآن الكريم', 'التفسير', 'أحاديث صحيحة', 'الفقه', 'العقيدة', 'المنطق'],
    },
  },
  {
    id: 'quran-ijazah',
    title: L('Құран ижаза', 'Коран ижаза', 'Quran Ijazah', 'إجازة القرآن'),
    duration: L('1 оқу жылы', '1 учебный год', '1 academic year', 'سنة دراسية واحدة'),
    format: L('Арнайы ижаза бағыты', 'Специальное направление иджазы', 'Special ijazah track', 'مسار خاص للإجازة'),
    image: baseImages.quranAward,
    desc: L(
      'Құранды жатқа тапсыру, Құран ілімі, тәпсір, араб тілі және тәжуидті жүйелі меңгеруге арналған бір жылдық бағдарлама.',
      'Годовая программа для системного освоения заучивания Корана, коранических наук, тафсира, арабского языка и таджвида.',
      'A one-year program for Quran memorization, Quranic sciences, tafsir, Arabic and tajweed in a structured academic path.',
      'برنامج لمدة سنة لحفظ القرآن ودراسة علومه والتفسير والعربية والتجويد بصورة منهجية.'
    ),
    subjects: {
      kz: ['Құранды жатқа тапсыру', 'Құран ілімі', 'Тәпсір', 'Араб тілі', 'Тәжуид ілімі'],
      ru: ['Заучивание Корана', 'Коранические науки', 'Тафсир', 'Арабский язык', 'Таджвид'],
      en: ['Quran memorization', 'Quranic sciences', 'Tafsir', 'Arabic', 'Tajweed'],
      ar: ['حفظ القرآن', 'علوم القرآن', 'التفسير', 'العربية', 'التجويد'],
    },
    outcomes: {
      kz: ['Құранды қатесіз оқу', 'Тәжуид пен махражды практикада меңгеру', 'Ижазаға дайындалу', 'Қари және ұстаздық бағытқа дайындық'],
      ru: ['Правильное чтение Корана', 'Практика таджвида и махраджа', 'Подготовка к иджазе', 'Путь кари и преподавателя'],
      en: ['Accurate Quran recitation', 'Practical tajweed and makhraj', 'Ijazah preparation', 'Qari and teaching path'],
      ar: ['قراءة صحيحة للقرآن', 'تطبيق التجويد والمخارج', 'الاستعداد للإجازة', 'مسار القارئ والمدرس'],
    },
    structure: {
      kz: ['Курс: 1 жыл', 'Құран ижаза: 4 кітап', 'Негізгі бағыт: хифз және тәжуид'],
      ru: ['Курс: 1 год', 'Коран ижаза: 4 книги', 'Основной фокус: хифз и таджвид'],
      en: ['Course: 1 year', 'Quran ijazah: 4 books', 'Main focus: hifz and tajweed'],
      ar: ['الدورة: سنة واحدة', 'إجازة القرآن: 4 كتب', 'التركيز: الحفظ والتجويد'],
    },
    books: {
      kz: ['Құран Кәрім', 'Құран Кәрімдегі көркем мінез', 'Көрнекті тәжуид', 'Араб тілі'],
      ru: ['Коран Карим', 'Благой нрав в Коране', 'Наглядный таджвид', 'Арабский язык'],
      en: ['Quran Karim', 'Noble Character in the Quran', 'Clear Tajweed', 'Arabic language'],
      ar: ['القرآن الكريم', 'الأخلاق في القرآن الكريم', 'التجويد الواضح', 'اللغة العربية'],
    },
  },
];

const teachers = [
  {
    id: 'bagdat-manabayev',
    categoryKey: 'administration',
    name: L('Манабаев Бағдат Маханұлы', 'Манабаев Багдат Маханович', 'Bagdat Manabayev', 'بغداد ماناباييف'),
    role: L('Директор, араб тілі оқытушысы, PhD', 'Директор, преподаватель арабского языка, PhD', 'Director, Arabic teacher, PhD', 'المدير ومدرس العربية، PhD'),
    degree: 'PhD',
    country: L('Қазақстан', 'Казахстан', 'Kazakhstan', 'كازاخستان'),
    image: '/institute/faculty-bagdat.jpg',
    education: {
      kz: ['Меркі медресесі', 'Нұр-Мүбарак университеті, филология', 'Абай атындағы ҚазҰПУ, филология магистратурасы', 'Нұр-Мүбарак университеті, дінтану PhD'],
      ru: ['Меркенское медресе', 'Университет Нур-Мубарак, филология', 'КазНПУ имени Абая, магистратура по филологии', 'Университет Нур-Мубарак, PhD по религиоведению'],
      en: ['Merki madrasa', 'Nur-Mubarak University, philology', 'Abai KazNPU, MA in philology', 'Nur-Mubarak University, PhD in religious studies'],
      ar: ['مدرسة مركي', 'جامعة نور مبارك، فقه اللغة', 'جامعة أباي التربوية، ماجستير', 'جامعة نور مبارك، دكتوراه في الدراسات الدينية'],
    },
  },
  {
    id: 'zhaksylyk-rakhymbay',
    categoryKey: 'administration',
    name: L('Рахымбай Жақсылық Хибадатұлы', 'Рахымбай Жаксылык Хибадатович', 'Zhaksylyk Rakhymbay', 'جاقسليك راخيمباي'),
    role: L('Директордың орынбасары, дінтанушы', 'Заместитель директора, религиовед', 'Deputy director, religious studies specialist', 'نائب المدير، متخصص في الدراسات الدينية'),
    degree: L('Бакалавр', 'Бакалавр', 'Bachelor', 'بكالوريوس'),
    country: L('Қазақстан', 'Казахстан', 'Kazakhstan', 'كازاخستان'),
    image: '/institute/faculty-rahymbay.jpg',
    education: {
      kz: ['Нұр-Мүбарак университеті, ислам ілімдері факультеті, дінтану, үздік диплом'],
      ru: ['Университет Нур-Мубарак, факультет исламских наук, религиоведение, диплом с отличием'],
      en: ['Nur-Mubarak University, Faculty of Islamic Sciences, religious studies, honors diploma'],
      ar: ['جامعة نور مبارك، كلية العلوم الإسلامية، الدراسات الدينية، دبلوم امتياز'],
    },
  },
  {
    id: 'azamat-baizakov',
    categoryKey: 'administration',
    name: L('Байзаков Азамат Бименұлы', 'Байзаков Азамат Бименович', 'Azamat Baizakov', 'عزمات بايزاكوف'),
    role: L('Оқу бөлімінің меңгерушісі', 'Руководитель учебного отдела', 'Head of Academic Department', 'رئيس القسم الأكاديمي'),
    degree: L('Магистр', 'Магистр', 'Master', 'ماجستير'),
    country: L('Қазақстан', 'Казахстан', 'Kazakhstan', 'كازاخستان'),
    image: '/institute/faculty-baizakov.jpg',
    education: {
      kz: ['Нұр-Мүбарак университеті, дінтану бакалавры және магистрі'],
      ru: ['Университет Нур-Мубарак, бакалавр и магистр религиоведения'],
      en: ['Nur-Mubarak University, bachelor and master in religious studies'],
      ar: ['جامعة نور مبارك، بكالوريوس وماجستير في الدراسات الدينية'],
    },
  },
  {
    id: 'temirzhan-muratov',
    categoryKey: 'quran',
    name: L('Мұратов Теміржан Өтежанұлы', 'Муратов Темиржан Отежанович', 'Temirzhan Muratov', 'تميرجان موراتوف'),
    role: L('Құран ижаза бөлімінің меңгерушісі, қари', 'Руководитель направления Коран ижаза, кари', 'Head of Quran Ijazah, qari', 'رئيس مسار إجازة القرآن، قارئ'),
    degree: L('Бакалавр, қари', 'Бакалавр, кари', 'Bachelor, qari', 'بكالوريوس، قارئ'),
    country: L('Қазақстан', 'Казахстан', 'Kazakhstan', 'كازاخستان'),
    image: '/institute/faculty-temirzhan.jpg',
    education: {
      kz: ['Нұр-Мүбарак университеті, исламтану', 'Шейх Рияд Мұстафа Құран орталығы, ижаза сертификаты'],
      ru: ['Университет Нур-Мубарак, исламоведение', 'Центр Корана шейха Рияда Мустафы, сертификат иджазы'],
      en: ['Nur-Mubarak University, Islamic studies', 'Sheikh Riyad Mustafa Quran Center, ijazah certificate'],
      ar: ['جامعة نور مبارك، الدراسات الإسلامية', 'مركز الشيخ رياض مصطفى للقرآن، شهادة إجازة'],
    },
  },
  {
    id: 'temirlan-ibrayev',
    categoryKey: 'islamic',
    name: L('Ибраев Темірлан Дарханұлы', 'Ибраев Темирлан Дарханович', 'Temirlan Ibrayev', 'تميرلان إبراييف'),
    role: L('Исламтанушы, магистр', 'Исламовед, магистр', 'Islamic studies specialist, master', 'متخصص في العلوم الإسلامية، ماجستير'),
    degree: L('Магистр', 'Магистр', 'Master', 'ماجستير'),
    country: L('Қазақстан', 'Казахстан', 'Kazakhstan', 'كازاخستان'),
    image: '/institute/faculty-temirlan.jpg',
    education: {
      kz: ['Астана медресесі, исламтану', 'Хасеки білім ордасы, исламтану', 'Еуразия ұлттық университеті, дінтану магистрі'],
      ru: ['Медресе Астана, исламоведение', 'Академия Хасеки, исламоведение', 'Евразийский национальный университет, магистр религиоведения'],
      en: ['Astana madrasa, Islamic studies', 'Haseki Academy, Islamic studies', 'Eurasian National University, MA in religious studies'],
      ar: ['مدرسة أستانا، الدراسات الإسلامية', 'أكاديمية حاسكي، الدراسات الإسلامية', 'الجامعة الأوراسية الوطنية، ماجستير في الدراسات الدينية'],
    },
  },
  {
    id: 'serik-zhumashev',
    categoryKey: 'islamic',
    name: L('Жұмашев Серік Қайратұлы', 'Жумашев Серик Кайратович', 'Serik Zhumashev', 'سيريك جوماشيف'),
    role: L('Исламтанушы, институт түлегі', 'Исламовед, выпускник института', 'Islamic studies specialist, institute graduate', 'متخصص في الدراسات الإسلامية، خريج المعهد'),
    degree: L('Бакалавр', 'Бакалавр', 'Bachelor', 'بكالوريوس'),
    country: L('Қазақстан', 'Казахстан', 'Kazakhstan', 'كازاخستان'),
    image: '/institute/faculty-serik.jpg',
    education: {
      kz: ['Нұр-Мүбарак университеті, исламтану', 'Хусамуддин ас-Сығанақи атындағы ислам институты, Ислам ілімдері бөлімі'],
      ru: ['Университет Нур-Мубарак, исламоведение', 'Исламский институт имени Хусамуддина ас-Сыганаки, отделение исламских наук'],
      en: ['Nur-Mubarak University, Islamic studies', 'Husamuddin as-Syganaqi Islamic Institute, Islamic Sciences track'],
      ar: ['جامعة نور مبارك، الدراسات الإسلامية', 'معهد حسام الدين الصغناقي، مسار العلوم الإسلامية'],
    },
  },
  {
    id: 'yaser-setochi',
    categoryKey: 'islamic',
    name: L('Ясер Ахмед Морси Мохамед Сеточи', 'Ясер Ахмед Морси Мохамед Сеточи', 'Yaser Ahmed Morsi Mohamed Setochi', 'ياسر أحمد مرسي محمد'),
    role: L('PhD доктор, профессор, исламтанушы', 'PhD доктор, профессор, исламовед', 'PhD, professor, Islamic studies specialist', 'دكتوراه، أستاذ، متخصص في العلوم الإسلامية'),
    degree: 'PhD',
    country: L('Мысыр Араб Республикасы', 'Арабская Республика Египет', 'Arab Republic of Egypt', 'جمهورية مصر العربية'),
    image: '/institute/faculty-yaser.jpg',
    education: {
      kz: ['Әл-Азхар университеті, исламтану бакалавры', 'Әл-Азхар университеті, исламтану магистрі', 'Әл-Азхар университеті, PhD'],
      ru: ['Университет Аль-Азхар, бакалавр исламоведения', 'Университет Аль-Азхар, магистр исламоведения', 'Университет Аль-Азхар, PhD'],
      en: ['Al-Azhar University, BA in Islamic studies', 'Al-Azhar University, MA in Islamic studies', 'Al-Azhar University, PhD'],
      ar: ['جامعة الأزهر، بكالوريوس الدراسات الإسلامية', 'جامعة الأزهر، ماجستير الدراسات الإسلامية', 'جامعة الأزهر، دكتوراه'],
    },
  },
  {
    id: 'suleyman-tash',
    categoryKey: 'islamic',
    name: L('Сулейман Таш', 'Сулейман Таш', 'Suleyman Tash', 'سليمان تاش'),
    role: L('PhD доктор, исламтанушы', 'PhD доктор, исламовед', 'PhD, Islamic studies specialist', 'دكتوراه، متخصص في العلوم الإسلامية'),
    degree: 'PhD',
    country: L('Түркия Республикасы', 'Турецкая Республика', 'Republic of Türkiye', 'الجمهورية التركية'),
    image: '/institute/faculty-suleyman.jpg',
    education: {
      kz: ['Анкара университеті, иләһият', 'Мәрмара университеті, араб тілі және әдебиеті', 'Измир Докуз Эйлюл университеті, исламтану PhD'],
      ru: ['Анкарский университет, теология', 'Университет Мармара, арабский язык и литература', 'Университет Докуз Эйлюль, PhD по исламоведению'],
      en: ['Ankara University, theology', 'Marmara University, Arabic language and literature', 'Dokuz Eylul University, PhD in Islamic studies'],
      ar: ['جامعة أنقرة، الإلهيات', 'جامعة مرمرة، اللغة العربية وآدابها', 'جامعة دوكوز أيلول، دكتوراه في الدراسات الإسلامية'],
    },
  },
  {
    id: 'sabri-ali',
    categoryKey: 'languages',
    name: L('Сабри Мухаммад Абдель Азим Али', 'Сабри Мухаммад Абдель Азим Али', 'Sabri Muhammad Abdel Azim Ali', 'صبري محمد عبد العظيم علي'),
    role: L('PhD доктор, филолог', 'PhD доктор, филолог', 'PhD, philologist', 'دكتوراه، فقه اللغة'),
    degree: 'PhD',
    country: L('Мысыр Араб Республикасы', 'Арабская Республика Египет', 'Arab Republic of Egypt', 'جمهورية مصر العربية'),
    image: '/institute/faculty-sabri.jpg',
    education: {
      kz: ['Фаюм университеті, араб тілі бакалавры', 'Танта университеті, араб тілі PhD'],
      ru: ['Фаюмский университет, бакалавр арабского языка', 'Университет Танта, PhD по арабскому языку'],
      en: ['Fayoum University, BA in Arabic language', 'Tanta University, PhD in Arabic language'],
      ar: ['جامعة الفيوم، بكالوريوس اللغة العربية', 'جامعة طنطا، دكتوراه في اللغة العربية'],
    },
  },
  {
    id: 'mahmud-mahmud',
    categoryKey: 'quran',
    name: L('Махмуд Ахмед Мохамед Махмуд', 'Махмуд Ахмед Мохамед Махмуд', 'Mahmud Ahmed Mohamed Mahmud', 'محمود أحمد محمد محمود'),
    role: L('Исламтанушы, қари', 'Исламовед, кари', 'Islamic studies specialist, qari', 'متخصص في العلوم الإسلامية، قارئ'),
    degree: L('Бакалавр', 'Бакалавр', 'Bachelor', 'بكالوريوس'),
    country: L('Мысыр Араб Республикасы', 'Арабская Республика Египет', 'Arab Republic of Egypt', 'جمهورية مصر العربية'),
    image: '/institute/faculty-mahmud.jpg',
    education: {
      kz: ['Әл-Азхар университеті, араб тілі бакалавры'],
      ru: ['Университет Аль-Азхар, бакалавр арабского языка'],
      en: ['Al-Azhar University, BA in Arabic language'],
      ar: ['جامعة الأزهر، بكالوريوس اللغة العربية'],
    },
  },
];

const categoryNames = {
  kz: { administration: 'Әкімшілік', quran: 'Құран ғылымдары', islamic: 'Ислам ілімдері', languages: 'Араб тілі' },
  ru: { administration: 'Администрация', quran: 'Коранические науки', islamic: 'Исламские науки', languages: 'Арабский язык' },
  en: { administration: 'Administration', quran: 'Quranic Sciences', islamic: 'Islamic Sciences', languages: 'Arabic Language' },
  ar: { administration: 'الإدارة', quran: 'علوم القرآن', islamic: 'العلوم الإسلامية', languages: 'اللغة العربية' },
};

const news = [
  {
    id: 'iman-to-ihsan',
    title: L('Иманнан - ихсанға дәрісі', 'Лекция «От имана к ихсану»', 'From Iman to Ihsan lecture', 'محاضرة من الإيمان إلى الإحسان'),
    excerpt: L(
      'Бас мүфти Наурызбай қажы Тағанұлы ихсан ұғымының мәні мен рухани кемелдену тақырыбында дәріс өткізді.',
      'Главный муфтий Наурызбай кажы Таганулы провел лекцию о смысле ихсана и духовного совершенствования.',
      'Chief Mufti Nauryzbay qaji Taganuly delivered a lecture on ihsan and spiritual maturity.',
      'قدم المفتي العام نوريزباي قاجي تاغانولي محاضرة عن معنى الإحسان والكمال الروحي.'
    ),
    category: L('Рухани-ағартушылық', 'Духовно-просветительское', 'Spiritual education', 'التربية الروحية'),
    date: '2025',
    image: baseImages.mufti,
    content: L(
      '<p>Институтта ҚМДБ Төрағасы, Бас мүфти Наурызбай қажы Тағанұлының «Иманнан - ихсанға» тақырыбындағы рухани дәрісі өтті. Кездесуде ихсан ұғымы, діни қызметтегі жауапкершілік және рухани кемелдену мәселелері қозғалды.</p>',
      '<p>В институте прошла духовная лекция Председателя ДУМК, Главного муфтия Наурызбая кажы Таганулы на тему «От имана к ихсану». На встрече обсуждались смысл ихсана, ответственность в религиозной службе и духовное совершенствование.</p>',
      '<p>The institute hosted a spiritual lecture by the Chairman of DUMK and Chief Mufti Nauryzbay qaji Taganuly on the theme “From Iman to Ihsan”. The session focused on ihsan, responsibility in religious service, and spiritual growth.</p>',
      '<p>استضاف المعهد محاضرة روحية لرئيس الإدارة الدينية والمفتي العام نوريزباي قاجي تاغانولي بعنوان «من الإيمان إلى الإحسان»، وتناولت معنى الإحسان ومسؤولية الخدمة الدينية والنمو الروحي.</p>'
    ),
  },
  {
    id: 'fiqh-lectures',
    title: L('Фиқһ пәні бойынша дәрістер', 'Лекции по фикху', 'Fiqh lectures', 'دروس الفقه'),
    excerpt: L(
      'Наиб мүфти Сансызбай Шоқанов Құрбанұлы ислам құқығының практикалық мәселелері бойынша дәріс өткізді.',
      'Наиб муфтий Сансызбай Шоканов Курбанулы провел лекции по практическим вопросам исламского права.',
      'Naib Mufti Sansyzbay Shokanov delivered lectures on practical questions of Islamic law.',
      'قدم نائب المفتي سانسيزباي شوكانوف دروسا في المسائل العملية للفقه الإسلامي.'
    ),
    category: L('Оқу', 'Обучение', 'Learning', 'التعليم'),
    date: '2025',
    image: baseImages.seminar,
    content: L(
      '<p>Фиқһ дәрістерінде студенттер күнделікті өмірдегі діни үкімдерді, ислам құқығының негізгі қағидаларын және имамдық қызметте жиі кездесетін сұрақтарды талқылады.</p>',
      '<p>На лекциях по фикху студенты разобрали религиозные нормы повседневной жизни, основные принципы исламского права и вопросы, которые часто встречаются в имамской практике.</p>',
      '<p>During the fiqh lectures, students discussed everyday religious rulings, core principles of Islamic law, and questions frequently encountered in imam service.</p>',
      '<p>ناقش الطلاب في دروس الفقه أحكام الحياة اليومية ومبادئ الفقه الإسلامي والأسئلة المتكررة في خدمة الأئمة.</p>'
    ),
  },
  {
    id: 'quran-competition',
    title: L('Құран Кәрімді оқу конкурсы', 'Конкурс чтения Корана', 'Quran recitation competition', 'مسابقة تلاوة القرآن'),
    excerpt: L(
      'XIV республикалық конкурста институт түлегі 2-орын иеленді. Байқауға Қазақстанның барлық өңірінен 80 қатысушы қатысты.',
      'На XIV республиканском конкурсе выпускник института занял 2-е место. В конкурсе участвовали 80 представителей регионов Казахстана.',
      'An institute graduate took 2nd place at the XIV republican competition, which brought together 80 participants from across Kazakhstan.',
      'حصل أحد خريجي المعهد على المركز الثاني في المسابقة الجمهورية الرابعة عشرة بمشاركة 80 متسابقا من مناطق كازاخستان.'
    ),
    category: L('Жетістік', 'Достижение', 'Achievement', 'إنجاز'),
    date: '2025',
    image: baseImages.quranContest,
    content: L(
      '<p>Құран Кәрімді жатқа және мәнерлеп оқу бойынша республикалық конкурста институт түлегі жүлделі 2-орынға ие болды. Бұл нәтиже Құран ижаза бағытының тәжірибелік деңгейін көрсетеді.</p>',
      '<p>На республиканском конкурсе по заучиванию и выразительному чтению Корана выпускник института занял призовое 2-е место. Этот результат показывает практический уровень направления «Коран ижаза».</p>',
      '<p>At the republican Quran memorization and expressive recitation competition, an institute graduate earned 2nd place. The result reflects the practical strength of the Quran Ijazah track.</p>',
      '<p>في المسابقة الجمهورية لحفظ القرآن وتلاوته حصل أحد خريجي المعهد على المركز الثاني، مما يعكس قوة مسار إجازة القرآن عمليا.</p>'
    ),
  },
  {
    id: 'international-seminar-2025',
    title: L('III халықаралық семинар', 'III международный семинар', 'III International Seminar', 'الندوة الدولية الثالثة'),
    excerpt: L(
      'Алматы қаласында «Қазақстан мәдениеті және исламның қолжазба мұрасы» тақырыбындағы халықаралық семинарға институт директоры ғылыми баяндама жасады.',
      'В Алматы на международном семинаре о культуре Казахстана и рукописном наследии ислама директор института выступил с научным докладом.',
      'At an international seminar in Almaty on Kazakhstan’s culture and Islamic manuscript heritage, the institute director delivered a scholarly presentation.',
      'في ندوة دولية بمدينة ألماتي حول ثقافة كازاخستان وتراث المخطوطات الإسلامية قدم مدير المعهد بحثا علميا.'
    ),
    category: L('Ғылыми байланыс', 'Научные связи', 'Academic relations', 'العلاقات العلمية'),
    date: '2025',
    image: baseImages.international,
    content: L(
      '<p>2025 жылғы қазан айында Алматыда Нұр-Мүбарак Египет ислам мәдениеті университеті және IRCICA ұйымдастырған халықаралық семинар өтті. Институт директоры Алтын Орда мен Мысыр коллекциялары негізіндегі қолжазба мұрасы бойынша баяндама жасады.</p>',
      '<p>В октябре 2025 года в Алматы прошел международный семинар, организованный Египетским университетом исламской культуры Нур-Мубарак и IRCICA. Директор института представил доклад о рукописном наследии на основе коллекций Золотой Орды и Египта.</p>',
      '<p>In October 2025, Almaty hosted an international seminar organized by Nur-Mubarak Egyptian University of Islamic Culture and IRCICA. The institute director presented on manuscript heritage based on Golden Horde and Egyptian collections.</p>',
      '<p>في أكتوبر 2025 عقدت في ألماتي ندوة دولية نظمتها جامعة نور مبارك المصرية للثقافة الإسلامية وIRCICA، وقدم مدير المعهد بحثا حول تراث المخطوطات في مجموعات القبيلة الذهبية ومصر.</p>'
    ),
  },
  {
    id: 'tashkent-conference',
    title: L('Ташкент қаласындағы конференция', 'Конференция в Ташкенте', 'Tashkent conference', 'مؤتمر طشقند'),
    excerpt: L(
      'Қараханилер дәуіріндегі түркі және ислам әлемі тақырыбындағы конференцияда PhD доктор Бағдат Манабаев ғылыми баяндама жасады.',
      'На конференции о тюркском и исламском мире эпохи Караханидов PhD Багдат Манабаев выступил с научным докладом.',
      'At a conference on the Turkic and Islamic world of the Karakhanid era, PhD Bagdat Manabayev presented a scholarly paper.',
      'في مؤتمر حول العالم التركي والإسلامي في عصر القراخانيين قدم الدكتور بغداد ماناباييف بحثا علميا.'
    ),
    category: L('Халықаралық', 'Международное', 'International', 'دولي'),
    date: '2025',
    image: baseImages.tashkent,
    content: L(
      '<p>Өзбекстан Республикасында өткен конференция Қараханилер дәуірінің тарихи және мәдени мұрасын зерттеуге арналды. Институт өкілінің қатысуы халықаралық ғылыми байланыстарды нығайтты.</p>',
      '<p>Конференция в Республике Узбекистан была посвящена историческому и культурному наследию эпохи Караханидов. Участие представителя института укрепило международные научные связи.</p>',
      '<p>The conference in Uzbekistan focused on the historical and cultural heritage of the Karakhanid era. The institute’s participation strengthened international academic ties.</p>',
      '<p>خصص المؤتمر في جمهورية أوزبكستان للتراث التاريخي والثقافي لعصر القراخانيين، وأسهمت مشاركة المعهد في تعزيز العلاقات العلمية الدولية.</p>'
    ),
  },
  {
    id: 'graduate-employment',
    title: L('Түлектердің жұмысқа орналасуы', 'Трудоустройство выпускников', 'Graduate employment', 'توظيف الخريجين'),
    excerpt: L(
      '«Ислам ілімдері» бағыты бойынша 14 түлек толық жұмысқа орналасқан, ал «Құран ижаза» бағыты бойынша түлектер имамдық, ұстаздық және білімін жалғастыру жолдарында.',
      '14 выпускников направления «Исламские науки» полностью трудоустроены, а выпускники «Коран ижаза» работают имамами, преподавателями и продолжают обучение.',
      'Fourteen Islamic Sciences graduates are fully employed, while Quran Ijazah graduates serve as imams, teachers, and continue advanced study.',
      'توظف 14 خريجا من مسار العلوم الإسلامية، ويعمل خريجو إجازة القرآن في الإمامة والتعليم أو يواصلون الدراسة.'
    ),
    category: L('Түлектер', 'Выпускники', 'Graduates', 'الخريجون'),
    date: '2025',
    image: baseImages.graduates,
    content: L(
      '<p>2025 жылғы дерек бойынша «Ислам ілімдері» бағытының 14 түлегі түгел жұмысқа орналасқан: 9 түлек бас имам, наиб имам немесе имам, 4 түлек оқытушы, 1 түлек маман қызметінде. «Құран ижаза» бағыты бойынша 36 түлек бар.</p>',
      '<p>По данным 2025 года все 14 выпускников направления «Исламские науки» трудоустроены: 9 работают главными имамами, наиб имамами или имамами, 4 - преподавателями, 1 - специалистом. По направлению «Коран ижаза» 36 выпускников.</p>',
      '<p>As of 2025, all 14 Islamic Sciences graduates are employed: 9 serve as chief imams, naib imams or imams, 4 teach, and 1 works as a specialist. The Quran Ijazah track has 36 graduates.</p>',
      '<p>بحسب بيانات 2025 توظف جميع خريجي مسار العلوم الإسلامية وعددهم 14: يعمل 9 أئمة أو نواب أئمة، و4 مدرسين، و1 متخصصا. ولدى مسار إجازة القرآن 36 خريجا.</p>'
    ),
  },
];

const partners = [
  {
    id: 'dumk',
    type: L('Құрылтайшы бастама', 'Учредительная инициатива', 'Founding initiative', 'المبادرة المؤسسة'),
    name: L('Қазақстан мұсылмандары діни басқармасы', 'Духовное управление мусульман Казахстана', 'Spiritual Administration of Muslims of Kazakhstan', 'الإدارة الدينية لمسلمي كازاخستان'),
    location: L('Қазақстан', 'Казахстан', 'Kazakhstan', 'كازاخستان'),
    url: 'https://www.muftiyat.kz/kk/',
    description: L('Институт ҚМДБ бастамасымен құрылған және діни-ағартушылық қызметті осы ортада жүзеге асырады.', 'Институт создан по инициативе ДУМК и ведет духовно-просветительскую работу в этой системе.', 'The institute was founded by DUMK and carries out public religious education in this institutional framework.', 'تأسس المعهد بمبادرة الإدارة الدينية ويعمل في إطار الخدمة الدينية والتعليمية.'),
  },
  {
    id: 'nur-mubarak',
    type: L('Ғылыми байланыс', 'Научная связь', 'Academic relation', 'علاقة علمية'),
    name: L('Нұр-Мүбарак Египет ислам мәдениеті университеті', 'Египетский университет исламской культуры Нур-Мубарак', 'Nur-Mubarak Egyptian University of Islamic Culture', 'جامعة نور مبارك المصرية للثقافة الإسلامية'),
    location: L('Алматы', 'Алматы', 'Almaty', 'ألماتي'),
    url: 'https://www.nmu.edu.kz/',
    description: L('Халықаралық семинарлар мен ғылыми кездесулер аясындағы серіктес орта.', 'Партнерская академическая среда международных семинаров и научных встреч.', 'A partner academic environment for international seminars and scholarly meetings.', 'بيئة أكاديمية شريكة للندوات الدولية واللقاءات العلمية.'),
  },
  {
    id: 'ircica',
    type: L('Халықаралық ұйым', 'Международная организация', 'International organization', 'منظمة دولية'),
    name: 'IRCICA',
    location: L('Халықаралық', 'Международно', 'International', 'دولي'),
    url: 'https://www.ircica.org/ircica',
    description: L('Ислам мәдениеті мен қолжазба мұрасын зерттеу бағытындағы халықаралық ғылыми байланыс.', 'Международная научная связь в области исламской культуры и рукописного наследия.', 'International scholarly cooperation in Islamic culture and manuscript heritage.', 'تعاون علمي دولي في الثقافة الإسلامية وتراث المخطوطات.'),
  },
  {
    id: 'al-azhar',
    type: L('Шетелдік мамандар', 'Зарубежные специалисты', 'International faculty', 'أساتذة دوليون'),
    name: L('Әл-Азһар университеті', 'Университет Аль-Азхар', 'Al-Azhar University', 'جامعة الأزهر'),
    location: L('Мысыр', 'Египет', 'Egypt', 'مصر'),
    url: 'https://azu.edu.eg/',
    description: L('Мысырдан шақырылған мамандар институттағы ислам ілімдері және араб тілі бағытын күшейтеді.', 'Приглашенные из Египта специалисты усиливают направления исламских наук и арабского языка.', 'Specialists invited from Egypt strengthen Islamic sciences and Arabic language instruction.', 'يسهم متخصصون من مصر في تقوية العلوم الإسلامية واللغة العربية في المعهد.'),
  },
  {
    id: 'haseki',
    type: L('Шетелдік тәжірибе', 'Зарубежный опыт', 'International expertise', 'خبرة دولية'),
    name: L('Хасеки академиясы', 'Академия Хасеки', 'Haseki Academy', 'أكاديمية حاسكي'),
    location: L('Түркия', 'Турция', 'Türkiye', 'تركيا'),
    url: 'https://istanbulihtisas.diyanet.gov.tr/',
    description: L('Түркиядағы исламтану тәжірибесі институттың оқу және ғылыми ортасын толықтырады.', 'Опыт исламского образования Турции дополняет учебную и научную среду института.', 'Türkiye’s Islamic studies experience complements the institute’s academic environment.', 'تضيف خبرة التعليم الإسلامي في تركيا إلى البيئة العلمية للمعهد.'),
  },
];

const galleryBase = [
  ['Институт ғимараты', 'Здание института', 'Institute building', 'مبنى المعهد', 'Campus', baseImages.campusSign],
  ['Кампус ауласы', 'Двор кампуса', 'Campus yard', 'ساحة الحرم', 'Campus', baseImages.campus],
  ['Оқу аудиториясы', 'Учебная аудитория', 'Classroom', 'قاعة الدراسة', 'Learning', baseImages.classroom],
  ['Студенттік сабақ', 'Занятие студентов', 'Student class', 'درس الطلاب', 'Learning', baseImages.students],
  ['Кітапхана', 'Библиотека', 'Library', 'المكتبة', 'Learning', baseImages.about],
  ['Жатақхана', 'Общежитие', 'Dormitory', 'السكن', 'Campus', baseImages.dormitory],
  ['Ғылыми кездесу', 'Научная встреча', 'Scholarly meeting', 'لقاء علمي', 'Event', baseImages.seminar],
  ['Рухани дәріс', 'Духовная лекция', 'Spiritual lecture', 'محاضرة روحية', 'Event', baseImages.mufti],
  ['Студенттер тобы', 'Группа студентов', 'Student group', 'مجموعة الطلاب', 'Students', baseImages.studyGroup],
  ['Құран конкурсы', 'Конкурс Корана', 'Quran competition', 'مسابقة القرآن', 'Event', baseImages.quranContest],
  ['Жүлде сәті', 'Момент награждения', 'Award moment', 'لحظة التكريم', 'Event', baseImages.quranAward],
  ['Халықаралық семинар', 'Международный семинар', 'International seminar', 'ندوة دولية', 'Event', baseImages.international],
  ['Ташкент конференциясы', 'Конференция в Ташкенте', 'Tashkent conference', 'مؤتمر طشقند', 'Event', baseImages.tashkent],
  ['Директор', 'Директор', 'Director', 'المدير', 'Teachers', '/institute/faculty-bagdat.jpg'],
  ['Құран ұстазы', 'Преподаватель Корана', 'Quran teacher', 'مدرس القرآن', 'Teachers', '/institute/faculty-temirzhan.jpg'],
  ['Араб тілі маманы', 'Специалист арабского языка', 'Arabic specialist', 'متخصص العربية', 'Teachers', '/institute/faculty-sabri.jpg'],
];

const categoryMap = {
  kz: { Campus: 'Кампус', Learning: 'Оқу', Event: 'Іс-шара', Teachers: 'Ұстаздар', Students: 'Студенттер' },
  ru: { Campus: 'Кампус', Learning: 'Обучение', Event: 'Событие', Teachers: 'Преподаватели', Students: 'Студенты' },
  en: { Campus: 'Campus', Learning: 'Learning', Event: 'Event', Teachers: 'Faculty', Students: 'Students' },
  ar: { Campus: 'الحرم', Learning: 'التعليم', Event: 'حدث', Teachers: 'المدرسون', Students: 'الطلاب' },
};

export const getInstituteContent = (language = 'kz') => {
  const lang = localized[language] ? language : 'kz';
  const nameIndex = { kz: 0, ru: 1, en: 2, ar: 3 }[lang];

  let localOverrides = [];
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem('syganaki-siteTexts');
      if (raw) {
        localOverrides = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to parse local overrides in getInstituteContent', e);
    }
  }

  const overrides = {};
  localOverrides
    .filter((item) => item.language === lang)
    .forEach((item) => {
      overrides[item.key] = item.value;
    });

  const baseContent = {
    ...localized[lang],
  };

  // Dynamic overrides for simple text strings
  if (overrides['home.heroTitle']) baseContent.heroTitle = overrides['home.heroTitle'];
  if (overrides['home.heroSubtitle']) baseContent.heroSubtitle = overrides['home.heroSubtitle'];
  if (overrides['home.heroButton']) baseContent.heroButton = overrides['home.heroButton'];

  if (overrides['about.text']) baseContent.aboutText = overrides['about.text'];
  if (overrides['about.mission']) baseContent.mission = overrides['about.mission'];
  
  if (overrides['about.values']) {
    baseContent.aboutPoints = overrides['about.values']
      .split('\n')
      .map((line) => {
        const idx = line.indexOf(':');
        if (idx !== -1) {
          return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
        }
        return [line.trim(), ''];
      })
      .filter((p) => p[0]);
  }

  const parseBlocks = (key) => {
    try {
      return overrides[key] ? JSON.parse(overrides[key]) : [];
    } catch {
      return [];
    }
  };

  const customBlocks = {
    home: parseBlocks('home.customBlocks'),
    about: parseBlocks('about.customBlocks'),
    admission: parseBlocks('admission.customBlocks'),
    contacts: parseBlocks('contacts.customBlocks'),
    footer: parseBlocks('footer.customBlocks'),
  };

  const localizedPrograms = programs.map((program) => localizeObject(program, lang));
  const localizedTeachers = teachers.map((teacher) => ({
    ...localizeObject(teacher, lang),
    category: categoryNames[lang][teacher.categoryKey],
    categoryKey: teacher.categoryKey,
  }));
  const localizedNews = news.map((item) => localizeObject(item, lang));
  const localizedPartners = partners.map((partner) => localizeObject(partner, lang));

  return {
    ...baseContent,
    customBlocks,
    baseImages,
    programs: localizedPrograms,
    teachers: localizedTeachers,
    teacherGroups: ['administration', 'quran', 'islamic', 'languages'].map((key) => ({
      id: key,
      title: categoryNames[lang][key],
      teachers: localizedTeachers.filter((teacher) => teacher.categoryKey === key),
    })),
    news: localizedNews,
    events: localizedNews.map((item) => [item.title, item.excerpt, item.image]),
    partners: localizedPartners,
    gallery: galleryBase.map(([kz, ru, en, ar, categoryKey, image], index) => ({
      id: `gallery-${index + 1}`,
      title: [kz, ru, en, ar][nameIndex],
      category: categoryMap[lang][categoryKey],
      image,
    })),
    knowledgeBase: [
      ...localizedPrograms.map((program) => ({
        topic: program.title,
        answer: `${program.title}: ${program.duration}. ${program.desc}`,
        tags: [program.title, program.duration, program.format, ...(program.subjects || []), ...(program.outcomes || [])],
      })),
      {
        topic: localized[lang].aboutEyebrow,
        answer: localized[lang].aboutText,
        tags: [localized[lang].mission, localized[lang].legalText, ...localized[lang].aboutPoints.flat()],
      },
      {
        topic: localized[lang].teacherEyebrow,
        answer: localized[lang].teacherText,
        tags: localizedTeachers.flatMap((teacher) => [teacher.name, teacher.role, teacher.category, teacher.country]),
      },
      {
        topic: localized[lang].graduatesEyebrow,
        answer: localized[lang].graduatesText,
        tags: ['graduates', 'employment', 'түлек', 'выпускник', 'خريج'],
      },
    ],
  };
};
