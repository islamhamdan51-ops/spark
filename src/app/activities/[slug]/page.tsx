"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Sparkles, Play, ArrowLeft, ArrowRight, Clock, Users, 
  Smartphone, Monitor, Zap, HelpCircle, CheckCircle2 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { getActivityBySlug, ACTIVITIES } from "@/data/activities";

export default function ActivityPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const activity = getActivityBySlug(slug) || ACTIVITIES[0];

  return (
    <div className="flex-1 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Back Link */}
        <Link
          href="/activities"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لمكتبة الأنشطة</span>
        </Link>

        {/* Hero Card */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-spark-800 relative overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-spark-flame/15 text-spark-amber border border-spark-flame/30">
              {activity.audience === "kids" ? "🎈 نشاط أطفال" : "💼 نشاط كبار وورش"}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-spark-950 text-slate-300 border border-spark-800">
              ⏱️ {activity.duration} دقائق
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-spark-950 text-slate-300 border border-spark-800">
              👥 {activity.minPlayers}–{activity.maxPlayers} لاعب
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-spark-950 text-slate-300 border border-spark-800">
              {activity.requiresPhone ? "📱 يحتاج هواتف" : "🚫 بدون هواتف"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-arabic tracking-tight">
            {activity.titleAr}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mt-3 leading-relaxed max-w-3xl">
            {activity.descriptionAr}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-spark-800">
            <Link
              href={`/host/new?activity=${activity.slug}`}
              className="spark-glow-button px-7 py-3.5 rounded-2xl text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-spark-flame/25"
            >
              <Sparkles className="w-5 h-5" />
              <span>ابدأ الغرفة الحية الآن</span>
            </Link>

            <Link
              href={`/demo?activity=${activity.slug}`}
              className="px-6 py-3.5 rounded-2xl border border-spark-indigo/40 bg-spark-indigo/15 hover:bg-spark-indigo/25 text-indigo-200 font-bold text-sm sm:text-base flex items-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4 fill-indigo-300 text-indigo-300" />
              <span>جرّب في محاكي Demo</span>
            </Link>
          </div>
        </div>

        {/* Detailed Breakdown Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          
          {/* How it works */}
          <div className="p-6 rounded-3xl bg-spark-900/60 border border-spark-800 space-y-3">
            <div className="flex items-center gap-2 text-spark-amber font-bold text-base font-arabic">
              <Zap className="w-5 h-5" />
              <h3>كيف يعمل النشاط؟</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activity.instructions.overviewAr}
            </p>
          </div>

          {/* What the host does */}
          <div className="p-6 rounded-3xl bg-spark-900/60 border border-spark-800 space-y-3">
            <div className="flex items-center gap-2 text-spark-flame font-bold text-base font-arabic">
              <Monitor className="w-5 h-5" />
              <h3>ماذا يفعل الميسر / المضيف؟</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {activity.instructions.hostAr.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-spark-flame font-bold mt-0.5">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What participants do */}
          <div className="p-6 rounded-3xl bg-spark-900/60 border border-spark-800 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-base font-arabic">
              <Smartphone className="w-5 h-5" />
              <h3>ماذا يفعل المشاركون؟</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {activity.instructions.participantAr.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold mt-0.5">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Why Recommended & Next steps */}
          <div className="p-6 rounded-3xl bg-spark-900/60 border border-spark-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base font-arabic">
              <CheckCircle2 className="w-5 h-5" />
              <h3>الأثر والنتيجة المتوقعة</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activity.whyRecommended || "كسر حقيقي للجليد وتفاعل متكافئ يترك أثراً ممتعاً في نفوس الحضور."}
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
