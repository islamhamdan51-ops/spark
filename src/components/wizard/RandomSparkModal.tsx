"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles, Dices, RefreshCw, Clock, Users, Flame, Smartphone, Monitor } from "lucide-react";
import { Activity } from "@/types";
import { getRandomSpark } from "@/lib/recommendation";
import { sounds } from "@/lib/sound";

interface RandomSparkModalProps {
  isOpen: boolean;
  onClose: () => void;
  audience?: "adults" | "kids";
}

export function RandomSparkModal({ isOpen, onClose, audience = "adults" }: RandomSparkModalProps) {
  const [shuffling, setShuffling] = useState<boolean>(true);
  const [activity, setActivity] = useState<Activity | null>(null);

  const shuffle = () => {
    setShuffling(true);
    sounds.playTick(false);

    let counter = 0;
    const interval = setInterval(() => {
      setActivity(getRandomSpark(audience));
      counter++;
      if (counter >= 5) {
        clearInterval(interval);
        setShuffling(false);
        sounds.playSuccess();
      }
    }, 120);
  };

  useEffect(() => {
    if (isOpen) {
      shuffle();
    }
  }, [isOpen, audience]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-scale-in">
      <div className="relative w-full max-w-lg bg-white border border-[#E2EEF8] rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden text-center">
        {/* Top Accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#2F8FD8]" />

        <button
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute top-4 left-4 p-2 rounded-xl text-[#60788C] hover:text-[#17324D] hover:bg-[#F4F9FD] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#EAF7FF] border border-[#BAE6FD] text-[#2F8FD8] mb-3">
          <Dices className={`w-7 h-7 ${shuffling ? "animate-spin text-[#78C7F5]" : "text-[#2F8FD8]"}`} />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-[#17324D] font-arabic">
          {shuffling ? "جاري البحث عن الشرارة الأنسب..." : "لقينا لك الشرارة!"}
        </h3>
        <p className="text-xs sm:text-sm text-[#60788C] mt-1">
          {shuffling ? "لحظات ونقدم لك فكرة مميزة لمجموعتك" : "نشاط جاهز ومباشر لا يحتاج أي تحضير مسبق"}
        </p>

        {activity && (
          <div
            className={`mt-6 p-5 sm:p-6 rounded-2xl border text-right transition-all ${
              shuffling
                ? "bg-[#F4F9FD] border-[#E2EEF8] opacity-60 scale-98"
                : "bg-white border-2 border-[#BAE6FD] shadow-xs scale-100"
            }`}
          >
            {/* Energy and Duration Chips */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EAF7FF] text-[#2F8FD8]">
                {activity.energy === "high" ? "⚡ طاقة عالية" : activity.energy === "medium" ? "🌤 متوازن" : "🧊 هادئ"}
              </span>
              <span className="text-xs font-medium text-[#60788C] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#60788C]" />
                <span>{activity.duration} دقائق</span>
              </span>
            </div>

            <h4 className="text-xl sm:text-2xl font-black text-[#17324D] font-arabic">
              {activity.titleAr}
            </h4>
            <p className="text-xs sm:text-sm text-[#60788C] mt-2 leading-relaxed">
              {activity.descriptionAr}
            </p>

            {/* Why Recommended Section */}
            <div className="mt-3.5 p-3 rounded-xl bg-[#F4F9FD] border border-[#E2EEF8] text-xs text-[#17324D]">
              <span className="font-bold text-[#2F8FD8] block mb-1">لماذا هذا النشاط؟</span>
              <span className="text-[#60788C]">{activity.whyRecommended || "اخترنا هذا النشاط لأنه سريع، يكسر الجمود فوراً، ومناسب لأي عدد دون تعقيد."}</span>
            </div>

            {/* Metadata Tags */}
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-[#E2EEF8] text-xs font-bold text-[#60788C]">
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#60788C]" />
                <span>{activity.minPlayers}–{activity.maxPlayers} لاعب</span>
              </div>
              <div className="flex items-center gap-1">
                {activity.requiresPhone ? (
                  <span className="text-[#2F8FD8] bg-[#EAF7FF] px-2 py-0.5 rounded-md border border-[#BAE6FD]">📱 يحتاج هواتف</span>
                ) : (
                  <span className="text-[#17324D] bg-[#F4F9FD] px-2 py-0.5 rounded-md border border-[#E2EEF8]">✅ بدون هواتف</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        {!shuffling && activity && (
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href={`/host/new?activity=${activity.slug}`}
              onClick={onClose}
              className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-[#2F8FD8] hover:bg-[#1F7EC7] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>ابدأ هذا النشاط</span>
            </Link>

            <button
              onClick={shuffle}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-[#BAE6FD] bg-white hover:bg-[#F4F9FD] text-[#2F8FD8] text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-[#2F8FD8]" />
              <span>فكرة ثانية</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
