import {
  ArrowRight,
  BellRing,
  Bookmark,
  Briefcase,
  CalendarDays,
  FileText,
  Trash2,
} from "lucide-react";
import React from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";
import { EmptyState } from "../common/EmptyState";

export const BookmarksView: React.FC = () => {
  const {
    bookmarks,
    handleToggleBookmark,
    setCurrentTab,
    setSelectedNotice,
    setSelectedEvent,
    notices,
    events,
  } = useApp();
  const { currentUser } = useAuth();

  const userBookmarks = bookmarks.filter((b) => b.userId === currentUser?.id);

  const getItemIcon = (type: string) => {
    switch (type) {
      case "NOTICE":
        return <BellRing className="w-4 h-4 text-blue-900" />;
      case "EVENT":
        return <CalendarDays className="w-4 h-4 text-amber-600" />;
      case "CAREER":
        return <Briefcase className="w-4 h-4 text-emerald-600" />;
      default:
        return <FileText className="w-4 h-4 text-purple-600" />;
    }
  };

  const handleOpenItem = (bm: (typeof bookmarks)[0]) => {
    if (bm.itemType === "NOTICE") {
      const targetNotice = notices.find((n) => n.id === bm.itemId);
      if (targetNotice) {
        setSelectedNotice(targetNotice);
      } else {
        setCurrentTab("notices");
      }
    } else if (bm.itemType === "EVENT") {
      const targetEvent = events.find((e) => e.id === bm.itemId);
      if (targetEvent) {
        setSelectedEvent(targetEvent);
      } else {
        setCurrentTab("events");
      }
    } else if (bm.itemType === "CAREER") {
      setCurrentTab("career");
    }
  };

  return (
    <div className="space-y-5 pb-16 md:pb-6 text-left">
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-2 rounded-xl bg-amber-50 text-amber-900">
            <Bookmark className="w-5 h-5 text-amber-600 fill-current" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Saved Items & Bookmarks
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Quick access to your saved circulars, registered events, career
              deadlines, and academic syllabi.
            </p>
          </div>
        </div>
      </div>

      {userBookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarked items yet"
          description="Click the bookmark icon on any notice, event, or internship opportunity to save it here for fast offline reference."
          actionText="Browse Campus Notices"
          onAction={() => setCurrentTab("notices")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userBookmarks.map((bm) => (
            <div
              key={bm.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
                    {getItemIcon(bm.itemType)}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      {bm.category || bm.itemType}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {bm.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{bm.subtitle}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleBookmark({
                      itemType: bm.itemType,
                      itemId: bm.itemId,
                      title: bm.title,
                      subtitle: bm.subtitle,
                      category: bm.category,
                      date: bm.date,
                    });
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => handleOpenItem(bm)}
                aria-label={`View ${bm.title}`}
                className="min-h-11 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-900"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
