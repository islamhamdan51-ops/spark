"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Sparkles, AlertCircle, ArrowRight } from "lucide-react";
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
    <div className="w-full max-w-md bg-white rounded-3xl p-7 sm:p-9 border border-[#E2EEF8] shadow-sm relative z-10 animate-scale-in text-right">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 group mb-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF7FF] border border-[#BAE6FD] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#2F8FD8]" />
          </div>
          <span className="text-2xl font-black text-[#17324D] font-arabic">شرارة</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-[#17324D] font-arabic">الانضمام للغرفة</h1>
        <p className="text-xs sm:text-sm text-[#60788C] mt-1 font-medium">ادخل رمز الغرفة واسمك المستعار للمشاركة فوراً</p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-scale-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleJoin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#17324D] mb-1.5 text-right">
            رمز الغرفة (6 أرقام):
          </label>
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="مثال: 742391"
            className="w-full text-center tracking-widest text-2xl font-mono font-black py-3 px-4 bg-[#F4F9FD] border border-[#E2EEF8] rounded-2xl text-[#2F8FD8] placeholder-[#60788C]/40 focus:outline-none focus:border-[#2F8FD8] focus:bg-white focus:ring-4 focus:ring-[#2F8FD8]/10 transition-all"
            required
            autoFocus={!initialCode}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#17324D] mb-1.5 text-right">
            اسمك المستعار:
          </label>
          <input
            type="text"
            maxLength={15}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="نور، ليث، سارة، الصقر..."
            className="w-full text-right text-sm font-bold py-3 px-4 bg-[#F4F9FD] border border-[#E2EEF8] rounded-2xl text-[#17324D] placeholder-[#60788C]/40 focus:outline-none focus:border-[#2F8FD8] focus:bg-white focus:ring-4 focus:ring-[#2F8FD8]/10 transition-all"
            required
            autoFocus={Boolean(initialCode)}
          />
          <span className="text-[11px] text-[#60788C] mt-1 block text-right">
            لا يشترط اسمك الحقيقي، اختر أي لقب يعبر عنك!
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#17324D] mb-2 text-right">
            اختر أيقونتك:
          </label>
          <div className="grid grid-cols-8 gap-1.5 p-2 bg-[#F4F9FD] rounded-2xl border border-[#E2EEF8]">
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
                    ? "bg-white border-2 border-[#2F8FD8] scale-105 shadow-xs"
                    : "hover:bg-[#EAF7FF] text-slate-400"
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
            className="w-full py-3.5 rounded-2xl bg-[#2F8FD8] hover:bg-[#1F7EC7] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-60"
          >
            <span>{isSubmitting ? "جاري الدخول..." : "دخول الغرفة"}</span>
          </button>
        </div>
      </form>

      <div className="text-center mt-6 pt-4 border-t border-[#E2EEF8]">
        <Link href="/" className="text-xs font-bold text-[#60788C] hover:text-[#2F8FD8] transition-colors inline-flex items-center gap-1">
          <span>العودة للصفحة الرئيسية</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-[#F4F9FD] text-[#17324D] flex flex-col justify-center items-center p-4 font-arabic relative overflow-hidden">
      <Suspense fallback={<div className="text-sm font-bold text-[#60788C]">جاري التحميل...</div>}>
        <JoinContent />
      </Suspense>
    </div>
  );
}
