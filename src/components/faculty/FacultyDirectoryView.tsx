import {
  BookOpen,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Search,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { useApp } from "../../context/AppState";

export const FacultyDirectoryView: React.FC = () => {
  const { faculty, departments } = useApp();
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaculty = faculty.filter((f) => {
    if (selectedDept !== "ALL" && f.departmentCode !== selectedDept)
      return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q) ||
        f.specialization.toLowerCase().includes(q) ||
        f.subjects.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-5 pb-16 md:pb-6 text-left">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-2 rounded-xl bg-purple-50 text-purple-900">
            <Users className="w-5 h-5 text-purple-700" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Faculty Directory & Mentors
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Distinguished professors, research chairs, and teaching faculty
              across IPS University of Allahabad.
            </p>
          </div>
        </div>

        {/* Search & Department Selector */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty by name, specialization, or subjects taught..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:bg-white text-slate-900 transition-all"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600/20 cursor-pointer"
            >
              <option value="ALL">All Departments ({faculty.length})</option>
              {departments.map((d) => (
                <option key={d.id} value={d.code}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFaculty.map((f) => (
          <div
            key={f.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header with avatar */}
              <div className="flex items-start gap-3.5">
                <img
                  src={f.avatar}
                  alt={f.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 text-[11px] font-bold border border-purple-200">
                      {f.departmentCode}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {f.experienceYears} yrs exp
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {f.name}
                  </h3>
                  <p className="text-xs font-semibold text-blue-900">
                    {f.designation}
                  </p>
                </div>
              </div>

              {/* Qualifications & Specialization */}
              <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-start gap-1.5">
                  <GraduationCap className="w-4 h-4 text-purple-800 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-700 font-medium">
                    {f.qualification}
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-800 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-600 italic">
                    {f.specialization}
                  </span>
                </div>
              </div>

              {/* Subjects taught */}
              <div className="mt-3 pt-2.5 border-t border-slate-100">
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                  Subjects Taught
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {f.subjects.map((sub) => (
                    <span
                      key={sub}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Office & Contact Row */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{f.office}</span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                <a
                  href={`mailto:${f.email}`}
                  className="flex items-center gap-1 text-blue-900 hover:underline font-medium text-[11px]"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{f.email}</span>
                </a>
                <span className="flex items-center gap-1 text-slate-600 text-[11px]">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{f.phone}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
