import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Clock,
  User,
  Phone,
  Search,
  CheckCircle2
} from 'lucide-react';

export const CampusGuideView: React.FC = () => {
  const { facilities } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'ALL', label: 'All Facilities' },
    { id: 'Library', label: '📖 Central Library' },
    { id: 'Laboratory', label: '🔬 High-Tech Labs' },
    { id: 'Administrative', label: '🏛️ Admin Directorate' },
    { id: 'Amenity', label: '☕ Canteen & Studios' },
    { id: 'Academic', label: '🎭 Auditoriums' }
  ];

  const filteredFacilities = facilities.filter(fac => {
    if (selectedCategory !== 'ALL' && fac.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        fac.name.toLowerCase().includes(q) ||
        fac.location.toLowerCase().includes(q) ||
        fac.description.toLowerCase().includes(q) ||
        fac.features.some(f => f.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-5 pb-16 md:pb-6 text-left">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-2 rounded-xl bg-amber-50 text-amber-900">
            <MapPin className="w-5 h-5 text-amber-600" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Campus Facilities & Infrastructure
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Interactive directory of libraries, computing facilities, specialized food tech pilot plants, studios, and student amenities.
            </p>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search library, computer lab, food tech plant, cafeteria, studios..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white text-slate-900 transition-all"
            />
          </div>

          <div className="sm:col-span-4 flex gap-1.5 overflow-x-auto hide-scrollbar">
            {categories.slice(0, 3).map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
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

      {/* Facilities Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredFacilities.map(facility => (
          <div
            key={facility.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 w-full bg-slate-900">
                <img
                  src={facility.imageUrl}
                  alt={facility.name}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-white/95 text-blue-950 font-bold text-xs uppercase shadow-xs">
                    {facility.category}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-base font-bold leading-tight">
                    {facility.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {facility.description}
                </p>

                {/* Features chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {facility.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200/70"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Logistics Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{facility.location}</span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{facility.timings}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>{facility.incharge}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{facility.contact}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
