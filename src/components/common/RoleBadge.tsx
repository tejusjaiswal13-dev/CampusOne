import { Briefcase, Building2, GraduationCap, ShieldCheck } from "lucide-react";
import React from "react";
import { UserRole } from "../../types";

interface RoleBadgeProps {
  role: UserRole;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  size = "sm",
  showIcon = true,
}) => {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5 font-medium",
    lg: "text-sm px-3 py-1.5 gap-2 font-semibold",
  };

  const roleConfigs = {
    STUDENT: {
      label: "Student",
      bg: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <GraduationCap className={size === "lg" ? "w-4 h-4" : "w-3 h-3"} />,
    },
    FACULTY: {
      label: "Faculty",
      bg: "bg-purple-50 text-purple-700 border-purple-200",
      icon: <Briefcase className={size === "lg" ? "w-4 h-4" : "w-3 h-3"} />,
    },
    DEPARTMENT_ADMIN: {
      label: "HOD / Dept Admin",
      bg: "bg-amber-50 text-amber-800 border-amber-300 font-semibold",
      icon: <Building2 className={size === "lg" ? "w-4 h-4" : "w-3 h-3"} />,
    },
    COLLEGE_ADMIN: {
      label: "College Admin",
      bg: "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold",
      icon: <ShieldCheck className={size === "lg" ? "w-4 h-4" : "w-3 h-3"} />,
    },
  };

  const config = roleConfigs[role] || roleConfigs.STUDENT;

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses[size]} transition-all shadow-xs`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
