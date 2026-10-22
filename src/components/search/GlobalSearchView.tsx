import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  BellRing,
  CalendarDays,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const GlobalSearchView: React.FC = () => {
  const {
    notices,
    events,
    faculty,
    departments,
    exams,
    career,
    setSelectedNotice,
    setSelectedEvent,
    setSelectedDepartment,
    setCurrentTab
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const q = query.trim().toLowerCase();

  // Categorized matching
  const matchingNotices = q
    ? notices.filter(
        n =>
          n.status === 'APPROVED' &&
          (n.title.toLowerCase().includes(q) ||
            n.description.toLowerCase().includes(q) ||
            (n.departmentCode && n.departmentCode.toLowerCase().includes(q)))
      )
    : [];

  const matchingEvents = q
    ? events.filter(
        e =>
          e.status === 'APPROVED' &&
          (e.title.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q) ||
            e.venue.toLowerCase().includes(q) ||
            (e.speaker && e.speaker.toLowerCase().includes(q)))
      )
    : [];

  const matchingFaculty = q
    ? faculty.filter(
        f =>
          f.name.toLowerCase().includes(q) ||
          f.specialization.toLowerCase().includes(q) ||
          f.subjects.some(s => s.toLowerCase().includes(q))
      )
    : [];

  const matchingDepartments = q
    ? departments.filter(
        d =>
          d.code.toLowerCase().includes(q) ||
          d.name.toLowerCase().includes(q) ||
          d.fullName.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      )
    : [];

  const matchingExams = q
    ? exams.filter(
        ex =>
          ex.subjectName.toLowerCase().includes(q) ||
          ex.subjectCode.toLowerCase().includes(q) ||
          ex.course.toLowerCase().includes(q)
      )
    : [];

  const matchingCareer = q
    ? career.filter(
        c =>
          c.company.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.skills.some(s => s.toLowerCase().includes(q))
      )
    : [];

  const totalResults =
    matchingNotices.length +
    matchingEvents.length +
    matchingFaculty.length +
    matchingDepartments.length +
    matchingExams.length +
    matchingCareer.length;

  const quickKeywords = ['AI', 'Exam', 'Placement', 'Food', 'Scholarship', 'CCET', 'Workshop'];

  return (
    <div className="space-y-5 pb-16 md:pb-6 text-left">
      {/* Search Input Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Universal Campus Search
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Search across notices, seminars, faculty profiles, examination datesheets, and career opportunities.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Try searching 'AI', 'Exam', 'Internship', 'Dr. Pradeep', 'Syllabus'..."
            autoFocus
            className="w-full pl-12 pr-4 py-3.5 text-sm sm:text-base bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:bg-white text-slate-900 font-medium transition-all shadow-inner"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-200 px-2 py-1 rounded-md"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pt-1">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Popular:</span>
          </span>
          {quickKeywords.map(kw => (
            <button
              key={kw}
              onClick={() => setQuery(kw)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-slate-600 transition-colors shrink-0 cursor-pointer"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Results view */}
      {query.trim() === '' ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 space-y-2">
          <Search className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <h3 className="font-bold text-slate-700 text-sm">Start typing to search the campus repository</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Everything across all 5 centers of IPS University of Allahabad is indexed and searchable in real time.
          </p>
        </div>
      ) : totalResults === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 space-y-2">
          <Search className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <h3 className="font-bold text-slate-700 text-sm">No campus results found for "{query}"</h3>
          <p className="text-xs text-slate-500">
            Try checking for typos or searching a broader term like "Exam" or "Workshop".
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1 text-xs text-slate-500">
            <p>
              Found <strong className="text-slate-900">{totalResults}</strong> results matching "
              <span className="text-blue-900 font-bold">{query}</span>"
            </p>
          </div>

          {/* Results Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeCategory === 'ALL'
                  ? 'text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
              style={activeCategory === 'ALL' ? { backgroundColor: '#0a1628' } : {}}
            >
              All ({totalResults})
            </button>

            {matchingNotices.length > 0 && (
              <button
                onClick={() => setActiveCategory('NOTICES')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === 'NOTICES'
                    ? 'text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
                style={activeCategory === 'NOTICES' ? { backgroundColor: '#0a1628' } : {}}
              >
                Notices ({matchingNotices.length})
              </button>
            )}

            {matchingEvents.length > 0 && (
              <button
                onClick={() => setActiveCategory('EVENTS')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === 'EVENTS'
                    ? 'text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
                style={activeCategory === 'EVENTS' ? { backgroundColor: '#0a1628' } : {}}
              >
                Events ({matchingEvents.length})
              </button>
            )}

            {matchingFaculty.length > 0 && (
              <button
                onClick={() => setActiveCategory('FACULTY')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === 'FACULTY'
                    ? 'text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
                style={activeCategory === 'FACULTY' ? { backgroundColor: '#0a1628' } : {}}
              >
                Faculty ({matchingFaculty.length})
              </button>
            )}

            {matchingCareer.length > 0 && (
              <button
                onClick={() => setActiveCategory('CAREER')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === 'CAREER'
                    ? 'text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600'
                }`}
                style={activeCategory === 'CAREER' ? { backgroundColor: '#0a1628' } : {}}
              >
                Careers ({matchingCareer.length})
              </button>
            )}
          </div>

          {/* Results Sections */}
          <div className="space-y-4">
            {/* Notices Results */}
            {(activeCategory === 'ALL' || activeCategory === 'NOTICES') && matchingNotices.length > 0 && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <BellRing className="w-4 h-4 text-blue-900" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Notices & Circulars ({matchingNotices.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {matchingNotices.map(notice => (
                    <div
                      key={notice.id}
                      onClick={() => setSelectedNotice(notice)}
                      className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-900 mr-2">
                          {notice.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 inline">{notice.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{notice.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events Results */}
            {(activeCategory === 'ALL' || activeCategory === 'EVENTS') && matchingEvents.length > 0 && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <CalendarDays className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Events & Seminars ({matchingEvents.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {matchingEvents.map(event => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-900 mr-2">
                          {event.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 inline">{event.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {event.date} • {event.venue} {event.speaker ? `• Speaker: ${event.speaker}` : ''}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-blue-900 shrink-0 ml-2">Register →</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Faculty Results */}
            {(activeCategory === 'ALL' || activeCategory === 'FACULTY') && matchingFaculty.length > 0 && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Users className="w-4 h-4 text-purple-700" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Faculty Profiles ({matchingFaculty.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {matchingFaculty.map(f => (
                    <div
                      key={f.id}
                      onClick={() => setCurrentTab('faculty')}
                      className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-3"
                    >
                      <img src={f.avatar} alt={f.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{f.name}</h4>
                        <p className="text-[11px] text-blue-900 font-semibold">{f.designation} ({f.departmentCode})</p>
                        <p className="text-[11px] text-slate-500 truncate">{f.specialization}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Career Results */}
            {(activeCategory === 'ALL' || activeCategory === 'CAREER') && matchingCareer.length > 0 && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Briefcase className="w-4 h-4 text-emerald-700" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Placement & Internships ({matchingCareer.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {matchingCareer.map(car => (
                    <div
                      key={car.id}
                      onClick={() => setCurrentTab('career')}
                      className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {car.company} - {car.role}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {car.stipendOrSalary} • {car.location} • Closes: {car.applicationDeadline}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 shrink-0 ml-2">Apply →</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exams Results */}
            {matchingExams.length > 0 && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <GraduationCap className="w-4 h-4 text-rose-700" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Examination Timetables ({matchingExams.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {matchingExams.map(ex => (
                    <div
                      key={ex.id}
                      onClick={() => setCurrentTab('exams')}
                      className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 mr-2">
                          {ex.subjectCode}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 inline">{ex.subjectName}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {ex.date} • {ex.shift} • Room: {ex.room}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-blue-900 shrink-0 ml-2">Timetable →</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
