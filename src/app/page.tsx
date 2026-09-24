"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Play, Dices, ArrowLeft, Users, Clock, Flame, 
  Smile, Trophy, MessageSquare, Zap, Palette, Award, ShieldCheck, Heart,
  Smartphone, Monitor, BookOpen, Compass
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ActivityWizardModal } from "@/components/wizard/ActivityWizardModal";
import { RandomSparkModal } from "@/components/wizard/RandomSparkModal";
import { ACTIVITIES } from "@/data/activities";
import { Activity } from "@/types";

export default function HomePage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [randomModalOpen, setRandomModalOpen] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);

  // The 10 golden intents specified in Master V2.0 prompt
  const INTENTS = [
    { id: "icebreaker", label: "تعارف", icon: "🤝", desc: "اكسر الحواجز الأولى واجعل الجميع يتعارفون بسلاسة" },
    { id: "laughter", label: "ضحك", icon: "😂", desc: "أشعل الابتسامات ومواقف فكاهية غير متوقعة" },
    { id: "energizer", label: "رفع الطاقة", icon: "🔥", desc: "تنشيط سريع وضخ الحيوية في القاعة" },
    { id: "thinking", label: "تفكير", icon: "🧠", desc: "ألغاز وأسئلة ذكاء وسرعة بديهة جماعية" },
    { id: "competition", label: "منافسة", icon: "🏆", desc: "تحدي نقاط حماسي بين الفرق والمشاركين" },
    { id: "creativity", label: "إبداع", icon: "🎨", desc: "تفكير خارج الصندوق وحلول مبتكرة وممتعة" },
    { id: "discussion", label: "نقاش", icon: "💬", desc: "حوارات ثرية وأسئلة تفتح آفاق الحديث" },
    { id: "movement", label: "حركة", icon: "🏃", desc: "نشاط حركي وتفاعل بالقاعة بدون هواتف" },
    { id: "knowledge", label: "معرفة", icon: "📖", desc: "معلومات عامة، تاريخ، لغة عربية، وثقافة" },
    { id: "faith", label: "إيمان وقيم", icon: "🌙", desc: "آيات قرآنية موثوقة، سيرة نبوية، وقيم أخلاقية" },
  ];

  // Activities filtered by intent or default flagships
  const displayedActivities = selectedIntent
    ? ACTIVITIES.filter((a) => {
        if (selectedIntent === "faith") return a.faithContent || a.category === "ISLAMIC" || a.goal === "faith";
        if (selectedIntent === "knowledge") return a.educationContent || a.languageContent || a.category === "ARABIC" || a.category === "GENERAL_KNOWLEDGE";
        if (selectedIntent === "movement") return a.requiresMovement || !a.requiresPhone;
        if (selectedIntent === "thinking") return a.category === "TRIVIA" || a.tags?.includes("thinking") || a.tags?.includes("quiz");
        return a.goal === selectedIntent || a.category?.toLowerCase().includes(selectedIntent);
      }).slice(0, 6)
    : ACTIVITIES.filter((a) => a.isPlayable).slice(0, 6);

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA] text-slate-900 font-arabic">
      <Navbar
        onOpenWizard={() => setWizardOpen(true)}
        onOpenRandomSpark={() => setRandomModalOpen(true)}
      />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200/80 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            {/* Memorable Micro Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-spark-flame text-xs font-bold mb-6 shadow-2xs">
              <span>⚡</span>
              <span>عندك مجموعة؟ عندك شرارة</span>
            </div>

            {/* Core Question Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 font-arabic leading-[1.15] tracking-tight max-w-4xl mx-auto">
              ما تعرفش شنو تدير مع <span className="text-spark-flame">المجموعة؟</span>
            </h1>

            {/* Clear Subheading */}
            <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mt-5 leading-relaxed">
              شرارة تختار لك النشاط المناسب وتبدأه مع المجموعة خلال دقائق.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-8">
              <button
                onClick={() => setWizardOpen(true)}
                className="bg-spark-flame hover:bg-spark-flame/90 active:scale-98 transition-all px-8 py-4 rounded-2xl text-white font-bold text-base flex items-center gap-2.5 shadow-md shadow-orange-500/25"
              >
                <Sparkles className="w-5 h-5" />
                <span>ابدأ الآن</span>
              </button>

              <Link
                href="/demo"
                className="px-7 py-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-base flex items-center gap-2.5 transition-all shadow-xs"
              >
                <Play className="w-4 h-4 fill-slate-800" />
                <span>جرّب Demo حي</span>
              </Link>

              <button
                onClick={() => setRandomModalOpen(true)}
                className="px-6 py-4 rounded-2xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-spark-flame font-bold text-base flex items-center gap-2 transition-all shadow-xs"
              >
                <Dices className="w-5 h-5" />
                <span>🎲 أنقذني</span>
              </button>
            </div>

            {/* Trust Points */}
            <div className="pt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-bold">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600">✓</span>
                <span>بدون تسجيل حساب للمشاركين</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600">✓</span>
                <span>أنشطة بالهواتف وأنشطة بدون أجهزة</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600">✓</span>
                <span>قسم آمن مخصص للأطفال</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600">✓</span>
                <span>محتوى إسلامي ولغوي موثق</span>
              </div>
            </div>

          </div>
        </section>

        {/* INTENT DISCOVERY: "شن تحتاج من المجموعة؟" */}
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-arabic">
              شن تحتاج من المجموعة؟
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              اضغط على هدف جلستك الآن وسنظهر لك الأنشطة المصممة خصيصاً له:
            </p>
          </div>

          {/* 10 Intent Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {INTENTS.map((intent) => {
              const isActive = selectedIntent === intent.id;
              return (
                <button
                  key={intent.id}
                  onClick={() => setSelectedIntent(isActive ? null : intent.id)}
                  className={`p-4 rounded-2xl text-center transition-all flex flex-col items-center justify-center gap-2 border ${
                    isActive
                      ? "bg-spark-flame text-white border-spark-flame shadow-md scale-102"
                      : "bg-white border-slate-200 text-slate-800 hover:border-orange-300 hover:bg-orange-50/40 shadow-xs"
                  }`}
                >
                  <span className="text-2xl">{intent.icon}</span>
                  <span className="text-sm font-bold font-arabic">{intent.label}</span>
                </button>
              );
            })}
          </div>

          {/* Activity Cards for Selected Intent or Flagships */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 font-arabic flex items-center gap-2">
                <span>{selectedIntent ? "الأنشطة المقترحة لهذا الهدف:" : "أبرز الأنشطة الجاهزة للانطلاق فوراً:"}</span>
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono font-bold">
                  {displayedActivities.length}
                </span>
              </h3>

              <Link
                href="/activities"
                className="text-xs font-bold text-spark-flame hover:underline flex items-center gap-1"
              >
                <span>عرض المكتبة الكاملة ({ACTIVITIES.length})</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header Chips */}
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-spark-flame font-bold">
                        ⏱️ {act.duration} دقائق
                      </span>
                      <span className="text-slate-500 font-bold">
                        👥 {act.minPlayers}–{act.maxPlayers}
                      </span>
                    </div>

                    <h4 className="text-xl font-black text-slate-900 font-arabic mb-2">
                      {act.titleAr}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {act.descriptionAr}
                    </p>

                    {/* Metadata Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-600">
                      {act.requiresPhone ? (
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-spark-flame" />
                          <span>📱 هاتف</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1">
                          <span>✅ لا يحتاج أجهزة</span>
                        </span>
                      )}

                      {act.requiresScreen && (
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
                          📺 شاشة
                        </span>
                      )}

                      {act.faithContent && (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                          🌙 محتوى إسلامي
                        </span>
                      )}

                      {act.languageContent && (
                        <span className="px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
                          🗣️ لغة عربية
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2">
                    <Link
                      href={`/host/${Math.floor(100000 + Math.random() * 900000)}?act=${act.slug}`}
                      className="flex-1 bg-spark-flame hover:bg-spark-flame/90 text-white font-bold text-xs py-2.5 rounded-xl text-center transition-colors shadow-2xs"
                    >
                      ابدأ النشاط الآن
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
          </div>
        </section>

        {/* FACILITATION CALLOUT: FOR WORKSHOPS & ORGANIZATIONS */}
        <section className="py-12 bg-white border-t border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-arabic">
              منصة التيسير والتفاعل الجماعي للمدربين والمنظمات
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              سواء كنت تقود ورشة عمل، نشاطاً تطوعياً، حلقة تعليمية، أو تدريباً تفاعلياً؛ شرارة تمنحك أدوات جاهزة ومحتوى غنياً يضمن مشاركة الجميع بدون تحضير معقد.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/activities"
                className="px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors"
              >
                تصفح كل الأنشطة ({ACTIVITIES.length})
              </Link>
              <Link
                href="/kids"
                className="px-6 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-spark-flame text-xs font-bold transition-colors"
              >
                قسم الأطفال الآمن
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-[#F8F9FA] py-8 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-arabic text-sm">SPARK / شرارة</span>
            <span className="text-slate-400">|</span>
            <span>منصة الأنشطة والتفاعل الجماعي V2.0</span>
          </div>
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} — صُمم ليجمع الناس بكل طاقة ومعنى.
          </div>
        </div>
      </footer>

      {/* MODALS */}
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
