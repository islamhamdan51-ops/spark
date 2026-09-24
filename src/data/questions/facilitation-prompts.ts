// Step-by-Step Facilitator Activities & Prompt Banks (No Phones Required)
// SPARK serves as the digital facilitator: Timer, Prompts, Host Instructions, Scoring.

export interface FacilitationCard {
  id: string;
  activitySlug: string;
  titleAr: string;
  secretWordOrPromptAr: string;
  categoryAr: string;
  facilitatorTipAr: string;
  timeLimitSeconds: number;
}

export const CHARADES_PROMPT_BANK: FacilitationCard[] = [
  {
    id: "char-1",
    activitySlug: "charades",
    titleAr: "تمثيل بلا كلام: المهن والحرف",
    secretWordOrPromptAr: "طبيب جراح في غرفة العمليات 🩺",
    categoryAr: "مهن وأعمال",
    facilitatorTipAr: "اطلب من المتطوع استخدام يديه وملامح وجهه دون إصدار أي صوت إطلاقاً!",
    timeLimitSeconds: 60,
  },
  {
    id: "char-2",
    activitySlug: "charades",
    titleAr: "تمثيل بلا كلام: مواقف يومية",
    secretWordOrPromptAr: "شخص يحاول تبديل إطار سيارة في منتصف عاصفة رملية 🚗",
    categoryAr: "مواقف طريفة",
    facilitatorTipAr: "شجع الجمهور على تخمين الإجراءات خطوة بخطوة.",
    timeLimitSeconds: 60,
  },
  {
    id: "char-3",
    activitySlug: "charades",
    titleAr: "تمثيل بلا كلام: عالم الحيوان",
    secretWordOrPromptAr: "بطريق يرتدي زلاجات ويتعلم التزلج على الجليد 🐧",
    categoryAr: "خيال ومرح",
    facilitatorTipAr: "الحركات الهزلية تزيد من ضحك وتفاعل المجموعة فوراً.",
    timeLimitSeconds: 60,
  },
  {
    id: "char-4",
    activitySlug: "charades",
    titleAr: "تمثيل بلا كلام: رياضات شهيرة",
    secretWordOrPromptAr: "حارس مرمى في ركلات الترجيح الحاسمة بالدقيقة الأخيرة ⚽",
    categoryAr: "رياضة وتحدي",
    facilitatorTipAr: "التركيز على المشاعر والترقب يجعل التخمين ملحمياً!",
    timeLimitSeconds: 60,
  },
  {
    id: "char-5",
    activitySlug: "charades",
    titleAr: "تمثيل بلا كلام: تكنولوجيا وتطبيقات",
    secretWordOrPromptAr: "شخص يبحث بيأس عن شبكة واي فاي في صحراء قاحلة 📶",
    categoryAr: "مواقف معاصرة",
    facilitatorTipAr: "لغة الجسد المبالغ فيها سر النجاح!",
    timeLimitSeconds: 60,
  }
];

export const FIND_SOMEONE_WHO_BANK = [
  {
    id: "fsw-1",
    promptAr: "ابحث عن شخص استيقظ اليوم قبل أذان الفجر أو صلى الفجر جماعة 🌅",
    points: 10,
    categoryAr: "عادات وبكور",
  },
  {
    id: "fsw-2",
    promptAr: "ابحث عن شخص يتحدث أكثر من لغتين بطلاقة 🗣️",
    points: 15,
    categoryAr: "مهارات ولغات",
  },
  {
    id: "fsw-3",
    promptAr: "ابحث عن شخص لم يشرب أي قهوة حتى الآن اليوم ☕",
    points: 10,
    categoryAr: "مفارقات",
  },
  {
    id: "fsw-4",
    promptAr: "ابحث عن شخص سافر لأكثر من 4 دول مختلفة في حياته ✈️",
    points: 15,
    categoryAr: "سفر واستكشاف",
  },
  {
    id: "fsw-5",
    promptAr: "ابحث عن شخص يجيد الطبخ ويصنع حلوى مشهورة في عائلته 👨‍🍳",
    points: 10,
    categoryAr: "مهارات منزلية",
  },
  {
    id: "fsw-6",
    promptAr: "ابحث عن شخص مارس التطوع الخيري أو شارك في جمعية نفع عام هذا العام 🤝",
    points: 20,
    categoryAr: "عطاء ومجتمع",
  },
  {
    id: "fsw-7",
    promptAr: "ابحث عن شخص يقرأ كتاباً ورقياً حالياً وليس رقمياً 📚",
    points: 15,
    categoryAr: "ثقافة وقراءة",
  },
  {
    id: "fsw-8",
    promptAr: "ابحث عن شخص يملك حيواناً أليفاً في منزله 🐱",
    points: 10,
    categoryAr: "حياة واهتمامات",
  }
];

export const SIXTY_SEC_CHALLENGES = [
  {
    id: "sec-1",
    titleAr: "تحدي الـ 60 ثانية: معجم الكلمات",
    promptAr: "اذكر 10 كلمات باللغة العربية تبدأ بحرف 'القاف' في 60 ثانية دون توقف!",
    facilitatorTipAr: "عدّ الكلمات بصوت مرتفع وشجع الفريق على المؤازرة!",
    timeLimit: 60,
  },
  {
    id: "sec-2",
    titleAr: "تحدي الـ 60 ثانية: مدن وعواصم",
    promptAr: "قم بتسمية 8 عواصم عربية وإسلامية بالترتيب مع زميلك كل واحد بالتناوب!",
    facilitatorTipAr: "التناوب يجب أن يكون سريعاً خلال ثانية واحدة بين كل شخص.",
    timeLimit: 60,
  },
  {
    id: "sec-3",
    titleAr: "تحدي الـ 60 ثانية: قصيدة الارتجال",
    promptAr: "تحدث دقيقة كاملة متواصلة عن 'أهمية الوقت' دون استخدام الكلمات (يعني، طبعاً، شو اسمه) ودون صمت!",
    facilitatorTipAr: "إذا تلعثم أو قال إحدى الكلمات الممنوعة، تخصم 5 درجات!",
    timeLimit: 60,
  }
];
