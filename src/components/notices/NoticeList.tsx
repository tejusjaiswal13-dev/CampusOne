import { BellRing, PlusCircle, Search, SlidersHorizontal } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";
import { NoticeCategory } from "../../types";
import { EmptyState } from "../common/EmptyState";
import { NoticeCard } from "./NoticeCard";
import { NoticeDetailModal } from "./NoticeDetailModal";

export const NoticeList: React.FC = () => {
  const {
    notices,
    departments,
    selectedNotice,
    setSelectedNotice,
    setIsCreateNoticeOpen,
  } = useApp();
  const { currentUser, role } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [scopeFilter, setScopeFilter] = useState<"PERSONAL" | "ALL" | string>(
    "PERSONAL",
  );
  const [sortBy, setSortBy] = useState<"LATEST" | "URGENT" | "DEADLINE">(
    "LATEST",
  );

  const categories: Array<{ id: string; label: string }> = [
    { id: "ALL", label: "All Notices" },
    { id: "Urgent", label: "Urgent" },
    { id: "Examination", label: "Examination" },
    { id: "Academic", label: "Academic" },
    { id: "Department", label: "Department" },
    { id: "Placement", label: "Placement" },
    { id: "Scholarship", label: "Scholarship" },
    { id: "Seminar", label: "Seminars & Talks" },
  ];

  // Filter and sort notices
  const filteredNotices = useMemo(() => {
    return notices
      .filter((notice) => {
        // Only show approved notices in public feed
        if (notice.status !== "APPROVED") return false;

        // Scope filter
        if (scopeFilter === "PERSONAL") {
          if (notice.scope === "COLLEGE") return true;
          if (currentUser?.departmentCode) {
            return (
              notice.departmentCode?.toUpperCase() ===
              currentUser.departmentCode.toUpperCase()
            );
          }
          return true;
        } else if (scopeFilter === "ALL") {
          return true;
        } else {
          // specific department code selected
          return (
            notice.departmentCode?.toUpperCase() === scopeFilter.toUpperCase()
          );
        }
      })
      .filter((notice) => {
        // Category filter
        if (selectedCategory === "ALL") return true;
        if (selectedCategory === "Urgent") return notice.isUrgent;
        return notice.category === (selectedCategory as NoticeCategory);
      })
      .filter((notice) => {
        // Search query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          notice.title.toLowerCase().includes(q) ||
          notice.description.toLowerCase().includes(q) ||
          (notice.departmentCode &&
            notice.departmentCode.toLowerCase().includes(q)) ||
          notice.publisherName.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "URGENT") {
          if (a.isUrgent && !b.isUrgent) return -1;
          if (!a.isUrgent && b.isUrgent) return 1;
        }
        if (sortBy === "DEADLINE") {
          if (a.deadline && !b.deadline) return -1;
          if (!a.deadline && b.deadline) return 1;
          if (a.deadline && b.deadline) {
            return (
              new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            );
          }
        }
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      });
  }, [
    notices,
    scopeFilter,
    selectedCategory,
    searchQuery,
    sortBy,
    currentUser,
  ]);

  return (
    <div className="space-y-5 pb-16 md:pb-6 text-left">
      {/* Header section */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="p-2 rounded-xl"
                style={{ backgroundColor: "#eef2f8", color: "#0a1628" }}
              >
                <BellRing className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                Campus Notices & Circulars
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Authoritative updates across all 5 centers of Institute of
              Professional Studies, UoA.
            </p>
          </div>

          {(role === "COLLEGE_ADMIN" ||
            role === "DEPARTMENT_ADMIN" ||
            role === "FACULTY") && (
            <button
              onClick={() => setIsCreateNoticeOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
              style={{ backgroundColor: "#0a1628" }}
            >
              <PlusCircle className="w-4 h-4" />
              <span>
                {role === "FACULTY"
                  ? "Submit Notice Proposal"
                  : "Publish Notice"}
              </span>
            </button>
          )}
        </div>

        {/* Search bar & Sort Controls */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, subject, department, or deadline..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white text-slate-900 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
            >
              <option value="LATEST">Sort: Latest Published</option>
              <option value="URGENT">Sort: Urgent First</option>
              <option value="DEADLINE">Sort: Deadline Approaching</option>
            </select>
          </div>
        </div>

        {/* Scope selector tabs */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setScopeFilter("PERSONAL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              scopeFilter === "PERSONAL"
                ? "text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            style={
              scopeFilter === "PERSONAL" ? { backgroundColor: "#0a1628" } : {}
            }
          >
            Personalized Feed (
            {currentUser?.departmentCode
              ? `College + ${currentUser.departmentCode}`
              : "All"}
            )
          </button>

          <button
            onClick={() => setScopeFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              scopeFilter === "ALL"
                ? "text-white shadow-xs font-bold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            style={scopeFilter === "ALL" ? { backgroundColor: "#0a1628" } : {}}
          >
            All College Notices
          </button>

          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setScopeFilter(dept.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                scopeFilter === dept.code
                  ? "font-bold shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              style={
                scopeFilter === dept.code
                  ? { backgroundColor: "#f59e0b", color: "#0a1628" }
                  : {}
              }
            >
              {dept.code} Dept
            </button>
          ))}
        </div>

        {/* Category pills */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? "text-white font-bold"
                  : "text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100"
              }`}
              style={
                selectedCategory === cat.id
                  ? { backgroundColor: "#0a1628" }
                  : {}
              }
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notice Feed Status bar */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500">
        <p>
          Showing{" "}
          <span className="font-bold text-slate-900">
            {filteredNotices.length}
          </span>{" "}
          published circulars
        </p>
        <span className="text-[11px] text-slate-400">
          Department-Aware Verified Feed
        </span>
      </div>

      {/* Notice Cards Grid */}
      {filteredNotices.length === 0 ? (
        <EmptyState
          title="No notices found"
          description="There are no active notices matching your current filter and search criteria."
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery("");
            setSelectedCategory("ALL");
            setScopeFilter("PERSONAL");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onClick={() => setSelectedNotice(notice)}
            />
          ))}
        </div>
      )}

      {/* Notice Detail Modal */}
      <NoticeDetailModal
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
      />
    </div>
  );
};
