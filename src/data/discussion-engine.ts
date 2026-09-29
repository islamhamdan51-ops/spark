import { DiscussionEngineItem, DiscussionLevel } from "@/types";

export const DISCUSSION_ENGINE_ITEMS: DiscussionEngineItem[] = [
  // ==========================================
  // LEVEL 1: LIGHT (خفيف وممتع)
  // ==========================================
  {
    id: "disc-light-1",
    level: "light",
    category: "general",
    titleAr: "أكثر عادة يومية لا تستغني عنها",
    questionAr: "ما هي العادة اليومية البسيطة التي لو تغيرت ينقلب يومك بالكامل؟ ☕",
    followUpPromptAr: "ناقشوا في ثنائيات: هل هذه العادة تعطيكم طاقة حقيقية أم أنها مجرد روتين متوارث؟",
    conclusionPromptAr: "اختموا بمشاركة أطرف أو أغرب عادة سمعتموها من زميلكم في 30 ثانية.",
  },
  {
    id: "disc-light-2",
    level: "light",
    category: "team",
    titleAr: "أفضل مهارة غير متوقعة فيك",
    questionAr: "ما المهارة أو الهواية غير المتوقعة التي تتقنها ولا يعرفها معظم زملائك هنا؟ 🎨",
    followUpPromptAr: "ناقشوا: كيف يمكن لهذه المهارات الخفية أن تفيد فريقنا لو واجهنا مشروعاً غير تقليدي؟",
    conclusionPromptAr: "اختموا باختيار 'البطل الخفي' في المجموعة صاحب أغرب موهبة مفيدة.",
  },
  {
    id: "disc-light-3",
    level: "light",
    category: "youth",
    titleAr: "لو امتلكت ساعة إضافية يومياً",
    questionAr: "لو أُضيفت ساعة 25 إلى يومك بشرط ألا تعمل فيها ولا تنام، كيف ستقضيها؟ ⏳",
    followUpPromptAr: "ناقشوا: ما الذي يمنعكم من سرقة 20 دقيقة يومياً الآن لنفس هذا الشيء الذي تحبونه؟",
    conclusionPromptAr: "اختموا بالتعهد بفعل شيء واحد بسيط يسعدكم هذا الأسبوع.",
  },

  // ==========================================
  // LEVEL 2: MEDIUM (آراء وتفكير)
  // ==========================================
  {
    id: "disc-med-1",
    level: "medium",
    category: "work",
    titleAr: "السرعة أم الإتقان؟",
    questionAr: "لو خيرت بين تسليم عمل ممتاز بنسبة 95% بعد الموعد بيومين، أو عمل جيد بنسبة 75% في الموعد تماماً؟ ⚖️",
    followUpPromptAr: "ناقشوا: متى تكون 'الجودة العالية' فخاً يعطل الفريق؟ ومتى يكون 'الالتزام بالموعد' أهم من كل شيء؟",
    conclusionPromptAr: "اختموا بقاعدة واحدة يتبناها فريقكم لتحقيق التوازن بين السرعة والجودة.",
  },
  {
    id: "disc-med-2",
    level: "medium",
    category: "team",
    titleAr: "أكثر ما يبني الثقة في الفريق",
    questionAr: "ما السلوك رقم 1 الذي إذا فعله زميلك يجعلك تثق به تماماً وتسلمه أي مسؤولية؟ 🤝",
    followUpPromptAr: "ناقشوا: ما التصرف الوحيد الذي قد يدمر هذه الثقة في لحظة واحدة؟",
    conclusionPromptAr: "اختموا بكلمة واحدة تمثل 'ميثاق الأمان' داخل مجموعتنا.",
  },
  {
    id: "disc-med-3",
    level: "medium",
    category: "values",
    titleAr: "التغذية الراجعة الصادقة",
    questionAr: "لماذا نتردد كثيراً في إعطاء ملاحظات صريحة لزملائنا حتى عندما نرى خطأً واضحاً؟ 💬",
    followUpPromptAr: "ناقشوا: كيف نوصل النقد الصادق دون كسر الخواطر أو خلق حساسية شخصية؟",
    conclusionPromptAr: "اختموا بصياغة عبارة ذكية تبدأ بها نصيحتك لتكون مقبولة ومشجعة.",
  },

  // ==========================================
  // LEVEL 3: DEEP (تأمل وقيم عميقة)
  // ==========================================
  {
    id: "disc-deep-1",
    level: "deep",
    category: "values",
    titleAr: "الموقف الذي غيّر نظرتك للحياة",
    questionAr: "ما هو الموقف أو الإخفاق الذي ظننته نهاية العالم، ثم اكتشفت أنه أعظم معلم في حياتك؟ 🌱",
    followUpPromptAr: "ناقشوا في هدوء: ما الحكمة أو القيمة التي انغرست في شخصيتك بعد تلك التجربة؟",
    conclusionPromptAr: "اختموا بذكر كلمة شكر لشخص وقف بجانبكم في ذلك الوقت الصعب.",
  },
  {
    id: "disc-deep-2",
    level: "deep",
    category: "reflection",
    titleAr: "الأثر الذي نريد أن نتركه",
    questionAr: "بعد 5 سنوات من الآن، ما الأثر أو الذكرى التي تحب أن يذكرك بها هذا الفريق أو هذا المكان؟ 🌟",
    followUpPromptAr: "ناقشوا: ما الخطوة الصغيرة التي تستطيع أن تبدأ بها اليوم لتصنع هذا الأثر؟",
    conclusionPromptAr: "اختموا بدعوة صادقة أو أمنية طيبة للمجموعة كاملة.",
  },
  {
    id: "disc-deep-3",
    level: "deep",
    category: "values",
    titleAr: "الامتنان في مواجهة الضغوط",
    questionAr: "في خضم المشاغل وضغوط الحياة، ما النعمة التي نعتادها حتى نكاد ننسى شكرها يومياً؟ 🤲",
    followUpPromptAr: "ناقشوا: كيف يعيد استشعار النعم ضبط مشاعرنا وطاقتنا في أوقات التعب والإحباط؟",
    conclusionPromptAr: "اختموا بدقيقة صمت تأملية يستحضر فيها كل شخص نعمة خاصة في قلبه.",
  },
];

export function getDiscussionItemsByLevel(level: DiscussionLevel): DiscussionEngineItem[] {
  return DISCUSSION_ENGINE_ITEMS.filter((item) => item.level === level);
}

export function getRandomDiscussionItem(level: DiscussionLevel = "medium"): DiscussionEngineItem {
  const eligible = getDiscussionItemsByLevel(level);
  return eligible[Math.floor(Math.random() * eligible.length)] || DISCUSSION_ENGINE_ITEMS[0];
}
