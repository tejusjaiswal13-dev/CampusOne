import {
  ArrowLeft,
  BellRing,
  Building2,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import React, { useState } from "react";
import { useApp } from "../../context/AppState";
import { Department } from "../../types";

interface DepartmentDetailViewProps {
  department: Department;
  onBack: () => void;
}

export const DepartmentDetailView: React.FC<DepartmentDetailViewProps> = ({
  department,
  onBack,
}) => {
  const {
    notices,
    events,
    faculty,
    setSelectedNotice,
    setSelectedEvent,
    showToast,
  } = useApp();
  const [activeTab, setActiveTab] = useState<
    "ABOUT" | "COURSES" | "FACULTY" | "NOTICES" | "RESOURCES"
  >("ABOUT");

  const deptNotices = notices.filter(
    (n) => n.departmentCode === department.code && n.status === "APPROVED",
  );
  const deptEvents = events.filter(
    (e) => e.departmentCode === department.code && e.status === "APPROVED",
  );
  const deptFaculty = faculty.filter(
    (f) => f.departmentCode === department.code,
  );

  const handleDownloadResource = (resTitle: string) => {
    showToast(
      `No verified download is supplied for ${resTitle}. Contact the department.`,
      "info",
    );
  };

  return (
    <div className="space-y-5 pb-16 md:pb-6 text-left">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-2xs cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Centers</span>
      </button>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
        <img
          src={department.bannerImage}
          alt={department.name}
          className="w-full h-48 sm:h-64 object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-5 left-5 right-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-md bg-amber-400 text-slate-950 font-semibold text-xs">
              {department.code}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Center of Excellence
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-semibold leading-tight">
            {department.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{department.location}</span>
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 flex items-center gap-1 overflow-x-auto hide-scrollbar shadow-xs">
        {[
          { id: "ABOUT", label: "About & HOD" },
          { id: "COURSES", label: `Courses (${department.courses.length})` },
          { id: "FACULTY", label: `Faculty (${deptFaculty.length})` },
          { id: "NOTICES", label: `Notices (${deptNotices.length})` },
          {
            id: "RESOURCES",
            label: `Syllabus & Manuals (${department.resources.length})`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? "bg-blue-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: ABOUT & HOD */}
      {activeTab === "ABOUT" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* About text & stats */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              About {department.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {department.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-xl sm:text-2xl font-semibold text-blue-900 block">
                  {department.studentCount}+
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Enrolled Students
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-xl sm:text-2xl font-semibold text-purple-900 block">
                  {department.facultyCount}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Distinguished Faculty
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center col-span-2 sm:col-span-1">
                <span className="text-xl sm:text-2xl font-semibold text-emerald-900 block">
                  {department.courses.length}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Academic Programs
                </span>
              </div>
            </div>

            {/* Upcoming Department Events Preview */}
            {deptEvents.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Upcoming Department Seminars
                </h3>
                <div className="space-y-2">
                  {deptEvents.map((e) => (
                    <div
                      key={e.id}
                      onClick={() => setSelectedEvent(e)}
                      className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/60 flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {e.title}
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          {e.date} • {e.venue}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-blue-900">
                        View →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* HOD Profile Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Head of Department
            </h3>
            <div className="text-center p-4 bg-amber-50/50 rounded-2xl border border-amber-200">
              <div className="w-16 h-16 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xl mx-auto mb-2 shadow-xs">
                {department.hodName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h4 className="text-base font-bold text-slate-900">
                {department.hodName}
              </h4>
              <p className="text-xs font-semibold text-amber-900">
                HOD & Administrative Head
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {department.fullName}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{department.hodEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{department.hodPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>HOD Secretariat Wing</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: COURSES */}
      {activeTab === "COURSES" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {department.courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-900 font-mono font-bold text-xs">
                  {course.code}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                  {course.type}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {course.name}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 text-[11px]">Duration:</span>
                  <p className="font-semibold text-slate-800">
                    {course.durationYears} Academic Years
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">
                    Total Semesters:
                  </span>
                  <p className="font-semibold text-slate-800">
                    {course.totalSemesters} Semesters
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: FACULTY */}
      {activeTab === "FACULTY" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deptFaculty.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 flex items-start gap-3.5 shadow-xs"
            >
              <img
                src={f.avatar}
                alt={f.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="flex-1 min-w-0 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">{f.name}</h4>
                <p className="text-blue-900 font-semibold">{f.designation}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {f.qualification}
                </p>
                <p className="text-slate-400 text-[11px] mt-1">{f.office}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: NOTICES */}
      {activeTab === "NOTICES" && (
        <div className="space-y-3">
          {deptNotices.length === 0 ? (
            <div className="py-12 bg-white rounded-2xl text-center text-slate-400 text-xs border border-slate-200">
              <BellRing className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-700">
                No active circulars for {department.code}
              </p>
            </div>
          ) : (
            deptNotices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between shadow-2xs"
              >
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 font-bold text-[11px] uppercase">
                    {notice.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    {notice.title}
                  </h4>
                  <span className="text-xs text-slate-500">
                    {notice.publishedAt.slice(0, 10)}
                  </span>
                </div>
                <span className="text-xs font-bold text-blue-900 shrink-0">
                  Read Notice →
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: RESOURCES */}
      {activeTab === "RESOURCES" && (
        <div className="space-y-3">
          {department.resources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 flex items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                    {res.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    {res.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {res.fileName} • {res.fileSize} • Uploaded {res.uploadDate}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDownloadResource(res.title)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
