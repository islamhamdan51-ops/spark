import { Activity } from "@/types";
import { THIS_OR_THAT_BANK } from "../questions/this-or-that-prompts";
import { QUICK_QUIZ_BANK } from "../questions/quick-quiz-questions";
import { CHARADES_PROMPT_BANK, FIND_SOMEONE_WHO_BANK, SIXTY_SEC_CHALLENGES } from "../questions/facilitation-prompts";

export const ADULT_ACTIVITIES: Activity[] = [
  // 1. THIS OR THAT (Flagship Playable - 30 Prompts Pool)
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
    whyRecommended: "مثالي لكسر الجمود فوراً وبدء التفاعل الجماعي بنقرة واحدة بدون أي حاجة لتحضير مسبق.",
    instructions: {
      overviewAr: "تظهر شاشة السؤال خيارين كبيرين. يصوت كل مشارك بنقرة واحدة، لتظهر الإحصائيات الحية لحظياً.",
      hostAr: [
        "أطلق النشاط واعرض الشاشة للمجموعة.",
        "علق على تباين إجابات المشاركين بعد كل جولة لإشعال النقاش والضحك.",
        "اضغط 'التالي' للمرور للجولة التالية."
      ],
      participantAr: [
        "انظر لشاشة هاتفك واختر الخيار الأقرب لشخصيتك.",
        "شاهد أين يقف باقي زملائك على الشاشة الكبيرة!"
      ]
    },
    rounds: THIS_OR_THAT_BANK.slice(0, 15).map((p, idx) => ({
      id: `tot-r-${idx + 1}`,
      roundNumber: idx + 1,
      promptAr: p.promptAr,
      subtitleAr: p.subtitleAr,
      optionsAr: [p.optionA, p.optionB],
      timeLimit: p.timeLimit,
    })),
  },

  // 2. QUICK QUIZ (Flagship Playable - 15 Prompts Pool)
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
    duration: 5,
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
    accentColor: "#F59E0B",
    whyRecommended: "يرفع حماس القاعة فوراً بروح التنافس والضحك على الأسئلة غير المتوقعة.",
    instructions: {
      overviewAr: "يظهر السؤال على الشاشة الرئيسية مع مؤقت سريع وتظهر 4 أزرار ملونة بهواتف المشاركين.",
      hostAr: [
        "شجع المتسابقين على السرعة والتركيز.",
        "اقرأ الشرح اللطيف بعد ظهور الإجابة الصحيحة.",
        "اعرض لوحة الصدارة بعد كل جولتين."
      ],
      participantAr: [
        "اقرأ السؤال على الشاشة واضغط على الزر المطابق على هاتفك بأسرع ما يمكن!",
        "الإجابة الأسرع تمنحك نقاطاً مضاعفة."
      ]
    },
    rounds: QUICK_QUIZ_BANK.map((q, idx) => ({
      id: `quiz-r-${idx + 1}`,
      roundNumber: idx + 1,
      promptAr: q.promptAr,
      subtitleAr: q.subtitleAr,
      optionsAr: q.optionsAr,
      correctAnswer: q.correctAnswer,
      timeLimit: q.timeLimit,
    })),
  },

  // 3. WORD CLOUD (Flagship Playable - 5 Rounds)
  {
    id: "act-word-cloud",
    slug: "word-cloud",
    titleAr: "سحابة المشاعر والأفكار",
    titleEn: "Word Cloud Spark",
    taglineAr: "كلمة واحدة من كل مشارك تصنع لوحة بصرية تلخص نبض المجموعة!",
    descriptionAr: "يكتب كل مشارك كلمة أو كلمتين تعبر عن شعوره أو تطلعاته. تتجمع الكلمات لحظياً في سحابة بصرية يكبر فيها حجم الكلمات الأكثر تكراراً.",
    category: "CREATIVE",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 150,
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
    accentColor: "#6366F1",
    whyRecommended: "خيار رائع لبدء الورشات ومعرفة الحالة المزاجية وتطلعات الحاضرين دون إحراج.",
    instructions: {
      overviewAr: "يقوم كل شخص بإرسال كلمة واحدة من هاتفه، وتظهر السحابة التفاعلية أمام الجميع على الشاشة.",
      hostAr: [
        "اطرح السؤال وانتظر ظهور الكلمات تدريجياً.",
        "علق على الكلمات البارزة وادعُ أصحابها لتوضيح سبب اختيارها باختصار."
      ],
      participantAr: [
        "اكتب كلمة واحدة معبرة ودقيقة واضغط إرسال.",
        "شاهد كلمتك تنضم إلى سحابة كلمات زملائك!"
      ]
    },
    rounds: [
      {
        id: "wc-1",
        roundNumber: 1,
        promptAr: "بكلمة واحدة فقط: كيف تصف طاقتك ومشاعرك في بداية هذا اللقاء؟",
        subtitleAr: "اكتب ما يخطر ببالك الآن مباشرة وبصدق",
        timeLimit: 30,
        optionsAr: ["متحمس 🔥", "متفائل 🌟", "فضولي 🧐", "هادئ 🌿", "محتاج قهوة ☕"]
      },
      {
        id: "wc-2",
        roundNumber: 2,
        promptAr: "ما القيمة الأكثر أهمية بالنسبة لك في بيئة العمل الجماعي؟",
        subtitleAr: "ركيزة النجاح المشترك",
        timeLimit: 30,
        optionsAr: ["الاحترام المتبادل 🤝", "الشفافية والوضوح 💡", "التعاون الصادق 🧩", "المرونة والإبداع 🚀", "تقدير الجهد ❤️"]
      },
      {
        id: "wc-3",
        roundNumber: 3,
        promptAr: "ما الشيء الذي تأمل أن تخرج به اليوم من هذا اللقاء؟",
        subtitleAr: "كلمة واحدة تختصر تطلعاتك",
        timeLimit: 30,
        optionsAr: ["إلهام جديد ✨", "أفكار عملية 🛠️", "علاقات وطيدة 🤝", "طاقة إيجابية ⚡", "حلول لتحدياتنا 🎯"]
      }
    ]
  },

  // 4. TWO TRUTHS AND A LIE (Flagship Playable)
  {
    id: "act-two-truths-and-a-lie",
    slug: "two-truths-and-a-lie",
    titleAr: "حقيقتان وكذبة",
    titleEn: "Two Truths & A Lie",
    taglineAr: "ثلاث عبارات مدهشة.. واحدة منها خادعة تماماً! هل تستطيع كشفها؟",
    descriptionAr: "لعبة كسر الجمود الكلاسيكية بحلة رقمية. تعرض 3 معلومات مثيرة عن أشخاص أو حقائق عامة، ويصوت الجميع لاكتشاف العبارة الكاذبة.",
    category: "SOCIAL",
    audience: "adults",
    minAge: 13,
    maxAge: 99,
    minPlayers: 3,
    maxPlayers: 50,
    duration: 10,
    energy: "medium",
    goal: "laughter",
    type: "TWO_TRUTHS_AND_A_LIE",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "ShieldAlert",
    accentColor: "#F43F5E",
    whyRecommended: "تولد ضحكاً وفضولاً عارماً وتكشف معلومات مفاجئة ومسلية عن المشاركين.",
    instructions: {
      overviewAr: "تعرض الشاشة 3 عبارات محيرة. يصوت الجمهور لتحديد الكذبة، ثم يُكشف الستار عن الحقيقة الصادمة!",
      hostAr: [
        "اعرض العبارات الثلاث واطلب من الجمهور التدقيق في ملامح الشخص أو منطقية العبارات.",
        "بعد التصويت، اطلب من صاحب العبارات إعلان الكذبة وشرح قصة الحقيقتين!"
      ],
      participantAr: [
        "فكر جيداً واكتشف العبارة الملفقة وصوت لها من هاتفك."
      ]
    },
    rounds: [
      {
        id: "ttal-1",
        roundNumber: 1,
        promptAr: "أي من هذه العبارات الثلاث عن عالم الحيوان تعتبر 'كذبة ملفقة'؟",
        subtitleAr: "دقق في الحقائق المدهشة!",
        optionsAr: [
          "النمل لا ينام إطلاقاً طوال حياته (حقيقة) 🐜",
          "الفراشات تتذوق بأقدامها وليس بلسانها (حقيقة) 🦋",
          "النعامة تدفن رأسها في الرمال خوفاً من الخطر (هذه هي الكذبة!) 🪶"
        ],
        correctAnswer: 2,
        timeLimit: 25,
      },
      {
        id: "ttal-2",
        roundNumber: 2,
        promptAr: "أي من هذه المعلومات التاريخية تعتبر كذبة؟",
        subtitleAr: "اختبر ذاكرتك التاريخية",
        optionsAr: [
          "العرب القدماء أول من صنع الصابون المعطر وزيت الغار (حقيقة) 🧼",
          "نابليون بونابرت كان رجلاً فائق القصر مقارنة بأهل زمانه (هذه الكذبة الشائعة!) ⚔️",
          "جامعة القرويين بفاس أقدم جامعة مستمرة في العالم (حقيقة) 🏛️"
        ],
        correctAnswer: 1,
        timeLimit: 25,
      },
      {
        id: "ttal-3",
        roundNumber: 3,
        promptAr: "عادات الشعوب: أي معلومة من هذه الثلاثة غير صحيحة؟",
        subtitleAr: "ثقافات حول العالم",
        optionsAr: [
          "في اليابان، يعتبر إصدار صوت أثناء أكل الشوربة دليلاً على إعجابك بالطعام (حقيقة) 🍜",
          "في إيطاليا، ممنوع قانونياً طلب البيتزا مع الأناناس (هذه كذبة طريفة!) 🍕",
          "في إثيوبيا، التقويم السنوي يتكون من 13 شهراً (حقيقة) 📅"
        ],
        correctAnswer: 1,
        timeLimit: 25,
      }
    ]
  },

  // 5. RAPID FIRE (Flagship Playable - 60 Second Challenge)
  {
    id: "act-rapid-fire",
    slug: "rapid-fire",
    titleAr: "إطلاق سريع (Rapid Fire)",
    titleEn: "Rapid Fire Challenge",
    taglineAr: "أسئلة خاطفة بمؤقت 10 ثوانٍ لكل سؤال.. لا وقت للتردد!",
    descriptionAr: "جولات فائقة السرعة تتطلب نباهة خاطفة. تظهر الأسئلة وتختفي كالبرق ليحصد الفائزون أعلى المراكز.",
    category: "ENERGY",
    audience: "adults",
    minAge: 13,
    maxAge: 99,
    minPlayers: 4,
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
    accentColor: "#FF5722",
    whyRecommended: "الحل السريع عند ضيق الوقت، يضخ الطاقة وينعش الحضور في 180 ثانية فقط.",
    instructions: {
      overviewAr: "سلسلة من 5 أسئلة فورية بمؤقت 10 ثوانٍ فقط لكل سؤال.",
      hostAr: ["أشعل الحماس بصوتك وعدّ تنازلياً مع الثواني الأخيرة."],
      participantAr: ["عيناك على الشاشة وإصبعك مستعد على هاتفك!"]
    },
    rounds: [
      {
        id: "rf-1",
        roundNumber: 1,
        promptAr: "ما هو الكوكب الملقب بـ 'الكوكب الأحمر'؟",
        optionsAr: ["المريخ 🔴", "المشتري 🪐", "الزهرة 🟡", "عطارد ⚪"],
        correctAnswer: 0,
        timeLimit: 10,
      },
      {
        id: "rf-2",
        roundNumber: 2,
        promptAr: "كم ثانية في 5 دقائق كاملة؟",
        optionsAr: ["300 ثانية", "250 ثانية", "350 ثانية", "500 ثانية"],
        correctAnswer: 0,
        timeLimit: 10,
      },
      {
        id: "rf-3",
        roundNumber: 3,
        promptAr: "ما هو أسرع حيوان بري على وجه الأرض؟",
        optionsAr: ["الفهد الصياد 🐆", "الغزال 🦌", "الأسد 🦁", "الحصان العربي 🐎"],
        correctAnswer: 0,
        timeLimit: 10,
      },
      {
        id: "rf-4",
        roundNumber: 4,
        promptAr: "ما هي العملة الرسمية للمملكة المغربية؟",
        optionsAr: ["الدرهم", "الدينار", "الريال", "الجنيه"],
        correctAnswer: 0,
        timeLimit: 10,
      },
      {
        id: "rf-5",
        roundNumber: 5,
        promptAr: "أكبر محيط على كوكب الأرض مساحةً وعمقاً:",
        optionsAr: ["المحيط الهادئ", "المحيط الأطلسي", "المحيط الهندي", "المحيط المتجمد"],
        correctAnswer: 0,
        timeLimit: 10,
      }
    ]
  },

  // 6. CHARADES (Facilitator - No Phones Required)
  {
    id: "act-charades",
    slug: "charades",
    titleAr: "تمثيل بلا كلام (Charades)",
    titleEn: "Charades Facilitator",
    taglineAr: "حركات وإشارات صامتة، وتخمينات مضحكة من القاعة بأكملها!",
    descriptionAr: "النشاط التنافسي الميداني الأفضل للمجموعات. يتطوع أحد المشاركين لتمثيل بطاقة سرية يراها فقط، وعلى فريقه أو القاعة التخمين قبل نفاد الوقت.",
    category: "MOVEMENT",
    audience: "adults",
    minAge: 10,
    maxAge: 99,
    minPlayers: 6,
    maxPlayers: 60,
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
    iconName: "Smile",
    accentColor: "#10B981",
    whyRecommended: "لا يحتاج هواتف، يكسر الخجل فوراً، ويحرك الجالسين بالضحك والحماس.",
    instructions: {
      overviewAr: "تظهر الكلمة السرية للممثل فقط، بينما يرى باقي الجمهور مؤقتاً كبيراً وتصنيف الكلمة.",
      hostAr: [
        "اختر متطوعاً واطلب منه الوقوف أمام المجموعة دون الالتفات للشاشة خلفه.",
        "اضغط 'عرض الكلمة سراً' واجعل الممثل يقرأها بمفرده.",
        "ابدأ المؤقت (60 ثانية) وشجع المجموعة على إطلاق التخمينات بصوت عالٍ!",
        "عندما ينجحون، اضغط 'تم التخمين بنجاح' لاحتساب النقاط."
      ],
      participantAr: [
        "إذا كنت الممثل: استخدم جسدك وإشارات يديك وتعابير وجهك فقط دون نطق أي حرف!",
        "إذا كنت في الجمهور: اصرخ بتخميناتك بسرعة قبل نهاية الدقيقة!"
      ],
      facilitatorSteps: [
        "قسم القاعة إلى فريقين (أ و ب).",
        "كل جولة يخرج ممثل من فريق ليمثل بطاقة لفريقه.",
        "الفريق الذي يخمن في أقل وقت يحصل على 100 نقطة."
      ]
    },
    rounds: CHARADES_PROMPT_BANK.map((c, idx) => ({
      id: `char-r-${idx + 1}`,
      roundNumber: idx + 1,
      promptAr: `الجولة ${idx + 1}: ${c.categoryAr}`,
      subtitleAr: c.facilitatorTipAr,
      secretWordAr: c.secretWordOrPromptAr,
      timeLimit: c.timeLimitSeconds,
      optionsAr: ["تم تخمين الكلمة بنجاح! 👏 (+100 نقطة)", "انتهى الوقت دون تخمين ⏱️"],
    }))
  },

  // 7. FIND SOMEONE WHO (Facilitator - Networking & Movement)
  {
    id: "act-find-someone-who",
    slug: "find-someone-who",
    titleAr: "ابحث عن شخص (Find Someone Who)",
    titleEn: "Find Someone Who",
    taglineAr: "تحرك في القاعة، صافح زملاءك، واعثر على من تنطبق عليه الأوصاف!",
    descriptionAr: "نشاط تعارف حركي استثنائي. تظهر بطاقات صفات وخبرات نادرة، ومهمة كل مشارك هي التجول ومحاورة زملائه لاكتشاف من يحمل هذه الصفة وتدوين اسمه.",
    category: "MOVEMENT",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 8,
    maxPlayers: 100,
    duration: 10,
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
    accentColor: "#F59E0B",
    whyRecommended: "يقضي على الجلوس الساكن ويجبر الجميع على التحدث مع أشخاص جدد بأسلوب ممتع ومرحب.",
    instructions: {
      overviewAr: "يعرض الميسر مهام البحث على الشاشة ويبدأ المؤقت، بينما يتحرك الجميع في القاعة.",
      hostAr: [
        "اطلب من الجميع الوقوف وترك مقاعدهم فوراً.",
        "اعرض التحديات على الشاشة واشرح القاعدة: 'لا يمكنك كتابة نفس الشخص لمرتين متتاليتين'.",
        "شجع من ينتهي أولاً على الصياح بكلمة 'شرارة!'"
      ],
      participantAr: [
        "تحرك في القاعة، واسأل زملاءك بلطف وعفوية.",
        "اكتشف قصصاً وتفاصيل مذهلة عن أشخاص تلتقي بهم لأول مرة!"
      ]
    },
    rounds: FIND_SOMEONE_WHO_BANK.slice(0, 5).map((f, idx) => ({
      id: `fsw-r-${idx + 1}`,
      roundNumber: idx + 1,
      promptAr: f.promptAr,
      subtitleAr: `تصنيف: ${f.categoryAr} — جائزة المهمة: ${f.points} نقطة`,
      timeLimit: 90,
      optionsAr: ["عثرت على الشخص وتعرفت عليه! 🤝", "ما زلت أبحث في القاعة 🏃"],
    }))
  },

  // 8. WOULD YOU RATHER (Playable Dilemmas)
  {
    id: "act-would-you-rather",
    slug: "would-you-rather",
    titleAr: "لو خيّروك (الاختيار الصعب)",
    titleEn: "Would You Rather",
    taglineAr: "مفترق طرق لا مفر منه.. أيهما تختار ولماذا؟",
    descriptionAr: "خيارات ذكية ومحرجة تجبر الجميع على اتخاذ موقف والدفاع عنه، مما يفتح نقاشات فلسفية وطريفة تثري الجلسة.",
    category: "DISCUSSION",
    audience: "adults",
    minAge: 13,
    maxAge: 99,
    minPlayers: 3,
    maxPlayers: 80,
    duration: 10,
    energy: "medium",
    goal: "discussion",
    type: "WOULD_YOU_RATHER",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "GitCommit",
    accentColor: "#8B5CF6",
    whyRecommended: "يطلق نقاشات عفوية عميقة ويكشف فلسفة تفكير الأشخاص في الحياة والعمل.",
    instructions: {
      overviewAr: "يصوت كل مشارك من هاتفه، ثم يتيح الميسر 60 ثانية لمناظرة ودية بين المعسكرين.",
      hostAr: [
        "اعرض الخيارين وشاهد انقسام النسب على الشاشة.",
        "اختر شخصاً من كل جانب واطلب منه إقناع الجانب الآخر بخياره!"
      ],
      participantAr: ["اختر بصدق واستعد لتبرير قرارك أمام زملائك!"]
    },
    rounds: [
      {
        id: "wyr-1",
        roundNumber: 1,
        promptAr: "لو خُيّرت في مسيرتك المهنية بين أمرين:",
        subtitleAr: "بوصلة النجاح الشخصي",
        optionsAr: [
          "راتب خيالي مضاعف ولكن في بيئة عمل رتيبة ومملة 💰",
          "راتب متوسط ولكن في عمل شغوف ملهم يغير العالم 🌟"
        ],
        timeLimit: 20,
      },
      {
        id: "wyr-2",
        roundNumber: 2,
        promptAr: "لو أتيح لك امتلاك قدرة خارقة واحدة للأبد:",
        subtitleAr: "ما الذي تختاره؟",
        optionsAr: [
          "ألا تحتاج للنوم أبداً وتبقى بطاقتك الكاملة 24 ساعة ⚡",
          "أن تقرأ أي كتاب في العالم وتتقن محتواه بمجرد لمس غلافه 📚"
        ],
        timeLimit: 20,
      },
      {
        id: "wyr-3",
        roundNumber: 3,
        promptAr: "في علاقاتك وصداقاتك الحقيقية:",
        subtitleAr: "أيهما تفضل دائماً؟",
        optionsAr: [
          "صديق واحد وفيّ جداً كأنه تؤأم روحك ومستودع سرك 🤝",
          "دائرة واسعة من 50 صديقاً مرحاً في كل مجال ومكان 🌍"
        ],
        timeLimit: 20,
      }
    ]
  },

  // 9. WHO KNOWS THE GROUP MORE? (Social Wit)
  {
    id: "act-who-knows-the-group",
    slug: "who-knows-the-group",
    titleAr: "من يعرف المجموعة أكثر؟",
    titleEn: "Who Knows The Group Best",
    taglineAr: "تحدي التخمين في عادات وتفضيلات أفراد الفريق!",
    descriptionAr: "يطرح المضيف أسئلة حول عادات المجموعة، ويخمن المشاركون النسبة الأكبر التي سيتفق عليها الحضور.",
    category: "SOCIAL",
    audience: "adults",
    minAge: 14,
    maxAge: 99,
    minPlayers: 5,
    maxPlayers: 50,
    duration: 10,
    energy: "medium",
    goal: "icebreaker",
    type: "QUICK_QUIZ",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "Eye",
    accentColor: "#EC4899",
    whyRecommended: "يعزز فهم الزملاء لبعضهم البعض ويوضح التناغم أو المفارقات بينهم.",
    instructions: {
      overviewAr: "كل شخص يصوت على سلوكه أولاً، ثم يخمن ما الذي صوتت له أغلبية القاعة.",
      hostAr: ["علق على المفاجآت عندما تكون النتيجة غير متوقعة للمجموعة."],
      participantAr: ["خمن كيف يفكر زملاؤك لتفوز بالنقاط."]
    },
    rounds: [
      {
        id: "wkg-1",
        roundNumber: 1,
        promptAr: "تخمين: كم نسبة الحاضرين في قاعتنا اليوم الذين وصلوا قبل موعد البدء بـ 15 دقيقة؟",
        optionsAr: ["أقل من 25% ⏱️", "بين 25% و 50% 🚗", "أكثر من 50% من القاعة 🏃", "الجميع تقريباً 🌟"],
        correctAnswer: 0,
        timeLimit: 15,
      },
      {
        id: "wkg-2",
        roundNumber: 2,
        promptAr: "تخمين: ما هو النشاط الذي يمارسه أغلب الحاضرين في أول 10 دقائق بعد الاستيقاظ؟",
        optionsAr: ["تفقد إشعارات الهاتف 📱", "صلاة الفجر وذكر الله 🤲", "شرب ماء أو قهوة ☕", "التأمل والاستعداد بهدوء 🌿"],
        correctAnswer: 0,
        timeLimit: 15,
      }
    ]
  },

  // 10. THE UNEXPECTED QUESTION (Deep Connection)
  {
    id: "act-the-unexpected-question",
    slug: "the-unexpected-question",
    titleAr: "سؤال غير متوقع",
    titleEn: "The Unexpected Question",
    taglineAr: "أسئلة تخرجك من الإجابات النمطية وتكشف الجانب الإنساني العميق!",
    descriptionAr: "أسئلة صممت بعناية لتجاوز الأحاديث الرسمية والسطحية إلى مواقف وتجارب شخصية ملهمة ومؤثرة.",
    category: "DISCUSSION",
    audience: "adults",
    minAge: 16,
    maxAge: 99,
    minPlayers: 3,
    maxPlayers: 30,
    duration: 15,
    energy: "calm",
    goal: "discussion",
    type: "DISCUSSION_STARTER",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "MessageCircle",
    accentColor: "#0284C7",
    whyRecommended: "ينقل أي لقاء من الرسمية الجافة إلى ألفة ودفء إنساني صادق.",
    instructions: {
      overviewAr: "تظهر بطاقة السؤال على الشاشة، ويجلس كل شخصين أو ثلاثة لمشاركة إجاباتهم لدقيقتين.",
      hostAr: [
        "وفر بيئة هادئة ومريحة، واطلب من الجميع الاستماع دون مقاطعة أو تقييم.",
        "بعد كل سؤال، اطلب من متطوع أو اثنين مشاركة أبرز ما تعلموه من زميلهم."
      ],
      participantAr: [
        "تحدث بعفوية وصدق وامنح زميلك أذنك وقلبك."
      ]
    },
    rounds: [
      {
        id: "uq-1",
        roundNumber: 1,
        promptAr: "ما هو أفضل درس أو نصيحة ذهبية تلقيتها في حياتك وغيرت طريقة تفكيرك؟",
        subtitleAr: "شارك الموقف مع زميلك المجاور",
        timeLimit: 120,
        optionsAr: ["تمت المشاركة والاستماع بتركيز 💡", "مستمرون في الحديث الممتع 🗣️"],
      },
      {
        id: "uq-2",
        roundNumber: 2,
        promptAr: "لو عدت 10 سنوات إلى الوراء وقابلت نفسك وأنت أصغر، ما النصيحة الوحيدة التي ستقولها لها؟",
        subtitleAr: "تأمل في الرحلة والخبرة",
        timeLimit: 120,
        optionsAr: ["شاركنا ذكريات ملهمة ⏳", "انتهينا من الجولة 👍"],
      },
      {
        id: "uq-3",
        roundNumber: 3,
        promptAr: "من هو الشخص الذي تعتبره بطلاً مجهولاً في مسيرتك وله فضل عظيم لم تشكره عليه بما يكفي؟",
        subtitleAr: "لحظة امتنان ووفاء",
        timeLimit: 120,
        optionsAr: ["تذكرنا أهل الفضل ودعونا لهم ❤️", "جاهزون للختام ✨"],
      }
    ]
  },

  // 11. SILENT CHALLENGE (Non-verbal Coordination)
  {
    id: "act-silent-challenge",
    slug: "silent-challenge",
    titleAr: "التحدي الصامت (Line-up)",
    titleEn: "Silent Lineup Challenge",
    taglineAr: "رتبوا أنفسكم في صف واحد وفق معيار سري.. بدون كلام إطلاقاً!",
    descriptionAr: "تحدي تواصل ذكي يعتمد على لغة الجسد والإشارات. يطلب من الفريق الاصطفاف حسب تاريخ الميلاد أو الطول أو أول حرف بالاسم في صمت تام.",
    category: "TEAM",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 8,
    maxPlayers: 40,
    duration: 5,
    energy: "high",
    goal: "cooperation",
    type: "TEAM_CHALLENGE",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "VolumeX",
    accentColor: "#7C3AED",
    whyRecommended: "يبني التنسيق والتفاهم غير اللفظي ويولد مواقف مضحكة للغاية بين الزملاء.",
    instructions: {
      overviewAr: "يقف الجميع في القاعة ويطلب منهم إنجاز الترتيب في صمت مطبق قبل انتهاء العداد.",
      hostAr: [
        "أعلن قاعدة التحدي: أي كلمة منطوقة تعيد العداد من الصفر!",
        "ابدأ المؤقت (3 دقائق) وراقب إبداع الإشارات ولغة العيون والأصابع."
      ],
      participantAr: ["استخدم أصابعك وإيماءاتك ولا تتكلم إطلاقاً!"]
    },
    rounds: [
      {
        id: "sc-1",
        roundNumber: 1,
        promptAr: "المهمة 1: رتبوا أنفسكم في صف مستقيم حسب 'شهر ويوم الميلاد' من يناير إلى ديسمبر، بدون أي كلمة!",
        subtitleAr: "المؤقت: دقيقتان — الصمت التام إلزامي!",
        timeLimit: 120,
        optionsAr: ["تم الاصطفاف بنجاح ودقة! 🎯", "أخطأنا في الترتيب ونحاول ثانية 😅"],
      },
      {
        id: "sc-2",
        roundNumber: 2,
        promptAr: "المهمة 2: رتبوا أنفسكم حسب 'عدد سنوات الخبرة أو العمل' من الأقل إلى الأكثر في صمت تام!",
        subtitleAr: "المؤقت: 90 ثانية",
        timeLimit: 90,
        optionsAr: ["أنجزنا المهمة كفريق واحد 👏", "انتهى الوقت ⏱️"],
      }
    ]
  },

  // 12. 60-SECOND CHALLENGE (Facilitator)
  {
    id: "act-sixty-second-challenge",
    slug: "sixty-second-challenge",
    titleAr: "تحدي الـ 60 ثانية",
    titleEn: "60-Second Challenge",
    taglineAr: "دقيقة واحدة لإنجاز مهمة بديهة مستحيلة أمام الحاضرين!",
    descriptionAr: "تحديات حماسية بمهام متنوعة (لغوية، حركية، سرعة) تحت ضغط المؤقت الكبير وصيحات الجمهور.",
    category: "ENERGY",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 50,
    duration: 5,
    energy: "high",
    goal: "competition",
    type: "SIXTY_SEC_CHALLENGE",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: true,
    iconName: "Clock",
    accentColor: "#EA580C",
    whyRecommended: "حماسي جداً للمسابقات الداخلية واللقاءات الترفيهية.",
    instructions: {
      overviewAr: "يخرج متسابق للمنصة وتبدأ شاشة المؤقت في العد التنازلي للـ 60 ثانية.",
      hostAr: ["عد مع المتسابق وألهب حماس الجمهور."],
      participantAr: ["حافظ على رباطة جأشك وركز على الهدف فقط."]
    },
    rounds: SIXTY_SEC_CHALLENGES.map((s, idx) => ({
      id: `ssc-r-${idx + 1}`,
      roundNumber: idx + 1,
      promptAr: s.promptAr,
      subtitleAr: s.facilitatorTipAr,
      timeLimit: s.timeLimit,
      optionsAr: ["تم إنجاز التحدي قبل انتهاء الوقت! 🎉 (+100 نقطة)", "انتهى الوقت دون إكمال ⏱️"],
    }))
  },

  // 13. FIRST IMPRESSION (Warm Connection)
  {
    id: "act-first-impression",
    slug: "first-impression",
    titleAr: "أول انطباع",
    titleEn: "First Impressions",
    taglineAr: "ما كان أول انطباع أخذته عن زملائك وكيف تغير بعد أن عرفتهم؟",
    descriptionAr: "نشاط فكاهي وعاطفي يزيل الصور النمطية ويقرب المسافات بين أفراد الفريق الواحد.",
    category: "SOCIAL",
    audience: "adults",
    minAge: 16,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 30,
    duration: 10,
    energy: "medium",
    goal: "icebreaker",
    type: "DISCUSSION_STARTER",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Heart",
    accentColor: "#DB2777",
    whyRecommended: "يذيب الجليد ويكشف طيبة النفوس وراء المظهر الجاد أو الرسمي.",
    instructions: {
      overviewAr: "كل شخص يشارك أطرف انطباع خاطئ كونه الآخرون عنه في أول لقاء.",
      hostAr: ["ابدأ بنفسك أولاً لتشجيع الحاضرين على الجرأة والحديث العفوي."],
      participantAr: ["احكِ الموقف بروح مرحة وتقبل لطيف."]
    },
    rounds: [
      {
        id: "fi-1",
        roundNumber: 1,
        promptAr: "ما هو أطرف أو أغرب انطباع خاطئ كونه الناس عنك في أول لقاء ثم اكتشفوا عكسه تماماً؟",
        subtitleAr: "شارك القصة الطريفة مع فريقك",
        timeLimit: 120,
        optionsAr: ["ضحكنا وتبادلنا القصص العفوية 😂", "مستمرون في الحوار 💬"],
      }
    ]
  },

  // 14. COMMON GROUND (Cooperation Discovery)
  {
    id: "act-common-ground",
    slug: "common-ground",
    titleAr: "ما الشيء المشترك؟",
    titleEn: "Common Ground",
    taglineAr: "اكتشفوا 3 أشياء غريبة تجمعكم دون أن تكونوا على علم بها!",
    descriptionAr: "في مجموعات صغيرة، يبحث الحضور عن 3 نقاط مشتركة غير مألوفة وغير متوقعة تماماً تجمع جميع أعضاء الطاولة.",
    category: "TEAM",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 6,
    maxPlayers: 60,
    duration: 8,
    energy: "medium",
    goal: "cooperation",
    type: "TEAM_CHALLENGE",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Layers",
    accentColor: "#059669",
    whyRecommended: "يخلق جسور تواصل فورية بين زملاء لا يعرفون الكثير عن بعضهم.",
    instructions: {
      overviewAr: "تحظر النقاط البديهية (مثل: كلنا نعمل في نفس المكان، كلنا نحب الطعام). يجب أن تكون نقاطاً فريدة!",
      hostAr: ["استمع لما تتوصل إليه كل طاولة واطلب من المتحدث مشاركة أغرب قاسم مشترك."],
      participantAr: ["اطرحوا أسئلة عن هواياتكم وسفركم وتجاربكم النادرة!"]
    },
    rounds: [
      {
        id: "cg-1",
        roundNumber: 1,
        promptAr: "التحدي: اعثروا على 3 نقاط تشابه نادرة وغريبة تجمع كل أفراد طاولتكم بدون استثناء في 3 دقائق!",
        subtitleAr: "ممنوع النقاط البديهية مثل العمل أو المدينة!",
        timeLimit: 180,
        optionsAr: ["عثرنا على 3 قواسم مدهشة! 🌟", "ما زلنا نتناقش 🔍"],
      }
    ]
  },

  // 15. WHO IS MOST LIKELY? (Humor & Social)
  {
    id: "act-who-is-most-likely",
    slug: "who-is-most-likely",
    titleAr: "من الأكثر احتمالاً؟",
    titleEn: "Who Is Most Likely",
    taglineAr: "مواقف طريفة وغير متوقعة.. على من تنطبق أكثر في الفريق؟",
    descriptionAr: "تطرح الشاشة مواقف كوميدية ومثيرة، ويشير كل شخص إلى الزميل الذي يراه الأقرب للقيام بهذا التصرف.",
    category: "SOCIAL",
    audience: "adults",
    minAge: 14,
    maxAge: 99,
    minPlayers: 5,
    maxPlayers: 40,
    duration: 8,
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
    accentColor: "#E11D48",
    whyRecommended: "جرعة ضحك مضمونة تكشف شخصيات الفريق وروح الدعابة بينهم.",
    instructions: {
      overviewAr: "يصوت الجميع من هواتفهم لاختيار الزميل الأقرب للموقف وتظهر النتائج كاستفتاء جماعي ممتع.",
      hostAr: ["علق بلطف ودع الزميل الأكثر تصويتاً يدافع عن نفسه بروح مرحة!"],
      participantAr: ["صوت بابتسامة وبدون تردد!"]
    },
    rounds: [
      {
        id: "wiml-1",
        roundNumber: 1,
        promptAr: "من الشخص في الفريق الأكثر احتمالاً لأن ينسى مكان سيارته في موقف المجمع التجاري؟",
        subtitleAr: "صوت للزميل صاحب الذاكرة الشاردة! 😄",
        optionsAr: ["الزميل الأكثر انشغالاً 🧠", "الزميل الهادئ الحالم ☁️", "أنا شخصياً! 🙋", "كلنا بلا استثناء! 🚗"],
        timeLimit: 20,
      },
      {
        id: "wiml-2",
        roundNumber: 2,
        promptAr: "من الشخص الأكثر احتمالاً لأن يبدأ مشروعاً تجارياً غريباً وناجحاً فجأة دون مقدمات؟",
        subtitleAr: "روح الريادة والمغامرة",
        optionsAr: ["صاحب الأفكار المجنونة 💡", "الزميل الصامت المفكر 🧐", "أكثر شخص يحب التجربة 🚀", "شخص لم نتوقعه أبداً 🎯"],
        timeLimit: 20,
      }
    ]
  },

  // 16. REVERSE BRAINSTORMING (Facilitator)
  {
    id: "act-reverse-brainstorming",
    slug: "reverse-brainstorming",
    titleAr: "العصف الذهني العكسي",
    titleEn: "Reverse Brainstorming",
    taglineAr: "كيف نجعل مشروعنا يفشل بأبشع طريقة ممكنة؟ ثم نعكس الحلول!",
    descriptionAr: "تقنية إبداعية ممتعة تقلب التحديات. بدلاً من البحث عن النجاح، يفكر الفريق في كل الطرق التي تضمن الفشل الذريع، ليكتشفوا ثغرات لم تكن تخطر على بال أحد.",
    category: "CREATIVE",
    audience: "adults",
    minAge: 16,
    maxAge: 99,
    minPlayers: 6,
    maxPlayers: 50,
    duration: 15,
    energy: "high",
    goal: "creativity",
    type: "TEAM_CHALLENGE",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: false,
    iconName: "RefreshCcw",
    accentColor: "#4F46E5",
    whyRecommended: "يكسر جمود الاجتماعات ويفكك الخوف من الأخطاء بطريقة فكاهية وذكية جداً.",
    instructions: {
      overviewAr: "يقسم الميسر الفريق ويطلب منهم وضع خطة محكمة لإفشال المشروع أو المبادرة تماماً!",
      hostAr: [
        "اطرح التحدي: 'لدينا 5 دقائق لكتابة أسوأ 5 قرارات تدمر الفكرة'.",
        "اقرأ الأفكار الكارثية واضحكوا معاً عليها.",
        "الخطوة الحاسمة: اعكسوا كل قرار كارثي إلى إجراء وقائي فائق الذكاء!"
      ],
      participantAr: ["فكر بحرية مطلقة وأطلق أسوأ السيناريوهات بدون أي خجل!"]
    }
  },

  // 17. SPEED NETWORKING (Networking Facilitator)
  {
    id: "act-speed-networking",
    slug: "speed-networking",
    titleAr: "تعارف السرعة (Speed Networking)",
    titleEn: "Speed Networking",
    taglineAr: "دقيقة واحدة لكل شخص.. تعرف على 5 زملاء جدد في 5 دقائق!",
    descriptionAr: "نسخة سريعة ومثمرة من التعارف الفعال للمؤتمرات والورش الكبيرة، تضمن تحدث كل فرد مع أكبر عدد من الحاضرين.",
    category: "ICEBREAKER",
    audience: "adults",
    minAge: 16,
    maxAge: 99,
    minPlayers: 10,
    maxPlayers: 150,
    duration: 10,
    energy: "high",
    goal: "icebreaker",
    type: "FIND_SOMEONE_WHO",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: true,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: false,
    iconName: "Zap",
    accentColor: "#D97706",
    whyRecommended: "يقضي تماماً على تكتلات الأصدقاء القدامى ويدمج الجدد في دقائق معدودة.",
    instructions: {
      overviewAr: "يصطف الجميع في صفين متقابلين. يتحدث كل ثنائي لمدة دقيقة، ثم يتحرك صف خطوة للأمام عند سماع الصافرة.",
      hostAr: [
        "أطلق الصافرة كل 60 ثانية بالضبط لتبديل الزملاء.",
        "اطرح سؤالاً محدداً لكل جولة (مثلاً: ما هو شغفك الحالي؟)"
      ],
      participantAr: ["قدم نفسك في 15 ثانية، واسمع زميلك باهتمام، ثم استعد للتبديل!"]
    }
  },

  // 18. EMOJI STORY (Creative Spark)
  {
    id: "act-emoji-story",
    slug: "emoji-story",
    titleAr: "قصة بالإيموجي",
    titleEn: "Emoji Storyteller",
    taglineAr: "سلسلة من 5 رموز تعبيرية.. ما هي القصة المشوقة خلفها؟",
    descriptionAr: "تحدي خيال وابتكار. تعرض الشاشة تسلسلاً من 5 إيموجيات عشوائية، وعلى كل فريق تأليف قصة درامية مضحكة أو حكمة عميقة تربط بينها في دقيقة واحدة.",
    category: "CREATIVE",
    audience: "adults",
    minAge: 13,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 40,
    duration: 8,
    energy: "high",
    goal: "creativity",
    type: "TEAM_CHALLENGE",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: true,
    isPlayable: false,
    iconName: "Smile",
    accentColor: "#06B6D4",
    whyRecommended: "يطلق العنان للخيال والمرح ويبرز مهارات السرد القصصي السريع.",
    instructions: {
      overviewAr: "تعرض الشاشة: 🚀 🍕 🧙‍♂️ 🏝️ 📦. يبتكر كل فريق حبكة متماسكة لقصة لا تتجاوز 45 ثانية في الإلقاء.",
      hostAr: ["صوت الجمهور بالهتاف يحدد القصة الأكثر إبداعاً وفكاهة!"],
      participantAr: ["فاجئ الجمهور بحبكة غير متوقعة ونهاية ذكية!"]
    }
  },

  // 19. HUMAN KNOT (Physical Team Building)
  {
    id: "act-human-knot",
    slug: "human-knot",
    titleAr: "العقدة البشرية (Human Knot)",
    titleEn: "Human Knot Challenge",
    taglineAr: "أيدٍ متشابكة في عقدة مستحيلة.. كيف تحلونها دون فك الأيدي؟",
    descriptionAr: "تمرين تماسك وبناء فريق كلاسيكي. يقف الفريق في دائرة، يمسك كل شخص بيدين مختلفتين لشخصين مختلفين، ثم يبدؤون بفك التشابك بالمرور فوق وتحت الأيدي دون إفلات.",
    category: "TEAM",
    audience: "adults",
    minAge: 12,
    maxAge: 99,
    minPlayers: 6,
    maxPlayers: 20,
    duration: 10,
    energy: "high",
    goal: "cooperation",
    type: "TEAM_CHALLENGE",
    requiresPhone: false,
    requiresScreen: false,
    requiresMovement: true,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: false,
    iconName: "Link2",
    accentColor: "#0D9488",
    whyRecommended: "يعلم الصبر والتواصل المباشر وحل المعضلات المعقدة خطوة بخطوة بالتعاون.",
    instructions: {
      overviewAr: "دائرة من 8 إلى 12 شخصاً يتشابكون بالأيدي ويتحركون معاً للوصول إلى دائرة مفتوحة دون فك الأيدي.",
      hostAr: ["راقب سلامة المشاركين وشجعهم على التحدث بوضوح وتعيين قائد لتوجيه الحركة."],
      participantAr: ["حافظ على يديك ممسكتين وتحرك بمرونة وهدوء!"]
    }
  },

  // 20. VALUES AUCTION (Interactive Reflection)
  {
    id: "act-values-auction",
    slug: "values-auction",
    titleAr: "مزاد القيم والمبادئ",
    titleEn: "Values Auction",
    taglineAr: "لديك 1000 نقطة.. على أي قيمة إنسانية أو مهنية ستراهن بكل ما تملك؟",
    descriptionAr: "تجربة فكرية عميقة تكشف أولويات المشاركين. يطرح الميسر في مزاد قيماً مثل (راحة البال، الشهرة، الثروة، أثر ينفع الناس، الحرية التامة، أسرة سعيدة) ليتنافس الحضور في المزايدة.",
    category: "DISCUSSION",
    audience: "adults",
    minAge: 16,
    maxAge: 99,
    minPlayers: 6,
    maxPlayers: 50,
    duration: 20,
    energy: "medium",
    goal: "discussion",
    type: "DISCUSSION_STARTER",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: true,
    cooperative: false,
    isPlayable: false,
    iconName: "Gavel",
    accentColor: "#9333EA",
    whyRecommended: "نشاط تأملي عميق يترك أثراً طويل الأمد ويصلح لختام الورش والمخيمات القيادية.",
    instructions: {
      overviewAr: "كل شخص يملك رصيداً افتراضياً (1000 نقطة). يدير الميسر المزاد كمزايد حقيقي بمطرقة وحماس.",
      hostAr: [
        "اعرض القيمة وابدأ المزاد بـ 100 نقطة.",
        "بعد رسو المزاد، اسأل الفائز: لماذا هذه القيمة تحديداً هي الأغلى في حياتك؟"
      ],
      participantAr: ["فكر في أولوياتك الحقيقية ولا تبدد رصيدك على ما لا يهمك حقاً!"]
    }
  }
];
