import {
  BellRing,
  Bookmark,
  BookOpen,
  Building2,
  CalendarDays,
  Compass,
  FileCheck,
  Home,
  Send,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import React from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";

const NAVY = "#142d3b";
const CORAL = "#c96c4f";

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, getPendingApprovals, deviceMode } =
    useApp();
  const { role } = useAuth();

  const pendingApprovalsCount =
    getPendingApprovals().notices.length + getPendingApprovals().events.length;

  const getTabsForRole = () => {
    switch (role) {
      case "FACULTY":
        return [
          { id: "home", label: "Home", icon: Home },
          { id: "classes", label: "Classes", icon: BookOpen },
          { id: "class-notices", label: "Send Notice", icon: Send },
          { id: "students", label: "Students", icon: Users },
          { id: "profile", label: "Profile", icon: User },
        ];

      case "DEPARTMENT_ADMIN":
        return [
          { id: "home", label: "Home", icon: Building2 },
          {
            id: "approvals",
            label: "Approvals",
            icon: FileCheck,
            badge:
              pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          },
          { id: "notices", label: "Circulars", icon: BellRing },
          { id: "faculty", label: "Faculty", icon: Users },
          { id: "profile", label: "Profile", icon: User },
        ];

      case "COLLEGE_ADMIN":
        return [
          { id: "home", label: "Dashboard", icon: ShieldCheck },
          { id: "users", label: "Users", icon: Users },
          { id: "departments", label: "Centers", icon: Building2 },
          { id: "notices", label: "Directives", icon: BellRing },
          { id: "profile", label: "Profile", icon: User },
        ];

      case "STUDENT":
      default:
        return [
          { id: "home", label: "Home", icon: Home },
          { id: "explore", label: "Explore", icon: Compass },
          { id: "calendar", label: "Calendar", icon: CalendarDays },
          { id: "bookmarks", label: "Saved", icon: Bookmark },
          { id: "profile", label: "Profile", icon: User },
        ];
    }
  };

  const tabs = getTabsForRole();

  return (
    <nav
      aria-label="Main navigation"
      className={`${deviceMode === "mobile-frame" ? "absolute" : "fixed md:hidden"} bottom-0 left-0 right-0 z-40 safe-bottom`}
      style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e2e8f0" }}
    >
      <div className="flex items-center justify-around px-1 pt-1 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              aria-current={isActive ? "page" : undefined}
              onClick={() => setCurrentTab(tab.id)}
              className="relative flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all duration-150 select-none cursor-pointer active:scale-90 min-w-[52px] min-h-[48px]"
            >
              {/* Active pill background */}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-xl"
                  style={{ backgroundColor: "#eef2f8" }}
                />
              )}

              {/* Icon */}
              <span className="relative z-10">
                <Icon
                  className="w-[22px] h-[22px] transition-all"
                  style={{
                    color: isActive ? NAVY : "#94a3b8",
                    strokeWidth: isActive ? 2.5 : 2,
                  }}
                />
              </span>

              {/* Badge */}
              {tab.badge && (
                <span
                  className="absolute top-0.5 right-1.5 min-w-[15px] h-[15px] flex items-center justify-center text-[8px] font-semibold text-white rounded-full px-1 border border-white z-20"
                  style={{ backgroundColor: CORAL }}
                >
                  {tab.badge}
                </span>
              )}

              {/* Label */}
              <span
                className="relative z-10 text-[11px] font-semibold transition-colors leading-none"
                style={{
                  color: isActive ? NAVY : "#94a3b8",
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {tab.label}
              </span>

              {/* Active dot */}
              {isActive && (
                <span
                  className="relative z-10 w-1 h-1 rounded-full"
                  style={{ backgroundColor: CORAL }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
