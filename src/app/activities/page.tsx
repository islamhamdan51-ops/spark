"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, Filter, Sparkles, Play, Dices, ArrowLeft, 
  Smartphone, Monitor, Activity as ActivityIcon, Users, Clock, RotateCcw,
  BookOpen, Globe, HeartHandshake, Eye
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ActivityWizardModal } from "@/components/wizard/ActivityWizardModal";
import { RandomSparkModal } from "@/components/wizard/RandomSparkModal";
import { ACTIVITIES } from "@/data/activities";
import { Activity, AudienceType, EnergyLevel } from "@/types";

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAudience, setSelectedAudience] = useState<string>("all");
  const [selectedEnergy, setSelectedEnergy] = useState<string>("all");
  const [phoneFilter, setPhoneFilter] = useState<string>("all");
  const [specialFilter, setSpecialFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [randomModalOpen, setRandomModalOpen] = useState(false);

  const filteredActivities = useMemo(() => {
    let result = ACTIVITIES.filter((act) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = act.titleAr.toLowerCase().includes(q);
        const matchDesc = act.descriptionAr.toLowerCase().includes(q);
        const matchEn = act.titleEn?.toLowerCase().includes(q);
        const matchTag = act.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchEn && !matchTag) return false;
      }

      // Audience
      if (selectedAudience !== "all") {
        if (selectedAudience === "kids" && act.audience !== "kids") return false;
        if (selectedAudience === "adults" && act.audience === "kids") return false;
      }

      // Energy
      if (selectedEnergy !== "all" && act.energy !== selectedEnergy) return false;

      // Phone requirement
      if (phoneFilter === "phone_needed" && !act.requiresPhone) return false;
      if (phoneFilter === "no_phone" && act.requiresPhone) return false;

      // Special content filters
      if (specialFilter === "faith" && !act.faithContent && act.category !== "ISLAMIC") return false;
      if (specialFilter === "arabic" && !act.languageContent && !act.tags?.includes("arabic")) return false;
      if (specialFilter === "playable" && !act.isPlayable) return false;

      return true;
    });

    // Sorting
    if (sortBy === "quickest") {
      result = [...result].sort((a, b) => a.duration - b.duration);
    } else if (sortBy === "players") {
      result = [...result].sort((a, b) => b.maxPlayers - a.maxPlayers);
    }

    return result;
  }, [searchQuery, selectedAudience, selectedEnergy, phoneFilter, specialFilter, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedAudience("all");
    setSelectedEnergy("all");
    setPhoneFilter("all");
    setSpecialFilter("all");
    setSortBy("recommended");
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA] text-slate-900 font-arabic">
      <Navbar
        onOpenWizard={() => setWizardOpen(true)}
        onOpenRandomSpark={() => setRandomModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-spark-flame text-xs font-bold mb-2">
              <span>📚</span>
              <span>المكتبة المعتمدة ({ACTIVITIES.length} نشاط)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-arabic">
              استكشف مكتبة شرارة
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              أنشطة مصممة بعناية لمختلف الجلسات والورش، مع دعم كامل للعب الرقمي والتيسير الحركي.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setRandomModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-2xs"
            >
              <Dices className="w-4 h-4 text-spark-flame" />
              <span>🎲 أنقذني</span>
            </button>
            <button
              onClick={() => setWizardOpen(true)}
              className="bg-spark-flame hover:bg-spark-flame/90 active:scale-98 transition-all px-5 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>المعالج الذكي</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="my-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو الوصف (مثال: هذا أو ذاك، سيرة، إيموجي، حركة)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-spark-flame shadow-2xs font-arabic"
              />
            </div>

            {/* Audience Dropdown */}
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-bold focus:outline-none focus:border-spark-flame shadow-2xs"
            >
              <option value="all">كل الفئات (كبار وأطفال)</option>
              <option value="adults">كبار وشباب فقط</option>
              <option value="kids">أطفال فقط</option>
            </select>

            {/* Energy Dropdown */}
            <select
              value={selectedEnergy}
              onChange={(e) => setSelectedEnergy(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-bold focus:outline-none focus:border-spark-flame shadow-2xs"
            >
              <option value="all">مستوى الطاقة (الكل)</option>
              <option value="calm">🧊 هادئ</option>
              <option value="medium">🌤 متوسط</option>
              <option value="high">🔥 عالي الحماس</option>
            </select>

            {/* Phone Filter Dropdown */}
            <select
              value={phoneFilter}
              onChange={(e) => setPhoneFilter(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-bold focus:outline-none focus:border-spark-flame shadow-2xs"
            >
              <option value="all">طبيعة الأجهزة (الكل)</option>
              <option value="phone_needed">📱 يحتاج هواتف</option>
              <option value="no_phone">🏃 بدون هواتف (حركي/ميسر)</option>
            </select>
          </div>

          {/* Quick Filter Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold ml-1">تصفية سريعة:</span>
              <button
                onClick={() => setSpecialFilter(specialFilter === "faith" ? "all" : "faith")}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  specialFilter === "faith"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                    : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300"
                }`}
              >
                🌙 محتوى إسلامي وقيمي
              </button>

              <button
                onClick={() => setSpecialFilter(specialFilter === "arabic" ? "all" : "arabic")}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  specialFilter === "arabic"
                    ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                    : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"
                }`}
              >
                🗣️ لغة عربية وفصاحة
              </button>

              <button
                onClick={() => setSpecialFilter(specialFilter === "playable" ? "all" : "playable")}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  specialFilter === "playable"
                    ? "bg-spark-flame text-white border-spark-flame shadow-2xs"
                    : "bg-white border-slate-200 text-slate-700 hover:border-orange-300"
                }`}
              >
                ⚡ جاهز للعب المباشر فوراً
              </button>

              {(searchQuery || selectedAudience !== "all" || selectedEnergy !== "all" || phoneFilter !== "all" || specialFilter !== "all") && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 text-xs font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>تفريغ الفلاتر</span>
                </button>
              )}
            </div>

            <div className="text-xs text-slate-500 font-bold">
              عرض <span className="text-spark-flame font-mono">{filteredActivities.length}</span> من أصل <span className="font-mono">{ACTIVITIES.length}</span> نشاط
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="my-16 p-12 bg-white rounded-3xl border border-slate-200 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 text-spark-flame flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-arabic">
              ما لقيناش نشاط يطابق اختياراتك.
            </h3>
            <p className="text-xs text-slate-500">
              جرّب تغيير كلمات البحث أو تخفيف الفلاتر للعثور على ما يناسب مجموعتك.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                خفف الفلاتر
              </button>
              <button
                onClick={() => setRandomModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-spark-flame text-white text-xs font-bold shadow-2xs"
              >
                🎲 أنقذني
              </button>
            </div>
          </div>
        )}

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Header Chips */}
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-spark-flame font-bold">
                    ⏱️ {act.duration} دقائق
                  </span>
                  <span className="text-slate-500 font-bold">
                    👥 {act.minPlayers}–{act.maxPlayers} لاعب
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 font-arabic mb-2">
                  {act.titleAr}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {act.descriptionAr}
                </p>

                {/* Metadata Badges */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-600">
                  {act.requiresPhone ? (
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-spark-flame" />
                      <span>📱 هاتف</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                      ✅ بدون أجهزة
                    </span>
                  )}

                  {act.requiresScreen && (
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
                      📺 شاشة
                    </span>
                  )}

                  {act.requiresMovement && (
                    <span className="px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                      🏃 حركة
                    </span>
                  )}

                  {act.faithContent && (
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                      🌙 إسلامي
                    </span>
                  )}

                  {act.languageContent && (
                    <span className="px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
                      🗣️ لغة عربية
                    </span>
                  )}

                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
                    {act.audience === "kids" ? "🐣 أطفال" : act.audience === "mixed" ? "👥 مختلط" : "🧑 كبار"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2">
                <Link
                  href={`/host/${Math.floor(100000 + Math.random() * 900000)}?act=${act.slug}`}
                  className="flex-1 bg-spark-flame hover:bg-spark-flame/90 active:scale-98 transition-all text-white font-bold text-xs py-2.5 rounded-xl text-center shadow-2xs"
                >
                  ابدأ النشاط
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
