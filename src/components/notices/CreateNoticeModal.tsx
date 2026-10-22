import { AlertCircle, Paperclip, PlusCircle, X } from "lucide-react";
import React, { useState } from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";
import { ContentScope, NoticeCategory } from "../../types";

export const CreateNoticeModal: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { isCreateNoticeOpen, setIsCreateNoticeOpen, handleCreateNotice } =
    useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<NoticeCategory>("General");
  const [scope, setScope] = useState<ContentScope>(
    role === "COLLEGE_ADMIN" ? "COLLEGE" : "DEPARTMENT",
  );
  const [isUrgent, setIsUrgent] = useState(false);
  const [deadline, setDeadline] = useState("");
  const attachmentName = "Official_Circular.pdf";

  if (!isCreateNoticeOpen) return null;

  const isFaculty = role === "FACULTY";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    handleCreateNotice({
      title,
      description,
      category,
      scope,
      isUrgent,
      deadline: deadline || undefined,
      attachmentName,
    });

    setIsCreateNoticeOpen(false);
    setTitle("");
    setDescription("");
    setDeadline("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] text-left">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">
              {isFaculty
                ? "Draft Notice Proposal (Requires HOD Approval)"
                : "Publish Official Campus Notice"}
            </h2>
          </div>
          <button
            onClick={() => setIsCreateNoticeOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Info Banner */}
        {isFaculty && (
          <div className="bg-amber-50 border-b border-amber-200 p-3 flex items-center gap-2 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              As faculty, your submission will be set to{" "}
              <strong>Pending Approval</strong> and forwarded to your Department
              HOD.
            </span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 overflow-y-auto space-y-4 flex-1 text-xs"
        >
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Notice Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sessional Examination Timetable / Workshop Proposal..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-900 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold cursor-pointer"
              >
                <option value="General">General</option>
                <option value="Academic">Academic</option>
                <option value="Examination">Examination</option>
                <option value="Department">Department</option>
                <option value="Placement">Placement</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Seminar">Seminar</option>
                <option value="Workshop">Workshop</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Scope
              </label>
              <select
                value={scope}
                disabled={role === "FACULTY"}
                onChange={(e) => setScope(e.target.value as ContentScope)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold cursor-pointer disabled:bg-slate-100"
              >
                <option value="DEPARTMENT">
                  Department Only ({currentUser?.departmentCode})
                </option>
                {role === "COLLEGE_ADMIN" && (
                  <option value="COLLEGE">Entire College (All Students)</option>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full text of the circular, guidelines, eligibility, and instructions..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-900 focus:bg-white leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Last Date / Deadline (Optional)
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 cursor-pointer"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Attachment (PDF)
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
                <Paperclip className="w-4 h-4 text-slate-400" />
                <span className="truncate text-[11px]">{attachmentName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="urgent-check"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded cursor-pointer"
            />
            <label
              htmlFor="urgent-check"
              className="font-bold text-rose-700 cursor-pointer"
            >
              Mark as Urgent / Priority Directive (Highlights on Student
              Dashboard)
            </label>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateNoticeOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs cursor-pointer"
            >
              {isFaculty ? "Submit for HOD Approval" : "Publish Notice Live"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
