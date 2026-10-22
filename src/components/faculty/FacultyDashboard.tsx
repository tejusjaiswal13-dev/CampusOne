import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  PlusCircle,
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarDays,
  BellRing,
  Building2,
  Users
} from 'lucide-react';

export const FacultyDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    notices,
    events,
    registrations,
    setIsCreateNoticeOpen,
    setIsCreateEventOpen,
    setSelectedNotice,
    setSelectedEvent
  } = useApp();

  const [activeTab, setActiveTab] = useState<'SUBMISSIONS' | 'ATTENDEES'>('SUBMISSIONS');

  // Faculty submissions
  const myNotices = notices.filter(n => n.publisherId === currentUser?.id);
  const myEvents = events.filter(e => e.publisherId === currentUser?.id);

  const pendingNoticesCount = myNotices.filter(n => n.status === 'PENDING_APPROVAL').length;
  const approvedNoticesCount = myNotices.filter(n => n.status === 'APPROVED').length;

  // Event attendees for faculty events
  const facultyEventIds = myEvents.map(e => e.id);
  const myEventRegistrations = registrations.filter(r => facultyEventIds.includes(r.eventId));

  const getStatusBadge = (status: string, reason?: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Approved & Live</span>
          </span>
        );
      case 'PENDING_APPROVAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Pending HOD Approval</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Requires Revision</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-8 text-left">
      {/* Faculty Hero Banner */}
      <div
        className="text-white rounded-2xl p-5 sm:p-6"
        style={{ backgroundColor: '#0a1628', border: '1px solid #1e3a5f' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="p-2 rounded-xl border"
                style={{ backgroundColor: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.3)', color: '#f59e0b' }}
              >
                <Briefcase className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>
                Faculty Academic Portal
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-semibold tracking-tight">
              Welcome, {currentUser?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {currentUser?.designation} • Department of {currentUser?.departmentName} ({currentUser?.departmentCode})
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsCreateNoticeOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Notice</span>
            </button>
            <button
              onClick={() => setIsCreateEventOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Propose Event</span>
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[11px] uppercase font-bold text-slate-400 block">Total Submissions</span>
            <span className="text-xl font-semibold text-white">{myNotices.length + myEvents.length}</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[11px] uppercase font-bold text-amber-300 block">Pending HOD Review</span>
            <span className="text-xl font-semibold text-amber-400">{pendingNoticesCount}</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[11px] uppercase font-bold text-emerald-300 block">Approved & Published</span>
            <span className="text-xl font-semibold text-emerald-400">{approvedNoticesCount}</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[11px] uppercase font-bold text-purple-300 block">Event Attendees</span>
            <span className="text-xl font-semibold text-purple-300">{myEventRegistrations.length}</span>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 flex items-center gap-1 overflow-x-auto shadow-xs">
        <button
          onClick={() => setActiveTab('SUBMISSIONS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'SUBMISSIONS'
              ? 'bg-purple-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>My Submissions & Approval Lifecycle</span>
        </button>

        <button
          onClick={() => setActiveTab('ATTENDEES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ATTENDEES'
              ? 'bg-purple-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Registrations for My Events ({myEventRegistrations.length})</span>
        </button>
      </div>

      {/* Tab 1: Submissions */}
      {activeTab === 'SUBMISSIONS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Submitted Notices & Circulars
            </h2>

            {myNotices.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                You haven't submitted any notices yet. Click "Submit Notice" to draft one for HOD approval.
              </p>
            ) : (
              <div className="space-y-3">
                {myNotices.map(notice => (
                  <div
                    key={notice.id}
                    onClick={() => setSelectedNotice(notice)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-900">
                          {notice.category}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Submitted {notice.publishedAt.slice(0, 10)}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{notice.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-1">{notice.description}</p>
                      {notice.rejectionReason && (
                        <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded-lg mt-2 font-medium">
                          <strong>Revision Feedback:</strong> {notice.rejectionReason}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 sm:text-right">
                      {getStatusBadge(notice.status, notice.rejectionReason)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submitted Events */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Submitted Events & Seminars
            </h2>

            {myEvents.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No event proposals submitted yet.
              </p>
            ) : (
              <div className="space-y-3">
                {myEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-900">
                          {event.category}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Date: {event.date} • {event.venue}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{event.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-1">{event.description}</p>
                    </div>

                    <div className="shrink-0 sm:text-right">
                      {getStatusBadge(event.status, event.rejectionReason)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Attendees */}
      {activeTab === 'ATTENDEES' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Registered Students for Faculty Sessions
          </h2>

          {myEventRegistrations.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No student registrations yet for your scheduled sessions.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {myEventRegistrations.map(reg => (
                <div key={reg.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{reg.studentName}</h4>
                    <p className="text-slate-500 text-[11px]">
                      {reg.studentId} • {reg.departmentCode} • {reg.email}
                    </p>
                    <p className="text-blue-900 font-semibold text-[11px] mt-0.5">
                      Event: {reg.eventTitle}
                    </p>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    {reg.ticketCode}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
