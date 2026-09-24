"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { generateRoomCode } from "@/lib/utils";
import { roomManager } from "@/lib/room-store";

function HostNewRoomContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activitySlug = searchParams.get("activity") || "this-or-that";

  useEffect(() => {
    const code = generateRoomCode();
    roomManager.getOrCreateRoom(code, activitySlug, false);
    router.replace(`/host/${code}`);
  }, [activitySlug, router]);

  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-2xl bg-spark-flame/20 border border-spark-flame/40 text-spark-flame flex items-center justify-center animate-spin mx-auto mb-4 text-2xl">
        ⚡
      </div>
      <h2 className="text-xl font-bold font-arabic">جاري تجهيز غرفتك في شرارة...</h2>
      <p className="text-xs text-slate-400 mt-1">توليد الرمز السداسي وتهيئة الاتصال</p>
    </div>
  );
}

export default function HostNewRoomPage() {
  return (
    <div className="min-h-screen bg-spark-950 flex flex-col items-center justify-center text-white font-arabic p-4">
      <Suspense fallback={<div className="text-sm font-bold text-slate-400">جاري التحميل...</div>}>
        <HostNewRoomContent />
      </Suspense>
    </div>
  );
}
