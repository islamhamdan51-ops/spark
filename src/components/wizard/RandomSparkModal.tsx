"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles, Dices, RefreshCw, Clock, Users, Flame, Smartphone, Monitor, CheckCircle2 } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-scale-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center">
        {/* Top Flame Accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-spark-flame via-spark-amber to-rose-500" />

        <button
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute top-4 left-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-spark-flame mb-3 shadow-md shadow-spark-flame/10">
          <Dices className={`w-8 h-8 ${shuffling ? "animate-spin text-spark-amber" : "text-spark-flame"}`} />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-arabic">
          {shuffling ? "جاري البحث عن الشرارة الأنسب..." : "لقينا لك الشرارة!"}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {shuffling ? "لحظات ونقدم لك فكرة مميزة لمجموعتك" : "نشاط جاهز ومباشر لا يحتاج أي تحضير مسبق"}
        </p>

        {activity && (
          <div
            className={`mt-6 p-5 sm:p-6 rounded-2xl border text-right transition-all ${
              shuffling
                ? "bg-slate-50 border-slate-200 opacity-60 scale-98"
                : "bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30 border-orange-200/90 shadow-md scale-100"
            }`}
          >
            {/* Energy and Duration Chips */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100/80 text-spark-flame border border-orange-200">
                {activity.energy === "high" ? "🔥 طاقة عالية" : activity.energy === "medium" ? "🌤 طاقة متوسطة" : "🧊 طاقة هادئة"}
              </span>
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{activity.duration} دقائق</span>
              </span>
            </div>

            <h4 className="text-xl sm:text-2xl font-black text-slate-900 font-arabic">
              {activity.titleAr}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {activity.descriptionAr}
            </p>

            {/* Why Recommended Section */}
            <div className="mt-3.5 p-3 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700">
              <span className="font-bold text-spark-flame block mb-1">لماذا هذا النشاط؟</span>
              <span>{activity.whyRecommended || "اخترنا هذا النشاط لأنه سريع، يكسر الجمود فوراً، ومناسب لأي عدد دون تعقيد."}</span>
            </div>

            {/* Metadata Tags */}
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-600">
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{activity.minPlayers}–{activity.maxPlayers} لاعب</span>
              </div>
              <div className="flex items-center gap-1">
                {activity.requiresPhone ? (
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">📱 يحتاج هواتف</span>
                ) : (
                  <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">✅ بدون هواتف</span>
                )}
              </div>
              {activity.requiresScreen && (
                <div className="flex items-center gap-1">
                  <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">📺 شاشة عرض</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Buttons */}
        {!shuffling && activity && (
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href={`/host/new?activity=${activity.slug}`}
              onClick={onClose}
              className="w-full sm:flex-1 spark-glow-button py-3.5 px-5 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-spark-flame/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>ابدأ هذا النشاط</span>
            </Link>

            <button
              onClick={shuffle}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span>أعطني فكرة أخرى</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
