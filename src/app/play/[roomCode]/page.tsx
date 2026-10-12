"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { 
  Sparkles, Check, CheckCircle2, Clock, 
  Send, AlertCircle, Smile, ArrowRight 
} from "lucide-react";
import { roomManager } from "@/lib/room-store";
import { getActivityBySlug, ACTIVITIES } from "@/data/activities";
import { RoomState, Activity, Player, PlayerAnswer, ActivityRound } from "@/types";
import { sounds } from "@/lib/sound";

function PlayRoomContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomCode = params?.roomCode as string;
  const urlPlayerId = searchParams.get("playerId");

  const [room, setRoom] = useState<RoomState | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textInput, setTextInput] = useState<string>("");
  const [secondsLeft, setSecondsLeft] = useState<number>(15);
  const [countdownVal, setCountdownVal] = useState<number>(3);
  const answeredRoundsRef = useRef<Map<string, { option?: number; text?: string }>>(new Map());

  useEffect(() => {
    if (!roomCode) return;

    let p: Player | null = null;
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(`spark_player_${roomCode}`);
      if (saved) {
        try {
          p = JSON.parse(saved);
        } catch {}
      }
    }

    if (p) {
      setCurrentPlayer(p);
    } else {
      const fallbackPlayer: Player = {
        id: urlPlayerId || `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        nickname: "مشارك ⚡",
        avatar: "⚡",
        joinedAt: Date.now(),
        score: 0,
      };
      setCurrentPlayer(fallbackPlayer);
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(`spark_player_${roomCode}`, JSON.stringify(fallbackPlayer));
        } catch {}
      }
    }

    // Load existing room locally
    const local = roomManager.getLocalRoom(roomCode);
    if (local) {
      setRoom(local);
      const act = getActivityBySlug(local.activitySlug) || ACTIVITIES[0];
      setActivity(act);
    }

    // Subscribe to updates
    const unsubscribe = roomManager.subscribe(roomCode, (updated) => {
      if (!updated) return;
      setRoom({ ...updated });
      if (updated.activitySlug) {
        const a = getActivityBySlug(updated.activitySlug);
        if (a) setActivity(a);
      }
    });

    return () => unsubscribe();
  }, [roomCode, urlPlayerId]);

  // Synchronized countdown timer (3 -> 2 -> 1)
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

  const fallbackRound: ActivityRound = {
    id: `${activity?.id || "act"}-round-${(room?.currentRoundIndex || 0) + 1}`,
    roundNumber: (room?.currentRoundIndex || 0) + 1,
    promptAr: activity?.descriptionAr || activity?.titleAr || "استعد للجولة",
    subtitleAr: activity?.taglineAr,
    timeLimit: 30,
    optionsAr: ["أنجزت المهمة وتحدثت مع الزميل 👍", "جاهز للجولة التالية 🚀"],
  };
  const rounds = (activity?.rounds && activity.rounds.length > 0) ? activity.rounds : [fallbackRound];
  const currentRound = room?.currentRound || (room && rounds[room.currentRoundIndex]) || rounds[0] || fallbackRound;

  // Composite cache key guaranteeing questions NEVER get stuck or confused across stages and activities
  const roundCacheKey = `${room?.activitySlug || "act"}_stg${room?.currentSessionStageIndex || 0}_r${room?.currentRoundIndex || 0}_${currentRound?.id || ""}`;

  // Accurately check if an answer belongs to the active round
  const isMatchRound = (roundId: string) => {
    if (!roundId || !currentRound) return false;
    return roundId === currentRound.id;
  };

  // Accurately synchronize answering state with local lock + room.answers
  useEffect(() => {
    if (!room || !currentPlayer || !currentRound || room.status !== "PLAYING_ROUND") {
      setHasAnswered(false);
      setSelectedOption(null);
      setTextInput("");
      return;
    }

    const localRecord = answeredRoundsRef.current.get(roundCacheKey);

    // 1. Check if server confirmed our answer for THIS specific round
    const serverAns = room.answers?.find(
      (a) => a.playerId === currentPlayer.id && isMatchRound(a.roundId)
    );

    if (serverAns) {
      setHasAnswered(true);
      if (typeof serverAns.answer === "number") {
        setSelectedOption(serverAns.answer);
      } else if (typeof serverAns.answer === "string") {
        setTextInput(serverAns.answer);
      }
      answeredRoundsRef.current.set(roundCacheKey, {
        option: typeof serverAns.answer === "number" ? serverAns.answer : undefined,
        text: typeof serverAns.answer === "string" ? serverAns.answer : undefined,
      });
      return;
    }

    // 2. If locally locked in this exact round, keep it
    if (localRecord) {
      setHasAnswered(true);
      if (localRecord.option !== undefined) setSelectedOption(localRecord.option);
      if (localRecord.text !== undefined) setTextInput(localRecord.text);
      return;
    }

    // 3. Check sessionStorage in case of page reload during active round
    try {
      const saved = sessionStorage.getItem(`spark_ans_${roomCode}_${roundCacheKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          answeredRoundsRef.current.set(roundCacheKey, parsed);
          setHasAnswered(true);
          if (parsed.option !== undefined) setSelectedOption(parsed.option);
          if (parsed.text !== undefined) setTextInput(parsed.text);
          return;
        }
      }
    } catch {}

    // 4. Otherwise, user has not answered this fresh round yet!
    setHasAnswered(false);
    setSelectedOption(null);
    setTextInput("");
  }, [room?.currentRoundIndex, room?.currentSessionStageIndex, room?.status, room?.answers, currentPlayer?.id, currentRound?.id, roomCode, roundCacheKey]);

  // Synchronized countdown timer based on roundStartTime
  useEffect(() => {
    if (room?.status === "PLAYING_ROUND" && room.roundStartTime) {
      const updateTimer = () => {
        const elapsed = Math.floor((Date.now() - (room.roundStartTime || Date.now())) / 1000);
        const limit = currentRound?.timeLimit || room.roundTimer || 15;
        const remaining = Math.max(0, limit - elapsed);
        setSecondsLeft(remaining);
      };
      updateTimer();
      const interval = setInterval(updateTimer, 500);
      return () => clearInterval(interval);
    } else {
      setSecondsLeft(room?.roundTimer || 15);
    }
  }, [room?.status, room?.roundStartTime, room?.roundTimer, currentRound?.timeLimit]);

  if (!room || !activity) {
    return (
      <div className="min-h-screen bg-[#F4F9FD] flex items-center justify-center text-[#17324D] font-arabic">
        <div className="text-center p-6 bg-white rounded-2xl border border-[#E2EEF8] shadow-xs space-y-3">
          <div className="w-8 h-8 rounded-xl bg-[#EAF7FF] text-[#2F8FD8] flex items-center justify-center mx-auto animate-spin text-lg">
            ⚡
          </div>
          <div className="text-sm font-bold">جاري الاتصال بالغرفة {roomCode}...</div>
        </div>
      </div>
    );
  }

  const handleSubmitChoice = (optionIndex: number) => {
    if (hasAnswered || !currentPlayer || !currentRound) return;

    sounds.playSelect();
    setSelectedOption(optionIndex);
    setHasAnswered(true);

    answeredRoundsRef.current.set(roundCacheKey, { option: optionIndex });
    try {
      sessionStorage.setItem(`spark_ans_${roomCode}_${roundCacheKey}`, JSON.stringify({ option: optionIndex }));
    } catch {}

    const isCorrect = currentRound.correctAnswer !== undefined ? optionIndex === currentRound.correctAnswer : undefined;
    const points = isCorrect ? 100 : 0;

    const answer: PlayerAnswer = {
      playerId: currentPlayer.id,
      playerNickname: currentPlayer.nickname,
      roundId: currentRound.id,
      answer: optionIndex,
      answeredAt: Date.now(),
      isCorrect,
      pointsAwarded: points,
    };

    roomManager.submitAnswer(roomCode, answer);
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasAnswered || !currentPlayer || !currentRound || !textInput.trim()) return;

    const textVal = textInput.trim();
    sounds.playSelect();
    setHasAnswered(true);

    answeredRoundsRef.current.set(roundCacheKey, { text: textVal });
    try {
      sessionStorage.setItem(`spark_ans_${roomCode}_${roundCacheKey}`, JSON.stringify({ text: textVal }));
    } catch {}

    const answer: PlayerAnswer = {
      playerId: currentPlayer.id,
      playerNickname: currentPlayer.nickname,
      roundId: currentRound.id,
      answer: textVal,
      answeredAt: Date.now(),
    };

    roomManager.submitAnswer(roomCode, answer);
  };

  const OPTION_THEMES = [
    {
      border: "border-blue-200 hover:border-blue-500 active:border-blue-600",
      bg: "bg-white hover:bg-blue-50/40 active:bg-blue-50",
      badge: "bg-blue-100 text-blue-700 border-blue-300",
      label: "١",
    },
    {
      border: "border-amber-200 hover:border-amber-500 active:border-amber-600",
      bg: "bg-white hover:bg-amber-50/40 active:bg-amber-50",
      badge: "bg-amber-100 text-amber-800 border-amber-300",
      label: "٢",
    },
    {
      border: "border-emerald-200 hover:border-emerald-500 active:border-emerald-600",
      bg: "bg-white hover:bg-emerald-50/40 active:bg-emerald-50",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
      label: "٣",
    },
    {
      border: "border-rose-200 hover:border-rose-500 active:border-rose-600",
      bg: "bg-white hover:bg-rose-50/40 active:bg-rose-50",
      badge: "bg-rose-100 text-rose-800 border-rose-300",
      label: "٤",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F9FD] text-[#17324D] flex flex-col font-arabic select-none">
      {/* Top Participant Status Bar */}
      <header className="p-4 border-b border-[#E2EEF8] bg-white/95 backdrop-blur-md flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="text-2xl p-1 bg-[#F4F9FD] rounded-xl border border-[#E2EEF8]">{currentPlayer?.avatar || "⚡"}</span>
          <div className="text-right">
            <span className="text-sm font-black text-[#17324D] block">
              {currentPlayer?.nickname || "مشارك"}
            </span>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>متصل بالغرفة</span>
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-sm font-black font-mono text-[#2F8FD8] tracking-widest bg-[#EAF7FF] px-3.5 py-1.5 rounded-xl border border-[#C9ECFF]">
            {roomCode}
          </span>
        </div>
      </header>

      {/* Main Playing Viewport: Focused, Spacious, Proportional */}
      <main className="flex-1 flex flex-col justify-center p-4 sm:p-6 max-w-lg mx-auto w-full">
        
        {/* 1. LOBBY WAITING STATE */}
        {room.status === "LOBBY" && (
          <div className="text-center space-y-5 animate-scale-in py-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EEF8] shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF7FF] text-[#2F8FD8] flex items-center justify-center mx-auto text-3xl border border-[#C9ECFF]">
              👋
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#17324D]">
                أهلاً بك يا {currentPlayer?.nickname}!
              </h2>
              <p className="text-sm text-[#60788C] mt-1.5">
                أنت الآن متصل بنجاح بالغرفة <span className="font-mono text-[#2F8FD8] font-black">{roomCode}</span>
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8] text-sm text-[#60788C]">
              النشاط الحالي: <strong className="font-black text-[#17324D] block text-base mt-1">{activity.titleAr}</strong>
            </div>
            <div className="text-xs text-[#2F8FD8] font-bold animate-pulse pt-2 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2F8FD8]"></span>
              <span>ابقَ في هذه الصفحة.. النشاط سيبدأ قريباً بإشارة المضيف!</span>
            </div>
          </div>
        )}

        {/* 2. DYNAMIC COUNTDOWN STATE (3 -> 2 -> 1) */}
        {room.status === "COUNTDOWN" && (
          <div className="text-center space-y-5 animate-scale-in py-14 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EEF8] shadow-sm">
            <div className="text-lg font-black text-[#2F8FD8] font-arabic">استعد للإجابة...</div>
            <div
              key={`play-countdown-${countdownVal}`}
              className="text-8xl sm:text-9xl font-black font-mono text-[#17324D] animate-scale-in select-none my-2"
            >
              {countdownVal}
            </div>
            <div className="text-sm text-[#60788C] font-bold">انظر للشاشة الكبيرة ثم اختر إجابتك فوراً!</div>
          </div>
        )}

        {/* 3. ACTIVE PLAYING ROUND */}
        {room.status === "PLAYING_ROUND" && currentRound && (
          <div key={`round-view-${currentRound.id}`} className="space-y-4 animate-scale-in w-full">
            {/* Header / Timer pill */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#60788C] pb-2 border-b border-[#E2EEF8]">
              <span className="bg-white px-3 py-1 rounded-lg border border-[#E2EEF8]">
                جولة {room.currentRoundIndex + 1} من {activity.rounds?.length || 1}
              </span>
              <div className={`flex items-center gap-2 font-mono font-black px-3 py-1 rounded-xl border ${
                secondsLeft <= 4 
                  ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse" 
                  : "bg-[#EAF7FF] text-[#2F8FD8] border-[#C9ECFF]"
              }`}>
                <Clock className="w-4 h-4" />
                <span className="text-base">00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}</span>
              </div>
            </div>

            {/* Prompt Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E2EEF8] text-center shadow-xs">
              <h3 className="text-lg sm:text-2xl font-black text-[#17324D] leading-snug">
                {currentRound.promptAr}
              </h3>
              {currentRound.subtitleAr && (
                <p className="text-xs sm:text-sm text-[#60788C] mt-2 font-medium">{currentRound.subtitleAr}</p>
              )}
            </div>

            {/* Answer Sizing & Tension State (Crucial: never reveal answer until timer reaches 0) */}
            {hasAnswered ? (
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E2EEF8] text-center space-y-4 animate-scale-in my-3 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-[#EAF7FF] text-[#2F8FD8] flex items-center justify-center mx-auto text-2xl shadow-inner border border-[#C9ECFF]">
                  🔒
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-[#17324D]">
                    تم قفل وتسجيل إجابتك بنجاح!
                  </h4>
                  {selectedOption !== null && currentRound.optionsAr && currentRound.optionsAr[selectedOption] && (
                    <div className="mt-3.5 inline-block px-5 py-2.5 rounded-2xl bg-[#EAF7FF] border border-[#C9ECFF] text-[#2F8FD8] font-black text-base sm:text-lg max-w-full">
                      اختيارك: {currentRound.optionsAr[selectedOption]}
                    </div>
                  )}
                  {textInput && activity.type === "WORD_CLOUD" && (
                    <div className="mt-3.5 inline-block px-5 py-2.5 rounded-2xl bg-[#EAF7FF] border border-[#C9ECFF] text-[#2F8FD8] font-black text-base sm:text-lg">
                      كلمتك: &ldquo;{textInput}&rdquo;
                    </div>
                  )}
                </div>

                {/* Tension Countdown Banner as requested by user */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs sm:text-sm font-bold leading-relaxed space-y-2 mt-2">
                  <div className="flex items-center justify-center gap-1.5 text-amber-700">
                    <Clock className="w-4 h-4 animate-spin text-amber-600" />
                    <span className="font-black text-sm">النتيجة ستظهر أمام الجميع بعد انتهاء التوقيت ⏱️</span>
                  </div>
                  <p className="text-[#60788C] text-xs">
                    انتظر نفاد العداد لتظهر الإجابة الصحيحة وتوزيع النتائج على الشاشة الكبيرة.
                  </p>
                  <div className="font-mono text-xl sm:text-2xl font-black text-[#17324D] pt-1">
                    00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {currentRound.optionsAr && currentRound.optionsAr.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {currentRound.optionsAr.map((opt, optIdx) => {
                      const theme = OPTION_THEMES[optIdx % OPTION_THEMES.length];
                      return (
                        <button
                          key={`${currentRound.id}-opt-${optIdx}`}
                          type="button"
                          onClick={() => handleSubmitChoice(optIdx)}
                          className={`w-full p-5 sm:p-6 min-h-[76px] sm:min-h-[88px] rounded-2xl border-2 ${theme.border} ${theme.bg} text-[#17324D] font-black text-lg sm:text-xl text-right active:scale-98 transition-all shadow-xs flex items-center justify-between touch-manipulation cursor-pointer select-none`}
                        >
                          <span className="leading-snug pr-1 flex-1">{opt}</span>
                          <span className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border ${theme.badge} flex items-center justify-center text-base sm:text-lg font-mono font-black shrink-0 mr-3 shadow-2xs`}>
                            {theme.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {activity.type === "WORD_CLOUD" && (
                  <form onSubmit={handleSubmitText} className="space-y-3.5 pt-2">
                    <input
                      type="text"
                      maxLength={30}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="اكتب كلمتك هنا بوضوح..."
                      className="w-full py-4 px-5 bg-white border-2 border-[#E2EEF8] rounded-2xl text-lg sm:text-xl font-bold text-[#17324D] text-center placeholder-[#60788C] focus:outline-none focus:border-[#2F8FD8] shadow-xs"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={!textInput.trim()}
                      className="w-full bg-[#2F8FD8] hover:bg-[#1F7EC7] active:scale-98 transition-all py-4 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-5 h-5 rotate-180" />
                      <span>إرسال كلمتي الآن</span>
                    </button>
                  </form>
                )}

                {(!currentRound.optionsAr || currentRound.optionsAr.length === 0) && activity.type !== "WORD_CLOUD" && (
                  <div className="space-y-3 pt-1">
                    <button
                      onClick={() => handleSubmitChoice(0)}
                      className="w-full p-5 sm:p-6 rounded-2xl bg-[#2F8FD8] hover:bg-[#1F7EC7] text-white font-black text-base sm:text-lg text-center active:scale-98 transition-transform shadow-xs"
                    >
                      <span>أنجزت المهمة / شاركت فكرتي 👍</span>
                    </button>
                    <button
                      onClick={() => handleSubmitChoice(1)}
                      className="w-full p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#E2EEF8] text-[#60788C] font-black text-sm sm:text-base text-center active:scale-98 transition-transform"
                    >
                      <span>مستمر في الحوار والتفاعل 💬</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. ROUND RESULTS VIEW (Reveal Answers ONLY NOW after countdown ends) */}
        {room.status === "ROUND_RESULTS" && (
          <div className="text-center space-y-5 animate-scale-in py-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EEF8] shadow-sm">
            {currentRound && typeof currentRound.correctAnswer === "number" ? (
              (() => {
                const correctIdx = currentRound.correctAnswer as number;
                const correctOptionText = currentRound.optionsAr?.[correctIdx] || "";
                return selectedOption === correctIdx ? (
                  /* Correct Answer Celebration */
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl border border-emerald-200">
                      🎉
                    </div>
                    <div>
                      <span className="text-xs font-black text-emerald-700 uppercase tracking-wider block">
                        إجابة صحيحة وممتازة!
                      </span>
                      <h3 className="text-2xl font-black text-emerald-950 mt-1">
                        +100 نقطة لرصيدك 🎯
                      </h3>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-black text-base">
                      {correctOptionText}
                    </div>
                  </div>
                ) : (
                  /* Incorrect Answer Feedback */
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-3xl border border-rose-200">
                      💡
                    </div>
                    <div>
                      <span className="text-xs font-black text-rose-600 uppercase tracking-wider block">
                        حظ أوفر في الجولة التالية
                      </span>
                      <h3 className="text-lg font-black text-[#17324D] mt-1">
                        الإجابة الصحيحة هي:
                      </h3>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-black text-base">
                      {correctOptionText}
                    </div>
                    {selectedOption !== null && currentRound.optionsAr?.[selectedOption] && (
                      <p className="text-xs text-[#60788C]">
                        كان اختيارك: <span className="font-bold text-[#17324D]">{currentRound.optionsAr[selectedOption]}</span>
                      </p>
                    )}
                  </div>
                );
              })()
            ) : (
              /* Non-quiz round completion (Discussion / Poll) */
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#EAF7FF] text-[#2F8FD8] flex items-center justify-center mx-auto text-3xl border border-[#C9ECFF]">
                  📊
                </div>
                <div>
                  <span className="text-xs font-black text-[#2F8FD8] uppercase tracking-wider block">
                    انتهى وقت الجولة! ⏱️
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#17324D] mt-1">
                    شاهد نتائج وتصويت المجموعة
                  </h3>
                  <p className="text-xs sm:text-sm text-[#60788C] mt-2">
                    النتائج الحية وتوزيع الأصوات معروضة الآن على الشاشة الكبيرة.
                  </p>
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8] text-xs font-bold text-[#60788C]">
              استعد للجولة التالية مع إشارة المضيف... 🚀
            </div>
          </div>
        )}

        {/* 5. FINAL CELEBRATION VIEW */}
        {room.status === "FINAL_CELEBRATION" && (
          <div className="text-center space-y-5 animate-scale-in py-10 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EEF8] shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF7FF] text-[#2F8FD8] flex items-center justify-center mx-auto text-3xl border border-[#C9ECFF]">
              🏆
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#17324D]">
                أحسنت يا {currentPlayer?.nickname}!
              </h3>
              <p className="text-sm text-[#60788C] mt-2">
                انتهى النشاط بنجاح مع المجموعة.. شكراً لمشاركتك وتفاعلك الرائع!
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default function PlayRoomPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F9FD] flex items-center justify-center text-[#17324D]">
        <div className="w-6 h-6 border-2 border-[#2F8FD8] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PlayRoomContent />
    </Suspense>
  );
}
