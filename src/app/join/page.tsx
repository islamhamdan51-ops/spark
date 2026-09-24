"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Sparkles, AlertCircle, ArrowRight, UserCheck } from "lucide-react";
import { roomManager } from "@/lib/room-store";
import { AVATAR_OPTIONS, getRandomAvatar } from "@/lib/utils";
import { sounds } from "@/lib/sound";

function JoinContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialCode = searchParams.get("code") || "";
  const [code, setCode] = useState(initialCode);
  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("⚡");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSelectedAvatar(getRandomAvatar());
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanCode = code.trim();
    const cleanNick = nickname.trim();

    if (!cleanCode) {
      setErrorMsg("الرجاء إدخال رمز الغرفة المكون من 6 أرقام");
      return;
    }

    if (!cleanNick) {
      setErrorMsg("الرجاء إدخال اسم مستعار للمشاركة");
      return;
    }

    setIsSubmitting(true);
    sounds.playSelect();

    try {
      const res = await roomManager.addPlayer(cleanCode, cleanNick, selectedAvatar);
      if (!res.success) {
        setErrorMsg(res.error || "تعذر الانضمام للغرفة، تأكد من صحة الرمز");
        setIsSubmitting(false);
        return;
      }

      if (res.player) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(`spark_player_${cleanCode}`, JSON.stringify(res.player));
        }
        sounds.playSuccess();
        router.push(`/play/${cleanCode}?playerId=${res.player.id}`);
      }
    } catch (err) {
      setErrorMsg("حدث خطأ أثناء الانضمام، حاول مرة أخرى");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/90 shadow-xl relative z-10 animate-scale-in">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 group mb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-spark-flame to-spark-amber flex items-center justify-center shadow-md shadow-spark-flame/20">
            <span className="text-xl">⚡</span>
          </div>
          <span className="text-2xl font-black text-slate-900 font-arabic">شرارة</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-arabic">الانضمام إلى غرفة نشاط</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">ادخل الرمز واسمك المستعار للمشاركة فوراً</p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-scale-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleJoin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 text-right">
            رمز الغرفة (6 أرقام):
          </label>
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="مثال: 742391"
            className="w-full text-center tracking-widest text-2xl font-mono font-black py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-spark-flame placeholder-slate-400 focus:outline-none focus:border-spark-flame focus:bg-white focus:ring-4 focus:ring-spark-flame/10 transition-all"
            required
            autoFocus={!initialCode}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 text-right">
            اسمك المستعار في النشاط:
          </label>
          <input
            type="text"
            maxLength={15}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="نور، ليث، سارة، الصقر..."
            className="w-full text-right text-sm font-bold py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-spark-flame focus:bg-white focus:ring-4 focus:ring-spark-flame/10 transition-all"
            required
            autoFocus={Boolean(initialCode)}
          />
          <span className="text-[11px] text-slate-400 mt-1 block text-right font-medium">
            لا يشترط اسمك الحقيقي، اختر أي لقب يعبر عنك!
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 text-right">
            اختر أيقونتك المميزة:
          </label>
          <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200/80">
            {AVATAR_OPTIONS.map((av) => (
              <button
                key={av}
                type="button"
                onClick={() => {
                  sounds.playSelect();
                  setSelectedAvatar(av);
                }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                  selectedAvatar === av
                    ? "bg-white border-2 border-spark-flame scale-110 shadow-md shadow-spark-flame/20"
                    : "hover:bg-slate-200/60 text-slate-400"
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full spark-glow-button py-3.5 rounded-2xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-spark-flame/25 disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? "جاري الدخول..." : "دخول الغرفة"}</span>
          </button>
        </div>
      </form>

      <div className="text-center mt-6 pt-4 border-t border-slate-100">
        <Link href="/" className="text-xs font-bold text-slate-500 hover:text-spark-flame transition-colors inline-flex items-center gap-1">
          <span>العودة للصفحة الرئيسية</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col justify-center items-center p-4 font-arabic relative overflow-hidden">
      {/* Subtle warm backdrop glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-spark-flame/8 to-spark-amber/8 blur-3xl pointer-events-none rounded-full" />
      <Suspense fallback={<div className="text-sm font-bold text-slate-500">جاري التحميل...</div>}>
        <JoinContent />
      </Suspense>
    </div>
  );
}
