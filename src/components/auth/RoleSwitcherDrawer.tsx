import { Check, ShieldAlert, Sparkles, X } from "lucide-react";
import React from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";
import { UserRole } from "../../types";
import { RoleBadge } from "../common/RoleBadge";

export const RoleSwitcherDrawer: React.FC = () => {
  const { currentUser, switchDemoRole } = useAuth();
  const {
    isRoleSwitcherOpen,
    setIsRoleSwitcherOpen,
    setCurrentTab,
    showToast,
  } = useApp();

  if (!isRoleSwitcherOpen) return null;

  const demoProfiles: Array<{
    role: UserRole;
    name: string;
    deptCode: string;
    deptName: string;
    designationOrCourse: string;
    badgeNote: string;
    description: string;
  }> = [
    {
      role: "STUDENT",
      name: "Aarav Sharma",
      deptCode: "CCET",
      deptName: "Computer Applications",
      designationOrCourse: "BCA • Semester IV (Roll: IPS2023-BCA-042)",
      badgeNote: "Personalized: CCET + College",
      description:
        "Sees CCET department notices, BCA exam schedules, registered AI workshop ticket, and college announcements.",
    },
    {
      role: "STUDENT",
      name: "Priya Patel",
      deptCode: "CFT",
      deptName: "Food Technology",
      designationOrCourse: "B.Sc Food Tech • Semester IV",
      badgeNote: "Personalized: CFT + College",
      description:
        "Notice feed automatically switches to Food Technology notices & College-wide announcements (proving department isolation).",
    },
    {
      role: "FACULTY",
      name: "Dr. Pradeep Kumar",
      deptCode: "CCET",
      deptName: "Computer Applications",
      designationOrCourse: "Assistant Professor (Emp: FAC-CCET-108)",
      badgeNote: "Faculty Creator Privilege",
      description:
        "Can submit proposals for notices and events that require HOD approval before publishing.",
    },
    {
      role: "DEPARTMENT_ADMIN",
      name: "Prof. R. S. Yadav",
      deptCode: "CCET",
      deptName: "Computer Applications",
      designationOrCourse: "Head of Department & Professor",
      badgeNote: "HOD Department Control",
      description:
        "Manages CCET only: reviews pending faculty submissions, publishes official dept notices, exports attendee lists.",
    },
    {
      role: "COLLEGE_ADMIN",
      name: "Dr. Neha Srivastava",
      deptCode: "CENTRAL",
      deptName: "IPS Central Directorate",
      designationOrCourse: "Joint Director & Administrator",
      badgeNote: "College-Wide Super Admin",
      description:
        "Full institutional management across all 5 centers, publishes college-wide urgent alerts, manages users and calendar.",
    },
  ];

  const handleSelect = (profile: (typeof demoProfiles)[0]) => {
    switchDemoRole(
      profile.role,
      profile.deptCode === "CENTRAL" ? undefined : profile.deptCode,
    );
    setIsRoleSwitcherOpen(false);
    showToast(
      `Switched active demo profile to ${profile.name} (${profile.role})`,
      "success",
    );
    if (profile.role === "COLLEGE_ADMIN") {
      setCurrentTab("college-admin");
    } else if (profile.role === "DEPARTMENT_ADMIN") {
      setCurrentTab("dept-admin");
    } else if (profile.role === "FACULTY") {
      setCurrentTab("faculty-dash");
    } else {
      setCurrentTab("home");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold">
                Fast Role Switcher (Minor Project Demo)
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Select any pre-configured persona to test role permissions,
              approval workflows, and department-specific isolation.
            </p>
          </div>
          <button
            onClick={() => setIsRoleSwitcherOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice alert */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center gap-2 text-xs text-amber-800">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            In production, users cannot self-assign privileged roles. This
            switcher is designed for evaluators.
          </span>
        </div>

        {/* Profiles list */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {demoProfiles.map((p) => {
            const isCurrent =
              currentUser?.name === p.name &&
              currentUser?.role === p.role &&
              (p.deptCode === "CENTRAL" ||
                currentUser?.departmentCode === p.deptCode);

            return (
              <div
                key={`${p.role}-${p.deptCode}`}
                onClick={() => handleSelect(p)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none text-left relative ${
                  isCurrent
                    ? "border-blue-700 bg-blue-50/70 ring-2 ring-blue-600/30"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm text-slate-900">
                        {p.name}
                      </span>
                      <RoleBadge role={p.role} size="sm" />
                      <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded-md bg-slate-200 text-slate-700">
                        {p.deptCode}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-600 mb-1">
                      {p.designationOrCourse}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {isCurrent && (
                    <div className="shrink-0 w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-blue-950 font-medium">
                    Department: {p.deptName}
                  </span>
                  <span className="font-semibold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded">
                    {p.badgeNote}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              setIsRoleSwitcherOpen(false);
              setCurrentTab("auth");
            }}
            className="text-xs font-semibold text-blue-900 hover:underline"
          >
            Custom Login / Sign Up Screen →
          </button>
          <button
            onClick={() => setIsRoleSwitcherOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
