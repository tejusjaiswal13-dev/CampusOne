import {
  BellRing,
  Briefcase,
  CalendarDays,
  ChevronRight,
  Flame,
  GraduationCap,
  Radio,
  Sparkles,
} from "lucide-react";
import React from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";

export const CampusPulse: React.FC = () => {
  const { setCurrentTab, getStudentNotices, getStudentEvents, career, exams } =
    useApp();
  const { currentUser } = useAuth();

  const studentNotices = getStudentNotices();
  const studentEvents = getStudentEvents();

  // Dynamic calculations
  const urgentCount = studentNotices.filter((n) => n.isUrgent).length;
  const recentNoticesCount = Math.max(3, studentNotices.slice(0, 5).length);
  const activeEventsCount = studentEvents.filter(
    (e) => e.status === "APPROVED",
  ).length;
  const activeJobsCount = career.filter(
    (c) => c.status === "Open" || c.status === "Closing Soon",
  ).length;
  const upcomingExamsCount = exams.filter(
    (e) => e.departmentCode === (currentUser?.departmentCode || "CCET"),
  ).length;

  return (
    <div className="co-surface-banner rounded-3xl p-4 sm:p-6 text-white border border-slate-800 shadow-sm relative overflow-hidden">
      {/* Subtle background radar circles */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-52 h-52 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar: Live Activity Radar */}
      <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
                Campus Pulse
              </span>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              Real-time activity across Allahabad University & IPS Centers
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 bg-slate-800/60 px-3 py-1 rounded-full border border-slate-700/60">
          <Radio className="w-3 h-3 text-indigo-400 animate-pulse" />
          <span>Synchronized with Central Registry</span>
        </div>
      </div>

      {/* 4 Interactive Vitality Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 my-4 relative z-10">
        {/* Metric 1: Notices */}
        <button
          onClick={() => setCurrentTab("notices")}
          className="bg-slate-800/70 hover:bg-slate-800 p-3 sm:p-3.5 rounded-2xl border border-slate-700/70 hover:border-indigo-400/50 transition-all text-left group cursor-pointer active:scale-95 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 group-hover:scale-105 transition-transform">
              <BellRing className="w-4 h-4" />
            </div>
            {urgentCount > 0 ? (
              <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                {urgentCount} URGENT
              </span>
            ) : (
              <span className="text-[11px] font-bold text-blue-300 bg-blue-900/60 px-1.5 py-0.5 rounded">
                NEW
              </span>
            )}
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-semibold text-white">
                {recentNoticesCount}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                notices today
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 group-hover:text-blue-300 transition-colors">
              <span>View feed</span>
              <ChevronRight className="w-2.5 h-2.5" />
            </p>
          </div>
        </button>

        {/* Metric 2: Events */}
        <button
          onClick={() => setCurrentTab("events")}
          className="bg-slate-800/70 hover:bg-slate-800 p-3 sm:p-3.5 rounded-2xl border border-slate-700/70 hover:border-amber-400/50 transition-all text-left group cursor-pointer active:scale-95 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:scale-105 transition-transform">
              <CalendarDays className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-amber-300 bg-amber-900/60 px-1.5 py-0.5 rounded">
              OPEN SEATS
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-semibold text-white">
                {activeEventsCount}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                events this week
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 group-hover:text-amber-300 transition-colors">
              <span>Reserve passes</span>
              <ChevronRight className="w-2.5 h-2.5" />
            </p>
          </div>
        </button>

        {/* Metric 3: Placements */}
        <button
          onClick={() => setCurrentTab("career")}
          className="bg-slate-800/70 hover:bg-slate-800 p-3 sm:p-3.5 rounded-2xl border border-slate-700/70 hover:border-emerald-400/50 transition-all text-left group cursor-pointer active:scale-95 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-emerald-300 bg-emerald-900/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Flame className="w-2.5 h-2.5 text-amber-400" />
              HOT
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-semibold text-white">
                {activeJobsCount}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                active drives
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 group-hover:text-emerald-300 transition-colors">
              <span>View openings</span>
              <ChevronRight className="w-2.5 h-2.5" />
            </p>
          </div>
        </button>

        {/* Metric 4: Exams & Deadlines */}
        <button
          onClick={() => setCurrentTab("exams")}
          className="bg-slate-800/70 hover:bg-slate-800 p-3 sm:p-3.5 rounded-2xl border border-slate-700/70 hover:border-purple-400/50 transition-all text-left group cursor-pointer active:scale-95 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-purple-300 bg-purple-900/60 px-1.5 py-0.5 rounded">
              SEMESTER
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-semibold text-white">
                {upcomingExamsCount}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                scheduled papers
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 group-hover:text-purple-300 transition-colors">
              <span>Check datesheet</span>
              <ChevronRight className="w-2.5 h-2.5" />
            </p>
          </div>
        </button>
      </div>

      {/* Live Campus Ticker Bar */}
      <div className="pt-2.5 border-t border-slate-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs relative z-10">
        <div className="flex items-center gap-2 text-slate-300 truncate">
          <span className="p-1 rounded-md bg-amber-400/20 text-amber-300 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className="font-semibold text-white">Campus Highlight:</span>
          <span className="truncate text-slate-300 text-[11px] sm:text-xs">
            TCS National Qualifier Test (NQT) registrations open for CCET 2027
            batch.
          </span>
        </div>

        <button
          onClick={() => setCurrentTab("calendar")}
          className="text-[11px] font-bold text-indigo-300 hover:text-indigo-200 transition-colors flex items-center gap-1 self-end sm:self-auto shrink-0 cursor-pointer"
        >
          <span>Full Academic Term</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
