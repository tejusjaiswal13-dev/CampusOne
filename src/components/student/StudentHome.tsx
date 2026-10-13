import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { NoticeCard } from '../notices/NoticeCard';
import { NoticeDetailModal } from '../notices/NoticeDetailModal';
import { EventDetailModal } from '../events/EventDetailModal';
import { EventRegisterModal } from '../events/EventRegisterModal';
import { SmartTimetableTracker } from './SmartTimetableTracker';
import {
  BellRing,
  CalendarDays,
  GraduationCap,
  Briefcase,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen
} from 'lucide-react';
import { CampusEvent } from '../../types';

const NAVY = '#0a1628';
const CORAL = '#ff6b6b';
const GOLD = '#f59e0b';

export const StudentHome: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    setCurrentTab,
    getStudentNotices,
    getStudentEvents,
    getStudentClassAlerts,
    handleMarkClassNoticeRead,
    showToast,
    exams,
    career,
    setSelectedNotice,
    setSelectedEvent,
    selectedNotice,
    selectedEvent
  } = useApp();

  const [registeringEvent, setRegisteringEvent] = React.useState<CampusEvent | null>(null);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const studentNotices = getStudentNotices();
  const urgentNotices = studentNotices.filter(n => n.isUrgent);
  const departmentNotices = studentNotices.filter(n => n.scope === 'DEPARTMENT' && !n.isUrgent);
  const collegeNotices = studentNotices.filter(n => n.scope === 'COLLEGE' && !n.isUrgent);
  const classAlerts = getStudentClassAlerts();

  const upcomingEvents = getStudentEvents().slice(0, 2);

  const studentExams = exams
    .filter(e => e.departmentCode === (currentUser?.departmentCode || 'CCET'))
    .slice(0, 2);

  const topJobs = career
    .filter(c =>
      c.departmentCodes.includes(currentUser?.departmentCode || 'CCET') ||
      c.departmentCodes.includes('ALL')
    )
    .slice(0, 2);

  // Quick action grid items — streamlined to 5
  const quickActions = [
    { label: 'Timetable', icon: Clock,        tab: 'timetable', color: '#eef2f8', textColor: NAVY },
    { label: 'Notices',   icon: BellRing,     tab: 'notices',   color: '#fff2f0', textColor: '#c43030' },
    { label: 'Events',    icon: CalendarDays, tab: 'events',    color: '#f0fdf4', textColor: '#166534' },
    { label: 'Exams',     icon: GraduationCap,tab: 'exams',     color: '#fffbeb', textColor: '#92400e' },
    { label: 'Career',    icon: Briefcase,    tab: 'career',    color: '#faf5ff', textColor: '#6b21a8' },
  ] as const;

  return (
    <div className="space-y-5 pb-24 text-left">

      {/* ── GREETING STRIP ── */}
      <div
        className="rounded-2xl px-5 py-4 flex items-center justify-between"
        style={{ backgroundColor: NAVY, color: 'white' }}
      >
        <div>
          <p className="text-xs font-medium" style={{ color: '#94a3b8' }}>
            {getGreeting()} 👋
          </p>
          <h1 className="text-lg font-black tracking-tight">
            {currentUser?.name?.split(' ')[0] || 'Student'}
          </h1>
          <p className="text-[11px] mt-0.5" style={{ color: '#64748b' }}>
            {currentUser?.course || 'BCA'} · Sem {currentUser?.semester || 5} ·{' '}
            {currentUser?.departmentCode || 'CCET'}
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('timetable')}
          className="shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl cursor-pointer active:scale-95 transition-all"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <Clock className="w-5 h-5" style={{ color: GOLD }} />
          <span className="text-[10px] font-bold text-white">Schedule</span>
        </button>
      </div>

      {/* ── DIRECT CLASS ALERTS (Professor → Student) ── */}
      {classAlerts.length > 0 && (
        <div className="space-y-2.5">
          {classAlerts.map(alert => {
            const isRead = currentUser ? alert.readByUserIds.includes(currentUser.id) : false;
            const isCancelled = alert.noticeType === 'CLASS_CANCELLED';
            const isRoom     = alert.noticeType === 'ROOM_CHANGED';
            const stripColor = isCancelled ? CORAL : isRoom ? GOLD : '#2d5898';
            const bgColor    = isCancelled ? '#fff2f0' : isRoom ? '#fffbeb' : '#eef2f8';
            const borderColor= isCancelled ? '#ffc2b9' : isRoom ? '#fde68a' : '#adbde0';

            return (
              <div
                key={alert.id}
                className="rounded-2xl p-4 relative overflow-hidden"
                style={{
                  backgroundColor: isRead ? '#f8fafc' : bgColor,
                  border: `1px solid ${isRead ? '#e2e8f0' : borderColor}`,
                  opacity: isRead ? 0.8 : 1
                }}
              >
                {/* left strip */}
                <div
                  className="absolute top-0 left-0 bottom-0 w-1"
                  style={{ backgroundColor: stripColor }}
                />

                <div className="pl-3 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: stripColor }}
                      >
                        {alert.noticeType.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] font-semibold" style={{ color: '#475569' }}>
                        {alert.facultyName} · {alert.subjectCode}
                      </span>
                      {!isRead && (
                        <span
                          className="inline-flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: CORAL }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          NEW
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold" style={{ color: '#0f172a' }}>
                      {alert.title}
                    </h3>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#475569' }}>
                      {alert.message}
                    </p>
                  </div>

                  {!isRead ? (
                    <button
                      onClick={() => {
                        handleMarkClassNoticeRead(alert.id);
                        showToast('Notice acknowledged', 'success');
                      }}
                      className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-white cursor-pointer active:scale-95 transition-all"
                      style={{ backgroundColor: NAVY }}
                    >
                      <CheckCircle2 className="w-3 h-3" style={{ color: '#4ade80' }} />
                      Got it
                    </button>
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── URGENT NOTICES ── */}
      {urgentNotices.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <span
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
              style={{ color: CORAL }}
            >
              <AlertCircle className="w-4 h-4" />
              Urgent Notices
            </span>
            <button
              onClick={() => setCurrentTab('notices')}
              className="text-xs font-semibold cursor-pointer"
              style={{ color: '#475569' }}
            >
              View all →
            </button>
          </div>

          {urgentNotices.slice(0, 2).map(notice => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onClick={() => setSelectedNotice(notice)}
              compact
            />
          ))}
        </div>
      )}

      {/* ── SMART TIMETABLE (compact inline widget) ── */}
      <SmartTimetableTracker />

      {/* ── QUICK ACTIONS ── */}
      <div className="grid grid-cols-5 gap-2">
        {quickActions.map(({ label, icon: Icon, tab, color, textColor }) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl cursor-pointer active:scale-90 transition-all"
            style={{ backgroundColor: color }}
          >
            <Icon className="w-5 h-5" style={{ color: textColor }} />
            <span className="text-[10px] font-bold leading-none" style={{ color: textColor }}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* ── DEPARTMENT NOTICES ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded font-mono"
              style={{ backgroundColor: GOLD, color: NAVY }}
            >
              {currentUser?.departmentCode || 'CCET'}
            </span>
            <h2 className="text-sm font-bold" style={{ color: '#0f172a' }}>
              Department Notices
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('notices')}
            className="flex items-center gap-0.5 text-xs font-semibold cursor-pointer"
            style={{ color: '#475569' }}
          >
            All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {departmentNotices.length === 0 ? (
          <div
            className="py-8 text-center rounded-2xl border-2 border-dashed"
            style={{ borderColor: '#e2e8f0' }}
          >
            <BellRing className="w-6 h-6 mx-auto mb-1.5" style={{ color: '#cbd5e1' }} />
            <p className="text-xs" style={{ color: '#94a3b8' }}>
              No active department notices
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {departmentNotices.slice(0, 3).map(notice => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onClick={() => setSelectedNotice(notice)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── UPCOMING EVENTS ── */}
      {upcomingEvents.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold" style={{ color: '#0f172a' }}>
              Upcoming Events
            </h2>
            <button
              onClick={() => setCurrentTab('events')}
              className="flex items-center gap-0.5 text-xs font-semibold cursor-pointer"
              style={{ color: '#475569' }}
            >
              All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingEvents.map(event => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="rounded-2xl p-4 flex items-center justify-between gap-3 cursor-pointer active:scale-[0.985] transition-all"
                style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#eef2f8' }}
                  >
                    <CalendarDays className="w-5 h-5" style={{ color: NAVY }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold line-clamp-1" style={{ color: '#0f172a' }}>
                      {event.title}
                    </h3>
                    <p className="text-[11px] mt-0.5" style={{ color: '#64748b' }}>
                      {event.date} · {event.venue}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" style={{ color: '#94a3b8' }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── EXAMS & CAREER ── side-by-side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Exams */}
        {studentExams.length > 0 && (
          <section
            className="rounded-2xl p-4 space-y-3"
            style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" style={{ color: CORAL }} />
                <h3 className="text-xs font-bold uppercase tracking-wide" style={{ color: '#0f172a' }}>
                  Upcoming Exams
                </h3>
              </div>
              <button
                onClick={() => setCurrentTab('exams')}
                className="text-[11px] font-semibold cursor-pointer"
                style={{ color: '#475569' }}
              >
                Datesheet →
              </button>
            </div>

            <div className="space-y-2">
              {studentExams.map(ex => (
                <div
                  key={ex.id}
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold" style={{ color: NAVY }}>
                      {ex.subjectCode}
                    </span>
                    <span className="text-[11px] font-bold" style={{ color: CORAL }}>
                      {ex.date}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold mt-1 line-clamp-1" style={{ color: '#0f172a' }}>
                    {ex.subjectName}
                  </h4>
                  <p className="text-[10px] mt-0.5" style={{ color: '#94a3b8' }}>
                    {ex.room} · {ex.shift?.split('(')[0] || ''}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Career */}
        {topJobs.length > 0 && (
          <section
            className="rounded-2xl p-4 space-y-3"
            style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" style={{ color: '#16a34a' }} />
                <h3 className="text-xs font-bold uppercase tracking-wide" style={{ color: '#0f172a' }}>
                  Placement Drives
                </h3>
              </div>
              <button
                onClick={() => setCurrentTab('career')}
                className="text-[11px] font-semibold cursor-pointer"
                style={{ color: '#475569' }}
              >
                All Jobs →
              </button>
            </div>

            <div className="space-y-2">
              {topJobs.map(job => (
                <div
                  key={job.id}
                  onClick={() => setCurrentTab('career')}
                  className="p-3 rounded-xl cursor-pointer active:scale-[0.985] transition-all"
                  style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: '#0f172a' }}>
                      {job.company}
                    </span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: '#f0fdf4', color: '#166534' }}
                    >
                      {job.stipendOrSalary}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium mt-0.5" style={{ color: '#475569' }}>
                    {job.role}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: '#94a3b8' }}>
                    Apply by {job.applicationDeadline}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── COLLEGE CIRCULARS ── */}
      {collegeNotices.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold" style={{ color: '#0f172a' }}>
              University Circulars
            </h2>
            <button
              onClick={() => setCurrentTab('notices')}
              className="flex items-center gap-0.5 text-xs font-semibold cursor-pointer"
              style={{ color: '#475569' }}
            >
              All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {collegeNotices.slice(0, 3).map(notice => (
              <div
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl cursor-pointer active:scale-[0.985] transition-all"
                style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold line-clamp-1" style={{ color: '#0f172a' }}>
                    {notice.title}
                  </h4>
                  <p className="text-[10px] mt-0.5" style={{ color: '#94a3b8' }}>
                    {new Date(notice.publishedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" style={{ color: '#cbd5e1' }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── UNIVERSITY PORTALS ── */}
      <section
        className="rounded-2xl p-4 space-y-3"
        style={{ backgroundColor: NAVY }}
      >
        <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
          University Portals
        </h4>
        <div className="space-y-2">
          {[
            'Examination Portal & Admit Cards',
            'Online Fee Verification',
            'Semester Results'
          ].map(label => (
            <a
              key={label}
              href="https://allduniv.ac.in"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-white text-xs font-semibold transition-all"
              style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <span>{label}</span>
              <ExternalLink className="w-3.5 h-3.5" style={{ color: GOLD }} />
            </a>
          ))}
        </div>
      </section>

      {/* Modals */}
      <NoticeDetailModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onOpenRegister={() => { if (selectedEvent) setRegisteringEvent(selectedEvent); }}
      />
      <EventRegisterModal event={registeringEvent} onClose={() => setRegisteringEvent(null)} />
    </div>
  );
};
