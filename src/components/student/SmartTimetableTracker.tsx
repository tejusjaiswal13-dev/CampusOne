import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  calculateCurrentAndNextClass,
  ClassScheduleItem,
  DaySchedule
} from '../../data/timetableData';
import {
  Clock,
  MapPin,
  User,
  BookOpen,
  Calendar,
  CheckCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight
} from 'lucide-react';

export const SmartTimetableTracker: React.FC = () => {
  const { currentUser } = useAuth();
  const deptCode = currentUser?.departmentCode || 'CCET';

  const [trackerData, setTrackerData] = useState(() => calculateCurrentAndNextClass(deptCode));
  const [selectedDay, setSelectedDay] = useState<DaySchedule['day']>(trackerData.targetDay as DaySchedule['day']);
  const [isExpanded, setIsExpanded] = useState(false);

  // Update tracker every minute
  useEffect(() => {
    const update = () => {
      const data = calculateCurrentAndNextClass(deptCode);
      setTrackerData(data);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [deptCode]);

  const { currentClass, nextClass, remainingMinutes, progressPercent, weekSchedule } = trackerData;

  const activeDaySchedule = weekSchedule.find(s => s.day === selectedDay) || weekSchedule[0];
  const dayClasses = activeDaySchedule?.classes || [];

  const days: DaySchedule['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-left transition-all">
      {/* Header bar */}
      <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center border shadow-xs"
            style={{ backgroundColor: '#eef2f8', borderColor: '#d6dff0', color: '#0a1628' }}
          >
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Your class schedule
              </h2>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {deptCode}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Sample weekly timetable · {deptCode}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer active:scale-95"
        >
          <span>{isExpanded ? 'Hide Details' : 'Full Timetable'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Hero Live Status Card */}
      <div className="p-4 sm:p-5">
        {currentClass ? (
          /* Case 1: Class is running right now */
          <div
            className="text-white rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden"
            style={{ backgroundColor: '#0a1628', border: '1px solid #1e3a5f' }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-400/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                  Class In Session Now
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 text-indigo-200">
                {currentClass.timeDisplay}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-white leading-snug">
              {currentClass.subjectName}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs text-indigo-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{currentClass.room}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                <span>{currentClass.facultyName}</span>
              </div>
            </div>

            {/* Time progress bar */}
            <div className="mt-3.5 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-[11px] text-indigo-200 mb-1">
                <span>Time remaining: <strong className="text-white">{remainingMinutes} mins</strong></span>
                <span>{progressPercent}% elapsed</span>
              </div>
              <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {nextClass && (
              <div className="mt-3 pt-2 text-[11px] text-indigo-200 flex items-center justify-between">
                <span>Up next: <strong className="text-white">{nextClass.subjectName}</strong></span>
                <span className="text-amber-300 font-bold">{nextClass.startTime}</span>
              </div>
            )}
          </div>
        ) : nextClass ? (
          /* Case 2: Class upcoming next */
          <div
            className="text-white rounded-2xl p-4 sm:p-5 shadow-sm"
            style={{ backgroundColor: '#0a1628', border: '1px solid #1e3a5f' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#f59e0b', color: '#0a1628' }}
              >
                {trackerData.nextClassDayOffset === 0 ? 'Up next today' : 'Next scheduled class'}
              </span>
              <span className="text-xs font-mono font-bold" style={{ color: '#f59e0b' }}>
                {trackerData.nextClassDayOffset === 0 ? `Starts in ${remainingMinutes} mins` : nextClass.day} · {nextClass.startTime}
              </span>
            </div>

            <h3 className="text-base font-bold text-white leading-snug">
              {nextClass.subjectName}
            </h3>

            <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
                <span>{nextClass.room}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{nextClass.facultyName}</span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/10 text-slate-200 border border-white/20">
                {nextClass.type}
              </span>
            </div>
          </div>
        ) : (
          /* Case 3: Day is completed or weekend */
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-1.5">
            <span className="inline-block p-2 rounded-full bg-emerald-100 text-emerald-800 mb-1">
              <CheckCircle className="w-5 h-5" />
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              All Lectures Concluded For Today
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You are all caught up! Use the day tabs below to preview upcoming schedules or prepare for labs.
            </p>
          </div>
        )}

        {/* Expandable Weekly Timetable Drawer */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 animate-fade-in">
            {/* Day selector pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {days.map(d => {
                const isSelected = selectedDay === d;
                const isToday = trackerData.targetDay === d;
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    style={isSelected ? { backgroundColor: '#0a1628' } : {}}
                  >
                    <span>{d.slice(0, 3)}</span>
                    {isToday && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: isSelected ? '#f59e0b' : '#0a1628' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* List of classes for the selected day */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs px-1 text-slate-500 font-medium">
                <span>{selectedDay} Schedule ({dayClasses.length} sessions)</span>
                <span className="text-[11px] font-mono text-slate-400">Classroom Block</span>
              </div>

              {dayClasses.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No classes scheduled for {selectedDay}.
                </p>
              ) : (
                dayClasses.map((cls, idx) => (
                  <div
                    key={cls.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-white text-indigo-900 border border-slate-200">
                          {cls.subjectCode}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                            cls.type === 'Practical Lab'
                              ? 'bg-amber-100 text-amber-800'
                              : cls.type === 'Seminar'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {cls.type}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {cls.subjectName}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{cls.facultyName}</span>
                        <span>•</span>
                        <span className="text-slate-600 font-medium">{cls.room}</span>
                      </p>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
                      <span className="text-xs font-mono font-bold text-slate-800">
                        {cls.timeDisplay}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {cls.building}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
