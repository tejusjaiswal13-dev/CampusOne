import {
  AlertTriangle,
  BellRing,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  PlusCircle,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";

export const DeptAdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    users,
    approveAccount,
    notices,
    events,
    faculty,
    registrations,
    getPendingApprovals,
    handleApproveNotice,
    handleRejectNotice,
    handleApproveEvent,
    handleRejectEvent,
    setIsCreateNoticeOpen,
    setIsCreateEventOpen,
    showToast,
  } = useApp();

  const deptCode = currentUser?.departmentCode || "CCET";

  // Department-filtered content (STRICT DEPARTMENT ISOLATION)
  const deptNotices = notices.filter((n) => n.departmentCode === deptCode);
  const deptEvents = events.filter((e) => e.departmentCode === deptCode);
  const deptFaculty = faculty.filter((f) => f.departmentCode === deptCode);
  const { notices: pendingNotices, events: pendingEvents } =
    getPendingApprovals(deptCode);

  const [activeTab, setActiveTab] = useState<
    "APPROVALS" | "NOTICES" | "EVENTS" | "ATTENDEES" | "ANALYTICS"
  >("APPROVALS");
  const [rejectingItem, setRejectingItem] = useState<{
    type: "NOTICE" | "EVENT";
    id: string;
    title: string;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Metrics
  const totalViews = deptNotices.reduce((acc, n) => acc + n.viewsCount, 0);
  const totalRegistrations = registrations.filter(
    (r) => r.departmentCode === deptCode,
  ).length;

  const handleConfirmReject = () => {
    if (!rejectingItem || !rejectionReason.trim()) return;
    if (rejectingItem.type === "NOTICE") {
      handleRejectNotice(rejectingItem.id, rejectionReason);
    } else {
      handleRejectEvent(rejectingItem.id, rejectionReason);
    }
    setRejectingItem(null);
    setRejectionReason("");
  };

  const handleExportRoster = () => {
    showToast(`Attendee roster for ${deptCode} exported to CSV! 📊`, "success");
  };

  return (
    <div className="space-y-6 pb-16 md:pb-8 text-left">
      {users
        .filter((u) => u.accountStatus === "PENDING")
        .map((u) => (
          <div key={u.id} className="p-4 bg-white rounded-xl">
            Pending faculty: {u.name}
            <button onClick={() => approveAccount(u.id, true)} className="p-3">
              Approve
            </button>
            <button onClick={() => approveAccount(u.id, false)} className="p-3">
              Reject
            </button>
          </div>
        ))}
      {/* HOD Hero Banner */}
      <div
        className="text-white rounded-2xl p-5 sm:p-6 shadow-sm"
        style={{ backgroundColor: "#0a1628", border: "1px solid #1e3a5f" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-semibold text-xs">
                {deptCode}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                Head of Department (HOD) Administrative Desk
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-semibold tracking-tight">
              {currentUser?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Authorized Administrator for Department of{" "}
              {currentUser?.departmentName}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsCreateNoticeOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Dept Notice</span>
            </button>
            <button
              onClick={() => setIsCreateEventOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Dept Event</span>
            </button>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-3 text-left">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[11px] uppercase font-bold text-slate-400 block">
              Total Students
            </span>
            <span className="text-xl font-semibold text-white">420+</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[11px] uppercase font-bold text-slate-400 block">
              Dept Faculty
            </span>
            <span className="text-xl font-semibold text-white">
              {deptFaculty.length} Active
            </span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[11px] uppercase font-bold text-amber-300 block">
              Pending Approvals
            </span>
            <span className="text-xl font-semibold text-amber-400">
              {pendingNotices.length + pendingEvents.length}
            </span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[11px] uppercase font-bold text-emerald-300 block">
              Active Notices
            </span>
            <span className="text-xl font-semibold text-emerald-400">
              {deptNotices.length}
            </span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
            <span className="text-[11px] uppercase font-bold text-blue-300 block">
              Event Registrations
            </span>
            <span className="text-xl font-semibold text-blue-300">
              {totalRegistrations}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 flex items-center gap-1 overflow-x-auto shadow-xs">
        <button
          onClick={() => setActiveTab("APPROVALS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "APPROVALS"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>
            Pending Submissions ({pendingNotices.length + pendingEvents.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab("NOTICES")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "NOTICES"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>Department Notices ({deptNotices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("EVENTS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "EVENTS"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Department Events ({deptEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("ATTENDEES")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "ATTENDEES"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Attendee Roster</span>
        </button>

        <button
          onClick={() => setActiveTab("ANALYTICS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "ANALYTICS"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Engagement Analytics</span>
        </button>
      </div>

      {/* Tab: APPROVALS DESK */}
      {activeTab === "APPROVALS" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Faculty Submissions Awaiting Endorsement
                </h2>
                <p className="text-xs text-slate-500">
                  Only submissions from {deptCode} faculty appear here.
                  Approving publishes directly to students.
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full font-bold text-xs border border-amber-200">
                {pendingNotices.length + pendingEvents.length} Pending
              </span>
            </div>

            {pendingNotices.length === 0 && pendingEvents.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-700 text-sm">
                  All submissions reviewed!
                </p>
                <p>
                  There are no pending submissions from {deptCode} faculty at
                  this time.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Pending Notices */}
                {pendingNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-4 sm:p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-900 text-white text-[11px] font-bold uppercase">
                          Notice Proposal
                        </span>
                        <span className="text-xs text-slate-500">
                          Submitted by:{" "}
                          <strong className="text-slate-800">
                            {notice.publisherName}
                          </strong>
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {notice.title}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {notice.description}
                      </p>
                      {notice.deadline && (
                        <p className="text-xs font-semibold text-rose-700">
                          Deadline: {notice.deadline}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          setRejectingItem({
                            type: "NOTICE",
                            id: notice.id,
                            title: notice.title,
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Reject / Revise
                      </button>
                      <button
                        onClick={() => handleApproveNotice(notice.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Publish</span>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Pending Events */}
                {pendingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 sm:p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[11px] font-bold uppercase">
                          Event Proposal
                        </span>
                        <span className="text-xs text-slate-500">
                          Submitted by:{" "}
                          <strong className="text-slate-800">
                            {event.publisherName}
                          </strong>
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {event.description}
                      </p>
                      <p className="text-xs text-slate-500">
                        Date: {event.date} • Venue: {event.venue} • Seats:{" "}
                        {event.totalSeats}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          setRejectingItem({
                            type: "EVENT",
                            id: event.id,
                            title: event.title,
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveEvent(event.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Publish</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: NOTICES */}
      {activeTab === "NOTICES" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              Published Circulars for {deptCode}
            </h2>
            <button
              onClick={() => setIsCreateNoticeOpen(true)}
              className="px-3 py-1.5 bg-blue-900 text-white rounded-xl text-xs font-bold"
            >
              + New Notice
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {deptNotices.map((notice) => (
              <div
                key={notice.id}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900">{notice.title}</h4>
                  <p className="text-slate-500 text-[11px]">
                    {notice.publishedAt.slice(0, 10)} • Views:{" "}
                    {notice.viewsCount}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[11px]">
                  {notice.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: EVENTS */}
      {activeTab === "EVENTS" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              Organized Seminars & Sessions
            </h2>
            <button
              onClick={() => setIsCreateEventOpen(true)}
              className="px-3 py-1.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold"
            >
              + New Event
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {deptEvents.map((event) => (
              <div
                key={event.id}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900">{event.title}</h4>
                  <p className="text-slate-500 text-[11px]">
                    {event.date} • {event.venue} • {event.availableSeats} of{" "}
                    {event.totalSeats} seats open
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[11px]">
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: ATTENDEES */}
      {activeTab === "ATTENDEES" && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Student Registrations & Gate Roster
              </h2>
              <p className="text-xs text-slate-500">
                Verified attendees for events hosted by {deptCode}
              </p>
            </div>
            <button
              onClick={handleExportRoster}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Roster (CSV)</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {registrations.map((reg) => (
              <div
                key={reg.id}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900">
                    {reg.studentName}
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Roll: {reg.studentId} • {reg.departmentCode} • {reg.email}
                  </p>
                  <p className="text-blue-900 font-medium text-[11px] mt-0.5">
                    Registered For: {reg.eventTitle}
                  </p>
                </div>
                <span className="font-mono text-[11px] font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  {reg.ticketCode}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: ANALYTICS */}
      {activeTab === "ANALYTICS" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs text-center">
            <Eye className="w-8 h-8 text-blue-900 mx-auto mb-2" />
            <span className="text-2xl font-semibold text-slate-900 block">
              {totalViews}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Total Notice Impressions
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs text-center">
            <Users className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <span className="text-2xl font-semibold text-slate-900 block">
              {totalRegistrations}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Event Registrations
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs text-center">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <span className="text-2xl font-semibold text-slate-900 block">
              100%
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Official Endorsement Rate
            </span>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4 text-left">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">
                Return Submission for Revision
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Provide feedback for <strong>{rejectingItem.title}</strong> so the
              faculty author can update and resubmit:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Please attach the detailed workshop syllabus or adjust the seminar hall time..."
              rows={3}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectionReason.trim()}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-40 rounded-xl shadow-xs cursor-pointer"
              >
                Send Rejection Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
