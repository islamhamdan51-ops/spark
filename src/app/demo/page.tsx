"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { 
  Sparkles, Play, RotateCcw, Volume2, VolumeX, Maximize2, 
  ChevronRight, Trophy, Users, Clock, ArrowLeft, CheckCircle2 
} from "lucide-react";
import { ACTIVITIES, getActivityBySlug } from "@/data/activities";
import { Activity, Player, PlayerAnswer } from "@/types";
import { SIMULATED_PLAYERS, simulateRoundAnswers } from "@/lib/demo-engine";
import { sounds } from "@/lib/sound";

export default function DemoPage() {
  const [selectedSlug, setSelectedSlug] = useState<string>("this-or-that");
  const [activity, setActivity] = useState<Activity>(() => getActivityBySlug("this-or-that") || ACTIVITIES[0]);
  
  // Game states: 'LOBBY' | 'COUNTDOWN' | 'ROUND' | 'RESULTS' | 'FINAL'
  const [gameState, setGameState] = useState<"LOBBY" | "COUNTDOWN" | "ROUND" | "RESULTS" | "FINAL">("LOBBY");
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [countdownNum, setCountdownNum] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  
  // Simulated players & answers
  const [players, setPlayers] = useState<Player[]>([]);
  const [answers, setAnswers] = useState<PlayerAnswer[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cancelSimulationRef = useRef<(() => void) | null>(null);

  // Initialize demo lobby with staggered simulated players
  const resetLobby = (actSlug?: string) => {
    const targetSlug = actSlug || selectedSlug;
    const act = getActivityBySlug(targetSlug) || ACTIVITIES[0];
    setActivity(act);
    setGameState("LOBBY");
    setCurrentRoundIndex(0);
    setAnswers([]);
    setPlayers([]);

    if (cancelSimulationRef.current) {
      cancelSimulationRef.current();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Staggered join of 8 simulated players
    SIMULATED_PLAYERS.forEach((sim, idx) => {
      setTimeout(() => {
        setPlayers((prev) => {
          if (prev.some((p) => p.nickname === sim.nickname)) return prev;
          sounds.playJoin();
          return [
            ...prev,
            {
              id: `demo-${idx + 1}`,
              nickname: sim.nickname,
              avatar: sim.avatar,
              joinedAt: Date.now(),
              score: 0,
              isSimulated: true,
            },
          ];
        });
      }, (idx + 1) * 200);
    });
  };

  useEffect(() => {
    setIsMuted(sounds.getMuted());
    resetLobby("this-or-that");
    return () => {
      if (cancelSimulationRef.current) cancelSimulationRef.current();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (gameState === "LOBBY") startCountdown();
        else if (gameState === "RESULTS") nextRoundOrFinish();
      } else if (e.code === "KeyM") {
        toggleSound();
      } else if (e.code === "KeyR") {
        resetLobby();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, currentRoundIndex, activity]);

  const toggleSound = () => {
    const m = sounds.toggleMute();
    setIsMuted(m);
  };

  const startCountdown = () => {
    setGameState("COUNTDOWN");
    setCountdownNum(3);
    sounds.playTick(false);

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdownNum(count);
        sounds.playTick(false);
      } else {
        clearInterval(interval);
        sounds.playTick(true);
        startRound(0);
      }
    }, 900);
  };

  const startRound = (roundIdx: number) => {
    const currentRound = activity.rounds?.[roundIdx] || {
      id: "r-1",
      roundNumber: 1,
      promptAr: activity.titleAr,
      timeLimit: 15,
      optionsAr: ["الخيار الأول", "الخيار الثاني"],
    };

    setGameState("ROUND");
    setCurrentRoundIndex(roundIdx);
    setAnswers([]);
    const limit = currentRound.timeLimit || 15;
    setTimeLeft(limit);
    sounds.playRoundStart();

    // Start countdown timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          showResults();
          return 0;
        }
        if (prev <= 4) {
          sounds.playTick(false);
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate answers from all 8 players
    if (cancelSimulationRef.current) cancelSimulationRef.current();
    cancelSimulationRef.current = simulateRoundAnswers(currentRound, players, (newAnswer) => {
      setAnswers((prev) => {
        if (prev.some((a) => a.playerId === newAnswer.playerId)) return prev;
        sounds.playSelect();
        const updated = [...prev, newAnswer];

        // If everyone answered, finish round
        if (updated.length >= players.length) {
          setTimeout(() => {
            showResults();
          }, 600);
        }
        return updated;
      });

      // Update player scores
      if (newAnswer.pointsAwarded && newAnswer.pointsAwarded > 0) {
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === newAnswer.playerId ? { ...p, score: p.score + (newAnswer.pointsAwarded || 0) } : p
          )
        );
      }
    });
  };

  const showResults = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (cancelSimulationRef.current) cancelSimulationRef.current();
    setGameState("RESULTS");
    sounds.playSuccess();
  };

  const nextRoundOrFinish = () => {
    const total = activity.rounds?.length || 1;
    if (currentRoundIndex + 1 < total) {
      startRound(currentRoundIndex + 1);
    } else {
      setGameState("FINAL");
      sounds.playCelebration();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  const currentRound = activity.rounds?.[currentRoundIndex];

  return (
    <div className={`min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col font-arabic ${isFullscreen ? "p-2 sm:p-4 bg-white" : "p-4 sm:p-6"}`}>
      {/* Top Controller Bar */}
      <header className="max-w-6xl mx-auto w-full bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl px-5 py-3 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>

          <div className="h-4 w-px bg-slate-200" />

          {/* Activity Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold hidden sm:inline">جرّب نشاطاً:</span>
            <select
              value={selectedSlug}
              onChange={(e) => {
                setSelectedSlug(e.target.value);
                resetLobby(e.target.value);
              }}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-spark-flame"
            >
              <option value="this-or-that">اختر بسرعة (This or That)</option>
              <option value="quick-quiz">تحدي النباهة السريع (Quiz)</option>
              <option value="word-cloud">سحابة الكلمات (Word Cloud)</option>
              <option value="would-you-rather">ماذا تفضل؟ (Would You Rather)</option>
              <option value="rapid-fire">النار السريعة (Rapid Fire)</option>
              <option value="charades-silent">الشاريدز الصامت (Facilitation)</option>
            </select>
          </div>
        </div>

        {/* Demo Status Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>محاكاة حيّة: 8 مشاركين</span>
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => resetLobby()}
            title="إعادة تشغيل المحاكاة (R)"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">إعادة</span>
          </button>

          <button
            onClick={toggleSound}
            title="كتم/تشغيل الصوت (M)"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-spark-flame" />}
          </button>
        </div>
      </header>

      {/* MAIN DEMO STAGE */}
      <main className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center items-center">
        
        {/* 1. LOBBY STATE */}
        {gameState === "LOBBY" && (
          <div className="w-full max-w-3xl bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-sm relative overflow-hidden animate-scale-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-spark-flame text-xs font-bold mb-4 shadow-2xs">
              <span>⚡</span>
              <span>غرفة المحاكاة الذكية</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-arabic">
              {activity.titleAr}
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
              {activity.descriptionAr}
            </p>

            {/* Participants Grid in Lobby */}
            <div className="my-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-4 px-2">
                <span>المشاركون المنضمون ({players.length}):</span>
                <span className="text-emerald-600 font-bold">جاهزون للإطلاق 🚀</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 animate-scale-in"
                  >
                    <span className="text-2xl">{p.avatar}</span>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900 truncate">{p.nickname}</div>
                      <div className="text-[10px] text-emerald-600 font-medium">متصل الآن</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startCountdown}
              className="bg-spark-flame hover:bg-spark-flame/90 active:scale-98 transition-all px-10 py-4 rounded-2xl text-white font-black text-lg flex items-center gap-3 mx-auto shadow-md shadow-orange-500/25"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>ابدأ التجربة الآن (Space)</span>
            </button>
            <div className="text-[11px] text-slate-400 mt-3">اضغط زر المسافة (Space) في لوحة المفاتيح</div>
          </div>
        )}

        {/* 2. COUNTDOWN STATE */}
        {gameState === "COUNTDOWN" && (
          <div className="text-center animate-scale-in py-16">
            <div className="text-2xl font-bold text-spark-flame mb-2 font-arabic">جاهزين؟</div>
            <div className="text-8xl sm:text-9xl font-black text-slate-900 font-mono animate-bounce-subtle">
              {countdownNum}
            </div>
            <div className="text-sm text-slate-500 mt-4">انتبه للشاشة الرئيسية...</div>
          </div>
        )}

        {/* 3. ACTIVE ROUND STATE */}
        {gameState === "ROUND" && currentRound && (
          <div className="w-full max-w-4xl space-y-6 animate-scale-in">
            
            {/* Round Header & Timer */}
            <div className="flex items-center justify-between bg-white px-6 py-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-xl bg-spark-flame text-white text-xs font-black">
                  جولة {currentRoundIndex + 1} من {activity.rounds?.length || 1}
                </span>
                <span className="text-xs text-slate-700 font-bold hidden sm:inline">
                  {activity.titleAr}
                </span>
              </div>

              {/* Huge Timer */}
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${timeLeft <= 4 ? "text-red-600 animate-ping" : "text-spark-flame"}`} />
                <span className={`text-2xl font-black font-mono ${timeLeft <= 4 ? "text-red-600" : "text-slate-900"}`}>
                  00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </span>
              </div>

              {/* Answers submitted count */}
              <div className="text-xs font-bold text-slate-600">
                أجاب: <span className="text-spark-flame font-mono text-sm">{answers.length}</span> / {players.length}
              </div>
            </div>

            {/* The Question Prompt Card */}
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
              {currentRound.optionsAr && currentRound.optionsAr.length > 0 && (
                <div className={`grid gap-4 mt-8 ${currentRound.optionsAr.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}>
                  {currentRound.optionsAr.map((opt, optIdx) => {
                    const optAnswers = answers.filter((a) => a.answer === optIdx);
                    return (
                      <div
                        key={optIdx}
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

                        {/* Avatars of participants who chose this option */}
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

              {/* Word Cloud Mode in Round */}
              {activity.type === "WORD_CLOUD" && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 min-h-[140px] p-6 rounded-2xl bg-slate-50 border border-slate-200">
                  {answers.map((ans, aIdx) => (
                    <span
                      key={aIdx}
                      className="px-4 py-2 rounded-2xl font-bold border border-orange-200 bg-orange-100 text-orange-900 animate-scale-in text-sm sm:text-lg shadow-xs"
                    >
                      {ans.answer}
                    </span>
                  ))}
                  {answers.length === 0 && (
                    <div className="text-sm text-slate-400">في انتظار إرسال الكلمات من المشاركين...</div>
                  )}
                </div>
              )}
            </div>

            {/* Skip / Show Results Host Trigger */}
            <div className="flex justify-end">
              <button
                onClick={showResults}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
              >
                إنهاء الجولة وإظهار النتائج الآن ⏭️
              </button>
            </div>
          </div>
        )}

        {/* 4. ROUND RESULTS STATE */}
        {gameState === "RESULTS" && currentRound && (
          <div className="w-full max-w-3xl bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6 animate-scale-in">
            <div className="text-center">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                نتائج الجولة الحية
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-arabic mt-1">
                {currentRound.promptAr}
              </h3>
            </div>

            {/* Live Chart breakdown */}
            {currentRound.optionsAr && (
              <div className="space-y-4 pt-4">
                {currentRound.optionsAr.map((opt, optIdx) => {
                  const votes = answers.filter((a) => a.answer === optIdx).length;
                  const percent = players.length > 0 ? Math.round((votes / players.length) * 100) : 0;
                  const isCorrect = currentRound.correctAnswer !== undefined && currentRound.correctAnswer === optIdx;

                  return (
                    <div key={optIdx} className="space-y-1.5">
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

            {/* Word Cloud Aggregation Display */}
            {activity.type === "WORD_CLOUD" && (
              <div className="flex flex-wrap items-center justify-center gap-3 p-6 rounded-2xl bg-slate-50 border border-slate-200">
                {answers.map((ans, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-2xl bg-orange-100 border border-orange-200 text-orange-950 font-bold text-base shadow-2xs"
                  >
                    {ans.answer}
                  </span>
                ))}
              </div>
            )}

            {/* Next Round CTA */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-200">
              <span className="text-xs text-slate-500">
                الجولة القادمة: {currentRoundIndex + 2} من {activity.rounds?.length || 1}
              </span>
              <button
                onClick={nextRoundOrFinish}
                className="bg-spark-flame hover:bg-spark-flame/90 active:scale-98 transition-all px-6 py-3 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-xs"
              >
                <span>{currentRoundIndex + 1 < (activity.rounds?.length || 1) ? "الجولة التالية (Space)" : "عرض النتيجة النهائية 🏆"}</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* 5. FINAL CELEBRATION STATE */}
        {gameState === "FINAL" && (
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

            {/* Session Stats */}
            <div className="grid grid-cols-3 gap-3 my-8 pt-6 border-t border-slate-200">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xl font-black text-slate-900 font-mono">{players.length}</span>
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
                onClick={() => resetLobby()}
                className="w-full sm:w-auto bg-spark-flame hover:bg-spark-flame/90 active:scale-98 transition-all px-6 py-3.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة النشاط في المحاكاة</span>
              </button>

              <Link
                href="/activities"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs"
              >
                <span>اختيار نشاط آخر من المكتبة</span>
              </Link>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
