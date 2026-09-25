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
    }, 1000);
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
        return [...prev, newAnswer];
      });
    });
  };

  const showResults = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (cancelSimulationRef.current) cancelSimulationRef.current();
    setGameState("RESULTS");
    sounds.playSuccess();
  };

  const nextRoundOrFinish = () => {
    const nextIdx = currentRoundIndex + 1;
    const totalRounds = activity.rounds?.length || 1;
    if (nextIdx < totalRounds) {
      startRound(nextIdx);
    } else {
      setGameState("FINAL");
      sounds.playCelebration();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#2F8FD8", "#78C7F5", "#BAE6FD"],
        });
      } catch (e) {}
    }
  };

  const currentRound = activity.rounds?.[currentRoundIndex];

  return (
    <div className="min-h-screen bg-[#F4F9FD] text-[#17324D] flex flex-col font-arabic select-none">
      {/* Top Demo Navigation Bar */}
      <header className="bg-white border-b border-[#E2EEF8] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-[#60788C] hover:text-[#17324D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>

          <div className="h-4 w-px bg-[#E2EEF8]" />

          {/* Activity Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#60788C] font-bold hidden sm:inline">جرّب نشاطاً:</span>
            <select
              value={selectedSlug}
              onChange={(e) => {
                setSelectedSlug(e.target.value);
                resetLobby(e.target.value);
              }}
              className="bg-[#F4F9FD] border border-[#E2EEF8] rounded-xl px-3 py-1.5 text-xs font-bold text-[#17324D] focus:outline-none focus:border-[#2F8FD8]"
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF7FF] text-[#2F8FD8]">
            <span className="w-2 h-2 rounded-full bg-[#2F8FD8] animate-pulse" />
            <span>محاكاة حيّة: 8 مشاركين</span>
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => resetLobby()}
            title="إعادة تشغيل المحاكاة (R)"
            className="p-2 rounded-xl bg-[#F4F9FD] border border-[#E2EEF8] hover:bg-[#EAF7FF] text-[#60788C] hover:text-[#17324D] text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">إعادة</span>
          </button>

          <button
            onClick={toggleSound}
            title="كتم/تشغيل الصوت (M)"
            className="p-2 rounded-xl bg-[#F4F9FD] border border-[#E2EEF8] hover:bg-[#EAF7FF] text-[#60788C] hover:text-[#17324D] transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#2F8FD8]" />}
          </button>
        </div>
      </header>

      {/* MAIN DEMO STAGE */}
      <main className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center items-center p-4 sm:p-8">
        
        {/* 1. LOBBY STATE */}
        {gameState === "LOBBY" && (
          <div className="w-full max-w-3xl bg-white rounded-3xl p-8 sm:p-12 text-center border border-[#E2EEF8] shadow-xs relative overflow-hidden animate-scale-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF7FF] text-[#2F8FD8] text-xs font-bold mb-4">
              <span>⚡</span>
              <span>غرفة المحاكاة الذكية</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#17324D] font-arabic">
              {activity.titleAr}
            </h2>
            <p className="text-sm text-[#60788C] mt-2 max-w-lg mx-auto leading-relaxed">
              {activity.descriptionAr}
            </p>

            {/* Participants Grid in Lobby */}
            <div className="my-8 pt-6 border-t border-[#E2EEF8]">
              <div className="flex items-center justify-between text-xs text-[#60788C] font-bold mb-4 px-2">
                <span>المشاركون المنضمون ({players.length}):</span>
                <span className="text-emerald-600 font-bold">جاهزون للإطلاق ✨</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8] flex items-center gap-3 animate-scale-in"
                  >
                    <span className="text-2xl">{p.avatar}</span>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#17324D] truncate">{p.nickname}</div>
                      <div className="text-[10px] text-emerald-600 font-medium">متصل الآن</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startCountdown}
              className="bg-[#2F8FD8] hover:bg-[#1F7EC7] active:scale-98 transition-all px-10 py-4 rounded-2xl text-white font-black text-lg flex items-center gap-3 mx-auto shadow-xs"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>ابدأ التجربة الآن (Space)</span>
            </button>
            <div className="text-[11px] text-[#60788C] mt-3">أو اضغط زر المسافة (Space) في لوحة المفاتيح</div>
          </div>
        )}

        {/* 2. COUNTDOWN STATE */}
        {gameState === "COUNTDOWN" && (
          <div className="text-center animate-scale-in py-16">
            <div className="text-xl font-bold text-[#2F8FD8] mb-2 font-arabic">جاهزين؟</div>
            <div
              key={`demo-cd-${countdownNum}`}
              className="text-8xl sm:text-9xl font-black text-[#17324D] font-mono animate-scale-in"
            >
              {countdownNum}
            </div>
            <div className="text-sm text-[#60788C] mt-4">انتبه للشاشة...</div>
          </div>
        )}

        {/* 3. ACTIVE ROUND STATE */}
        {gameState === "ROUND" && currentRound && (
          <div className="w-full max-w-4xl space-y-6 animate-scale-in">
            
            {/* Round Header & Timer */}
            <div className="flex items-center justify-between bg-white px-6 py-3.5 rounded-2xl border border-[#E2EEF8] shadow-xs">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-xl bg-[#EAF7FF] text-[#2F8FD8] text-xs font-bold">
                  جولة {currentRoundIndex + 1} من {activity.rounds?.length || 1}
                </span>
                <span className="text-xs text-[#17324D] font-bold hidden sm:inline">
                  {activity.titleAr}
                </span>
              </div>

              {/* Huge Timer */}
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${timeLeft <= 4 ? "text-rose-500 animate-pulse" : "text-[#2F8FD8]"}`} />
                <span className={`text-2xl font-black font-mono ${timeLeft <= 4 ? "text-rose-500" : "text-[#17324D]"}`}>
                  00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </span>
              </div>

              {/* Answers submitted count */}
              <div className="text-xs font-bold text-[#60788C]">
                أجاب: <span className="text-[#2F8FD8] font-mono text-sm">{answers.length}</span> / {players.length}
              </div>
            </div>

            {/* The Question Prompt Card */}
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-[#E2EEF8] shadow-xs relative">
              <h3 className="text-2xl sm:text-4xl font-black text-[#17324D] font-arabic leading-snug">
                {currentRound.promptAr}
              </h3>
              {currentRound.subtitleAr && (
                <p className="text-sm sm:text-base text-[#60788C] mt-2 font-medium">
                  {currentRound.subtitleAr}
                </p>
              )}

              {/* Options Showcase */}
              {currentRound.optionsAr && currentRound.optionsAr.length > 0 && (
                <div className="grid gap-4 mt-8 grid-cols-1 sm:grid-cols-2">
                  {currentRound.optionsAr.map((opt, optIdx) => {
                    const optAnswers = answers.filter((a) => a.answer === optIdx);
                    return (
                      <div
                        key={optIdx}
                        className="p-6 rounded-2xl border border-[#E2EEF8] bg-[#F4F9FD] text-right transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base sm:text-lg font-bold text-[#17324D] font-arabic">
                            {opt}
                          </span>
                          <span className="text-xs font-mono font-bold text-[#2F8FD8] bg-white px-2.5 py-0.5 rounded-lg border border-[#E2EEF8]">
                            {optAnswers.length} صوت
                          </span>
                        </div>

                        {/* Avatars of participants who chose this option */}
                        <div className="flex flex-wrap gap-1 mt-3 min-h-[28px]">
                          {optAnswers.map((ans) => (
                            <span
                              key={ans.playerId}
                              className="text-xs px-2.5 py-0.5 rounded-full bg-white border border-[#E2EEF8] text-[#17324D] shadow-2xs"
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
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 min-h-[140px] p-6 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8]">
                  {answers.map((ans, aIdx) => (
                    <span
                      key={aIdx}
                      className="px-4 py-2 rounded-2xl font-bold border border-[#BAE6FD] bg-[#EAF7FF] text-[#17324D] animate-scale-in text-sm sm:text-lg"
                    >
                      {ans.answer}
                    </span>
                  ))}
                  {answers.length === 0 && (
                    <div className="text-sm text-[#60788C]">في انتظار إرسال الكلمات من المشاركين...</div>
                  )}
                </div>
              )}
            </div>

            {/* Skip / Show Results Host Trigger */}
            <div className="flex justify-end">
              <button
                onClick={showResults}
                className="px-4 py-2 rounded-xl bg-white border border-[#E2EEF8] text-xs font-bold text-[#60788C] hover:text-[#17324D] hover:bg-[#F4F9FD] shadow-xs"
              >
                إنهاء الجولة وعرض النتائج ⏭️
              </button>
            </div>
          </div>
        )}

        {/* 4. ROUND RESULTS STATE */}
        {gameState === "RESULTS" && currentRound && (
          <div className="w-full max-w-3xl bg-white rounded-3xl p-8 sm:p-10 border border-[#E2EEF8] shadow-xs space-y-6 animate-scale-in">
            <div className="text-center">
              <span className="text-xs font-bold text-[#2F8FD8] uppercase tracking-wider">
                نتائج الجولة الحالية
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#17324D] font-arabic mt-1">
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
                        <span className="text-[#17324D] flex items-center gap-1.5">
                          {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          <span>{opt}</span>
                        </span>
                        <span className="text-[#2F8FD8] font-mono">{percent}% ({votes} صوت)</span>
                      </div>
                      <div className="h-3 w-full bg-[#F4F9FD] rounded-full overflow-hidden border border-[#E2EEF8]">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
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

            {/* Word Cloud Aggregation Display */}
            {activity.type === "WORD_CLOUD" && (
              <div className="flex flex-wrap items-center justify-center gap-3 p-6 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8]">
                {answers.map((ans, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-2xl bg-[#EAF7FF] border border-[#BAE6FD] text-[#17324D] font-bold text-base"
                  >
                    {ans.answer}
                  </span>
                ))}
              </div>
            )}

            {/* Next Round CTA */}
            <div className="pt-4 flex items-center justify-between border-t border-[#E2EEF8]">
              <span className="text-xs text-[#60788C]">
                الجولة القادمة: {currentRoundIndex + 2} من {activity.rounds?.length || 1}
              </span>
              <button
                onClick={nextRoundOrFinish}
                className="bg-[#2F8FD8] hover:bg-[#1F7EC7] active:scale-98 transition-all px-6 py-3 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-xs"
              >
                <span>{currentRoundIndex + 1 < (activity.rounds?.length || 1) ? "الجولة التالية (Space)" : "عرض النتيجة النهائية 🏆"}</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* 5. FINAL CELEBRATION STATE */}
        {gameState === "FINAL" && (
          <div className="w-full max-w-2xl bg-white rounded-3xl p-8 sm:p-12 text-center border border-[#E2EEF8] shadow-xs relative overflow-hidden animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF7FF] border border-[#BAE6FD] text-[#2F8FD8] flex items-center justify-center mx-auto mb-4 text-3xl">
              ✨
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#17324D] font-arabic">
              انتهت الشرارة ✨
            </h2>
            <p className="text-sm text-[#60788C] mt-2">
              أنجزتم النشاط معاً وارتفعت طاقة المجموعة.
            </p>

            {/* Session Stats */}
            <div className="grid grid-cols-3 gap-3 my-8 pt-6 border-t border-[#E2EEF8]">
              <div className="p-3.5 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8]">
                <span className="text-xl font-black text-[#17324D] font-mono">{players.length}</span>
                <span className="text-[11px] text-[#60788C] block mt-0.5">مشاركاً</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8]">
                <span className="text-xl font-black text-[#2F8FD8] font-mono">
                  {activity.rounds?.length || 1}
                </span>
                <span className="text-[11px] text-[#60788C] block mt-0.5">جولات مكتملة</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8]">
                <span className="text-xl font-black text-emerald-600 font-mono">100%</span>
                <span className="text-[11px] text-[#60788C] block mt-0.5">نسبة المشاركة</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => resetLobby()}
                className="w-full sm:w-auto bg-[#2F8FD8] hover:bg-[#1F7EC7] active:scale-98 transition-all px-6 py-3.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة النشاط في المحاكاة</span>
              </button>

              <Link
                href="/activities"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#BAE6FD] bg-white hover:bg-[#F4F9FD] text-[#2F8FD8] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
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
