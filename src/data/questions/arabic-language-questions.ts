import { randomizeRoundOptions } from "@/lib/utils";

export interface ArabicQuestion {
  id: string;
  type: "vocabulary" | "opposite" | "plural" | "proverb" | "eloquence" | "grammar_wit";
  promptAr: string;
  subtitleAr?: string;
  optionsAr: string[];
  correctAnswer: number; // 0-indexed
  explanationAr: string;
  timeLimit: number;
}

const RAW_ARABIC_LANGUAGE_BANK: ArabicQuestion[] = [
  {
    id: "arab-1",
    type: "vocabulary",
    promptAr: "ما معنى كلمة 'الغَضَنْفَر' في لغة العرب؟",
    subtitleAr: "من ألقاب الكائنات الفصيحة",
    optionsAr: ["الأسد العظيم الشجاع", "الصقر الجارح", "الذئب السريع", "الحصان الأصيل"],
    correctAnswer: 0,
    explanationAr: "الغَضَنْفَر هو الأسد الشديد الغليظ الخلق، وتطلق على الرجل الشجاع الجريء.",
    timeLimit: 15,
  },
  {
    id: "arab-2",
    type: "opposite",
    promptAr: "ما هو ضد كلمة 'المُقْسِط' في اللغة؟",
    subtitleAr: "انتبه للفارق الدقيق بين القاسط والمقسط!",
    optionsAr: ["القاسط (أي الجائر والظالم)", "العادل", "المنصف", "الرحيم"],
    correctAnswer: 0,
    explanationAr: "المُقْسِط (بالهمزة) هو العادل، أما القاسط فهو الظالم الجائر؛ قال تعالى: ﴿وَأَمَّا الْقَاسِطُونَ فَكَانُوا لِجَهَنَّمَ حَطَبًا﴾.",
    timeLimit: 15,
  },
  {
    id: "arab-3",
    type: "plural",
    promptAr: "ما هو الجمع الفصيح لكلمة 'عَنْدَلِيب'؟",
    subtitleAr: "طائر شجي الصوت عذب التغريد",
    optionsAr: ["عَنَادِل وعَنَادِيل", "عَنْدَلَات", "عَنَادِيب", "عَنْدَلُون"],
    correctAnswer: 0,
    explanationAr: "جمع عندليب هو عنادل وعناديل، بحذف الياء أو إبقائها في صيغ منتهى الجموع.",
    timeLimit: 15,
  },
  {
    id: "arab-4",
    type: "proverb",
    promptAr: "أكمل المثل العربي الشهير: 'رُبَّ أَخٍ لَكَ لَمْ ...'",
    subtitleAr: "في معنى الصداقة والوفاء الصادق",
    optionsAr: ["تَلِدْهُ أُمُّكَ", "تَرَهُ عَيْنَاك", "تَعْرِفْ اسْمَهُ", "تَشْكُ لَهُ هَمَّك"],
    correctAnswer: 0,
    explanationAr: "المثل الشهير لقمان بن عاد: 'رب أخ لك لم تلده أمك'، يضرب في وفاء الصديق الصدوق الذي يفيض نصرة ومحبة كالأخ الشقيق.",
    timeLimit: 12,
  },
  {
    id: "arab-5",
    type: "vocabulary",
    promptAr: "ما هو 'الدَّيْجُور' في الشعر العربي؟",
    subtitleAr: "وصف للأوقات والأحوال",
    optionsAr: ["الظلام الشديد الحالك", "الفجر المشرق", "المطر الغزير", "الريح الباردة"],
    correctAnswer: 0,
    explanationAr: "الديجور هو الظلام الدامس الحالك، يقال ليل ديجور أي مظلم جداً.",
    timeLimit: 15,
  },
  {
    id: "arab-6",
    type: "eloquence",
    promptAr: "ما الكلمة التي تعني 'شدة العطش' في مراتب العطش باللغة العربية؟",
    subtitleAr: "دقة الألفاظ في لغة الضاد",
    optionsAr: ["الأُوَام والهُيَام", "النَّعَاس", "السَّغَب", "الوَنَى"],
    correctAnswer: 0,
    explanationAr: "يقال: العطش، ثم الظمأ، ثم الصَّدَى، ثم الأُوام والهُيام وهو أشد مراتب العطش.",
    timeLimit: 15,
  },
  {
    id: "arab-7",
    type: "grammar_wit",
    promptAr: "في جملة: 'لا تأكلْ وأنتَ شَبْعَانُ'، ما إعراب جملة 'وأنت شبعان'؟",
    subtitleAr: "نباهة لغوية وسرعة استيعاب",
    optionsAr: ["جملة حالية في محل نصب حال", "جملة خبرية", "جملة نعتيه", "جملة معطوفة"],
    correctAnswer: 0,
    explanationAr: "الواو هنا واو الحال، والجملة الاسمية 'أنت شبعان' في محل نصب حال تبين هيئة الفاعل.",
    timeLimit: 15,
  },
  {
    id: "arab-8",
    type: "proverb",
    promptAr: "أكمل المثل السائر: 'عَلَى أَهْلِهَا جَنَتْ ...'",
    subtitleAr: "يضرب لمن تسبب في جلب البلاء لنفسه وأهله",
    optionsAr: ["بَرَاقِشُ", "عَصْمَاءُ", "خُذَامُ", "جَدْعَاءُ"],
    correctAnswer: 0,
    explanationAr: "'جنت على أهلها براقش': براقش كانت كلبة نبحت فدلت الأعداء على مكان قومها المختبئين فاستؤصلوا.",
    timeLimit: 12,
  },
  {
    id: "arab-9",
    type: "plural",
    promptAr: "ما جمع كلمة 'حَلِيب' في المعاجم العربية الأصيلة؟",
    subtitleAr: "تحدي جمع الكلمات النادرة",
    optionsAr: ["أَحْلِبَة وحُلُب", "حَلِيبَات", "حُلَبَاء", "حَلَائِب"],
    correctAnswer: 0,
    explanationAr: "جمع حليب هو أحلبة وحُلُب، مثل رغيف وأرغفة ورُغُف.",
    timeLimit: 15,
  },
  {
    id: "arab-10",
    type: "opposite",
    promptAr: "ما مقابل كلمة 'السَّخَاء' في الصفات الأخلاقية؟",
    subtitleAr: "معادلة الأضداد اللغوية",
    optionsAr: ["الشُّحّ والبُخْل", "الجُبْن", "الغَفْلَة", "القَسْوَة"],
    correctAnswer: 0,
    explanationAr: "السخاء هو الجود والكرم، وضده الشح والبخل؛ والشح أشد البخل لأنه بخل مع حرص وطمع.",
    timeLimit: 12,
  },
  {
    id: "arab-11",
    type: "vocabulary",
    promptAr: "ما هو 'اليَمْلُوك' أو 'اليَرْمُوك' في مصطلحات المياه والوديان؟",
    subtitleAr: "أسرار أسماء الأنهار والمعالم",
    optionsAr: ["النهر أو الوادي الجاري", "البئر المهجورة", "الغدير الراكد", "عين الماء المالحة"],
    correctAnswer: 0,
    explanationAr: "اليرموك نهر معروف، واليم هو البحر الواسع العظيم.",
    timeLimit: 15,
  },
  {
    id: "arab-12",
    type: "eloquence",
    promptAr: "ما الفرق في البلاغة بين 'الحَمْد' و'الشُّكْر'؟",
    subtitleAr: "فروق لغوية دقيقة وممتعة",
    optionsAr: [
      "الحمد أعم متعلَّقاً (يحمد على الصفات والنعم) والشكر أخص (يكون مقابل النعم)",
      "الحمد والشكر مترادفان تماماً لا فرق بينهما",
      "الشكر يكون باللسان فقط والحمد بالجوارح فقط",
      "الحمد للمخلوق والشكر للخالق حصراً"
    ],
    correctAnswer: 0,
    explanationAr: "الحمد أعم من حيث الأسباب، فيحمد المحمود على كمال ذاته ونعمه، والشكر أعم من حيث الآلات فيكون باللسان والقلب والجوارح.",
    timeLimit: 20,
  },
  {
    id: "arab-13",
    type: "proverb",
    promptAr: "ما تكملة المثل الحكيم: 'مَنْ جَدَّ وَجَدَ، وَمَنْ زَرَعَ ...'؟",
    subtitleAr: "مثل المثابرة والاجتهاد",
    optionsAr: ["حَصَدَ", "فَرِحَ", "شَبِعَ", "غَنِمَ"],
    correctAnswer: 0,
    explanationAr: "'من جد وجد، ومن زرع حصد، ومن سار على الدرب وصل'. قاعدة العمل والثمرة.",
    timeLimit: 10,
  },
  {
    id: "arab-14",
    type: "vocabulary",
    promptAr: "ماذا يسمى ولد 'الظَّبْي' في العربية الفصحى؟",
    subtitleAr: "مسميات صغار الحيوانات",
    optionsAr: ["الخِشْف والرَّشَأ", "الدَّغْفَل", "الجَرْو", "الحَمَل"],
    correctAnswer: 0,
    explanationAr: "ولد الظبي يسمى خِشفاً إذا كان حديث الولادة، ورشأً إذا اشتد وقوي ومشى مع أمه.",
    timeLimit: 15,
  },
  {
    id: "arab-15",
    type: "plural",
    promptAr: "ما جمع كلمة 'سَفَرْجَل'؟",
    subtitleAr: "فاكهة طيبة الرائحة",
    optionsAr: ["سَفَارِج", "سَفَارِيج", "سَفَرْجَلَات", "سَفَارِق"],
    correctAnswer: 0,
    explanationAr: "جمع سفرجل هو سفارج بحذف الحرف الخامس الزائد في صيغة منتهى الجموع (فَعَالِل).",
    timeLimit: 15,
  }
];

export const ARABIC_LANGUAGE_BANK: ArabicQuestion[] = RAW_ARABIC_LANGUAGE_BANK.map(randomizeRoundOptions);
