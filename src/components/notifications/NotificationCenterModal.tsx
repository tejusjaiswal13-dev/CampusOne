import {
  AlertTriangle,
  BellRing,
  Briefcase,
  CalendarDays,
  CheckCheck,
  CheckCircle2,
  GraduationCap,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";
import { configureReminders } from "../../services/nativeService";

export const NotificationCenterModal: React.FC = () => {
  const {
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    notifications,
    showToast,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setCurrentTab,
    setSelectedNotice,
    setSelectedEvent,
    notices,
    events,
  } = useApp();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  if (!isNotificationCenterOpen) return null;

  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser?.id || n.userId === "ALL",
  );

  const displayed =
    filter === "UNREAD"
      ? userNotifications.filter((n) => !n.isRead)
      : userNotifications;

  const getIcon = (type: string) => {
    switch (type) {
      case "URGENT":
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case "EVENT":
        return <CalendarDays className="w-4 h-4 text-blue-600" />;
      case "EXAM":
        return <GraduationCap className="w-4 h-4 text-amber-600" />;
      case "CAREER":
        return <Briefcase className="w-4 h-4 text-emerald-600" />;
      case "APPROVAL":
        return <CheckCircle2 className="w-4 h-4 text-purple-600" />;
      default:
        return <BellRing className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleNotificationClick = (notif: (typeof notifications)[0]) => {
    markNotificationAsRead(notif.id);
    setIsNotificationCenterOpen(false);

    if (notif.linkTarget) {
      setCurrentTab(notif.linkTarget.tab);
      if (notif.linkTarget.itemId) {
        if (notif.linkTarget.tab === "notices") {
          const match = notices.find((n) => n.id === notif.linkTarget?.itemId);
          if (match) setSelectedNotice(match);
        } else if (notif.linkTarget.tab === "events") {
          const match = events.find((e) => e.id === notif.linkTarget?.itemId);
          if (match) setSelectedEvent(match);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">Campus Notifications</h2>
          </div>
          <button
            onClick={() => setIsNotificationCenterOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex gap-1.5">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filter === "ALL"
                  ? "bg-blue-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({userNotifications.length})
            </button>
            <button
              onClick={() => setFilter("UNREAD")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filter === "UNREAD"
                  ? "bg-blue-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              Unread ({userNotifications.filter((n) => !n.isRead).length})
            </button>
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-900 hover:text-blue-700"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        </div>

        <button
          className="p-3 text-xs text-blue-900"
          onClick={async () => {
            if (!currentUser) return;
            const enabled =
              localStorage.getItem(`campus-reminders:${currentUser.id}`) !==
              "true";
            try {
              await configureReminders(
                currentUser.id,
                enabled,
                notices.filter(
                  (n) =>
                    n.scope === "COLLEGE" ||
                    n.departmentCode === currentUser.departmentCode,
                ),
                userNotifications,
              );
              showToast(
                enabled
                  ? "Device approval and deadline reminders scheduled."
                  : "Device reminders disabled.",
              );
            } catch (error) {
              showToast(
                error instanceof Error
                  ? error.message
                  : "Could not configure reminders.",
                "error",
              );
            }
          }}
        >
          Toggle device approval / deadline reminders
        </button>
        {/* Notification items */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1 divide-y divide-slate-100">
          {displayed.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <BellRing className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-600">All caught up!</p>
              <p>No notifications to display right now.</p>
            </div>
          ) : (
            displayed.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`pt-2.5 pb-2 px-3 rounded-xl transition-colors cursor-pointer text-left ${
                  !n.isRead ? "bg-blue-50/60 font-medium" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {n.title}
                      </h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                      {n.message}
                    </p>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      {new Date(n.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
