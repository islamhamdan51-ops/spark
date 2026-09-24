import { NextRequest, NextResponse } from "next/server";
import { addPlayerToServerRoom } from "@/lib/server-rooms";

export const dynamic = "force-dynamic";

const antiCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code?.trim();
  if (!code) {
    return NextResponse.json({ success: false, error: "Missing room code" }, { status: 400, headers: antiCacheHeaders });
  }

  try {
    const { nickname, avatar } = await request.json();
    if (!nickname || !nickname.trim()) {
      return NextResponse.json(
        { success: false, error: "الرجاء إدخال اسم مستعار" },
        { status: 400, headers: antiCacheHeaders }
      );
    }

    const result = addPlayerToServerRoom(code, nickname, avatar);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "الغرفة غير موجودة أو لم تبدأ بعد" },
        { status: 404, headers: antiCacheHeaders }
      );
    }

    return NextResponse.json({
      success: true,
      player: result.player,
      room: result.room,
    }, { headers: antiCacheHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: antiCacheHeaders });
  }
}
