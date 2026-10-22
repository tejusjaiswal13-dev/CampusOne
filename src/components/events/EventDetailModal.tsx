import {
  Bookmark,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Globe,
  MapPin,
  Share2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import React from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";
import { CampusEvent } from "../../types";

interface EventDetailModalProps {
  event: CampusEvent | null;
  onClose: () => void;
  onOpenRegister: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onOpenRegister,
}) => {
  const { currentUser } = useAuth();
  const { handleToggleBookmark, isItemBookmarked, showToast } = useApp();

  if (!event) return null;

  const isRegistered =
    currentUser && event.registeredUserIds.includes(currentUser.id);
  const today = new Date().toLocaleDateString("en-CA");
  const registrationClosed =
    event.status !== "APPROVED" ||
    event.availableSeats <= 0 ||
    event.date < today ||
    event.registrationDeadline < today;
  const isBookmarked = isItemBookmarked(event.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/#event-${event.id}`,
      );
      showToast("Event link copied to clipboard! 📋", "success");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Banner with close button */}
        <div className="relative h-48 sm:h-56 w-full bg-slate-900">
          <img
            src={event.bannerImage || "/campus-placeholder.svg"}
            alt={event.title}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

          {/* Top buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-semibold text-xs uppercase tracking-wider shadow-md">
              {event.category}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  handleToggleBookmark({
                    itemType: "EVENT",
                    itemId: event.id,
                    title: event.title,
                    subtitle: `${event.date} • ${event.venue}`,
                    category: event.category,
                    date: event.date,
                  })
                }
                className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-colors"
                title="Bookmark Event"
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? "fill-amber-400 text-amber-400" : ""}`}
                />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-colors"
                title="Share Event"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title on banner */}
          <div className="absolute bottom-4 left-4 right-4 text-left">
            <h2 className="text-lg sm:text-2xl font-semibold text-white leading-tight">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5 flex-1 text-left">
          {/* Logistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">
                  Date
                </span>
                <p className="font-bold text-slate-900">{event.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">
                  Time
                </span>
                <p className="font-bold text-slate-900">{event.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">
                  Venue
                </span>
                <p className="font-bold text-slate-900 truncate">
                  {event.venue}
                </p>
              </div>
            </div>
          </div>

          {/* Key tags */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold border ${
                event.scope === "COLLEGE"
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-amber-50 text-amber-900 border-amber-200"
              }`}
            >
              {event.scope === "COLLEGE" ? (
                <Globe className="w-3.5 h-3.5" />
              ) : (
                <Building2 className="w-3.5 h-3.5" />
              )}
              <span>
                {event.scope === "COLLEGE"
                  ? "Campus-Wide Event"
                  : `${event.departmentCode} Department`}
              </span>
            </span>

            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
              Organizer: {event.organizer}
            </span>

            <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-medium ml-auto">
              Registration closes: {event.registrationDeadline}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              About This Event
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Speaker Card */}
          {event.speaker && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-amber-800 uppercase font-bold tracking-wider">
                  Featured Speaker
                </span>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  {event.speaker}
                </p>
                {event.speakerDesignation && (
                  <p className="text-[11px] text-slate-600">
                    {event.speakerDesignation}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Capacity status */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-900" />
              <span className="font-semibold text-slate-700">
                Total Seating Capacity:
              </span>
              <span className="font-bold text-slate-900">
                {event.totalSeats} seats
              </span>
            </div>
            <span className="font-extrabold text-blue-900">
              {event.availableSeats} seats remaining
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
          >
            Close
          </button>

          {isRegistered ? (
            <button
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>View My Entry Pass</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              disabled={registrationClosed}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>
                {registrationClosed
                  ? "Registration closed"
                  : "Register for Event"}
              </span>
              <span className="text-amber-400">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
