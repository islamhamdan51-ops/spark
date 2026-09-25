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
  const [wizardOpen, setWizardOpen] = useState(false);
  const [randomModalOpen, setRandomModalOpen] = useState(false);

  const categories = [
    { id: "all", label: "الكل" },
    { id: "adults", label: "كبار وشباب" },
    { id: "kids", label: "أطفال" },
    { id: "faith", label: "قيم وإيمان" },
    { id: "no_phone", label: "بدون أجهزة" },
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
      }

      return true;
    });
  }, [searchQuery, activeCategory]);

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
              الأنشطة
            </h1>
            <p className="text-sm text-[#60788C] mt-1 font-medium">
              اختر نشاطًا يناسب مجموعتك.
            </p>
          </div>

          <button
            onClick={() => setRandomModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-white border border-[#C9ECFF] text-[#2F8FD8] hover:bg-[#EAF7FF] text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-2xs transition-colors"
          >
            <Dices className="w-4 h-4 text-[#2F8FD8]" />
            <span>🎲 أنقذني</span>
          </button>
        </div>

        {/* Search and Category Tabs */}
        <div className="my-6 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#60788C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث عن نشاط..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-xl bg-white border border-[#E2EEF8] text-[#17324D] placeholder-[#60788C] text-sm focus:outline-none focus:border-[#2F8FD8] shadow-2xs font-arabic"
            />
          </div>

          {/* Simple compact category pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
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
