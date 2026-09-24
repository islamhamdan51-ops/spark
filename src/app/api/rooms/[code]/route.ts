import { NextRequest, NextResponse } from "next/server";
import { getServerRoom, saveServerRoom } from "@/lib/server-rooms";
import { RoomState } from "@/types";

export const dynamic = "force-dynamic";

const antiCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code?.trim();
  if (!code) {
    return NextResponse.json({ success: false, error: "Missing room code" }, { status: 400, headers: antiCacheHeaders });
  }

  const room = getServerRoom(code);
  if (!room) {
    return NextResponse.json(
      { success: false, error: "الغرفة غير موجودة أو لم تبدأ بعد. تأكد من الرمز." },
      { status: 404, headers: antiCacheHeaders }
    );
  }

  return NextResponse.json({ success: true, room }, { headers: antiCacheHeaders });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code?.trim();
  if (!code) {
    return NextResponse.json({ success: false, error: "Missing room code" }, { status: 400, headers: antiCacheHeaders });
  }

  try {
    const body: RoomState = await request.json();
    if (!body || body.code !== code) {
      return NextResponse.json({ success: false, error: "Invalid room payload" }, { status: 400, headers: antiCacheHeaders });
    }

    const currentRoom = getServerRoom(code);
    if (currentRoom) {
      // Reject stale out-of-order requests strictly: never downgrade server version!
      if (
        body.version !== undefined &&
        currentRoom.version !== undefined &&
        body.version < currentRoom.version
      ) {
        return NextResponse.json({ success: true, room: currentRoom }, { headers: antiCacheHeaders });
      }

      const roundChanged = body.currentRoundIndex !== currentRoom.currentRoundIndex;

      // Merge players to preserve all joined participants
      const playerMap = new Map();
      (currentRoom.players || []).forEach((p) => playerMap.set(p.id, p));
      (body.players || []).forEach((p) => {
        const existing = playerMap.get(p.id);
        playerMap.set(p.id, existing ? { ...existing, ...p } : p);
      });
      body.players = Array.from(playerMap.values());

      // Intelligent answers synchronization:
      // When host starts countdown, resets, or launches a round, answers for that round must be fresh
      if (body.status === "COUNTDOWN" || body.status === "LOBBY") {
        body.answers = body.answers || [];
      } else if (body.status === "PLAYING_ROUND" && roundChanged) {
        body.answers = body.answers || [];
      } else {
        const answerMap = new Map();
        (currentRoom.answers || []).forEach((a) => answerMap.set(`${a.playerId}_${a.roundId}`, a));
        (body.answers || []).forEach((a) => answerMap.set(`${a.playerId}_${a.roundId}`, a));
        body.answers = Array.from(answerMap.values());
      }
    }

    saveServerRoom(body);
    return NextResponse.json({ success: true, room: body }, { headers: antiCacheHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: antiCacheHeaders });
  }
}
