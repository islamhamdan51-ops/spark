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
