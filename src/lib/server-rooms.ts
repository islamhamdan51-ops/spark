import { RoomState, Player, PlayerAnswer } from "@/types";
import fs from "fs";
import path from "path";

// Server-side persistent room storage
// Shared across all serverless API requests on Vercel
declare global {
  var __SPARK_ROOMS_STORE: Map<string, RoomState> | undefined;
}

const roomsMap: Map<string, RoomState> = globalThis.__SPARK_ROOMS_STORE || new Map<string, RoomState>();
globalThis.__SPARK_ROOMS_STORE = roomsMap;

// Temporary filesystem backup directory for serverless cold-start resilience
const TMP_DIR = path.join(process.cwd(), ".next", "cache", "spark_rooms");

function ensureTmpDir() {
  try {
    if (!fs.existsSync(TMP_DIR)) {
      fs.mkdirSync(TMP_DIR, { recursive: true });
    }
  } catch {}
}

export function getServerRoom(code: string): RoomState | null {
  // 1. Check in-memory Map
  if (roomsMap.has(code)) {
    return roomsMap.get(code)!;
  }

  // 2. Check filesystem cache
  try {
    ensureTmpDir();
    const filePath = path.join(TMP_DIR, `${code}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsed: RoomState = JSON.parse(data);
      if (parsed && parsed.code === code) {
        roomsMap.set(code, parsed);
        return parsed;
      }
    }
  } catch {}

  return null;
}

export function saveServerRoom(room: RoomState): void {
  roomsMap.set(room.code, room);

  try {
    ensureTmpDir();
    const filePath = path.join(TMP_DIR, `${room.code}.json`);
    fs.writeFileSync(filePath, JSON.stringify(room), "utf-8");
  } catch {}
}

export function addPlayerToServerRoom(
  code: string,
  nickname: string,
  avatar: string
): { success: boolean; player?: Player; room?: RoomState; error?: string } {
  let room = getServerRoom(code);

  if (!room) {
    return {
      success: false,
      error: "الغرفة غير موجودة أو لم تبدأ بعد. تأكد من إطلاق الغرفة أولاً من شاشة المضيف.",
    };
  }

  // Check if player with same nickname already exists
  const existingPlayer = room.players.find(
    (p) => p.nickname.toLowerCase() === nickname.trim().toLowerCase()
  );

  if (existingPlayer) {
    return {
      success: true,
      player: existingPlayer,
      room,
    };
  }

  const newPlayer: Player = {
    id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    nickname: nickname.trim(),
    avatar: avatar || "⚡",
    joinedAt: Date.now(),
    score: 0,
  };

  room.players.push(newPlayer);
  saveServerRoom(room);

  return {
    success: true,
    player: newPlayer,
    room,
  };
}

export function addAnswerToServerRoom(
  code: string,
  answer: PlayerAnswer
): { success: boolean; room?: RoomState } {
  const room = getServerRoom(code);
  if (!room) return { success: false };

  // Avoid duplicate answers from same player for same round
  const existingIdx = room.answers.findIndex(
    (a) => a.playerId === answer.playerId && a.roundId === answer.roundId
  );

  if (existingIdx >= 0) {
    room.answers[existingIdx] = answer;
  } else {
    room.answers.push(answer);
  }

  saveServerRoom(room);
  return { success: true, room };
}
