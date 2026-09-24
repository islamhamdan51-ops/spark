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
      // Calculate final recommendations
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-scale-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-right font-arabic max-h-[90vh] flex flex-col">
        {/* Top Flame Accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-spark-flame via-spark-amber to-rose-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center flex-1">
            <span className="text-xs font-bold text-spark-flame block">المكتشف الذكي للأنشطة</span>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {result ? "النتيجة المقترحة لمجموعتك" : `خطوة ${step} من ${totalSteps}`}
            </h2>
          </div>

          <div className="w-9" /> {/* balance spacer */}
        </div>

        {/* Step Progress Bar */}
        {!result && (
          <div className="w-full bg-slate-100 h-1.5 rounded-full my-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-spark-flame to-spark-amber h-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        )}

        {/* CONTENT STAGE */}
        <div className="flex-1 overflow-y-auto py-2 pr-1">
          
          {/* ==================================================== */}
          {/* 8-STEP WIZARD QUESTIONS */}
          {/* ==================================================== */}
          {!result && (
            <div className="space-y-6 animate-scale-in">
              
              {/* STEP 1: PLAYER COUNT */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    كم شخصاً في مجموعتك الآن؟
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
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
                            ? "bg-orange-50/80 border-spark-flame shadow-md shadow-spark-flame/10"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-sm font-black text-slate-900 block">{opt.label}</span>
                        <span className="text-[11px] text-slate-500 mt-1 block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: AUDIENCE TYPE */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    من هم المشاركون في هذا النشاط؟
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
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
                            ? "bg-orange-50/80 border-spark-flame shadow-md shadow-spark-flame/10"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-sm font-black text-slate-900 block">{opt.label}</span>
                        <span className="text-[11px] text-slate-500 mt-1 block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: AGE RANGE */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
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
                            ? "bg-orange-50/80 border-spark-flame shadow-md shadow-spark-flame/10"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-sm font-black text-slate-900 block">{opt.label}</span>
                        <span className="text-[11px] text-slate-500 mt-1 block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: TIME AVAILABLE */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    كم عندك وقت متاح لهذا النشاط؟
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
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
                            ? "bg-orange-50/80 border-spark-flame shadow-md shadow-spark-flame/10"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-sm font-black text-slate-900 block">{opt.label}</span>
                        <span className="text-[11px] text-slate-500 mt-1 block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: ENERGY LEVEL */}
              {step === 5 && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    ما مستوى الطاقة المطلوب للجلسة؟
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {[
                      { id: "calm", icon: "🧊", label: "هادئ ومريح", desc: "تأمل، تركيز، هدوء بعد غداء أو تعب" },
                      { id: "medium", icon: "🌤", label: "متوسط ومتوازن", desc: "تفاعل ذهني ونقاشي خفيف وممتع" },
                      { id: "high", icon: "🔥", label: "عالٍ ومشتعل", desc: "أدرينالين، ضحك جماعي، وحركة تنشيطية" },
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
                            ? "bg-orange-50/80 border-spark-flame shadow-md shadow-spark-flame/10"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-2xl block mb-1">{opt.icon}</span>
                        <span className="text-sm font-black text-slate-900 block">{opt.label}</span>
                        <span className="text-[11px] text-slate-500 mt-1 block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: MAIN GOAL */}
              {step === 6 && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    شن الهدف الأساسي الذي تريده من المجموعة؟
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    {[
                      { id: "icebreaker", icon: "🤝", label: "تعارف وألفة" },
                      { id: "laughter", icon: "😂", label: "ضحك وتفريغ توتر" },
                      { id: "energizer", icon: "🔥", label: "رفع الطاقة وتنشيط" },
                      { id: "competition", icon: "🏆", label: "منافسة وتحدي" },
                      { id: "cooperation", icon: "🧩", label: "تعاون وبناء فريق" },
                      { id: "discussion", icon: "💬", label: "نقاش وحوار ملهم" },
                      { id: "creativity", icon: "🎨", label: "إبداع وتفكير حر" },
                      { id: "faith", icon: "🌙", label: "إيمان وقيم إسلامية" },
                      { id: "learning", icon: "📖", label: "معرفة ولغة عربية" },
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
                            ? "bg-orange-50/80 border-spark-flame shadow-md shadow-spark-flame/10"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-xl">{opt.icon}</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-900">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: PHONES AVAILABLE */}
              {step === 7 && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    هل مع المشاركين هواتف متصلة بالإنترنت؟
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
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
                            ? "bg-orange-50/80 border-spark-flame shadow-md shadow-spark-flame/10"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-2xl block mb-1">{opt.icon}</span>
                        <span className="text-sm font-black text-slate-900 block">{opt.label}</span>
                        <span className="text-[11px] text-slate-500 mt-1 block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 8: SCREEN AVAILABLE */}
              {step === 8 && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
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
                            ? "bg-orange-50/80 border-spark-flame shadow-md shadow-spark-flame/10"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-2xl block mb-1">{opt.icon}</span>
                        <span className="text-sm font-black text-slate-900 block">{opt.label}</span>
                        <span className="text-[11px] text-slate-500 mt-1 block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* RESULT VIEW: 1 PRIMARY + 2 ALTERNATIVES */}
          {/* ==================================================== */}
          {result && (
            <div className="space-y-5 animate-scale-in">
              {/* Primary Top Recommendation */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-50/50 via-white to-amber-50/40 border-2 border-spark-flame/40 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-spark-flame text-white shadow-xs">
                    ⭐ الخيار الأنسب لك الآن ({result.matchScore}% تطابق)
                  </span>
                  <span className="text-xs font-bold text-slate-500">⏱️ {result.topActivity.duration} دقائق</span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 font-arabic mt-1">
                  {result.topActivity.titleAr}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  {result.topActivity.descriptionAr}
                </p>

                {/* "Why?" Section */}
                <div className="mt-3.5 p-3 rounded-2xl bg-white/90 border border-orange-200/80 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-spark-flame block mb-0.5">لماذا اخترنا هذا النشاط؟</span>
                  <span>{result.reasonAr}</span>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/host/new?activity=${result.topActivity.slug}`}
                    onClick={onClose}
                    className="spark-glow-button px-6 py-3 rounded-2xl text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-spark-flame/25"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>ابدأ هذا النشاط الآن</span>
                  </Link>

                  <Link
                    href={`/activities/${result.topActivity.slug}`}
                    onClick={onClose}
                    className="px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                  >
                    معاينة التفاصيل
                  </Link>
                </div>
              </div>

              {/* Alternative Recommendations */}
              {result.alternatives.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    بدائل أخرى تناسب مجموعتك:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.alternatives.map((alt) => (
                      <div
                        key={alt.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all text-right flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                            <span className="font-bold text-spark-flame">{alt.duration} دقائق</span>
                            <span>{alt.energy === "high" ? "🔥 طاقة عالية" : "🌤 متوازن"}</span>
                          </div>
                          <h5 className="text-sm font-black text-slate-900">{alt.titleAr}</h5>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{alt.descriptionAr}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <Link
                            href={`/host/new?activity=${alt.slug}`}
                            onClick={onClose}
                            className="text-xs font-bold text-spark-flame hover:underline flex items-center gap-1"
                          >
                            <span>تشغيل</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          <span className="text-[10px] text-slate-400">
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
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
          {!result ? (
            <>
              <button
                onClick={handlePrev}
                disabled={step === 1}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </button>

              <button
                onClick={handleNext}
                className="spark-glow-button px-6 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-spark-flame/20"
              >
                <span>{step === totalSteps ? "اكتشف الشرارة" : "التالي"}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>إعادة الاختيار</span>
              </button>

              <button
                onClick={onClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
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
