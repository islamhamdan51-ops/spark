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

    // Load existing room locally without creating a dummy one
    const local = roomManager.getLocalRoom(roomCode);
    if (local) {
      setRoom(local);
      const act = getActivityBySlug(local.activitySlug) || ACTIVITIES[0];
      setActivity(act);
    }

    // Subscribe to updates (will fetch from server if not found in memory)
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
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center text-slate-800 font-arabic">
        <div className="text-center p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-spark-flame flex items-center justify-center mx-auto animate-spin text-xl">
            ⚡
          </div>
          <div className="text-base font-bold">جاري الاتصال بالغرفة {roomCode}...</div>
          <p className="text-xs text-slate-400">نظام المزامنة الفورية نشط</p>
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
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col font-arabic select-none">
      {/* Top Participant Status Bar */}
      <header className="p-4 border-b border-slate-200 bg-white/95 backdrop-blur-md flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentPlayer?.avatar || "⚡"}</span>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-900 block">
              {currentPlayer?.nickname || "مشارك"}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>متصل</span>
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 block font-mono">الغرفة</span>
          <span className="text-xs font-bold font-mono text-spark-flame tracking-wider bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
            {roomCode}
          </span>
        </div>
      </header>

      {/* Main Playing Viewport */}
      <main className="flex-1 flex flex-col justify-center p-4 sm:p-6 max-w-lg mx-auto w-full">
        
        {/* 1. LOBBY WAITING STATE */}
        {room.status === "LOBBY" && (
          <div className="text-center space-y-5 animate-scale-in py-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-orange-50 border border-orange-200 text-spark-flame flex items-center justify-center mx-auto text-3xl shadow-xs animate-pulse-slow">
              {currentPlayer?.avatar || "⚡"}
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 font-arabic">
                أهلاً بك يا {currentPlayer?.nickname || "بطل"}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed">
                أنت الآن داخل الغرفة.. سيبدأ المضيف النشاط خلال لحظات.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 block mb-1">النشاط المختار:</span>
              <span className="text-sm font-bold text-spark-flame font-arabic">
                {activity.titleAr}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 animate-pulse">
              ابقَ في هذه الصفحة وراقب شاشة المضيف...
            </div>
          </div>
        )}

        {/* 2. COUNTDOWN STATE */}
        {room.status === "COUNTDOWN" && (
          <div className="text-center space-y-4 animate-scale-in py-12 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="text-xl font-bold text-spark-flame font-arabic">استعد للإجابة...</div>
            <div className="text-7xl font-black font-mono text-slate-900 animate-bounce-subtle">
              3
            </div>
            <div className="text-xs text-slate-500">انظر للشاشة الكبيرة ثم أجب فوراً!</div>
          </div>
        )}

        {/* 3. ACTIVE PLAYING ROUND */}
        {room.status === "PLAYING_ROUND" && currentRound && (
          <div key={`round-view-${currentRound.id}`} className="space-y-4 animate-scale-in w-full">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-2 border-b border-slate-200">
              <span>جولة {room.currentRoundIndex + 1} من {activity.rounds?.length || 1}</span>
              <div className="flex items-center gap-1.5 text-spark-flame font-mono font-bold bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200">
                <Clock className="w-3.5 h-3.5" />
                <span>00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-arabic">
                {currentRound.promptAr}
              </h3>
              {currentRound.subtitleAr && (
                <p className="text-xs text-slate-500 mt-1">{currentRound.subtitleAr}</p>
              )}
            </div>

            {hasAnswered ? (
              <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-scale-in my-6 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto text-2xl shadow-sm shadow-emerald-500/30">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-emerald-950 font-arabic">تم تسجيل إجابتك بنجاح! 🎉</h4>
                  {selectedOption !== null && currentRound.optionsAr && currentRound.optionsAr[selectedOption] && (
                    <div className="mt-3 inline-block px-4 py-2 rounded-2xl bg-white border border-emerald-200 text-emerald-900 font-bold text-sm shadow-2xs">
                      اختيارك: <span className="text-spark-flame font-black">{currentRound.optionsAr[selectedOption]}</span>
                    </div>
                  )}
                  {textInput && activity.type === "WORD_CLOUD" && (
                    <div className="mt-3 inline-block px-4 py-2 rounded-2xl bg-white border border-emerald-200 text-emerald-900 font-bold text-sm shadow-2xs">
                      كلمتك: &ldquo;{textInput}&rdquo;
                    </div>
                  )}
                  <p className="text-xs text-emerald-800 mt-3">
                    في انتظار باقي الزملاء.. انظر للشاشة الكبيرة لمتابعة النتائج الحية!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {currentRound.optionsAr && currentRound.optionsAr.length > 0 && (
                  <div className="grid grid-cols-1 gap-3">
                    {currentRound.optionsAr.map((opt, optIdx) => {
                      const colors = [
                        "from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-orange-500/20",
                        "from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-indigo-500/20",
                        "from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20",
                        "from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 shadow-rose-500/20",
                      ];
                      const colorClass = colors[optIdx % colors.length];

                      return (
                        <button
                          key={`${currentRound.id}-opt-${optIdx}`}
                          type="button"
                          onClick={() => handleSubmitChoice(optIdx)}
                          className={`w-full p-5 sm:p-6 rounded-2xl bg-gradient-to-r ${colorClass} text-white font-bold text-base sm:text-lg text-right active:scale-98 transition-transform shadow-md flex items-center justify-between touch-manipulation cursor-pointer select-none`}
                        >
                          <span>{opt}</span>
                          <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-sm font-mono font-bold">
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
                      className="w-full py-4 px-4 bg-white border-2 border-slate-300 rounded-2xl text-base font-bold text-slate-900 text-center placeholder-slate-400 focus:outline-none focus:border-spark-flame shadow-xs"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={!textInput.trim()}
                      className="w-full bg-spark-flame hover:bg-spark-flame/90 active:scale-98 transition-all py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Send className="w-4 h-4 rotate-180" />
                      <span>إرسال كلمتي للمجموعة</span>
                    </button>
                  </form>
                )}

                {(!currentRound.optionsAr || currentRound.optionsAr.length === 0) && activity.type !== "WORD_CLOUD" && (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-slate-500 text-center mb-2">تفاعل مع زملائك حسب التوجيه ثم أكّد إنجازك:</p>
                    <button
                      onClick={() => handleSubmitChoice(0)}
                      className="w-full p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-base text-center active:scale-98 transition-transform shadow-sm"
                    >
                      <span>أنجزت المهمة / شاركت فكرتي 👍</span>
                    </button>
                    <button
                      onClick={() => handleSubmitChoice(1)}
                      className="w-full p-4 rounded-2xl bg-white border border-slate-300 text-slate-700 font-bold text-sm text-center active:scale-98 transition-transform"
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
          <div className="text-center space-y-5 animate-scale-in py-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-spark-flame flex items-center justify-center mx-auto text-2xl">
              📊
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 font-arabic">
                انتهت الجولة {room.currentRoundIndex + 1}!
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                النتائج الحية معروضة الآن على الشاشة الرئيسية.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
              استعد للجولة التالية مع إشارة المضيف...
            </div>
          </div>
        )}

        {/* 5. FINAL CELEBRATION VIEW */}
        {room.status === "FINAL_CELEBRATION" && (
          <div className="text-center space-y-5 animate-scale-in py-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-orange-50 border border-orange-200 text-spark-flame flex items-center justify-center mx-auto text-3xl shadow-xs">
              🏆
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-arabic">
                أبدعتم جميعاً!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                شكراً لمشاركتك يا {currentPlayer?.nickname}، تفاعلك أضاء الجلسة! ⚡
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
              انتهى النشاط.. استمتع ببقية ورشتك أو فعاليتك!
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default function PlayRoomPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center text-slate-800">جاري الاتصال...</div>}>
      <PlayRoomContent />
    </Suspense>
  );
}
