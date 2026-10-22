import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  calculateCurrentAndNextClass, 
  DaySchedule, 
  ClassScheduleItem 
} from '../../data/timetableData';
import { 
  Calendar, Clock, MapPin, User, BookOpen, AlertCircle, 
  Download, Sparkles, CheckCircle2, ChevronRight, BellRing
} from 'lucide-react';

export const StudentTimetableView: React.FC = () => {
  const { currentUser } = useAuth();
  const { getStudentClassAlerts, showToast } = useApp();
  const deptCode = currentUser?.departmentCode || 'CCET';

  const [trackerData, setTrackerData] = useState(() => calculateCurrentAndNextClass(deptCode));
  const [selectedDay, setSelectedDay] = useState<DaySchedule['day']>(
    (trackerData.targetDay as DaySchedule['day']) || 'Monday'
  );

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
  const days: DaySchedule['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const activeDaySchedule = weekSchedule.find(s => s.day === selectedDay) || weekSchedule[0];
  const dayClasses = activeDaySchedule?.classes || [];

  const classAlerts = getStudentClassAlerts();
  const roomChangesOrCancellations = classAlerts.filter(
    a => a.noticeType === 'ROOM_CHANGED' || a.noticeType === 'CLASS_CANCELLED'
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider mb-1" style={{ color: '#0a1628' }}>
            <Calendar className="w-4 h-4" />
            <span>Academic Routine • {currentUser?.departmentCode || 'CCET'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            {currentUser?.course || 'BCA'} Semester {currentUser?.semester || 5} Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time daily lectures, labs, room venues, and direct faculty notices.
          </p>
        </div>

        <button
          onClick={() => showToast('Semester routine PDF downloaded successfully', 'success')}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Routine PDF</span>
        </button>
      </div>

      {/* Professor Notices / Room relocations Banner */}
      {roomChangesOrCancellations.length > 0 && (
        <div className="space-y-2">
          {roomChangesOrCancellations.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-2xl border flex items-start gap-3.5 shadow-xs"
              style={{
                backgroundColor: alert.noticeType === 'CLASS_CANCELLED' ? '#fff2f0' : '#fffbeb',
                borderColor: alert.noticeType === 'CLASS_CANCELLED' ? '#ffc2b9' : '#fde68a',
                color: alert.noticeType === 'CLASS_CANCELLED' ? '#c43030' : '#92400e'
              }}
            >
              <div
                className="p-2 rounded-xl mt-0.5 text-white"
                style={{
                  backgroundColor: alert.noticeType === 'CLASS_CANCELLED' ? '#ff6b6b' : '#f59e0b'
                }}
              >
                <BellRing className="w-4 h-4 animate-bounce" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                    style={{
                      backgroundColor: alert.noticeType === 'CLASS_CANCELLED' ? '#ff6b6b' : '#f59e0b'
                    }}
                  >
                    Direct Faculty Update • {alert.noticeType.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    From {alert.facultyName}
                  </span>
                </div>
                <h4 className="font-bold text-sm mt-1">{alert.title}</h4>
                <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Class Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Class */}
        <div
          className="p-4 sm:p-5 rounded-2xl border shadow-xs transition-all"
          style={{
            backgroundColor: currentClass ? '#eef2f8' : '#ffffff',
            borderColor: currentClass ? '#adbde0' : '#e2e8f0'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: '#0a1628' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Right Now
            </span>
            {remainingMinutes !== null && remainingMinutes > 0 && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#d6dff0', color: '#0a1628' }}
              >
                {remainingMinutes} min left
              </span>
            )}
          </div>

          {currentClass ? (
            <div>
              <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                {currentClass.subjectName}
              </h3>
              <div className="mt-2.5 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-semibold text-slate-900">{currentClass.timeDisplay}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-medium text-slate-800">{currentClass.room}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentClass.facultyName}</span>
                </div>
              </div>

              {progressPercent !== undefined && (
                <div className="mt-3.5">
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-4 text-center">
              <Sparkles className="w-7 h-7 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-slate-700">No active lecture at this moment</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Use free hours for revision or lab practicals.</p>
            </div>
          )}
        </div>

        {/* Up Next */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Upcoming Next
            </span>
          </div>

          {nextClass ? (
            <div>
              <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                {nextClass.subjectName}
              </h3>
              <div className="mt-2.5 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-semibold text-slate-900">{nextClass.timeDisplay}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-medium text-slate-800">{nextClass.room}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>{nextClass.facultyName}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-slate-700">All lectures done for today</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Check library or assignment submissions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Week Day Selector Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {days.map((day) => {
            const isSelected = selectedDay === day;
            const isToday = trackerData.targetDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                style={isSelected ? { backgroundColor: '#0a1628' } : {}}
              >
                <span>{day}</span>
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
      </div>

      {/* Day's Lecture Schedule Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <span>{selectedDay}&apos;s Lectures</span>
            <span className="text-xs font-normal text-slate-500">
              ({dayClasses.length} {dayClasses.length === 1 ? 'Period' : 'Periods'})
            </span>
          </h2>
          <span className="text-xs font-semibold" style={{ color: '#0a1628' }}>
            {currentUser?.departmentCode} • Sem {currentUser?.semester || 5}
          </span>
        </div>

        {dayClasses.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No scheduled lectures on {selectedDay}</p>
            <p className="text-xs text-slate-400 mt-1">Weekend or designated self-study day.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 mt-2">
            {dayClasses.map((item: ClassScheduleItem, idx) => {
              const isLab = item.type === 'Practical Lab' || item.subjectName.toLowerCase().includes('lab');
              return (
                <div
                  key={idx}
                  className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-16 text-center shrink-0">
                      <span className="text-[11px] font-bold text-slate-900 block leading-tight">
                        {item.timeDisplay.split(' - ')[0]}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {item.timeDisplay.split(' - ')[1]}
                      </span>
                    </div>

                    <div className="w-px h-10 bg-slate-200 self-center hidden sm:block" />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{item.subjectName}</span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isLab
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {item.facultyName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto pl-20 sm:pl-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                      <MapPin className="w-3 h-3 text-indigo-600" />
                      {item.room}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
