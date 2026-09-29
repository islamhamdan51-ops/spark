"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Sparkles, ArrowLeft, Printer, RotateCcw, CheckCircle2, 
  Clock, Users, Trophy, Flame, Shield, FileText, ChevronRight 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { SessionReport } from "@/types";

export default function SessionReportPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params?.id as string;

  const [report, setReport] = useState<SessionReport | null>(null);
  const [facilitatorNote, setFacilitatorNote] = useState<string>("");
  const [isSavedNote, setIsSavedNote] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("spark_session_reports");
        if (stored) {
          const reports: SessionReport[] = JSON.parse(stored);
          const found = reports.find((r) => r.id === reportId || r.sessionId === reportId);
          if (found) {
            setReport(found);
            setFacilitatorNote(found.facilitatorNotes || "");
          } else if (reports.length > 0) {
            setReport(reports[0]);
            setFacilitatorNote(reports[0].facilitatorNotes || "");
          }
        }
      } catch {}
    }
  }, [reportId]);

  const handleSaveNote = () => {
    if (!report) return;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("spark_session_reports");
        const reports: SessionReport[] = stored ? JSON.parse(stored) : [];
        const updated = reports.map((r) => r.id === report.id ? { ...r, facilitatorNotes: facilitatorNote } : r);
        localStorage.setItem("spark_session_reports", JSON.stringify(updated));
        setIsSavedNote(true);
        setTimeout(() => setIsSavedNote(false), 2000);
      } catch {}
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (!report) {
    return (
      <div className="min-h-screen bg-[#F4F9FD] flex flex-col font-arabic">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#EAF7FF] text-[#2F8FD8] flex items-center justify-center mx-auto text-xl">
            📄
          </div>
          <h2 className="text-xl font-bold text-[#17324D]">جاري تحميل تقرير الجلسة...</h2>
          <p className="text-xs text-[#60788C]">إذا لم يظهر التقرير، يمكنك العودة لصفحة الجلسات.</p>
          <Link
            href="/sessions"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#2F8FD8] text-white text-xs font-bold"
          >
            العودة للجلسات
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F9FD] text-[#17324D] flex flex-col font-arabic print:bg-white print:p-0">
      {/* Hide navbar on print */}
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 print:py-0 print:px-0">
        
        {/* Top bar with Print/Download CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2EEF8] print:hidden">
          <Link
            href="/sessions"
            className="p-2 rounded-lg bg-white border border-[#E2EEF8] hover:bg-[#F4F9FD] text-[#60788C] text-xs font-bold inline-flex items-center gap-1.5 self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>العودة للجلسات</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white border border-[#E2EEF8] text-[#17324D] hover:bg-[#F4F9FD] text-xs font-bold flex items-center gap-2 shadow-2xs transition-colors"
            >
              <Printer className="w-4 h-4 text-[#2F8FD8]" />
              <span>طباعة / حفظ كـ PDF</span>
            </button>

            <Link
              href="/sessions"
              className="px-4 py-2 rounded-xl bg-[#2F8FD8] text-white hover:bg-[#1F7EC7] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>كرر الجلسة</span>
            </Link>
          </div>
        </div>

        {/* Printable Official Session Report Card */}
        <div className="bg-white rounded-3xl border border-[#E2EEF8] p-6 sm:p-10 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E2EEF8] pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF7FF] text-[#2F8FD8] text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>تقرير جلسة معتمد • SPARK Session Report</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#17324D]">
                {report.sessionTitleAr}
              </h1>
              <p className="text-xs sm:text-sm text-[#60788C] mt-1 font-medium">
                تاريخ الجلسة: {new Date(report.createdAt).toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-[11px] font-mono text-[#60788C] block">رمز الجلسة:</span>
              <span className="text-xs font-mono font-bold text-[#17324D] bg-[#F4F9FD] px-2.5 py-1 rounded-md border border-[#E2EEF8] inline-block mt-0.5">
                {report.sessionId}
              </span>
            </div>
          </div>

          {/* Key Executive Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8] text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-[#17324D] font-mono">
                {report.participantCount}
              </span>
              <span className="text-xs text-[#60788C] font-bold block">مشاركاً حاضراً</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8] text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-[#2F8FD8] font-mono">
                {report.actualDurationMinutes}د
              </span>
              <span className="text-xs text-[#60788C] font-bold block">المدة الفعلية</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8] text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                {report.completionRatePercent}%
              </span>
              <span className="text-xs text-[#60788C] font-bold block">نسبة الإنجاز</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8] text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-amber-500 font-mono">
                {report.participationSignal === "high" ? "عالية 🔥" : "متوسطة 🌤️"}
              </span>
              <span className="text-xs text-[#60788C] font-bold block">إشارة التفاعل</span>
            </div>
          </div>

          {/* Completed Activities Journey */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-[#17324D] flex items-center justify-between">
              <span>مسار الأنشطة المنجزة ({report.completedActivities?.length || report.completedStagesCount}):</span>
              <span className="text-xs text-[#2F8FD8] font-normal">
                النشاط الأبرز: {report.mostEngagingActivityTitleAr}
              </span>
            </h3>

            <div className="space-y-2 border border-[#E2EEF8] rounded-2xl p-4 bg-[#F4F9FD]/50">
              {(report.completedActivities || []).map((act, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E2EEF8] text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-bold text-[#17324D]">{act.titleAr}</span>
                    <span className="text-[10px] text-[#60788C] bg-[#F4F9FD] px-2 py-0.5 rounded border border-[#E2EEF8]">
                      {act.stageType}
                    </span>
                  </div>
                  <span className="font-mono text-[#60788C]">{act.durationMinutes} دقائق</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pulse History Progress */}
          {report.pulseHistory && report.pulseHistory.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#17324D]">
                معدل طاقة المجموعة خلال الجلسة (Session Pulse Trend):
              </h3>
              <div className="flex items-center gap-2 p-4 rounded-2xl bg-[#F4F9FD] border border-[#E2EEF8]">
                {report.pulseHistory.map((p, idx) => (
                  <div key={idx} className="flex-1 text-center p-2 rounded-xl bg-white border border-[#E2EEF8]">
                    <span className="text-lg block">
                      {p.level === "high" ? "🔥" : p.level === "medium" ? "🌤️" : "🧊"}
                    </span>
                    <span className="text-[10px] font-bold text-[#60788C] block mt-1">
                      {p.stageTitleAr}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facilitator Notes Section */}
          <div className="space-y-2 pt-2 border-t border-[#E2EEF8]">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#17324D]">
                ملاحظات وتوصيات الميسر (Facilitator Notes):
              </h3>
              {isSavedNote && (
                <span className="text-xs text-emerald-600 font-bold">تم حفظ الملاحظات! ✓</span>
              )}
            </div>

            <textarea
              rows={3}
              value={facilitatorNote}
              onChange={(e) => setFacilitatorNote(e.target.value)}
              placeholder="اكتب ملاحظاتك حول تفاعل المجموعة، النقاط التي لمعت، وتوصيات اللقاء القادم..."
              className="w-full p-3.5 rounded-xl border border-[#E2EEF8] bg-[#F4F9FD] text-xs text-[#17324D] focus:outline-none focus:border-[#2F8FD8] leading-relaxed print:bg-white print:border-none print:p-0"
            />

            <div className="flex justify-end print:hidden">
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-xl bg-[#2F8FD8] hover:bg-[#1F7EC7] text-white text-xs font-bold shadow-2xs"
              >
                حفظ الملاحظة
              </button>
            </div>
          </div>

          {/* Print Footer */}
          <div className="hidden print:flex items-center justify-between pt-6 border-t border-[#E2EEF8] text-[11px] text-[#60788C]">
            <span>تم توليد التقرير آلياً عبر منصة SPARK (شرارة) لتيسير الجلسات الجماعية.</span>
            <span>https://spark.platform</span>
          </div>

        </div>

      </main>
    </div>
  );
}
