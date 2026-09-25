"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
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
      <div className="w-12 h-12 rounded-2xl bg-[#EAF7FF] border border-[#BAE6FD] text-[#2F8FD8] flex items-center justify-center animate-spin mx-auto mb-4">
        <Sparkles className="w-6 h-6 text-[#2F8FD8]" />
      </div>
      <h2 className="text-xl font-bold font-arabic text-[#17324D]">جاري تجهيز غرفتك...</h2>
      <p className="text-xs text-[#60788C] mt-1">توليد الرمز السداسي وتهيئة الاتصال</p>
    </div>
  );
}

export default function HostNewRoomPage() {
  return (
    <div className="min-h-screen bg-[#F4F9FD] flex flex-col items-center justify-center text-[#17324D] font-arabic p-4">
      <Suspense fallback={<div className="text-sm font-bold text-[#60788C]">جاري التحميل...</div>}>
        <HostNewRoomContent />
      </Suspense>
    </div>
  );
}
