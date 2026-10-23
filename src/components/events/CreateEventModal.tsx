import { AlertCircle, CalendarDays, X } from "lucide-react";
import React, { useState } from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";
import { ContentScope, EventCategory } from "../../types";

export const CreateEventModal: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { isCreateEventOpen, setIsCreateEventOpen, handleCreateEvent } =
    useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<EventCategory>("Workshop");
  const [scope, setScope] = useState<ContentScope>(
    role === "COLLEGE_ADMIN" ? "COLLEGE" : "DEPARTMENT",
  );
  const [date, setDate] = useState("2026-10-12");
  const [time, setTime] = useState("11:00 AM - 02:30 PM");
  const [venue, setVenue] = useState("IPS Central Auditorium");
  const [speaker, setSpeaker] = useState("");
  const [totalSeats, setTotalSeats] = useState(80);
  const [registrationDeadline, setRegistrationDeadline] =
    useState("2026-10-10");

  if (!isCreateEventOpen) return null;

  const isFaculty = role === "FACULTY";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const saved = await handleCreateEvent({
      title,
      description,
      category,
      scope,
      date,
      time,
      venue,
      speaker: speaker || "Invited Industry Expert",
      totalSeats: Number(totalSeats),
      availableSeats: Number(totalSeats),
      registrationDeadline,
      organizer: `${currentUser?.departmentCode || "IPS"} Department`,
    });

    if (!saved) return;
    setIsCreateEventOpen(false);
    setTitle("");
    setDescription("");
    setSpeaker("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] text-left">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">
              {isFaculty
                ? "Propose Event / Seminar (HOD Approval)"
                : "Publish Campus Event"}
            </h2>
          </div>
          <button
            onClick={() => setIsCreateEventOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isFaculty && (
          <div className="bg-amber-50 border-b border-amber-200 p-3 flex items-center gap-2 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              This event proposal will be reviewed by your HOD before opening
              student registrations.
            </span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs"
        >
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cyber Security Summit / Python Hands-On Bootcamp..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold cursor-pointer"
              >
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Conference">Conference</option>
                <option value="Technical">Technical / Hackathon</option>
                <option value="Cultural">Cultural</option>
                <option value="Guest Lecture">Guest Lecture</option>
                <option value="Competition">Competition</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Scope
              </label>
              <select
                value={scope}
                disabled={role === "FACULTY"}
                onChange={(e) => setScope(e.target.value as ContentScope)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold cursor-pointer disabled:bg-slate-100"
              >
                <option value="DEPARTMENT">
                  Department Level ({currentUser?.departmentCode})
                </option>
                {role === "COLLEGE_ADMIN" && (
                  <option value="COLLEGE">Entire College</option>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 cursor-pointer"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Time Range
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10:00 AM - 01:00 PM"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Venue
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. CCET Lab 2 / Senate Hall"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Speaker / Guest
              </label>
              <input
                type="text"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                placeholder="e.g. Er. Manish Verma (AWS)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Total Available Seats
              </label>
              <input
                type="number"
                min={10}
                max={500}
                value={totalSeats}
                onChange={(e) => setTotalSeats(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Registration Cutoff
              </label>
              <input
                type="date"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Event Agenda & Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe objectives, prerequisites, topics covered, and certificates..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateEventOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl shadow-xs cursor-pointer"
            >
              {isFaculty ? "Submit Proposal to HOD" : "Publish Official Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
