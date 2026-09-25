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
  const answeredRoundsRef = useRef<Map<number, { option?: number; text?: string }>>(new Map());

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
  const currentRound = (room && rounds[room.currentRoundIndex]) || rounds[0] || fallbackRound;

  // Accurately check if an answer belongs to the current round
  const isMatchRound = (roundId: string, roundIdx: number) => {
    if (!roundId) return false;
    if (currentRound && roundId === currentRound.id) return true;
    const suffix = `-round-${roundIdx + 1}`;
    if (roundId.endsWith(suffix) || (currentRound && currentRound.id.endsWith(suffix))) return true;
    if (roundId === `round-${roundIdx + 1}`) return true;
    return false;
  };

  // Accurately synchronize answering state with local lock + room.answers
  useEffect(() => {
    if (!room || !currentPlayer || !currentRound || room.status !== "PLAYING_ROUND") {
      setHasAnswered(false);
      setSelectedOption(null);
      setTextInput("");
      return;
    }

    const roundIdx = room.currentRoundIndex ?? 0;
    const localRecord = answeredRoundsRef.current.get(roundIdx);

    // 1. Check if server confirmed our answer
    const serverAns = room.answers?.find(
      (a) => a.playerId === currentPlayer.id && isMatchRound(a.roundId, roundIdx)
    );

    if (serverAns) {
      setHasAnswered(true);
      if (typeof serverAns.answer === "number") {
        setSelectedOption(serverAns.answer);
      } else if (typeof serverAns.answer === "string") {
        setTextInput(serverAns.answer);
      }
      answeredRoundsRef.current.set(roundIdx, {
        option: typeof serverAns.answer === "number" ? serverAns.answer : undefined,
        text: typeof serverAns.answer === "string" ? serverAns.answer : undefined,
      });
      return;
    }

    // 2. If locally locked in this round, NEVER drop it even if an in-flight poll returned older state!
    if (localRecord) {
      setHasAnswered(true);
      if (localRecord.option !== undefined) setSelectedOption(localRecord.option);
      if (localRecord.text !== undefined) setTextInput(localRecord.text);
      return;
    }

    // 3. Check sessionStorage in case of page reload during active round
    try {
      const saved = sessionStorage.getItem(`spark_ans_${roomCode}_${roundIdx}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          answeredRoundsRef.current.set(roundIdx, parsed);
          setHasAnswered(true);
          if (parsed.option !== undefined) setSelectedOption(parsed.option);
          if (parsed.text !== undefined) setTextInput(parsed.text);
          return;
        }
      }
    } catch {}

    // 4. Otherwise, user has not answered this new round yet
    setHasAnswered(false);
    setSelectedOption(null);
    setTextInput("");
  }, [room?.currentRoundIndex, room?.status, room?.answers, currentPlayer?.id, currentRound?.id, roomCode]);

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

    const roundIdx = room?.currentRoundIndex ?? 0;
    answeredRoundsRef.current.set(roundIdx, { option: optionIndex });
    try {
      sessionStorage.setItem(`spark_ans_${roomCode}_${roundIdx}`, JSON.stringify({ option: optionIndex }));
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

    const roundIdx = room?.currentRoundIndex ?? 0;
    answeredRoundsRef.current.set(roundIdx, { text: textVal });
    try {
      sessionStorage.setItem(`spark_ans_${roomCode}_${roundIdx}`, JSON.stringify({ text: textVal }));
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

  return (
    <div className="min-h-screen bg-[#F4F9FD] text-[#17324D] flex flex-col font-arabic select-none">
      {/* 24 — Clean Top Participant Status Bar */}
      <header className="p-3.5 border-b border-[#E2EEF8] bg-white/95 backdrop-blur-md flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xl">{currentPlayer?.avatar || "⚡"}</span>
          <div className="text-right">
            <span className="text-xs font-bold text-[#17324D] block">
              {currentPlayer?.nickname || "مشارك"}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>متصل</span>
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold font-mono text-[#2F8FD8] tracking-wider bg-[#EAF7FF] px-2.5 py-1 rounded-md border border-[#C9ECFF]">
            {roomCode}
          </span>
        </div>
      </header>

      {/* Main Playing Viewport: Focused, Minimal, Clear */}
      <main className="flex-1 flex flex-col justify-center p-4 sm:p-6 max-w-md mx-auto w-full">
        
        {/* 1. LOBBY WAITING STATE */}
        {room.status === "LOBBY" && (
          <div className="text-center space-y-4 animate-scale-in py-10 bg-white rounded-2xl p-6 border border-[#E2EEF8] shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#EAF7FF] text-[#2F8FD8] flex items-center justify-center mx-auto text-2xl">
              👋
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#17324D]">
                أهلاً بك يا {currentPlayer?.nickname}!
              </h2>
              <p className="text-xs text-[#60788C] mt-1">
                أنت الآن متصل بالغرفة <span className="font-mono text-[#2F8FD8] font-bold">{roomCode}</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#F4F9FD] border border-[#E2EEF8] text-xs text-[#60788C]">
              النشاط: <span className="font-bold text-[#17324D]">{activity.titleAr}</span>
            </div>
            <div className="text-[11px] text-[#60788C] animate-pulse">
              ابقَ في هذه الصفحة وراقب شاشة المضيف...
            </div>
          </div>
        )}

        {/* 2. DYNAMIC COUNTDOWN STATE (3 -> 2 -> 1) */}
        {room.status === "COUNTDOWN" && (
          <div className="text-center space-y-4 animate-scale-in py-12 bg-white rounded-2xl p-6 border border-[#E2EEF8] shadow-xs">
            <div className="text-base font-bold text-[#2F8FD8] font-arabic">استعد للإجابة...</div>
            <div
              key={`play-countdown-${countdownVal}`}
              className="text-8xl font-black font-mono text-[#17324D] animate-scale-in select-none"
            >
              {countdownVal}
            </div>
            <div className="text-xs text-[#60788C]">انظر للشاشة الكبيرة ثم أجب فوراً!</div>
          </div>
        )}

        {/* 3. ACTIVE PLAYING ROUND */}
        {room.status === "PLAYING_ROUND" && currentRound && (
          <div key={`round-view-${currentRound.id}`} className="space-y-4 animate-scale-in w-full">
            <div className="flex items-center justify-between text-xs font-bold text-[#60788C] pb-2 border-b border-[#E2EEF8]">
              <span>جولة {room.currentRoundIndex + 1} من {activity.rounds?.length || 1}</span>
              <div className="flex items-center gap-1.5 text-[#2F8FD8] font-mono font-bold bg-[#EAF7FF] px-2 py-0.5 rounded-lg border border-[#C9ECFF]">
                <Clock className="w-3.5 h-3.5" />
                <span>00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E2EEF8] text-center shadow-xs">
              <h3 className="text-base sm:text-lg font-black text-[#17324D] leading-snug">
                {currentRound.promptAr}
              </h3>
              {currentRound.subtitleAr && (
                <p className="text-xs text-[#60788C] mt-1">{currentRound.subtitleAr}</p>
              )}
            </div>

            {hasAnswered ? (
              <div className="p-8 rounded-2xl bg-white border border-[#E2EEF8] text-center space-y-3 animate-scale-in my-4 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-[#EAF7FF] text-[#2F8FD8] flex items-center justify-center mx-auto text-xl shadow-2xs">
                  <CheckCircle2 className="w-6 h-6 text-[#2F8FD8]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#17324D]">تم تسجيل إجابتك بنجاح!</h4>
                  {selectedOption !== null && currentRound.optionsAr && currentRound.optionsAr[selectedOption] && (
                    <div className="mt-2.5 inline-block px-3.5 py-1.5 rounded-lg bg-[#EAF7FF] border border-[#C9ECFF] text-[#2F8FD8] font-bold text-xs">
                      اختيارك: {currentRound.optionsAr[selectedOption]}
                    </div>
                  )}
                  {textInput && activity.type === "WORD_CLOUD" && (
                    <div className="mt-2.5 inline-block px-3.5 py-1.5 rounded-lg bg-[#EAF7FF] border border-[#C9ECFF] text-[#2F8FD8] font-bold text-xs">
                      كلمتك: &ldquo;{textInput}&rdquo;
                    </div>
                  )}
                  <p className="text-xs text-[#60788C] mt-2">
                    في انتظار باقي الزملاء.. انظر للشاشة الكبيرة لمتابعة النتائج الحية!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                {currentRound.optionsAr && currentRound.optionsAr.length > 0 && (
                  <div className="grid grid-cols-1 gap-2.5">
                    {currentRound.optionsAr.map((opt, optIdx) => {
                      return (
                        <button
                          key={`${currentRound.id}-opt-${optIdx}`}
                          type="button"
                          onClick={() => handleSubmitChoice(optIdx)}
                          className="w-full p-4 sm:p-5 rounded-xl bg-white hover:bg-[#F4F9FD] border-2 border-[#E2EEF8] hover:border-[#2F8FD8] active:border-[#2F8FD8] active:bg-[#EAF7FF] text-[#17324D] font-bold text-base text-right active:scale-98 transition-all shadow-xs flex items-center justify-between touch-manipulation cursor-pointer select-none"
                        >
                          <span>{opt}</span>
                          <span className="w-7 h-7 rounded-lg bg-[#EAF7FF] text-[#2F8FD8] border border-[#C9ECFF] flex items-center justify-center text-xs font-mono font-bold">
                            {optIdx + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {activity.type === "WORD_CLOUD" && (
                  <form onSubmit={handleSubmitText} className="space-y-3 pt-2">
                    <input
                      type="text"
                      maxLength={30}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="اكتب كلمة واحدة أو اثنتين..."
                      className="w-full py-3.5 px-4 bg-white border border-[#E2EEF8] rounded-xl text-base font-bold text-[#17324D] text-center placeholder-[#60788C] focus:outline-none focus:border-[#2F8FD8] shadow-xs"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={!textInput.trim()}
                      className="w-full bg-[#2F8FD8] hover:bg-[#1F7EC7] active:scale-98 transition-all py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Send className="w-4 h-4 rotate-180" />
                      <span>إرسال كلمتي للمجموعة</span>
                    </button>
                  </form>
                )}

                {(!currentRound.optionsAr || currentRound.optionsAr.length === 0) && activity.type !== "WORD_CLOUD" && (
                  <div className="space-y-2.5 pt-1">
                    <button
                      onClick={() => handleSubmitChoice(0)}
                      className="w-full p-4 rounded-xl bg-[#2F8FD8] hover:bg-[#1F7EC7] text-white font-bold text-sm text-center active:scale-98 transition-transform shadow-xs"
                    >
                      <span>أنجزت المهمة / شاركت فكرتي 👍</span>
                    </button>
                    <button
                      onClick={() => handleSubmitChoice(1)}
                      className="w-full p-3.5 rounded-xl bg-white border border-[#E2EEF8] text-[#60788C] font-bold text-xs text-center active:scale-98 transition-transform"
                    >
                      <span>مستمر في الحوار والتفاعل 💬</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. ROUND RESULTS VIEW */}
        {room.status === "ROUND_RESULTS" && (
          <div className="text-center space-y-4 animate-scale-in py-8 bg-white rounded-2xl p-6 border border-[#E2EEF8] shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#EAF7FF] text-[#2F8FD8] flex items-center justify-center mx-auto text-xl">
              📊
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17324D]">
                انتهت الجولة {room.currentRoundIndex + 1}!
              </h3>
              <p className="text-xs text-[#60788C] mt-1">
                النتائج الحية معروضة الآن على الشاشة الرئيسية.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#F4F9FD] border border-[#E2EEF8] text-xs text-[#60788C]">
              استعد للجولة التالية مع إشارة المضيف...
            </div>
          </div>
        )}

        {/* 5. FINAL CELEBRATION VIEW */}
        {room.status === "FINAL_CELEBRATION" && (
          <div className="text-center space-y-4 animate-scale-in py-8 bg-white rounded-2xl p-6 border border-[#E2EEF8] shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#EAF7FF] text-[#2F8FD8] flex items-center justify-center mx-auto text-2xl">
              🏆
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#17324D]">
                أحسنت يا {currentPlayer?.nickname}!
              </h3>
              <p className="text-xs text-[#60788C] mt-1">
                انتهى النشاط بنجاح مع المجموعة.
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
