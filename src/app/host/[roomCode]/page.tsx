"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { 
  Sparkles, Play, Users, Clock, QrCode, Maximize2, Minimize2, 
  Volume2, VolumeX, RotateCcw, ChevronRight, CheckCircle2, 
  Eye, EyeOff, Shield, Trophy, ArrowLeft, Copy, Check, Dice5, Share2,
  AlertTriangle, Hourglass, Compass, LifeBuoy, FileText
} from "lucide-react";
import { roomManager } from "@/lib/room-store";
import { getActivityBySlug, ACTIVITIES } from "@/data/activities";
import { RoomState, Activity, Player, PlayerAnswer, ActivityRound, EnergyLevel } from "@/types";
import { QRCodeView } from "@/components/common/QRCodeView";
import { resolveJoinUrl } from "@/lib/get-join-url";
import { sounds } from "@/lib/sound";
import { getRescueIntervention, getNextSmartActivityRecommendation } from "@/lib/session-engine";

export default function HostRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params?.roomCode as string;

  const [room, setRoom] = useState<RoomState | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [joinUrl, setJoinUrl] = useState<string>("");
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSecretWord, setShowSecretWord] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState<number>(60);
  const [stopwatchRunning, setStopwatchRunning] = useState<boolean>(false);
  const [countdownVal, setCountdownVal] = useState<number>(3);

  // Facilitator Platform extensions
  const [facilitatorModeOpen, setFacilitatorModeOpen] = useState<boolean>(true);
  const [timeRescueModalOpen, setTimeRescueModalOpen] = useState<boolean>(false);
  const [rescueModalOpen, setRescueModalOpen] = useState<boolean>(false);
  const [pulseAlert, setPulseAlert] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stopwatchRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to room manager & resolve real join URL
  useEffect(() => {
    if (!roomCode) return;
    
    resolveJoinUrl(roomCode).then((url) => {
      setJoinUrl(url);
    });

    const urlAct = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("act") : null;
    const initial = roomManager.getOrCreateRoom(roomCode, urlAct || "this-or-that");
    
    // Auto-restore attached session if present in localStorage or initial room
    if (typeof window !== "undefined") {
      try {
        const savedSession = localStorage.getItem(`spark_active_session_${roomCode}`);
        if (savedSession && !initial.session) {
          const parsed = JSON.parse(savedSession);
          if (parsed) {
            roomManager.attachSession(roomCode, parsed);
          }
        }
      } catch {}
    }

    setRoom(initial);
    const act = getActivityBySlug(initial.activitySlug) || ACTIVITIES[0];
    setActivity(act);

    const unsubscribe = roomManager.subscribe(roomCode, (updatedState) => {
      setRoom({ ...updatedState });
      if (updatedState.activitySlug) {
        const a = getActivityBySlug(updatedState.activitySlug);
        if (a) setActivity(a);
      }
    });

    setIsMuted(sounds.getMuted());
    return () => unsubscribe();
  }, [roomCode]);

  // Synchronized Dynamic Countdown (3 -> 2 -> 1)
  useEffect(() => {
    if (room?.status === "COUNTDOWN") {
      const updateCountdown = () => {
        const elapsed = Math.floor((Date.now() - (room.roundStartTime || Date.now())) / 1000);
        const remaining = Math.max(1, 3 - elapsed);
        setCountdownVal(remaining);
      };
      updateCountdown();
      const interval = setInterval(updateCountdown, 250);
      return () => clearInterval(interval);
    } else {
      setCountdownVal(3);
    }
  }, [room?.status, room?.roundStartTime]);

  // Keyboard Shortcuts (Space: Start/Next, M: Mute, R: Reset, F: Fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (room?.status === "LOBBY") handleStartCountdown();
        else if (room?.status === "ROUND_RESULTS") handleNextRoundOrFinish();
      } else if (e.code === "KeyM") {
        handleToggleSound();
      } else if (e.code === "KeyR") {
        handleReset();
      } else if (e.code === "KeyF") {
        setIsFullscreen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [room, activity]);

  const fallbackRound: ActivityRound = {
    id: `${activity?.id || "act"}-round-${(room?.currentRoundIndex || 0) + 1}`,
    roundNumber: (room?.currentRoundIndex || 0) + 1,
    promptAr: activity?.descriptionAr || activity?.titleAr || "استعد للجولة",
    subtitleAr: activity?.taglineAr,
    timeLimit: 30,
    optionsAr: ["تم إنجاز التحدي بنجاح! 👏", "مستمرون في التفاعل والنقاش 💡"],
  };

  const rounds = (activity?.rounds && activity.rounds.length > 0) ? activity.rounds : [fallbackRound];
  const currentRound = (room && rounds[room.currentRoundIndex]) || rounds[0] || fallbackRound;

  // Flexible match so any format of round ID (or index suffix) is correctly recognized and displayed
  const isAnswerForCurrentRound = (a: PlayerAnswer) => {
    if (!a || !currentRound) return false;
    if (a.roundId === currentRound.id) return true;
    const suffix = `-round-${(room?.currentRoundIndex || 0) + 1}`;
    if (a.roundId.endsWith(suffix) || currentRound.id.endsWith(suffix)) return true;
    if (
      a.roundId === `round-${(room?.currentRoundIndex || 0) + 1}` ||
      currentRound.id === `round-${(room?.currentRoundIndex || 0) + 1}`
    ) {
      return true;
    }
    return false;
  };

  const roundAnswers = room?.answers?.filter(isAnswerForCurrentRound) || [];

  const [secondsLeft, setSecondsLeft] = useState<number>(15);

  // Synchronized Round Timer effect using roundStartTime
  useEffect(() => {
    if (room?.status === "PLAYING_ROUND") {
      const updateTimer = () => {
        const elapsed = Math.floor((Date.now() - (room.roundStartTime || Date.now())) / 1000);
        const limit = currentRound?.timeLimit || room.roundTimer || 15;
        const remaining = Math.max(0, limit - elapsed);
        setSecondsLeft(remaining);

        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          roomManager.showRoundResults(roomCode);
        } else if (remaining <= 4) {
          sounds.playTick(false);
        }
      };

      updateTimer();
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(updateTimer, 500);
    } else {
      setSecondsLeft(room?.roundTimer || 15);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [room?.status, room?.roundStartTime, room?.roundTimer, currentRound?.timeLimit, roomCode]);

  // Clean transition when all connected players have answered
  useEffect(() => {
    if (room?.status !== "PLAYING_ROUND" || !currentRound || room.players.length === 0) return;
    const answeredCount = room.answers?.filter(isAnswerForCurrentRound).length || 0;
    if (answeredCount >= room.players.length) {
      const timeout = setTimeout(() => {
        roomManager.showRoundResults(roomCode);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [room?.status, room?.answers?.length, room?.players?.length, currentRound?.id, roomCode]);

  // Stopwatch for non-phone facilitation activities
  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchRef.current = setInterval(() => {
        setStopwatchTime((prev) => {
          if (prev <= 1) {
            sounds.playTick(true);
            setStopwatchRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    }
    return () => {
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    };
  }, [stopwatchRunning]);

  if (!room || !activity) {
    return (
      <div className="min-h-screen bg-[#F4F9FD] flex items-center justify-center text-[#17324D] font-arabic">
        <div className="text-center p-8 bg-white rounded-2xl border border-[#E2EEF8] shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#EAF7FF] text-[#2F8FD8] flex items-center justify-center mx-auto mb-3 animate-spin">
            ⚡
          </div>
          <div className="text-base font-bold">جاري تجهيز الغرفة {roomCode}...</div>
        </div>
      </div>
    );
  }

  const effectiveJoinUrl = joinUrl || (typeof window !== "undefined" ? `${window.location.origin}/join?code=${roomCode}` : "");

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(effectiveJoinUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleToggleSound = () => {
    const updated = sounds.toggleMute();
    setIsMuted(updated);
  };

  const handleStartCountdown = () => {
    roomManager.startCountdown(roomCode);
    sounds.playTick(false);
    setTimeout(() => sounds.playTick(false), 1000);
    setTimeout(() => sounds.playTick(true), 2000);
    setTimeout(() => {
      roomManager.launchRound(roomCode, 0);
    }, 3000);
  };

  const effectiveRoundsCount = room.compressedRoundsCount || (activity.rounds?.length || 1);

  const handleNextRoundOrFinish = () => {
    if (room.currentRoundIndex + 1 < effectiveRoundsCount) {
      roomManager.launchRound(roomCode, room.currentRoundIndex + 1);
    } else {
      sounds.playCelebration();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
      roomManager.nextRoundOrFinish(roomCode);
    }
  };

  const handleReset = () => {
    roomManager.resetRoom(roomCode);
  };

  const handleLaunchAnotherSpark = () => {
    const remaining = ACTIVITIES.filter((a) => a.slug !== activity.slug);
    const nextAct = remaining[Math.floor(Math.random() * remaining.length)] || ACTIVITIES[0];
    roomManager.resetRoom(roomCode);
    window.location.href = `/host/${roomCode}?act=${nextAct.slug}`;
  };

  const handleRecordPulse = (level: EnergyLevel) => {
    roomManager.recordSessionPulse(roomCode, level);
    const label = level === "high" ? "🔥 طاقة عالية" : level === "medium" ? "🌤️ طاقة معتدلة" : "🧊 طاقة هادئة";
    setPulseAlert(`تم تسجيل النبض (${label}) ✓`);
    setTimeout(() => setPulseAlert(null), 3000);
  };

  const currentStage = room.session?.stages[room.currentSessionStageIndex || 0];
  const nextStage = room.session?.stages[(room.currentSessionStageIndex || 0) + 1];
  const rescueIntervention = getRescueIntervention(room.session || null, 6);
  const smartRecommendation = getNextSmartActivityRecommendation(activity, room.session || null, "medium");

  return (
    <div
      className={`min-h-screen ${
        isFullscreen ? "bg-white p-4 sm:p-6" : "bg-[#F4F9FD] p-4 sm:p-6"
      } text-[#17324D] flex flex-col font-arabic transition-colors duration-200`}
    >
      {/* 22 — Top Host Bar */}
      <header className="max-w-5xl mx-auto w-full bg-white/95 backdrop-blur-md border border-[#E2EEF8] rounded-2xl px-5 py-3 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/activities"
            className="p-2 rounded-lg bg-[#F4F9FD] hover:bg-[#EAF7FF] text-[#60788C] hover:text-[#17324D] transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>المكتبة</span>
          </Link>
          <div className="h-4 w-px bg-[#E2EEF8]" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#60788C] font-bold">النشاط:</span>
            <span className="text-xs font-bold text-[#2F8FD8] bg-[#EAF7FF] px-2.5 py-1 rounded-md border border-[#C9ECFF]">
              {activity.titleAr}
            </span>
          </div>
        </div>

        {/* Center: Prominent Room Code */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#60788C] font-mono">الرمز:</span>
          <span className="text-lg font-black font-mono tracking-widest text-[#17324D] bg-[#F4F9FD] px-3 py-1 rounded-lg border border-[#E2EEF8]">
            {roomCode}
          </span>
          <button
            onClick={handleCopyLink}
            title="نسخ رابط الغرفة"
            className="p-1.5 rounded-lg border border-[#E2EEF8] hover:bg-[#F4F9FD] text-[#60788C] text-xs transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right: Sound & Presentation Display Modes */}
        <div className="flex items-center gap-2">
          {/* Facilitator Mode toggle */}
          <button
            onClick={() => setFacilitatorModeOpen(!facilitatorModeOpen)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
              facilitatorModeOpen
                ? "bg-[#EAF7FF] text-[#2F8FD8] border border-[#C9ECFF]"
                : "bg-[#F4F9FD] text-[#60788C] hover:text-[#17324D]"
            }`}
          >
            <span>🧭 وضع الميسر</span>
          </button>

          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
            title={isMuted ? "تشغيل الصوت (M)" : "كتم الصوت (M)"}
            className="p-2 rounded-lg text-[#60788C] hover:text-[#17324D] hover:bg-[#F4F9FD] transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#A0AEC0]" /> : <Volume2 className="w-4 h-4 text-[#2F8FD8]" />}
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="وضع العرض التقديمي للشاشات الكبيرة (F)"
            className="p-2 rounded-lg bg-[#F4F9FD] hover:bg-[#EAF7FF] text-[#17324D] text-xs font-bold flex items-center gap-1 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden md:inline">{isFullscreen ? "تصغير" : "شاشة كاملة"}</span>
          </button>
        </div>
      </header>

      {/* SESSION ENGINE RIBBON & FACILITATOR BAR */}
      <section className="max-w-5xl mx-auto w-full mb-6 space-y-3">
        {/* Active Session Ribbon */}
        {room.session && (
          <div className="bg-white rounded-2xl border border-[#C9ECFF] p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#2F8FD8] bg-[#EAF7FF] px-2.5 py-1 rounded-md">
                جلسة: {room.session.titleAr}
              </span>
              <span className="text-[#60788C] font-medium">
                المرحلة {(room.currentSessionStageIndex || 0) + 1} من {room.session.stages.length}:{" "}
                <strong className="text-[#17324D]">{currentStage?.titleAr || activity.titleAr}</strong>
              </span>
              {currentStage?.timeRange && (
                <span className="font-mono text-[#60788C] bg-[#F4F9FD] px-2 py-0.5 rounded border border-[#E2EEF8]">
                  {currentStage.timeRange}
                </span>
              )}
            </div>

            {/* Quick intervention buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimeRescueModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold transition-colors flex items-center gap-1"
              >
                <Hourglass className="w-3.5 h-3.5" />
                <span>اختصر الجلسة</span>
              </button>

              <button
                onClick={() => setRescueModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold transition-colors flex items-center gap-1"
              >
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>🆘 أنقذني</span>
              </button>
            </div>
          </div>
        )}

        {/* Time Rescue Alert Banner */}
        {room.timeRescueActive && room.timeRescueMessage && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-2 text-xs font-bold flex items-center justify-between animate-scale-in">
            <div className="flex items-center gap-2">
              <Hourglass className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>{room.timeRescueMessage}</span>
            </div>
            <span className="text-[11px] bg-white px-2 py-0.5 rounded text-amber-900 border border-amber-200">
              تم الضغط
            </span>
          </div>
        )}

        {/* Facilitator Pulse Checkpoint */}
        <div className="bg-white/80 backdrop-blur-xs rounded-xl border border-[#E2EEF8] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#60788C] font-bold">نبض المجموعة الآن (Pulse):</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleRecordPulse("calm")}
                className="px-2 py-1 rounded-lg hover:bg-[#F4F9FD] border border-[#E2EEF8] text-[#17324D] transition-colors"
                title="طاقة هادئة أو تراجع التركيز"
              >
                🧊 هادئة
              </button>
              <button
                onClick={() => handleRecordPulse("medium")}
                className="px-2 py-1 rounded-lg hover:bg-[#F4F9FD] border border-[#E2EEF8] text-[#17324D] transition-colors"
                title="طاقة متوازنة وتفاعل جيد"
              >
                🌤️ معتدلة
              </button>
              <button
                onClick={() => handleRecordPulse("high")}
                className="px-2 py-1 rounded-lg hover:bg-[#F4F9FD] border border-[#E2EEF8] text-[#17324D] transition-colors"
                title="حماس عالي وتفاعل نشط جداً"
              >
                🔥 حماسية
              </button>
            </div>
            {pulseAlert && (
              <span className="text-emerald-600 font-bold text-[11px] animate-scale-in">
                {pulseAlert}
              </span>
            )}
          </div>

          {!room.session && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimeRescueModalOpen(true)}
                className="text-[11px] text-[#60788C] hover:text-[#17324D] font-bold underline"
              >
                ضاق الوقت؟ اختصر
              </button>
              <button
                onClick={() => setRescueModalOpen(true)}
                className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
              >
                <span>🆘 أنقذ الجلسة</span>
              </button>
            </div>
          )}
        </div>

        {/* 14 — FACILITATOR MODE ASSISTANT BOX */}
        {facilitatorModeOpen && (
          <div className="bg-[#EAF7FF]/60 border border-[#C9ECFF] rounded-2xl p-4 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-3 text-xs animate-scale-in">
            <div className="space-y-1">
              <span className="font-bold text-[#2F8FD8] flex items-center gap-1">
                <span>🎯 الآن (NOW):</span>
              </span>
              <p className="text-[#17324D] leading-relaxed">
                {currentStage?.nowInstructionAr || activity.instructions.hostAr?.[0] || "ابدأ النشاط ووجّه المجموعة للمشاركة."}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-amber-700 flex items-center gap-1">
                <span>⏭️ التالي (NEXT):</span>
              </span>
              <p className="text-[#17324D] leading-relaxed">
                {currentStage?.nextInstructionAr || "بعد 30 ثانية انتقل للجولة التالية أو عرض النتائج."}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <span>💡 نصيحة الميسر (TIP):</span>
              </span>
              <p className="text-[#17324D] leading-relaxed">
                {currentStage?.facilitatorTipAr || activity.whyRecommended || "مع المجموعة الكبيرة، اجعل الإجابة جماعية بصوت واحد."}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* HOST MAIN CONTENT STAGE */}
      <main className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center items-center">
        
        {/* 25 — LOBBY VIEW */}
        {room.status === "LOBBY" && (
          <div className="w-full max-w-3xl bg-white rounded-2xl p-6 sm:p-10 border border-[#E2EEF8] shadow-xs relative overflow-hidden animate-scale-in">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* 26 — QR Visual Design */}
              <div className="md:col-span-5 text-center p-6 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8] space-y-3">
                <span className="text-xs font-bold text-[#2F8FD8] block">
                  امسح الرمز للانضمام فوراً
                </span>

                <div className="flex justify-center py-2">
                  <div className="p-3 bg-white rounded-xl border border-[#E2EEF8] shadow-2xs">
                    <QRCodeView text={effectiveJoinUrl} size={180} />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E2EEF8]">
                  <div className="text-xs text-[#60788C] font-bold">رمز الغرفة:</div>
                  <div className="text-3xl font-black font-mono tracking-widest text-[#17324D] mt-0.5">
                    {roomCode}
                  </div>
                </div>
              </div>

              {/* Lobby Details & Player List */}
              <div className="md:col-span-7 space-y-6 text-right">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#17324D]">
                    {activity.titleAr}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#60788C] mt-1.5 leading-relaxed">
                    {activity.descriptionAr}
                  </p>
                </div>

                {/* Participant Count and List */}
                <div className="pt-4 border-t border-[#E2EEF8]">
                  <div className="flex items-center justify-between text-xs text-[#60788C] font-bold mb-3">
                    <span className="flex items-center gap-1.5 text-[#17324D]">
                      <Users className="w-4 h-4 text-[#2F8FD8]" />
                      <span>المشاركون ({room.players.length}):</span>
                    </span>
                    {room.players.length === 0 ? (
                      <span className="text-[#60788C] animate-pulse">في انتظار الانضمام...</span>
                    ) : (
                      <span className="text-emerald-600 font-bold">جاهزون!</span>
                    )}
                  </div>

                  {room.players.length > 0 ? (
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                      {room.players.map((p) => (
                        <div
                          key={p.id}
                          className="px-3 py-1.5 rounded-lg bg-[#F4F9FD] border border-[#E2EEF8] flex items-center gap-2 text-xs font-bold text-[#17324D] animate-scale-in"
                        >
                          <span>{p.avatar}</span>
                          <span>{p.nickname}</span>
                          <button
                            onClick={() => roomManager.removePlayer(roomCode, p.id)}
                            title="إزالة"
                            className="text-[#60788C] hover:text-red-500 text-xs mr-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#F4F9FD] border border-dashed border-[#C9ECFF] text-center text-xs text-[#60788C]">
                      امسح الرمز أو ادخل عبر <span className="font-mono text-[#2F8FD8] font-bold">/join</span> برمز الغرفة {roomCode}
                    </div>
                  )}
                </div>

                {/* Dominant Primary Action Button: ابدأ */}
                <div className="pt-2">
                  <button
                    onClick={handleStartCountdown}
                    className="w-full bg-[#2F8FD8] hover:bg-[#1F7EC7] active:scale-98 transition-all py-3.5 rounded-xl text-white font-black text-base flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>ابدأ (Space)</span>
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* 2. DYNAMIC COUNTDOWN VIEW (3 -> 2 -> 1) */}
        {room.status === "COUNTDOWN" && (
          <div className="text-center animate-scale-in py-16">
            <div className="text-lg font-bold text-[#2F8FD8] mb-4 font-arabic">استعدوا جميعاً...</div>
            <div
              key={`countdown-${countdownVal}`}
              className="text-8xl sm:text-9xl font-black text-[#17324D] font-mono animate-scale-in select-none"
            >
              {countdownVal}
            </div>
            <div className="text-xs text-[#60788C] mt-6 font-medium">انظر للشاشة وأجب فوراً!</div>
          </div>
        )}

        {/* 23 — ACTIVE PLAYING ROUND (Presentation Mode) */}
        {room.status === "PLAYING_ROUND" && currentRound && (
          <div key={`host-round-view-${currentRound.id}`} className="w-full max-w-3xl space-y-6 animate-scale-in">
            
            {/* Header info bar */}
            <div className="flex items-center justify-between bg-white px-6 py-3 rounded-xl border border-[#E2EEF8] shadow-2xs">
              <span className="px-3 py-1 rounded-md bg-[#EAF7FF] text-[#2F8FD8] text-xs font-bold">
                الجولة {room.currentRoundIndex + 1} من {activity.rounds?.length || 1}
              </span>

              {/* Timer */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2F8FD8]" />
                <span className={`text-xl font-mono font-black ${
                  secondsLeft <= 4 ? "text-red-500 animate-pulse" : "text-[#17324D]"
                }`}>
                  00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
                </span>
              </div>

              {/* Live Answered Count */}
              <span className="text-xs font-bold text-[#60788C]">
                أجاب: <span className="text-[#2F8FD8] font-mono font-bold">{roundAnswers.length}</span> من <span className="font-mono">{room.players.length}</span>
              </span>
            </div>

            {/* Prompt Stage Card */}
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#E2EEF8] shadow-xs text-center space-y-3">
              <h2 className="text-2xl sm:text-4xl font-black text-[#17324D] leading-snug">
                {currentRound.promptAr}
              </h2>
              {currentRound.subtitleAr && (
                <p className="text-xs sm:text-sm text-[#60788C]">
                  {currentRound.subtitleAr}
                </p>
              )}

              {/* Options Showcase */}
              {currentRound.optionsAr && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  {currentRound.optionsAr.map((opt, optIdx) => {
                    const optAnswers = roundAnswers.filter((a) => a.answer === optIdx);
                    return (
                      <div
                        key={`${currentRound.id}-opt-${optIdx}`}
                        className="p-5 rounded-xl border border-[#E2EEF8] bg-[#F4F9FD] text-right transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base font-bold text-[#17324D]">
                            {opt}
                          </span>
                          <span className="text-xs font-mono font-bold text-[#2F8FD8] bg-white px-2 py-0.5 rounded-md border border-[#E2EEF8]">
                            {optAnswers.length} صوت
                          </span>
                        </div>

                        {/* Avatars */}
                        <div className="flex flex-wrap gap-1 mt-2 min-h-[24px]">
                          {optAnswers.map((ans) => (
                            <span
                              key={ans.playerId}
                              className="text-xs px-2 py-0.5 rounded-md bg-white border border-[#E2EEF8] text-[#17324D] shadow-2xs"
                            >
                              {ans.playerNickname}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Word Cloud Mode */}
              {activity.type === "WORD_CLOUD" && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2 min-h-[120px] p-6 rounded-xl bg-[#F4F9FD] border border-[#E2EEF8]">
                  {roundAnswers.map((ans, aIdx) => (
                    <span
                      key={aIdx}
                      className="px-3.5 py-1.5 rounded-xl font-bold bg-[#EAF7FF] border border-[#C9ECFF] text-[#2F8FD8] text-sm sm:text-base shadow-2xs animate-scale-in"
                    >
                      {ans.answer}
                    </span>
                  ))}
                  {roundAnswers.length === 0 && (
                    <div className="text-xs text-[#60788C]">في انتظار إرسال الكلمات من المشاركين...</div>
                  )}
                </div>
              )}

              {/* Facilitation Mode Guide if applicable */}
              {!activity.requiresPhone && (
                <div className="mt-6 p-4 rounded-xl bg-[#F4F9FD] border border-[#E2EEF8] text-right space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#60788C]">توجيه الميسر:</span>
                    <button
                      onClick={() => setShowSecretWord(!showSecretWord)}
                      className="px-3 py-1 rounded-lg border border-[#E2EEF8] bg-white text-xs font-bold text-[#17324D] flex items-center gap-1.5 shadow-2xs"
                    >
                      {showSecretWord ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-[#2F8FD8]" />}
                      <span>{showSecretWord ? "إخفاء الكلمة" : "كشف الكلمة"}</span>
                    </button>
                  </div>

                  {showSecretWord && currentRound.secretWordAr && (
                    <div className="p-3 rounded-lg bg-[#EAF7FF] border border-[#C9ECFF] text-center">
                      <span className="text-xl font-black text-[#2F8FD8]">
                        {currentRound.secretWordAr}
                      </span>
                    </div>
                  )}

                  {/* Facilitation Stopwatch */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E2EEF8]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#60788C]">مؤقت:</span>
                      <span className="text-base font-mono font-bold text-[#17324D]">
                        {stopwatchTime} ثانية
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setStopwatchRunning(!stopwatchRunning)}
                        className="px-3 py-1 rounded-lg bg-[#2F8FD8] text-white text-xs font-bold hover:bg-[#1F7EC7]"
                      >
                        {stopwatchRunning ? "إيقاف" : "بدء 60ث"}
                      </button>
                      <button
                        onClick={() => {
                          setStopwatchRunning(false);
                          setStopwatchTime(60);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#E2EEF8] text-[#60788C] text-xs font-bold"
                      >
                        تصفير
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Skip / Show Results */}
            <div className="flex justify-end">
              <button
                onClick={() => roomManager.showRoundResults(roomCode)}
                className="px-4 py-2 rounded-xl bg-white border border-[#E2EEF8] text-xs font-bold text-[#60788C] hover:text-[#17324D] hover:bg-[#F4F9FD] shadow-2xs"
              >
                إنهاء الجولة وإظهار النتائج الآن ⏭️
              </button>
            </div>
          </div>
        )}

        {/* 27 — ROUND RESULTS VIEW */}
        {room.status === "ROUND_RESULTS" && currentRound && (
          <div className="w-full max-w-3xl bg-white rounded-2xl p-6 sm:p-8 border border-[#E2EEF8] shadow-xs space-y-6 animate-scale-in">
            <div className="text-center">
              <span className="text-xs font-bold text-[#2F8FD8] uppercase tracking-wider">
                نتائج الجولة
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#17324D] mt-1">
                {currentRound.promptAr}
              </h3>
            </div>

            {/* Live Chart */}
            {currentRound.optionsAr && (
              <div className="space-y-3 pt-2">
                {currentRound.optionsAr.map((opt, optIdx) => {
                  const votes = roundAnswers.filter((a) => a.answer === optIdx).length;
                  const total = room.players.length || 1;
                  const percent = Math.round((votes / total) * 100);
                  const isCorrect = currentRound.correctAnswer !== undefined && currentRound.correctAnswer === optIdx;

                  return (
                    <div key={`${currentRound.id}-res-${optIdx}`} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#17324D] flex items-center gap-1.5">
                          {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          <span>{opt}</span>
                        </span>
                        <span className="text-[#2F8FD8] font-mono">{percent}% ({votes} صوت)</span>
                      </div>
                      <div className="h-2.5 w-full bg-[#F4F9FD] rounded-full overflow-hidden border border-[#E2EEF8]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCorrect ? "bg-emerald-500" : "bg-[#2F8FD8]"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Next Round Button: Dominant CTA */}
            <div className="pt-4 flex items-center justify-between border-t border-[#E2EEF8]">
              <span className="text-xs text-[#60788C]">
                الجولة القادمة: {room.currentRoundIndex + 2} من {activity.rounds?.length || 1}
              </span>
              <button
                onClick={handleNextRoundOrFinish}
                className="bg-[#2F8FD8] hover:bg-[#1F7EC7] active:scale-98 transition-all px-6 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <span>{room.currentRoundIndex + 1 < (activity.rounds?.length || 1) ? "الجولة التالية (Space)" : "عرض النتيجة النهائية 🏆"}</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* 29 — FINAL CELEBRATION & NEXT STAGE JOURNEY */}
        {room.status === "FINAL_CELEBRATION" && (
          <div className="w-full max-w-2xl bg-white rounded-2xl p-8 sm:p-10 text-center border border-[#E2EEF8] shadow-xs relative overflow-hidden animate-scale-in space-y-6">
            <div className="w-12 h-12 rounded-xl bg-[#EAF7FF] text-[#2F8FD8] flex items-center justify-center mx-auto text-2xl">
              ✨
            </div>

            {/* Check if Session has next stage or if all session finished */}
            {room.session && nextStage ? (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-[#2F8FD8] uppercase tracking-wider block">
                    انتهى النشاط الحالي بنجاح! 👏
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#17324D] mt-1">
                    المجموعة الآن جاهزة للخطوة التالية.
                  </h2>
                </div>

                {/* Next Stage Card */}
                <div className="p-5 rounded-2xl bg-[#F4F9FD] border border-[#C9ECFF] text-right space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#60788C]">
                    <span className="font-bold text-[#2F8FD8] bg-white px-2 py-0.5 rounded border border-[#E2EEF8]">
                      المرحلة {(room.currentSessionStageIndex || 0) + 2} من {room.session.stages.length}
                    </span>
                    <span className="font-mono">{nextStage.durationMinutes} دقائق</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#17324D]">
                    {nextStage.titleAr}
                  </h3>
                  <p className="text-xs text-[#60788C] leading-relaxed">
                    {nextStage.subtitleAr || nextStage.activity.descriptionAr}
                  </p>
                  <div className="text-[11px] text-[#17324D] bg-white p-2 rounded-lg border border-[#E2EEF8]">
                    <strong>💡 توجيه الميسر: </strong>
                    <span>{nextStage.facilitatorTipAr}</span>
                  </div>
                </div>

                {/* Transition Action CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => roomManager.nextSessionStage(roomCode)}
                    className="w-full sm:w-auto bg-[#2F8FD8] hover:bg-[#1F7EC7] active:scale-98 transition-all px-8 py-3.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>الانتقال للنشاط التالي ({nextStage.titleAr})</span>
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            ) : room.session && !nextStage ? (
              /* Complete Full Session Celebration & Report Action */
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-[#17324D]">
                  انتهت الجلسة بنجاح ✨
                </h2>
                <p className="text-xs sm:text-sm text-[#60788C]">
                  أنجزتم جميع محطات جلسة &quot;{room.session.titleAr}&quot; بتفاعل ومشاركة ممتازة!
                </p>

                {/* Session Stats */}
                <div className="grid grid-cols-3 gap-3 my-4 py-3 border-y border-[#E2EEF8] text-center">
                  <div className="p-3 rounded-xl bg-[#F4F9FD]">
                    <span className="text-lg font-bold text-[#17324D] font-mono">{room.players.length}</span>
                    <span className="text-[11px] text-[#60788C] block mt-0.5">مشاركاً</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F4F9FD]">
                    <span className="text-lg font-bold text-[#2F8FD8] font-mono">
                      {room.session.stages.length}
                    </span>
                    <span className="text-[11px] text-[#60788C] block mt-0.5">أنشطة مكتملة</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F4F9FD]">
                    <span className="text-lg font-bold text-emerald-600 font-mono">100%</span>
                    <span className="text-[11px] text-[#60788C] block mt-0.5">إنجاز الخطة</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      const rep = roomManager.finishSession(roomCode);
                      router.push(`/sessions/report/${rep.id}`);
                    }}
                    className="w-full sm:w-auto bg-[#2F8FD8] hover:bg-[#1F7EC7] active:scale-98 transition-all px-6 py-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
                  >
                    <FileText className="w-4 h-4" />
                    <span>عرض تقرير الجلسة الرسمي 📄</span>
                  </button>

                  <Link
                    href="/sessions"
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#E2EEF8] bg-white hover:bg-[#F4F9FD] text-[#60788C] hover:text-[#17324D] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>جلسة جديدة</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Non-session single activity completion with Smart Next Recommendation */
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-[#17324D]">
                  المجموعة الآن جاهزة للخطوة التالية.
                </h2>
                <p className="text-xs sm:text-sm text-[#60788C]">
                  طاقة المجموعة الآن مرتفعة ومنسجمة بعد إنهاء &quot;{activity.titleAr}&quot;.
                </p>

                {/* Smart Recommendation Card */}
                <div className="p-5 rounded-2xl bg-[#F4F9FD] border border-[#C9ECFF] text-right space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2F8FD8] bg-white px-2.5 py-0.5 rounded border border-[#E2EEF8]">
                      ⚡ نقترح الآن: {smartRecommendation.titleAr}
                    </span>
                    <span className="font-mono text-[#60788C]">{smartRecommendation.activity.duration} دقائق</span>
                  </div>
                  <h4 className="text-base font-bold text-[#17324D]">
                    {smartRecommendation.activity.titleAr}
                  </h4>
                  <p className="text-xs text-[#60788C] leading-relaxed">
                    {smartRecommendation.reasonAr}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      roomManager.resetRoom(roomCode);
                      window.location.href = `/host/${roomCode}?act=${smartRecommendation.activity.slug}`;
                    }}
                    className="w-full sm:w-auto bg-[#2F8FD8] hover:bg-[#1F7EC7] active:scale-98 transition-all px-6 py-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>بدء النشاط المقترح ({smartRecommendation.activity.titleAr})</span>
                  </button>

                  <button
                    onClick={handleLaunchAnotherSpark}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#E2EEF8] bg-white hover:bg-[#F4F9FD] text-[#60788C] hover:text-[#17324D] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Dice5 className="w-4 h-4" />
                    <span>نشاط عشوائي</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* TIME RESCUE MODAL */}
      {timeRescueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E2EEF8] shadow-lg animate-scale-in space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Hourglass className="w-3.5 h-3.5" />
                <span>اختصار الوقت الذكي (Time Rescue)</span>
              </span>
              <button
                onClick={() => setTimeRescueModalOpen(false)}
                className="text-[#60788C] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#17324D]">
                كم من الوقت بقي معك بالضبط؟
              </h3>
              <p className="text-xs text-[#60788C] mt-1 leading-relaxed">
                سيقوم محرك SPARK بضغط الجولات والأسئلة تلقائياً دون إفساد تجربة المجموعة.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <button
                onClick={() => {
                  roomManager.applyTimeRescue(roomCode, 3);
                  setTimeRescueModalOpen(false);
                }}
                className="p-3 rounded-xl border border-[#E2EEF8] hover:border-[#2F8FD8] hover:bg-[#EAF7FF] text-center transition-all group"
              >
                <span className="text-lg font-black font-mono text-[#17324D] group-hover:text-[#2F8FD8] block">3 دقائق</span>
                <span className="text-[10px] text-[#60788C] block mt-0.5">جولتان سريعتا</span>
              </button>

              <button
                onClick={() => {
                  roomManager.applyTimeRescue(roomCode, 8);
                  setTimeRescueModalOpen(false);
                }}
                className="p-3 rounded-xl border border-[#E2EEF8] hover:border-[#2F8FD8] hover:bg-[#EAF7FF] text-center transition-all group"
              >
                <span className="text-lg font-black font-mono text-[#17324D] group-hover:text-[#2F8FD8] block">8 دقائق</span>
                <span className="text-[10px] text-[#60788C] block mt-0.5">3 جولات متوازنة</span>
              </button>

              <button
                onClick={() => {
                  roomManager.applyTimeRescue(roomCode, 12);
                  setTimeRescueModalOpen(false);
                }}
                className="p-3 rounded-xl border border-[#E2EEF8] hover:border-[#2F8FD8] hover:bg-[#EAF7FF] text-center transition-all group"
              >
                <span className="text-lg font-black font-mono text-[#17324D] group-hover:text-[#2F8FD8] block">12 دقيقة</span>
                <span className="text-[10px] text-[#60788C] block mt-0.5">تقليص طفيف</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESCUE INTERVENTION MODAL */}
      {rescueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#C9ECFF] shadow-lg animate-scale-in space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full flex items-center gap-1.5">
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>تدخل إنقاذ طاقة فوري (Rescue Mode)</span>
              </span>
              <button
                onClick={() => setRescueModalOpen(false)}
                className="text-[#60788C] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-[#17324D]">
                القاعة تشعر بالفتور؟ SPARK يتدخل بنشاط حركي!
              </h3>
              <p className="text-xs text-[#60788C] mt-1 leading-relaxed">
                {rescueIntervention.reasonAr}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F9FD] border border-[#E2EEF8] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#17324D]">{rescueIntervention.titleAr}</span>
                <span className="text-xs font-bold text-[#2F8FD8] bg-[#EAF7FF] px-2 py-0.5 rounded">
                  {rescueIntervention.durationMinutes} دقائق • بدون تحضير
                </span>
              </div>
              <p className="text-xs text-[#60788C]">{rescueIntervention.taglineAr}</p>
              <div className="text-[11px] text-[#17324D] bg-white p-2 rounded border border-[#E2EEF8]">
                <strong>💡 نصيحة الميسر: </strong>
                <span>{rescueIntervention.facilitatorTipAr}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setRescueModalOpen(false);
                  roomManager.applyRescueActivity(roomCode, rescueIntervention.activity.slug);
                }}
                className="flex-1 bg-[#2F8FD8] hover:bg-[#1F7EC7] text-white font-bold text-xs py-3 rounded-xl shadow-xs text-center"
              >
                ابدأ نشاط الإنقاذ الآن ⚡
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
