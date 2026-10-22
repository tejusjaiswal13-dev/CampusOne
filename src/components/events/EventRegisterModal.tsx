import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  MapPin,
  QrCode,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useApp } from "../../context/AppState";
import { useAuth } from "../../context/AuthState";
import { CampusEvent, EventRegistration } from "../../types";

interface EventRegisterModalProps {
  event: CampusEvent | null;
  onClose: () => void;
}

export const EventRegisterModal: React.FC<EventRegisterModalProps> = ({
  event,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const { handleRegisterEvent, registrations, showToast } = useApp();
  const [completedReg, setCompletedReg] = useState<EventRegistration | null>(
    null,
  );

  if (!event) return null;

  // Check if already registered
  const existingReg = currentUser
    ? registrations.find(
        (r) => r.eventId === event.id && r.userId === currentUser.id,
      )
    : null;

  const currentRegistration = completedReg || existingReg;

  const handleConfirmRegistration = async () => {
    const res = await handleRegisterEvent(event);
    if (res.success && res.registration) {
      setCompletedReg(res.registration);
    }
  };

  const handleDownloadTicket = () => {
    showToast("Digital pass saved to device! 🎫", "success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {currentRegistration
                ? "Event Entry Pass"
                : "Confirm Registration"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-left">
          {/* Event title mini card */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4">
            <span className="px-2 py-0.5 rounded-md bg-blue-900 text-white font-bold text-[11px] uppercase tracking-wider">
              {event.category}
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-1.5 mb-2 leading-snug">
              {event.title}
            </h3>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>

          {/* Conditional view: Form vs Confirmed Digital Pass */}
          {currentRegistration ? (
            /* Confirmed Digital Ticket Pass */
            <div className="space-y-4 animate-scale-up">
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 flex items-center gap-2.5 text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-extrabold uppercase">
                    REGISTERED ✓{" "}
                  </span>
                  <span>
                    Your seat has been reserved. Present this pass at entry.
                  </span>
                </div>
              </div>

              {/* Digital Pass Card with simulated barcode/QR */}
              <div className="bg-gradient-to-b from-slate-900 to-blue-950 text-white rounded-3xl p-5 border border-amber-400/40 shadow-sm relative overflow-hidden">
                {/* Gold watermarks */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between pb-3 border-b border-white/15">
                  <div>
                    <p className="text-[11px] text-amber-300 uppercase tracking-widest font-bold">
                      IPS UOA EVENT PASS
                    </p>
                    <p className="text-xs font-semibold text-white">
                      University of Allahabad
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-semibold text-xs">
                    IPS
                  </div>
                </div>

                <div className="py-3.5 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase">
                        Attendee
                      </span>
                      <p className="font-bold text-white truncate">
                        {currentRegistration.studentName}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase">
                        Student ID
                      </span>
                      <p className="font-mono font-bold text-amber-300">
                        {currentRegistration.studentId}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase">
                        Department
                      </span>
                      <p className="font-bold text-white">
                        {currentRegistration.departmentCode}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase">
                        Ticket Code
                      </span>
                      <p className="font-mono font-semibold text-white text-[11px] truncate">
                        {currentRegistration.ticketCode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Simulated QR Code & Barcode */}
                <div className="mt-3 pt-3 border-t border-dashed border-white/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-10 h-10 text-white/90" />
                    <div className="text-[11px] text-slate-300">
                      <p className="font-bold">Fast Gate Verification</p>
                      <p className="text-slate-400">Scan at entrance desk</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadTicket}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs flex items-center gap-1 font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Event added to your student reminders</span>
              </div>
            </div>
          ) : (
            /* Registration Confirmation Checklist */
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                Confirm your student details below to book your seat for this
                seminar/workshop:
              </div>

              {/* Student Details (read-only verification) */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-slate-900">
                    {currentUser?.name || "Aarav Sharma"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Student / Roll ID:</span>
                  <span className="font-mono font-bold text-blue-900">
                    {currentUser?.studentOrEmpId || "IPS2023-BCA-042"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-900">
                    {currentUser?.departmentCode} ({currentUser?.departmentName}
                    )
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Registered Email:</span>
                  <span className="font-medium text-slate-700">
                    {currentUser?.email}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Seats are allocated on first-come-first-serve basis. Only{" "}
                  {event.availableSeats} of {event.totalSeats} seats remaining.
                </span>
              </div>

              <button
                onClick={handleConfirmRegistration}
                className="w-full py-3 px-4 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Confirm & Generate Entry Pass</span>
                <span>✓</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
