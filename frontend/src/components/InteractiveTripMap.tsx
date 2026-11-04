import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Car, 
  Train, 
  Clock, 
  Info, 
  Maximize2, 
  Compass, 
  Layers, 
  CheckCircle2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface Waypoint {
  id: string;
  name: string;
  category: string;
  day: number;
  time: string;
  x: number; // percentage in SVG coordinate space (0-100)
  y: number; // percentage in SVG coordinate space (0-100)
  description: string;
  distanceFromPrev: string;
  transitTime: string;
  transitMode: 'metro' | 'taxi' | 'bus';
  imageUrl: string;
}

const WAYPOINTS: Waypoint[] = [
  {
    id: 'wp-1',
    name: 'Dubai Int. Airport (DXB)',
    category: 'Airport Arrival',
    day: 1,
    time: '13:30',
    x: 75,
    y: 22,
    description: 'Terminal 3 arrival via Emirates EK 571. Metro Red Line Terminal Station.',
    distanceFromPrev: '0 km',
    transitTime: '0 mins',
    transitMode: 'metro',
    imageUrl: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wp-2',
    name: 'Rove Downtown Dubai',
    category: 'Hotel Check-in',
    day: 1,
    time: '15:00',
    x: 58,
    y: 42,
    description: 'Hotel basecamp across from Dubai Mall. Pool deck with Burj Khalifa vistas.',
    distanceFromPrev: '14.2 km',
    transitTime: '18 mins',
    transitMode: 'taxi',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wp-3',
    name: 'Burj Khalifa & Dubai Mall',
    category: 'Landmark & Shopping',
    day: 3,
    time: '09:00',
    x: 54,
    y: 45,
    description: '124th & 125th floor observation decks, followed by Fountain Lake walk.',
    distanceFromPrev: '1.2 km',
    transitTime: '5 mins',
    transitMode: 'metro',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wp-4',
    name: 'Museum of the Future',
    category: 'Innovation Center',
    day: 6,
    time: '11:00',
    x: 62,
    y: 35,
    description: 'Torus-shaped architectural wonder on Sheikh Zayed Road. Metro Emirates Towers.',
    distanceFromPrev: '3.8 km',
    transitTime: '8 mins',
    transitMode: 'metro',
    imageUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wp-5',
    name: 'Palm Jumeirah & The View',
    category: 'Coastal Archipelago',
    day: 7,
    time: '14:00',
    x: 32,
    y: 65,
    description: 'Palm Monorail transit to Atlantis Aquaventure and 360° observatory.',
    distanceFromPrev: '22.5 km',
    transitTime: '24 mins',
    transitMode: 'taxi',
    imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wp-6',
    name: 'Dubai Marina & JBR',
    category: 'Waterfront & Yacht',
    day: 8,
    time: '17:30',
    x: 26,
    y: 72,
    description: 'Sunset yacht cruise through Dubai Marina canal and Ain Dubai skyline.',
    distanceFromPrev: '5.1 km',
    transitTime: '10 mins',
    transitMode: 'metro',
    imageUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wp-7',
    name: 'Lahbab Red Dunes Safari',
    category: 'Desert Adventure',
    day: 4,
    time: '15:00',
    x: 88,
    y: 78,
    description: '4x4 Land Cruiser dune bashing, sandboarding and Bedouin camp dinner.',
    distanceFromPrev: '48.0 km',
    transitTime: '45 mins',
    transitMode: 'taxi',
    imageUrl: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'wp-8',
    name: 'Sheikh Zayed Mosque (Abu Dhabi)',
    category: 'Day Excursion',
    day: 5,
    time: '08:30',
    x: 10,
    y: 92,
    description: 'Intercity air-conditioned coach tour to the majestic 82-dome white marble mosque.',
    distanceFromPrev: '135 km',
    transitTime: '1 hr 20 mins',
    transitMode: 'bus',
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=400&q=80'
  }
];

export const InteractiveTripMap: React.FC = () => {
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint>(WAYPOINTS[2]); // Default Burj Khalifa
  const [activeFilterDay, setActiveFilterDay] = useState<number | 'all'>('all');
  const [mapStyle, setMapStyle] = useState<'vector' | 'satellite'>('vector');

  const filteredWaypoints = activeFilterDay === 'all' 
    ? WAYPOINTS 
    : WAYPOINTS.filter(w => w.day === activeFilterDay);

  return (
    <div className="space-y-4">
      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-ai-purple" />
          <span className="text-xs font-black text-midnight-navy dark:text-white uppercase tracking-wider">
            Interactive Waypoint Map & GPS Routes
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400">
            8 Verified Stops
          </span>
        </div>

        {/* Filter Days */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold">
          <button
            onClick={() => setActiveFilterDay('all')}
            className={`px-2.5 py-1 rounded-lg transition ${
              activeFilterDay === 'all'
                ? 'bg-ai-purple text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Route
          </button>
          {[1, 3, 4, 5, 7, 8].map(d => (
            <button
              key={d}
              onClick={() => setActiveFilterDay(d)}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeFilterDay === d
                  ? 'bg-ai-purple text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Day {d}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Box & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive SVG Vector Map Canvas */}
        <div className="lg:col-span-8 relative bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-xl min-h-[420px] select-none">
          {/* Subtle Grid / Cartography Aesthetic */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3478F6_1px,transparent_1px)] [background-size:20px_20px]" />
          
          {/* Stylized Coastline & Persian Gulf */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="gulfGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#101D42" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0B132B" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3478F6" />
                <stop offset="50%" stopColor="#7956F5" />
                <stop offset="100%" stopColor="#16BFA5" />
              </linearGradient>
            </defs>

            {/* Coastline curve */}
            <path
              d="M 0 100 Q 200 120 400 160 T 800 240 T 1200 360"
              fill="none"
              stroke="#1E3A8A"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="opacity-40"
            />

            {/* Palm Jumeirah outline curve */}
            <path
              d="M 280 260 C 310 230 350 240 330 280 C 360 260 380 300 330 320"
              fill="none"
              stroke="#3478F6"
              strokeWidth="2"
              className="opacity-30"
            />

            {/* Connecting Polyline Route between Waypoints */}
            <polyline
              points={filteredWaypoints.map(w => `${w.x * 8},${w.y * 4.2}`).join(' ')}
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="3.5"
              strokeDasharray="8 6"
              className="animate-pulse"
            />
          </svg>

          {/* Map Overlay Badge */}
          <div className="absolute top-4 left-4 z-10 bg-midnight-navy/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-white flex items-center gap-2 text-xs">
            <Compass className="w-3.5 h-3.5 text-travel-teal animate-spin" style={{ animationDuration: '12s' }} />
            <span className="font-black">Dubai & Emirates Transit Corridor</span>
            <span className="text-[10px] text-slate-400">• GPS Lat 25.2°N Long 55.3°E</span>
          </div>

          {/* Waypoint Interactive Pins */}
          {filteredWaypoints.map((wp, idx) => {
            const isSelected = selectedWaypoint.id === wp.id;
            return (
              <button
                key={wp.id}
                onClick={() => setSelectedWaypoint(wp)}
                style={{ left: `${wp.x}%`, top: `${wp.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-20 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
              >
                <div className="relative flex flex-col items-center">
                  {/* Pin label popover on hover or selection */}
                  <div className={`mb-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold whitespace-nowrap shadow-lg transition-all ${
                    isSelected 
                      ? 'bg-ai-purple text-white opacity-100 scale-100' 
                      : 'bg-midnight-navy/90 text-slate-200 opacity-80 group-hover:opacity-100'
                  }`}>
                    {wp.name.split('(')[0].trim()}
                  </div>

                  {/* Marker Pin Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg transition-transform ${
                    isSelected
                      ? 'bg-ai-purple border-white text-white ring-4 ring-purple-500/30'
                      : 'bg-white dark:bg-slate-900 border-ai-purple text-ai-purple'
                  }`}>
                    <span className="text-xs font-black">{idx + 1}</span>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Map Legend */}
          <div className="absolute bottom-3 left-3 z-10 bg-midnight-navy/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 text-[11px] text-white flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-ai-purple" />
              <span>Attraction</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-travel-teal" />
              <span>Basecamp Hotel</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>Airport / Metro</span>
            </div>
          </div>
        </div>

        {/* Selected Waypoint Detail Card */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-ai-purple">
              Day {selectedWaypoint.day} • {selectedWaypoint.time}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{selectedWaypoint.transitTime} from prev</span>
            </div>
          </div>

          {/* Photo */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-sm">
            <img 
              src={selectedWaypoint.imageUrl} 
              alt={selectedWaypoint.name}
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2 text-white text-xs font-bold">
              {selectedWaypoint.category}
            </div>
          </div>

          <div>
            <h4 className="font-black text-midnight-navy dark:text-white text-base">
              {selectedWaypoint.name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {selectedWaypoint.description}
            </p>
          </div>

          {/* Transit Info */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5 font-semibold">
                {selectedWaypoint.transitMode === 'metro' && <Train className="w-3.5 h-3.5 text-teal-500" />}
                {selectedWaypoint.transitMode === 'taxi' && <Car className="w-3.5 h-3.5 text-amber-500" />}
                {selectedWaypoint.transitMode === 'bus' && <Navigation className="w-3.5 h-3.5 text-sky-500" />}
                <span>Transit Mode:</span>
              </span>
              <span className="font-bold uppercase text-midnight-navy dark:text-white">
                {selectedWaypoint.transitMode}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="font-semibold">Distance:</span>
              <span className="font-bold text-midnight-navy dark:text-white">
                {selectedWaypoint.distanceFromPrev}
              </span>
            </div>
          </div>

          {/* Next Waypoint Quick Jumper */}
          <button
            onClick={() => {
              const currIdx = WAYPOINTS.findIndex(w => w.id === selectedWaypoint.id);
              const nextWp = WAYPOINTS[(currIdx + 1) % WAYPOINTS.length];
              setSelectedWaypoint(nextWp);
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-bold text-midnight-navy dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between"
          >
            <span>Next Stop on Route</span>
            <ChevronRight className="w-4 h-4 text-ai-purple" />
          </button>
        </div>
      </div>
    </div>
  );
};
