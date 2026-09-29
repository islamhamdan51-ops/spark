"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Play, Plus, Trash2, ArrowUp, ArrowDown, RefreshCw, 
  Clock, Users, Zap, Shield, BookOpen, MessageSquare, Compass, 
  CheckCircle2, Dices, ChevronRight, FileText, Copy, Flame, RotateCcw, Share2
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { 
  SparkSession, SessionStage, SessionRhythmStage, 
  AudienceType, EnergyLevel, GoalType, Activity, SessionReport 
} from "@/types";
import { SESSION_TEMPLATES, getSessionTemplateById } from "@/data/session-templates";
import { generateSession, getRescueIntervention } from "@/lib/session-engine";
import { ACTIVITIES, getActivityBySlug } from "@/data/activities";
import { roomManager } from "@/lib/room-store";

export default function SessionsPage() {
  const router = useRouter();

  // Navigation tab: "builder" | "templates" | "history"
  const [activeTab, setActiveTab] = useState<"builder" | "templates" | "history">("builder");

  // Session Generator Inputs (defaults configured for Flagship Demo: 25 volunteers, 30m, team building)
  const [participantCount, setParticipantCount] = useState<number>(25);
  const [audience, setAudience] = useState<AudienceType>("adults");
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [goal, setGoal] = useState<GoalType | string>("cooperation");
  const [energy, setEnergy] = useState<EnergyLevel>("medium");
  const [hasPhones, setHasPhones] = useState<boolean>(true);
  const [hasScreen, setHasScreen] = useState<boolean>(true);

  // Active Session in Builder
  const [currentSession, setCurrentSession] = useState<SparkSession>(() => {
    return generateSession({
      participantCount: 25,
      audience: "adults",
      durationMinutes: 30,
      goal: "cooperation",
      energy: "medium",
      hasPhones: true,
      hasScreen: true,
    });
  });

  // Replace Activity Modal State
  const [replacingStageIndex, setReplacingStageIndex] = useState<number | null>(null);

  // Add Activity Modal State
  const [isAddingStage, setIsAddingStage] = useState<boolean>(false);

  // Rescue Modal State
  const [rescueModalOpen, setRescueModalOpen] = useState<boolean>(false);

  // Past Session Reports
  const [savedReports, setSavedReports] = useState<SessionReport[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("spark_session_reports");
        if (stored) {
          setSavedReports(JSON.parse(stored));
        }
      } catch {}
    }
  }, [activeTab]);

  // Regenerate session when primary parameters change in builder
  const handleRegenerate = () => {
    const generated = generateSession({
      participantCount,
      audience,
      durationMinutes,
      goal,
      energy,
      hasPhones,
      hasScreen,
    });
    setCurrentSession(generated);
  };

  // Reorder stages: move up
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newStages = [...currentSession.stages];
    const temp = newStages[index];
    newStages[index] = newStages[index - 1];
    newStages[index - 1] = temp;
    recalculateTimings(newStages);
  };

  // Reorder stages: move down
  const handleMoveDown = (index: number) => {
    if (index >= currentSession.stages.length - 1) return;
    const newStages = [...currentSession.stages];
    const temp = newStages[index];
    newStages[index] = newStages[index + 1];
    newStages[index + 1] = temp;
    recalculateTimings(newStages);
  };

  // Remove stage
  const handleRemoveStage = (index: number) => {
    if (currentSession.stages.length <= 1) return;
    const newStages = currentSession.stages.filter((_, i) => i !== index);
    recalculateTimings(newStages);
  };

  // Replace stage activity
  const handleSelectReplacementActivity = (activity: Activity) => {
    if (replacingStageIndex === null) return;
    const newStages = [...currentSession.stages];
    const old = newStages[replacingStageIndex];
    newStages[replacingStageIndex] = {
      ...old,
      titleAr: activity.titleAr,
      subtitleAr: activity.taglineAr,
      activity,
      closingPromptAr: activity.instructions.hostAr?.[activity.instructions.hostAr.length - 1] || old.closingPromptAr,
    };
    setCurrentSession({ ...currentSession, stages: newStages });
    setReplacingStageIndex(null);
  };

  // Add new stage
  const handleAddActivity = (activity: Activity) => {
    const newStage: SessionStage = {
      id: `stg-${Date.now()}`,
      order: currentSession.stages.length + 1,
      stageType: activity.category === "ICEBREAKER" ? "ICEBREAKER" : activity.category === "REFLECTION" ? "CLOSING" : "TEAMWORK",
      titleAr: activity.titleAr,
      subtitleAr: activity.taglineAr,
      timeRange: "",
      durationMinutes: activity.duration || 5,
      activity,
      facilitatorTipAr: activity.instructions.hostAr?.[0] || "شجع المشاركين على التفاعل بحرية.",
      nowInstructionAr: "ابدأ النشاط ووجّه الحضور لمتابعة الشاشة.",
      nextInstructionAr: "استعد للنشاط القادم.",
      closingPromptAr: "ما الذي استخلصتموه من هذا التحدي؟",
    };
    const newStages = [...currentSession.stages, newStage];
    recalculateTimings(newStages);
    setIsAddingStage(false);
  };

  // Recalculate timeline display
  const recalculateTimings = (stages: SessionStage[]) => {
    let elapsed = 0;
    const updated = stages.map((s, idx) => {
      const start = elapsed;
      const end = elapsed + s.durationMinutes;
      elapsed = end;
      return {
        ...s,
        order: idx + 1,
        timeRange: `${formatTime(start)}–${formatTime(end)}`,
      };
    });
    setCurrentSession({
      ...currentSession,
      stages: updated,
      totalDuration: elapsed,
    });
  };

  function formatTime(minutes: number): string {
    const m = Math.floor(minutes);
    const s = Math.round((minutes - m) * 60);
    const mStr = m < 10 ? `0${m}` : `${m}`;
    const sStr = s < 10 ? `0${s}` : `${s}`;
    return `${mStr}:${sStr}`;
  }

  // Launch live session with room code
  const handleStartSession = () => {
    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const firstAct = currentSession.stages[0]?.activity || ACTIVITIES[0];
    roomManager.getOrCreateRoom(roomCode, firstAct.slug);
    roomManager.attachSession(roomCode, currentSession);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`spark_active_session_${roomCode}`, JSON.stringify(currentSession));
      } catch {}
    }

    router.push(`/host/${roomCode}`);
  };

  // Load template into builder
  const handleLoadTemplate = (template: SparkSession) => {
    setCurrentSession(template);
    setParticipantCount(template.participantCount);
    setAudience(template.audience);
    setDurationMinutes(template.totalDuration);
    setGoal(template.goal);
    setEnergy(template.energy);
    setHasPhones(template.requiresPhone);
    setActiveTab("builder");
  };

  const rescueIntervention = getRescueIntervention(currentSession, 6);

  return (
    <div className="flex-1 flex flex-col bg-[#F4F9FD] text-[#17324D] font-arabic selection:bg-[#C9ECFF]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Header: Group Session Platform Positioning */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2EEF8]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF7FF] text-[#2F8FD8] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>محرك تيسير الجلسات • SPARK Session Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#17324D]">
              شن بنسوا اليوم مع المجموعة؟
            </h1>
            <p className="text-sm text-[#60788C] mt-1 font-medium">
              صمم جلسة تفاعلية متسلسلة تحقق هدفك بدقة، من كسر الجمود حتى الختام والتأمل.
            </p>
          </div>

          {/* Quick Action: Rescue Intervention */}
          <button
            onClick={() => setRescueModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#C9ECFF] text-[#2F8FD8] hover:bg-[#EAF7FF] text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-2xs transition-colors"
          >
            <Dices className="w-4 h-4 text-[#2F8FD8]" />
            <span>🆘 أنقذ الجلسة (Rescue)</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E2EEF8] pb-1">
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-5 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 ${
              activeTab === "builder"
                ? "text-[#2F8FD8] border-[#2F8FD8] bg-white shadow-2xs"
                : "text-[#60788C] border-transparent hover:text-[#17324D]"
            }`}
          >
            🛠️ صانع الجلسة (Builder)
          </button>

          <button
            onClick={() => setActiveTab("templates")}
            className={`px-5 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 ${
              activeTab === "templates"
                ? "text-[#2F8FD8] border-[#2F8FD8] bg-white shadow-2xs"
                : "text-[#60788C] border-transparent hover:text-[#17324D]"
            }`}
          >
            📋 قوالب جاهزة ({SESSION_TEMPLATES.length})
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-5 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 ${
              activeTab === "history"
                ? "text-[#2F8FD8] border-[#2F8FD8] bg-white shadow-2xs"
                : "text-[#60788C] border-transparent hover:text-[#17324D]"
            }`}
          >
            🗂️ جلساتي السابقة ({savedReports.length})
          </button>
        </div>

        {/* TAB 1: SESSION BUILDER */}
        {activeTab === "builder" && (
          <div className="space-y-8 animate-scale-in">
            
            {/* Generator Controls Card */}
            <div className="bg-white rounded-2xl border border-[#E2EEF8] p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#60788C]">
                  مواصفات المجموعة والهدف:
                </span>
                <button
                  onClick={handleRegenerate}
                  className="text-xs font-bold text-[#2F8FD8] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>توليد خطة جديدة</span>
                </button>
              </div>

              {/* Grid of parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                
                {/* 1. Participants */}
                <div className="space-y-1">
                  <label className="text-[#60788C] font-bold block">👥 عدد الحضور:</label>
                  <select
                    value={participantCount}
                    onChange={(e) => setParticipantCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#E2EEF8] bg-[#F4F9FD] text-[#17324D] font-bold focus:outline-none focus:border-[#2F8FD8]"
                  >
                    <option value={8}>8 أشخاص</option>
                    <option value={15}>15 شخصاً</option>
                    <option value={25}>25 شخصاً (فريق عمل)</option>
                    <option value={40}>40 شخصاً</option>
                    <option value={60}>60+ قاعة كبيرة</option>
                  </select>
                </div>

                {/* 2. Audience */}
                <div className="space-y-1">
                  <label className="text-[#60788C] font-bold block">🎯 الفئة المستهدفة:</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as AudienceType)}
                    className="w-full p-2.5 rounded-xl border border-[#E2EEF8] bg-[#F4F9FD] text-[#17324D] font-bold focus:outline-none focus:border-[#2F8FD8]"
                  >
                    <option value="adults">كبار وشباب</option>
                    <option value="kids">أطفال (4–12)</option>
                    <option value="mixed">مختلط / أسري</option>
                  </select>
                </div>

                {/* 3. Duration */}
                <div className="space-y-1">
                  <label className="text-[#60788C] font-bold block">⏱️ مدة الجلسة:</label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#E2EEF8] bg-[#F4F9FD] text-[#17324D] font-bold focus:outline-none focus:border-[#2F8FD8]"
                  >
                    <option value={15}>15 دقيقة (سريعة)</option>
                    <option value={25}>25 دقيقة (قياسية)</option>
                    <option value={30}>30 دقيقة (مثالية)</option>
                    <option value={45}>45 دقيقة (موسعة)</option>
                    <option value={60}>60 دقيقة (ورشة كاملة)</option>
                  </select>
                </div>

                {/* 4. Goal */}
                <div className="space-y-1">
                  <label className="text-[#60788C] font-bold block">💡 الهدف الأساسي:</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E2EEF8] bg-[#F4F9FD] text-[#17324D] font-bold focus:outline-none focus:border-[#2F8FD8]"
                  >
                    <option value="cooperation">🤝 بناء فريق وتعاون</option>
                    <option value="icebreaker">👋 كسر جمود وتعارف</option>
                    <option value="energizer">⚡ رفع الطاقة والحماس</option>
                    <option value="discussion">💬 حوار ونقاش هادف</option>
                    <option value="faith">🌙 قيم وتدبر إيماني</option>
                    <option value="learning">📖 تعلم ومعرفة تفاعلية</option>
                    <option value="laughter">😂 ضحك ومرح مشترك</option>
                  </select>
                </div>

                {/* 5. Energy */}
                <div className="space-y-1">
                  <label className="text-[#60788C] font-bold block">🔥 طاقة الجلسة:</label>
                  <select
                    value={energy}
                    onChange={(e) => setEnergy(e.target.value as EnergyLevel)}
                    className="w-full p-2.5 rounded-xl border border-[#E2EEF8] bg-[#F4F9FD] text-[#17324D] font-bold focus:outline-none focus:border-[#2F8FD8]"
                  >
                    <option value="medium">🌤️ متوازنة (Medium)</option>
                    <option value="high">🔥 حماسية عالية (High)</option>
                    <option value="calm">🧊 هادئة وتأملية (Calm)</option>
                  </select>
                </div>

                {/* 6. Phones */}
                <div className="space-y-1">
                  <label className="text-[#60788C] font-bold block">📱 الهواتف:</label>
                  <select
                    value={hasPhones ? "yes" : "no"}
                    onChange={(e) => setHasPhones(e.target.value === "yes")}
                    className="w-full p-2.5 rounded-xl border border-[#E2EEF8] bg-[#F4F9FD] text-[#17324D] font-bold focus:outline-none focus:border-[#2F8FD8]"
                  >
                    <option value="yes">متوفرة مع الحضور</option>
                    <option value="no">بدون هواتف (شاشة فقط)</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Timeline View & Activity Cards */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-[#17324D] flex items-center gap-2">
                    <span>مسار الجلسة:</span>
                    <span className="text-[#2F8FD8]">{currentSession.titleAr}</span>
                  </h2>
                  <p className="text-xs text-[#60788C] mt-0.5">
                    المدة الكلية: {currentSession.totalDuration} دقيقة • {currentSession.stages.length} مراحل متتابعة
                  </p>
                </div>

                {/* Action CTAs: Dominant Primary Launch */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddingStage(true)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#E2EEF8] hover:bg-[#F4F9FD] text-[#60788C] text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-[#2F8FD8]" />
                    <span>إضافة نشاط</span>
                  </button>

                  <button
                    onClick={handleStartSession}
                    className="bg-[#2F8FD8] hover:bg-[#1F7EC7] active:scale-98 transition-all px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-xs flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>بدء الجلسة الآن</span>
                  </button>
                </div>
              </div>

              {/* Timeline Sequence List */}
              <div className="space-y-3 relative before:absolute before:right-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#E2EEF8] before:hidden sm:before:block">
                {currentSession.stages.map((stage, idx) => (
                  <div
                    key={stage.id}
                    className="bg-white rounded-2xl border border-[#E2EEF8] p-4 sm:p-5 shadow-2xs hover:border-[#A9DFFF] transition-all relative flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left/Right info */}
                    <div className="flex items-start gap-4">
                      {/* Order & Time badge */}
                      <div className="w-12 h-12 rounded-xl bg-[#EAF7FF] text-[#2F8FD8] flex flex-col items-center justify-center font-bold text-xs shrink-0 border border-[#C9ECFF]">
                        <span>0{stage.order}</span>
                        <span className="text-[10px] text-[#60788C] font-mono">{stage.durationMinutes}د</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#60788C] bg-[#F4F9FD] px-2 py-0.5 rounded-md border border-[#E2EEF8]">
                            {stage.timeRange}
                          </span>
                          <span className="text-[11px] font-bold text-[#2F8FD8] bg-[#EAF7FF] px-2 py-0.5 rounded-md">
                            {stage.stageType}
                          </span>
                          {!stage.activity.requiresPhone && (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              ✅ بدون هواتف
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-[#17324D]">
                          {stage.titleAr}
                        </h3>

                        <p className="text-xs text-[#60788C] leading-relaxed max-w-xl">
                          {stage.subtitleAr || stage.activity.descriptionAr}
                        </p>

                        {/* Facilitator Tip Inline */}
                        <div className="text-[11px] text-[#17324D] bg-[#F4F9FD] p-2 rounded-lg border border-[#E2EEF8] mt-2 inline-flex items-center gap-1.5 font-medium">
                          <span className="text-[#2F8FD8] font-bold">💡 نصيحة الميسر:</span>
                          <span>{stage.facilitatorTipAr}</span>
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1 self-end md:self-center shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-[#E2EEF8] w-full md:w-auto justify-end">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        title="تحريك لأعلى"
                        className="p-1.5 rounded-lg border border-[#E2EEF8] hover:bg-[#F4F9FD] text-[#60788C] disabled:opacity-30 text-xs"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === currentSession.stages.length - 1}
                        title="تحريك لأسفل"
                        className="p-1.5 rounded-lg border border-[#E2EEF8] hover:bg-[#F4F9FD] text-[#60788C] disabled:opacity-30 text-xs"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setReplacingStageIndex(idx)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#E2EEF8] hover:bg-[#EAF7FF] text-[#2F8FD8] text-xs font-bold"
                      >
                        استبدال النشاط
                      </button>

                      {currentSession.stages.length > 1 && (
                        <button
                          onClick={() => handleRemoveStage(idx)}
                          title="حذف النشاط"
                          className="p-1.5 rounded-lg border border-[#E2EEF8] hover:bg-rose-50 text-rose-500 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>

              {/* Bottom Quick Launch */}
              <div className="p-4 bg-white rounded-2xl border border-[#C9ECFF] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#60788C]">
                  جاهز للانطلاق؟ اضغط <strong className="text-[#17324D]">بدء الجلسة</strong> لفتح شاشة العرض للمجموعة وتوليد رمز الدخول QR فوراً.
                </div>
                <button
                  onClick={handleStartSession}
                  className="w-full sm:w-auto bg-[#2F8FD8] hover:bg-[#1F7EC7] active:scale-98 transition-all px-7 py-3 rounded-xl text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>بدء الجلسة على الشاشة 🚀</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: READY TEMPLATES */}
        {activeTab === "templates" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-scale-in">
            {SESSION_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-white rounded-2xl border border-[#E2EEF8] p-6 shadow-xs hover:border-[#A9DFFF] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#60788C] mb-2 font-medium">
                    <span className="bg-[#EAF7FF] text-[#2F8FD8] px-2.5 py-0.5 rounded-md font-bold">
                      {tmpl.totalDuration} دقيقة
                    </span>
                    <span>👥 {tmpl.participantCount} شخصاً</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#17324D] mb-1.5">
                    {tmpl.titleAr}
                  </h3>
                  <p className="text-xs text-[#60788C] leading-relaxed mb-4">
                    {tmpl.descriptionAr}
                  </p>

                  {/* Stages timeline preview */}
                  <div className="space-y-1.5 border-t border-[#E2EEF8] pt-3 text-xs">
                    {tmpl.stages.map((stg) => (
                      <div key={stg.id} className="flex items-center justify-between text-[#60788C]">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2F8FD8]" />
                          <span className="text-[#17324D] font-medium">{stg.titleAr}</span>
                        </span>
                        <span className="font-mono text-[11px]">{stg.timeRange}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E2EEF8] flex items-center gap-2">
                  <button
                    onClick={() => handleLoadTemplate(tmpl)}
                    className="flex-1 bg-[#2F8FD8] hover:bg-[#1F7EC7] text-white font-bold text-xs py-2.5 rounded-xl text-center transition-colors shadow-2xs"
                  >
                    استخدام هذا القالب والتعديل عليه
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SESSION HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-4 animate-scale-in">
            {savedReports.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#E2EEF8] p-8 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#EAF7FF] text-[#2F8FD8] flex items-center justify-center mx-auto text-xl">
                  🗂️
                </div>
                <h3 className="text-base font-bold text-[#17324D]">
                  لا توجد جلسات مسجلة بعد
                </h3>
                <p className="text-xs text-[#60788C] max-w-sm mx-auto">
                  بمجرد إطلاق جلستك الأولى وإتمامها، ستظهر هنا تلقائياً تقارير الحضور والتفاعل ونسب الإنجاز.
                </p>
                <button
                  onClick={() => setActiveTab("builder")}
                  className="bg-[#2F8FD8] hover:bg-[#1F7EC7] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-2xs inline-block"
                >
                  صمم جلستك الأولى الآن
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="bg-white rounded-2xl border border-[#E2EEF8] p-5 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between text-xs text-[#60788C]">
                      <span className="font-mono">{new Date(rep.createdAt).toLocaleDateString("ar-EG")}</span>
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-bold">
                        إنجاز {rep.completionRatePercent}%
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-[#17324D]">
                        {rep.sessionTitleAr}
                      </h4>
                      <div className="flex items-center gap-4 text-xs text-[#60788C] mt-1">
                        <span>👥 {rep.participantCount} مشاركاً</span>
                        <span>⏱️ {rep.actualDurationMinutes} دقيقة</span>
                        <span>🎯 إشارة التفاعل: {rep.participationSignal === "high" ? "عالية 🔥" : "متوسطة 🌤️"}</span>
                      </div>
                    </div>

                    <div className="border-t border-[#E2EEF8] pt-3 flex items-center justify-between">
                      <span className="text-xs text-[#60788C]">
                        أبرز نشاط: <strong className="text-[#17324D]">{rep.mostEngagingActivityTitleAr}</strong>
                      </span>
                      <Link
                        href={`/sessions/report/${rep.id}`}
                        className="text-xs font-bold text-[#2F8FD8] hover:underline"
                      >
                        عرض التقرير الكامل ←
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* REPLACE ACTIVITY MODAL */}
      {replacingStageIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col border border-[#E2EEF8] shadow-lg animate-scale-in">
            <div className="p-5 border-b border-[#E2EEF8] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#17324D]">
                اختر نشاطاً بديلاً للمرحلة {replacingStageIndex + 1}
              </h3>
              <button
                onClick={() => setReplacingStageIndex(null)}
                className="text-[#60788C] hover:text-[#17324D] text-xs font-bold"
              >
                إغلاق ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
              {ACTIVITIES.slice(0, 15).map((act) => (
                <div
                  key={act.id}
                  onClick={() => handleSelectReplacementActivity(act)}
                  className="p-3.5 rounded-xl border border-[#E2EEF8] hover:border-[#2F8FD8] hover:bg-[#F4F9FD] cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#17324D]">{act.titleAr}</span>
                      <span className="text-[11px] text-[#2F8FD8] bg-[#EAF7FF] px-2 py-0.5 rounded font-bold">
                        {act.duration} دقائق
                      </span>
                    </div>
                    <p className="text-xs text-[#60788C] mt-0.5">{act.taglineAr}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#60788C] rotate-180" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD ACTIVITY MODAL */}
      {isAddingStage && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col border border-[#E2EEF8] shadow-lg animate-scale-in">
            <div className="p-5 border-b border-[#E2EEF8] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#17324D]">
                إضافة نشاط جديد لمسار الجلسة
              </h3>
              <button
                onClick={() => setIsAddingStage(false)}
                className="text-[#60788C] hover:text-[#17324D] text-xs font-bold"
              >
                إغلاق ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
              {ACTIVITIES.slice(0, 20).map((act) => (
                <div
                  key={act.id}
                  onClick={() => handleAddActivity(act)}
                  className="p-3.5 rounded-xl border border-[#E2EEF8] hover:border-[#2F8FD8] hover:bg-[#F4F9FD] cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#17324D]">{act.titleAr}</span>
                      <span className="text-[11px] text-[#2F8FD8] bg-[#EAF7FF] px-2 py-0.5 rounded font-bold">
                        {act.duration} دقائق
                      </span>
                    </div>
                    <p className="text-xs text-[#60788C] mt-0.5">{act.descriptionAr}</p>
                  </div>
                  <Plus className="w-4 h-4 text-[#2F8FD8]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RESCUE INTERVENTION MODAL */}
      {rescueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#C9ECFF] shadow-lg animate-scale-in space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold">
                <span>🆘 تدخل إنقاذ سريع (Rescue Mode)</span>
              </div>
              <button
                onClick={() => setRescueModalOpen(false)}
                className="text-[#60788C] hover:text-[#17324D] text-xs font-bold"
              >
                إغلاق ✕
              </button>
            </div>

            <div>
              <h3 className="text-lg font-black text-[#17324D]">
                الجلسة فقدت حماسها؟ SPARK يتدخل فوراً!
              </h3>
              <p className="text-xs text-[#60788C] mt-1 leading-relaxed">
                حللنا وضع المجموعة ووقتها المتاح، ونقترح تدخلاً حركياً سريعاً يوقظ القاعة دون أي تحضير مسبق:
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F9FD] border border-[#E2EEF8] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#17324D]">{rescueIntervention.titleAr}</span>
                <span className="text-xs font-bold text-[#2F8FD8] bg-[#EAF7FF] px-2 py-0.5 rounded">
                  {rescueIntervention.durationMinutes} دقائق
                </span>
              </div>
              <p className="text-xs text-[#60788C]">
                {rescueIntervention.reasonAr}
              </p>
              <div className="text-[11px] text-[#17324D] bg-white p-2 rounded-md border border-[#E2EEF8]">
                <strong>💡 نصيحة فورية: </strong>
                <span>{rescueIntervention.facilitatorTipAr}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setRescueModalOpen(false);
                  const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
                  roomManager.getOrCreateRoom(roomCode, rescueIntervention.activity.slug);
                  router.push(`/host/${roomCode}`);
                }}
                className="flex-1 bg-[#2F8FD8] hover:bg-[#1F7EC7] text-white font-bold text-xs py-3 rounded-xl shadow-xs text-center"
              >
                بدء نشاط الإنقاذ فوراً ⚡
              </button>
              <button
                onClick={() => setRescueModalOpen(false)}
                className="px-4 py-3 rounded-xl border border-[#E2EEF8] text-[#60788C] text-xs font-bold hover:bg-[#F4F9FD]"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
