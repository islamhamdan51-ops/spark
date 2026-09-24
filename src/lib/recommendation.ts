import { Activity, RecommendationResult, WizardAnswers } from "@/types";
import { ACTIVITIES } from "@/data/activities";

export function calculateRecommendation(answers: WizardAnswers): RecommendationResult {
  const parsedPlayers = parsePlayerCount(answers.playerCount);
  const parsedDuration = parseInt(answers.durationMinutes, 10) || 5;

  const scored = ACTIVITIES.map((act) => {
    let score = 50; // base score

    // 1. Audience & Age Matching
    if (answers.audience === "kids") {
      if (act.audience !== "kids") {
        return { act, score: -999 }; // exclude adult-only content for kids
      }
      score += 40;

      // Age group match within kids
      if (answers.ageRange && act.kidsAgeGroup) {
        if (act.kidsAgeGroup === answers.ageRange || act.kidsAgeGroup === "all") {
          score += 30;
        } else {
          score -= 20;
        }
      }
    } else {
      // Adults / Mixed / Teens
      if (act.audience === "kids") {
        score -= 50; // deprioritize kids activities for adult groups
      } else {
        score += 20;
      }
    }

    // 2. Phone Requirement
    if (answers.hasPhones === "no") {
      if (act.requiresPhone) {
        return { act, score: -999 }; // impossible if no phones
      }
      score += 45; // boost facilitator non-phone activities
      if (["CHARADES", "FIND_SOMEONE_WHO", "SIXTY_SEC_CHALLENGE", "TEAM_CHALLENGE"].includes(act.type)) {
        score += 30;
      }
    } else if (answers.hasPhones === "yes") {
      if (act.requiresPhone) score += 20;
    }

    // 3. Screen Requirement
    if (answers.hasScreen === "no" && act.requiresScreen) {
      score -= 25;
    }

    // 4. Player Count Matching
    if (parsedPlayers < act.minPlayers || parsedPlayers > act.maxPlayers) {
      score -= 35;
    } else {
      score += 25;
    }

    if (parsedPlayers > 20) {
      if (["THIS_OR_THAT", "RAPID_FIRE", "FIND_SOMEONE_WHO", "WORD_CLOUD"].includes(act.type)) {
        score += 30;
      }
    } else if (parsedPlayers <= 8) {
      if (["TWO_TRUTHS_AND_A_LIE", "WOULD_YOU_RATHER", "DISCUSSION_STARTER"].includes(act.type)) {
        score += 30;
      }
    }

    // 5. Duration Matching
    if (act.duration <= parsedDuration) {
      score += 25;
      if (parsedDuration <= 3 && act.duration <= 3) {
        score += 30; // boost fast micro-activities
      }
    } else {
      score -= 30;
    }

    // 6. Energy Level
    if (act.energy === answers.energy) {
      score += 30;
    } else if (answers.energy === "high" && act.energy === "calm") {
      score -= 25;
    }

    // 7. Goal & Theme Alignment
    if (answers.goal === "faith") {
      if (act.faithContent || act.category === "ISLAMIC" || act.tags?.includes("faith")) {
        score += 60;
      }
    } else if (answers.goal === "learning") {
      if (act.educationContent || act.languageContent || act.category === "QUIZ") {
        score += 40;
      }
    } else if (act.goal === answers.goal) {
      score += 40;
    }

    // Boost playable flagships for rich automated experiences
    if (act.isPlayable) {
      score += 15;
    }

    return { act, score };
  });

  const valid = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (valid.length === 0) {
    const fallback = ACTIVITIES.find((a) => a.slug === "this-or-that") || ACTIVITIES[0];
    return {
      topActivity: fallback,
      alternatives: ACTIVITIES.slice(1, 3),
      reasonAr: "نشاط مرن وفوري يناسب معظم المجموعات ولا يحتاج أي تحضير مسبق.",
      matchScore: 92,
    };
  }

  const top = valid[0].act;
  const alternatives = valid.slice(1, 3).map((v) => v.act);

  let reasonAr = top.whyRecommended || `اخترنا هذا النشاط لأنه مناسب لـ${parsedPlayers} شخصاً، مدته حوالي ${top.duration} دقائق، وطاقته تتطابق مع هدفك.`;
  
  if (answers.hasPhones === "no" && !top.requiresPhone) {
    reasonAr = `اخترنا هذا النشاط لأنه لا يحتاج هواتف للمشاركين، مدته ${top.duration} دقائق، ومثالي لتفاعل القاعة بحركة طبيعية وتوجيه الميسر.`;
  } else if (answers.goal === "faith") {
    reasonAr = "نشاط إيماني تفاعلي مبني على نصوص موثوقة يعزز المعرفة والتدبر بروح المشاركة.";
  } else if (parsedPlayers > 20 && answers.energy === "high") {
    reasonAr = `مثالي لمجموعة كبيرة (${parsedPlayers} شخصاً) مع طاقة حماسية عالية ونتائج لحظية تبهر الجميع.`;
  }

  return {
    topActivity: top,
    alternatives,
    reasonAr,
    matchScore: Math.min(99, Math.max(88, valid[0].score)),
  };
}

function parsePlayerCount(count: string): number {
  switch (count) {
    case "2-5":
      return 4;
    case "6-10":
      return 8;
    case "11-20":
      return 15;
    case "21-40":
      return 30;
    case "40+":
      return 50;
    default:
      return 12;
  }
}

// 🎲 Random Spark (Save Me) Selection Engine
export function getRandomSpark(audience: "adults" | "kids" = "adults"): Activity {
  const eligible = ACTIVITIES.filter((a) => {
    if (audience === "kids") return a.audience === "kids";
    return a.audience !== "kids";
  });
  return eligible[Math.floor(Math.random() * eligible.length)] || ACTIVITIES[0];
}
