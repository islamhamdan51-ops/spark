"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Sparkles, Play, Bookmark, BookmarkCheck, Users, 
  Clock, Smartphone, Monitor, Flame, Shield, Share2, Check 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { getActivityBySlug, ACTIVITIES } from "@/data/activities";

export default function ActivityPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const activity = getActivityBySlug(slug) || ACTIVITIES[0];
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleStartActivity = () => {
    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    router.push(`/host/${roomCode}?act=${activity.slug}`);
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA] text-slate-900 font-arabic">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/activities"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>العودة للمكتبة</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaved(!saved)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              {saved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">تم الحفظ</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>حفظ</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? "تم النسخ" : "مشاركة"}</span>
            </button>
          </div>
        </div>

        {/* Activity Main Header Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-spark-flame text-xs font-bold">
                {activity.category}
              </span>
              {activity.isPlayable && (
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  ⚡ جاهز للبدء المباشر
                </span>
              )}
              {activity.faithContent && (
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  🌙 إسلامي
                </span>
              )}
              {activity.languageContent && (
                <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                  🗣️ لغة عربية
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-arabic">
              {activity.titleAr}
            </h1>
            {activity.taglineAr && (
              <p className="text-sm font-bold text-spark-flame mt-1">
                {activity.taglineAr}
              </p>
            )}
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              {activity.descriptionAr}
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-100 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-400 block mb-0.5">المدة المقدرة</span>
              <span className="text-base font-black text-slate-900 font-mono">⏱️ {activity.duration} دقائق</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-400 block mb-0.5">عدد المشاركين</span>
              <span className="text-base font-black text-slate-900 font-mono">👥 {activity.minPlayers}–{activity.maxPlayers}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-400 block mb-0.5">الفئة العمرية</span>
              <span className="text-base font-black text-slate-900 font-mono">🎂 {activity.minAge}–{activity.maxAge} سنة</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-400 block mb-0.5">مستوى الحماس</span>
              <span className="text-base font-bold text-slate-900 font-arabic">
                {activity.energy === "high" ? "🔥 عالي" : activity.energy === "medium" ? "🌤 متوسط" : "🧊 هادئ"}
              </span>
            </div>
          </div>

          {/* Requirements Chips */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 block">المتطلبات والتجهيزات:</span>
            <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-700">
              <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200">
                {activity.requiresPhone ? "📱 يحتاج هواتف للمشاركين" : "✅ لا يحتاج هواتف"}
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200">
                {activity.requiresScreen ? "📺 يحتاج شاشة عرض أو جهاز عرض" : "لا يشترط شاشة"}
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200">
                {activity.requiresMovement ? "🏃 نشاط حركي في القاعة" : "نشاط جلوس وتفكير"}
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200">
                {activity.competitive ? "🏆 تنافسي بنقاط" : "🤝 تعاوني وتشاركي"}
              </span>
            </div>
          </div>

          {/* How It Works & Roles */}
          <div className="space-y-6 pt-4 border-t border-slate-100">
            {activity.instructions?.overviewAr && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-spark-flame block">كيف يعمل النشاط؟</span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {activity.instructions.overviewAr}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Host Role */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-spark-flame" />
                  <span>ما يفعله الميسر / المضيف:</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                  {activity.instructions?.hostAr ? (
                    activity.instructions.hostAr.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))
                  ) : (
                    <>
                      <li>أطلق الجلسة واعرض رمز الغرفة أو كود QR على الشاشة.</li>
                      <li>وجّه المجموعة وأدر الانتقال بين الجولات.</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Participant Role */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>ما يفعله المشاركون:</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                  {activity.instructions?.participantAr ? (
                    activity.instructions.participantAr.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))
                  ) : (
                    <>
                      <li>يمسح المشارك الكود أو يدخل إلى /join برمز الغرفة.</li>
                      <li>يتفاعل ويصوت مباشرة ويشاهد النتائج الجماعية.</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleStartActivity}
              className="w-full sm:flex-1 bg-spark-flame hover:bg-spark-flame/90 active:scale-98 transition-all py-4 rounded-2xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>ابدأ النشاط مع مجموعتك الآن</span>
            </button>

            <Link
              href="/demo"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>جرّب Demo حي أولاً</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
