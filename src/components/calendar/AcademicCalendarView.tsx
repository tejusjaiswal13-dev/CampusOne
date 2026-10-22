import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  List,
  Grid,
  Clock,
  AlertCircle,
  Tag
} from 'lucide-react';
import { AcademicCalendarItem } from '../../types';

export const AcademicCalendarView: React.FC = () => {
  const { calendar } = useApp();
  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK' | 'LIST'>('MONTH');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Month navigation (Defaults to September 2026 for academic session)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(8); // 8 = September (0-indexed)
  const [selectedDay, setSelectedDay] = useState<number | null>(21); // Default to internal exam day

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const categories = [
    { id: 'ALL', label: 'All Dates' },
    { id: 'Examination', label: '📝 Examination', color: 'bg-red-500' },
    { id: 'Semester', label: '🎓 Semester Milestones', color: 'bg-blue-500' },
    { id: 'Holiday', label: '🎉 Holidays', color: 'bg-emerald-500' },
    { id: 'Deadline', label: '⚠️ Deadlines', color: 'bg-amber-500' },
    { id: 'Workshop', label: '💡 Workshop / Events', color: 'bg-purple-500' }
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
    setSelectedDay(null);
  };

  const filteredItems = useMemo(() => {
    return calendar.filter(item => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      return true;
    });
  }, [calendar, selectedCategory]);

  // Calendar matrix calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayWeekday = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  const getDayEvents = (day: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const targetDate = `${currentYear}-${monthStr}-${dayStr}`;

    return filteredItems.filter(item => {
      if (item.startDate === targetDate) return true;
      if (item.endDate && targetDate >= item.startDate && targetDate <= item.endDate) {
        return true;
      }
      return false;
    });
  };

  const selectedDayEvents = selectedDay ? getDayEvents(selectedDay) : [];

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Examination':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Semester':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Holiday':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Deadline':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="space-y-5 pb-16 md:pb-6 text-left">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-900">
                <CalendarIcon className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                Academic Calendar & Key Dates
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Session 2026-27 • Approved by the Directorate, Institute of Professional Studies, UoA.
            </p>
          </div>

          {/* View mode switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('MONTH')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'MONTH' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Month</span>
            </button>
            <button
              onClick={() => setViewMode('WEEK')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'WEEK' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Week</span>
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'LIST' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-900 text-white font-bold'
                  : 'text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewMode === 'MONTH' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Month Calendar Matrix */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
            {/* Month Nav Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => {
                    setCurrentMonth(8);
                    setCurrentYear(2026);
                    setSelectedDay(21);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50"
                >
                  Current
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-slate-400 uppercase py-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {Array.from({ length: firstDayWeekday }).map((_, i) => (
                <div key={`empty-${i}`} className="h-14 sm:h-20 rounded-xl bg-slate-50/50" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const events = getDayEvents(day);
                const isSelected = selectedDay === day;

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(day)}
                    className={`h-14 sm:h-20 p-1 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-900 bg-blue-50/70 ring-2 ring-blue-900/20'
                        : events.length > 0
                        ? 'border-slate-200 bg-white hover:border-slate-300'
                        : 'border-slate-100 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`text-xs font-bold leading-none ${
                        isSelected
                          ? 'text-blue-900 font-extrabold'
                          : events.length > 0
                          ? 'text-slate-900'
                          : 'text-slate-500'
                      }`}
                    >
                      {day}
                    </span>

                    {/* Event indicators */}
                    <div className="space-y-0.5 mt-1 overflow-hidden">
                      {events.slice(0, 2).map((ev, idx) => (
                        <div
                          key={idx}
                          className={`text-[11px] sm:text-[11px] truncate px-1 py-0.2 rounded font-medium ${
                            ev.category === 'Examination'
                              ? 'bg-red-100 text-red-800'
                              : ev.category === 'Holiday'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <div className="text-[11px] text-slate-400 font-bold">
                          +{events.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day Inspector Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                {selectedDay
                  ? `${monthNames[currentMonth]} ${selectedDay}, ${currentYear}`
                  : 'Select a Date'}
              </h3>
              <span className="text-xs text-slate-400">
                {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'event' : 'events'}
              </span>
            </div>

            <div className="py-4 space-y-3 flex-1 overflow-y-auto">
              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-600">No scheduled events</p>
                  <p>Regular academic classes & laboratory work.</p>
                </div>
              ) : (
                selectedDayEvents.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md border uppercase ${getCategoryBadgeClass(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {item.scope === 'COLLEGE' ? 'College' : `${item.departmentCode} Dept`}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                    {item.endDate && (
                      <p className="text-[11px] text-slate-400 font-mono pt-1">
                        Duration: {item.startDate} to {item.endDate}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {viewMode === 'WEEK' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Exam & Sessional Week (Sep 21 - Sep 26, 2026)
            </h2>
            <span className="text-xs text-blue-900 font-bold bg-blue-50 px-2.5 py-1 rounded-lg">
              First Sessional Cycle
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {[
              { day: 'Mon', date: 'Sep 21', events: getDayEvents(21) },
              { day: 'Tue', date: 'Sep 22', events: getDayEvents(22) },
              { day: 'Wed', date: 'Sep 23', events: getDayEvents(23) },
              { day: 'Thu', date: 'Sep 24', events: getDayEvents(24) },
              { day: 'Fri', date: 'Sep 25', events: getDayEvents(25) },
              { day: 'Sat', date: 'Sep 26', events: getDayEvents(26) }
            ].map((col, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 min-h-[160px]">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                  <span className="font-extrabold text-xs text-slate-900">{col.day}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{col.date}</span>
                </div>
                <div className="space-y-1.5">
                  {col.events.map((ev, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs text-left"
                    >
                      <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${getCategoryBadgeClass(ev.category)}`}>
                        {ev.category}
                      </span>
                      <p className="text-[11px] font-bold text-slate-800 mt-1 line-clamp-2">
                        {ev.title}
                      </p>
                    </div>
                  ))}
                  {col.events.length === 0 && (
                    <span className="text-[11px] text-slate-400 italic block py-4 text-center">
                      Classes / Labs
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'LIST' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Chronological Academic Milestones (2026-27)
          </h2>

          <div className="divide-y divide-slate-100">
            {filteredItems.map(item => (
              <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border uppercase ${getCategoryBadgeClass(item.category)}`}>
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.startDate} {item.endDate ? `to ${item.endDate}` : ''}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 max-w-xl">{item.description}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg">
                    {item.scope === 'COLLEGE' ? 'Campus-Wide' : `${item.departmentCode} Center`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
