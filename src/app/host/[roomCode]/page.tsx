"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { 
  Sparkles, Play, Users, Clock, QrCode, Maximize2, Minimize2, 
  Volume2, VolumeX, RotateCcw, ChevronRight, CheckCircle2, 
  Eye, EyeOff, Shield, Trophy, ArrowLeft, Copy, Check, Dice5, Share2
} from "lucide-react";
import { roomManager } from "@/lib/room-store";
import { getActivityBySlug, ACTIVITIES } from "@/data/activities";
import { RoomState, Activity, Player, PlayerAnswer, ActivityRound } from "@/types";
import { QRCodeView } from "@/components/common/QRCodeView";
import { resolveJoinUrl } from "@/lib/get-join-url";
import { sounds } from "@/lib/sound";

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

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stopwatchRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to room manager & resolve real join URL
  useEffect(() => {
    if (!roomCode) return;
    
    // Resolve cross-device join URL (LAN IP or public origin)
    resolveJoinUrl(roomCode).then((url) => {
      setJoinUrl(url);
    });

    const urlAct = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("act") : null;
    const initial = roomManager.getOrCreateRoom(roomCode, urlAct || "this-or-that");
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
          if (prev <= 4) sounds.playTick(false);
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
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center text-slate-800 font-arabic">
        <div className="text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-spark-flame flex items-center justify-center mx-auto mb-3 animate-spin">
            ⚡
          </div>
          <div className="text-lg font-bold">جاري تجهيز الغرفة {roomCode}...</div>
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
    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        sounds.playTick(false);
      } else {
        clearInterval(interval);
        sounds.playTick(true);
        roomManager.launchRound(roomCode, 0);
      }
    }, 900);
  };

  const handleNextRoundOrFinish = () => {
    roomManager.nextRoundOrFinish(roomCode);
    if (room.currentRoundIndex + 1 >= (activity.rounds?.length || 1)) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  const handleReset = () => {
    roomManager.resetRoom(roomCode);
  };

  // Launch another activity with same room & players
  const handleLaunchAnotherSpark = () => {
    const remaining = ACTIVITIES.filter((a) => a.slug !== activity.slug);
    const nextAct = remaining[Math.floor(Math.random() * remaining.length)] || ACTIVITIES[0];
    roomManager.resetRoom(roomCode);
    // Navigate with new activity parameter or update room state
    window.location.href = `/host/${roomCode}`;
  };

  return (
    <div
      className={`min-h-screen ${
        isFullscreen ? "bg-white p-3 sm:p-6" : "bg-[#F8F9FA] p-4 sm:p-6"
      } text-slate-900 flex flex-col font-arabic transition-colors duration-200`}
    >
      {/* Top Host Bar */}
      <header className="max-w-6xl mx-auto w-full bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-5 py-3 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/activities"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>المكتبة</span>
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">النشاط:</span>
            <span className="text-xs font-bold text-slate-800 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/60 text-spark-flame">
              {activity.titleAr}
            </span>
          </div>
        </div>

        {/* Room Code Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold hidden sm:inline">رمز الغرفة:</span>
          <span className="text-base font-black font-mono tracking-widest text-spark-flame bg-orange-50/80 px-3 py-1 rounded-xl border border-orange-200">
            {roomCode}
          </span>
          <button
            onClick={handleCopyLink}
            title="نسخ رابط الانضمام المباشر"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            title="إعادة تهيئة الغرفة (R)"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">إعادة</span>
          </button>

          <button
            onClick={handleToggleSound}
            title="كتم/تشغيل الصوت (M)"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-spark-flame" />}
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="وضع العرض التقديمي للشاشات الكبيرة (F)"
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
              isFullscreen ? "bg-spark-flame text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden md:inline">{isFullscreen ? "تصغير" : "شاشة عرض"}</span>
          </button>
        </div>
      </header>

      {/* HOST MAIN CONTENT STAGE */}
      <main className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center items-center">
        
        {/* 1. LOBBY VIEW */}
        {room.status === "LOBBY" && (
          <div className="w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden animate-scale-in">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Join Info & QR Code */}
              <div className="md:col-span-5 text-center p-6 rounded-2xl bg-[#F8F9FA] border border-slate-200 space-y-4">
                <span className="text-xs font-bold text-spark-flame uppercase tracking-wider block">
                  امسح الكود بكاميرا هاتفك
                </span>

                <div className="flex justify-center py-2">
                  <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-xs">
                    <QRCodeView text={effectiveJoinUrl} size={190} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-500 font-bold">أو تفضل بالدخول إلى:</div>
                  <div className="text-xs font-mono font-bold text-slate-800 bg-white py-1.5 px-3 rounded-lg border border-slate-200 select-all">
                    /join
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="text-xs text-slate-500 font-bold">رمز الدخول:</div>
                  <div className="text-3xl font-black font-mono tracking-widest text-slate-900 mt-0.5">
                    {roomCode}
                  </div>
                </div>
              </div>

              {/* Lobby Details & Player List */}
              <div className="md:col-span-7 space-y-6 text-right">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-spark-flame text-xs font-bold mb-2">
                    <span>⚡</span>
                    <span>غرفة تفاعلية جاهزة للبدء</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-arabic">
                    {activity.titleAr}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {activity.descriptionAr}
                  </p>
                </div>

                {/* Participant Count and List */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-3">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Users className="w-4 h-4 text-spark-flame" />
                      <span>المشاركون في الغرفة ({room.players.length}):</span>
                    </span>
                    {room.players.length === 0 ? (
                      <span className="text-slate-400 animate-pulse">في انتظار مسح الكود أو إدخال الرمز...</span>
                    ) : (
                      <span className="text-emerald-600 font-bold">مستعدون للانطلاق!</span>
                    )}
                  </div>

                  {room.players.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                      {room.players.map((p) => (
                        <div
                          key={p.id}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between animate-scale-in"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-lg">{p.avatar}</span>
                            <span className="text-xs font-bold text-slate-800 truncate">{p.nickname}</span>
                          </div>
                          <button
                            onClick={() => roomManager.removePlayer(roomCode, p.id)}
                            title="إزالة المشارك"
                            className="text-slate-400 hover:text-red-500 text-xs px-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500">
                      امسح كود QR أو شارك الرمز <span className="font-mono text-spark-flame font-bold">{roomCode}</span> للانضمام من أي هاتف محمول!
                    </div>
                  )}
                </div>

                {/* Start Activity Button */}
                <div className="pt-2">
                  <button
                    onClick={handleStartCountdown}
                    className="w-full bg-spark-flame hover:bg-spark-flame/90 active:scale-98 transition-all py-4 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2.5 shadow-md shadow-orange-500/20"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>ابدأ النشاط الآن (Space)</span>
                  </button>
                  <div className="text-center text-[11px] text-slate-400 mt-2">
                    يمكن لأي مشارك متأخر الانضمام تلقائياً حتى بعد انطلاق النشاط.
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* 2. COUNTDOWN VIEW */}
        {room.status === "COUNTDOWN" && (
          <div className="text-center animate-scale-in py-16">
            <div className="text-2xl font-bold text-spark-flame mb-2 font-arabic">استعدوا جميعاً...</div>
            <div className="text-8xl sm:text-9xl font-black text-slate-900 font-mono animate-bounce-subtle">
              3
            </div>
            <div className="text-sm text-slate-500 mt-4">انتبه للشاشة الرئيسية!</div>
          </div>
        )}

        {/* 3. ACTIVE PLAYING ROUND */}
        {room.status === "PLAYING_ROUND" && currentRound && (
          <div key={`host-round-view-${currentRound.id}`} className="w-full max-w-4xl space-y-6 animate-scale-in">
            
            {/* Header info bar */}
            <div className="flex items-center justify-between bg-white px-6 py-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="px-3 py-1 rounded-xl bg-spark-flame text-white text-xs font-black">
                الجولة {room.currentRoundIndex + 1} من {activity.rounds?.length || 1}
              </span>

              {/* Timer */}
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${secondsLeft <= 4 ? "text-red-600 animate-ping" : "text-spark-flame"}`} />
                <span className={`text-2xl font-black font-mono ${secondsLeft <= 4 ? "text-red-600" : "text-slate-900"}`}>
                  00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
                </span>
              </div>

              {/* Live submissions count */}
              <div className="text-xs font-bold text-slate-600">
                إجابات: <span className="text-spark-flame font-mono text-sm">{roundAnswers.length}</span> / {room.players.length}
              </div>
            </div>

            {/* Prompt Card */}
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-sm relative">
              <h3 className="text-2xl sm:text-4xl font-black text-slate-900 font-arabic leading-snug">
                {currentRound.promptAr}
              </h3>
              {currentRound.subtitleAr && (
                <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
                  {currentRound.subtitleAr}
                </p>
              )}

              {/* Options Showcase */}
              {currentRound.optionsAr && (
                <div className={`grid gap-4 mt-8 ${currentRound.optionsAr.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}>
                  {currentRound.optionsAr.map((opt, optIdx) => {
                    const optAnswers = roundAnswers.filter((a) => a.answer === optIdx);
                    return (
                      <div
                        key={`${currentRound.id}-opt-${optIdx}`}
                        className={`p-6 rounded-2xl border text-right transition-all relative overflow-hidden ${
                          optIdx === 0
                            ? "border-orange-200 bg-orange-50/70"
                            : optIdx === 1
                            ? "border-indigo-200 bg-indigo-50/70"
                            : optIdx === 2
                            ? "border-emerald-200 bg-emerald-50/70"
                            : "border-amber-200 bg-amber-50/70"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base sm:text-lg font-bold text-slate-900 font-arabic">
                            {opt}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded-lg border border-slate-200">
                            {optAnswers.length} صوت
                          </span>
                        </div>

                        {/* Avatars */}
                        <div className="flex flex-wrap gap-1 mt-3 min-h-[28px]">
                          {optAnswers.map((ans) => (
                            <span
                              key={ans.playerId}
                              className="text-xs px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 animate-scale-in shadow-2xs"
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
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 min-h-[140px] p-6 rounded-2xl bg-slate-50 border border-slate-200">
                  {roundAnswers.map((ans, aIdx) => (
                    <span
                      key={aIdx}
                      className="px-4 py-2 rounded-2xl font-bold border border-orange-200 bg-orange-100 text-orange-900 animate-scale-in text-sm sm:text-lg shadow-xs"
                    >
                      {ans.answer}
                    </span>
                  ))}
                  {roundAnswers.length === 0 && (
                    <div className="text-sm text-slate-400">في انتظار إرسال الكلمات من المشاركين...</div>
                  )}
                </div>
              )}

              {/* Non-phone Facilitation Mode (Secret Word & Stopwatch) */}
              {!activity.requiresPhone && (
                <div className="mt-8 p-6 rounded-2xl bg-[#F8F9FA] border border-slate-200 text-right space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">توجيه الميسر (Facilitator Guide):</span>
                    <button
                      onClick={() => setShowSecretWord(!showSecretWord)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs"
                    >
                      {showSecretWord ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showSecretWord ? "إخفاء الكلمة السرية" : "كشف الكلمة السرية"}</span>
                    </button>
                  </div>

                  {showSecretWord && currentRound.secretWordAr && (
                    <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-center animate-scale-in">
                      <span className="text-xs text-slate-500 block mb-1">الكلمة السرية للمتطوع فقط:</span>
                      <span className="text-2xl font-black font-arabic text-spark-flame">
                        {currentRound.secretWordAr}
                      </span>
                    </div>
                  )}

                  {/* Facilitation Stopwatch */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">مؤقت التحدي:</span>
                      <span className="text-xl font-mono font-black text-slate-900">
                        {stopwatchTime} ثانية
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setStopwatchRunning(!stopwatchRunning)}
                        className="px-4 py-1.5 rounded-xl bg-spark-flame text-white text-xs font-bold hover:bg-spark-flame/90"
                      >
                        {stopwatchRunning ? "إيقاف المؤقت" : "بدء الـ 60 ثانية"}
                      </button>
                      <button
                        onClick={() => {
                          setStopwatchRunning(false);
                          setStopwatchTime(60);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
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
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
              >
                إنهاء الجولة وإظهار النتائج الآن ⏭️
              </button>
            </div>
          </div>
        )}

        {/* 4. ROUND RESULTS VIEW */}
        {room.status === "ROUND_RESULTS" && currentRound && (
          <div className="w-full max-w-3xl bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6 animate-scale-in">
            <div className="text-center">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                نتائج الجولة الحية
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-arabic mt-1">
                {currentRound.promptAr}
              </h3>
            </div>

            {/* Live Chart */}
            {currentRound.optionsAr && (
              <div className="space-y-4 pt-4">
                {currentRound.optionsAr.map((opt, optIdx) => {
                  const votes = roundAnswers.filter((a) => a.answer === optIdx).length;
                  const total = room.players.length || 1;
                  const percent = Math.round((votes / total) * 100);
                  const isCorrect = currentRound.correctAnswer !== undefined && currentRound.correctAnswer === optIdx;

                  return (
                    <div key={`${currentRound.id}-res-${optIdx}`} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-900 flex items-center gap-1.5">
                          {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          <span>{opt}</span>
                        </span>
                        <span className="text-spark-flame font-mono">{percent}% ({votes} صوت)</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isCorrect ? "bg-emerald-500" : "bg-spark-flame"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Next Round Button */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-200">
              <span className="text-xs text-slate-500">
                الجولة القادمة: {room.currentRoundIndex + 2} من {activity.rounds?.length || 1}
              </span>
              <button
                onClick={handleNextRoundOrFinish}
                className="bg-spark-flame hover:bg-spark-flame/90 active:scale-98 transition-all px-6 py-3 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-xs"
              >
                <span>{room.currentRoundIndex + 1 < (activity.rounds?.length || 1) ? "الجولة التالية (Space)" : "عرض النتيجة النهائية 🏆"}</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* 5. FINAL CELEBRATION VIEW */}
        {room.status === "FINAL_CELEBRATION" && (
          <div className="w-full max-w-2xl bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-sm relative overflow-hidden animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 text-spark-flame flex items-center justify-center mx-auto mb-4 text-3xl shadow-xs">
              🏆
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-arabic">
              انتهت الشرارة بنجاح!
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              أنجزتم النشاط معاً وارتفعت طاقة المجموعة.
            </p>

            {/* Competitive Leaderboard if points exist */}
            {activity.competitive && room.players.some((p) => p.score > 0) && (
              <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-right">
                <span className="text-xs font-bold text-slate-700 mb-3 block">صدارة النقاط:</span>
                <div className="space-y-2">
                  {[...room.players]
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map((p, idx) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs font-bold"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</span>
                          <span>{p.avatar}</span>
                          <span className="text-slate-900">{p.nickname}</span>
                        </div>
                        <span className="text-spark-flame font-mono">{p.score} نقطة</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Session Stats */}
            <div className="grid grid-cols-3 gap-3 my-6 pt-4 border-t border-slate-200">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xl font-black text-slate-900 font-mono">{room.players.length}</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">مشاركاً</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xl font-black text-spark-flame font-mono">
                  {activity.rounds?.length || 1}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">جولات مكتملة</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xl font-black text-emerald-600 font-mono">100%</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">نسبة المشاركة</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleLaunchAnotherSpark}
                className="w-full sm:w-auto bg-spark-flame hover:bg-spark-flame/90 active:scale-98 transition-all px-6 py-3.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20"
              >
                <Dice5 className="w-4 h-4" />
                <span>🎲 شرارة ثانية (نشاط آخر لنفس المجموعة)</span>
              </button>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة النشاط</span>
              </button>

              <Link
                href="/activities"
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs"
              >
                <span>المكتبة</span>
              </Link>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
