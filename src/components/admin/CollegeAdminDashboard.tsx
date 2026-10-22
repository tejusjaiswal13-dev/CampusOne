import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { RoleBadge } from '../common/RoleBadge';
import { StorageService } from '../../services/storageService';
import {
  ShieldCheck,
  Users,
  Building2,
  BellRing,
  CalendarDays,
  Calendar,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Download,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { UserRole } from '../../types';

export const CollegeAdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    departments,
    notices,
    events,
    calendar,
    setIsCreateNoticeOpen,
    setIsCreateEventOpen,
    refreshAllData,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'DEPARTMENTS' | 'NOTICES' | 'CALENDAR'>('OVERVIEW');

  // Users management
  const [userList, setUserList] = useState(StorageService.getUsers());
  const [selectedUserForRole, setSelectedUserForRole] = useState<string | null>(null);

  // New calendar event state
  const [newCalTitle, setNewCalTitle] = useState('');
  const [newCalCategory, setNewCalCategory] = useState<'Semester' | 'Examination' | 'Holiday' | 'Deadline'>('Holiday');
  const [newCalDate, setNewCalDate] = useState('2026-11-01');

  // Metrics
  const totalStudentsCount = 1250;
  const totalFacultyCount = 49;
  const totalDepartmentsCount = departments.length;
  const activeEventsCount = events.filter(e => e.status === 'APPROVED').length;
  const activeNoticesCount = notices.filter(n => n.status === 'APPROVED').length;

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const user = userList.find(u => u.id === userId);
    if (!user) return;
    const updated = { ...user, role: newRole };
    StorageService.saveUser(updated);
    setUserList(StorageService.getUsers());
    refreshAllData();
    showToast(`Role updated for ${user.name} to ${newRole}`, 'success');
    setSelectedUserForRole(null);
  };

  const handleAddCalendarEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCalTitle.trim()) return;

    StorageService.saveCalendarItem({
      id: `cal-${Date.now()}`,
      title: newCalTitle,
      category: newCalCategory,
      startDate: newCalDate,
      description: 'Official date declared by IPS University of Allahabad Directorate.',
      scope: 'COLLEGE'
    });

    refreshAllData();
    setNewCalTitle('');
    showToast('New date added to central Academic Calendar! 📅', 'success');
  };

  const handleDeleteNotice = (id: string) => {
    StorageService.deleteNotice(id);
    refreshAllData();
    showToast('Notice removed from campus system.', 'info');
  };

  return (
    <div className="space-y-6 pb-16 md:pb-8 text-left">
      {/* Super Admin Banner */}
      <div
        className="text-white rounded-2xl p-5 sm:p-6 shadow-sm"
        style={{ backgroundColor: '#0a1628', border: '1px solid #1e3a5f' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                Central College Directorate
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-semibold tracking-tight">
              IPS UOA Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Director: {currentUser?.name} • Institute of Professional Studies, University of Allahabad
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsCreateNoticeOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Broadcast College Notice</span>
            </button>
            <button
              onClick={() => setIsCreateEventOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Broadcast Event</span>
            </button>
          </div>
        </div>

        {/* Institution-Wide KPIs */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-3 text-left">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[11px] uppercase font-bold text-slate-400 block">Total Students</span>
            <span className="text-xl font-semibold text-white">{totalStudentsCount}+</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[11px] uppercase font-bold text-slate-400 block">Total Faculty</span>
            <span className="text-xl font-semibold text-white">{totalFacultyCount} Members</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[11px] uppercase font-bold text-slate-400 block">IPS Centers</span>
            <span className="text-xl font-semibold text-amber-400">{totalDepartmentsCount} Centers</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[11px] uppercase font-bold text-emerald-300 block">Active Notices</span>
            <span className="text-xl font-semibold text-emerald-400">{activeNoticesCount}</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
            <span className="text-[11px] uppercase font-bold text-blue-300 block">Active Events</span>
            <span className="text-xl font-semibold text-blue-300">{activeEventsCount}</span>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 flex items-center gap-1 overflow-x-auto shadow-xs">
        {[
          { id: 'OVERVIEW', label: 'Overview & Health' },
          { id: 'USERS', label: `Users & Permissions (${userList.length})` },
          { id: 'DEPARTMENTS', label: `Departments (${departments.length})` },
          { id: 'NOTICES', label: `Manage Notices (${notices.length})` },
          { id: 'CALENDAR', label: `Academic Calendar (${calendar.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Institutional Status Summary</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              All 5 academic centers (CCET, CFT, CMS, CFDT, CTF) are online and actively synchronized with the central repository. Notice boards and departmental communication channels are operating with zero reported server exceptions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-1">
                  Department Isolation Security
                </h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Strict role-based access control active. HODs are confined to their assigned department. Students only see personalized feeds.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-1">
                  Approval Workflow Gateway
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Faculty submissions require mandatory HOD endorsement before becoming visible across student devices.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Emergency Broadcast
            </h3>
            <p className="text-xs text-slate-600">
              Publish an urgent institutional directive with high-priority banners across all student homes.
            </p>
            <button
              onClick={() => setIsCreateNoticeOpen(true)}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Broadcast Urgent Alert 🚨
            </button>
          </div>
        </div>
      )}

      {/* Tab: USERS & PERMISSIONS */}
      {activeTab === 'USERS' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                User Roster & Access Control
              </h2>
              <p className="text-xs text-slate-500">
                Assign privileges and roles (Student, Faculty, HOD, College Admin).
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {userList.length} Accounts
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {userList.map(u => (
              <div key={u.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{u.name}</h4>
                      <RoleBadge role={u.role} size="sm" />
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      {u.studentOrEmpId} • {u.departmentCode} • {u.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u.id, e.target.value as UserRole)}
                    className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="DEPARTMENT_ADMIN">Department Admin / HOD</option>
                    <option value="COLLEGE_ADMIN">College Admin</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: DEPARTMENTS */}
      {activeTab === 'DEPARTMENTS' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Manage IPS Centers
              </h2>
              <p className="text-xs text-slate-500">
                Five accredited centers operating under the Institute of Professional Studies
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map(d => (
              <div key={d.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-semibold text-[11px]">
                    {d.code}
                  </span>
                  <span className="font-semibold text-slate-500">{d.location.split(',')[0]}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{d.fullName}</h4>
                <p className="text-slate-600 text-[11px]">Head of Department: <strong>{d.hodName}</strong></p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-slate-500">
                  <span>{d.studentCount}+ Students</span>
                  <span>{d.facultyCount} Faculty</span>
                  <span>{d.courses.length} Programs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: NOTICES MANAGEMENT */}
      {activeTab === 'NOTICES' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              Institutional Circular Moderation
            </h2>
            <button
              onClick={() => setIsCreateNoticeOpen(true)}
              className="px-3 py-1.5 bg-blue-900 text-white rounded-xl text-xs font-bold"
            >
              + Broadcast Notice
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {notices.map(n => (
              <div key={n.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.2 rounded text-[11px] font-bold bg-slate-100">
                      {n.scope === 'COLLEGE' ? 'College' : `${n.departmentCode} Dept`}
                    </span>
                    <span className="text-slate-400 text-[11px]">{n.publishedAt.slice(0, 10)}</span>
                  </div>
                  <h4 className="font-bold text-slate-900">{n.title}</h4>
                  <p className="text-slate-500 text-[11px]">Publisher: {n.publisherName} ({n.publisherRole})</p>
                </div>

                <button
                  onClick={() => handleDeleteNotice(n.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Delete Notice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: CALENDAR */}
      {activeTab === 'CALENDAR' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Central Academic Calendar Management</h2>
            <p className="text-xs text-slate-500">Add official institutional milestones and vacation periods.</p>
          </div>

          {/* Form to add date */}
          <form onSubmit={handleAddCalendarEntry} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Event / Milestone Title</label>
              <input
                type="text"
                value={newCalTitle}
                onChange={e => setNewCalTitle(e.target.value)}
                placeholder="e.g., Winter Recess, Convocation 2026..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={newCalCategory}
                onChange={e => setNewCalCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
              >
                <option value="Holiday">Holiday</option>
                <option value="Examination">Examination</option>
                <option value="Semester">Semester</option>
                <option value="Deadline">Deadline</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Date</label>
              <input
                type="date"
                value={newCalDate}
                onChange={e => setNewCalDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div className="sm:col-span-4 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs"
              >
                + Add Academic Date
              </button>
            </div>
          </form>

          {/* Existing calendar items list */}
          <div className="divide-y divide-slate-100">
            {calendar.map(c => (
              <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-slate-400 text-[11px] mr-2">{c.startDate}</span>
                  <span className="font-bold text-slate-900">{c.title}</span>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded ml-2">
                    {c.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
