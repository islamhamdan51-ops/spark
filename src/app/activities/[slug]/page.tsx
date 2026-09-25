"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Play, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { getActivityBySlug, ACTIVITIES } from "@/data/activities";

export default function ActivityPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const activity = getActivityBySlug(slug) || ACTIVITIES[0];

  const handleStartActivity = () => {
    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    router.push(`/host/${roomCode}?act=${activity.slug}`);
  };

  const energyLabel = activity.energy === "high" ? "طاقة عالية" : activity.energy === "medium" ? "طاقة متوسطة" : "طاقة هادئة";

  return (
    <div className="flex-1 flex flex-col bg-[#F4F9FD] text-[#17324D] font-arabic">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Back Link */}
        <Link
          href="/activities"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#60788C] hover:text-[#17324D] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>العودة للأنشطة</span>
        </Link>

        {/* Clean Activity Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2EEF8] shadow-xs space-y-6">
          
          {/* Top Category & Title */}
          <div>
            <span className="inline-block px-3 py-1 rounded-md bg-[#EAF7FF] text-[#2F8FD8] text-xs font-bold mb-2">
              {activity.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#17324D]">
              {activity.titleAr}
            </h1>
            <p className="text-sm sm:text-base text-[#60788C] mt-2 leading-relaxed">
              {activity.descriptionAr}
            </p>
          </div>

          {/* Clean Metadata Specs */}
          <div className="grid grid-cols-3 gap-3 py-3 border-y border-[#E2EEF8] text-center text-xs text-[#60788C]">
            <div className="p-3 rounded-xl bg-[#F4F9FD]">
              <span className="block text-[11px] text-[#60788C] mb-0.5">المدة</span>
              <span className="font-bold text-[#17324D]">{activity.duration} دقائق</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F4F9FD]">
              <span className="block text-[11px] text-[#60788C] mb-0.5">المشاركون</span>
              <span className="font-bold text-[#17324D]">{activity.minPlayers}–{activity.maxPlayers}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F4F9FD]">
              <span className="block text-[11px] text-[#60788C] mb-0.5">الطاقة</span>
              <span className="font-bold text-[#17324D]">{energyLabel}</span>
            </div>
          </div>

          {/* 3 Simple Steps: كيف تعمل؟ */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base font-bold text-[#17324D]">
              كيف تعمل؟
            </h2>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F4F9FD] border border-[#E2EEF8]">
                <span className="w-6 h-6 rounded-full bg-[#2F8FD8] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span className="text-xs text-[#17324D] leading-relaxed">
                  يفتح المضيف الغرفة ويعرض السؤال والرمز على الشاشة الرئيسية.
                </span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F4F9FD] border border-[#E2EEF8]">
                <span className="w-6 h-6 rounded-full bg-[#2F8FD8] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span className="text-xs text-[#17324D] leading-relaxed">
                  يدخل المشاركون عبر هواتفهم بمسح الرمز دون تسجيل أو تثبيت.
                </span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F4F9FD] border border-[#E2EEF8]">
                <span className="w-6 h-6 rounded-full bg-[#2F8FD8] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span className="text-xs text-[#17324D] leading-relaxed">
                  تظهر النتائج والتفاعلات حية على الشاشة وسط تفاعل المجموعة.
                </span>
              </div>
            </div>
          </div>

          {/* Dominant Primary Action & Secondary */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleStartActivity}
              className="w-full sm:flex-1 bg-[#2F8FD8] hover:bg-[#1F7EC7] active:scale-98 text-white font-bold text-sm py-3 rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>ابدأ النشاط</span>
            </button>

            <Link
              href={`/demo?activity=${activity.slug}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#2F8FD8] bg-white hover:bg-[#F4F9FD] text-[#2F8FD8] font-bold text-sm text-center transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-[#2F8FD8]" />
              <span>جرّب Demo</span>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
