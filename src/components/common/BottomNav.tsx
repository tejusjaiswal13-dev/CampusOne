import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  BellRing,
  CalendarDays,
  Clock,
  User,
  BookOpen,
  Send,
  Users,
  Building2,
  FileCheck,
  ShieldCheck
} from 'lucide-react';

const NAVY = '#0a1628';
const CORAL = '#ff6b6b';
const GOLD = '#f59e0b';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, getPendingApprovals } = useApp();
  const { role } = useAuth();

  const pendingApprovalsCount =
    getPendingApprovals().notices.length + getPendingApprovals().events.length;

  const getTabsForRole = () => {
    switch (role) {
      case 'FACULTY':
        return [
          { id: 'home',          label: 'Home',           icon: Home },
          { id: 'classes',       label: 'Classes',        icon: BookOpen },
          { id: 'class-notices', label: 'Send Notice',    icon: Send },
          { id: 'students',      label: 'Students',       icon: Users },
          { id: 'profile',       label: 'Profile',        icon: User }
        ];

      case 'DEPARTMENT_ADMIN':
        return [
          { id: 'home',     label: 'Home',      icon: Building2 },
          {
            id: 'approvals',
            label: 'Approvals',
            icon: FileCheck,
            badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined
          },
          { id: 'notices',  label: 'Circulars', icon: BellRing },
          { id: 'faculty',  label: 'Faculty',   icon: Users },
          { id: 'profile',  label: 'Profile',   icon: User }
        ];

      case 'COLLEGE_ADMIN':
        return [
          { id: 'home',        label: 'Dashboard',  icon: ShieldCheck },
          { id: 'users',       label: 'Users',      icon: Users },
          { id: 'departments', label: 'Centers',    icon: Building2 },
          { id: 'notices',     label: 'Directives', icon: BellRing },
          { id: 'profile',     label: 'Profile',    icon: User }
        ];

      case 'STUDENT':
      default:
        return [
          { id: 'home',      label: 'Home',      icon: Home },
          { id: 'notices',   label: 'Notices',   icon: BellRing },
          { id: 'timetable', label: 'Timetable', icon: Clock },
          { id: 'events',    label: 'Events',    icon: CalendarDays },
          { id: 'profile',   label: 'Profile',   icon: User }
        ];
    }
  };

  const tabs = getTabsForRole();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden max-w-md mx-auto safe-bottom"
      style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}
    >
      <div className="flex items-center justify-around px-1 pt-1 pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className="relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-150 select-none cursor-pointer active:scale-90 min-w-[52px]"
            >
              {/* Active pill background */}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-xl"
                  style={{ backgroundColor: '#eef2f8' }}
                />
              )}

              {/* Icon */}
              <span className="relative z-10">
                <Icon
                  className="w-[22px] h-[22px] transition-all"
                  style={{
                    color: isActive ? NAVY : '#94a3b8',
                    strokeWidth: isActive ? 2.5 : 2
                  }}
                />
              </span>

              {/* Badge */}
              {tab.badge && (
                <span
                  className="absolute top-0.5 right-1.5 min-w-[15px] h-[15px] flex items-center justify-center text-[8px] font-black text-white rounded-full px-1 border border-white z-20"
                  style={{ backgroundColor: CORAL }}
                >
                  {tab.badge}
                </span>
              )}

              {/* Label */}
              <span
                className="relative z-10 text-[10px] font-semibold transition-colors leading-none"
                style={{ color: isActive ? NAVY : '#94a3b8', fontWeight: isActive ? 700 : 500 }}
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
