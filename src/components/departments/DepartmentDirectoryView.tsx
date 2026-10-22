import { ArrowRight, Building2, MapPin } from "lucide-react";
import React, { useState } from "react";
import { useApp } from "../../context/AppState";
import { Department } from "../../types";
import { DepartmentDetailView } from "./DepartmentDetailView";

export const DepartmentDirectoryView: React.FC = () => {
  const { departments, selectedDepartment, setSelectedDepartment } = useApp();
  const [internalSelected, setInternalSelected] = useState<Department | null>(
    selectedDepartment,
  );

  if (internalSelected) {
    return (
      <DepartmentDetailView
        department={internalSelected}
        onBack={() => {
          setInternalSelected(null);
          setSelectedDepartment(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-5 pb-16 md:pb-6 text-left">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-2 rounded-xl bg-blue-50 text-blue-900">
            <Building2 className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              IPS Centers & Departments
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Five specialized academic centers under the Institute of
              Professional Studies, University of Allahabad.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 5 Centers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {departments.map((dept) => (
          <div
            key={dept.id}
            onClick={() => {
              setInternalSelected(dept);
              setSelectedDepartment(dept);
            }}
            className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            {/* Banner preview */}
            <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
              <img
                src={dept.bannerImage}
                alt={dept.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-md bg-amber-400 text-slate-950 font-semibold text-xs">
                  {dept.code}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-lg font-semibold leading-tight">
                  {dept.fullName}
                </h3>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">{dept.location}</span>
                </p>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {dept.description}
              </p>

              {/* HOD & metrics */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                    HOD
                  </span>
                  <span className="font-bold text-slate-800">
                    {dept.hodName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                    Students
                  </span>
                  <span className="font-bold text-blue-900">
                    {dept.studentCount}+ enrolled
                  </span>
                </div>
              </div>

              {/* Courses pills */}
              <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                {dept.courses.map((c) => (
                  <span
                    key={c.id}
                    className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-bold"
                  >
                    {c.code}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-900 group-hover:text-blue-700">
                <span>Explore Department Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
