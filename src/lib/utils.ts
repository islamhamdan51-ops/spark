import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRoomCode(): string {
  // Generates clean 6-digit room code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const AVATAR_OPTIONS = [
  "⚡", "🔥", "🚀", "🌟", "🦁", "🦊", "🐼", "🦄", 
  "🎯", "🎲", "💎", "🍕", "🎸", "🏆", "🎨", "🌊"
];

export function getRandomAvatar(): string {
  return AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)];
}

/**
 * Deterministic string hash to generate a seed
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Deterministic pseudo-random generator
 */
function createPRNG(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Deterministically shuffles an array based on a seed string (e.g. question prompt or ID)
 */
export function shuffleArrayWithSeed<T>(array: T[], seedStr: string): T[] {
  if (!array || array.length <= 1) return array ? [...array] : [];
  const result = [...array];
  const rng = createPRNG(hashString(seedStr || "spark-seed"));
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Randomizes options for a round and updates correctAnswer index accordingly,
 * ensuring identical order across all clients for the same question while completely
 * distributing the correct answer position randomly across the board (0, 1, 2, 3).
 */
export function randomizeRoundOptions<T extends { optionsAr?: string[]; correctAnswer?: string | number; promptAr?: string; id?: string }>(round: T): T {
  if (!round.optionsAr || round.optionsAr.length <= 1) {
    return round;
  }

  const originalOptions = round.optionsAr;
  let correctOptionText: string | undefined;

  if (round.correctAnswer !== undefined) {
    if (typeof round.correctAnswer === "number" && round.correctAnswer >= 0 && round.correctAnswer < originalOptions.length) {
      correctOptionText = originalOptions[round.correctAnswer];
    } else if (typeof round.correctAnswer === "string") {
      correctOptionText = round.correctAnswer;
    }
  }

  // Shuffle options deterministically using round prompt / id
  const seed = `${round.id || ""}-${round.promptAr || ""}-spark-rnd`;
  const shuffledOptions = shuffleArrayWithSeed(originalOptions, seed);

  let newCorrectAnswer: string | number | undefined = round.correctAnswer;
  if (correctOptionText !== undefined) {
    const newIdx = shuffledOptions.indexOf(correctOptionText);
    if (newIdx !== -1) {
      newCorrectAnswer = newIdx;
    }
  }

  return {
    ...round,
    optionsAr: shuffledOptions,
    correctAnswer: newCorrectAnswer,
  };
}
