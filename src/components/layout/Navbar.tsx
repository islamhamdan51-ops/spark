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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E2EEF8] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#EAF7FF] border border-[#C9ECFF] flex items-center justify-center text-[#2F8FD8] group-hover:bg-[#DDF2FF] transition-colors">
            <Sparkles className="w-5 h-5 text-[#2F8FD8]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-[#17324D] font-arabic">
              شرارة
            </span>
            <span className="text-[11px] tracking-wider text-[#60788C] font-mono font-medium">
              SPARK
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#60788C]">
          <Link
            href="/activities"
            className="hover:text-[#17324D] transition-colors"
          >
            الأنشطة
          </Link>
          <Link
            href="/activities?audience=adults"
            className="hover:text-[#17324D] transition-colors"
          >
            الكبار
          </Link>
          <Link
            href="/kids"
            className="hover:text-[#17324D] transition-colors"
          >
            الأطفال
          </Link>
          <Link
            href="/#how-it-works"
            className="hover:text-[#17324D] transition-colors"
          >
            كيف تعمل
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Sound Toggle - Discreet */}
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
            title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
            className="p-2 rounded-lg text-[#60788C] hover:text-[#17324D] hover:bg-[#F4F9FD] transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-[#A0AEC0]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#2F8FD8]" />
            )}
          </button>

          {/* Primary Action Button: [ابدأ] - Dominant and Clean */}
          {onOpenWizard ? (
            <button
              onClick={onOpenWizard}
              className="bg-[#2F8FD8] hover:bg-[#1F7EC7] active:scale-98 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>ابدأ</span>
            </button>
          ) : (
            <Link
              href="/activities"
              className="bg-[#2F8FD8] hover:bg-[#1F7EC7] active:scale-98 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>ابدأ</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {onOpenWizard ? (
            <button
              onClick={onOpenWizard}
              className="bg-[#2F8FD8] hover:bg-[#1F7EC7] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              ابدأ
            </button>
          ) : (
            <Link
              href="/activities"
              className="bg-[#2F8FD8] hover:bg-[#1F7EC7] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              ابدأ
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#17324D] hover:bg-[#F4F9FD]"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2EEF8] bg-white p-5 space-y-3 animate-scale-in shadow-lg">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-[#17324D]">
            <Link
              href="/activities"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-[#F4F9FD] transition-colors"
            >
              الأنشطة
            </Link>
            <Link
              href="/activities?audience=adults"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-[#F4F9FD] transition-colors"
            >
              الكبار
            </Link>
            <Link
              href="/kids"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-[#F4F9FD] transition-colors"
            >
              الأطفال
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-[#F4F9FD] transition-colors"
            >
              كيف تعمل
            </Link>
            <Link
              href="/join"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-[#F4F9FD] transition-colors"
            >
              دخول غرفة برمز
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
