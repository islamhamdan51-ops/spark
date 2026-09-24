import { NextRequest } from "next/server";
import { getServerRoom, subscribeServerRoom } from "@/lib/server-rooms";
import { RoomState } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code?.trim();
  if (!code) {
    return new Response("Missing room code", { status: 400 });
  }

  const initialRoom = getServerRoom(code);
  const encoder = new TextEncoder();
  let cleanup: (() => void) | null = null;
  let heartbeat: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(controller) {
      // 1. Immediately push the latest server state upon connection
      if (initialRoom) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialRoom)}\n\n`));
      }

      // 2. Keep-alive heartbeat every 15s to keep mobile proxies and Safari alive
      heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          if (heartbeat) clearInterval(heartbeat);
        }
      }, 15000);

      // 3. Subscribe to real-time events triggered by saveServerRoom
      cleanup = subscribeServerRoom(code, (room: RoomState) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(room)}\n\n`));
        } catch {
          if (cleanup) cleanup();
          if (heartbeat) clearInterval(heartbeat);
        }
      });

      // 4. Handle client disconnection
      request.signal.addEventListener("abort", () => {
        if (cleanup) cleanup();
        if (heartbeat) clearInterval(heartbeat);
        try {
          controller.close();
        } catch {}
      });
    },
    cancel() {
      if (cleanup) cleanup();
      if (heartbeat) clearInterval(heartbeat);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform, no-store, must-revalidate",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
