import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Navigation, 
  Car, 
  Train, 
  Clock, 
  Compass, 
  Layers, 
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Volume2,
  VolumeX,
  Play,
  Pause,
  MapPin,
  Sparkles,
  Maximize2,
  RotateCcw,
  Sun,
  ShieldCheck,
  Calendar,
  Eye,
  Bus
} from 'lucide-react';

export interface Waypoint {
  id: string;
  stopNumber: number;
  name: string;
  shortName: string;
  category: string;
  day: number;
  time: string;
  lat: number;
  lng: number;
  schematicX: number; // percentage (0-100)
  schematicY: number; // percentage (0-100)
  labelPosition: 'top' | 'bottom' | 'left' | 'right';
  description: string;
  distanceFromPrev: string;
  transitTime: string;
  transitMode: 'metro' | 'taxi' | 'bus';
  transitDetail: string;
  estCostAed: number;
  estCostInr: number;
  imageUrl: string;
  highlights: string[];
  audioTranscript: string;
  type: 'airport' | 'hotel' | 'attraction' | 'adventure';
}

export const WAYPOINTS: Waypoint[] = [
  {
    id: 'wp-1',
    stopNumber: 1,
    name: 'Dubai Int. Airport (DXB)',
    shortName: 'DXB Terminal 3',
    category: 'Airport Arrival',
    day: 1,
    time: '13:30',
    lat: 25.2532,
    lng: 55.3657,
    schematicX: 84,
    schematicY: 18,
    labelPosition: 'bottom',
    description: 'Terminal 3 arrival via Emirates EK 571. Seamless biometric Smart Gates and Red Line Metro terminal station.',
    distanceFromPrev: '0 km',
    transitTime: '0 mins',
    transitMode: 'metro',
    transitDetail: 'Dubai Metro Red Line • Terminal 3 Station',
    estCostAed: 0,
    estCostInr: 0,
    imageUrl: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=600&q=80',
    highlights: ['DXB Smart E-Gate fast-track', 'Direct Red Line Metro hub', 'Emirates VIP Concierge'],
    audioTranscript: 'Welcome to Dubai International Terminal 3, world hub of Emirates Airline. Equipped with automated biometric Smart Gates for fast-track paperless immigration.',
    type: 'airport'
  },
  {
    id: 'wp-2',
    stopNumber: 2,
    name: 'Rove Downtown Dubai',
    shortName: 'Basecamp Hotel',
    category: 'Hotel Check-in',
    day: 1,
    time: '15:00',
    lat: 25.2014,
    lng: 55.2785,
    schematicX: 62,
    schematicY: 36,
    labelPosition: 'right',
    description: 'Trip basecamp directly opposite Dubai Mall. Infinity saltwater pool with panoramic Burj Khalifa skyline views.',
    distanceFromPrev: '14.2 km',
    transitTime: '18 mins',
    transitMode: 'taxi',
    transitDetail: 'Careem Premier / Airport Taxi E11',
    estCostAed: 45,
    estCostInr: 1035,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    highlights: ['Burj Khalifa pool deck view', '5-min walk to Dubai Mall', '24/7 luggage lockers & cafe'],
    audioTranscript: 'Rove Downtown is your central headquarters, situated directly opposite Dubai Mall and the Burj Khalifa district.',
    type: 'hotel'
  },
  {
    id: 'wp-3',
    stopNumber: 3,
    name: 'Burj Khalifa & Dubai Mall',
    shortName: 'Burj Khalifa',
    category: 'Landmark & Shopping',
    day: 3,
    time: '09:00',
    lat: 25.1972,
    lng: 55.2744,
    schematicX: 44,
    schematicY: 48,
    labelPosition: 'left',
    description: '124th & 125th floor observation decks (At The Top), followed by world-famous Fountain Lake boardwalk.',
    distanceFromPrev: '1.2 km',
    transitTime: '5 mins',
    transitMode: 'metro',
    transitDetail: 'Burj Khalifa / Dubai Mall Metro Station Link',
    estCostAed: 5,
    estCostInr: 115,
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
    highlights: ['At The Top 124th/125th floor pass', 'Dubai Fountain lake promenade', 'Dubai Aquarium & Underwater Zoo'],
    audioTranscript: 'Standing at 828 meters, Burj Khalifa is the tallest building on earth. Double-decker observation elevators ascend at 10 meters per second.',
    type: 'attraction'
  },
  {
    id: 'wp-4',
    stopNumber: 4,
    name: 'Museum of the Future',
    shortName: 'Museum of Future',
    category: 'Innovation Center',
    day: 6,
    time: '11:00',
    lat: 25.2192,
    lng: 55.2818,
    schematicX: 70,
    schematicY: 25,
    labelPosition: 'top',
    description: 'Torus-shaped architectural wonder on Sheikh Zayed Road. Futuristic exhibitions on AI, space exploration, and bioengineering.',
    distanceFromPrev: '3.8 km',
    transitTime: '8 mins',
    transitMode: 'metro',
    transitDetail: 'Metro Red Line • Emirates Towers Station',
    estCostAed: 5,
    estCostInr: 115,
    imageUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80',
    highlights: ['Arabic calligraphy steel facade', 'Tomorrow Today AI innovations', 'OSS Hope Space Station simulator'],
    audioTranscript: 'Recognized as one of the most complex architectural structures globally, the torus facade is engraved with Arabic poetry quotes by Sheikh Mohammed.',
    type: 'attraction'
  },
  {
    id: 'wp-5',
    stopNumber: 5,
    name: 'Palm Jumeirah & The View',
    shortName: 'The Palm & Atlantis',
    category: 'Coastal Archipelago',
    day: 7,
    time: '14:00',
    lat: 25.1124,
    lng: 55.1390,
    schematicX: 28,
    schematicY: 64,
    labelPosition: 'right',
    description: 'Palm Monorail transit to Atlantis Aquaventure, Palm Tower level 52 observatory, and crescent beach.',
    distanceFromPrev: '22.5 km',
    transitTime: '24 mins',
    transitMode: 'taxi',
    transitDetail: 'Careem Taxi / Palm Monorail Gateway',
    estCostAed: 55,
    estCostInr: 1265,
    imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80',
    highlights: ['360° View at The Palm (Level 52)', 'Palm Monorail island transit', 'Atlantis Aquaventure beachside'],
    audioTranscript: 'Built with 120 million cubic meters of sand, Palm Jumeirah is the world largest man-made island, extending 5 kilometers into the Arabian Gulf.',
    type: 'attraction'
  },
  {
    id: 'wp-6',
    stopNumber: 6,
    name: 'Dubai Marina & JBR',
    shortName: 'Marina & JBR Walk',
    category: 'Waterfront & Yacht',
    day: 8,
    time: '17:30',
    lat: 25.0805,
    lng: 55.1403,
    schematicX: 18,
    schematicY: 76,
    labelPosition: 'bottom',
    description: 'Sunset yacht cruise along the 3km Marina canal, followed by seaside dining at Jumeirah Beach Residence promenade.',
    distanceFromPrev: '5.1 km',
    transitTime: '10 mins',
    transitMode: 'metro',
    transitDetail: 'Dubai Tram • Marina Towers / DMCC Metro',
    estCostAed: 4,
    estCostInr: 92,
    imageUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80',
    highlights: ['Sunset Marina Yacht cruise', 'Ain Dubai ferris wheel view', 'JBR Beach open-air dining strip'],
    audioTranscript: 'Dubai Marina is an artificial canal metropolis framed by over 200 high-rise towers, luxury yachts, and the bustling JBR shoreline.',
    type: 'attraction'
  },
  {
    id: 'wp-7',
    stopNumber: 7,
    name: 'Lahbab Red Dunes Safari',
    shortName: 'Lahbab Red Dunes',
    category: 'Desert Adventure',
    day: 4,
    time: '15:00',
    lat: 24.9602,
    lng: 55.5921,
    schematicX: 86,
    schematicY: 74,
    labelPosition: 'top',
    description: 'High-octane 4x4 Land Cruiser dune bashing across the crimson desert, sandboarding, camel caravan, and Bedouin banquet.',
    distanceFromPrev: '48.0 km',
    transitTime: '45 mins',
    transitMode: 'taxi',
    transitDetail: '4x4 VIP Desert Safari Transfer',
    estCostAed: 180,
    estCostInr: 4140,
    imageUrl: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=600&q=80',
    highlights: ['300ft crimson dune bashing', 'Sunset camel ride & falconry', 'Bedouin BBQ dinner & stargazing'],
    audioTranscript: 'The high red dunes of Lahbab feature deep iron-oxide sands ideal for desert 4x4 driving, sandboarding, and traditional Arabian hospitality.',
    type: 'adventure'
  },
  {
    id: 'wp-8',
    stopNumber: 8,
    name: 'Sheikh Zayed Mosque (Abu Dhabi)',
    shortName: 'Sheikh Zayed Mosque',
    category: 'Day Excursion',
    day: 5,
    time: '08:30',
    lat: 24.4128,
    lng: 54.4750,
    schematicX: 24,
    schematicY: 92,
    labelPosition: 'right',
    description: 'Intercity excursion to the world-renowned white marble mosque with 82 domes, 1,000+ floral columns, and 24K gold chandeliers.',
    distanceFromPrev: '135 km',
    transitTime: '1 hr 20 mins',
    transitMode: 'bus',
    transitDetail: 'Intercity AC Luxury Coach Tour (E101)',
    estCostAed: 95,
    estCostInr: 2185,
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=600&q=80',
    highlights: ['82 Macedonian marble domes', 'World largest hand-knotted carpet', 'Reflective twilight water pools'],
    audioTranscript: 'A masterpiece of Islamic architecture, Sheikh Zayed Grand Mosque accommodates 40,000 worshippers and features 24-carat gold-plated chandeliers from Munich.',
    type: 'attraction'
  }
];

type MapTileLayer = 'dark' | 'satellite' | 'street';

export const InteractiveTripMap: React.FC = () => {
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint>(WAYPOINTS[2]); // Default Burj Khalifa
  const [activeFilterDay, setActiveFilterDay] = useState<number | 'all'>('all');
  const [viewStyle, setViewStyle] = useState<'real' | 'schematic'>('real');
  const [tileLayer, setTileLayer] = useState<MapTileLayer>('dark');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Leaflet references
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const filteredWaypoints = activeFilterDay === 'all' 
    ? WAYPOINTS 
    : WAYPOINTS.filter(w => w.day === activeFilterDay);

  // Audio simulation timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 5;
        });
      }, 500);
    } else {
      setAudioProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  // Reset audio state when waypoint changes
  useEffect(() => {
    setIsPlayingAudio(false);
    setAudioProgress(0);
  }, [selectedWaypoint.id]);

  // Leaflet Tile URLs
  const TILE_SERVERS: Record<MapTileLayer, { url: string; attribution: string }> = {
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CARTO &copy; OpenStreetMap'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri & Earthstar Geographics'
    },
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors'
    }
  };

  // ── 1. LEAFLET MAP INITIALIZATION & UPDATES ─────────────────────────
  useEffect(() => {
    if (viewStyle !== 'real') return;
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [25.1972, 55.2744],
        zoom: 11,
        minZoom: 8,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false
      });

      const initialTile = L.tileLayer(TILE_SERVERS[tileLayer].url, {
        maxZoom: 18,
        attribution: TILE_SERVERS[tileLayer].attribution
      }).addTo(map);

      tileLayerRef.current = initialTile;
      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Keep instance if toggling between components or cleanup on unmount
    };
  }, [viewStyle]);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const newTile = L.tileLayer(TILE_SERVERS[tileLayer].url, {
      maxZoom: 18,
      attribution: TILE_SERVERS[tileLayer].attribution
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTile;
  }, [tileLayer]);

  // Re-draw Leaflet Markers and Polyline when filteredWaypoints or selectedWaypoint changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    markersGroup.clearLayers();

    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    // 1. Draw Polyline Route between filtered waypoints
    if (filteredWaypoints.length > 1) {
      const latLngs: L.LatLngExpression[] = filteredWaypoints.map(w => [w.lat, w.lng]);
      const poly = L.polyline(latLngs, {
        color: '#7956F5',
        weight: 3.5,
        opacity: 0.9,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      polylineRef.current = poly;
    }

    // 2. Draw Custom Markers with Category Colors & Selected Halo
    filteredWaypoints.forEach(wp => {
      const isSelected = wp.id === selectedWaypoint.id;
      
      const badgeColor = wp.type === 'airport' 
        ? '#0ea5e9' // sky-500
        : wp.type === 'hotel' 
        ? '#10b981' // emerald-500
        : wp.type === 'adventure' 
        ? '#f59e0b' // amber-500
        : '#7956F5'; // purple

      const iconHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          ${isSelected ? `
            <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(121, 86, 245, 0.35); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite; top: -6px; left: -6px;"></div>
          ` : ''}
          <div style="
            width: ${isSelected ? '34px' : '28px'};
            height: ${isSelected ? '34px' : '28px'};
            border-radius: 9999px;
            background: ${badgeColor};
            border: 2px solid ${isSelected ? '#ffffff' : 'rgba(255,255,255,0.85)'};
            color: #ffffff;
            font-weight: 900;
            font-size: ${isSelected ? '13px' : '11px'};
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(0,0,0,0.45);
            transition: all 0.25s ease;
          ">
            ${wp.stopNumber}
          </div>
          ${isSelected ? `
            <div style="
              margin-top: 4px;
              padding: 2px 8px;
              border-radius: 6px;
              background: #0f172a;
              border: 1px solid rgba(255,255,255,0.2);
              color: #ffffff;
              font-size: 10px;
              font-weight: 800;
              white-space: nowrap;
              box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            ">
              ${wp.shortName}
            </div>
          ` : ''}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: iconHtml,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([wp.lat, wp.lng], { icon: customIcon });
      marker.on('click', () => {
        setSelectedWaypoint(wp);
        map.flyTo([wp.lat, wp.lng], 13, { duration: 0.8 });
      });

      markersGroup.addLayer(marker);
    });

    // Invalidate map size so it fits perfectly
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

  }, [filteredWaypoints, selectedWaypoint.id, viewStyle]);

  // Pan to selected waypoint when clicked from controls or list
  const handleSelectWaypoint = (wp: Waypoint) => {
    setSelectedWaypoint(wp);
    if (viewStyle === 'real' && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([wp.lat, wp.lng], 13, { duration: 1.0 });
    }
  };

  // Recenter all stops
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    if (filteredWaypoints.length === 1) {
      mapInstanceRef.current.flyTo([filteredWaypoints[0].lat, filteredWaypoints[0].lng], 12);
    } else {
      const bounds = L.latLngBounds(filteredWaypoints.map(w => [w.lat, w.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Top Map Control & Filter Bar ──────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Left Title & Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-ai-purple">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-midnight-navy dark:text-white uppercase tracking-wider">
                Interactive Waypoint Map & GPS Routes
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                8 Verified Stops
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Dubai & Abu Dhabi High-Precision Transit Corridor
            </p>
          </div>
        </div>

        {/* Center: View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setViewStyle('real')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              viewStyle === 'real'
                ? 'bg-white dark:bg-slate-900 text-ai-purple shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Satellite & Live GPS</span>
          </button>
          <button
            onClick={() => setViewStyle('schematic')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              viewStyle === 'schematic'
                ? 'bg-white dark:bg-slate-900 text-ai-purple shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>Transit Schematic</span>
          </button>
        </div>

        {/* Right: Day Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-bold py-1">
          <button
            onClick={() => setActiveFilterDay('all')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeFilterDay === 'all'
                ? 'bg-ai-purple text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Route (8)
          </button>
          {[1, 3, 4, 5, 6, 7, 8].map(d => (
            <button
              key={d}
              onClick={() => {
                setActiveFilterDay(d);
                const dayWp = WAYPOINTS.find(w => w.day === d);
                if (dayWp) handleSelectWaypoint(dayWp);
              }}
              className={`px-2.5 py-1.5 rounded-lg transition whitespace-nowrap ${
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

      {/* ── Main Map Canvas & Detail Inspector ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Map Container (8 cols) */}
        <div className="lg:col-span-8 relative bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-xl min-h-[460px] flex flex-col justify-between">
          
          {/* 1. Real Leaflet Map Mode */}
          {viewStyle === 'real' ? (
            <div className="relative w-full h-[460px]">
              <div ref={mapContainerRef} className="w-full h-full z-0" />

              {/* Top-Left Floating HUD */}
              <div className="absolute top-4 left-4 z-10 bg-midnight-navy/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/60 text-white flex items-center gap-2.5 text-xs shadow-lg">
                <Compass className="w-4 h-4 text-travel-teal animate-spin" style={{ animationDuration: '14s' }} />
                <div>
                  <div className="font-black text-[11px] tracking-wide">Dubai & Emirates Transit Corridor</div>
                  <div className="text-[10px] text-slate-300 font-mono">
                    GPS: {selectedWaypoint.lat.toFixed(4)}°N, {selectedWaypoint.lng.toFixed(4)}°E
                  </div>
                </div>
              </div>

              {/* Top-Right Map Tile Switcher & Recenter */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-midnight-navy/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/60 shadow-lg text-[11px] font-bold text-white">
                <button
                  onClick={() => setTileLayer('dark')}
                  className={`px-2.5 py-1 rounded-xl transition ${
                    tileLayer === 'dark' ? 'bg-ai-purple text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Dark Cartographic Map"
                >
                  Dark
                </button>
                <button
                  onClick={() => setTileLayer('satellite')}
                  className={`px-2.5 py-1 rounded-xl transition ${
                    tileLayer === 'satellite' ? 'bg-ai-purple text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="High-Res Esri Satellite"
                >
                  Satellite
                </button>
                <button
                  onClick={() => setTileLayer('street')}
                  className={`px-2.5 py-1 rounded-xl transition ${
                    tileLayer === 'street' ? 'bg-ai-purple text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Street Map"
                >
                  Street
                </button>
                <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />
                <button
                  onClick={handleRecenter}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition"
                  title="Fit All Route Stops"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom-Right Clean Floating Legend (Zero Overlaps!) */}
              <div className="absolute bottom-3 right-3 z-10 bg-midnight-navy/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-[10px] text-white flex items-center gap-3 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-ai-purple ring-2 ring-purple-400/30" />
                  <span>Attraction</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Basecamp Hotel</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span>Airport / Metro</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Desert Safari</span>
                </div>
              </div>
            </div>
          ) : (
            /* 2. Stylized Transit Schematic Mode (Carefully Spaced Coordinates) */
            <div className="relative w-full h-[460px] select-none p-4">
              {/* Cartographic Grid Background */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3478F6_1px,transparent_1px)] [background-size:24px_24px]" />

              {/* Top HUD */}
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className="bg-midnight-navy/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/60 text-white flex items-center gap-2 text-xs">
                  <Compass className="w-3.5 h-3.5 text-travel-teal animate-spin" style={{ animationDuration: '14s' }} />
                  <span className="font-black">Emirates High-Speed Corridor Schematic</span>
                  <span className="text-[10px] text-slate-400">• E11 Sheikh Zayed Transit Spine</span>
                </div>

                {/* Top-Right Legend in Schematic Mode (Completely away from Stop 8!) */}
                <div className="bg-midnight-navy/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-[10px] text-white flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 rounded-full h-2 bg-ai-purple" />
                    <span>Attraction</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 rounded-full h-2 bg-emerald-500" />
                    <span>Hotel</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 rounded-full h-2 bg-sky-500" />
                    <span>Airport</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 rounded-full h-2 bg-amber-500" />
                    <span>Safari</span>
                  </div>
                </div>
              </div>

              {/* SVG Map Lines with Proper ViewBox (0 0 100 100) matching CSS % */}
              <svg 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <defs>
                  <linearGradient id="routeSchematicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="30%" stopColor="#7956F5" />
                    <stop offset="70%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>

                {/* Coastline Aesthetic Wave */}
                <path
                  d="M 5,20 Q 35,40 60,65 T 95,90"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="opacity-40"
                />

                {/* Animated Waypoint Route Polyline */}
                {filteredWaypoints.length > 1 && (
                  <polyline
                    points={filteredWaypoints.map(w => `${w.schematicX},${w.schematicY}`).join(' ')}
                    fill="none"
                    stroke="url(#routeSchematicGrad)"
                    strokeWidth="1.2"
                    strokeDasharray="2 2"
                    className="animate-pulse"
                  />
                )}
              </svg>

              {/* Interactive Staggered Waypoint Buttons */}
              {filteredWaypoints.map(wp => {
                const isSelected = selectedWaypoint.id === wp.id;

                const bgClass = wp.type === 'airport'
                  ? 'bg-sky-500'
                  : wp.type === 'hotel'
                  ? 'bg-emerald-500'
                  : wp.type === 'adventure'
                  ? 'bg-amber-500'
                  : 'bg-ai-purple';

                return (
                  <button
                    key={wp.id}
                    onClick={() => handleSelectWaypoint(wp)}
                    style={{ left: `${wp.schematicX}%`, top: `${wp.schematicY}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-20 ${
                      isSelected ? 'scale-125 z-40' : 'hover:scale-110'
                    }`}
                  >
                    <div className="relative flex flex-col items-center">
                      {/* Collision-Free Directional Label */}
                      <div className={`absolute px-2 py-0.5 rounded-md text-[10px] font-extrabold whitespace-nowrap shadow-xl transition-all pointer-events-none ${
                        isSelected
                          ? 'bg-ai-purple text-white opacity-100 ring-1 ring-white/30 scale-100 z-50'
                          : 'bg-slate-900/90 text-slate-300 opacity-70 group-hover:opacity-100'
                      } ${
                        wp.labelPosition === 'top'
                          ? 'bottom-8'
                          : wp.labelPosition === 'bottom'
                          ? 'top-8'
                          : wp.labelPosition === 'left'
                          ? 'right-8 -top-1'
                          : 'left-8 -top-1'
                      }`}>
                        {wp.shortName}
                      </div>

                      {/* Numbered Circle Node */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow-lg transition-transform ${bgClass} ${
                        isSelected
                          ? 'border-2 border-white text-white ring-4 ring-purple-500/40'
                          : 'border border-slate-900 text-white'
                      }`}>
                        {wp.stopNumber}
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Bottom Note */}
              <div className="absolute bottom-3 left-4 text-[10px] text-slate-500 font-mono">
                Click any waypoint to inspect GPS itinerary and transit connection.
              </div>
            </div>
          )}

          {/* Quick Waypoint Horizontal Stepper Strip */}
          <div className="bg-slate-900/95 border-t border-slate-800 p-2.5 px-4 flex items-center justify-between gap-2 overflow-x-auto z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Itinerary Corridor:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {WAYPOINTS.map((wp) => {
                const isSelected = selectedWaypoint.id === wp.id;
                return (
                  <button
                    key={wp.id}
                    onClick={() => handleSelectWaypoint(wp)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                      isSelected
                        ? 'bg-ai-purple text-white shadow-sm ring-1 ring-purple-300'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-700 text-white text-[9px] flex items-center justify-center font-bold">
                      {wp.stopNumber}
                    </span>
                    <span>{wp.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right Column: Enhanced Stop Detail Inspector (4 cols) ──── */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          
          {/* Header Tag Bar */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-ai-purple flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Day {selectedWaypoint.day} • {selectedWaypoint.time}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
              <Clock className="w-3.5 h-3.5 text-travel-teal" />
              <span>{selectedWaypoint.transitTime} from prev</span>
            </div>
          </div>

          {/* High-Res Hero Photo with Live Badge */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-md group">
            <img 
              src={selectedWaypoint.imageUrl} 
              alt={selectedWaypoint.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Category tag */}
            <div className="absolute top-2.5 left-2.5 bg-midnight-navy/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-bold border border-white/10 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-travel-teal" />
              <span>{selectedWaypoint.category}</span>
            </div>

            {/* Weather & Season tag */}
            <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-amber-300 text-[10px] font-bold flex items-center gap-1">
              <Sun className="w-3 h-3" />
              <span>28°C Clear</span>
            </div>

            {/* Title over image bottom */}
            <div className="absolute bottom-2.5 left-3 right-3 text-white">
              <div className="text-[10px] font-mono text-purple-300">
                Stop #{selectedWaypoint.stopNumber} of 8
              </div>
              <h4 className="font-black text-sm text-white drop-shadow-sm truncate">
                {selectedWaypoint.name}
              </h4>
            </div>
          </div>

          {/* Audio Guide Narration Snippet */}
          <div className="bg-purple-500/5 dark:bg-purple-500/10 p-3 rounded-2xl border border-purple-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-ai-purple">
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>TravelMate Audio Guide</span>
              </div>
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="px-2.5 py-1 rounded-lg bg-ai-purple hover:bg-ai-purple-light text-white text-[10px] font-bold transition flex items-center gap-1 shadow-sm"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Play 30s Guide</span>
                  </>
                )}
              </button>
            </div>

            {/* Simulated Equalizer Soundbars when Playing */}
            {isPlayingAudio && (
              <div className="flex items-center gap-1 py-1">
                <span className="w-1 h-3 bg-ai-purple animate-pulse rounded-full" />
                <span className="w-1 h-5 bg-ai-purple animate-pulse delay-75 rounded-full" />
                <span className="w-1 h-4 bg-ai-purple animate-pulse delay-150 rounded-full" />
                <span className="w-1 h-6 bg-ai-purple animate-pulse delay-100 rounded-full" />
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden ml-2">
                  <div 
                    className="bg-ai-purple h-full transition-all duration-500" 
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
              </div>
            )}

            <p className="text-[11px] text-slate-600 dark:text-slate-300 italic leading-relaxed">
              "{selectedWaypoint.audioTranscript}"
            </p>
          </div>

          {/* Key Highlights */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Verified Highlights:
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {selectedWaypoint.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-travel-teal shrink-0" />
                  <span className="text-[11px] font-medium">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transit & Live Navigation Box */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-2.5 text-xs border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5 font-semibold">
                {selectedWaypoint.transitMode === 'metro' && <Train className="w-3.5 h-3.5 text-teal-500" />}
                {selectedWaypoint.transitMode === 'taxi' && <Car className="w-3.5 h-3.5 text-amber-500" />}
                {selectedWaypoint.transitMode === 'bus' && <Bus className="w-3.5 h-3.5 text-sky-500" />}
                <span>Connection:</span>
              </span>
              <span className="font-bold text-midnight-navy dark:text-white text-right truncate max-w-[170px]">
                {selectedWaypoint.transitDetail}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="font-semibold">Distance & Cost:</span>
              <span className="font-bold text-midnight-navy dark:text-white">
                {selectedWaypoint.distanceFromPrev} • {selectedWaypoint.estCostAed === 0 ? 'Free Transfer' : `${selectedWaypoint.estCostAed} AED (~₹${selectedWaypoint.estCostInr})`}
              </span>
            </div>

            {/* Direct Google Maps GPS Navigation Button */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedWaypoint.lat},${selectedWaypoint.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold text-[11px] transition flex items-center justify-center gap-1.5 border border-teal-500/20"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate in Google Maps ({selectedWaypoint.lat.toFixed(3)}°N)</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
            </a>
          </div>

          {/* Stepper Navigation Buttons (Prev & Next) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                const currIdx = WAYPOINTS.findIndex(w => w.id === selectedWaypoint.id);
                const prevIdx = (currIdx - 1 + WAYPOINTS.length) % WAYPOINTS.length;
                handleSelectWaypoint(WAYPOINTS[prevIdx]);
              }}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-bold text-midnight-navy dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1"
            >
              <ChevronLeft className="w-4 h-4 text-ai-purple" />
              <span>Prev Stop</span>
            </button>

            <button
              onClick={() => {
                const currIdx = WAYPOINTS.findIndex(w => w.id === selectedWaypoint.id);
                const nextIdx = (currIdx + 1) % WAYPOINTS.length;
                handleSelectWaypoint(WAYPOINTS[nextIdx]);
              }}
              className="py-2.5 px-3 rounded-xl bg-ai-purple hover:bg-ai-purple-light text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
            >
              <span>Next Stop</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
