import { Activity } from "@/types";
import { randomizeRoundOptions } from "@/lib/utils";
import { ADULT_ACTIVITIES } from "./activities/adult-activities";
import { ISLAMIC_ACTIVITIES } from "./activities/islamic-activities";
import { ARABIC_ACTIVITIES } from "./activities/arabic-activities";
import { KIDS_ACTIVITIES } from "./activities/kids-activities";

const BASE_ACTIVITIES: Activity[] = [
  // ==========================================
  // PLAYABLE FLAGSHIPS & ADULT ACTIVITIES (30+)
  // ==========================================
  {
    id: "act-this-or-that",
    slug: "this-or-that",
    titleAr: "اختر بسرعة (هذا أو ذاك)",
    titleEn: "This or That",
    taglineAr: "خياران حاسمان بدون تفكير طويل.. تكشف ميول المجموعة!",
    descriptionAr: "نشاط ديناميكي سريع يعرض خيارين متناقضين. يصوت كل مشارك فوراً من هاتفه وتظهر النتائج بنسب حية وتوزيع بصري ممتع.",
    category: "ICEBREAKER",
    audience: "adults",
    minAge: 13,
    maxAge: 99,
    minPlayers: 3,
    maxPlayers: 100,
    duration: 5,
    energy: "high",
    goal: "silence_breaker",
    type: "THIS_OR_THAT",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Split",
    accentColor: "#FF5722",
    whyRecommended: "مثالي لكسر الجمود فوراً وبدء التفاعل الجماعي بدون أي حاجة لتحضير مسبق.",
    instructions: {
      overviewAr: "تظهر شاشة السؤال خيارين كبيرين. يصوت كل مشارك بنقرة واحدة، لتظهر الإحصائيات الحية لحظياً.",
      hostAr: [
        "أطلق النشاط واعرض الشاشة للمجموعة.",
        "علق على تباين إجابات المشاركين بعد كل جولة لإشعال النقاش.",
        "اضغط 'التالي' للمرور للجولة التالية."
      ],
      participantAr: [
        "انظر لشاشة هاتفك واختر الخيار الأقرب لشخصيتك.",
        "شاهد أين يقف باقي زملائك على الشاشة الكبيرة!"
      ]
    },
    rounds: [
      {
        id: "tot-1",
        roundNumber: 1,
        promptAr: "لو خيـروك الآن لقضاء إجازة أسبوع كامل:",
        subtitleAr: "ما الذي تختاره بدون تردد؟",
        optionsAr: ["شاطئ هادئ بلا هاتف 🏖️", "مدينة صاخبة مليئة بالمغامرات 🏙️"],
        timeLimit: 15
      },
      {
        id: "tot-2",
        roundNumber: 2,
        promptAr: "طريقة عملك الأكثر إنتاجية وإبداعاً:",
        subtitleAr: "كيف يتدفق تركيزك الحقيقي؟",
        optionsAr: ["الاستيقاظ فجراً مع الهدوء 🌅", "سهر الليل والتركيز مع القمر 🌙"],
        timeLimit: 15
      },
      {
        id: "tot-3",
        roundNumber: 3,
        promptAr: "في اجتماع العمل أو الورشة:",
        subtitleAr: "موقفك الطبيعي المفضل:",
        optionsAr: ["التحدث ومشاركة الرأي فوراً 🎙️", "الاستماع والتدوين ثم التعقيب 📝"],
        timeLimit: 15
      },
      {
        id: "tot-4",
        roundNumber: 4,
        promptAr: "المشروب الرسمي لبدء يومك وإشعال طاقتك:",
        subtitleAr: "لا يوم بدونه!",
        optionsAr: ["قهوة سوداء مركزة ☕", "شاي منعش بالنعناع 🍵"],
        timeLimit: 12
      },
      {
        id: "tot-5",
        roundNumber: 5,
        promptAr: "قدرتك الخارقة التي تتمناها ليوم واحد:",
        subtitleAr: "اختيار المصير:",
        optionsAr: ["قراءة أفكار الآخرين 🧠", "السفر عبر الزمن واللحظات ⏳"],
        timeLimit: 15
      }
    ]
  },
  {
    id: "act-quick-quiz",
    slug: "quick-quiz",
    titleAr: "تحدي النباهة السريع",
    titleEn: "Quick Quiz Spark",
    taglineAr: "أسئلة ذكية وخفيفة الظل تختبر سرعة البديهة ونباهة الفريق!",
    descriptionAr: "مسابقة تفاعلية بـ 4 خيارات ملونة. كلما كانت إجابتك أسرع وصحيحة، كلما جمعت نقاطاً أعلى وصعدت في لوحة الصدارة!",
    category: "QUIZ",
    audience: "adults",
    minAge: 13,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 100,
    duration: 7,
    energy: "high",
    goal: "competition",
    type: "QUICK_QUIZ",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "HelpCircle",
    accentColor: "#6366F1",
    whyRecommended: "ممتاز لإشعال الحماس التنافسي والضحك بين أعضاء الفريق بسرعة فائقة.",
    instructions: {
      overviewAr: "4 خيارات ملونة تظهر على شاشة الهاتف. انقر على الإجابة الصحيحة قبل انتهاء العداد.",
      hostAr: [
        "شجع المشاركين على السرعة لأن الترتيب يعتمد على أجزاء من الثانية!",
        "استعرض لوحة الصدارة بحماس بين الجولات."
      ],
      participantAr: [
        "طابق لون أو نص الإجابة واضغط فوراً قبل نفاد الوقت."
      ]
    },
    rounds: [
      {
        id: "qq-1",
        roundNumber: 1,
        promptAr: "ما هو الشيء الذي كلما أخذت منه كَبُر وزاد حجمه؟",
        optionsAr: ["الحفرة", "العمر", "المعرفة", "المال"],
        correctAnswer: 0,
        timeLimit: 15
      },
      {
        id: "qq-2",
        roundNumber: 2,
        promptAr: "كم ثانية في اليوم الكامل (24 ساعة)؟",
        optionsAr: ["86,400 ثانية", "43,200 ثانية", "100,000 ثانية", "64,800 ثانية"],
        correctAnswer: 0,
        timeLimit: 15
      },
      {
        id: "qq-3",
        roundNumber: 3,
        promptAr: "أي من هذه الكواكب هو الأقرب للشمس فعلياً؟",
        optionsAr: ["عطارد", "الزهرة", "المريخ", "الأرض"],
        correctAnswer: 0,
        timeLimit: 12
      },
      {
        id: "qq-4",
        roundNumber: 4,
        promptAr: "يسير بلا أرجل، ويبكي بلا عيون.. فما هو؟",
        optionsAr: ["السحاب ☁️", "النهر 🌊", "الريح 💨", "الظل 👤"],
        correctAnswer: 0,
        timeLimit: 15
      }
    ]
  },
  {
    id: "act-word-cloud",
    slug: "word-cloud",
    titleAr: "سحابة المشاعر والأفكار",
    titleEn: "Live Word Cloud",
    taglineAr: "اكتب كلمة واحدة تصف حالتك الآن.. وشاهد كيف تلتقي أرواح المجموعة!",
    descriptionAr: "يرسل كل مشارك كلمة أو تعبير قصير من هاتفه، فتتجمع الكلمات في شاشة حية تكبر فيها الكلمات الأكثر تكراراً بشكل بصري ساحر.",
    category: "CREATIVE",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 5,
    maxPlayers: 200,
    duration: 5,
    energy: "medium",
    goal: "icebreaker",
    type: "WORD_CLOUD",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Cloud",
    accentColor: "#06B6D4",
    whyRecommended: "أفضل طريقة لقراءة نبض ومزاج الحضور في افتتاح المؤتمرات وورش العمل.",
    instructions: {
      overviewAr: "كل شخص يرسل كلمة واحدة أو كلمتين تعبر عن السؤال المطروح.",
      hostAr: [
        "اطرح السؤال وانتظر ظهور الكلمات على الشاشة الرئيسية.",
        "علق على الكلمات الأبرز واسأل أصحابها عن سبب اختيارها بلطف."
      ],
      participantAr: [
        "اكتب كلمة واحدة دقيقة تمثلك بصدق ثم اضغط إرسال."
      ]
    },
    rounds: [
      {
        id: "wc-1",
        roundNumber: 1,
        promptAr: "بكلمة واحدة فقط: كيف تصف طاقتك وشعورك في هذه اللحظة؟",
        subtitleAr: "اكتب ما يخطر ببالك الآن مباشرة وبصدق",
        timeLimit: 30
      },
      {
        id: "wc-2",
        roundNumber: 2,
        promptAr: "ما هو الشيء الذي تحتاجه المجموعة الآن لتكون جلستنا استثنائية؟",
        subtitleAr: "كلمة واحدة تختصر تطلعاتك",
        timeLimit: 30
      }
    ]
  },
  {
    id: "act-would-you-rather",
    slug: "would-you-rather",
    titleAr: "ماذا تفضل؟ (المعضلة المستحيلة)",
    titleEn: "Would You Rather",
    taglineAr: "مواقف طريفة ومحرجة تضعك أمام أصعب القرارات النفسية والكوميدية!",
    descriptionAr: "معضلات خيالية ذكية تجبر الجميع على اتخاذ موقف لا خيار ثالث فيه، تتبعها موجات ضحك ونقاشات ممتعة.",
    category: "SOCIAL",
    audience: "adults",
    minAge: 13,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 80,
    duration: 6,
    energy: "high",
    goal: "laughter",
    type: "WOULD_YOU_RATHER",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Scale",
    accentColor: "#F43F5E",
    whyRecommended: "يضمن الضحك الفوري ويكشف جوانب غير متوقعة من شخصيات المشاركين.",
    instructions: {
      overviewAr: "خياران صعبان أو طريفان، اختر أحدهما ودافع عن موقفك أمام المجموعة.",
      hostAr: ["اطلب من شخص من كل فريق تبرير خياره لإشعال الأجواء الكوميدية."],
      participantAr: ["اختر أخف الضررين أو أطرف الخيارين على هاتفك!"]
    },
    rounds: [
      {
        id: "wyr-1",
        roundNumber: 1,
        promptAr: "ماذا تفضل لبقية حياتك؟",
        optionsAr: [
          "أن تتحدث بكل ما يدور في عقلك بصوت مسموع دائماً 📢",
          "ألا تتكلم أبداً وتتواصل فقط بالرسائل المكتوبة 📱"
        ],
        timeLimit: 20
      },
      {
        id: "wyr-2",
        roundNumber: 2,
        promptAr: "في بيئة العمل أو الدراسة:",
        optionsAr: [
          "مدير عبقري لكنه صارم جداً ولا يبتسم أبداً 👔",
          "مدير طيب ومرح جداً لكن مشاريعه دائماً متأخرة 😅"
        ],
        timeLimit: 20
      },
      {
        id: "wyr-3",
        roundNumber: 3,
        promptAr: "لو امتلكت أحدهما حصراً الآن:",
        optionsAr: [
          "إنترنت فائق السرعة مجاناً في أي مكان بالعالم 🌐",
          "طعامك المفضل مجاناً ولذيذ في أي وقت تشاء 🍕"
        ],
        timeLimit: 20
      }
    ]
  },
  {
    id: "act-two-truths-lie",
    slug: "two-truths-and-a-lie",
    titleAr: "حقيقتان وكذبة",
    titleEn: "Two Truths & A Lie",
    taglineAr: "ثلاث جمل.. اثنتان حقيقة وواحدة محض خيال! هل تستطيع كشف الكذبة؟",
    descriptionAr: "لعبة كلاسيكية شهيرة للتعارف العميق بين الزملاء، حيث يعرض كل مشارك ثلاث حقائق مذهلة عن نفسه والمجموعة تصوت لكشف الكذبة.",
    category: "SOCIAL",
    audience: "adults",
    minAge: 14,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 30,
    duration: 10,
    energy: "medium",
    goal: "icebreaker",
    type: "TWO_TRUTHS_AND_A_LIE",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "Eye",
    accentColor: "#8B5CF6",
    whyRecommended: "رائع للفرق الجديدة للتعرف على هوايات وخبرات بعضهم غير المتوقعة.",
    instructions: {
      overviewAr: "تقرأ المجموعة 3 عبارات، ويصوت كل لاعب للعبارة التي يعتقد أنها كذبة.",
      hostAr: ["اعرض العبارات، ثم كاشف الشخص صاحب العبارات لشرح القصة الحقيقية."],
      participantAr: ["حلل العبارات جيداً وصوت للكذبة المخادعة!"]
    },
    rounds: [
      {
        id: "ttl-1",
        roundNumber: 1,
        promptAr: "خمّن الكذبة في اعترافات الزميل (ليث):",
        statements: [
          { textAr: "عشت سنة كاملة في قرية نائية بدون أي إنترنت أو هاتف.", isLie: false },
          { textAr: "قفزت بالمظلة من طائرة على ارتفاع 12 ألف قدم.", isLie: false },
          { textAr: "أجيد العزف باحتراف على آلة القانون الموسيقية.", isLie: true }
        ],
        timeLimit: 25
      },
      {
        id: "ttl-2",
        roundNumber: 2,
        promptAr: "خمّن الكذبة في مغامرات الزميلة (سارة):",
        statements: [
          { textAr: "التقيت شخصياً برائد فضاء حقيقي وتحدثنا لمدة ساعة.", isLie: false },
          { textAr: "لدي فوبيا شديدة وغير مبررة من البالونات المنفوخة.", isLie: true },
          { textAr: "ألفت كتاباً قصصياً وأنا في سن الرابعة عشرة.", isLie: false }
        ],
        timeLimit: 25
      }
    ]
  },
  {
    id: "act-rapid-fire",
    slug: "rapid-fire",
    titleAr: "النار السريعة (Rapid Fire)",
    titleEn: "Rapid Fire",
    taglineAr: "ثوانٍ معدودة للإجابة قبل انفجار المؤقت.. لا وقت للتردد!",
    descriptionAr: "جولات سريعة ومثيرة للغاية تتطلب ردود فعل فورية، ترفع مستوى الأدرينالين والتركيز في الغرفة.",
    category: "ENERGY",
    audience: "adults",
    minAge: 13,
    maxAge: 99,
    minPlayers: 3,
    maxPlayers: 100,
    duration: 3,
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
    iconName: "Zap",
    accentColor: "#FF9800",
    whyRecommended: "أفضل منبه طبيعي لإنعاش المجموعة في منتصف اليوم التدريبي الطويل.",
    instructions: {
      overviewAr: "السؤال يظهر لمدة 8 ثوانٍ فقط، أجب قبل أن يغلق النظام باب التصويت.",
      hostAr: ["حمس المشاركين للسرعة وقراءة السؤال بلمح البصر."],
      participantAr: ["ركز أصابعك على الشاشة واختر الإجابة بلمسة واحدة."]
    },
    rounds: [
      {
        id: "rf-1",
        roundNumber: 1,
        promptAr: "7 × 8 = ؟",
        optionsAr: ["56", "54", "58", "62"],
        correctAnswer: 0,
        timeLimit: 8
      },
      {
        id: "rf-2",
        roundNumber: 2,
        promptAr: "ما هو الحرف العاشر في الحروف الأبجدية العربية؟",
        optionsAr: ["الراء (ر)", "الذال (ذ)", "الزاي (ز)", "الدال (د)"],
        correctAnswer: 0,
        timeLimit: 8
      },
      {
        id: "rf-3",
        roundNumber: 3,
        promptAr: "عاصمة كندا هي:",
        optionsAr: ["أوتاوا", "تورونتو", "فانكوفر", "مونتريال"],
        correctAnswer: 0,
        timeLimit: 8
      }
    ]
  },
  {
    id: "act-emoji-challenge",
    slug: "emoji-challenge",
    titleAr: "فك شفرة الإيموجي",
    titleEn: "Emoji Decoder",
    taglineAr: "رموز تعبيرية تخفي مثلاً شعبياً، فيلماً شهيراً، أو عادة يومية!",
    descriptionAr: "ألغاز ذكية مبنية على الإيموجي. يتنافس الجميع لتخمين المعنى الخفي وراء الرموز والضحك على التفسيرات الغريبة.",
    category: "CREATIVE",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 60,
    duration: 6,
    energy: "medium",
    goal: "creativity",
    type: "EMOJI_CHALLENGE",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "Smile",
    accentColor: "#10B981",
    whyRecommended: "تحدٍ بصري ممتع يربط بين الذكاء والفكاهة الرقمية الحديثة.",
    instructions: {
      overviewAr: "تأمل الرموز على الشاشة واكتب أو اختر المعنى الصحيح للأيقونات.",
      hostAr: ["اعرض الشفرة وشاهد تفاعل المجموعة قبل كشف الحل."],
      participantAr: ["فكر بالرمز بشكل مجازي واكتشف المعنى المقصود."]
    },
    rounds: [
      {
        id: "em-1",
        roundNumber: 1,
        promptAr: "فك شفرة هذا المثل الشعبي الشهير: 🚪 ➡️ 💨 🧱",
        optionsAr: [
          "الباب اللي يجيك منه ريح سده واستريح",
          "دق الحديد وهو حامي",
          "يا داخل بين البصلة وقشرتها",
          "لسانك حصانك إن صنته صانك"
        ],
        correctAnswer: 0,
        timeLimit: 20
      },
      {
        id: "em-2",
        roundNumber: 2,
        promptAr: "ما هذا المثل المعروف؟: 🐒 👀 🪞 🦌",
        optionsAr: [
          "القرد في عين أمه غزال",
          "عصفور باليد ولا عشرة على الشجرة",
          "من شبّ على شيء شاب عليه",
          "حبل الكذب قصير"
        ],
        correctAnswer: 0,
        timeLimit: 20
      }
    ]
  },
  {
    id: "act-memory-challenge",
    slug: "memory-challenge",
    titleAr: "قوة الملاحظة الخارقة",
    titleEn: "Memory & Focus Challenge",
    taglineAr: "شاهد العناصر لمدة 10 ثوانٍ، ثم اختبر قوة تركيزك وذاكرتك الصورية!",
    descriptionAr: "تعرض الشاشة مجموعة من العناصر والرموز لعدة ثوانٍ ثم تختفي فجأة. يُطرح بعدها سؤال دقيق لا يتذكره إلا صاحب الملاحظة الحادة.",
    category: "MEMORY",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 3,
    maxPlayers: 100,
    duration: 5,
    energy: "medium",
    goal: "competition",
    type: "MEMORY_CHALLENGE",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "Brain",
    accentColor: "#3B82F6",
    whyRecommended: "يوقظ التركيز العقلي الذهني ويحفز الانتباه في الفعاليات وورش العمل.",
    instructions: {
      overviewAr: "احفظ كل التفاصيل خلال وقت العرض، ثم أجب عن السؤال المفاجئ.",
      hostAr: ["نبه الجميع للنظر بتركيز للشاشة الرئيسية قبل بدء العد التنازلي."],
      participantAr: ["لا تشتت انتباهك.. تذكر الألوان والأشكال والأعداد بدقة."]
    },
    rounds: [
      {
        id: "mem-1",
        roundNumber: 1,
        promptAr: "احفظ العناصر المعروضة الآن (10 ثوانٍ): 🍎 🚗 🔑 📚 ☕ 🎧",
        subtitleAr: "ركز جيداً!",
        memoryItems: ["تفاحة حمراء", "سيارة زرقاء", "مفتاح ذهبي", "كتاب أخضر", "كوب قهوة", "سماعات"],
        optionsAr: [
          "المفتاح الذهبي 🔑",
          "الساعة اليدوية ⌚",
          "النظارة الشمسية 🕶️",
          "القلم الجاف 🖊️"
        ],
        correctAnswer: 0,
        timeLimit: 20
      }
    ]
  },
  // NON-PHONE FACILITATION ACTIVITIES (Core Advantage!)
  {
    id: "act-charades-silent",
    slug: "charades-silent",
    titleAr: "الشاريدز الصامت (بدون هواتف)",
    titleEn: "Silent Charades Guide",
    taglineAr: "ممنوع التحدث أو إصدار أي صوت! جسّد الفكرة بحركاتك ودع الباقين يخمنون.",
    descriptionAr: "نشاط حركي كلاسيكي موجه للميسر. يعرض شرارة الكلمة السرية للمتطوع على الشاشة بدون أن يراها البقية، ويبدأ المؤقت الحماسي لتخمين الكلمة.",
    category: "MOVEMENT",
    audience: "adults",
    minAge: 10,
    maxAge: 99,
    minPlayers: 6,
    maxPlayers: 50,
    duration: 10,
    energy: "high",
    goal: "laughter",
    type: "CHARADES",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: false,
    competitive: true,
    cooperative: true,
    isPlayable: true,
    iconName: "Activity",
    accentColor: "#EC4899",
    whyRecommended: "حل سحري إذا كانت الهواتف غير متاحة أو تريد حركة وضحكاً جماعياً في القاعة.",
    instructions: {
      overviewAr: "الميسر يتبع الخطوات الإرشادية على الشاشة ويدير التحدي الحركي بسهولة تامة.",
      hostAr: [
        "الخطوة 1: اختر متطوعاً واطلب منه الوقوف أمام المجموعة وظهره للشاشة.",
        "الخطوة 2: اضغط زر 'كشف الكلمة السرية' واجعل المتطوع فقط يقرأها.",
        "الخطوة 3: أطلق مؤقت الـ 60 ثانية ليقوم بالتمثيل الصامت.",
        "الخطوة 4: احسب النقطة للفريق الذي يخمن الكلمة أولاً."
      ],
      participantAr: [
        "راقب إيماءات وحركات زميلك واصرخ بالحل فور اكتشافه!"
      ],
      facilitatorSteps: [
        "اختر مشاركاً من الفريق الأول ليتقدم للمنصة.",
        "اضغط على زر الكشف لعرض الكلمة السرية للمشارك حصراً.",
        "ابدأ مؤقت الـ 60 ثانية.. يمنع الكلام أو الإشارة لأشياء ملموسة.",
        "سجل النقطة وأعطِ الدور للفريق المنافس."
      ]
    },
    rounds: [
      {
        id: "ch-1",
        roundNumber: 1,
        promptAr: "الكلمة السرية للتمثيل الحركي:",
        secretWordAr: "رائد فضاء ضل طريقه في انعدام الجاذبية 🧑‍🚀🌌",
        hintsAr: ["حركة بطيئة", "انعدام وزن", "خوذة"],
        timeLimit: 60
      },
      {
        id: "ch-2",
        roundNumber: 2,
        promptAr: "الكلمة السرية للتمثيل الحركي:",
        secretWordAr: "شخص يحاول نصب خيمة في رياح عاتية ⛺💨",
        hintsAr: ["رياح شديدة", "مقاومة الهواء", "أوتاد"],
        timeLimit: 60
      }
    ]
  },
  {
    id: "act-sixty-second-challenge",
    slug: "sixty-second-challenge",
    titleAr: "تحدي الـ 60 ثانية (تحدي المهام)",
    titleEn: "60-Second Blitz",
    taglineAr: "مهمة واحدة، دقيقة واحدة، وحماس يملأ الغرفة لتنفيذها قبل الصافرة!",
    descriptionAr: "تحديات تفاعلية ومهام حركية أو ذهنية موجهة للمجموعات، تكسر الرتابة في المؤتمرات واللقاءات الاجتماعية.",
    category: "ENERGY",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 100,
    duration: 5,
    energy: "high",
    goal: "energizer",
    type: "SIXTY_SEC_CHALLENGE",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: false,
    competitive: true,
    cooperative: true,
    isPlayable: true,
    iconName: "Timer",
    accentColor: "#F59E0B",
    whyRecommended: "مثالي لإنهاء الخمول الذهني وتحريك الأجسام في دقيقة واحدة حاسمة.",
    instructions: {
      overviewAr: "مهمة سريعة تظهر على الشاشة، يبدأ المؤقت لتنفيذها جماعياً أو فردياً.",
      hostAr: ["اقرأ المهمة بصوت مرتفع وأطلق المؤقت، وشجع الحضور على الصراخ بالعد التنازلي."],
      participantAr: ["تعاون مع زميلك لإنجاز المهمة بالكامل قبل انقضاء الـ 60 ثانية."]
    },
    rounds: [
      {
        id: "ssc-1",
        roundNumber: 1,
        promptAr: "تحدي الدقيقة: شكّل فريقاً من 3 أشخاص وابحثوا عن 5 أشياء زرقاء تماماً في القاعة وضعوها أمامكم!",
        timeLimit: 60
      },
      {
        id: "ssc-2",
        roundNumber: 2,
        promptAr: "تحدي الدقيقة: اكتب في ورقة 10 كلمات تبدأ بحرف (القاف) تنتهي جميعها بحرف (الميم)!",
        timeLimit: 60
      }
    ]
  },
  {
    id: "act-find-someone-who",
    slug: "find-someone-who",
    titleAr: "ابحث عن شخص في القاعة...",
    titleEn: "Find Someone Who",
    taglineAr: "تحرك في القاعة، تواصل مع الحضور، واكتشف من تنطبق عليه هذه الميزة الغريبة!",
    descriptionAr: "أقوى نشاط تعارف حركي شبكي (Networking). يطلب من كل شخص التحرك ومقابلة 3 أشخاص جدد للبحث عن ميزة معينة وتبادل الأحاديث السريعة.",
    category: "SOCIAL",
    audience: "adults",
    minAge: 14,
    maxAge: 99,
    minPlayers: 8,
    maxPlayers: 150,
    duration: 7,
    energy: "high",
    goal: "icebreaker",
    type: "FIND_SOMEONE_WHO",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Users",
    accentColor: "#14B8A6",
    whyRecommended: "يكسر الحواجز النفسية ويجبر المشاركين على مغادرة مقاعدهم ومصافحة الآخرين.",
    instructions: {
      overviewAr: "تظهر مواصفات معينة على الشاشة، ويجب على كل شخص التحرك فوراً للبحث عمن تنطبق عليه.",
      hostAr: ["اطلب من الجميع الوقوف من مقاعدهم والبدء في البحث والمصافحة."],
      participantAr: ["تحرك في القاعة واسأل الحضور حتى تجد الشخص المطلوب ثم قف معه!"]
    },
    rounds: [
      {
        id: "fsw-1",
        roundNumber: 1,
        promptAr: "المهمة الأولى: ابحث عن شخص في القاعة يسافر سنوياً لأكثر من 3 بلدان مختلفة، وتعرف على اسمه!",
        timeLimit: 90
      },
      {
        id: "fsw-2",
        roundNumber: 2,
        promptAr: "المهمة الثانية: ابحث عن شخص يمارس هواية غريبة (مثل ركوب الخيل، الغوص، أو تربية الطيور النادرة)!",
        timeLimit: 90
      }
    ]
  },
  {
    id: "act-desert-island",
    slug: "desert-island",
    titleAr: "الجزيرة المهجورة (معركة الأولويات)",
    titleEn: "Desert Island Dilemma",
    taglineAr: "سفينة تغرق ولن تأخذ معك إلا 3 أشياء فقط إلى الجزيرة.. ماذا تختار؟",
    descriptionAr: "تمرين تفاوضي وتفكير جماعي يثير نقاشاً فلسفياً واستراتيجياً ممتعاً حول معاني النجاة والرفاهية.",
    category: "DISCUSSION",
    audience: "adults",
    minAge: 13,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 50,
    duration: 10,
    energy: "medium",
    goal: "discussion",
    type: "DISCUSSION_STARTER",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Compass",
    accentColor: "#F97316",
    whyRecommended: "يكشف أولويات التفكير وطريقة اتخاذ القرارات تحت الضغط.",
    instructions: {
      overviewAr: "كل طاولة أو فريق يحدد اختياراته ويبرر سبب النجاة بها.",
      hostAr: ["قسم الحضور إلى مجموعات صغيرة ودعهم يناقشون اختياراتهم لمدة 3 دقائق."],
      participantAr: ["فكر بطريقة استراتيجية وشارك فريقك منطق اختيارك."]
    },
    rounds: [
      {
        id: "di-1",
        roundNumber: 1,
        promptAr: "لو سمح لك بحمل أداة واحدة فقط للبقاء على الجزيرة المهجورة لمدة شهر:",
        optionsAr: [
          "سكين حاد متعدد الاستخدامات 🔪",
          "طرد إسعافات أولية متكامل 🩹",
          "عدسة مكبرة وأداة إشعال نار 🔍🔥",
          "مرشح وفلتر لتنقية المياه العذبة 💧"
        ],
        timeLimit: 30
      }
    ]
  },

  // ==========================================
  // ADDITIONAL RICH ADULT ACTIVITIES (FULLY PLAYABLE WITH ROUNDS)
  // ==========================================
  {
    id: "act-first-impression",
    slug: "first-impression",
    titleAr: "أول انطباع",
    titleEn: "First Impression",
    taglineAr: "خمن ما هي الموهبة الأولى التي سيتوقعها الناس عنك بمجرد النظر!",
    descriptionAr: "نشاط فكاهي خفيف لتبديد الحرج وكشف كيف ينظر إلينا الآخرون بطريقة ودية.",
    category: "SOCIAL",
    audience: "adults",
    minAge: 14,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 40,
    duration: 8,
    energy: "medium",
    goal: "icebreaker",
    type: "THIS_OR_THAT",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Sparkles",
    accentColor: "#6366F1",
    whyRecommended: "يبدد الحرج فوراً ويكشف صورة الحضور لدى بعضهم بطريقة مرحة.",
    instructions: {
      overviewAr: "تظهر مواقف وتوقعات لطيفة، ويصوت الجميع لأقرب توقع يطابق الزميل.",
      hostAr: ["اعرض السؤال بلطف وشجع الأجواء الإيجابية والداعمة."],
      participantAr: ["اختر التوقع الأقرب الذي تعتقد أنه يناسب زميلك!"]
    },
    rounds: [
      {
        id: "fi-1",
        roundNumber: 1,
        promptAr: "خمن الانطباع الأول: كيف يقضي معظم الحضور هنا أوقات فراغهم المفضلة؟",
        subtitleAr: "ما هو التوقع الأكثر شيوعاً في الغرفة؟",
        optionsAr: [
          "قراءة وبحث وتطوير مهارات 📚",
          "مغامرات ورحلات واستكشاف أماكن 🏕️",
          "رياضة وأنشطة حركية عالية 🏃",
          "ألعاب وفيديو وأفلام ومسلسلات 🎮"
        ],
        timeLimit: 20
      },
      {
        id: "fi-2",
        roundNumber: 2,
        promptAr: "لو كان للمجموعة هنا موهبة سرية خارقة مشتركة، فما هي؟",
        subtitleAr: "القوة الخفية للغرفة:",
        optionsAr: [
          "إنجاز المهام تحت أقصى درجات الضغط ⚡",
          "نشر الضحك والمرح في أي بيئة متوترة 😂",
          "ابتكار حلول عبقرية لم تكن تخطر على بال 💡",
          "الاستماع وفهم الآخرين بعمق وتعاطف 🤝"
        ],
        timeLimit: 20
      }
    ]
  },
  {
    id: "act-most-likely-to",
    slug: "most-likely-to",
    titleAr: "من الأكثر احتمالاً؟",
    titleEn: "Most Likely To",
    taglineAr: "مواقف مجنونة ومضحكة.. من هو الشخص في القاعة المؤهل لفعلها أولاً؟",
    descriptionAr: "تصويت جماعي سريع على مواقف كوميدية غير متوقعة لمعرفة الصورة النمطية المرحة لكل شخص.",
    category: "SOCIAL",
    audience: "adults",
    minAge: 14,
    maxAge: 99,
    minPlayers: 5,
    maxPlayers: 50,
    duration: 8,
    energy: "high",
    goal: "laughter",
    type: "THIS_OR_THAT",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Flame",
    accentColor: "#EF4444",
    whyRecommended: "يطلق موجات ضحك متتالية ويكشف خفة ظل المجموعة.",
    instructions: {
      overviewAr: "يصوت الجميع للشخص الأنسب للموقف الفكاهي المطروح.",
      hostAr: ["اعرض السؤال ودع الأصابع تتجه نحو المشتبه به!"],
      participantAr: ["صوت لزميلك صاحب الموقف الأقرب للواقعة."]
    },
    rounds: [
      {
        id: "mlt-1",
        roundNumber: 1,
        promptAr: "من الأكثر احتمالاً أن ينسى أين ركن سيارته في المجمع التجاري؟",
        optionsAr: [
          "أنا شخصياً بدون أي شك! 😅",
          "الزميل الجالس على يميني 👉",
          "الزميل الجالس على يساري 👈",
          "ميسر الورشة / المضيف نفسه! 🎯"
        ],
        timeLimit: 15
      },
      {
        id: "mlt-2",
        roundNumber: 2,
        promptAr: "من الأكثر احتمالاً أن يسافر لبلد آخر لمجرد تذوق وجبة معينة؟",
        optionsAr: [
          "أنا، الأكل أولوية مطلقة في حياتي! 🍕",
          "أحد الزملاء الشغوفين بالطعام هنا ✈️",
          "جميعنا بلا استثناء متفقون على هذا 😋",
          "لا أحد يتهور بهذه الدرجة! 🙅"
        ],
        timeLimit: 15
      },
      {
        id: "mlt-3",
        roundNumber: 3,
        promptAr: "من الأكثر احتمالاً أن يشتري شيئاً لا يحتاجه فقط لأنه عليه خصم 50%؟",
        optionsAr: [
          "أنا ضحية دائمة للعروض والتخفيضات 🛍️",
          "الشخص الأكثر هدوءاً في القاعة 🤫",
          "نصف الحاضرين على الأقل 💳",
          "نحن حكماء في قرارات الشراء 💡"
        ],
        timeLimit: 15
      }
    ]
  },
  {
    id: "act-complete-the-sentence",
    slug: "complete-the-sentence",
    titleAr: "أكمل الجملة بعفوية",
    titleEn: "Complete the Sentence",
    taglineAr: "جملة ناقصة.. أكملها بالكلمة الأولى التي تقفز إلى لسانك بدون فلترة!",
    descriptionAr: "تمرين ارتجال عقلي يكشف التفكير التلقائي للمشاركين وينتج عبارات شديدة الطرافة والعمق.",
    category: "CREATIVE",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 60,
    duration: 6,
    energy: "medium",
    goal: "creativity",
    type: "WORD_CLOUD",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "PenTool",
    accentColor: "#8B5CF6",
    whyRecommended: "يكشف خيال المجموعة وينتج عبارات لا تُنسى.",
    instructions: {
      overviewAr: "كل شخص يكمل الجملة بكلمة أو جملة واحدة من هاتفه.",
      hostAr: ["استعرض الإجابات الأكثر إبداعاً وغرابة."],
      participantAr: ["لا تتردد.. اكتب أول ما يخطر في بالك مباشرة."]
    },
    rounds: [
      {
        id: "cts-1",
        roundNumber: 1,
        promptAr: "أكمل الجملة بعفوية: 'الصباح لا يبدأ حقيقة حتى...'",
        subtitleAr: "اكتب كلمة أو كلمتين تعبر عن بدايتك الحقيقية",
        timeLimit: 25
      },
      {
        id: "cts-2",
        roundNumber: 2,
        promptAr: "أكمل الجملة: 'السر الحقيقي لنجاح أي فريق عمل هو...'",
        subtitleAr: "كلمة واحدة تختصر سر القوة",
        timeLimit: 25
      }
    ]
  },
  {
    id: "act-rank-these",
    slug: "rank-these",
    titleAr: "رتب هذه الأشياء",
    titleEn: "Rank It",
    taglineAr: "رتب 4 مفاهيم من الأهم إلى الأقل أهمية.. واكتشف التباين الصادم في القيم!",
    descriptionAr: "لعبة ترتيب استراتيجي تكشف الأولويات الفردية والجماعية وتصلح كمدخل لنقاشات عميقة في ورش العمل.",
    category: "DISCUSSION",
    audience: "adults",
    minAge: 14,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 80,
    duration: 8,
    energy: "medium",
    goal: "discussion",
    type: "THIS_OR_THAT",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Sliders",
    accentColor: "#10B981",
    whyRecommended: "يكشف أولويات التفكير لدى الفريق ويفتح حواراً قيماً.",
    instructions: {
      overviewAr: "اختر الأولوية الأهم بالنسبة لك وشاهد متوسط تصويت القاعة.",
      hostAr: ["قارن بين النتائج وافتح باب النقاش حول أسباب الترتيب."],
      participantAr: ["رتب حسب قناعتك أنت وليس ما يرضي الآخرين."]
    },
    rounds: [
      {
        id: "rnk-1",
        roundNumber: 1,
        promptAr: "ما هو المعيار الأهم لديك لبيئة العمل المثالية؟",
        subtitleAr: "اختر أولويتك الأولى:",
        optionsAr: [
          "المرونة وراحة البال النفسية 🧘",
          "الراتب والمكافآت والتقدير المالي 💰",
          "فريق عمل متعاون ومرح ومحفز 🤝",
          "فرص التطور والتعلم المستمر 🚀"
        ],
        timeLimit: 20
      },
      {
        id: "rnk-2",
        roundNumber: 2,
        promptAr: "ما هو المصدر الأكبر الذي يشحن طاقتك بعد أسبوع مرهق؟",
        subtitleAr: "طريقتك المفضلة للاستشفاء:",
        optionsAr: [
          "الهدوء والعزلة في الطبيعة أو البيت 🌿",
          "السفر واستكشاف أماكن وتجارب جديدة ✈️",
          "جلسة ضحك وسوالف مع الأصدقاء المقربين ☕",
          "ممارسة الرياضة والحركة لتفريغ الطاقة 🏃"
        ],
        timeLimit: 20
      }
    ]
  },
  {
    id: "act-guess-the-word",
    slug: "guess-the-word",
    titleAr: "خمن الكلمة المحظورة",
    titleEn: "Taboo Word Guess",
    taglineAr: "اشرح لزملائك الكلمة المطلوبة دون أن تنطق أي كلمة من الكلمات الممنوعة!",
    descriptionAr: "تحدي فصاحة وذكاء لغوي شديد الإثارة. يتطلب مهارة في الوصف والالتفاف البلاغي.",
    category: "CREATIVE",
    audience: "adults",
    minAge: 13,
    maxAge: 99,
    minPlayers: 6,
    maxPlayers: 40,
    duration: 10,
    energy: "high",
    goal: "competition",
    type: "QUICK_QUIZ",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: true,
    isPlayable: true,
    iconName: "AlertCircle",
    accentColor: "#F59E0B",
    whyRecommended: "تحدي فصاحة وسرعة بديهة يرفع الضحك والتنافس.",
    instructions: {
      overviewAr: "خمن الأداة أو الكلمة المشروحة بدون استخدام الكلمات المحظورة.",
      hostAr: ["شجع السرعة وامنح النقاط للفريق الأسرع."],
      participantAr: ["اختر الإجابة الصحيحة بسرعة!"]
    },
    rounds: [
      {
        id: "gtw-1",
        roundNumber: 1,
        promptAr: "جهاز في جيبك، مضيء ومستطيل، يقرب البعيد ويسليك، لكن محظور قول (اتصال، شاشة، ذكي):",
        optionsAr: ["الهاتف الذكي 📱", "الحاسوب المحمول 💻", "الساعة اليدوية ⌚", "جهاز التلفاز 📺"],
        correctAnswer: 0,
        timeLimit: 15
      },
      {
        id: "gtw-2",
        roundNumber: 2,
        promptAr: "شيء نعيش داخله افتراضياً، يربط الكوكب، ومحظور قول (شبكة، واي فاي، موقع):",
        optionsAr: ["الإنترنت 🌐", "المكتبة 📚", "الفضاء 🚀", "القمر الصناعي 🛰️"],
        correctAnswer: 0,
        timeLimit: 15
      }
    ]
  },
  {
    id: "act-common-thread",
    slug: "common-thread",
    titleAr: "الرابط المشترك السري",
    titleEn: "The Common Thread",
    taglineAr: "اجلسوا في مجموعات واكتشفوا 3 أشياء غير متوقعة يشترك فيها كل أفراد الطاولة!",
    descriptionAr: "نشاط يعزز الألفة والانتماء من خلال التنقيب عن القواسم المشتركة الغريبة بين أشخاص لم يلتقوا من قبل.",
    category: "SOCIAL",
    audience: "adults",
    minAge: 13,
    maxAge: 99,
    minPlayers: 6,
    maxPlayers: 100,
    duration: 10,
    energy: "medium",
    goal: "cooperation",
    type: "THIS_OR_THAT",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Link2",
    accentColor: "#06B6D4",
    whyRecommended: "يبني جسور الألفة والروابط غير المتوقعة بين الزملاء.",
    instructions: {
      overviewAr: "ناقشوا الخيارات وصوتوا للرابط الأكثر انطباقاً على طاولتكم.",
      hostAr: ["أعطِ الفرق وقتاً للحديث ثم استعرض الروابط المشتركة."],
      participantAr: ["اسأل زملاءك وصوتوا للخيار المشترك."]
    },
    rounds: [
      {
        id: "ct-1",
        roundNumber: 1,
        promptAr: "ما هو الرابط الأكثر انطباقاً على أعضاء فريقكم في هذه اللحظة؟",
        optionsAr: [
          "جميعنا نعشق شرب الشاي أو القهوة يومياً ☕",
          "جميعنا نفضل العمل مع الموسيقى الهادئة 🎧",
          "جميعنا جربنا السفر خارج بلداننا سابقاً ✈️",
          "جميعنا نمتلك أفكاراً ومشاريع نطمح لتنفيذها 💡"
        ],
        timeLimit: 25
      }
    ]
  },
  {
    id: "act-unexpected-question",
    slug: "unexpected-question",
    titleAr: "السؤال غير المتوقع",
    titleEn: "The Curveball Question",
    taglineAr: "سؤال واحد فلسفي أو غير مألوف يقلب الطاولة ويفجر حواراً لا يُنسى!",
    descriptionAr: "مجموعة من الأسئلة الاستفزازية فكرياً والممتعة التي تخرج الجميع من إطار الأحاديث السطحية المعتادة.",
    category: "DISCUSSION",
    audience: "adults",
    minAge: 15,
    maxAge: 99,
    minPlayers: 3,
    maxPlayers: 50,
    duration: 8,
    energy: "calm",
    goal: "discussion",
    type: "THIS_OR_THAT",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "HelpCircle",
    accentColor: "#8B5CF6",
    whyRecommended: "يفتح حوارات فلسفية ملهمة وممتعة تثري عقول الحاضرين.",
    instructions: {
      overviewAr: "سؤال غير تقليدي يطرح للتأمل والتصويت ومشاركة الرأي.",
      hostAr: ["شجع المشاركين على الاستماع الفعال وتقبل وجهات النظر المختلفة."],
      participantAr: ["أجب بعمق وصدق وشارك وجهة نظرك."]
    },
    rounds: [
      {
        id: "uq-1",
        roundNumber: 1,
        promptAr: "لو أتيح لك التحدث مع أي شخصية عبر التاريخ لنصف ساعة، فمن تفضل؟",
        optionsAr: [
          "عالم أو فيلسوف غير مجرى التفكير البشري 📜",
          "مخترع أو رائد أعمال بنى إمبراطورية أفكار 💡",
          "قائد ملهم أو رحالة طاف أرجاء العالم 🗺️",
          "أديب أو فنان أسطوري صنع روائع الأدب 🎨"
        ],
        timeLimit: 25
      },
      {
        id: "uq-2",
        roundNumber: 2,
        promptAr: "لو كان بإمكانك إلغاء عادة واحدة من عالم العمل نهائياً، فما هي؟",
        optionsAr: [
          "الاجتماعات الطويلة التي يمكن حلها برسالة 📧",
          "التأخر عن المواعيد وإهدار وقت الآخرين ⏰",
          "المجاملات الزائدة على حساب الصراحة البناءة 🗣️",
          "إرسال رسائل العمل بعد ساعات الدوام الرسمي 📵"
        ],
        timeLimit: 25
      }
    ]
  },
  {
    id: "act-who-knows-group",
    slug: "who-knows-group",
    titleAr: "من يعرف المجموعة أكثر؟",
    titleEn: "Who Knows The Group Best?",
    taglineAr: "هل تستطيع تخمين إجابة أغلبية الحضور بدقة قبل ظهور النتيجة الحقيقية؟",
    descriptionAr: "لعبة توقع ذكية، حيث لا تربح بمعرفتك الشخصية، بل بقدرتك على قراءة سيكولوجية الحاضرين وتوقع خياراتهم الأغلبية.",
    category: "QUIZ",
    audience: "adults",
    minAge: 13,
    maxAge: 99,
    minPlayers: 6,
    maxPlayers: 120,
    duration: 8,
    energy: "high",
    goal: "competition",
    type: "THIS_OR_THAT",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "TrendingUp",
    accentColor: "#EC4899",
    whyRecommended: "اختبار ممتع لمدى فهمنا لطبيعة المجتمع المحيط بنا.",
    instructions: {
      overviewAr: "خمن أي الخيارين سيحصل على أكثر من 50% من أصوات القاعة.",
      hostAr: ["علق على دقة توقعات الجمهور مقارنة بالواقع."],
      participantAr: ["فكر بعقلية زملائك وصوت للخيار الأكثر شعبية."]
    },
    rounds: [
      {
        id: "wkg-1",
        roundNumber: 1,
        promptAr: "توقع خيار الأغلبية في هذه القاعة: هل يفضل معظم الحضور:",
        optionsAr: [
          "العمل عن بُعد من البيت بحرية تامة 🏠",
          "العمل من المكتب مع لقاء الزملاء وجهاً لوجه 🏢"
        ],
        timeLimit: 15
      },
      {
        id: "wkg-2",
        roundNumber: 2,
        promptAr: "توقع خيار الأغلبية: عند مواجهة مشكلة معقدة، أول تصرف للغالبية:",
        optionsAr: [
          "البحث الذاتي والتحليل العميق في هدوء 🔍",
          "استشارة زميل موثوق ومناقشة الحل معه فوراً 🗣️"
        ],
        timeLimit: 15
      }
    ]
  },
  {
    id: "act-story-in-emojis",
    slug: "story-in-emojis",
    titleAr: "قصة بالإيموجي فقط",
    titleEn: "Story in Emojis",
    taglineAr: "صف يوماً مجنوناً في عملك أو حياتك باستخدام 5 رموز تعبيرية فقط!",
    descriptionAr: "تحدي إيجاز وتعبير بصري يضحك الجميع ويفسر كيفية ضغط القصص المعقدة في رسوم مرحة.",
    category: "CREATIVE",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 50,
    duration: 6,
    energy: "medium",
    goal: "creativity",
    type: "QUICK_QUIZ",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "MessageCircle",
    accentColor: "#F59E0B",
    whyRecommended: "يجمع بين الفكاهة والإيجاز العصري الممتع.",
    instructions: {
      overviewAr: "تأمل تسلسل الرموز وخمن الموقف الكوميدي الذي تعبر عنه.",
      hostAr: ["اعرض الشفرة وافتح المجال للتعليقات الساخرة."],
      participantAr: ["اختر المعنى الأقرب للقصة!"]
    },
    rounds: [
      {
        id: "sie-1",
        roundNumber: 1,
        promptAr: "ما هي القصة وراء هذا التسلسل: ⏰ 🛌 🚗 ☕ 💻 💥",
        optionsAr: [
          "يوم عمل متأخر ومليء بالزحام وضغط الإنجاز 😅",
          "رحلة سفر برية ممتعة إلى مؤتمر عمل 🚗",
          "عطلة نهاية أسبوع هادئة ومريحة 🏖️",
          "مشروع جامعي سُلّم قبل الموعد النهائي بدقيقة 🎓"
        ],
        correctAnswer: 0,
        timeLimit: 20
      },
      {
        id: "sie-2",
        roundNumber: 2,
        promptAr: "ما هي القصة هنا: ✈️ 🧳 🏝️ 🥥 📱❌ 🧘",
        optionsAr: [
          "إجازة استجمام وانفصال تام عن ضغوط العمل 🏖️",
          "مهمة عمل رسمية في جزيرة نائية 💼",
          "فقدان الهاتف وحقيبة السفر في المطار 😱",
          "دورة تدريبية في مهارات التأمل واليوغا 🧘"
        ],
        correctAnswer: 0,
        timeLimit: 20
      }
    ]
  },
  {
    id: "act-mysterious-photo",
    slug: "mysterious-photo",
    titleAr: "الصورة المقربة الغامضة",
    titleEn: "Macro Mystery Zoom",
    taglineAr: "صورة مقربة جداً لشيء نستخدمه يومياً.. من هو العبقري الذي سيتعرف عليه أولاً؟",
    descriptionAr: "نعرض جزءاً ميكروسكوبياً مكبراً من أداة مألوفة، وتتسابق العيون لتخمين هويتها الحقيقية قبل تصغير الصورة تدريجياً.",
    category: "GUESSING",
    audience: "adults",
    minAge: 10,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 100,
    duration: 6,
    energy: "high",
    goal: "competition",
    type: "QUICK_QUIZ",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "Search",
    accentColor: "#3B82F6",
    whyRecommended: "يحفز الانتباه والملاحظة البصرية الدقيقة.",
    instructions: {
      overviewAr: "اقرأ الوصف المقرب وخمن الأداة المألوفة سريعاً.",
      hostAr: ["أشعل الحماس واعرض النتيجة."],
      participantAr: ["اختر الأداة الصحيحة على هاتفك."]
    },
    rounds: [
      {
        id: "mp-1",
        roundNumber: 1,
        promptAr: "أداة معدنية رفيعة ملتوية، موجودة على كل مكتب، تحفظ الأوراق دون ثقبها:",
        optionsAr: [
          "مشبك الأوراق المعدني 📎",
          "دبوس الخياطة والورق 🧷",
          "سن قلم الحبر الجاف ✒️",
          "مفتاح الخزنة المكتبي 🔑"
        ],
        correctAnswer: 0,
        timeLimit: 15
      },
      {
        id: "mp-2",
        roundNumber: 2,
        promptAr: "حبيبات بنية داكنة خشنة الملمس، تفوح منها رائحة ساحرة كل صباح:",
        optionsAr: [
          "حبوب القهوة المحمصة المطحونة ☕",
          "الشوكولاتة الداكنة الخام 🍫",
          "قشور القرفة العطرية 🪵",
          "بذور السمسم المحمص 🌰"
        ],
        correctAnswer: 0,
        timeLimit: 15
      }
    ]
  },
  {
    id: "act-silent-challenge",
    slug: "silent-challenge",
    titleAr: "تحدي الصمت والترتيب",
    titleEn: "The Silent Lineup",
    taglineAr: "رتبوا أنفسكم حسب تاريخ الميلاد أو الطول دون أن ينطق أي شخص بحرف واحد!",
    descriptionAr: "تمرين تواصل غير لفظي رائع يعلم الفريق قراءة لغة الجسد والإشارات التعاونية بسرعة وإتقان.",
    category: "MOVEMENT",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 8,
    maxPlayers: 40,
    duration: 6,
    energy: "high",
    goal: "cooperation",
    type: "KIDS_MOVEMENT",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "VolumeX",
    accentColor: "#14B8A6",
    whyRecommended: "تمرين تواصل غير لفظي رائع يكسر الخجل ويحرك الحضور.",
    instructions: {
      overviewAr: "يصطف الجميع في خط مستقيم حسب معيار محدد دون أي كلمة أو همس.",
      hostAr: ["أعلن المعيار وابدأ المؤقت، وتأكد من عدم كسر الصمت التام."],
      participantAr: ["استخدم أصابع يديك وإيماءات وجهك للتنسيق مع زملائك."]
    },
    rounds: [
      {
        id: "sc-1",
        roundNumber: 1,
        promptAr: "المهمة الأولى (بصمت تام 🤫): اصطفوا في طابور مستقيم من الأطول إلى الأقصر قامة!",
        subtitleAr: "ممنوع الكلام أو الهمس مطلقاً.. استخدموا الإشارات فقط!",
        timeLimit: 45
      },
      {
        id: "sc-2",
        roundNumber: 2,
        promptAr: "المهمة الثانية (بصمت تام 🤫): رتبوا أنفسكم حسب شهور ميلادكم من يناير حتى ديسمبر!",
        subtitleAr: "استخدموا أصابع أيديكم للدلالة على أرقام الشهور!",
        timeLimit: 60
      }
    ]
  },
  {
    id: "act-elevator-pitch",
    slug: "elevator-pitch",
    titleAr: "عرض المصعد المجنون",
    titleEn: "Crazy Elevator Pitch",
    taglineAr: "سلعة سخيفة لا قيمة لها.. عليك إقناع مستثمر بشرائها في 30 ثانية فقط!",
    descriptionAr: "تمرين إقناع وارتجال تسويقي كوميدي يطلق العنان للمهارات البيعية المضحكة بين المشاركين.",
    category: "CREATIVE",
    audience: "adults",
    minAge: 15,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 30,
    duration: 10,
    energy: "high",
    goal: "laughter",
    type: "SIXTY_SEC_CHALLENGE",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "Briefcase",
    accentColor: "#F97316",
    whyRecommended: "ارتجال تسويقي مضحك يكسر الرهبة ويطلق الإبداع.",
    instructions: {
      overviewAr: "يعطى المتسابق سلعة غريبة لإقناع القاعة بقيمتها خلال 30 ثانية.",
      hostAr: ["حدد المتطوع وأطلق المؤقت، ثم دع الجمهور يصوت بالتصفيق."],
      participantAr: ["كن مقنعاً وجريئاً واخترق المنطق بحيل تسويقية عبقرية."]
    },
    rounds: [
      {
        id: "ep-1",
        roundNumber: 1,
        promptAr: "السلعة للمتسابق الأول: 'جورب واحد فقط بدون فردته الثانية' 🧦.. أقنعنا بشرائه كأعظم اختراع في 30 ثانية!",
        subtitleAr: "ابدأ العرض التسويقي فوراً قبل الصافرة!",
        timeLimit: 30
      },
      {
        id: "ep-2",
        roundNumber: 2,
        promptAr: "السلعة للمتسابق الثاني: 'مظلة مثقوبة من المنتصف' ☔.. لديك 30 ثانية لإقناع المستثمرين بجدواها!",
        subtitleAr: "أظهر عبقرية البيع والارتجال!",
        timeLimit: 30
      }
    ]
  },
  {
    id: "act-guess-the-sound",
    slug: "guess-the-sound",
    titleAr: "خمن مصدر هذا الصوت",
    titleEn: "Mystery Sound Bite",
    taglineAr: "أغمض عينيك، استمع للصوت الغامض، واكتشف ما الذي يحدث في هذا التسجيل!",
    descriptionAr: "تمرين استماع وتركيز سمعي يعتمد على مقاطع صوتية مأخوذة من مواقف يومية ولكنها تبدو غريبة جداً عند عزلها.",
    category: "GUESSING",
    audience: "adults",
    minAge: 10,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 100,
    duration: 6,
    energy: "medium",
    goal: "competition",
    type: "QUICK_QUIZ",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "Volume2",
    accentColor: "#6366F1",
    whyRecommended: "تمرين تركيز ذهني وملاحظة سمعية ممتع للجميع.",
    instructions: {
      overviewAr: "استمع للمؤثرات والوصف الصوتي واختر مصدر الصوت المطابق.",
      hostAr: ["قلد الصوت أو اشرح طبيعته ثم كاشف النتيجة."],
      participantAr: ["استمع بدقة واختر من هاتفك."]
    },
    rounds: [
      {
        id: "gts-1",
        roundNumber: 1,
        promptAr: "صوت طقطقة سريعة متتالية يعشقها المبرمجون والكتّاب كل ثانية:",
        optionsAr: [
          "الكتابة على لوحة مفاتيح ميكانيكية ⌨️",
          "قطرات مطر خفيفة على سقف معدني 🌧️",
          "آلة تقطيع الورق المكتبي 📄",
          "عجلة دراجة تدور بسرعة 🚲"
        ],
        correctAnswer: 0,
        timeLimit: 15
      },
      {
        id: "gts-2",
        roundNumber: 2,
        promptAr: "صوت فوران بخار قوي يتبعه سكب سائل برائحة زكية تعدل المزاج:",
        optionsAr: [
          "ماكينة تحضير قهوة الإسبريسو ☕",
          "غلاية ماء الشاي الساخن 🫖",
          "إناء طهي بالضغط العالي 🍲",
          "مكواة البخار للملابس 👔"
        ],
        correctAnswer: 0,
        timeLimit: 15
      }
    ]
  },
  {
    id: "act-photo-prompt",
    slug: "photo-prompt",
    titleAr: "صورة وتعليق ساخر",
    titleEn: "Caption This!",
    taglineAr: "صورة غير مفهومة ومضحكة.. أطلق العنان لقلمك لكتابة أفضل تعليق عليها!",
    descriptionAr: "تحدي كتابة وإبداع ساخر، حيث يرسل الحضور تعليقاتهم على صورة ميمز أو موقف غريب ويصوت الجميع لأطرف تعليق.",
    category: "CREATIVE",
    audience: "adults",
    minAge: 13,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 50,
    duration: 8,
    energy: "high",
    goal: "laughter",
    type: "WORD_CLOUD",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "Image",
    accentColor: "#EC4899",
    whyRecommended: "يفجر الطاقات الكوميدية الساخرة بطريقة ذكية.",
    instructions: {
      overviewAr: "تظهر صورة وموقف مضحك، ويكتب كل متسابق تعليقاً ساخراً من هاتفه.",
      hostAr: ["استعرض التعليقات بنبرة كوميدية لتفجير الضحك في القاعة."],
      participantAr: ["فكر في التعليق الأكثر صدمة وفكاهة واربطه بالواقع."]
    },
    rounds: [
      {
        id: "pp-1",
        roundNumber: 1,
        promptAr: "موقف: 'لما تقفل اللابتوب الساعة 5:00 تماماً وتسمع صوت المدير يناديك...' اكتب أطرف تعليق!",
        subtitleAr: "اكتب تعليقك في كلمة أو كلمتين",
        timeLimit: 30
      },
      {
        id: "pp-2",
        roundNumber: 2,
        promptAr: "موقف: 'أول 5 دقائق في الدايت والحمية، مقابل شكلك الساعة 11 بالليل في المطبخ...' علق!",
        subtitleAr: "صف الكارثة بكلمة واحدة",
        timeLimit: 30
      }
    ]
  },
  {
    id: "act-gratitude-wall",
    slug: "gratitude-wall",
    titleAr: "جدار الامتنان والتقدير",
    titleEn: "The Gratitude Wall",
    taglineAr: "وجه رسالة شكر أو تقدير خفية لزميل قدم لك معروفاً أو أبهج يومك!",
    descriptionAr: "نشاط ختامي مؤثر يترك انطباعاً إيجابياً دافئاً، حيث ترسل كلمات الشكر والامتنان وتظهر على شاشة جميلة مزخرفة.",
    category: "SOCIAL",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 200,
    duration: 6,
    energy: "calm",
    goal: "cooperation",
    type: "WORD_CLOUD",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Heart",
    accentColor: "#F43F5E",
    whyRecommended: "يختم الجلسة بطاقة إيجابية وامتنان عميق.",
    instructions: {
      overviewAr: "كل شخص يرسل كلمة أو رسالة شكر موجزة تظهر على الشاشة المضيئة.",
      hostAr: ["اقرأ بعض الرسائل الملهمة وأكد على روح الفريق والتعاون."],
      participantAr: ["عبر عن امتنانك لشخص حقيقي في الغرفة أو لقيمة تقدرها."]
    },
    rounds: [
      {
        id: "gw-1",
        roundNumber: 1,
        promptAr: "وجه كلمة شكر أو تقدير لزميل أو قيمة ملهمة في هذه الجلسة:",
        subtitleAr: "اكتب كلمة تعبر عن امتنانك الصادق",
        timeLimit: 45
      }
    ]
  },
  {
    id: "act-paper-airplane",
    slug: "paper-airplane",
    titleAr: "طائرات الأفكار الورقية",
    titleEn: "Paper Airplane Ideas",
    taglineAr: "اكتب حلمك أو سؤالك في طائرة ورقية.. أطلقها في الهواء، والتقط طائرة غيرك!",
    descriptionAr: "نشاط مادي وحركي كلاسيكي للمؤتمرات، يخلق لحظة فوضى مرحة وجميلة تملأ القاعة بالطائرات المحلقة.",
    category: "MOVEMENT",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 10,
    maxPlayers: 200,
    duration: 8,
    energy: "high",
    goal: "energizer",
    type: "KIDS_MOVEMENT",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: true,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Send",
    accentColor: "#06B6D4",
    whyRecommended: "يصنع لحظة بصرية مذهلة تحرك القاعة بالكامل.",
    instructions: {
      overviewAr: "يكتب كل شخص فكرة على ورقة ويطويها كطائرة، ثم يطلق الجميع طائراتهم في نفس اللحظة.",
      hostAr: ["أعطِ إشارة الإطلاق الموحدة وشاهد مئات الطائرات المحلقة."],
      participantAr: ["اطوِ طائرتك بإتقان والتقط طائرة هبطت بجانبك واقرأ فكرتها."]
    },
    rounds: [
      {
        id: "pa-1",
        roundNumber: 1,
        promptAr: "المرحلة الأولى: اكتب على ورقتك نصيحة ذهبية غيرت مجرى تفكيرك، واطوها كطائرة محلقة!",
        subtitleAr: "أمامكم 60 ثانية لتجهيز طائراتكم...",
        timeLimit: 60
      },
      {
        id: "pa-2",
        roundNumber: 2,
        promptAr: "المرحلة الثانية: استعدوا للإطلاق الجماعي.. 3، 2، 1.. أطلقوا الطائرات والتقطوا طائرة زميل!",
        subtitleAr: "اقرأ النصيحة التي وصلت إليك وشاركها مع من حولك!",
        timeLimit: 45
      }
    ]
  },
  {
    id: "act-human-bingo",
    slug: "human-bingo",
    titleAr: "بينغو الشخصيات",
    titleEn: "Human Bingo",
    taglineAr: "شبكة مربعات مليئة بالصفات.. من سينجح في ملء خط كامل من توقيعات الزملاء؟",
    descriptionAr: "لعبة تعارف جماعية فعالة جداً في بداية الدورات التدريبية لدمج الحضور سريعاً.",
    category: "SOCIAL",
    audience: "adults",
    minAge: 13,
    maxAge: 99,
    minPlayers: 10,
    maxPlayers: 100,
    duration: 10,
    energy: "high",
    goal: "icebreaker",
    type: "THIS_OR_THAT",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "Grid",
    accentColor: "#10B981",
    whyRecommended: "أسرع طريقة لجعل الجميع يتحركون ويتعرفون على بعضهم.",
    instructions: {
      overviewAr: "تحرك وابحث عن شخص يطابق كل خانة على هاتفك حتى تكمل صفا كاملا.",
      hostAr: ["أول شخص يصرخ 'بينغو' هو الفائز بالبطولة."],
      participantAr: ["اسأل بذكاء وسجل الأسماء بسرعة."]
    },
    rounds: [
      {
        id: "hb-1",
        roundNumber: 1,
        promptAr: "المهمة الأولى: ابحث في القاعة عمن تنطبق عليه إحدى هذه الصفات الاستثنائية:",
        optionsAr: [
          "يستيقظ يومياً قبل الساعة 5:30 فجراً 🌅",
          "يتحدث أكثر من 3 لغات مختلفة بطلاقة 🗣️",
          "يمارس رياضة الجري أو السباحة أسبوعياً 🏊",
          "قرأ أكثر من 10 كتب كاملة هذا العام 📚"
        ],
        timeLimit: 45
      }
    ]
  },
  {
    id: "act-speed-networking",
    slug: "speed-networking",
    titleAr: "التعارف الدوار السريع",
    titleEn: "Speed Networking",
    taglineAr: "دقيقتان مع كل شخص.. سؤال ذكي ومصافحة سريعة ثم التبديل مع التالي!",
    descriptionAr: "جلسة مصافحة سريعة تتيح لكل شخص التعرف على 5 أشخاص جدد في أقل من 10 دقائق بنظام المنبه الآلي.",
    category: "SOCIAL",
    audience: "adults",
    minAge: 16,
    maxAge: 99,
    minPlayers: 8,
    maxPlayers: 60,
    duration: 10,
    energy: "medium",
    goal: "icebreaker",
    type: "THIS_OR_THAT",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Repeat",
    accentColor: "#3B82F6",
    whyRecommended: "يتيح التعرف على أكبر عدد من الأشخاص في أقصر وقت منظم.",
    instructions: {
      overviewAr: "كل شخص يجلس أمام زميل، وعند رنين المؤقت يتبادلان الإجابة ثم ينتقلان للشخص التالي.",
      hostAr: ["شغل المؤقت وشجع الجميع على التركيز والانتقال عند الصافرة."],
      participantAr: ["قدم نفسك بإيجاز وناقش السؤال المعروض على الشاشة."]
    },
    rounds: [
      {
        id: "sn-1",
        roundNumber: 1,
        promptAr: "الجولة الأولى (دقيقتان): قابل الزميل أمامك وتبادلا: الاسم + ما هو أكبر شغف أو مشروع تعمل عليه هذا العام؟",
        subtitleAr: "دقيقة لكل شخص للتحدث.. استمع باهتمام!",
        optionsAr: [
          "تحدثنا وتبادلنا الأفكار باستمتاع! 🤝",
          "اكتشفنا اهتمامات وشغفاً مشتركاً 💡"
        ],
        timeLimit: 120
      },
      {
        id: "sn-2",
        roundNumber: 2,
        promptAr: "الجولة الثانية (دقيقتان): انتقل للشخص التالي على يمينك: ما هو أفضل كتاب أو بودكاست أو نصيحة غيرت فيك مؤخراً؟",
        subtitleAr: "انتقل خطوة لليمين فوراً!",
        optionsAr: [
          "شاركنا تجارب وتوصيات ملهمة 📚",
          "تعرفنا على وجهة نظر جديدة ومفيدة ✨"
        ],
        timeLimit: 120
      },
      {
        id: "sn-3",
        roundNumber: 3,
        promptAr: "الجولة الثالثة والأخيرة: لو امتلكت يوماً إضافياً فارغاً كل أسبوع، كيف ستستثمره؟",
        subtitleAr: "المحطة الأخيرة في التعارف الدوار!",
        optionsAr: [
          "في الراحة والاستجمام والتأمل 🧘",
          "في التعلم وبناء مشروع شخصي جديد 🚀"
        ],
        timeLimit: 120
      }
    ]
  },
  {
    id: "act-blind-drawing",
    slug: "blind-drawing",
    titleAr: "الرسم الأعمى التواصلي",
    titleEn: "Blind Communication Drawing",
    taglineAr: "شخص يصف رسماً هندسياً معقداً بكلمات فقط.. وزميله يرسم بظهره دون أن يرى!",
    descriptionAr: "تحدي تواصل رائع يوضح الفجوة بين ما نقوله وما يفهمه الطرف الآخر بطريقة فكاهية.",
    category: "CREATIVE",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 40,
    duration: 8,
    energy: "medium",
    goal: "cooperation",
    type: "SIXTY_SEC_CHALLENGE",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: true,
    competitive: true,
    cooperative: true,
    isPlayable: true,
    iconName: "Edit3",
    accentColor: "#F59E0B",
    whyRecommended: "يوضح أهمية التواصل الواضح والدقيق بطريقة مرحة.",
    instructions: {
      overviewAr: "اثنان ظهرهما لبعضهما، أحدهما يصف الشكل والآخر يرسمه على ورقة بناء على الوصف فقط.",
      hostAr: ["قارن في النهاية بين الرسم الأصلي ورسومات الفرق واعرض أطرف الفروقات."],
      participantAr: ["استخدم مصطلحات دقيقة مثل 'مربع في الزاوية العلوية اليمنى'."]
    },
    rounds: [
      {
        id: "bd-1",
        roundNumber: 1,
        promptAr: "الشكل المطلوب وصفه ورسمه: 'مثلث متساوي الأضلاع داخله دائرة تمس أضلاعه، وتحته مستطيل أفقي'!",
        subtitleAr: "المتحدث يصف بالكلمات فقط، والرسام يرسم بظهره دون أن ينظر للشاشة!",
        timeLimit: 60
      }
    ]
  },
  {
    id: "act-brainstorm-blitz",
    slug: "brainstorm-blitz",
    titleAr: "عاصفة الأفكار المجنونة",
    titleEn: "Crazy Brainstorm Blitz",
    taglineAr: "كم فكرة خارقة تستطيع المجموعة توليدها لحل هذه المشكلة في 90 ثانية؟",
    descriptionAr: "تمرين تفكير تباعدي يركز على وفرة الأفكار دون أي حكم نقدي لتوليد حلول غير نمطية.",
    category: "CREATIVE",
    audience: "adults",
    minAge: 14,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 100,
    duration: 6,
    energy: "high",
    goal: "creativity",
    type: "WORD_CLOUD",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Zap",
    accentColor: "#8B5CF6",
    whyRecommended: "يكسر التفكير النمطي ويولد كماً هائلاً من الأفكار في ثوانٍ.",
    instructions: {
      overviewAr: "اكتب أكبر عدد من الأفكار حتى لو بدت مستحيلة أو مجنونة.",
      hostAr: ["أكد على قاعدة العصف الذهني: لا انتقاد، الكمية قبل الكيفية."],
      participantAr: ["أطلق العنان لخيالك ودون كل ما يمر ببالك فوراً."]
    },
    rounds: [
      {
        id: "bb-1",
        roundNumber: 1,
        promptAr: "كيف نجعل اجتماعات الصباح ممتعة ومليئة بالطاقة بدلاً من الملل؟ أرسل أفكارك المجنونة!",
        subtitleAr: "أرسل فكرة واحدة أو فكرتين فوراً",
        timeLimit: 60
      }
    ]
  },
  {
    id: "act-debate-duel",
    slug: "debate-duel",
    titleAr: "مناظرة الدقيقة الواحدة",
    titleEn: "1-Minute Debate Duel",
    taglineAr: "دافع عن رأي غريب جداً لا تؤمن به أبداً.. واقنع الجمهور بعبقريتك!",
    descriptionAr: "تدريب على التفكير المرن والخطابة السريعة، حيث يُلزم المتحدث بالدفاع عن فكرة طريفة أو غير منطقية.",
    category: "DISCUSSION",
    audience: "adults",
    minAge: 15,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 30,
    duration: 10,
    energy: "high",
    goal: "discussion",
    type: "THIS_OR_THAT",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "MessageSquare",
    accentColor: "#EF4444",
    whyRecommended: "يدرب على المرونة الفكرية والارتجال الخطابي المضحك.",
    instructions: {
      overviewAr: "متحدثان يتناظران حول موضوع طريف، ثم تصوت القاعة للطرف الأكثر إقناعاً.",
      hostAr: ["أعطِ كل متحدث 45 ثانية، ثم أطلق التصويت الحاسم."],
      participantAr: ["استمع للمناظرة وصوت للطرف الأكثر إقناعاً وفصاحة!"]
    },
    rounds: [
      {
        id: "dd-1",
        roundNumber: 1,
        promptAr: "المناظرة الكبرى: 'العمل من السرير بالبيجاما أكثر إنتاجية وتركيزاً بمليون مرة من المكتب!'",
        subtitleAr: "صوت للطرف الذي أقنعك بدفاعه:",
        optionsAr: [
          "أؤيد بشدة، الراحة تولد الإبداع 🛌",
          "أعارض تماماً، الانضباط والمكتب أساس الإنجاز 🏢"
        ],
        timeLimit: 60
      }
    ]
  },

  // ==========================================
  // SPARK KIDS ACTIVITIES (FULLY PLAYABLE WITH ROUNDS)
  // ==========================================
  {
    id: "act-kids-guess-animal",
    slug: "kids-guess-animal",
    titleAr: "خمن صوت وصورة الحيوان 🦁",
    titleEn: "Guess the Animal",
    taglineAr: "صوت خفي أو تفصيل صغير.. أي بطل سيعرف اسم هذا الحيوان الجميل؟",
    descriptionAr: "نشاط ممتع للغاية للأطفال الصغار. تظهر ألوان أو أصوات أو حركات، ويختار الطفل صورة الحيوان المطابق بضغطة زر ملونة كبيرة.",
    category: "KIDS",
    audience: "kids",
    kidsAgeGroup: "4-6",
    minAge: 4,
    maxAge: 7,
    minPlayers: 2,
    maxPlayers: 50,
    duration: 5,
    energy: "high",
    goal: "laughter",
    type: "QUICK_QUIZ",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Smile",
    accentColor: "#F59E0B",
    whyRecommended: "مثالي للأطفال الصغار، يعتمد على الصور والألوان ولا يتطلب قراءة نصوص معقدة.",
    instructions: {
      overviewAr: "تظهر صور حيوانات لطيفة وكبيرة، يضغط الطفل على صورة الحيوان الصحيح.",
      hostAr: ["قلد صوت الحيوان واجعل الأطفال يقلدونه معك بحماس."],
      participantAr: ["انظر للصورة الملونة واضغط على الحيوان اللطيف!"]
    },
    rounds: [
      {
        id: "ka-1",
        roundNumber: 1,
        promptAr: "ملك الغابة صاحب الزئير القوي والشعر الكثيف 👑:",
        optionsAr: ["الأسد 🦁", "الأرنب 🐰", "الفيل 🐘", "الزرافة 🦒"],
        correctAnswer: 0,
        timeLimit: 15
      },
      {
        id: "ka-2",
        roundNumber: 2,
        promptAr: "حيوان ذكي يعيش في البحر ويحب القفز واللعب مع الإنسان 🌊:",
        optionsAr: ["الدلفين 🐬", "القرش 🦈", "الأخطبوط 🐙", "السلحفاة 🐢"],
        correctAnswer: 0,
        timeLimit: 15
      },
      {
        id: "ka-3",
        roundNumber: 3,
        promptAr: "حيوان طويل الرقبة يأكل أوراق الأشجار العالية 🍃:",
        optionsAr: ["الزرافة 🦒", "الدب 🐻", "القرد 🐒", "الحصان 🐴"],
        correctAnswer: 0,
        timeLimit: 15
      }
    ]
  },
  {
    id: "act-kids-freeze-dance",
    slug: "kids-freeze-dance",
    titleAr: "تحدي الحركة المتوقفة (التماثيل) 🗿",
    titleEn: "Freeze Dance Spark",
    taglineAr: "تحرك وارقص واضحك.. وعندما تتوقف الشاشة، تجمد كتمثال من الجليد!",
    descriptionAr: "أكثر نشاط يعشقه الأطفال لتفريغ الطاقة! حركة وإيقاع حماسي، وفجأة تظهر علامة التوقف الحمراء ليتجمد الجميع، ومن يتحرك يضحك ويجلس.",
    category: "KIDS",
    audience: "kids",
    kidsAgeGroup: "all",
    minAge: 4,
    maxAge: 12,
    minPlayers: 3,
    maxPlayers: 40,
    duration: 6,
    energy: "high",
    goal: "energizer",
    type: "KIDS_MOVEMENT",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: false,
    competitive: true,
    cooperative: true,
    isPlayable: true,
    iconName: "Activity",
    accentColor: "#EF4444",
    whyRecommended: "ينشط الأطفال فوراً ويملأ الغرفة بالضحك والحيوية والتركيز الحركي.",
    instructions: {
      overviewAr: "تحرك عندما تكون الشاشة خضراء، وتجمد تماماً كالتمثال عندما تتحول للأحمر.",
      hostAr: ["شجع الأطفال على القفز والرقص، ثم راقب من يرمش أو يبتسم أثناء التجمد!"],
      participantAr: ["أظهر حركاتك البهلوانية، ثم اثبت كالصخرة عند التوقف!"]
    },
    rounds: [
      {
        id: "fd-1",
        roundNumber: 1,
        promptAr: "تحركوا كالنمور السريعة في الغابة! 🐅🐆",
        subtitleAr: "استعدوا للتجمد في أي لحظة...",
        timeLimit: 20
      },
      {
        id: "fd-2",
        roundNumber: 2,
        promptAr: "اقفزوا كرواد الفضاء على سطح القمر! 🧑‍🚀🌙",
        subtitleAr: "اثبت كالتمثال عند إشارة التوقف!",
        timeLimit: 20
      }
    ]
  },
  {
    id: "act-kids-find-color",
    slug: "kids-find-color",
    titleAr: "صياد الألوان السريع 🎨",
    titleEn: "Color Scavenger Hunt",
    taglineAr: "ابحث في الغرفة عن شيء بنفس لون الشاشة والمسْه قبل انتهاء الـ 30 ثانية!",
    descriptionAr: "لعبة تفاعلية حركية ممتازة للأطفال لتعلم الألوان وتنشيط الذهن والبحث في البيئة المحيطة.",
    category: "KIDS",
    audience: "kids",
    kidsAgeGroup: "4-6",
    minAge: 4,
    maxAge: 8,
    minPlayers: 2,
    maxPlayers: 30,
    duration: 5,
    energy: "high",
    goal: "laughter",
    type: "KIDS_MOVEMENT",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Palette",
    accentColor: "#EC4899",
    whyRecommended: "تحفز الحركة والتفكير البصري السريع للأطفال الصغار.",
    instructions: {
      overviewAr: "تضيء الشاشة بلون زاهٍ، يركض الأطفال للمس أي غرض في الغرفة يحمل نفس اللون.",
      hostAr: ["تأكد من سلامة الأطفال وشجعهم على العثور على ألوان مختلفة."],
      participantAr: ["انظر للشاشة وابحث في ملابسك أو ألعابك عن نفس اللون!"]
    },
    rounds: [
      {
        id: "fc-1",
        roundNumber: 1,
        promptAr: "المهمة الأولى: المس شيئاً باللون (الأصفر الساطع) 🟡 كالشمس!",
        timeLimit: 30
      },
      {
        id: "fc-2",
        roundNumber: 2,
        promptAr: "المهمة الثانية: المس شيئاً باللون (الأخضر الجميل) 🟢 كأوراق الشجر!",
        timeLimit: 30
      }
    ]
  },
  {
    id: "act-kids-mimic-action",
    slug: "kids-mimic-action",
    titleAr: "قلد هذه الحركة الخارقة 🦸",
    titleEn: "Superhero Mimic",
    taglineAr: "حركات أبطال وطيور ومخلوقات عجيبة.. من يستطيع تقليدها ببراعة أكبر؟",
    descriptionAr: "حركات خيالية تمثيلية تحاكي الطيران والسباحة والعدو وتسلق الجبال بطريقة هزلية تناسب خيال الأطفال.",
    category: "KIDS",
    audience: "kids",
    kidsAgeGroup: "7-9",
    minAge: 6,
    maxAge: 10,
    minPlayers: 3,
    maxPlayers: 40,
    duration: 6,
    energy: "high",
    goal: "laughter",
    type: "KIDS_MOVEMENT",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Zap",
    accentColor: "#8B5CF6",
    whyRecommended: "تفرغ طاقة الأطفال الحركية في إطار تمثيلي محبب للجميع.",
    instructions: {
      overviewAr: "تظهر صورة أو حركة بطل، ويقوم الأطفال بمحاكاتها والضحك على تعبيرات بعضهم.",
      hostAr: ["شارك الأطفال الحركات بحماس لتشجيع الخجولين منهم."],
      participantAr: ["استعد وأرنا قوة بطلك الخارق!"]
    },
    rounds: [
      {
        id: "ma-1",
        roundNumber: 1,
        promptAr: "قلد طيران النسر العميق فوق قمم الجبال العالية! 🦅🏔️",
        timeLimit: 25
      },
      {
        id: "ma-2",
        roundNumber: 2,
        promptAr: "قلد سباحة الضفدع الصغير وهو يقفز بين برك الماء! 🐸💧",
        timeLimit: 25
      }
    ]
  },
  {
    id: "act-kids-riddle-spark",
    slug: "kids-riddle-spark",
    titleAr: "فوازير الأذكياء الصغار 🧠",
    titleEn: "Junior Riddles",
    taglineAr: "فزورة سهلة ولطيفة.. فكر فيها قليلاً وستعرف الحل على الفور!",
    descriptionAr: "فوازير شعرية مبسطة تناسب عقول الأطفال وتنمي التفكير الاستنتاجي وحب الاكتشاف.",
    category: "KIDS",
    audience: "kids",
    kidsAgeGroup: "10-12",
    minAge: 8,
    maxAge: 12,
    minPlayers: 3,
    maxPlayers: 50,
    duration: 7,
    energy: "medium",
    goal: "competition",
    type: "QUICK_QUIZ",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "HelpCircle",
    accentColor: "#3B82F6",
    whyRecommended: "أسئلة لطيفة تمنح الأطفال شعوراً بالفخر والذكاء عند اكتشاف الحل.",
    instructions: {
      overviewAr: "يقرأ الطفل الفزورة ويختار الإجابة الصحيحة بالصورة والأيقونة.",
      hostAr: ["امدح إجابات الأطفال وشجع التفكير المشترك."],
      participantAr: ["فكر بالحل الذكي واضغط على الخيار الفائز!"]
    },
    rounds: [
      {
        id: "kr-1",
        roundNumber: 1,
        promptAr: "لدي أسنان كثيرة ولكني لا أعض أحداً أبداً.. فما أنا؟",
        optionsAr: ["المشط 🪮", "المنشار 🪚", "التمساح 🐊", "الشوكة 🍴"],
        correctAnswer: 0,
        timeLimit: 20
      },
      {
        id: "kr-2",
        roundNumber: 2,
        promptAr: "أمشي معك نهاراً في كل مكان، وأختفي ليلاً عندما ينطفئ النور؟",
        optionsAr: ["ظلك 👤", "حذاؤك 👟", "حقيبتك 🎒", "قبعتك 🧢"],
        correctAnswer: 0,
        timeLimit: 20
      }
    ]
  },
  {
    id: "act-kids-where-is-hidden",
    slug: "kids-where-is-hidden",
    titleAr: "أين اختفت الصورة؟ 🔎",
    titleEn: "Where Did It Go?",
    taglineAr: "3 صور تظهر ثم تختفي واحدة منها بسرعة.. أي صورة مفقودة؟",
    descriptionAr: "لعبة ملاحظة بصرية سريعة تختبر ذاكرة الأطفال القصيرة بأشكال كرتونية مرحة.",
    category: "KIDS",
    audience: "kids",
    kidsAgeGroup: "4-6",
    minAge: 4,
    maxAge: 7,
    minPlayers: 2,
    maxPlayers: 30,
    duration: 5,
    energy: "medium",
    goal: "icebreaker",
    type: "QUICK_QUIZ",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Eye",
    accentColor: "#10B981",
    whyRecommended: "تحدٍ بصري لطيف ينمي سرعة البديهة للصغار.",
    instructions: {
      overviewAr: "احفظ الصور الثلاث، ثم اختر الصورة التي اختفت.",
      hostAr: ["اعرض الصور لثوانٍ ثم اسأل الأطفال عما ينقص."],
      participantAr: ["ركز عينيك جيداً واكتشف الشكل الناقص!"]
    },
    rounds: [
      {
        id: "kwh-1",
        roundNumber: 1,
        promptAr: "كانت هناك ثلاث فواكه: 🍎 تفاحة، 🍌 موزة، 🍇 عنب.. واختفت واحدة! ما هي؟",
        optionsAr: ["الموزة 🍌", "التفاحة 🍎", "العنب 🍇", "الفراولة 🍓"],
        correctAnswer: 0,
        timeLimit: 15
      }
    ]
  },
  {
    id: "act-kids-draw-and-guess",
    slug: "kids-draw-and-guess",
    titleAr: "ارسم وخمّن 🎨",
    titleEn: "Draw & Guess Kids",
    taglineAr: "ارسم خطوطاً بسيطة على السبورة واجعل أصدقاءك يخمنون الرسمة!",
    descriptionAr: "تحدي رسم عفوي وسريع للأطفال، يطلق مخيلتهم الفنية وتعبيرهم الحر.",
    category: "KIDS",
    audience: "kids",
    kidsAgeGroup: "7-9",
    minAge: 6,
    maxAge: 10,
    minPlayers: 4,
    maxPlayers: 30,
    duration: 8,
    energy: "high",
    goal: "creativity",
    type: "SIXTY_SEC_CHALLENGE",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: true,
    competitive: true,
    cooperative: true,
    isPlayable: true,
    iconName: "Edit",
    accentColor: "#F59E0B",
    whyRecommended: "يحفز مهارات الرسم والتعبير البصري للأطفال.",
    instructions: {
      overviewAr: "طفل يرسم شكلاً مألوفاً والأطفال يخمنون الرسمة قبل انتهاء الدقيقة.",
      hostAr: ["شجع الرسام الصغير وامنحه الكلمة السرية."],
      participantAr: ["ارسم التفاصيل الأبرز ودع أصدقاءك يصرخون بالحل!"]
    },
    rounds: [
      {
        id: "kdg-1",
        roundNumber: 1,
        promptAr: "الكلمة السرية للرسم السريع: 'شمس تبتسم وخلفها سحابة تمطر' ☀️🌧️",
        subtitleAr: "لديك 60 ثانية لرسمها على السبورة أو الورقة!",
        timeLimit: 60
      }
    ]
  },
  {
    id: "act-kids-odd-one-out",
    slug: "kids-odd-one-out",
    titleAr: "ما الشيء المختلف؟ 🧐",
    titleEn: "Odd One Out",
    taglineAr: "أربعة أشياء تبدو متشابهة.. لكن واحداً منها لا ينتمي لهذه العائلة!",
    descriptionAr: "نشاط تصنيف معرفي ممتع للأطفال يساعدهم على ربط المفاهيم والبيئات الحيوية.",
    category: "KIDS",
    audience: "kids",
    kidsAgeGroup: "7-9",
    minAge: 6,
    maxAge: 10,
    minPlayers: 2,
    maxPlayers: 40,
    duration: 5,
    energy: "medium",
    goal: "competition",
    type: "QUICK_QUIZ",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "Layers",
    accentColor: "#6366F1",
    whyRecommended: "ينمي التفكير المنطقي ومهارة التصنيف والمقارنة.",
    instructions: {
      overviewAr: "اختر العنصر الذي لا يشارك باقي المجموعة نفس الخاصية.",
      hostAr: ["اسأل الطفل عن سبب اعتباره لهذا العنصر مختلفاً."],
      participantAr: ["انظر للعناصر جيداً واكتشف العنصر الدخيل!"]
    },
    rounds: [
      {
        id: "ooo-1",
        roundNumber: 1,
        promptAr: "أي من هذه الأشياء لا ينتمي للبقية؟ (كلها تطير في الهواء ما عدا واحد):",
        optionsAr: ["السيارة 🚗", "العصفور 🐦", "الفراشة 🦋", "الطائرة ✈️"],
        correctAnswer: 0,
        timeLimit: 15
      },
      {
        id: "ooo-2",
        roundNumber: 2,
        promptAr: "أي من هذه الأطعمة خضار وليس فاكهة حلوة؟",
        optionsAr: ["الخيار 🥒", "التفاح 🍎", "الموز 🍌", "البرتقال 🍊"],
        correctAnswer: 0,
        timeLimit: 15
      }
    ]
  },
  {
    id: "act-kids-mystery-box",
    slug: "kids-mystery-box",
    titleAr: "صندوق الأسرار العجيب 🎁",
    titleEn: "The Mystery Box",
    taglineAr: "أدخل يدك في الصندوق دون أن تنظر، واكتشف الشيء بالملمس فقط!",
    descriptionAr: "تجربة حسية ممتازة لتعزيز حاسة اللمس والتركيز دون الاعتماد على البصر فقط.",
    category: "KIDS",
    audience: "kids",
    kidsAgeGroup: "4-6",
    minAge: 4,
    maxAge: 8,
    minPlayers: 3,
    maxPlayers: 20,
    duration: 7,
    energy: "medium",
    goal: "icebreaker",
    type: "SIXTY_SEC_CHALLENGE",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: true,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Package",
    accentColor: "#EC4899",
    whyRecommended: "يقوي حاسة اللمس والتركيز الحسي لدى الأطفال.",
    instructions: {
      overviewAr: "يلمس الطفل غرضاً مخفياً داخل صندوق قماشي ويصف ملمسه لأصدقائه.",
      hostAr: ["ضع ألعاباً آمنة كألعاب مطاطية أو فرشاة أو إسفنجة."],
      participantAr: ["المس بحذر واشرح: هل هو ناعم أم خشن؟ كبير أم صغير؟"]
    },
    rounds: [
      {
        id: "kmb-1",
        roundNumber: 1,
        promptAr: "تحدي اللمس: أدخل يدك في الصندوق، هل الغرض ناعم كالإسفنج أم صلب كالخشب؟",
        subtitleAr: "لديك 30 ثانية لتخمين ما بداخل الصندوق بالملمس فقط!",
        timeLimit: 30
      }
    ]
  },
  {
    id: "act-kids-story-train",
    slug: "kids-story-train",
    titleAr: "قطار الحكايات العجيبة 🚂",
    titleEn: "The Story Train",
    taglineAr: "أنا أبدأ بجملة، وأنت تكمل بجملة.. لنصنع معاً قصة خيالية مضحكة!",
    descriptionAr: "نشاط حواري وبنائي ينمي مهارات التعبير السردي والخيال الجماعي اللامحدود.",
    category: "KIDS",
    audience: "kids",
    kidsAgeGroup: "all",
    minAge: 5,
    maxAge: 12,
    minPlayers: 4,
    maxPlayers: 25,
    duration: 8,
    energy: "medium",
    goal: "creativity",
    type: "KIDS_MOVEMENT",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "BookOpen",
    accentColor: "#14B8A6",
    whyRecommended: "يطلق العنان لخيال الأطفال التعبيري وسرد القصص.",
    instructions: {
      overviewAr: "كل طفل يضيف فكرة جديدة أو شخصية مفاجئة للقصة المشتركة.",
      hostAr: ["ابدأ ببداية مشوقة مثل: 'في يوم من الأيام طار فيل وردي فوق مدرستنا...'."],
      participantAr: ["أضف مغامرة جديدة مضحكة لما قاله صديقك قبلك."]
    },
    rounds: [
      {
        id: "st-1",
        roundNumber: 1,
        promptAr: "بداية القصة: 'استيقظ أرنب أزرق صغير فوجد في حديقته صاروخاً من الشوكولاتة...'!",
        subtitleAr: "كل طفل في الدائرة يضيف جملة واحدة تكمل المغامرة!",
        timeLimit: 60
      }
    ]
  },
  {
    id: "act-kids-animal-orchestra",
    slug: "kids-animal-orchestra",
    titleAr: "أوركسترا أصوات الغابة 🎶",
    titleEn: "Animal Sound Orchestra",
    taglineAr: "كل طفل يمثل حيواناً.. وعند إشارة القائد، نعزف معاً سيمفونية الطبيعة!",
    descriptionAr: "نشاط صوتي وإيقاعي بهيج يدمج أصوات الطبيعة والحيوانات في تدريب جماعي رائع.",
    category: "KIDS",
    audience: "kids",
    kidsAgeGroup: "4-6",
    minAge: 4,
    maxAge: 7,
    minPlayers: 4,
    maxPlayers: 30,
    duration: 6,
    energy: "high",
    goal: "laughter",
    type: "KIDS_MOVEMENT",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Music",
    accentColor: "#F97316",
    whyRecommended: "ينشط الحبال الصوتية والإيقاع والتناغم بين الأطفال.",
    instructions: {
      overviewAr: "الميسر يقود كورال الأطفال بأصوات القطط والطيور والأسود بالتناوب.",
      hostAr: ["ارفع يدك ليعلو الصوت، واخفضها ليهمس الأطفال بنعومة."],
      participantAr: ["أخرج صوت حيوانك المفضل بأعلى طاقة ممكنة!"]
    },
    rounds: [
      {
        id: "kao-1",
        roundNumber: 1,
        promptAr: "كورال الحيوانات: الفريق الأول يقلد مواء القطط 🐱، والثاني زئير الأسود 🦁، والثالث تغريد البلابل 🐦!",
        subtitleAr: "عند رفع يد الميسر يرتفع الصوت معاً!",
        timeLimit: 40
      }
    ]
  },
  {
    id: "act-kids-balance-walk",
    slug: "kids-balance-walk",
    titleAr: "تحدي جسر التوازن الخيالي 🌉",
    titleEn: "The Balance Beam",
    taglineAr: "امشِ فوق خط مستقيم على الأرض كأنك تعبر جسراً فوق نهر مليء بالحلوى!",
    descriptionAr: "تمرين توازن حركي ممتع يعزز التناسق العضلي والتركيز البصري للأطفال الصغار.",
    category: "KIDS",
    audience: "kids",
    kidsAgeGroup: "4-6",
    minAge: 4,
    maxAge: 7,
    minPlayers: 2,
    maxPlayers: 20,
    duration: 5,
    energy: "medium",
    goal: "energizer",
    type: "KIDS_MOVEMENT",
    requiresPhone: false,
    requiresScreen: false,
    requiresMovement: true,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Shield",
    accentColor: "#3B82F6",
    whyRecommended: "ينمي التوازن والتحكم الحركي بدقة.",
    instructions: {
      overviewAr: "المشي على شريط لاصق أو خط السجاد دون السقوط يميناً أو يساراً.",
      hostAr: ["شجع الطفل برفع ذراعيه كجناحي طائر للمحافظة على التوازن."],
      participantAr: ["حافظ على هدوئك وتقدم خطوة وراء خطوة بكل ثقة!"]
    },
    rounds: [
      {
        id: "bw-1",
        roundNumber: 1,
        promptAr: "تحدي عبور الجسر الخيالي: امشِ على الخط المستقيم واضعاً قدمك أمام الأخرى دون اهتزاز!",
        subtitleAr: "افرد ذراعيك كجناحي نسر عملاق لتحافظ على توازنك!",
        timeLimit: 30
      }
    ]
  },
  {
    id: "act-kids-who-is-fastest",
    slug: "kids-who-is-fastest",
    titleAr: "سباق ردة الفعل اللطيفة ⚡",
    titleEn: "Lightning Reflexes Kids",
    taglineAr: "ضع يديك خلف ظهرك.. وعند سماع الكلمة السحرية، المس البطاقة الفائزة!",
    descriptionAr: "تحدي سرعة بديهة خفيف ومحفز للأطفال الصغار لتعلم التركيز السمعي السريع.",
    category: "KIDS",
    audience: "kids",
    kidsAgeGroup: "7-9",
    minAge: 6,
    maxAge: 10,
    minPlayers: 2,
    maxPlayers: 30,
    duration: 5,
    energy: "high",
    goal: "competition",
    type: "QUICK_QUIZ",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "Zap",
    accentColor: "#EF4444",
    whyRecommended: "يشعل التحدي وسرعة رد الفعل الممتعة للأطفال.",
    instructions: {
      overviewAr: "المتسابقون ينتبهون للإشارة، وأسرع لمسة تفوز بالنقطة.",
      hostAr: ["استخدم كلمات تشتيت كوميدية قبل نطق الكلمة السحرية."],
      participantAr: ["لا تتعجل حتى تسمع الكلمة بالضبط ثم المس الهدف!"]
    },
    rounds: [
      {
        id: "kwf-1",
        roundNumber: 1,
        promptAr: "أسرع لمسة تفوز: اضغط على الدائرة الخضراء فور ظهورها على شاشتك! 🟢",
        optionsAr: ["لمستُ الدائرة الخضراء أولاً! 🟢", "أنا الأسرع في فريقي! ⚡", "سأكون أسرع في المرة القادمة! 🚀", "تحدٍ ممتع! 😄"],
        correctAnswer: 0,
        timeLimit: 10
      }
    ]
  },
  {
    id: "act-kids-balloon-volleyball",
    slug: "kids-balloon-volleyball",
    titleAr: "كرة طائرة البالون الطائر 🎈",
    titleEn: "Balloon Volleyball",
    taglineAr: "ممنوع أن يلمس البالون الأرض! تعاونوا لإبقائه محلقاً في الهواء!",
    descriptionAr: "لعبة تعاونية حركية تجعل الجميع يركض ويضحك معاً دون أي خطر أو تصادم.",
    category: "KIDS",
    audience: "kids",
    kidsAgeGroup: "all",
    minAge: 4,
    maxAge: 12,
    minPlayers: 3,
    maxPlayers: 25,
    duration: 6,
    energy: "high",
    goal: "cooperation",
    type: "KIDS_MOVEMENT",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: true,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Sun",
    accentColor: "#F59E0B",
    whyRecommended: "تحدي تعاوني حركي آمن ومبهج للأطفال.",
    instructions: {
      overviewAr: "يتعاون الأطفال لتمرير البالون فيما بينهم لأطول عدد ضربات دون سقوطه.",
      hostAr: ["احسب عدد الضربات بصوت مرتفع وحمسهم لتحطيم الرقم القياسي."],
      participantAr: ["ادعم زميلك ولا تدع البالون يهبط نحو الأرض!"]
    },
    rounds: [
      {
        id: "kbv-1",
        roundNumber: 1,
        promptAr: "تحدي الـ 20 لمسة: ابقوا البالون محلقاً في الهواء بالتعاون بينكم دون أن يلمس الأرض!",
        subtitleAr: "احسبوا بصوت عالٍ مع كل لمسة: 1، 2، 3...",
        timeLimit: 45
      }
    ]
  },
  {
    id: "act-kids-emoji-moods",
    slug: "kids-emoji-moods",
    titleAr: "مرآة المشاعر والإيموجي 😊",
    titleEn: "Feelings Mirror",
    taglineAr: "كيف وجهك عندما تفرح؟ كيف وجهك عندما تتفاجأ؟ قلد الوجوه الضاحكة!",
    descriptionAr: "نشاط ذكاء عاطفي للأطفال للتعرف على المشاعر الإنسانية والتعبير عنها بالملامح.",
    category: "KIDS",
    audience: "kids",
    kidsAgeGroup: "4-6",
    minAge: 4,
    maxAge: 8,
    minPlayers: 2,
    maxPlayers: 30,
    duration: 5,
    energy: "medium",
    goal: "icebreaker",
    type: "KIDS_MOVEMENT",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Heart",
    accentColor: "#EC4899",
    whyRecommended: "يعلم الأطفال التعبير عن مشاعرهم والتعاطف بمرح.",
    instructions: {
      overviewAr: "يعرض الميسر إيموجي معين، ويقوم الأطفال بتمثيل التعبير بوجههم أمام المرآة أو الزملاء.",
      hostAr: ["ناقش معهم متى نشعر بهذه المشاعر وكيف نسعد بعضنا."],
      participantAr: ["ابتسم بأوسع ابتسامة ممكنة وأضحك أصدقاءك!"]
    },
    rounds: [
      {
        id: "kem-1",
        roundNumber: 1,
        promptAr: "قلد هذا الوجه البهيج: ابتسامة عريضة جداً تملأ الوجه بالبهجة والفرح! 😄✨",
        subtitleAr: "أظهروا أجمل ابتساماتكم لأصدقائكم!",
        timeLimit: 20
      },
      {
        id: "kem-2",
        roundNumber: 2,
        promptAr: "قلد وجه المفاجأة السعيدة: عيون واسعة وفم مفتوح بدهشة وانبهار! 😲🎉",
        subtitleAr: "كأنك فتحت هدية ووجدت لعبتك المفضلة تماماً!",
        timeLimit: 20
      }
    ]
  },
  {
    id: "act-kids-shadow-animals",
    slug: "kids-shadow-animals",
    titleAr: "مسرح ظلال الحيوانات 🐇",
    titleEn: "Shadow Puppet Animals",
    taglineAr: "بأصابع يديك وقليل من الضوء.. اصنع ظلاً لأرنب يقفز أو طائر يحلق!",
    descriptionAr: "إحياء فن مسرح خيال الظل اليدوي لتعليم الأطفال مهارات التحكم الدقيق بالأصابع.",
    category: "KIDS",
    audience: "kids",
    kidsAgeGroup: "7-9",
    minAge: 6,
    maxAge: 10,
    minPlayers: 2,
    maxPlayers: 20,
    duration: 7,
    energy: "calm",
    goal: "creativity",
    type: "KIDS_MOVEMENT",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Moon",
    accentColor: "#8B5CF6",
    whyRecommended: "ينمي الدقة الحركية للأصابع والإبداع التخيلي.",
    instructions: {
      overviewAr: "توجيه إضاءة الهاتف أو المصباح نحو الحائط لصنع أشكال يدوية.",
      hostAr: ["اعرض الدليل المصور لحركات الأصابع وشجعهم على التجربة."],
      participantAr: ["حرك أصابعك كأذني أرنب تشاهدها على الحائط!"]
    },
    rounds: [
      {
        id: "ksa-1",
        roundNumber: 1,
        promptAr: "اصنع بأصابع يدك أذني أرنب لطيف يقفز ويحرك أذنيه على الحائط! 🐰✋",
        subtitleAr: "شاهد الظل على الجدار وحرك إصبعيك بلطف!",
        timeLimit: 30
      }
    ]
  },
  {
    id: "act-kids-space-journey",
    slug: "kids-space-journey",
    titleAr: "رحلة الفضاء التخيلية 🚀",
    titleEn: "Space Odyssey Kids",
    taglineAr: "اربطوا أحزمة الأمان.. صاروخ شرارة ينطلق الآن في رحلة خيالية إلى المريخ!",
    descriptionAr: "سرد تفاعلي خيالي يجعل الأطفال يتفاعلون مع مطبات الفضاء وانعدام الجاذبية ومقابلة كائنات فضائية لطيفة.",
    category: "KIDS",
    audience: "kids",
    kidsAgeGroup: "all",
    minAge: 5,
    maxAge: 12,
    minPlayers: 4,
    maxPlayers: 50,
    duration: 8,
    energy: "high",
    goal: "creativity",
    type: "KIDS_MOVEMENT",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Compass",
    accentColor: "#6366F1",
    whyRecommended: "رحلة خيالية حركية ملحمية يحبها جميع الأطفال.",
    instructions: {
      overviewAr: "الميسر يقود رحلة فضائية بالأوامر الصوتية الحركية (عد تنازلي، انطلاق، تجنب النيازك).",
      hostAr: ["عش الدور كقائد مركبة الفضاء وتفاعل مع أصوات المحركات."],
      participantAr: ["اقفز لتتفادى النيازك وتمايل مع اهتزازات الصاروخ!"]
    },
    rounds: [
      {
        id: "ksj-1",
        roundNumber: 1,
        promptAr: "الاستعداد للإطلاق الفضائي: 5، 4، 3، 2، 1.. انطلاق! اقفزوا واهتزوا مع محركات الصاروخ! 🚀🌌",
        subtitleAr: "انعدام الجاذبية الآن.. تمايلوا ببطء كالرواد في الفضاء!",
        timeLimit: 30
      },
      {
        id: "ksj-2",
        roundNumber: 2,
        promptAr: "احذروا النيازك الفضائية! انحنوا لليمين ولليسار لتفادي الصخور الفضائية السريعة! ☄️🛸",
        subtitleAr: "هبطنا بنجاح على كوكب الحلوى والزهور! 🌸🍬",
        timeLimit: 30
      }
    ]
  }
];

const ALL_RAW_ACTIVITIES: Activity[] = [
  ...ADULT_ACTIVITIES,
  ...ISLAMIC_ACTIVITIES,
  ...ARABIC_ACTIVITIES,
  ...KIDS_ACTIVITIES,
  ...BASE_ACTIVITIES,
];

const seenSlugs = new Set<string>();
export const ACTIVITIES: Activity[] = ALL_RAW_ACTIVITIES
  .map((act) => ({
    ...act,
    rounds: act.rounds ? act.rounds.map(randomizeRoundOptions) : undefined,
  }))
  .filter((act) => {
    if (seenSlugs.has(act.slug)) return false;
    seenSlugs.add(act.slug);
    return true;
  });

// Helper functions to query activities
export function getAllActivities(): Activity[] {
  return ACTIVITIES;
}

export function getActivityBySlug(slug: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.slug === slug || a.id === slug);
}

export function getActivitiesByAudience(audience: "adults" | "kids"): Activity[] {
  if (audience === "kids") {
    return ACTIVITIES.filter((a) => a.audience === "kids");
  }
  return ACTIVITIES.filter((a) => a.audience === "adults" || a.audience === "mixed");
}

export function getIslamicActivities(): Activity[] {
  return ACTIVITIES.filter((a) => a.faithContent || a.category === ("ISLAMIC" as any));
}

export function getArabicActivities(): Activity[] {
  return ACTIVITIES.filter((a) => a.languageContent || a.tags?.includes("arabic"));
}

export function getActivitiesByCategory(category: string): Activity[] {
  return ACTIVITIES.filter((a) => a.category === category);
}

