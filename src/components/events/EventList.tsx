import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { EventCard } from './EventCard';
import { EventDetailModal } from './EventDetailModal';
import { EventRegisterModal } from './EventRegisterModal';
import { EmptyState } from '../common/EmptyState';
import {
  CalendarDays,
  Search,
  PlusCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { CampusEvent, EventCategory } from '../../types';

export const EventList: React.FC = () => {
  const {
    events,
    selectedEvent,
    setSelectedEvent,
    setIsCreateEventOpen,
    departments
  } = useApp();
  const { currentUser, role } = useAuth();

  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [registeringEvent, setRegisteringEvent] = useState<CampusEvent | null>(null);

  const categories: Array<{ id: string; label: string }> = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'Seminar', label: '🎤 Seminars' },
    { id: 'Workshop', label: '🛠️ Workshops' },
    { id: 'Technical', label: '💻 Technical & Hackathons' },
    { id: 'Conference', label: '🏛️ Conferences' },
    { id: 'Cultural', label: '🎭 Cultural & Theatre' }
  ];

  const todayStr = '2026-09-09'; // Anchored to current academic session date

  const filteredEvents = useMemo(() => {
    return events
      .filter(event => {
        // Only approved events appear in student calendar
        if (event.status !== 'APPROVED') return false;

        // Upcoming vs Past filter
        const isUpcoming = event.date >= todayStr;
        if (activeTab === 'UPCOMING' && !isUpcoming) return false;
        if (activeTab === 'PAST' && isUpcoming) return false;

        // Category filter
        if (selectedCategory !== 'ALL' && event.category !== selectedCategory as EventCategory) {
          return false;
        }

        // Department filter
        if (selectedDept !== 'ALL') {
          if (event.scope !== 'COLLEGE' && event.departmentCode !== selectedDept) {
            return false;
          }
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            event.title.toLowerCase().includes(q) ||
            event.description.toLowerCase().includes(q) ||
            event.venue.toLowerCase().includes(q) ||
            (event.speaker && event.speaker.toLowerCase().includes(q))
          );
        }

        return true;
      })
      .sort((a, b) => {
        if (activeTab === 'UPCOMING') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [events, activeTab, selectedCategory, selectedDept, searchQuery]);

  return (
    <div className="space-y-5 pb-16 md:pb-6 text-left">
      {/* Header section */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-amber-50 text-amber-900">
                <CalendarDays className="w-5 h-5 text-amber-600" />
              </span>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                Campus Events & Seminars
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Discover academic workshops, guest lectures, hackathons, and cultural symposia across IPS centers.
            </p>
          </div>

          {(role === 'COLLEGE_ADMIN' || role === 'DEPARTMENT_ADMIN' || role === 'FACULTY') && (
            <button
              onClick={() => setIsCreateEventOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>
                {role === 'FACULTY' ? 'Propose New Event' : 'Create Official Event'}
              </span>
            </button>
          )}
        </div>

        {/* Upcoming vs Past Tabs */}
        <div className="mt-5 flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('UPCOMING')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'UPCOMING'
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Upcoming Events</span>
            </button>

            <button
              onClick={() => setActiveTab('PAST')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'PAST'
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Past Archive</span>
            </button>
          </div>

          <div className="text-xs text-slate-500">
            Student: <span className="font-semibold text-blue-900">{currentUser?.name}</span> ({currentUser?.departmentCode})
          </div>
        </div>

        {/* Search bar & Department filter */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search seminars, speakers, hackathons, venues..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:bg-white text-slate-900 transition-all"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-900/20 cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.code}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events count */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500">
        <p>
          Found <span className="font-bold text-slate-900">{filteredEvents.length}</span> {activeTab.toLowerCase()} sessions
        </p>
        <span className="text-[11px] text-slate-400">Instant 1-Click Digital Pass Available</span>
      </div>

      {/* Grid of events */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          title="No events match your criteria"
          description="Check back later or try adjusting your search keywords and department filters."
          actionText="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('ALL');
            setSelectedDept('ALL');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => setSelectedEvent(event)}
              onRegisterClick={e => {
                e.stopPropagation();
                setRegisteringEvent(event);
              }}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onOpenRegister={() => {
          if (selectedEvent) setRegisteringEvent(selectedEvent);
        }}
      />

      {/* Register / Ticket Pass Modal */}
      <EventRegisterModal
        event={registeringEvent}
        onClose={() => setRegisteringEvent(null)}
      />
    </div>
  );
};
