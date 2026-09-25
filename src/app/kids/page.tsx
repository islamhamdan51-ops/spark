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
    <div className="flex-1 flex flex-col bg-[#F4F9FD] text-[#17324D] font-arabic">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Kids Hero Banner */}
        <div className="rounded-3xl p-8 sm:p-12 bg-white border border-[#E2EEF8] text-center relative overflow-hidden mb-10 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF7FF] text-[#2F8FD8] font-bold text-xs mb-3">
            <span>🎈</span>
            <span>شرارة للأطفال — ألعاب حركية ومرحة</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#17324D] font-arabic">
            أهلاً بكم في شرارة أطفال ✨
          </h1>
          <p className="text-sm sm:text-base text-[#60788C] mt-2 max-w-xl mx-auto leading-relaxed">
            أنشطة تفاعلية وحركية مصممة لمختلف مراحل الطفولة: أصوات حيوانات، تماثيل متجمدة، وتحديات ألوان مبهجة.
          </p>

          {/* Child Safety Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mt-5 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8] text-xs text-[#60788C]">
            <Shield className="w-4 h-4 text-[#2F8FD8]" />
            <span>بيئة آمنة 100%: بدون أسماء حقيقية، بدون محادثات عامة، وبإشراف المعلم أو الميسر</span>
          </div>
        </div>

        {/* Age Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {[
            { id: "all", label: "كل الأعمار", age: "4–12 سنة" },
            { id: "4-6", label: "براعم الصغار", age: "4–6 سنوات" },
            { id: "7-9", label: "المستكشفون", age: "7–9 سنوات" },
            { id: "10-12", label: "الأبطال", age: "10–12 سنة" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedAge(tab.id as KidsAgeGroup)}
              className={`py-3 px-6 rounded-2xl text-center font-bold transition-all ${
                selectedAge === tab.id
                  ? "bg-[#2F8FD8] text-white shadow-xs"
                  : "bg-white border border-[#E2EEF8] text-[#60788C] hover:border-[#BAE6FD]"
              }`}
            >
              <div className="text-sm">{tab.label}</div>
              <div className={`text-[10px] mt-0.5 ${selectedAge === tab.id ? "text-sky-100" : "text-[#60788C]"}`}>
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
              className="rounded-3xl p-6 bg-white border border-[#E2EEF8] hover:border-[#BAE6FD] shadow-xs flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EAF7FF] text-[#2F8FD8]">
                    أعمار {act.minAge}–{act.maxAge} سنة
                  </span>
                  <span className="text-xs text-[#60788C] font-mono">
                    ⏱️ {act.duration} دقائق
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#17324D] font-arabic">
                  {act.titleAr}
                </h3>
                <p className="text-xs text-[#60788C] mt-2 leading-relaxed">
                  {act.descriptionAr}
                </p>

                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#E2EEF8] text-[11px] text-[#60788C]">
                  <span className="px-2.5 py-1 rounded-lg bg-[#F4F9FD] border border-[#E2EEF8]">
                    {act.requiresPhone ? "📱 بالهواتف" : "🏃 حركي بدون هاتف"}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#F4F9FD] border border-[#E2EEF8]">
                    👥 {act.minPlayers}–{act.maxPlayers} لاعبين
                  </span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-[#E2EEF8] flex items-center gap-2">
                <Link
                  href={`/host/${Math.floor(100000 + Math.random() * 900000)}?act=${act.slug}`}
                  className="flex-1 bg-[#2F8FD8] hover:bg-[#1F7EC7] transition-colors text-white font-bold text-xs py-2.5 rounded-xl text-center shadow-xs"
                >
                  العب مع الأطفال الآن
                </Link>
                <Link
                  href={`/activity/${act.slug}`}
                  className="px-4 py-2.5 rounded-xl border border-[#BAE6FD] bg-white hover:bg-[#F4F9FD] text-[#2F8FD8] text-xs font-bold transition-colors"
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
