import { BookOpen, Clock, MapPin, Send, Users } from "lucide-react";
import React from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";
import { DEPARTMENT_TIMETABLES } from "../../data/timetableData";
import { FacultyClassAssignment } from "../../types";

export const FacultyClassesView: React.FC = () => {
  const { currentUser } = useAuth();
  const { setCurrentTab } = useApp();

  const assignedClasses: FacultyClassAssignment[] =
    currentUser?.assignedClasses || [
      {
        id: "cls-assign-1",
        course: "BCA",
        semester: 5,
        subjectCode: "BCA-502",
        subjectName: "Database Management Systems & SQL",
        room: "Room B-204 (2nd Floor)",
        studentCount: 64,
      },
      {
        id: "cls-assign-2",
        course: "MCA",
        semester: 3,
        subjectCode: "MCA-301",
        subjectName: "Advanced Database Systems & Distributed NoSQL",
        room: "Software Lab 2",
        studentCount: 48,
      },
    ];

  // Extract teaching schedule for Dr. Pradeep Kumar
  const ccetWeek = DEPARTMENT_TIMETABLES["CCET"] || [];
  const teachingSessions = ccetWeek.flatMap((day) =>
    day.classes
      .filter(
        (c) => c.facultyName.includes("Pradeep") || c.subjectCode === "BCA-502",
      )
      .map((c) => ({ ...c, dayOfWeek: day.day })),
  );

  return (
    <div className="space-y-6 pb-20 md:pb-8 text-left max-w-3xl mx-auto">
      {/* Header */}
      <div className="co-surface-banner text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 mb-1.5">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-300">
            Teaching Workload & Allocations
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-white">
          My Assigned Classes
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Assigned course modules, classroom rooms, and weekly lecture schedules
          for Odd Semester 2026-27.
        </p>
      </div>

      {/* Class Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Active Subject Allocations ({assignedClasses.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignedClasses.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-indigo-900 text-white">
                  {cls.course} • Semester {cls.semester}
                </span>
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                  {cls.subjectCode}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {cls.subjectName}
                </h4>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{cls.room}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cls.studentCount} Students Enrolled</span>
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setCurrentTab("students")}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  View Roster →
                </button>
                <button
                  onClick={() => setCurrentTab("class-notices")}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Send className="w-3 h-3 text-indigo-700" />
                  <span>Send Notice</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Lecture Schedule */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-700" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Weekly Teaching Timetable
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">6 Lectures / Week</span>
        </div>

        <div className="space-y-2.5">
          {teachingSessions.map((session) => (
            <div
              key={session.id}
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-900">
                    {session.dayOfWeek}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800">
                    {session.timeDisplay}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-900">
                  {session.subjectName}
                </h5>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 sm:text-right">
                <MapPin className="w-3 h-3 text-amber-500" />
                <span>{session.room}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
