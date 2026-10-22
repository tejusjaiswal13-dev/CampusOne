import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { RoleBadge } from '../common/RoleBadge';
import {
  User,
  Mail,
  GraduationCap,
  Building2,
  Phone,
  Bookmark,
  Bell,
  HelpCircle,
  Info,
  LogOut,
  Edit3,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Calendar,
  Ticket,
  Clock,
  QrCode,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { currentUser, role, logout, updateProfile } = useAuth();
  const {
    setCurrentTab,
    setIsNotificationCenterOpen,
    setIsRoleSwitcherOpen,
    showToast,
    bookmarks,
    registrations,
    exams
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editSemester, setEditSemester] = useState(currentUser?.semester || 5);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleSaveProfile = () => {
    updateProfile({
      name: editName,
      phone: editPhone,
      semester: Number(editSemester)
    });
    setIsEditModalOpen(false);
    showToast('Student credentials updated successfully! ✨', 'success');
  };

  const studentExams = exams.filter(
    e => e.departmentCode === (currentUser?.departmentCode || 'CCET')
  );

  return (
    <div className="space-y-6 pb-20 md:pb-8 text-left max-w-2xl mx-auto">
      {/* Visual Student Identity Card */}
      <div className="co-surface-banner text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-sm relative overflow-hidden">
        {/* Subtle decorative security watermark */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header: Institution Branding */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-700/60 border border-amber-400/40 flex items-center justify-center p-1 shadow-inner">
              <svg viewBox="0 0 24 24" className="w-full h-full text-amber-400 fill-current">
                <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2z" />
                <path d="M4 10.77V16c0 2.76 3.58 5 8 5s8-2.24 8-5v-5.23l-8 3.64-8-3.64z" className="text-white fill-current opacity-90" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-semibold tracking-wider text-amber-300 uppercase">
                University of Allahabad
              </h4>
              <p className="text-[11px] text-slate-300">
                Institute of Professional Studies (IPS)
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Demo profile
          </span>
        </div>

        {/* Card Middle: Photo + Credentials */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-5 relative z-10">
          <div className="relative shrink-0">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={currentUser?.name || 'User'}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-400/60 shadow-sm"
            />
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute -bottom-1 -right-1 p-1.5 bg-amber-400 text-slate-950 rounded-xl shadow-md hover:bg-amber-300 transition-transform active:scale-95 cursor-pointer"
              title="Edit Profile"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-semibold text-white leading-tight">
                {currentUser?.name}
              </h2>
              <RoleBadge role={role} size="sm" />
            </div>

            <p className="text-xs font-semibold text-amber-300">
              {currentUser?.course || currentUser?.designation || 'Academic Scholar'}
            </p>

            <p className="text-xs text-slate-300">
              Center of {currentUser?.departmentName} ({currentUser?.departmentCode})
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
              <span className="text-[11px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded border border-white/15 text-slate-200">
                Roll: {currentUser?.studentOrEmpId}
              </span>
              <span className="text-[11px] font-bold bg-indigo-900/60 text-indigo-200 px-2 py-0.5 rounded border border-indigo-700/50">
                {currentUser?.semester ? `Semester ${currentUser.semester}` : 'Active Faculty'}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer: Decorative Barcode / Verification strip */}
        <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono relative z-10">
          <span>CAMPUSONE-IPS-UOA-2026</span>
          <span className="text-amber-400 font-bold">SAMPLE PROFILE · NOT AN ID</span>
        </div>
      </div>

      {/* 4 Quick Academic Shortcuts / Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Bookmarks */}
        <button
          onClick={() => setCurrentTab('bookmarks')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group active:scale-95"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 group-hover:scale-105 transition-transform mb-2">
            <Bookmark className="w-4 h-4 fill-amber-500" />
          </div>
          <div>
            <span className="text-lg font-semibold text-slate-900 block leading-tight">
              {bookmarks.length}
            </span>
            <span className="text-[11px] font-medium text-slate-500">Saved Circulars</span>
          </div>
        </button>

        {/* Registered Passes */}
        <button
          onClick={() => setCurrentTab('events')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group active:scale-95"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 group-hover:scale-105 transition-transform mb-2">
            <Ticket className="w-4 h-4" />
          </div>
          <div>
            <span className="text-lg font-semibold text-slate-900 block leading-tight">
              {registrations.length}
            </span>
            <span className="text-[11px] font-medium text-slate-500">Event Passes</span>
          </div>
        </button>

        {/* Timetable shortcut */}
        <button
          onClick={() => setCurrentTab('home')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group active:scale-95"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 group-hover:scale-105 transition-transform mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 block leading-tight">
              Today's Slots
            </span>
            <span className="text-[11px] font-medium text-slate-500">Class Tracker →</span>
          </div>
        </button>

        {/* Exam Datesheet */}
        <button
          onClick={() => setCurrentTab('exams')}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group active:scale-95"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200 group-hover:scale-105 transition-transform mb-2">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-lg font-semibold text-slate-900 block leading-tight">
              {studentExams.length}
            </span>
            <span className="text-[11px] font-medium text-slate-500">Scheduled Exams</span>
          </div>
        </button>
      </div>

      {/* Account & Contact Information Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Registered Academic Contact Details
        </h3>

        <div className="space-y-2 text-xs text-slate-700">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>Profile email</span>
            </div>
            <span className="font-semibold text-slate-900">{currentUser?.email}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-indigo-600" />
              <span>Phone Number</span>
            </div>
            <span className="font-semibold text-slate-900">{currentUser?.phone || '+91 98765 43210'}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Parent Academic Body</span>
            </div>
            <span className="font-semibold text-slate-900">Institute of Professional Studies, UoA</span>
          </div>
        </div>
      </div>

      {/* Student Action Menu */}
      <div className="bg-white rounded-3xl p-2.5 border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs font-semibold text-slate-700">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>Update Phone & Semester</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setIsNotificationCenterOpen(true)}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-slate-500" />
            <span>Notification & Circular Alerts</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setIsRoleSwitcherOpen(true)}
          className="w-full flex items-center justify-between p-3.5 hover:bg-amber-50 rounded-2xl transition-colors cursor-pointer text-amber-900"
        >
          <div className="flex items-center gap-3">
            <UserCheck className="w-4 h-4 text-amber-600" />
            <span>Switch Role for Evaluation Demo</span>
          </div>
          <span className="text-amber-700 font-bold text-[11px] bg-amber-100 px-2 py-0.5 rounded-md">
            Evaluator Mode
          </span>
        </button>

        <button
          onClick={() => setShowHelpModal(true)}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>IPS Student Grievance & Helpdesk</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setShowAboutModal(true)}
          className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Info className="w-4 h-4 text-slate-500" />
            <span>About CampusOne & Minor Project</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => {
            logout();
            setCurrentTab('auth');
          }}
          className="w-full flex items-center justify-between p-3.5 hover:bg-rose-50 text-rose-600 rounded-2xl transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Sign Out of CampusOne</span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400" />
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4 text-left">
            <h3 className="text-base font-bold text-slate-900">Update Profile Details</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Current Semester</label>
                <select
                  value={editSemester}
                  onChange={e => setEditSemester(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 cursor-pointer"
                >
                  <option value={1}>Semester I</option>
                  <option value={2}>Semester II</option>
                  <option value={3}>Semester III</option>
                  <option value={4}>Semester IV</option>
                  <option value={5}>Semester V</option>
                  <option value={6}>Semester VI</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px]">
                Note: Department and Role changes require official verification by College Administration.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl shadow-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4 text-left">
            <h3 className="text-base font-bold text-slate-900">About CampusOne</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>CampusOne</strong> is the centralized, mobile-first campus information and management mobile application built for the Institute of Professional Studies (IPS), University of Allahabad.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tagline: <em>"One Campus. One Platform. All Information."</em>
            </p>
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-[11px] text-indigo-950 font-medium">
              Candidate: Tejus Jaiswal (BCA, CCET) • Roll No: IPS2023-BCA-042
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAboutModal(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-900 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4 text-left">
            <h3 className="text-base font-bold text-slate-900">Student Welfare & Helpdesk</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <p><strong>IPS Single Window Desk:</strong> Room 104, Directorate Building</p>
              <p><strong>Helpdesk Email:</strong> helpdesk.ips@allduniv.ac.in</p>
              <p><strong>Student Grievance Cell:</strong> grievance.ips@allduniv.ac.in</p>
              <p><strong>Office Hours:</strong> 10:00 AM - 04:30 PM (Mon-Fri)</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-900 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
