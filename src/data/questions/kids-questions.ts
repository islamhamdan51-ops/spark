import { randomizeRoundOptions } from "@/lib/utils";

export interface KidsQuestion {
  id: string;
  ageGroup: "4-6" | "7-9" | "10-12" | "all";
  type: "animal_guess" | "emoji_riddle" | "movement" | "values_goodness" | "quiz" | "sound_guess";
  promptAr: string;
  subtitleAr?: string;
  optionsAr: string[];
  correctAnswer: number;
  emojiIcon?: string;
  actionPromptAr?: string;
  encouragementAr: string;
  timeLimit: number;
}

const RAW_KIDS_QUESTION_BANK: KidsQuestion[] = [
  // Age 4-6: Visual, Animals, Movement, Good Manners
  {
    id: "kid-1",
    ageGroup: "4-6",
    type: "animal_guess",
    promptAr: "من أنا؟ أعيش في الغابة، ولدي خرطوم طويل جداً وأذنان كبيرتان! 🐘",
    subtitleAr: "خمن الحيوان اللطيف",
    optionsAr: ["الفيل الضخم 🐘", "الزرافة الطويلة 🦒", "الأرنب السريع 🐇", "الأسد الشجاع 🦁"],
    correctAnswer: 0,
    encouragementAr: "أحسنت يا بطل! الفيل بخرطومه الطويل هو صديقنا!",
    timeLimit: 15,
  },
  {
    id: "kid-2",
    ageGroup: "4-6",
    type: "values_goodness",
    promptAr: "عندما يقدم لك بابا أو ماما طعاماً لذيذاً، ماذا تقول؟",
    subtitleAr: "أدب الشكر واللسان الحلو",
    optionsAr: ["شكراً وجزاكم الله خيراً ❤️", "لا أقول شيئاً", "أجري بعيداً", "أطلب المزيد فوراً"],
    correctAnswer: 0,
    encouragementAr: "رائع! الكلمة الطيبة والشكر يفرحان قلب الوالدين!",
    timeLimit: 15,
  },
  {
    id: "kid-3",
    ageGroup: "4-6",
    type: "movement",
    promptAr: "تحدي الحركة المتجمدة! 🧊",
    subtitleAr: "اقفز 3 قفزات عالية في مكانك ثم تجمد كتمثال!",
    optionsAr: ["قفزت وتجمدت تماماً! 🧊", "أحاول الآن! 🏃"],
    correctAnswer: 0,
    actionPromptAr: "اقفزوا جميعاً 3 مرات ثم تجمدوا كالأبطال بدون أي حركة!",
    encouragementAr: "برافو! توازن ممتاز وحركة رشيقة!",
    timeLimit: 20,
  },
  {
    id: "kid-4",
    ageGroup: "4-6",
    type: "animal_guess",
    promptAr: "من هو الحيوان الذي يقفز عالياً ويحمل صغيره في جيب دافئ في بطنه؟ 🦘",
    subtitleAr: "صاحب أروع قفزات",
    optionsAr: ["الكنغر الأسترالي 🦘", "القطة الصغيرة 🐱", "الدب البني 🐻", "السلحفاة 🐢"],
    correctAnswer: 0,
    encouragementAr: "إجابة عبقرية! الكنغر يحمي صغيره في جيبه الدافئ!",
    timeLimit: 15,
  },
  {
    id: "kid-5",
    ageGroup: "4-6",
    type: "values_goodness",
    promptAr: "إذا وقعت لعبة زميلك الصغير على الأرض وبكى، ماذا تفعل؟",
    subtitleAr: "القلب الطيب والرحمة",
    optionsAr: ["أبتسم له وأساعده في التقاط لعبته 🧸", "أضحك عليه", "آخذ اللعبة لنفسي", "أتركه وحيداً"],
    correctAnswer: 0,
    encouragementAr: "أنت بطل حقيقي يحب الخير ومساعدة أصدقائه!",
    timeLimit: 15,
  },

  // Age 7-9: Wit, Discovery, Nature, Arabic & Islamic Knowledge
  {
    id: "kid-6",
    ageGroup: "7-9",
    type: "emoji_riddle",
    promptAr: "حل لغز الإيموجي: 🐝 + 🍯 = ؟ ما الناتج الحلو؟",
    subtitleAr: "طعام فيه شفاء للناس",
    optionsAr: ["عسل النحل اللذيذ 🍯", "زهرة الحديقة 🌸", "شجرة التفاح 🍎", "بيت النمل 🐜"],
    correctAnswer: 0,
    encouragementAr: "ذكاء خارق! النحل يصنع لنا أشهى وأطيب عسل!",
    timeLimit: 15,
  },
  {
    id: "kid-7",
    ageGroup: "7-9",
    type: "quiz",
    promptAr: "من هو النبي الكريم الذي بنى سفينة عملاقة بأمر الله وجمع فيها من كل زوجين اثنين؟",
    subtitleAr: "قصص الأنبياء الملهمة",
    optionsAr: ["نبي الله نوح عليه السلام", "نبي الله يوسف عليه السلام", "نبي الله موسى عليه السلام", "نبي الله إبراهيم عليه السلام"],
    correctAnswer: 0,
    encouragementAr: "ممتاز! نبي الله نوح عليه السلام وسفينته المشهورة!",
    timeLimit: 15,
  },
  {
    id: "kid-8",
    ageGroup: "7-9",
    type: "movement",
    promptAr: "تحدي الألوان السريع: ابحث عن شيء لونه أخضر 🟢 ولمسه خلال 10 ثوانٍ!",
    subtitleAr: "سرعة البحث والملاحظة",
    optionsAr: ["وجدت شيئاً أخضر ولمسته! 🟢", "الوقت لم يكفني ⏱️"],
    correctAnswer: 0,
    actionPromptAr: "انطلقوا في القاعة وابحثوا عن أي غرض لونه أخضر والمسه بيدك فوراً!",
    encouragementAr: "عين الصقر وسرعة الفهد! أبطال البحث!",
    timeLimit: 15,
  },
  {
    id: "kid-9",
    ageGroup: "7-9",
    type: "quiz",
    promptAr: "ما هو أكبر كوكب في مجموعتنا الشمسية؟",
    subtitleAr: "عالم الفضاء الواسع",
    optionsAr: ["كوكب المشتري العملاق 🪐", "كوكب الأرض 🌍", "كوكب المريخ الأحمر 🔴", "كوكب عطارد 🌑"],
    correctAnswer: 0,
    encouragementAr: "ما شاء الله! المشتري هو أضخم كواكب المجموعة الشمسية!",
    timeLimit: 15,
  },
  {
    id: "kid-10",
    ageGroup: "7-9",
    type: "values_goodness",
    promptAr: "أي تصرف يعبر عن الحفاظ على البيئة ونظافة المكان؟",
    subtitleAr: "أصدقاء كوكب الأرض",
    optionsAr: ["أضع القمامة في سلة المهملات المخصصة ♻️", "أرمي الأوراق في حديقة المدرسة", "أترك زجاجة الماء في الساحة", "أهدر الماء من الصنبور"],
    correctAnswer: 0,
    encouragementAr: "إنسان واعي ومتحضر! النظافة من الإيمان!",
    timeLimit: 15,
  },

  // Age 10-12: Challenges, Logic, Science, Values
  {
    id: "kid-11",
    ageGroup: "10-12",
    type: "quiz",
    promptAr: "ما هو الطائر الذي يستطيع الطيران إلى الخلف ورفرفة جناحيه مئات المرات في الدقيقة؟",
    subtitleAr: "عجائب المخلوقات",
    optionsAr: ["طائر الطنان 🐦", "الصقر الجارح 🦅", "اللقلق الأبيض 🦩", "البومة الحكيمة 🦉"],
    correctAnswer: 0,
    encouragementAr: "معلومة ذهبية! طائر الطنان هو الطائر الوحيد القادر على الطيران للخلف!",
    timeLimit: 15,
  },
  {
    id: "kid-12",
    ageGroup: "10-12",
    type: "quiz",
    promptAr: "من هو أول مؤذن في الإسلام وصاحب الصوت الندي الشجي؟",
    subtitleAr: "صحابة رسول الله ﷺ",
    optionsAr: ["الصحابي الجليل بلال بن رباح رضي الله عنه", "الصحابي عمر بن الخطاب رضي الله عنه", "الصحابي سلمان الفارسي رضي الله عنه", "الصحابي أبو ذر الغفاري رضي الله عنه"],
    correctAnswer: 0,
    encouragementAr: "أحسنت! بلال بن رباح رضي الله عنه مؤذن الرسول ﷺ وسيد من سادات الصحابة!",
    timeLimit: 15,
  },
  {
    id: "kid-13",
    ageGroup: "10-12",
    type: "emoji_riddle",
    promptAr: "لغز منطقي: ما هو الشيء الذي يملك أسناناً كثيرة لكنه لا يعض؟",
    subtitleAr: "فكر بعمق وذكاء!",
    optionsAr: ["المشط 🪮", "التمساح 🐊", "المنشار 🪚", "المفتاح 🗝️"],
    correctAnswer: 0,
    encouragementAr: "عبقري! المشط له أسنان نسرح بها شعرنا ولا يعض أبداً!",
    timeLimit: 15,
  },
  {
    id: "kid-14",
    ageGroup: "10-12",
    type: "movement",
    promptAr: "تحدي التوازن الذهني: قف على قدم واحدة، وافرك بطنك بيدك ودلك رأسك بيدك الأخرى في نفس الوقت!",
    subtitleAr: "اختبار توافق الفصين في الدماغ",
    optionsAr: ["نجحت في التحدي باقتدار! 🎯", "كدت أسقط من الضحك! 😂"],
    correctAnswer: 0,
    actionPromptAr: "قف على قدم واحدة، وافرك دائرياً على بطنك وبيدك الثانية ربت على رأسك!",
    encouragementAr: "ضحك ومرح وتوافق عصبي مذهل!",
    timeLimit: 20,
  },
  {
    id: "kid-15",
    ageGroup: "10-12",
    type: "values_goodness",
    promptAr: "رأيت زميلاً ينشر إشاعة كاذبة عن طالب آخر لإضحاك المجموعة:",
    subtitleAr: "الموقف الأخلاقي والشجاعة الأدبية",
    optionsAr: ["أنصحه بلطف بالتوقف وأرفض الضحك على غيبة الآخرين 🛡️", "أشارك في الضحك وتناقل الإشاعة", "أصور الموقف وأنقله لطلاب آخرين", "أصمت وأستمتع بالسخرية"],
    correctAnswer: 0,
    encouragementAr: "شخصية قوية وأخلاق فارس نبيل! نصرة المظلوم شرف عظيم!",
    timeLimit: 20,
  }
];

export const KIDS_QUESTION_BANK: KidsQuestion[] = RAW_KIDS_QUESTION_BANK.map(randomizeRoundOptions);
