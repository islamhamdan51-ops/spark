"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, Play, Dices, ArrowLeft, Users, Clock, Flame, 
  Smile, Trophy, MessageSquare, Zap, Palette, Award, ShieldCheck, Heart,
  Smartphone, Monitor, BookOpen, Compass, CheckCircle2
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

  // The 10 golden intents
  const INTENTS = [
    { id: "icebreaker", label: "تعارف", icon: "🤝" },
    { id: "laughter", label: "ضحك", icon: "😂" },
    { id: "energizer", label: "طاقة", icon: "⚡" },
    { id: "thinking", label: "تفكير", icon: "🧠" },
    { id: "competition", label: "منافسة", icon: "🏆" },
    { id: "creativity", label: "إبداع", icon: "🎨" },
    { id: "discussion", label: "نقاش", icon: "💬" },
    { id: "movement", label: "حركة", icon: "🏃" },
    { id: "knowledge", label: "معرفة", icon: "📖" },
    { id: "faith", label: "إيمان وقيم", icon: "🌙" },
  ];

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
    <div className="flex-1 flex flex-col bg-[#F4F9FD] text-[#17324D] font-arabic selection:bg-[#C9ECFF]">
      <Navbar
        onOpenWizard={() => setWizardOpen(true)}
        onOpenRandomSpark={() => setRandomModalOpen(true)}
      />

      <main className="flex-1">
        {/* 01 — HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-white border-b border-[#E2EEF8]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            {/* Small Brand Label */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF7FF] border border-[#C9ECFF] text-[#2F8FD8] text-xs font-bold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SPARK / شرارة</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#17324D] leading-[1.2] tracking-tight">
              ما تعرفش شنو تدير مع المجموعة؟
            </h1>

            {/* Supporting Line */}
            <p className="text-base sm:text-lg text-[#60788C] max-w-xl mx-auto mt-4 leading-relaxed font-medium">
              شرارة تختار لك النشاط المناسب وتبدأه مع المجموعة خلال دقائق.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-8">
              <button
                onClick={() => setWizardOpen(true)}
                className="bg-[#2F8FD8] hover:bg-[#1F7EC7] active:scale-98 transition-all px-8 py-3.5 rounded-xl text-white font-bold text-base shadow-xs"
              >
                ابدأ الآن
              </button>

              <Link
                href="/demo"
                className="px-7 py-3.5 rounded-xl border border-[#2F8FD8] bg-white hover:bg-[#F0F8FF] text-[#2F8FD8] font-bold text-base transition-all"
              >
                جرّب Demo
              </Link>
            </div>

            {/* Clean Simulated Activity Card Preview */}
            <div className="mt-14 max-w-md mx-auto bg-white rounded-2xl border border-[#E2EEF8] p-6 shadow-xs text-right space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#60788C] pb-3 border-b border-[#E2EEF8]">
                <span>نشاط تجريبي: لو خيّروك</span>
                <span className="text-[#2F8FD8] font-mono bg-[#EAF7FF] px-2 py-0.5 rounded-md">30 ثانية</span>
              </div>
              <h3 className="text-lg font-bold text-[#17324D]">
                شن تختار لو أتيحت لك فرصة واحدة؟
              </h3>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-[#F4F9FD] border border-[#C9ECFF] text-center font-bold text-sm text-[#2F8FD8] cursor-pointer hover:bg-[#EAF7FF] transition-colors">
                  المغامرة والسفر 🌍
                </div>
                <div className="p-3.5 rounded-xl bg-[#F4F9FD] border border-[#E2EEF8] text-center font-bold text-sm text-[#17324D] cursor-pointer hover:bg-[#EAF7FF] transition-colors">
                  الراحة والهدوء ☕
                </div>
              </div>
              <div className="text-center pt-1">
                <span className="text-[11px] text-[#60788C]">
                  بدون تثبيت تطبيقات • يعمل عبر أي متصفح بالهاتف أو الشاشة
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* 02 — INTENT SECTION: "شن تحتاج من المجموعة؟" */}
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#17324D]">
              شن تحتاج من المجموعة؟
            </h2>
            <p className="text-sm text-[#60788C] mt-1 font-medium">
              اختر الهدف، وستظهر لك الأنشطة المصممة له بدقة:
            </p>
          </div>

          {/* Clean 10 Intent Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {INTENTS.map((intent) => {
              const isActive = selectedIntent === intent.id;
              return (
                <button
                  key={intent.id}
                  onClick={() => setSelectedIntent(isActive ? null : intent.id)}
                  className={`p-4 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-2 border ${
                    isActive
                      ? "bg-[#2F8FD8] text-white border-[#2F8FD8] shadow-xs"
                      : "bg-white border-[#E2EEF8] text-[#17324D] hover:border-[#A9DFFF] hover:bg-[#F4F9FD]"
                  }`}
                >
                  <span className="text-2xl">{intent.icon}</span>
                  <span className="text-sm font-bold">{intent.label}</span>
                </button>
              );
            })}
          </div>

          {/* Displayed Activities */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#17324D]">
                {selectedIntent ? "الأنشطة الموصى بها:" : "الأنشطة الشائعة:"}
              </h3>

              <Link
                href="/activities"
                className="text-xs font-bold text-[#2F8FD8] hover:underline flex items-center gap-1"
              >
                <span>المكتبة الكاملة ({ACTIVITIES.length})</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white rounded-2xl p-5 border border-[#E2EEF8] shadow-xs hover:border-[#A9DFFF] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#60788C] mb-2 font-medium">
                      <span className="bg-[#EAF7FF] text-[#2F8FD8] px-2 py-0.5 rounded-md font-bold">
                        {act.duration} دقائق
                      </span>
                      <span>👥 {act.minPlayers}–{act.maxPlayers}</span>
                    </div>

                    <h4 className="text-base font-bold text-[#17324D] mb-1.5">
                      {act.titleAr}
                    </h4>
                    <p className="text-xs text-[#60788C] line-clamp-2 leading-relaxed">
                      {act.descriptionAr}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E2EEF8] flex items-center gap-2">
                    <Link
                      href={`/host/${Math.floor(100000 + Math.random() * 900000)}?act=${act.slug}`}
                      className="flex-1 bg-[#2F8FD8] hover:bg-[#1F7EC7] text-white font-bold text-xs py-2 rounded-lg text-center transition-colors shadow-2xs"
                    >
                      ابدأ النشاط
                    </Link>
                    <Link
                      href={`/activity/${act.slug}`}
                      className="px-3 py-2 rounded-lg border border-[#E2EEF8] hover:bg-[#F4F9FD] text-[#60788C] text-xs font-medium transition-colors"
                    >
                      معاينة
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 03 — RESCUE EXPERIENCE: "أنقذني" */}
        <section className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-[#C9ECFF] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1 text-center sm:text-right">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xl">🎲</span>
                <h3 className="text-lg font-bold text-[#17324D]">محتار وما عندكش وقت للتفكير؟</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#60788C]">
                اضغط على زر &quot;أنقذني&quot; وسنختار لك نشاطاً فورياً يناسب مجموعتك وطاقتكم الآن.
              </p>
            </div>

            <button
              onClick={() => setRandomModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-[#EAF7FF] hover:bg-[#DDF2FF] border border-[#A9DFFF] text-[#2F8FD8] text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap shadow-2xs"
            >
              <Dices className="w-4 h-4 text-[#2F8FD8]" />
              <span>🎲 أنقذني</span>
            </button>
          </div>
        </section>

        {/* 04 — CATEGORIES: ADULTS & KIDS & FAITH */}
        <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Adults */}
            <Link
              href="/activities?audience=adults"
              className="bg-white rounded-2xl p-6 border border-[#E2EEF8] hover:border-[#A9DFFF] transition-all group shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EAF7FF] text-[#2F8FD8] flex items-center justify-center text-lg mb-3">
                👥
              </div>
              <h4 className="text-base font-bold text-[#17324D] group-hover:text-[#2F8FD8] transition-colors">
                الكبار والشباب
              </h4>
              <p className="text-xs text-[#60788C] mt-1 leading-relaxed">
                أنشطة كسر جمود، حوارات، تحديات سرعة وتفكير عميق للقاءات وورش العمل.
              </p>
            </Link>

            {/* Kids */}
            <Link
              href="/kids"
              className="bg-white rounded-2xl p-6 border border-[#E2EEF8] hover:border-[#A9DFFF] transition-all group shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EAF7FF] text-[#2F8FD8] flex items-center justify-center text-lg mb-3">
                🎈
              </div>
              <h4 className="text-base font-bold text-[#17324D] group-hover:text-[#2F8FD8] transition-colors">
                قسم الأطفال الآمن
              </h4>
              <p className="text-xs text-[#60788C] mt-1 leading-relaxed">
                أنشطة حركية وقيمية مسلية مصممة خصيصاً للصغار، بدون إعلانات أو مشتتات.
              </p>
            </Link>

            {/* Faith & Values */}
            <Link
              href="/activities?category=ISLAMIC"
              className="bg-white rounded-2xl p-6 border border-[#E2EEF8] hover:border-[#A9DFFF] transition-all group shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EAF7FF] text-[#2F8FD8] flex items-center justify-center text-lg mb-3">
                🌙
              </div>
              <h4 className="text-base font-bold text-[#17324D] group-hover:text-[#2F8FD8] transition-colors">
                إيمان وقيم ولغة عربية
              </h4>
              <p className="text-xs text-[#60788C] mt-1 leading-relaxed">
                آيات موثوقة، سيرة نبوية، ومفردات لغوية تثري الجلسات الأسرية والتربوية.
              </p>
            </Link>

          </div>
        </section>

        {/* 05 — HOW IT WORKS: 3 SIMPLE STEPS */}
        <section id="how-it-works" className="py-16 bg-white border-t border-[#E2EEF8]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-[#17324D]">
              كيف تعمل شرارة؟
            </h2>
            <p className="text-sm text-[#60788C] mt-1 font-medium">
              3 خطوات بسيطة لبدء أي جلسة تفاعلية:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-center">
              <div className="p-6 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8] space-y-2">
                <div className="w-9 h-9 rounded-full bg-[#2F8FD8] text-white font-bold text-sm flex items-center justify-center mx-auto">
                  1
                </div>
                <h4 className="text-base font-bold text-[#17324D]">اختر النشاط</h4>
                <p className="text-xs text-[#60788C] leading-relaxed">
                  تصفح المكتبة أو دع المعالج الذكي يختار ما يلائم عددكم وطاقتكم.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8] space-y-2">
                <div className="w-9 h-9 rounded-full bg-[#2F8FD8] text-white font-bold text-sm flex items-center justify-center mx-auto">
                  2
                </div>
                <h4 className="text-base font-bold text-[#17324D]">شارك الرمز أو الشاشة</h4>
                <p className="text-xs text-[#60788C] leading-relaxed">
                  افتح الغرفة للمجموعة ليدخلوا فوراً عبر مسح الرمز QR بدون حسابات.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8] space-y-2">
                <div className="w-9 h-9 rounded-full bg-[#2F8FD8] text-white font-bold text-sm flex items-center justify-center mx-auto">
                  3
                </div>
                <h4 className="text-base font-bold text-[#17324D]">تفاعلوا وعيشوا اللحظة</h4>
                <p className="text-xs text-[#60788C] leading-relaxed">
                  صوتوا، جاوبوا، وتابعوا النتائج الحية على الشاشة الرئيسية مباشرة.
                </p>
              </div>
            </div>

            <div className="mt-10">
              <button
                onClick={() => setWizardOpen(true)}
                className="bg-[#2F8FD8] hover:bg-[#1F7EC7] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-xs transition-all"
              >
                ابدأ جلستك الآن
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#E2EEF8] bg-white py-8 text-center text-xs text-[#60788C]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#17324D]">SPARK / شرارة</span>
            <span>•</span>
            <span>منصة الأنشطة والتفاعل الجماعي</span>
          </div>
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()}
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
