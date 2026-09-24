import { Activity } from "@/types";
import { ARABIC_LANGUAGE_BANK } from "../questions/arabic-language-questions";

export const ARABIC_ACTIVITIES: Activity[] = [
  // 1. ARABIC LANGUAGE WIT (Flagship Playable - 15 Questions Pool)
  {
    id: "act-arabic-linguistic-wit",
    slug: "arabic-linguistic-wit",
    titleAr: "فرسان الضاد (نباهة لغوية)",
    titleEn: "Knights of Arabic Language",
    taglineAr: "تحديات ممتعة في معاني الكلمات، الأضداد، الجموع، وأسرار الفصاحة!",
    descriptionAr: "لعبة لغوية حماسية تتجاوز النمط المدرسي إلى ألعاب ذكاء وبديهة لغوية وسرعة استيعاب مع شرح ثري وممتع.",
    category: "QUIZ",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 3,
    maxPlayers: 100,
    duration: 10,
    energy: "high",
    goal: "learning",
    type: "QUICK_QUIZ",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "Feather",
    accentColor: "#D97706",
    languageContent: true,
    educationContent: true,
    tags: ["arabic", "language", "vocabulary", "eloquence", "proverbs"],
    whyRecommended: "يثبت جمال اللغة العربية وغناها بأسلوب تنافسي عصري مليء بالإثارة والمتعة.",
    instructions: {
      overviewAr: "تظهر الكلمة الفصيحة أو اللغز اللغوي مع 4 خيارات ملونة ومؤقت سريع.",
      hostAr: [
        "شجع التنافس واقرأ المعنى البلاغي الفصيح بعد كل جولة.",
        "علق على دقة الفروق اللغوية التي تبهر المشاركين."
      ],
      participantAr: [
        "اختر الإجابة اللغوية الدقيقة بأسرع ما يمكنك لحصد نقاط الصدارة!"
      ]
    },
    rounds: ARABIC_LANGUAGE_BANK.map((a, idx) => ({
      id: `arab-r-${idx + 1}`,
      roundNumber: idx + 1,
      promptAr: a.promptAr,
      subtitleAr: a.subtitleAr,
      optionsAr: a.optionsAr,
      correctAnswer: a.correctAnswer,
      timeLimit: a.timeLimit,
    }))
  },

  // 2. ARABIC PROVERBS & IDIOMS (Interactive Proverbs Challenge)
  {
    id: "act-arabic-proverbs",
    slug: "arabic-proverbs",
    titleAr: "أمثال وحِكَم (أكمل المثل)",
    titleEn: "Arabic Proverbs & Wisdom",
    taglineAr: "أمثال سائرة وقصص طريفة خلف المقولات التراثية الشهيرة!",
    descriptionAr: "مسابقة تكمل فيها الأمثال العربية الشهيرة وتكتشف القصة التاريخية العجيبة والمضحكة التي كانت سبباً في ولادة هذا المثل.",
    category: "QUIZ",
    audience: "adults",
    minAge: 13,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 80,
    duration: 8,
    energy: "medium",
    goal: "learning",
    type: "QUICK_QUIZ",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "Quote",
    accentColor: "#B45309",
    languageContent: true,
    educationContent: true,
    tags: ["arabic", "proverbs", "culture", "heritage", "wisdom"],
    whyRecommended: "أمثال شعبية وفصيحة مع قصص أصلها الطريفة التي تثير الضحك والمعرفة معاً.",
    instructions: {
      overviewAr: "يظهر شطر المثل الأول، ويختار المتسابق التكملة الدقيقة مع الكشف عن قصة المثل.",
      hostAr: ["اقرأ قصة المثل باقتضاب وتشويق لإمتاع الحاضرين."],
      participantAr: ["تذكر ما تسمعه من كبار السن واختر التكملة الأصيلة!"]
    },
    rounds: [
      {
        id: "prov-1",
        roundNumber: 1,
        promptAr: "أكمل المثل العربي الشهير: 'عادت ريما إلى ...'",
        optionsAr: ["عادتها القديمة", "بيتها الآمن", "طريقها الأول", "صديقاتها"],
        correctAnswer: 0,
        timeLimit: 12,
      },
      {
        id: "prov-2",
        roundNumber: 2,
        promptAr: "ما معنى المثل القائل: 'وافق شَنٌّ طَبَقَة'؟",
        optionsAr: [
          "توافق شخصان في الطباع والذكاء تماماً",
          "سقط الإناء على غطائه",
          "فشل في إيجاد حل للمشكلة",
          "اختلفا في كل شيء"
        ],
        correctAnswer: 0,
        timeLimit: 15,
      },
      {
        id: "prov-3",
        roundNumber: 3,
        promptAr: "أكمل المثل البليغ: 'لكل جوادٍ ... ولكل عالمٍ ...'",
        optionsAr: ["كبوة / هفوة", "وقفة / صمت", "سرعة / فكرة", "فارس / حجة"],
        correctAnswer: 0,
        timeLimit: 12,
      }
    ]
  },

  // 3. RARE PLURALS (Singular & Plural Wit)
  {
    id: "act-rare-plurals",
    slug: "rare-plurals",
    titleAr: "تحدي الجموع النادرة",
    titleEn: "Arabic Rare Plurals Challenge",
    taglineAr: "ما جمع: حليب، إمبراطور، عندليب، وسكر؟ هل تجرؤ على التخمين؟",
    descriptionAr: "لعبة لغوية فكاهية وغزيرة بالمعرفة. يتفاجأ الجميع بجموع الكلمات التي نستخدمها يومياً عندما تصطدم بقواعد الصرف الأصيلة في المعاجم.",
    category: "QUIZ",
    audience: "adults",
    minAge: 13,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 60,
    duration: 8,
    energy: "high",
    goal: "laughter",
    type: "QUICK_QUIZ",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "Copy",
    accentColor: "#C2410C",
    languageContent: true,
    educationContent: true,
    tags: ["arabic", "plurals", "grammar", "wit", "vocabulary"],
    whyRecommended: "تحدي يجمع بين الضحك الشديد على الخيارات الغريبة والمعرفة اللغوية العميقة.",
    instructions: {
      overviewAr: "تظهر المفردة ويصوت المتسابقون على الجمع الفصيح المعتمد في المعاجم.",
      hostAr: ["علق على غرابة بعض الجموع الفصيحة التي لا تخطر على البال."],
      participantAr: ["فكر في أوزان الجموع (أفعال، فعالل، فواعل) واختر بذكاء!"]
    },
    rounds: [
      {
        id: "plur-1",
        roundNumber: 1,
        promptAr: "ما هو الجمع الفصيح لكلمة 'عُقَاب' (الطائر الجارح المعروف)؟",
        optionsAr: ["عِقْبَان وأَعْقُب", "عُقَابَات", "عَقَاقِيب", "عُقَبَاء"],
        correctAnswer: 0,
        timeLimit: 15,
      },
      {
        id: "plur-2",
        roundNumber: 2,
        promptAr: "ما جمع كلمة 'دُنْيَا' في اللغة العربية الفصحى؟",
        optionsAr: ["دُنَى ودُنْيَيَات", "دَنَايَا", "دُنَيَات", "أَدْنَاء"],
        correctAnswer: 0,
        timeLimit: 15,
      },
      {
        id: "plur-3",
        roundNumber: 3,
        promptAr: "ما جمع كلمة 'كَوْكَب'؟",
        optionsAr: ["كَوَاكِب", "أَكْوَاب", "كَوْكَبَات", "كُوَيْكِبَات"],
        correctAnswer: 0,
        timeLimit: 10,
      }
    ]
  },

  // 4. OPPOSITES & SYNONYMS SPEED (Rapid Word Duels)
  {
    id: "act-opposites-speed",
    slug: "opposites-speed",
    titleAr: "حرب الأضداد والترادف",
    titleEn: "Opposites & Synonyms Duel",
    taglineAr: "عكس الكلمة وترادفها في 10 ثوانٍ.. سرعة البديهة هي الحاكمة!",
    descriptionAr: "مواجهة سريعة وخفيفة تقيس المخزون اللفظي للمتسابقين عبر المطابقة السريعة للكلمات وأضدادها.",
    category: "ENERGY",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 80,
    duration: 5,
    energy: "high",
    goal: "energizer",
    type: "RAPID_FIRE",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "ArrowLeftRight",
    accentColor: "#D97706",
    languageContent: true,
    tags: ["arabic", "opposites", "synonyms", "speed", "energy"],
    whyRecommended: "سريع وخاطف يوقظ الذهن وينعش الحصيلة اللغوية.",
    instructions: {
      overviewAr: "كلمة خاطفة على الشاشة وعليك اختيار نقيضها المباشر قبل انتهاء الثواني العشر.",
      hostAr: ["ألهب الحماس بالمؤقت الصوتي."],
      participantAr: ["لا تتردد، انقر النقيض الصحيح فوراً!"]
    },
    rounds: [
      {
        id: "opp-1",
        roundNumber: 1,
        promptAr: "ما هو نقيض كلمة 'الجَبَان' في الشجاعة والبسالة؟",
        optionsAr: ["المِقْدَام (الباسل)", "المُسَالِم", "المُحْتَرِس", "المُتَرَيِّث"],
        correctAnswer: 0,
        timeLimit: 10,
      },
      {
        id: "opp-2",
        roundNumber: 2,
        promptAr: "ما هو مرادف كلمة 'الغِبْطَة' في المشاعر النفسية؟",
        optionsAr: ["الفَرَح والسُّرُور وتمني الخير", "الحَسَد والحِقْد", "الحُزْن والأسى", "الخَوْف والقَلَق"],
        correctAnswer: 0,
        timeLimit: 10,
      }
    ]
  },

  // 5. WORD ARTISAN (Arabic Riddles & Puzzles - Facilitator)
  {
    id: "act-word-artisan",
    slug: "word-artisan",
    titleAr: "ألغاز وأسرار الضاد",
    titleEn: "Arabic Riddles & Secrets",
    taglineAr: "ألغاز شعرية ولغوية ذكية تكشف أسرار لغة الضاد!",
    descriptionAr: "جلسة ترفيه فكري ممتعة يطرح فيها الميسر ألغازاً لغوية طريفة (كلمات تقرأ من الجهتين، أبيات شعرية عجيبة، وألغاز نحوية).",
    category: "DISCUSSION",
    audience: "adults",
    minAge: 14,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 50,
    duration: 10,
    energy: "medium",
    goal: "discussion",
    type: "DISCUSSION_STARTER",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Puzzle",
    accentColor: "#92400E",
    languageContent: true,
    educationContent: true,
    tags: ["arabic", "riddles", "poetry", "eloquence", "puzzle"],
    whyRecommended: "يفتح نقاشاً ذكياً مليئاً بالانبهار والإعجاب بعبقرية اللغة العربية والشعر العربي.",
    instructions: {
      overviewAr: "يعرض اللغز الشعري أو اللغوي على الشاشة، وتتنافس المجموعات في كشف سره.",
      hostAr: ["أعطِ تلميحاً ذكياً إن تأخرت الفرق في الوصول للحل."],
      participantAr: ["دقق في حروف الكلمات وترتيبها وتشكيلها!"]
    },
    rounds: [
      {
        id: "ridd-1",
        roundNumber: 1,
        promptAr: "لغز لغوي: ما هي الكلمة العربية الشهيرة التي تقرأ من اليمين إلى اليسار كما تقرأ من اليسار إلى اليمين وتطير في الهواء؟",
        subtitleAr: "فكر في الطيور والأجسام الطائرة!",
        optionsAr: ["خَوْخ أو تُوت أو طَيْس", "عُصْفُور", "طَائِرَة", "سَمَاء"],
        correctAnswer: 0,
        timeLimit: 60,
      }
    ]
  }
];
