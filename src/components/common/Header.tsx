import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  UserCheck,
  Bookmark,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, role } = useAuth();
  const {
    setCurrentTab,
    unreadNotificationsCount,
    setIsNotificationCenterOpen,
    setIsRoleSwitcherOpen,
    bookmarks
  } = useApp();

  const roleLabel =
    role === 'DEPARTMENT_ADMIN' ? 'HOD'
    : role === 'COLLEGE_ADMIN' ? 'Admin'
    : role === 'FACULTY' ? 'Faculty'
    : 'Student';

  return (
    <header className="sticky top-0 z-30 bg-navy-900 text-white shadow-md" style={{ backgroundColor: '#0a1628' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Brand */}
        <button
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-2.5 select-none group cursor-pointer"
        >
          {/* Academic crest mark */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-amber-400/40 shadow-inner shrink-0"
            style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0a1628 100%)' }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-400 fill-current">
              <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2z" />
              <path d="M4 10.77V16c0 2.76 3.58 5 8 5s8-2.24 8-5v-5.23l-8 3.64-8-3.64z" className="opacity-80" />
            </svg>
          </div>
          <div className="leading-none">
            <span className="font-black text-base tracking-tight text-white">
              Campus<span style={{ color: '#f59e0b' }}>One</span>
            </span>
            <span className="text-[10px] text-slate-400 block font-medium">IPS · Univ. of Allahabad</span>
          </div>
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <button
            onClick={() => setCurrentTab('search')}
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Search"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>

          {/* Bookmarks */}
          <button
            onClick={() => setCurrentTab('bookmarks')}
            className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Bookmarks"
          >
            <Bookmark className="w-[18px] h-[18px]" />
            {bookmarks.length > 0 && (
              <span
                className="absolute top-2 right-2 w-2 h-2 rounded-full border border-navy-900"
                style={{ backgroundColor: '#f59e0b', borderColor: '#0a1628' }}
              />
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={() => setIsNotificationCenterOpen(true)}
            className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadNotificationsCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] flex items-center justify-center text-[9px] font-black text-white rounded-full px-1 border border-navy-900"
                style={{ backgroundColor: '#ff6b6b', borderColor: '#0a1628' }}
              >
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Role switcher pill — compact */}
          <button
            onClick={() => setIsRoleSwitcherOpen(true)}
            className="flex items-center gap-1 ml-1 pl-2 pr-1.5 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer"
            style={{ backgroundColor: '#f59e0b', color: '#0a1628' }}
            title="Switch Demo Role"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{roleLabel}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {/* Avatar */}
          <button
            onClick={() => setCurrentTab('profile')}
            className="ml-1 p-0.5 rounded-full border cursor-pointer transition-opacity hover:opacity-80"
            style={{ borderColor: '#1e3a5f' }}
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={currentUser?.name || 'User'}
              className="w-7 h-7 rounded-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
