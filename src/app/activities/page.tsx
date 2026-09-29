"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, Dices, ArrowLeft, Clock, Users, Zap, CheckCircle2, RotateCcw
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ActivityWizardModal } from "@/components/wizard/ActivityWizardModal";
import { RandomSparkModal } from "@/components/wizard/RandomSparkModal";
import { ACTIVITIES } from "@/data/activities";
import { Activity } from "@/types";

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeMoment, setActiveMoment] = useState<string>("all");
  const [activeDuration, setActiveDuration] = useState<string>("all");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [randomModalOpen, setRandomModalOpen] = useState(false);

  const categories = [
    { id: "all", label: "الكل" },
    { id: "adults", label: "كبار وشباب" },
    { id: "kids", label: "أطفال" },
    { id: "faith", label: "قيم وإيمان" },
    { id: "no_phone", label: "✅ بدون هواتف" },
    { id: "no_screen", label: "🏕️ بدون شاشة" },
  ];

  const moments = [
    { id: "all", label: "كل اللحظات" },
    { id: "start", label: "بداية الجلسة" },
    { id: "energy", label: "رفع الطاقة" },
    { id: "break", label: "بعد الاستراحة" },
    { id: "discussion", label: "قبل/أثناء النقاش" },
    { id: "closing", label: "ختام الجلسة" },
  ];

  const durations = [
    { id: "all", label: "كل الأوقات" },
    { id: "2", label: "2–3 دقائق" },
    { id: "5", label: "5 دقائق" },
    { id: "10", label: "10 دقائق" },
    { id: "20", label: "20+ دقيقة" },
  ];

  const filteredActivities = useMemo(() => {
    return ACTIVITIES.filter((act) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = act.titleAr.toLowerCase().includes(q);
        const matchDesc = act.descriptionAr.toLowerCase().includes(q);
        const matchTag = act.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTag) return false;
      }

      // Category
      if (activeCategory === "adults") {
        if (act.audience === "kids") return false;
      } else if (activeCategory === "kids") {
        if (act.audience !== "kids") return false;
      } else if (activeCategory === "faith") {
        if (!act.faithContent && act.category !== "ISLAMIC") return false;
      } else if (activeCategory === "no_phone") {
        if (act.requiresPhone) return false;
      } else if (activeCategory === "no_screen") {
        if (act.requiresScreen) return false;
      }

      // Moment in Session
      if (activeMoment === "start") {
        if (act.category !== "ICEBREAKER" && act.goal !== "icebreaker" && act.goal !== "silence_breaker") return false;
      } else if (activeMoment === "energy") {
        if (act.category !== "ENERGY" && act.energy !== "high" && !act.requiresMovement) return false;
      } else if (activeMoment === "break") {
        if (act.slug !== "sixty-sec-challenge" && act.slug !== "rapid-fire" && !act.requiresMovement) return false;
      } else if (activeMoment === "discussion") {
        if (act.category !== "DISCUSSION" && act.type !== "DISCUSSION_STARTER" && act.goal !== "discussion") return false;
      } else if (activeMoment === "closing") {
        if (act.category !== "REFLECTION" && !act.slug.startsWith("closing-") && act.goal !== "reflection") return false;
      }

      // Duration
      if (activeDuration === "2") {
        if (act.duration > 3) return false;
      } else if (activeDuration === "5") {
        if (act.duration < 4 || act.duration > 7) return false;
      } else if (activeDuration === "10") {
        if (act.duration < 8 || act.duration > 15) return false;
      } else if (activeDuration === "20") {
        if (act.duration < 16) return false;
      }

      return true;
    });
  }, [searchQuery, activeCategory, activeMoment, activeDuration]);

  return (
    <div className="flex-1 flex flex-col bg-[#F4F9FD] text-[#17324D] font-arabic">
      <Navbar
        onOpenWizard={() => setWizardOpen(true)}
        onOpenRandomSpark={() => setRandomModalOpen(true)}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* 16 — Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E2EEF8]">
          <div>
            <h1 className="text-3xl font-black text-[#17324D]">
              مكتبة الأنشطة الميسرة
            </h1>
            <p className="text-sm text-[#60788C] mt-1 font-medium">
              اختر نشاطًا بحسب وقتك المتاح، لحظة الجلسة، أو إمكانيات القاعة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/sessions"
              className="px-4 py-2 rounded-xl bg-[#2F8FD8] hover:bg-[#1F7EC7] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <span>🛠️ صمم جلسة كاملة</span>
            </Link>

            <button
              onClick={() => setRandomModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-white border border-[#C9ECFF] text-[#2F8FD8] hover:bg-[#EAF7FF] text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-2xs transition-colors"
            >
              <Dices className="w-4 h-4 text-[#2F8FD8]" />
              <span>🎲 أنقذني</span>
            </button>
          </div>
        </div>

        {/* Search and Category Tabs */}
        <div className="my-6 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#60788C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو الهدف (مثال: بدون هاتف، تعارف، 5 دقائق، أطفال)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-xl bg-white border border-[#E2EEF8] text-[#17324D] placeholder-[#60788C] text-sm focus:outline-none focus:border-[#2F8FD8] shadow-2xs font-arabic"
            />
          </div>

          {/* Simple compact category pills */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#60788C] font-bold ml-1">الفئة:</span>
              {categories.map((cat) => {
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? "bg-[#2F8FD8] text-white shadow-xs"
                        : "bg-white border border-[#E2EEF8] text-[#60788C] hover:text-[#17324D] hover:bg-[#F4F9FD]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Moment in session filter (Requirement 27) */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E2EEF8]">
              <span className="text-xs text-[#60788C] font-bold ml-1">حسب اللحظة:</span>
              {moments.map((mom) => {
                const active = activeMoment === mom.id;
                return (
                  <button
                    key={mom.id}
                    onClick={() => setActiveMoment(mom.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      active
                        ? "bg-[#17324D] text-white"
                        : "bg-white border border-[#E2EEF8] text-[#60788C] hover:text-[#17324D]"
                    }`}
                  >
                    {mom.label}
                  </button>
                );
              })}
            </div>

            {/* Duration filter (Requirement 27) */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-[#60788C] font-bold ml-1">حسب الوقت:</span>
              {durations.map((dur) => {
                const active = activeDuration === dur.id;
                return (
                  <button
                    key={dur.id}
                    onClick={() => setActiveDuration(dur.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      active
                        ? "bg-[#2F8FD8] text-white"
                        : "bg-white border border-[#E2EEF8] text-[#60788C] hover:text-[#17324D]"
                    }`}
                  >
                    {dur.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Empty state */}
        {filteredActivities.length === 0 && (
          <div className="my-16 p-10 bg-white rounded-2xl border border-[#E2EEF8] text-center max-w-sm mx-auto space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-[#17324D]">
              لم نجد نشاطًا يطابق بحثك.
            </h3>
            <p className="text-xs text-[#60788C]">
              جرّب تغيير كلمات البحث أو اختر فئة أخرى.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="px-4 py-2 rounded-xl bg-[#F4F9FD] border border-[#E2EEF8] text-[#2F8FD8] text-xs font-bold hover:bg-[#EAF7FF]"
            >
              عرض كل الأنشطة
            </button>
          </div>
        )}

        {/* 17 — Unified Activity Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredActivities.map((act) => {
            const energyLabel = act.energy === "high" ? "طاقة عالية" : act.energy === "medium" ? "طاقة متوسطة" : "طاقة هادئة";

            return (
              <div
                key={act.id}
                className="bg-white rounded-2xl p-5 border border-[#E2EEF8] shadow-xs hover:border-[#A9DFFF] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#60788C] mb-2 font-medium">
                    <span className="bg-[#EAF7FF] text-[#2F8FD8] px-2 py-0.5 rounded-md font-bold">
                      {act.duration} دقائق
                    </span>
                    <span>{act.minPlayers}–{act.maxPlayers} مشارك</span>
                  </div>

                  <h3 className="text-base font-bold text-[#17324D] mb-1.5">
                    {act.titleAr}
                  </h3>
                  <p className="text-xs text-[#60788C] line-clamp-2 leading-relaxed mb-4">
                    {act.descriptionAr}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] font-medium text-[#60788C] pt-3 border-t border-[#E2EEF8]">
                    <span>⚡ {energyLabel}</span>
                    <span>•</span>
                    <span>{act.requiresPhone ? "📱 بالهواتف" : "🏃 بدون أجهزة"}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E2EEF8] flex items-center gap-2">
                  <Link
                    href={`/host/${Math.floor(100000 + Math.random() * 900000)}?act=${act.slug}`}
                    className="flex-1 bg-[#2F8FD8] hover:bg-[#1F7EC7] active:scale-98 text-white font-bold text-xs py-2 rounded-lg text-center transition-colors shadow-2xs"
                  >
                    ابدأ
                  </Link>
                  <Link
                    href={`/activity/${act.slug}`}
                    className="px-3.5 py-2 rounded-lg border border-[#E2EEF8] hover:bg-[#F4F9FD] text-[#60788C] text-xs font-medium transition-colors"
                  >
                    تفاصيل
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <ActivityWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />

      <RandomSparkModal
        isOpen={randomModalOpen}
        onClose={() => setRandomModalOpen(false)}
      />
    </div>
  );
}
