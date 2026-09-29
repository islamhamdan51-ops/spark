import { Activity } from "@/types";

export const CLOSING_ACTIVITIES: Activity[] = [
  {
    id: "act-closing-one-word",
    slug: "closing-one-word",
    titleAr: "كلمة واحدة تختصر الجلسة",
    titleEn: "One-Word Checkout",
    taglineAr: "كل مشارك يشارك كلمة واحدة تصف شعوره أو ما خرج به اليوم!",
    descriptionAr: "نشاط ختامي أنيق وسريع. يدخل كل مشارك كلمة واحدة تلخص أثره أو شعوره، لتجتمع الكلمات في سحابة تفاعلية جميلة تعكس روح المجموعة.",
    category: "REFLECTION",
    audience: "mixed",
    minAge: 8,
    maxAge: 99,
    minPlayers: 3,
    maxPlayers: 100,
    duration: 3,
    energy: "calm",
    goal: "reflection",
    type: "WORD_CLOUD",
    requiresPhone: true,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Sparkles",
    accentColor: "#2F8FD8",
    whyRecommended: "أفضل طريقة لختام أي ورشة أو لقاء بصوت جماعي معبر ومشاعر إيجابية تدوم.",
    instructions: {
      overviewAr: "يطلب الميسر من كل مشارك كتابة كلمة واحدة فقط تصف شعوره أو فائدته.",
      hostAr: [
        "اعرض الشاشة واسأل: 'لو اختصرت جلستنا اليوم في كلمة واحدة.. ماذا تقول؟'",
        "اقرأ الكلمات الأكثر تكراراً وأثنِ على تفاعل وروح المجموعة.",
        "اختم بابتسامة وشكر حار لجميع الحضور."
      ],
      participantAr: [
        "اكتب كلمة واحدة من قلبك تصف ما شعرت به في هذه الجلسة.",
        "شاهد كلمتك تضيء مع كلمات زملائك على الشاشة الكبيرة!"
      ]
    },
    rounds: [
      {
        id: "close-word-1",
        roundNumber: 1,
        promptAr: "بكلمة واحدة فقط: ما هو شعورك أو أهم ما تخرج به من جلستنا اليوم؟ ✨",
        subtitleAr: "اكتب كلمة واحدة معبرة تصف تجربتك",
        optionsAr: ["ملهمة 💡", "طاقة وتجديد ⚡", "ألفة وتعاون 🤝", "ممتعة جداً 🎉"],
        timeLimit: 30
      }
    ]
  },
  {
    id: "act-closing-action-pledge",
    slug: "closing-action-pledge",
    titleAr: "سأطبق هذا غداً",
    titleEn: "Tomorrow's Action Pledge",
    taglineAr: "تحويل الأفكار إلى أفعال.. التزام واحد يغير الواقع!",
    descriptionAr: "نشاط ختامي يعزز الأثر العملي. يختار كل مشارك خطوة واحدة واقعية يلتزم بتنفيذها خلال 48 ساعة القادمة استناداً لما تعلمه أو ناقشه.",
    category: "REFLECTION",
    audience: "adults",
    minAge: 13,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 50,
    duration: 5,
    energy: "calm",
    goal: "reflection",
    type: "DISCUSSION_STARTER",
    requiresPhone: false,
    requiresScreen: true,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "CheckCircle",
    accentColor: "#10B981",
    whyRecommended: "يضمن ألا تبقى مخرجات الجلسة مجرد كلام، بل تتحول إلى سلوك وأثر حقيقي في الميدان.",
    instructions: {
      overviewAr: "كل شخص يحدد خطوة عملية واحدة صغيرة سيبدأ بها في الـ 48 ساعة القادمة.",
      hostAr: [
        "أعطِ الحضور 60 ثانية للتفكير الهادئ.",
        "اطلب من 3-4 متطوعين مشاركة التزامهم بصوت واضح.",
        "ذكّر الفريق بأن 'قليل دائم خير من كثير منقطع'."
      ],
      participantAr: [
        "اختر أمراً واحداً عملياً تستطيع تنفيذه غداً.",
        "شاركه مع من يجلس بجانبك لتثبيت النية والمسؤولية."
      ]
    },
    rounds: [
      {
        id: "close-action-1",
        roundNumber: 1,
        promptAr: "ما هو الشيء العملي المحدد الذي ستطبقه خلال 48 ساعة من الآن؟ 🌱",
        subtitleAr: "التزام شخصي صغير يصنع فرقاً حقيقياً",
        optionsAr: ["تطبيق فكرة جديدة في عملي 💼", "شكر وتقدير شخص ساعدني 🤲", "تحسين عادة تواصل مع فريقي 🤝", "بدء خطوة كنت أؤجلها 🚀"],
        timeLimit: 40
      }
    ]
  },
  {
    id: "act-closing-gratitude-circle",
    slug: "closing-gratitude-circle",
    titleAr: "دائرة الامتنان والشكر",
    titleEn: "Gratitude Circle",
    taglineAr: "شكر لمن يستحق.. نختم بنفوس طيبة وقلوب متآلفة!",
    descriptionAr: "نشاط راقٍ ومؤثر. يوجه كل شخص كلمة شكر أو تقدير لزميل في الفريق على موقف أو مشاركة أو طاقة إيجابية بثها خلال اللقاء.",
    category: "REFLECTION",
    audience: "mixed",
    minAge: 9,
    maxAge: 99,
    minPlayers: 4,
    maxPlayers: 40,
    duration: 4,
    energy: "calm",
    goal: "reflection",
    type: "DISCUSSION_STARTER",
    requiresPhone: false,
    requiresScreen: false,
    requiresMovement: false,
    requiresMaterials: false,
    competitive: false,
    cooperative: true,
    isPlayable: true,
    iconName: "Heart",
    accentColor: "#E11D48",
    whyRecommended: "يبني روابط إنسانية عميقة وينهي أي لقاء برصيد عالٍ من الأمان النفسي والتقدير.",
    instructions: {
      overviewAr: "توجيه كلمات شكر وامتنان سريعة وصادقة بين أفراد المجموعة.",
      hostAr: [
        "اطلب من كل مشارك توجيه كلمة تقدير لزميله على اليمين أو لشخص لفت انتباهه.",
        "تأكد أن الجميع يشعر بالتقدير والانتماء.",
        "اختم بعبارة تشجيعية عامة."
      ],
      participantAr: [
        "فكر في موقف أو كلمة طيبة بدرت من أحد زملائك اليوم واشكره عليها بلطف."
      ]
    },
    rounds: [
      {
        id: "close-gratitude-1",
        roundNumber: 1,
        promptAr: "وجّه كلمة شكر سريعة لزميل أضاف لجلسك اليوم طاقة أو فكرة أو ابتسامة 💐",
        subtitleAr: "من لا يشكر الناس لا يشكر الله",
        optionsAr: ["شكراً على روحك الإيجابية ✨", "شكراً على رأيك الملهم 💡", "شكراً على تعاونك الصادق 🤝", "شكراً على طاقتك الجميلة ⚡"],
        timeLimit: 30
      }
    ]
  }
];
