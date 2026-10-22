import { CheckCircle2, Send } from "lucide-react";
import React, { useState } from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";
import { ClassNoticeType, FacultyClassAssignment } from "../../types";

export const FacultyDirectNoticeView: React.FC = () => {
  const { currentUser } = useAuth();
  const { handleSendClassNotice, getFacultySentClassNotices } = useApp();

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

  const [selectedClassId, setSelectedClassId] = useState(
    assignedClasses[0]?.id || "",
  );
  const [noticeType, setNoticeType] = useState<ClassNoticeType>("ROOM_CHANGED");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const selectedClass =
    assignedClasses.find((c) => c.id === selectedClassId) || assignedClasses[0];
  const sentNotices = getFacultySentClassNotices();

  const presets = [
    {
      type: "ROOM_CHANGED" as ClassNoticeType,
      label: "Room Relocation",
      defaultTitle: "Class Room Relocation Notice",
      defaultMsg: `Today's ${selectedClass?.subjectName} class will be conducted in Computer Lab 3 instead of ${selectedClass?.room}. Please arrive on time.`,
    },
    {
      type: "CLASS_CANCELLED" as ClassNoticeType,
      label: "Class Cancelled",
      defaultTitle: "Class Postponed / Not Conducted Today",
      defaultMsg: `Today's ${selectedClass?.subjectName} lecture cannot be conducted due to an unavoidable departmental meeting. Next lecture resumes as scheduled.`,
    },
    {
      type: "ASSIGNMENT_REMINDER" as ClassNoticeType,
      label: "Assignment Reminder",
      defaultTitle: "Assignment Hardcopy Submission Due",
      defaultMsg: `Please submit your assignment problem sets before 04:00 PM at Faculty Cabin #3.`,
    },
    {
      type: "LAB_UPDATE" as ClassNoticeType,
      label: "Lab Preparation",
      defaultTitle: "Lab Equipment & Software Setup Required",
      defaultMsg: `Please bring your lab observation notebooks and ensure your local MySQL/PostgreSQL workspace is configured before attending today's practical session.`,
    },
  ];

  const handleApplyPreset = (preset: (typeof presets)[0]) => {
    setNoticeType(preset.type);
    setTitle(preset.defaultTitle);
    setMessage(preset.defaultMsg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    handleSendClassNotice({
      facultyId: currentUser?.id || "user-faculty-1",
      facultyName: currentUser?.name || "Faculty Member",
      facultyDesignation: currentUser?.designation || "Assistant Professor",
      departmentCode: currentUser?.departmentCode || "CCET",
      course: selectedClass.course,
      semester: selectedClass.semester,
      subjectCode: selectedClass.subjectCode,
      subjectName: selectedClass.subjectName,
      title: title.trim(),
      message: message.trim(),
      noticeType,
    });

    setTitle("");
    setMessage("");
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 text-left max-w-3xl mx-auto">
      {/* Header bar */}
      <div className="co-surface-banner text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1 rounded-md bg-amber-400 text-slate-950 font-semibold text-xs">
            DIRECT
          </span>
          <span className="text-xs font-bold text-amber-300">
            Faculty-to-Class Broadcast
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-white">
          Direct Class Communication
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-xl">
          Instantly notify students enrolled in your assigned classes about
          cancellations, room changes, and assignment updates without requiring
          HOD approval.
        </p>
      </div>

      {/* Composer Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-indigo-700" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Compose Direct Class Notice
            </h3>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Bypasses HOD Queue ✓
          </span>
        </div>

        {/* 1. Target Class Selection */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Select Your Assigned Class:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {assignedClasses.map((cls) => {
              const isSelected = selectedClassId === cls.id;
              return (
                <div
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/10"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-indigo-950">
                      {cls.course} • Semester {cls.semester}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {cls.studentCount} Students
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mt-1">
                    {cls.subjectName}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {cls.subjectCode} • {cls.room}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Quick Presets */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Quick Templates:
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {presets.map((preset) => (
              <button
                key={preset.type}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 text-slate-700 text-[11px] font-semibold transition-all border border-slate-200 shrink-0 cursor-pointer active:scale-95"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Title */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Notice Title:
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Today's Class Moved to Lab 3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600 focus:bg-white transition-all font-medium"
          />
        </div>

        {/* 4. Message */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Message to Students:
          </label>
          <textarea
            required
            rows={3}
            placeholder="Enter class-specific instructions..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">
            Target Audience:{" "}
            <strong>
              {selectedClass.course} Sem {selectedClass.semester} (
              {selectedClass.studentCount} students)
            </strong>
          </p>

          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded-2xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Send className="w-3.5 h-3.5 text-amber-400" />
            <span>Send Direct Class Notice</span>
          </button>
        </div>
      </form>

      {/* History of Sent Class Notices */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-extrabold text-sm text-slate-900">
            Sent Class Notices Log ({sentNotices.length})
          </h3>
          <span className="text-[11px] text-slate-400">Delivered Directly</span>
        </div>

        {sentNotices.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            No direct class notices sent yet. Use the composer above to
            communicate directly with your classes.
          </p>
        ) : (
          <div className="space-y-3">
            {sentNotices.map((cn) => (
              <div
                key={cn.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2 text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-900 text-white">
                      {cn.course} Sem {cn.semester}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {cn.subjectCode}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(cn.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    •{" "}
                    {new Date(cn.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {cn.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {cn.message}
                </p>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Subject: {cn.subjectName}</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Delivered to Students
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
