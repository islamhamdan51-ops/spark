"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Shield, Heart, Play, Smartphone, Smile, Volume2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ACTIVITIES } from "@/data/activities";
import { KidsAgeGroup } from "@/types";

export default function KidsPage() {
  const [selectedAge, setSelectedAge] = useState<KidsAgeGroup>("all");

  const kidsActivities = ACTIVITIES.filter((a) => {
    if (a.audience !== "kids") return false;
    if (selectedAge === "all") return true;
    return a.kidsAgeGroup === selectedAge || a.kidsAgeGroup === "all";
  });

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA] text-slate-900 font-arabic">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Kids Hero Banner */}
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 border border-amber-200 text-center relative overflow-hidden mb-10 shadow-xs">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-amber-200 text-amber-900 font-bold text-xs mb-3 shadow-2xs">
            <span>🎈</span>
            <span>عالم شرارة للأطفال — ألعاب حركية ومرحة</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-arabic">
            أهلاً بكم في شرارة أطفال! 🦁✨
          </h1>
          <p className="text-sm sm:text-base text-slate-700 mt-2 max-w-xl mx-auto leading-relaxed">
            أنشطة تفاعلية وحركية مصممة لمختلف مراحل الطفولة: أصوات حيوانات، تماثيل متجمدة، وتحديات ألوان مبهجة.
          </p>

          {/* Child Safety Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 mt-5 rounded-2xl bg-white border border-emerald-200 text-xs text-emerald-800 font-medium shadow-2xs">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>بيئة آمنة 100%: بدون أسماء حقيقية، بدون محادثات عامة، وبإشراف المعلم أو الميسر</span>
          </div>
        </div>

        {/* Age Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {[
            { id: "all", label: "كل الأعمار 🌟", age: "4–12 سنة" },
            { id: "4-6", label: "براعم الصغار 🐣", age: "4–6 سنوات" },
            { id: "7-9", label: "المستكشفون 🚀", age: "7–9 سنوات" },
            { id: "10-12", label: "الأبطال الأذكياء 🧠", age: "10–12 سنة" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedAge(tab.id as KidsAgeGroup)}
              className={`py-3.5 px-6 rounded-2xl text-center font-bold transition-all ${
                selectedAge === tab.id
                  ? "bg-amber-400 text-slate-950 shadow-sm scale-105 border border-amber-400"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-amber-300 shadow-2xs"
              }`}
            >
              <div className="text-sm">{tab.label}</div>
              <div className={`text-[10px] mt-0.5 ${selectedAge === tab.id ? "text-amber-950 font-bold" : "text-slate-400"}`}>
                {tab.age}
              </div>
            </button>
          ))}
        </div>

        {/* Kids Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kidsActivities.map((act) => (
            <div
              key={act.id}
              className="rounded-3xl p-6 bg-white border border-slate-200 hover:border-amber-400/80 shadow-xs hover:shadow-md flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    أعمار {act.minAge}–{act.maxAge} سنة
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-bold">
                    ⏱️ {act.duration} دقائق
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-600 transition-colors font-arabic">
                  {act.titleAr}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {act.descriptionAr}
                </p>

                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-bold">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200">
                    {act.requiresPhone ? "📱 بالهواتف" : "🏃 حركي بدون هاتف"}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200">
                    👥 {act.minPlayers}–{act.maxPlayers} أبطال
                  </span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2">
                <Link
                  href={`/host/${Math.floor(100000 + Math.random() * 900000)}?act=${act.slug}`}
                  className="flex-1 bg-amber-400 hover:bg-amber-500 active:scale-98 transition-all text-slate-950 font-black text-xs py-2.5 rounded-xl text-center shadow-2xs"
                >
                  العب مع الأطفال الآن
                </Link>
                <Link
                  href={`/activity/${act.slug}`}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                >
                  معاينة
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
