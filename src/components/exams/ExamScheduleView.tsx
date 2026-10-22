import {
  AlertTriangle,
  Calendar,
  Clock,
  Download,
  FileCheck,
  GraduationCap,
  Info,
  MapPin,
} from "lucide-react";
import React, { useState } from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";

export const ExamScheduleView: React.FC = () => {
  const { exams, notices, setSelectedNotice, showToast } = useApp();
  const { currentUser } = useAuth();

  const [selectedCourse, setSelectedCourse] = useState<string>(
    currentUser?.course?.includes("BCA")
      ? "BCA"
      : currentUser?.course?.includes("MCA")
        ? "MCA"
        : "BCA",
  );
  const [selectedSemester, setSelectedSemester] = useState<number>(
    currentUser?.semester || 4,
  );

  const examNotices = notices.filter((n) => n.category === "Examination");

  const filteredExams = exams.filter((ex) => {
    return ex.course === selectedCourse && ex.semester === selectedSemester;
  });

  const handleDownloadHallTicket = () => {
    showToast(
      `Admit Card / Hall Ticket for ${currentUser?.name || "Student"} generated successfully!`,
      "success",
    );
  };

  return (
    <div className="space-y-5 pb-16 md:pb-6 text-left">
      {/* Top Banner */}
      <div className="co-surface-banner text-white rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-2 rounded-xl bg-amber-400 text-slate-950">
                <GraduationCap className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Examinations & Date Sheets
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Odd Semester Sessional Assessment & End-Term Examination Schedule
              (2026-27).
            </p>
          </div>

          <button
            onClick={handleDownloadHallTicket}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Digital Admit Slip</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Select Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full py-2 px-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              <option value="BCA">
                Bachelor of Computer Applications (BCA)
              </option>
              <option value="MCA">Master of Computer Applications (MCA)</option>
              <option value="B.Sc FT">B.Sc Food Technology (CFT)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="w-full py-2 px-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              <option value={2}>Semester II</option>
              <option value={4}>Semester IV</option>
              <option value={6}>Semester VI</option>
            </select>
          </div>
        </div>
      </div>

      {/* Examination Notice Ticker */}
      {examNotices.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2 text-rose-800 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Active Examination Circular</span>
          </div>
          <div className="space-y-1">
            <h4
              onClick={() => setSelectedNotice(examNotices[0])}
              className="text-xs sm:text-sm font-bold text-slate-900 hover:text-rose-700 cursor-pointer underline decoration-rose-300"
            >
              {examNotices[0].title}
            </h4>
            <p className="text-xs text-slate-600 line-clamp-1">
              {examNotices[0].description}
            </p>
          </div>
        </div>
      )}

      {/* Timetable List */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {selectedCourse} - Semester {selectedSemester} Timetable
            </h2>
            <p className="text-xs text-slate-500">
              Reporting time: 15 minutes before the exam commencement
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-900 font-bold text-xs border border-blue-200">
            {filteredExams.length} Papers
          </span>
        </div>

        {filteredExams.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            <Info className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700">
              Timetable for this semester is under preparation
            </p>
            <p>
              Please check the examination circulars board for recent updates.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredExams.map((exam, idx) => (
              <div
                key={exam.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-blue-900 text-white font-mono font-bold text-[11px]">
                      {exam.subjectCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-semibold text-[11px]">
                      Paper #{idx + 1}
                    </span>
                    <span className="text-xs text-slate-500">
                      {exam.examType}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {exam.subjectName}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-900" />
                      <span className="font-semibold text-slate-800">
                        {exam.date}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-900" />
                      <span>{exam.shift}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-900" />
                      <span className="font-semibold text-slate-800">
                        {exam.room}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Seating Verified</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* General Exam Guidelines */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
          <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-700" />
            <span>Essential Candidate Instructions:</span>
          </h4>
          <ul className="list-disc list-inside space-y-1 text-amber-800 leading-relaxed">
            <li>
              Candidates must occupy their allotted seats 15 minutes prior to
              start time.
            </li>
            <li>
              Possession of smartwatches, scientific programmable calculators,
              or phones is strictly penalized.
            </li>
            <li>
              Admit cards and student photo ID cards must remain placed on the
              examination desk throughout.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
