"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Volume2, VolumeX, Menu, X, Dices, ArrowLeft } from "lucide-react";
import { sounds } from "@/lib/sound";

interface NavbarProps {
  onOpenWizard?: () => void;
  onOpenRandomSpark?: () => void;
}

export function Navbar({ onOpenWizard, onOpenRandomSpark }: NavbarProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMuted(sounds.getMuted());
  }, []);

  const handleToggleSound = () => {
    const updated = sounds.toggleMute();
    setIsMuted(updated);
    if (!updated) {
      sounds.playJoin();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-spark-flame to-spark-amber flex items-center justify-center shadow-md shadow-spark-flame/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">⚡</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-slate-900 font-arabic">
                شرارة
              </span>
              <span className="text-[10px] tracking-widest text-spark-flame font-mono font-black bg-orange-50 px-1.5 py-0.5 rounded-md border border-orange-200">
                SPARK
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">أشعل البداية مع مجموعتك</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-slate-600">
          <Link
            href="/activities"
            className="hover:text-spark-flame transition-colors"
          >
            الأنشطة
          </Link>
          <Link
            href="/activities?audience=adults"
            className="hover:text-spark-flame transition-colors"
          >
            كبار وشباب
          </Link>
          <Link
            href="/kids"
            className="hover:text-amber-600 text-amber-600 font-bold transition-colors flex items-center gap-1"
          >
            <span>🎈</span>
            <span>أطفال</span>
          </Link>
          <Link
            href="/#how-it-works"
            className="hover:text-spark-flame transition-colors"
          >
            كيف تعمل
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
            title={isMuted ? "تشغيل الصوت (M)" : "كتم الصوت (M)"}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-spark-flame" />
            )}
          </button>

          {/* Random Spark Rescue Button */}
          {onOpenRandomSpark && (
            <button
              onClick={onOpenRandomSpark}
              className="px-3.5 py-2.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100/80 text-spark-flame text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Dices className="w-4 h-4 text-spark-flame" />
              <span>🎲 أنقذني</span>
            </button>
          )}

          {/* Start Button */}
          {onOpenWizard ? (
            <button
              onClick={onOpenWizard}
              className="spark-glow-button px-5 py-2.5 rounded-xl text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-spark-flame/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>ابدأ الآن</span>
            </button>
          ) : (
            <Link
              href="/activities"
              className="spark-glow-button px-5 py-2.5 rounded-xl text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-spark-flame/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>ابدأ الآن</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {onOpenRandomSpark && (
            <button
              onClick={onOpenRandomSpark}
              className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-spark-flame text-xs font-bold flex items-center gap-1"
            >
              <Dices className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-5 space-y-4 animate-scale-in shadow-xl">
          <nav className="flex flex-col space-y-3 text-base font-bold text-slate-700">
            <Link
              href="/activities"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-50 hover:text-spark-flame transition-colors"
            >
              الأنشطة
            </Link>
            <Link
              href="/activities?audience=adults"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-50 hover:text-spark-flame transition-colors"
            >
              كبار وشباب
            </Link>
            <Link
              href="/kids"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-amber-50/70 text-amber-700 hover:bg-amber-50 transition-colors flex items-center gap-2"
            >
              <span>🎈</span>
              <span>أطفال</span>
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-50 hover:text-spark-flame transition-colors"
            >
              كيف تعمل
            </Link>
            <Link
              href="/join"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-50 hover:text-spark-flame transition-colors"
            >
              دخول غرفة برمز
            </Link>
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5">
            {onOpenWizard && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWizard();
                }}
                className="w-full spark-glow-button py-3 rounded-2xl text-white font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-spark-flame/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>ابدأ الآن</span>
              </button>
            )}

            <div className="flex items-center justify-between px-2 pt-1">
              <span className="text-xs text-slate-500 font-bold">المؤثرات الصوتية:</span>
              <button
                onClick={handleToggleSound}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-1.5"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-spark-flame" />}
                <span>{isMuted ? "مكتوم" : "مفعّل"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
