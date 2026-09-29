import { 
  SparkSession, SessionStage, SessionRhythmStage, 
  AudienceType, EnergyLevel, GoalType, Activity, RescueIntervention 
} from "@/types";
import { ACTIVITIES, getActivityBySlug } from "@/data/activities";
import { CLOSING_ACTIVITIES } from "@/data/closing-activities";

export interface SessionBuilderConfig {
  titleAr?: string;
  participantCount: number;
  audience: AudienceType;
  durationMinutes: number;
  goal: GoalType | string;
  energy: EnergyLevel;
  hasPhones: boolean;
  hasScreen?: boolean;
}

export function generateSession(config: SessionBuilderConfig): SparkSession {
  const duration = Math.max(10, config.durationMinutes || 30);
  const participants = config.participantCount || 20;
  const audience = config.audience || "adults";
  const goal = config.goal || "cooperation";
  const energy = config.energy || "medium";
  const hasPhones = config.hasPhones ?? true;
  const hasScreen = config.hasScreen ?? true;

  // 1. Determine Rhythm Sequence based on duration & audience
  // Standard rhythm: Icebreaker -> Energy -> Challenge/Learning -> Discussion/Values -> Closing
  let stagePlan: { stageType: SessionRhythmStage; ratio: number }[];
  if (duration <= 15) {
    stagePlan = [
      { stageType: "ICEBREAKER", ratio: 0.35 },
      { stageType: "ENERGY", ratio: 0.45 },
      { stageType: "CLOSING", ratio: 0.20 },
    ];
  } else if (duration <= 25) {
    stagePlan = [
      { stageType: "ICEBREAKER", ratio: 0.25 },
      { stageType: "ENERGY", ratio: 0.35 },
      { stageType: "DISCUSSION", ratio: 0.25 },
      { stageType: "CLOSING", ratio: 0.15 },
    ];
  } else {
    // 30+ minutes full professional sequence
    stagePlan = [
      { stageType: "ICEBREAKER", ratio: 0.17 }, // ~5 min
      { stageType: "ENERGY", ratio: 0.23 },      // ~7 min
      { stageType: "TEAMWORK", ratio: 0.27 },    // ~8 min
      { stageType: "DISCUSSION", ratio: 0.20 },  // ~6 min
      { stageType: "CLOSING", ratio: 0.13 },     // ~4 min
    ];
  }

  // 2. Select curated activities for each stage
  const usedSlugs = new Set<string>();
  const stages: SessionStage[] = [];
  let elapsedMinutes = 0;

  stagePlan.forEach((plan, idx) => {
    let stageDuration = Math.max(2, Math.round(duration * plan.ratio));
    // adjust last stage to match total duration exactly
    if (idx === stagePlan.length - 1) {
      stageDuration = Math.max(2, duration - elapsedMinutes);
    }

    const activity = pickActivityForStage({
      stageType: plan.stageType,
      audience,
      goal,
      energy,
      hasPhones,
      hasScreen,
      participantCount: participants,
      usedSlugs,
    });

    usedSlugs.add(activity.slug);

    const startMin = elapsedMinutes;
    const endMin = elapsedMinutes + stageDuration;
    elapsedMinutes = endMin;

    const timeRange = `${formatTime(startMin)}–${formatTime(endMin)}`;

    const { facilitatorTipAr, nowInstructionAr, nextInstructionAr } = getFacilitatorGuidance(
      plan.stageType,
      activity,
      idx + 1,
      stagePlan.length,
      participants
    );

    stages.push({
      id: `stg-${Date.now()}-${idx + 1}`,
      order: idx + 1,
      stageType: plan.stageType,
      titleAr: activity.titleAr,
      subtitleAr: activity.taglineAr,
      timeRange,
      durationMinutes: stageDuration,
      originalDurationMinutes: stageDuration,
      activity,
      facilitatorTipAr,
      nowInstructionAr,
      nextInstructionAr,
      closingPromptAr: activity.instructions.hostAr?.[activity.instructions.hostAr.length - 1] || "ما أكثر شيء فاجأكم في هذا النشاط؟",
    });
  });

  const sessionTitleAr = config.titleAr || getDefaultSessionTitle(goal, audience);

  return {
    id: `sess-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    titleAr: sessionTitleAr,
    descriptionAr: `جلسة متكاملة مدتها ${duration} دقيقة مصممة لـ ${participants} شخصاً لتحقيق هدف: ${translateGoal(goal)}.`,
    audience,
    participantCount: participants,
    totalDuration: duration,
    goal,
    energy,
    requiresPhone: hasPhones,
    requiresScreen: hasScreen,
    stages,
    createdAt: Date.now(),
    currentStageIndex: 0,
  };
}

// Format 0 to "00:00", 5 to "05:00", 12 to "12:00"
function formatTime(minutes: number): string {
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  const mStr = m < 10 ? `0${m}` : `${m}`;
  const sStr = s < 10 ? `0${s}` : `${s}`;
  return `${mStr}:${sStr}`;
}

interface PickParams {
  stageType: SessionRhythmStage;
  audience: AudienceType;
  goal: GoalType | string;
  energy: EnergyLevel;
  hasPhones: boolean;
  hasScreen: boolean;
  participantCount: number;
  usedSlugs: Set<string>;
}

function pickActivityForStage(params: PickParams): Activity {
  const { stageType, audience, goal, energy, hasPhones, usedSlugs } = params;

  // Filter pool
  let candidates = ACTIVITIES.filter((act) => {
    if (usedSlugs.has(act.slug)) return false;

    // Audience check
    if (audience === "kids" && act.audience !== "kids") return false;
    if (audience === "adults" && act.audience === "kids") return false;

    // Phone check
    if (!hasPhones && act.requiresPhone) return false;

    return true;
  });

  if (candidates.length === 0) {
    candidates = ACTIVITIES.filter((act) => !hasPhones ? !act.requiresPhone : true);
  }

  // Stage-specific score matching
  const scored = candidates.map((act) => {
    let score = 50;

    switch (stageType) {
      case "ICEBREAKER":
        if (act.category === "ICEBREAKER" || act.goal === "icebreaker" || act.goal === "silence_breaker") score += 50;
        if (act.slug === "this-or-that" || act.slug === "two-truths-and-a-lie") score += 30;
        break;

      case "ENERGY":
        if (act.category === "ENERGY" || act.energy === "high" || act.requiresMovement) score += 50;
        if (act.slug === "sixty-sec-challenge" || act.slug === "rapid-fire" || act.slug === "charades") score += 35;
        break;

      case "TEAMWORK":
        if (act.category === "TEAM" || act.cooperative || act.type === "TEAM_CHALLENGE") score += 50;
        if (goal === "cooperation") score += 30;
        break;

      case "LEARNING":
        if (act.category === "QUIZ" || act.category === "ISLAMIC" || act.category === "ARABIC" || act.educationContent) score += 50;
        break;

      case "DISCUSSION":
        if (act.category === "DISCUSSION" || act.type === "DISCUSSION_STARTER" || act.goal === "discussion") score += 55;
        break;

      case "VALUES":
        if (act.category === "VALUES" || act.faithContent || act.slug.includes("values")) score += 60;
        break;

      case "REFLECTION":
      case "CLOSING":
        if (act.category === "REFLECTION" || act.slug.startsWith("closing-") || act.type === "WORD_CLOUD") score += 60;
        break;
    }

    if (act.goal === goal) score += 25;
    if (act.isPlayable) score += 15;

    return { act, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.act || CLOSING_ACTIVITIES[0] || ACTIVITIES[0];
}

function getFacilitatorGuidance(
  stageType: SessionRhythmStage,
  activity: Activity,
  order: number,
  totalStages: number,
  participants: number
) {
  let facilitatorTipAr = activity.instructions.hostAr?.[0] || "شجع المشاركين وتفاعل بإيجابية مع إجاباتهم.";
  let nowInstructionAr = "ابدأ النشاط ووجّه الحضور لمتابعة الشاشة.";
  let nextInstructionAr = `بعد انتهاء هذا النشاط، استعد للمرحلة ${order + 1} من ${totalStages}.`;

  if (participants > 20) {
    facilitatorTipAr = "هذه المجموعة كبيرة: اجعل التفاعل عبر الهتاف الجماعي أو ثنائيات الطاولة لتوفير الوقت.";
  }

  switch (stageType) {
    case "ICEBREAKER":
      nowInstructionAr = "اطلب من المشاركين الدخول والمشاركة فوراً دون تردد لكسر الهدوء.";
      nextInstructionAr = "جهّز المجموعة لنشاط يرفع الطاقة ويزيد الحماس.";
      break;
    case "ENERGY":
      nowInstructionAr = "ارفع نبرة صوتك وشجع المنافسة الودية والتصفيق في القاعة.";
      nextInstructionAr = "هدئ القاعة برفق تمهيداً لمحطة العمل الجماعي أو الحوار.";
      break;
    case "TEAMWORK":
      nowInstructionAr = "قسّم الحضور إلى فرق صغيرة واطلب منهم التنسيق معاً في وقت محدد.";
      nextInstructionAr = "وجّه التركيز نحو استخلاص أهم الملاحظات والنقاط المشتركة.";
      break;
    case "DISCUSSION":
      nowInstructionAr = "اطرح السؤال بهدوء، وأعطِ كل شخص فرصة الحديث والاستماع لزميله.";
      nextInstructionAr = "اجمع انتباه الجميع نحو الشاشة لجولة الختام والتعهد.";
      break;
    case "CLOSING":
      nowInstructionAr = "اطلب من كل شخص كتابة كلمته الختامية أو التزامه العملي.";
      nextInstructionAr = "أعلن ختام الجلسة بنجاح واشكر الجميع على تفاعلهم الراقي.";
      break;
  }

  return { facilitatorTipAr, nowInstructionAr, nextInstructionAr };
}

function getDefaultSessionTitle(goal: GoalType | string, audience: AudienceType): string {
  if (audience === "kids") return "ورشة الأبطال الصغار التفاعلية";
  switch (goal) {
    case "icebreaker":
      return "جلسة أول لقاء وكسر الجمود";
    case "cooperation":
    case "team":
      return "جلسة بناء الفريق والتعاون المؤسسي";
    case "faith":
      return "جلسة تدبر وقيم إيمانية";
    case "learning":
      return "جلسة التحدي والمعرفة التفاعلية";
    case "discussion":
      return "جلسة الحوار وصناعة الأفكار";
    case "energizer":
      return "جلسة شحذ الطاقة والحماس السريع";
    default:
      return "جلسة تفاعلية متكاملة";
  }
}

function translateGoal(goal: GoalType | string): string {
  const map: Record<string, string> = {
    icebreaker: "كسر الجمود والتعارف",
    cooperation: "بناء الفريق والتعاون",
    faith: "القيم والإيمان والتدبر",
    learning: "التعلم واكتساب المعرفة",
    discussion: "فتح الحوار والنقاش",
    energizer: "رفع الحماس وشحن الطاقة",
    laughter: "الضحك والمرح المشترك",
    silence_breaker: "كسر الصمت والانخراط",
    creativity: "الإبداع والتفكير الحر",
  };
  return map[goal] || goal;
}

// ==========================================
// 08 — TIME RESCUE (اختصر الجلسة)
// ==========================================
export function compressSessionForTimeRescue(
  session: SparkSession,
  remainingMinutes: number,
  currentStageIndex: number
): { updatedSession: SparkSession; messageAr: string; compressedRoundsCount: number } {
  const remainingStagesCount = session.stages.length - currentStageIndex;
  const currentStage = session.stages[currentStageIndex];

  // Activity-aware shortening:
  // If time is very short (e.g. <= 3 minutes)
  let compressedRoundsCount = 2;
  let messageAr = "";

  if (remainingMinutes <= 3) {
    compressedRoundsCount = 2;
    messageAr = "تم اختصار النشاط إلى جولتين فقط للانتهاء قبل نفاد الوقت المتبقي (3 دقائق)! ⏱️";
  } else if (remainingMinutes <= 8) {
    compressedRoundsCount = 3;
    messageAr = `تم ضغط الجلسة لتناسب الـ ${remainingMinutes} دقائق المتبقية مع تقليص الأسئلة للحفاظ على جودة الختام. ⚡`;
  } else {
    compressedRoundsCount = 4;
    messageAr = `تم تقليص زمن الجولات تلقائياً لتناسب الـ ${remainingMinutes} دقيقة المتبقية. ⏳`;
  }

  // Update remaining stages duration proportionally
  const updatedStages = session.stages.map((stage, idx) => {
    if (idx < currentStageIndex) return stage;
    const isCurrent = idx === currentStageIndex;
    const isClosing = idx === session.stages.length - 1;

    let newDuration = Math.max(1, Math.round(remainingMinutes / Math.max(1, remainingStagesCount)));
    if (isClosing && remainingMinutes > 2) {
      newDuration = 2; // preserve at least 2 minutes for closing
    }

    return {
      ...stage,
      durationMinutes: newDuration,
      isCompressed: true,
    };
  });

  return {
    updatedSession: {
      ...session,
      stages: updatedStages,
      totalDuration: Math.max(session.totalDuration, currentStageIndex * 5 + remainingMinutes),
    },
    messageAr,
    compressedRoundsCount,
  };
}

// ==========================================
// 09 — SESSION EXPANSION (عندي 10 دقائق إضافية)
// ==========================================
export function expandSession(
  session: SparkSession,
  currentStageIndex: number,
  extraMinutes: number = 10
): { updatedSession: SparkSession; addedStage: SessionStage; messageAr: string } {
  const usedSlugs = new Set(session.stages.map((s) => s.activity.slug));

  // Determine what stage type fits best before closing
  let stageType: SessionRhythmStage = "DISCUSSION";
  if (session.energy === "high") {
    stageType = "TEAMWORK";
  } else if (session.goal === "faith") {
    stageType = "VALUES";
  }

  const newActivity = pickActivityForStage({
    stageType,
    audience: session.audience,
    goal: session.goal,
    energy: session.energy,
    hasPhones: session.requiresPhone,
    hasScreen: session.requiresScreen,
    participantCount: session.participantCount,
    usedSlugs,
  });

  const newStage: SessionStage = {
    id: `stg-exp-${Date.now()}`,
    order: session.stages.length,
    stageType,
    titleAr: newActivity.titleAr,
    subtitleAr: newActivity.taglineAr,
    timeRange: `+${extraMinutes} دقائق إضافية`,
    durationMinutes: extraMinutes - 3,
    activity: newActivity,
    facilitatorTipAr: "نشاط إضافي مرن يعمق التفاعل ويستثمر الوقت المتاح بشكل ممتع.",
    nowInstructionAr: "أعلن للمجموعة أن لديكم متسعاً من الوقت لتحدٍ ممتع إضافي!",
    nextInstructionAr: "انتقل بعدها مباشرة لجولة الختام.",
  };

  // Insert before the closing stage
  const closingIdx = session.stages.length - 1;
  const newStages = [...session.stages];
  newStages.splice(closingIdx, 0, newStage);

  // Re-number stages
  const reorderedStages = newStages.map((s, idx) => ({ ...s, order: idx + 1 }));

  return {
    updatedSession: {
      ...session,
      stages: reorderedStages,
      totalDuration: session.totalDuration + extraMinutes,
    },
    addedStage: newStage,
    messageAr: `تمت إضافة نشاط "${newActivity.titleAr}" (+${extraMinutes} دقيقة) بنجاح لاستثمار الوقت الإضافي. 🌟`,
  };
}

// ==========================================
// 07 — RESCUE MODE (الجلسة تحتاج دفعة)
// ==========================================
export function getRescueIntervention(
  session: SparkSession | null,
  remainingMinutes: number = 6
): RescueIntervention {
  const audience = session?.audience || "adults";
  const participants = session?.participantCount || 20;

  // Immediate 3-minute high energy, no preparation activity
  const candidates = [
    {
      slug: "sixty-sec-challenge",
      titleAr: "تحدي الـ 60 ثانية الحركي",
      taglineAr: "3 دقائق ترفع الأدرينالين وتوقظ القاعة فوراً!",
      reasonAr: "حركة سريعة وتصفيق جماعي يكسر رتابة الجلسة ويعيد شحن الانتباه.",
      tipAr: "اطلب من الجميع الوقوف فوراً واشعل الحماس بصوتك وتشجيعك!",
    },
    {
      slug: "rapid-fire",
      titleAr: "سباق الإجابات الناري (Rapid Fire)",
      taglineAr: "تحدي بديهة وسرعة يخرج الجميع من الشرود الذهني!",
      reasonAr: "أسئلة سريعة مدتها 10 ثوانٍ لكل سؤال تخلق منافسة فورية.",
      tipAr: "ذكّر الحضور بأن السرعة هي مفتاح الفوز في هذه الجولة.",
    },
    {
      slug: "charades",
      titleAr: "تمثيل سريع بلا كلام (3 دقائق)",
      taglineAr: "ضحك جماعي وتخمين فوري يذيب أي فتور!",
      reasonAr: "التمثيل الصامت يغير زاوية التركيز ويخلق طاقة مرح طبيعية بدون شاشات معقدة.",
      tipAr: "اختر شخصاً مرحاً ليمثل أول مشهد لتشجيع البقية على الضحك والمشاركة.",
    },
  ];

  const chosen = candidates[0];
  const act = getActivityBySlug(chosen.slug) || ACTIVITIES[0];

  return {
    id: `rescue-${Date.now()}`,
    titleAr: chosen.titleAr,
    taglineAr: chosen.taglineAr,
    reasonAr: chosen.reasonAr,
    durationMinutes: 3,
    activity: act,
    facilitatorTipAr: chosen.tipAr,
  };
}

// ==========================================
// 05 & 06 — SMART NEXT ACTIVITY
// ==========================================
export function getNextSmartActivityRecommendation(
  currentActivity: Activity,
  session: SparkSession | null,
  currentEnergy: EnergyLevel = "medium"
): {
  activity: Activity;
  reasonAr: string;
  transitionType: "ENERGY_UP" | "DISCUSSION" | "KNOWLEDGE" | "REFLECTION";
  titleAr: string;
} {
  // If current activity was high energy -> recommend discussion or teamwork
  if (currentActivity.energy === "high" || currentEnergy === "high") {
    const act = getActivityBySlug("discussion-starter") || CLOSING_ACTIVITIES[0];
    return {
      activity: act,
      titleAr: "تعميق الأثر ونقاش هادئ",
      reasonAr: "بعد نشاط الحماس العالي، المجموعة الآن في قمة الانفتاح وجاهزة لحوار هادف وتبادل أفكار.",
      transitionType: "DISCUSSION",
    };
  }

  // If current activity was discussion/reflection -> recommend energy up
  if (currentActivity.category === "DISCUSSION" || currentActivity.category === "REFLECTION") {
    const act = getActivityBySlug("this-or-that") || ACTIVITIES[0];
    return {
      activity: act,
      titleAr: "شحن طاقة وتصويت سريع",
      reasonAr: "بعد الحوار الهادئ، ننصح بنشاط تفاعلي سريع يعيد الحيوية والحركة إلى القاعة.",
      transitionType: "ENERGY_UP",
    };
  }

  // Default smart progression
  const act = getActivityBySlug("team-challenge") || ACTIVITIES[0];
  return {
    activity: act,
    titleAr: "تحدي تعاوني جماعي",
    reasonAr: "المجموعة الآن منسجمة ومستعدة لتحدٍ مشترك يعزز روح الفريق والعمل الجماعي.",
    transitionType: "KNOWLEDGE",
  };
}
