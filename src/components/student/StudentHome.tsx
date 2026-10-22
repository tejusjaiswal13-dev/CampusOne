import {
  ArrowRight,
  ArrowUpRight,
  BellRing,
  Bookmark,
  Briefcase,
  Building2,
  CalendarDays,
  Clock,
  GraduationCap,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";
import type { CampusEvent } from "../../types";
import { EventDetailModal } from "../events/EventDetailModal";
import { EventRegisterModal } from "../events/EventRegisterModal";
import { NoticeCard } from "../notices/NoticeCard";
import { NoticeDetailModal } from "../notices/NoticeDetailModal";
import { SmartTimetableTracker } from "./SmartTimetableTracker";

export const StudentHome = () => {
  const { currentUser } = useAuth();
  const {
    setCurrentTab,
    getStudentNotices,
    getStudentEvents,
    getStudentClassAlerts,
    handleMarkClassNoticeRead,
    bookmarks,
    exams,
    selectedNotice,
    setSelectedNotice,
    selectedEvent,
    setSelectedEvent,
  } = useApp();
  const [registeringEvent, setRegisteringEvent] = useState<CampusEvent | null>(
    null,
  );
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const notices = [...getStudentNotices()].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  const events = getStudentEvents()
    .filter((e) => e.status === "APPROVED" && e.date >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextExam = exams
    .filter(
      (e) =>
        e.departmentCode === currentUser?.departmentCode &&
        (!currentUser?.semester || e.semester === currentUser.semester) &&
        e.date >= todayKey,
    )
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const alerts = getStudentClassAlerts().filter(
    (a) => !a.readByUserIds.includes(currentUser?.id || ""),
  );
  const savedCount = bookmarks.filter(
    (b) => b.userId === currentUser?.id,
  ).length;
  const greeting =
    today.getHours() < 12
      ? "Good morning"
      : today.getHours() < 17
        ? "Good afternoon"
        : "Good evening";
  return (
    <div className="co-home animate-fade-in">
      <div className="co-page-heading">
        <div>
          <span className="co-eyebrow">YOUR DAILY CAMPUS EDIT</span>
          <h1>
            {greeting}, {currentUser?.name.split(" ")[0] || "there"}
            <span className="co-coral">.</span>
          </h1>
          <p>Everything that matters. Right where you need it.</p>
        </div>
        <span className="co-date">
          <CalendarDays size={16} />
          {today.toLocaleDateString(undefined, {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>
      <section className="co-hero">
        <div className="co-hero-copy">
          <span className="co-pill light">
            <span className="co-status-dot" />{" "}
            {currentUser?.departmentCode || "IPS"} · Your department
          </span>
          <h2>
            A little more connected.
            <br />A lot more campus.
          </h2>
          <p>
            Make room for what’s next. Your notices, classes and opportunities,
            all together.
          </p>
          <button
            className="co-button coral"
            onClick={() => setCurrentTab("explore")}
          >
            Explore your campus <ArrowUpRight size={18} />
          </button>
        </div>
        <div className="co-campus-art" aria-hidden="true">
          <div className="co-sun" />
          <div className="co-orbit" />
          <div className="co-building">
            <div className="co-roof" />
            <div className="co-windows">
              {Array.from({ length: 12 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
            <div className="co-door" />
          </div>
          <div className="co-art-caption">ONE PLATFORM / ENTIRE CAMPUS</div>
        </div>
      </section>
      <div className="co-overview">
        <button onClick={() => setCurrentTab("notices")}>
          <span className="co-overview-icon">
            <BellRing size={20} />
          </span>
          <span>
            <strong>{notices.length}</strong>
            <small>Department updates</small>
          </span>
          <ArrowUpRight size={16} />
        </button>
        <button onClick={() => setCurrentTab("events")}>
          <span className="co-overview-icon">
            <CalendarDays size={20} />
          </span>
          <span>
            <strong>{events.length}</strong>
            <small>Upcoming events</small>
          </span>
          <ArrowUpRight size={16} />
        </button>
        <button onClick={() => setCurrentTab("bookmarks")}>
          <span className="co-overview-icon">
            <Bookmark size={20} />
          </span>
          <span>
            <strong>{savedCount}</strong>
            <small>Saved for later</small>
          </span>
          <ArrowUpRight size={16} />
        </button>
      </div>
      <button
        className="co-mobile-search"
        onClick={() => setCurrentTab("search")}
      >
        <Search size={19} />
        <span>Find a notice, event or opportunity…</span>
        <ArrowRight size={17} />
      </button>
      <div className="co-home-grid">
        <div className="co-home-main">
          <div className="co-section-heading">
            <div>
              <span className="co-eyebrow">THE NOTICEBOARD</span>
              <h2>In your department</h2>
            </div>
            <button onClick={() => setCurrentTab("notices")}>
              All updates <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="co-notice-stack">
            {notices.length ? (
              notices
                .slice(0, 3)
                .map((n) => (
                  <NoticeCard
                    key={n.id}
                    notice={n}
                    onClick={() => setSelectedNotice(n)}
                  />
                ))
            ) : (
              <div className="co-empty">
                <BellRing />
                <h3>You’re all caught up</h3>
                <p>New department updates will appear here.</p>
              </div>
            )}
          </div>
          <div className="co-section-heading">
            <div>
              <span className="co-eyebrow">MAKE SOMETHING OF TODAY</span>
              <h2>Beyond the classroom</h2>
            </div>
            <button onClick={() => setCurrentTab("events")}>
              All events <ArrowUpRight size={16} />
            </button>
          </div>
          {events.length ? (
            events.slice(0, 2).map((event) => (
              <button
                className="co-event-row"
                key={event.id}
                onClick={() => setSelectedEvent(event)}
              >
                <span className="co-calendar-tile">
                  <small>
                    {new Date(event.date + "T12:00:00").toLocaleDateString(
                      undefined,
                      { month: "short" },
                    )}
                  </small>
                  <strong>{event.date.slice(-2)}</strong>
                </span>
                <span>
                  <small className="co-eyebrow">{event.category}</small>
                  <strong>{event.title}</strong>
                  <small>
                    {event.venue} · {event.time}
                  </small>
                </span>
                <ArrowUpRight size={20} />
              </button>
            ))
          ) : (
            <div className="co-empty">
              <CalendarDays />
              <h3>A little breathing room</h3>
              <p>No upcoming events are listed for your department.</p>
              <button
                className="co-text-button"
                onClick={() => setCurrentTab("events")}
              >
                Browse the event archive <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
        <aside className="co-home-aside">
          <section className="co-panel">
            <div className="co-section-heading">
              <h2>Your shortcuts</h2>
              <span className="co-eyebrow">QUICK ACCESS</span>
            </div>
            <div className="co-shortcuts">
              {[
                { tab: "timetable", label: "Timetable", icon: Clock },
                { tab: "exams", label: "Exams", icon: GraduationCap },
                { tab: "career", label: "Careers", icon: Briefcase },
                { tab: "campus", label: "Campus guide", icon: Building2 },
              ].map(({ tab, label, icon: Icon }) => (
                <button key={tab} onClick={() => setCurrentTab(tab)}>
                  <Icon size={22} />
                  <span>{label}</span>
                  <ArrowUpRight size={13} />
                </button>
              ))}
            </div>
          </section>
          <section className="co-panel co-agenda">
            <span className="co-eyebrow">ON YOUR RADAR</span>
            <h2>{nextExam ? nextExam.subjectName : "Your next chapter"}</h2>
            <p>
              {nextExam
                ? `${nextExam.examType} · ${nextExam.date} · ${nextExam.room}`
                : "Keep your academic dates close. See the calendar for deadlines and semester updates."}
            </p>
            <button
              className="co-text-button"
              onClick={() => setCurrentTab(nextExam ? "exams" : "calendar")}
            >
              {nextExam ? "View exam details" : "Open academic calendar"}{" "}
              <ArrowRight size={16} />
            </button>
          </section>
          {alerts.length > 0 && (
            <section className="co-panel">
              <span className="co-eyebrow">CLASS UPDATES</span>
              {alerts.slice(0, 2).map((a) => (
                <div className="co-class-alert" key={a.id}>
                  <h3>{a.title}</h3>
                  <p>{a.message}</p>
                  <button
                    className="co-text-button"
                    onClick={() => handleMarkClassNoticeRead(a.id)}
                  >
                    Mark as read
                  </button>
                </div>
              ))}
            </section>
          )}
          <SmartTimetableTracker />
        </aside>
      </div>
      <p className="co-demo-footnote">
        Demo workspace · Sample information is stored on this device. Confirm
        official dates with your department.
      </p>
      <NoticeDetailModal
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
      />
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onOpenRegister={() => {
          if (selectedEvent) setRegisteringEvent(selectedEvent);
        }}
      />
      <EventRegisterModal
        event={registeringEvent}
        onClose={() => setRegisteringEvent(null)}
      />
    </div>
  );
};
