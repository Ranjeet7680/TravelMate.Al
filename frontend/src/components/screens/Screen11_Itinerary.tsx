import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { formatCurrency } from '../../data/travelData';
import { InteractiveTripMap } from '../InteractiveTripMap';
import { 
  ArrowLeft, 
  Share2, 
  Edit3, 
  Check, 
  Sun, 
  Clock, 
  MapPin, 
  ChevronDown, 
  ChevronRight, 
  Ticket, 
  Plane, 
  Building2, 
  Coins, 
  ShieldCheck, 
  MoreHorizontal,
  Map as MapIcon,
  Calendar
} from 'lucide-react';

export const Screen11_Itinerary: React.FC = () => {
  const { activeTrip, currency, setCurrentScreen, setBookingModalOpen } = useTravel();

  const [activeTab, setActiveTab] = useState<'itinerary' | 'flights' | 'hotels' | 'budget' | 'visa'>('itinerary');
  const [viewMode, setViewMode] = useState<'timeline' | 'map'>('timeline');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(3); // Day 3 active as shown in mockup!
  const [accordionOpen, setAccordionOpen] = useState(false);

  const selectedDay = activeTrip.days.find(d => d.dayNumber === selectedDayNumber) || activeTrip.days[2];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert('Itinerary link copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 select-none animate-page-enter">
      {/* Top Header matching mockup bottom-right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('05-dashboard')}
            className="p-2 rounded-xl theme-card hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-midnight-navy dark:text-white">
              Dubai Trip – 10 Days
            </h1>
            <p className="text-xs text-slate-400">15 Nov – 24 Nov • 1 Traveller</p>
          </div>
        </div>

        {/* Action buttons matching mockup: Edit, Share, Book Now */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Itinerary is in live editing mode. Click on any activity to modify time or notes.')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-midnight-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-midnight-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            onClick={() => setBookingModalOpen(true)}
            className="btn-primary-gradient px-5 py-2 rounded-xl font-bold text-xs shadow-lg shadow-purple-500/25 flex items-center gap-1.5"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Now</span>
          </button>
        </div>
      </div>

      {/* Tabs matching mockup bottom-right */}
      <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto pb-1">
        {[
          { id: 'itinerary', label: 'Itinerary', icon: null },
          { id: 'flights', label: 'Flights', icon: <Plane className="w-3.5 h-3.5" /> },
          { id: 'hotels', label: 'Hotels', icon: <Building2 className="w-3.5 h-3.5" /> },
          { id: 'budget', label: 'Budget', icon: <Coins className="w-3.5 h-3.5" /> },
          { id: 'visa', label: 'Visa', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'flights') setCurrentScreen('08-flights');
                else if (tab.id === 'hotels') setCurrentScreen('09-hotels');
                else if (tab.id === 'budget') setCurrentScreen('12-budget');
                else if (tab.id === 'visa') setCurrentScreen('13-visa');
                else setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-1.5 pb-2.5 transition relative shrink-0 ${
                isActive
                  ? 'text-ai-purple font-extrabold border-b-2 border-ai-purple'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setCurrentScreen('10-destinations')}
          className="text-slate-400 hover:text-slate-600 flex items-center gap-1 pb-2.5 text-xs font-semibold"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
          <span>More</span>
        </button>
      </div>

      {/* Sub-bar: Timeline vs Interactive Map Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'timeline'
                ? 'bg-white dark:bg-slate-900 text-ai-purple shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Day-by-Day Schedule</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'map'
                ? 'bg-white dark:bg-slate-900 text-ai-purple shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Interactive Waypoint Map</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span>AI-Optimized Route</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {viewMode === 'map' ? (
        <InteractiveTripMap />
      ) : (
        /* 3-Column Content Layout matching mockup bottom-right */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Day Selector Vertical List */}
        <div className="lg:col-span-3 space-y-2">
          {activeTrip.days.slice(0, 5).map(day => {
            const isSelected = selectedDayNumber === day.dayNumber;
            return (
              <div
                key={day.dayNumber}
                onClick={() => setSelectedDayNumber(day.dayNumber)}
                className={`p-3.5 rounded-2xl cursor-pointer transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-2 border-ai-purple bg-purple-500/10 text-ai-purple shadow-sm'
                    : 'theme-card hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Day {day.dayNumber}
                </div>
                <div className={`text-xs font-bold mt-0.5 ${isSelected ? 'text-ai-purple' : 'text-midnight-navy dark:text-white'}`}>
                  {day.theme}
                </div>
              </div>
            );
          })}

          {/* Accordion for Days 6 - 10 matching mockup */}
          <div className="theme-card rounded-2xl overflow-hidden">
            <button
              onClick={() => setAccordionOpen(!accordionOpen)}
              className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-midnight-navy dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase">Day 6 – 10</div>
                <div className="text-xs">More Experiences</div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${accordionOpen ? 'rotate-180' : ''}`} />
            </button>

            {accordionOpen && (
              <div className="p-2 pt-0 space-y-1.5 border-t border-slate-100 dark:border-slate-800">
                {activeTrip.days.slice(5).map(day => (
                  <div
                    key={day.dayNumber}
                    onClick={() => setSelectedDayNumber(day.dayNumber)}
                    className={`p-2.5 rounded-xl cursor-pointer text-xs font-semibold ${
                      selectedDayNumber === day.dayNumber
                        ? 'bg-purple-500/10 text-ai-purple font-bold'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Day {day.dayNumber}: {day.theme}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Column: Day 3 Details matching mockup bottom-right */}
        <div className="lg:col-span-6 space-y-4">
          <div className="theme-card p-5 sm:p-6 rounded-3xl space-y-5">
            {/* Title & Date */}
            <div>
              <h2 className="text-lg sm:text-xl font-black text-midnight-navy dark:text-white">
                Day {selectedDay.dayNumber}: {selectedDay.theme}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {selectedDay.dateStr} • {selectedDay.summary}
              </p>
            </div>

            {/* Large Panoramic Burj Khalifa Photo matching mockup */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] shadow-md">
              <img
                src={selectedDay.heroImage || 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1200&q=80'}
                alt={selectedDay.theme}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[11px] font-bold bg-midnight-navy/80 backdrop-blur-md px-2.5 py-1 rounded-full">
                  Downtown Dubai Landmark Tour
                </span>
              </div>
            </div>

            {/* Activities Timeline matching mockup bottom-right */}
            <div className="space-y-4 pt-2">
              {selectedDay.activities.map(act => (
                <div key={act.id} className="flex items-start gap-4 text-xs group">
                  {/* Time bullet */}
                  <div className="flex items-center gap-2 w-20 shrink-0 text-slate-500 dark:text-slate-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-ai-purple group-hover:scale-125 transition" />
                    <span>{act.time}</span>
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 space-y-1">
                    <div className="font-bold text-midnight-navy dark:text-white text-xs sm:text-sm">
                      {act.title}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {act.description}
                    </p>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>{act.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Trip Summary & Weather Widget matching mockup bottom-right */}
        <div className="lg:col-span-3 space-y-4">
          {/* Trip Summary Card matching mockup */}
          <div className="theme-card p-5 rounded-3xl space-y-4">
            <div>
              <h3 className="text-sm font-black text-midnight-navy dark:text-white">Trip Summary</h3>
              <p className="text-xs text-slate-400">Dubai, UAE • 10 Days</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-sky-500" />
                  <span>Flights</span>
                </span>
                <span className="font-bold text-midnight-navy dark:text-white">₹32,500</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-teal-500" />
                  <span>Hotels (9 nights)</span>
                </span>
                <span className="font-bold text-midnight-navy dark:text-white">₹40,500</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-ai-purple" />
                  <span>Activities</span>
                </span>
                <span className="font-bold text-midnight-navy dark:text-white">₹18,000</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>Local Transport</span>
                </span>
                <span className="font-bold text-midnight-navy dark:text-white">₹6,000</span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
                <span className="font-extrabold text-midnight-navy dark:text-white">Total (Est.)</span>
                <span className="font-black text-base text-ai-purple">₹97,000</span>
              </div>
            </div>

            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full btn-primary-gradient py-3 rounded-2xl font-bold text-xs shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Complete Trip</span>
            </button>
          </div>

          {/* Dubai Weather Widget matching mockup */}
          <div className="theme-card p-4 rounded-3xl flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-midnight-navy dark:text-white">Dubai Weather</div>
              <div className="text-[10px] text-slate-400">15 – 24 Nov</div>
              <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-1">
                Mostly Sunny
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sun className="w-8 h-8 text-amber-500" />
              <span className="text-2xl font-black text-midnight-navy dark:text-white">28°C</span>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
