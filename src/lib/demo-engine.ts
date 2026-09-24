import { Player, PlayerAnswer, ActivityRound } from "@/types";

export interface DemoPlayerConfig {
  nickname: string;
  avatar: string;
  preferredOptionIndex?: number;
  wordInput?: string;
  responseDelayMs: number;
}

export const SIMULATED_PLAYERS: DemoPlayerConfig[] = [
  { nickname: "نور", avatar: "⚡", responseDelayMs: 1200, wordInput: "طاقة وحماس 🔥" },
  { nickname: "ليث", avatar: "🦁", responseDelayMs: 1800, wordInput: "شغف وتركيز 🚀" },
  { nickname: "سارة", avatar: "🌟", responseDelayMs: 900, wordInput: "إبداع وتجديد ✨" },
  { nickname: "آدم", avatar: "🚀", responseDelayMs: 2500, wordInput: "ضحك ومرح 😂" },
  { nickname: "ريم", avatar: "💎", responseDelayMs: 1500, wordInput: "تعاون جماعي 🤝" },
  { nickname: "آسر", avatar: "🎯", responseDelayMs: 3100, wordInput: "انفتاح وفضول 💡" },
  { nickname: "Maya", avatar: "🎨", responseDelayMs: 2100, wordInput: "تفاؤل وراحة 🌿" },
  { nickname: "Star7", avatar: "🍕", responseDelayMs: 3600, wordInput: "إلهام متواصل ⚡" },
];

export function createSimulatedPlayers(): Player[] {
  const now = Date.now();
  return SIMULATED_PLAYERS.map((p, idx) => ({
    id: `sim-${idx + 1}`,
    nickname: p.nickname,
    avatar: p.avatar,
    joinedAt: now + idx * 400,
    score: 0,
    isSimulated: true,
  }));
}

export function simulateRoundAnswers(
  round: ActivityRound,
  players: Player[],
  onPlayerAnswer: (answer: PlayerAnswer) => void
): () => void {
  const timers: NodeJS.Timeout[] = [];

  players.forEach((player, idx) => {
    const config = SIMULATED_PLAYERS[idx % SIMULATED_PLAYERS.length];
    const delay = config.responseDelayMs + Math.random() * 800;

    let answerValue: string | number = 0;

    if (round.optionsAr && round.optionsAr.length > 0) {
      if (round.correctAnswer !== undefined) {
        // Quick Quiz: 70% chance of correct answer, 30% random
        const isCorrect = Math.random() < 0.75;
        answerValue = isCorrect ? round.correctAnswer : (Number(round.correctAnswer) + 1) % round.optionsAr.length;
      } else {
        // This or that: distributed
        answerValue = (idx % 2 === 0 || idx === 3) ? 0 : 1;
      }
    } else if (round.statements && round.statements.length > 0) {
      // Two Truths & A Lie: find lie index or random
      const lieIdx = round.statements.findIndex((s) => s.isLie);
      answerValue = Math.random() < 0.65 ? (lieIdx >= 0 ? lieIdx : 0) : 0;
    } else {
      // Word cloud or free text
      answerValue = config.wordInput || "حماس متقد 🔥";
    }

    const timer = setTimeout(() => {
      onPlayerAnswer({
        playerId: player.id,
        playerNickname: player.nickname,
        roundId: round.id,
        answer: answerValue,
        answeredAt: Date.now(),
        isCorrect: round.correctAnswer !== undefined ? answerValue === round.correctAnswer : undefined,
        pointsAwarded: round.correctAnswer !== undefined && answerValue === round.correctAnswer ? 100 + Math.max(0, 50 - idx * 5) : 0,
      });
    }, delay);

    timers.push(timer);
  });

  return () => {
    timers.forEach(clearTimeout);
  };
}
