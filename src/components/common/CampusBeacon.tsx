import { Radio, X } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthState";

export const CampusBeacon: React.FC = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      {/* Signature Animated Beacon Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white text-[11px] font-semibold border border-indigo-500/30 hover:border-indigo-400 shadow-sm transition-all cursor-pointer select-none group active:scale-95"
        title="CampusOne Live Beacon Status"
      >
        <div className="relative flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 relative" />
        </div>

        <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-indigo-200 bg-clip-text text-transparent font-bold">
          Beacon Live
        </span>

        <span className="hidden md:inline text-slate-400 font-normal">
          • Odd Sem 26-27
        </span>
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700 z-50 animate-fade-in text-left">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                <Radio className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold text-white">
                CampusOne Signal Beacon
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 mt-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80">
              <span className="text-slate-400">Institutional Server:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Operational
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80">
              <span className="text-slate-400">Current Semester:</span>
              <span className="font-bold text-white">
                Semester {currentUser?.semester || 5} (Odd)
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80">
              <span className="text-slate-400">Central Notice Desk:</span>
              <span className="font-bold text-amber-300">Verified</span>
            </div>

            <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-500/20 text-[11px] text-indigo-200">
              University of Allahabad • Institute of Professional Studies
              Central Management Node
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
