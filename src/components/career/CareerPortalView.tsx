import {
  Bookmark,
  Briefcase,
  Calendar,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  GraduationCap,
  MapPin,
  Search,
} from "lucide-react";
import React, { useState } from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";
import { CareerOpportunity } from "../../types";

export const CareerPortalView: React.FC = () => {
  const { career, handleToggleBookmark, isItemBookmarked, showToast } =
    useApp();
  const { currentUser } = useAuth();

  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [activeApplyModal, setActiveApplyModal] =
    useState<CareerOpportunity | null>(null);

  const filteredItems = career.filter((item) => {
    if (typeFilter !== "ALL" && item.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.company.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.skills.some((s) => s.toLowerCase().includes(q)) ||
        item.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApplyClick = (item: CareerOpportunity) => {
    setActiveApplyModal(item);
  };

  const handleConfirmApplication = () => {
    if (activeApplyModal) {
      if (!activeApplyModal.applyUrl.startsWith("https://")) {
        showToast(
          "No application link is available. Contact your department.",
          "info",
        );
        return;
      }
      window.open(activeApplyModal.applyUrl, "_blank", "noopener,noreferrer");
      setAppliedIds((prev) => [...prev, activeApplyModal.id]);
      showToast(
        `Application page opened. Complete your application with ${activeApplyModal.company}.`,
        "success",
      );
      setActiveApplyModal(null);
    }
  };

  return (
    <div className="space-y-5 pb-16 md:pb-6 text-left">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-900">
                <Briefcase className="w-5 h-5 text-emerald-700" />
              </span>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                Placement & Career Opportunities
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Training & Placement Cell, IPS University of Allahabad •
              Internships & Campus Recruitments
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span>Student:</span>
            <span className="text-blue-900 font-bold">{currentUser?.name}</span>
            <span className="text-slate-400">
              ({currentUser?.departmentCode})
            </span>
          </div>
        </div>

        {/* Search & Filter pills */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, job role, required skills (Python, SQL, React)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:bg-white text-slate-900 transition-all"
            />
          </div>

          <div className="sm:col-span-4 flex gap-1.5 overflow-x-auto hide-scrollbar">
            {["ALL", "Placement", "Internship", "Training"].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  typeFilter === type
                    ? "bg-emerald-800 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type === "ALL" ? "All Roles" : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const isApplied = appliedIds.includes(item.id);
          const isBookmarked = isItemBookmarked(item.id);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-200">
                      <img
                        src={item.companyLogo || "/campus-placeholder.svg"}
                        alt={item.company}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {item.company}
                      </h4>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.role}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleToggleBookmark({
                        itemType: "CAREER",
                        itemId: item.id,
                        title: `${item.company} - ${item.role}`,
                        subtitle: `${item.location} • ${item.stipendOrSalary}`,
                        category: item.type,
                        date: item.applicationDeadline,
                      })
                    }
                    className={`p-1.5 rounded-lg transition-colors ${
                      isBookmarked
                        ? "text-amber-500 bg-amber-50"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
                    />
                  </button>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap mb-3 text-xs">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span>{item.stipendOrSalary}</span>
                  </span>

                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{item.location}</span>
                  </span>

                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-semibold">
                    {item.type}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {item.description}
                </p>

                {/* Eligibility */}
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-1.5 mb-3">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-900 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">
                    <span className="font-semibold text-slate-700">
                      Eligibility:{" "}
                    </span>
                    {item.eligibility}
                  </span>
                </div>

                {/* Skills tags */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom action row */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Closes: {item.applicationDeadline}</span>
                </span>

                {isApplied ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-800 font-bold rounded-xl border border-emerald-200 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Application link opened</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleApplyClick(item)}
                    className="inline-flex items-center gap-1 px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold transition-all text-xs cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Apply Modal */}
      {activeApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4 text-left">
            <h3 className="text-base font-bold text-slate-900">
              Open application page to {activeApplyModal.company}
            </h3>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <p>
                <span className="text-slate-500">Role:</span>{" "}
                <strong className="text-slate-900">
                  {activeApplyModal.role}
                </strong>
              </p>
              <p>
                <span className="text-slate-500">Applicant:</span>{" "}
                <strong className="text-slate-900">{currentUser?.name}</strong>
              </p>
              <p>
                <span className="text-slate-500">Student ID:</span>{" "}
                <strong className="font-mono text-blue-900">
                  {currentUser?.studentOrEmpId}
                </strong>
              </p>
              <p>
                <span className="text-slate-500">Department:</span>{" "}
                <strong className="text-slate-900">
                  {currentUser?.departmentCode}
                </strong>
              </p>
              <p>
                <span className="text-slate-500">Email:</span>{" "}
                <strong className="text-slate-900">{currentUser?.email}</strong>
              </p>
            </div>

            <p className="text-xs text-slate-500">
              Your verified academic record and resume on file with IPS
              Placement Cell will be transmitted to {activeApplyModal.company}.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveApplyModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApplication}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
