import { NextRequest, NextResponse } from "next/server";
import { getServerRoom, saveServerRoom } from "@/lib/server-rooms";
import { RoomState } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code?.trim();
  if (!code) {
    return NextResponse.json({ success: false, error: "Missing room code" }, { status: 400 });
  }

  const room = getServerRoom(code);
  if (!room) {
    return NextResponse.json(
      { success: false, error: "الغرفة غير موجودة أو لم تبدأ بعد. تأكد من الرمز." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, room });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code?.trim();
  if (!code) {
    return NextResponse.json({ success: false, error: "Missing room code" }, { status: 400 });
  }

  try {
    const body: RoomState = await request.json();
    if (!body || body.code !== code) {
      return NextResponse.json({ success: false, error: "Invalid room payload" }, { status: 400 });
    }

    saveServerRoom(body);
    return NextResponse.json({ success: true, room: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
