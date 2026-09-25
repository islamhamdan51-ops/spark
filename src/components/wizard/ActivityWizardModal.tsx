"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  X, Sparkles, ChevronRight, ChevronLeft, Users, Clock, Flame, 
  Smile, Trophy, MessageSquare, Zap, Palette, Award, Smartphone, 
  Monitor, CheckCircle2, ArrowRight, Dices, RotateCcw
} from "lucide-react";
import { Activity, GoalType, EnergyLevel, AudienceType, WizardAnswers, RecommendationResult } from "@/types";
import { calculateRecommendation } from "@/lib/recommendation";
import { sounds } from "@/lib/sound";

interface ActivityWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAudience?: AudienceType;
}

export function ActivityWizardModal({ isOpen, onClose, initialAudience }: ActivityWizardModalProps) {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<WizardAnswers>({
    playerCount: "11-20",
    audience: initialAudience || "adults",
    ageRange: "18+",
    durationMinutes: "5",
    energy: "high",
    goal: "icebreaker",
    hasPhones: "yes",
    hasScreen: "yes",
  });

  const [result, setResult] = useState<RecommendationResult | null>(null);

  if (!isOpen) return null;

  const totalSteps = 8;

  const handleNext = () => {
    sounds.playSelect();
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const rec = calculateRecommendation(answers);
      setResult(rec);
      sounds.playSuccess();
    }
  };

  const handlePrev = () => {
    sounds.playSelect();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    sounds.playSelect();
    setStep(1);
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-scale-in">
      <div className="relative w-full max-w-2xl bg-white border border-[#E2EEF8] rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden text-right font-arabic max-h-[90vh] flex flex-col">
        {/* Subtle Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#2F8FD8]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2EEF8]">
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="p-2 rounded-xl text-[#60788C] hover:text-[#17324D] hover:bg-[#F4F9FD] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center flex-1">
            <span className="text-xs font-bold text-[#2F8FD8] block">المكتشف الذكي</span>
            <h2 className="text-base sm:text-lg font-black text-[#17324D]">
              {result ? "لقينا لك الشرارة ✨" : `خطوة ${step} من ${totalSteps}`}
            </h2>
          </div>

          <div className="w-9" />
        </div>

        {/* Step Progress Bar */}
        {!result && (
          <div className="w-full bg-[#EAF7FF] h-1.5 rounded-full my-4 overflow-hidden">
            <div
              className="bg-[#2F8FD8] h-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        )}

        {/* CONTENT STAGE */}
        <div className="flex-1 overflow-y-auto py-2 pr-1">
          {!result && (
            <div className="space-y-6">
              
              {/* STEP 1: PLAYER COUNT */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-[#17324D]">
                    كم شخصاً في مجموعتك الآن؟
                  </h3>
                  <p className="text-xs sm:text-sm text-[#60788C]">
                    يساعدنا هذا في ضبط وتيرة النشاط ونوع التفاعل (فردي، ثنائي، أو قاعة كاملة).
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {[
                      { id: "2-5", label: "2 – 5 أشخاص", desc: "جلسة مصغرة حميمية" },
                      { id: "6-10", label: "6 – 10 أشخاص", desc: "فريق عمل أو طاولة نقاش" },
                      { id: "11-20", label: "11 – 20 شخصاً", desc: "ورشة تدريبية نموذجية" },
                      { id: "21-40", label: "21 – 40 شخصاً", desc: "فصل دراسي أو لقاء شبابي" },
                      { id: "40+", label: "40+ شخصاً", desc: "مؤتمر أو قاعة عامة ضخمة" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          sounds.playSelect();
                          setAnswers({ ...answers, playerCount: opt.id as any });
                        }}
                        className={`p-4 rounded-2xl border text-right transition-all ${
                          answers.playerCount === opt.id
                            ? "bg-[#EAF7FF] border-[#2F8FD8] shadow-xs ring-2 ring-[#2F8FD8]/20"
                            : "bg-white border-[#E2EEF8] hover:border-[#BAE6FD] hover:bg-[#F4F9FD]"
                        }`}
                      >
                        <span className="text-sm font-black text-[#17324D] block">{opt.label}</span>
                        <span className="text-[11px] text-[#60788C] mt-1 block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: AUDIENCE TYPE */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-[#17324D]">
                    من هم المشاركون في هذا النشاط؟
                  </h3>
                  <p className="text-xs sm:text-sm text-[#60788C]">
                    نخصص لهجة المحتوى ودرجة التحدي بناءً على طبيعة الحضور.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {[
                      { id: "adults", label: "كبار ومحترفون 💼", desc: "ورش عمل، منظمات، بيئة مهنية" },
                      { id: "teens", label: "شباب ويافعون ⚡", desc: "أندية، جامعات، متطوعون" },
                      { id: "kids", label: "أطفال وبراعم 🎈", desc: "مدارس، مراكز أطفال، بيئة مرحة آمنة" },
                      { id: "mixed", label: "عائلات ومجموعات مختلطة 👨‍👩‍👧‍👦", desc: "أجيال مختلفة تجتمع معاً" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          sounds.playSelect();
                          setAnswers({ ...answers, audience: opt.id as any });
                        }}
                        className={`p-4 rounded-2xl border text-right transition-all ${
                          answers.audience === opt.id
                            ? "bg-[#EAF7FF] border-[#2F8FD8] shadow-xs ring-2 ring-[#2F8FD8]/20"
                            : "bg-white border-[#E2EEF8] hover:border-[#BAE6FD] hover:bg-[#F4F9FD]"
                        }`}
                      >
                        <span className="text-sm font-black text-[#17324D] block">{opt.label}</span>
                        <span className="text-[11px] text-[#60788C] mt-1 block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: AGE RANGE */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-[#17324D]">
                    الفئة العمرية الأغلب في المجموعة:
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {[
                      { id: "4-6", label: "4 – 6 سنوات", desc: "حركي وبصري مبسط" },
                      { id: "7-9", label: "7 – 9 سنوات", desc: "اكتشاف وألغاز لطيفة" },
                      { id: "10-12", label: "10 – 12 سنة", desc: "تحديات وذكاء وفضول" },
                      { id: "13+", label: "13 – 17 سنة", desc: "يافعون وطاقة شبابية" },
                      { id: "18+", label: "18+ سنة", desc: "شباب وبالغون" },
                      { id: "mixed", label: "أعمار متنوعة", desc: "مرونة تناسب الجميع" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          sounds.playSelect();
                          setAnswers({ ...answers, ageRange: opt.id as any });
                        }}
                        className={`p-4 rounded-2xl border text-right transition-all ${
                          answers.ageRange === opt.id
                            ? "bg-[#EAF7FF] border-[#2F8FD8] shadow-xs ring-2 ring-[#2F8FD8]/20"
                            : "bg-white border-[#E2EEF8] hover:border-[#BAE6FD] hover:bg-[#F4F9FD]"
                        }`}
                      >
                        <span className="text-sm font-black text-[#17324D] block">{opt.label}</span>
                        <span className="text-[11px] text-[#60788C] mt-1 block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: TIME AVAILABLE */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-[#17324D]">
                    كم عندك وقت متاح لهذا النشاط؟
                  </h3>
                  <p className="text-xs sm:text-sm text-[#60788C]">
                    نضمن لك نشاطاً ينتهي بالضبط في الوقت المحدد دون استعجال أو ملل.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {[
                      { id: "2", label: "2 دقائق ⏱️", desc: "خاطف لكسر صمت مفاجئ" },
                      { id: "5", label: "5 دقائق ⚡", desc: "المعيار الذهبي لبدء الجلسات" },
                      { id: "10", label: "10 دقائق 🌟", desc: "تفاعل كامل ومشاركات متعددة" },
                      { id: "20", label: "20 دقيقة 🧩", desc: "بناء فريق وتعميق الروابط" },
                      { id: "30+", label: "30+ دقيقة 🏆", desc: "تحدي جماعي رئيسي ممتد" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          sounds.playSelect();
                          setAnswers({ ...answers, durationMinutes: opt.id as any });
                        }}
                        className={`p-4 rounded-2xl border text-right transition-all ${
                          answers.durationMinutes === opt.id
                            ? "bg-[#EAF7FF] border-[#2F8FD8] shadow-xs ring-2 ring-[#2F8FD8]/20"
                            : "bg-white border-[#E2EEF8] hover:border-[#BAE6FD] hover:bg-[#F4F9FD]"
                        }`}
                      >
                        <span className="text-sm font-black text-[#17324D] block">{opt.label}</span>
                        <span className="text-[11px] text-[#60788C] mt-1 block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: ENERGY LEVEL */}
              {step === 5 && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-[#17324D]">
                    ما مستوى الطاقة المطلوب للجلسة؟
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {[
                      { id: "calm", icon: "🧊", label: "هادئ ومريح", desc: "تأمل، تركيز، هدوء بعد غداء أو تعب" },
                      { id: "medium", icon: "🌤", label: "متوسط ومتوازن", desc: "تفاعل ذهني ونقاشي خفيف وممتع" },
                      { id: "high", icon: "⚡", label: "عالٍ ونشط", desc: "حركة، ضحك جماعي، وتنشيط حقيقي" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          sounds.playSelect();
                          setAnswers({ ...answers, energy: opt.id as any });
                        }}
                        className={`p-5 rounded-2xl border text-right transition-all ${
                          answers.energy === opt.id
                            ? "bg-[#EAF7FF] border-[#2F8FD8] shadow-xs ring-2 ring-[#2F8FD8]/20"
                            : "bg-white border-[#E2EEF8] hover:border-[#BAE6FD] hover:bg-[#F4F9FD]"
                        }`}
                      >
                        <span className="text-2xl block mb-1">{opt.icon}</span>
                        <span className="text-sm font-black text-[#17324D] block">{opt.label}</span>
                        <span className="text-[11px] text-[#60788C] mt-1 block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: MAIN GOAL */}
              {step === 6 && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-[#17324D]">
                    شن تحتاج من المجموعة؟
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    {[
                      { id: "icebreaker", icon: "🤝", label: "تعارف وألفة" },
                      { id: "laughter", icon: "😂", label: "ضحك ومرح" },
                      { id: "energizer", icon: "⚡", label: "طاقة وتنشيط" },
                      { id: "competition", icon: "🏆", label: "منافسة وتحدي" },
                      { id: "cooperation", icon: "🧩", label: "تعاون وفريق" },
                      { id: "discussion", icon: "💬", label: "نقاش وحوار" },
                      { id: "creativity", icon: "🎨", label: "إبداع وتفكير" },
                      { id: "faith", icon: "🌙", label: "إيمان وقيم" },
                      { id: "learning", icon: "📖", label: "معرفة وثقافة" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          sounds.playSelect();
                          setAnswers({ ...answers, goal: opt.id as any });
                        }}
                        className={`p-3.5 rounded-2xl border text-right transition-all flex items-center gap-2.5 ${
                          answers.goal === opt.id
                            ? "bg-[#EAF7FF] border-[#2F8FD8] shadow-xs ring-2 ring-[#2F8FD8]/20"
                            : "bg-white border-[#E2EEF8] hover:border-[#BAE6FD] hover:bg-[#F4F9FD]"
                        }`}
                      >
                        <span className="text-xl">{opt.icon}</span>
                        <span className="text-xs sm:text-sm font-bold text-[#17324D]">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: PHONES AVAILABLE */}
              {step === 7 && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-[#17324D]">
                    هل مع المشاركين هواتف متصلة بالإنترنت؟
                  </h3>
                  <p className="text-xs sm:text-sm text-[#60788C]">
                    شرارة تدعم الأنشطة الحركية والواقعية التي لا تحتاج أي هاتف على الإطلاق!
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {[
                      { id: "yes", icon: "📱", label: "نعم، مع الجميع", desc: "تفاعل مباشر عبر الشاشة والهاتف" },
                      { id: "no", icon: "🚫", label: "لا، بدون هواتف", desc: "أنشطة حركية وميسرة بالصوت والحركة" },
                      { id: "partial", icon: "👥", label: "مع بعضهم فقط", desc: "أنشطة فرق وتشارك مجموعات" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          sounds.playSelect();
                          setAnswers({ ...answers, hasPhones: opt.id as any });
                        }}
                        className={`p-4 rounded-2xl border text-right transition-all ${
                          answers.hasPhones === opt.id
                            ? "bg-[#EAF7FF] border-[#2F8FD8] shadow-xs ring-2 ring-[#2F8FD8]/20"
                            : "bg-white border-[#E2EEF8] hover:border-[#BAE6FD] hover:bg-[#F4F9FD]"
                        }`}
                      >
                        <span className="text-2xl block mb-1">{opt.icon}</span>
                        <span className="text-sm font-black text-[#17324D] block">{opt.label}</span>
                        <span className="text-[11px] text-[#60788C] mt-1 block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 8: SCREEN AVAILABLE */}
              {step === 8 && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-[#17324D]">
                    هل تتوفر شاشة عرض كبيرة أو بروجيكتور؟
                  </h3>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {[
                      { id: "yes", icon: "📺", label: "نعم، توجد شاشة", desc: "عرض المؤقت والنتائج أمام الجميع" },
                      { id: "no", icon: "🗣️", label: "لا توجد شاشة", desc: "يعتمد الميسر على هاتفه أو صوته فقط" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          sounds.playSelect();
                          setAnswers({ ...answers, hasScreen: opt.id as any });
                        }}
                        className={`p-4 rounded-2xl border text-right transition-all ${
                          answers.hasScreen === opt.id
                            ? "bg-[#EAF7FF] border-[#2F8FD8] shadow-xs ring-2 ring-[#2F8FD8]/20"
                            : "bg-white border-[#E2EEF8] hover:border-[#BAE6FD] hover:bg-[#F4F9FD]"
                        }`}
                      >
                        <span className="text-2xl block mb-1">{opt.icon}</span>
                        <span className="text-sm font-black text-[#17324D] block">{opt.label}</span>
                        <span className="text-[11px] text-[#60788C] mt-1 block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* RESULT VIEW: 1 FEATURED + 2 ALTERNATIVES */}
          {/* ==================================================== */}
          {result && (
            <div className="space-y-6">
              {/* Featured Activity Card */}
              <div className="p-6 rounded-3xl bg-white border-2 border-[#BAE6FD] shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EAF7FF] text-[#2F8FD8]">
                    ⭐ الخيار الأنسب لمجموعتك ({result.matchScore}% تطابق)
                  </span>
                  <span className="text-xs font-medium text-[#60788C]">⏱️ {result.topActivity.duration} دقائق</span>
                </div>

                <h3 className="text-2xl font-black text-[#17324D] font-arabic">
                  {result.topActivity.titleAr}
                </h3>
                <p className="text-xs sm:text-sm text-[#60788C] mt-1.5 leading-relaxed">
                  {result.topActivity.descriptionAr}
                </p>

                {/* "Why?" Section */}
                <div className="mt-4 p-3.5 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8] text-xs text-[#17324D] leading-relaxed">
                  <span className="font-bold text-[#2F8FD8] block mb-0.5">اخترناها لأن:</span>
                  <span className="text-[#60788C]">{result.reasonAr}</span>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/host/new?activity=${result.topActivity.slug}`}
                    onClick={onClose}
                    className="px-6 py-3 rounded-2xl bg-[#2F8FD8] hover:bg-[#1F7EC7] text-white font-bold text-sm flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>ابدأ هذا النشاط</span>
                  </Link>

                  <Link
                    href={`/activities/${result.topActivity.slug}`}
                    onClick={onClose}
                    className="px-5 py-3 rounded-2xl border border-[#BAE6FD] bg-white hover:bg-[#F4F9FD] text-[#2F8FD8] font-bold text-xs transition-colors"
                  >
                    معاينة التفاصيل
                  </Link>
                </div>
              </div>

              {/* Alternative Recommendations */}
              {result.alternatives.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-[#60788C] uppercase tracking-wider">
                    بدائل أخرى تناسب مجموعتك:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.alternatives.map((alt) => (
                      <div
                        key={alt.id}
                        className="p-4 rounded-2xl border border-[#E2EEF8] bg-white hover:border-[#BAE6FD] transition-all text-right flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-[#60788C] mb-1">
                            <span className="font-bold text-[#2F8FD8]">{alt.duration} دقائق</span>
                            <span>{alt.energy === "high" ? "⚡ طاقة عالية" : "🌤 متوازن"}</span>
                          </div>
                          <h5 className="text-sm font-black text-[#17324D]">{alt.titleAr}</h5>
                          <p className="text-[11px] text-[#60788C] mt-1 line-clamp-2">{alt.descriptionAr}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-[#E2EEF8] flex items-center justify-between">
                          <Link
                            href={`/host/new?activity=${alt.slug}`}
                            onClick={onClose}
                            className="text-xs font-bold text-[#2F8FD8] hover:underline flex items-center gap-1"
                          >
                            <span>تشغيل</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          <span className="text-[10px] text-[#60788C]">
                            {alt.requiresPhone ? "📱 بهواتف" : "✅ بلا هواتف"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="pt-4 mt-3 border-t border-[#E2EEF8] flex items-center justify-between">
          {!result ? (
            <>
              <button
                onClick={handlePrev}
                disabled={step === 1}
                className="px-4 py-2.5 rounded-xl border border-[#E2EEF8] text-[#60788C] font-bold text-xs hover:bg-[#F4F9FD] disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </button>

              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#2F8FD8] hover:bg-[#1F7EC7] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>{step === totalSteps ? "اكتشف الشرارة" : "التالي"}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl border border-[#E2EEF8] text-[#60788C] font-bold text-xs hover:bg-[#F4F9FD] transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#60788C]" />
                <span>إعادة الاختيار</span>
              </button>

              <button
                onClick={onClose}
                className="text-xs font-bold text-[#60788C] hover:text-[#17324D] transition-colors"
              >
                إغلاق النافذة
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
