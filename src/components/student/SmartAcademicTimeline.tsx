import { Calendar, ChevronRight, Clock, MapPin } from "lucide-react";
import React, { useState } from "react";
import { useApp } from "../../context/AppState";

interface TimelineNode {
  id: string;
  timeframe: "TODAY" | "TOMORROW" | "FRIDAY" | "NEXT WEEK";
  dateLabel: string;
  title: string;
  category: "EXAMINATION" | "SEMINAR" | "DEADLINE" | "WORKSHOP";
  locationOrDept: string;
  timeOrStatus: string;
  description: string;
  actionTab?: string;
  isUrgent?: boolean;
}

export const SmartAcademicTimeline: React.FC = () => {
  const { setCurrentTab } = useApp();
  const [activeNodeId, setActiveNodeId] = useState<string>("node-1");

  const timelineItems: TimelineNode[] = [
    {
      id: "node-1",
      timeframe: "TODAY",
      dateLabel: "Sep 29",
      title: "Odd Semester Exam Form Verification Desk",
      category: "DEADLINE",
      locationOrDept: "Room 104, IPS Directorate",
      timeOrStatus: "10:00 AM - 04:30 PM",
      description:
        "Physical document submission and subject elective approval for Semester 3 & 5 candidates.",
      actionTab: "exams",
      isUrgent: true,
    },
    {
      id: "node-2",
      timeframe: "TOMORROW",
      dateLabel: "Sep 30",
      title: "Cloud Architecture & DevOps Colloquium",
      category: "SEMINAR",
      locationOrDept: "Seminar Hall A, Science Complex",
      timeOrStatus: "10:30 AM - 12:30 PM",
      description:
        "Dr. Rahul Verma hosts industry AWS Solutions Architect for scalable distributed systems seminar.",
      actionTab: "events",
    },
    {
      id: "node-3",
      timeframe: "FRIDAY",
      dateLabel: "Oct 02",
      title: "AI & Machine Learning Boot Camp (Registration Cutoff)",
      category: "WORKSHOP",
      locationOrDept: "Computer Complex Lab 3",
      timeOrStatus: "Closing at 11:59 PM",
      description:
        "Hands-on neural networks workshop with digital certificate. Reserve passes early before quota closes.",
      actionTab: "events",
    },
    {
      id: "node-4",
      timeframe: "NEXT WEEK",
      dateLabel: "Oct 06",
      title: "First Sessional Examinations Commencing",
      category: "EXAMINATION",
      locationOrDept: "All 5 IPS Centers",
      timeOrStatus: "Shift 1: 09:00 AM",
      description:
        "Centralized mid-term evaluations for CCET, CFT, CMS, CFDT, and CTF. Check official room allocations.",
      actionTab: "exams",
      isUrgent: true,
    },
  ];

  const getCategoryBadge = (category: TimelineNode["category"]) => {
    switch (category) {
      case "EXAMINATION":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "SEMINAR":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "WORKSHOP":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "DEADLINE":
        return "bg-amber-50 text-amber-800 border-amber-200";
    }
  };

  const getTimeframeBadge = (timeframe: TimelineNode["timeframe"]) => {
    switch (timeframe) {
      case "TODAY":
        return "bg-emerald-500 text-white";
      case "TOMORROW":
        return "bg-blue-600 text-white";
      case "FRIDAY":
        return "bg-purple-600 text-white";
      case "NEXT WEEK":
        return "bg-slate-800 text-white";
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm text-left space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Smart Academic Timeline
            </h3>
            <p className="text-xs text-slate-500">
              Interactive milestone roadmap organized by urgency
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentTab("calendar")}
          className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
        >
          <span>Full Calendar</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stepper Node Track */}
      <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200 before:hidden sm:before:block">
        {timelineItems.map((item) => {
          const isActive = activeNodeId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setActiveNodeId(item.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer text-left relative ${
                isActive
                  ? "border-indigo-300 ring-2 ring-indigo-500/10 bg-indigo-50/40 shadow-xs"
                  : "border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50/60"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full shadow-2xs ${getTimeframeBadge(
                      item.timeframe,
                    )}`}
                  >
                    {item.timeframe}
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    {item.dateLabel}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getCategoryBadge(
                      item.category,
                    )}`}
                  >
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="font-semibold text-slate-700">
                    {item.timeOrStatus}
                  </span>
                </div>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                {item.title}
              </h4>

              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{item.locationOrDept}</span>
                </div>

                {item.actionTab && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentTab(item.actionTab!);
                    }}
                    className="font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View Portal</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
