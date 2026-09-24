import { NextRequest, NextResponse } from "next/server";
import { addAnswerToServerRoom } from "@/lib/server-rooms";
import { PlayerAnswer } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code?.trim();
  if (!code) {
    return NextResponse.json({ success: false, error: "Missing room code" }, { status: 400 });
  }

  try {
    const answer: PlayerAnswer = await request.json();
    if (!answer || !answer.playerId || !answer.roundId) {
      return NextResponse.json(
        { success: false, error: "Invalid answer payload" },
        { status: 400 }
      );
    }

    const result = addAnswerToServerRoom(code, answer);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "تعذر تسجيل الإجابة، الغرفة غير نشطة" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, room: result.room });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
