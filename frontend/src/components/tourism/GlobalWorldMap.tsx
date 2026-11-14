import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Globe as GlobeIcon, 
  Map as MapIcon, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Navigation, 
  Plus, 
  Minus, 
  Compass, 
  RotateCcw,
  Sparkles,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { GlobalTourismItem } from '../../types';

interface GlobalWorldMapProps {
  destinations: GlobalTourismItem[];
  selectedDestination: GlobalTourismItem | null;
  onSelectDestination: (dest: GlobalTourismItem) => void;
  routeWaypoints?: GlobalTourismItem[];
  userLocation?: { latitude: number; longitude: number } | null;
  className?: string;
}

type MapLayerType = 'street' | 'satellite' | 'terrain' | 'dark';

export const GlobalWorldMap: React.FC<GlobalWorldMapProps> = ({
  destinations,
  selectedDestination,
  onSelectDestination,
  routeWaypoints = [],
  userLocation,
  className = ''
}) => {
  const [mapMode, setMapMode] = useState<'3d' | '2d'>('2d');
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('satellite');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const leafletContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylineLayerRef = useRef<L.Polyline | null>(null);

  // 3D Canvas Globe Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [globeRotation, setGlobeRotation] = useState({ x: 0.2, y: -1.2 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // ── 1. LEAFLET INITIALIZATION & TILE LAYERS ───────────────────────────────
  const tileUrls: Record<MapLayerType, { url: string; attribution: string }> = {
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri, Earthstar Geographics'
    },
    terrain: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map data &copy; OpenTopoMap'
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CARTO &copy; OpenStreetMap'
    }
  };

  useEffect(() => {
    if (mapMode !== '2d') return;
    if (!leafletContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(leafletContainerRef.current, {
        center: [23.5, 55.0],
        zoom: 3,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false,
        worldCopyJump: true
      });

      const baseTile = L.tileLayer(tileUrls[activeLayer].url, {
        attribution: tileUrls[activeLayer].attribution,
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    } else {
      // Update tile layer
      mapInstanceRef.current.eachLayer((l) => {
        if (l instanceof L.TileLayer) {
          mapInstanceRef.current?.removeLayer(l);
        }
      });
      L.tileLayer(tileUrls[activeLayer].url, {
        attribution: tileUrls[activeLayer].attribution,
        maxZoom: 18
      }).addTo(mapInstanceRef.current);
    }
  }, [mapMode, activeLayer]);

  // ── 2. LEAFLET MARKERS & ROUTE POLYLINES ──────────────────────────────────
  useEffect(() => {
    if (mapMode !== '2d' || !mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Add Destination Markers
    destinations.forEach((dest) => {
      const isSelected = selectedDestination?.id === dest.id;
      const isWaypoint = routeWaypoints.some(w => w.id === dest.id);

      const categoryIcons: Record<string, string> = {
        wonder: '🌟',
        monument: '🏛️',
        museum: '🖼️',
        beach: '🏖️',
        mountain: '🏔️',
        wildlife: '🦁',
        waterfall: '🌊',
        religious: '🛕',
        adventure: '🪂',
        shopping: '🛍️',
        food: '🍜',
        nature: '🌿'
      };
      const catIcon = categoryIcons[dest.category] || '📍';

      const markerHtml = `
        <div class="relative group cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-lg font-bold border-2 ${
            isSelected 
              ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-400/40 animate-bounce' 
              : isWaypoint
              ? 'bg-blue-600 text-white border-white ring-2 ring-blue-500/50'
              : 'bg-slate-900/90 text-white border-slate-700 backdrop-blur-sm'
          }">
            ${catIcon}
          </div>
          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-950/90 text-[10px] font-bold text-white shadow-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            ${dest.name} • ${dest.rating}★
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([dest.latitude, dest.longitude], { icon: customIcon });
      marker.on('click', () => {
        onSelectDestination(dest);
        mapInstanceRef.current?.flyTo([dest.latitude, dest.longitude], Math.max(mapInstanceRef.current.getZoom(), 6), {
          duration: 1.2
        });
      });

      markersLayerRef.current?.addLayer(marker);
    });

    // Add User GPS marker if permitted
    if (userLocation) {
      const userHtml = `
        <div class="relative flex items-center justify-center">
          <span class="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-500/30 animate-pulse"></span>
          <span class="absolute w-8 h-8 rounded-full bg-blue-400/20 animate-ping"></span>
        </div>
      `;
      const userIcon = L.divIcon({
        html: userHtml,
        className: 'user-location-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      const userMarker = L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon });
      userMarker.bindTooltip("You are here (GPS)", { permanent: false, direction: 'top' });
      markersLayerRef.current.addLayer(userMarker);
    }

    // Add Route Polyline
    if (polylineLayerRef.current) {
      mapInstanceRef.current.removeLayer(polylineLayerRef.current);
      polylineLayerRef.current = null;
    }

    if (routeWaypoints.length >= 2) {
      const latlngs = routeWaypoints.map(w => [w.latitude, w.longitude] as [number, number]);
      const polyline = L.polyline(latlngs, {
        color: '#f59e0b',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '8, 8'
      }).addTo(mapInstanceRef.current);
      polylineLayerRef.current = polyline;
    }
  }, [destinations, selectedDestination, routeWaypoints, userLocation, mapMode]);

  // Center map on selected destination
  useEffect(() => {
    if (mapMode === '2d' && mapInstanceRef.current && selectedDestination) {
      mapInstanceRef.current.flyTo(
        [selectedDestination.latitude, selectedDestination.longitude],
        Math.max(mapInstanceRef.current.getZoom(), 5),
        { duration: 1.2 }
      );
    }
  }, [selectedDestination, mapMode]);

  // ── 3. 3D CANVAS GLOBE RENDERING ──────────────────────────────────────────
  useEffect(() => {
    if (mapMode !== '3d') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 800;
    const height = canvas.clientHeight || 550;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const radius = Math.min(width, height) * 0.38;
    const centerX = width / 2;
    const centerY = height / 2;

    let rotY = globeRotation.y;
    let rotX = globeRotation.x;

    const latLngTo3D = (lat: number, lng: number, r: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return {
        x: -(r * Math.sin(phi) * Math.cos(theta)),
        y: r * Math.cos(phi),
        z: r * Math.sin(phi) * Math.sin(theta)
      };
    };

    const rotatePoint = (pt: { x: number; y: number; z: number }, rx: number, ry: number) => {
      // Rotate around X
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y1 = pt.y * cosX - pt.z * sinX;
      const z1 = pt.y * sinX + pt.z * cosX;

      // Rotate around Y
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x2 = pt.x * cosY + z1 * sinY;
      const z2 = -pt.x * sinY + z1 * cosY;

      return { x: x2, y: y1, z: z2 };
    };

    const render = () => {
      if (!isDragging) {
        rotY += 0.003; // Gentle rotation
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Globe Base Shading
      const globeGrad = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      globeGrad.addColorStop(0, '#1e293b');
      globeGrad.addColorStop(0.7, '#0f172a');
      globeGrad.addColorStop(1, '#020617');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = globeGrad;
      ctx.fill();

      // Atmospheric Glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.95,
        centerX,
        centerY,
        radius * 1.15
      );
      glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      glowGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // 2. Parallels & Meridians (Wireframe)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;

      // Latitudinal rings
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lng = -180; lng <= 180; lng += 10) {
          const pt = latLngTo3D(lat, lng, radius);
          const rot = rotatePoint(pt, rotX, rotY);
          if (rot.z > 0) {
            if (!started) {
              ctx.moveTo(centerX + rot.x, centerY + rot.y);
              started = true;
            } else {
              ctx.lineTo(centerX + rot.x, centerY + rot.y);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // 3. Render Destination Points
      destinations.forEach((dest) => {
        const pt = latLngTo3D(dest.latitude, dest.longitude, radius);
        const rot = rotatePoint(pt, rotX, rotY);

        if (rot.z > 0) {
          const isSelected = selectedDestination?.id === dest.id;
          const px = centerX + rot.x;
          const py = centerY + rot.y;

          // Pulse ring for selected
          if (isSelected) {
            ctx.beginPath();
            ctx.arc(px, py, 10, 0, Math.PI * 2);
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Pin marker dot
          ctx.beginPath();
          ctx.arc(px, py, isSelected ? 5 : 3.5, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? '#f59e0b' : '#38bdf8';
          ctx.shadowColor = isSelected ? '#f59e0b' : '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Label
          if (isSelected || radius > 180) {
            ctx.font = 'bold 10px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(dest.name.slice(0, 15), px + 8, py + 3);
          }
        }
      });

      // 4. Render Route Arcs on 3D Globe
      if (routeWaypoints.length >= 2) {
        ctx.beginPath();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);

        for (let i = 0; i < routeWaypoints.length - 1; i++) {
          const w1 = routeWaypoints[i];
          const w2 = routeWaypoints[i + 1];

          // Draw great-circle arc sampling 20 points
          let started = false;
          for (let step = 0; step <= 20; step++) {
            const f = step / 20.0;
            const curLat = w1.latitude + (w2.latitude - w1.latitude) * f;
            const curLon = w1.longitude + (w2.longitude - w1.longitude) * f;
            // Elevate arc slightly above surface
            const arcR = radius * (1.0 + Math.sin(f * Math.PI) * 0.12);
            const pt = latLngTo3D(curLat, curLon, arcR);
            const rot = rotatePoint(pt, rotX, rotY);

            if (rot.z > 0) {
              if (!started) {
                ctx.moveTo(centerX + rot.x, centerY + rot.y);
                started = true;
              } else {
                ctx.lineTo(centerX + rot.x, centerY + rot.y);
              }
            } else {
              started = false;
            }
          }
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mapMode, globeRotation, isDragging, destinations, selectedDestination, routeWaypoints]);

  // 3D Canvas Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setGlobeRotation((prev) => ({
      x: Math.max(-1.4, Math.min(1.4, prev.x + dy * 0.005)),
      y: prev.y + dx * 0.005
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.warn(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.warn(err));
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 select-none ${className}`}
      style={{ minHeight: '560px' }}
    >
      {/* ── TOP CONTROL BAR ── */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between pointer-events-none">
        {/* Left: Mode Toggle */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-lg text-xs">
          <button
            onClick={() => setMapMode('2d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              mapMode === '2d'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            2D Interactive Map
          </button>
          <button
            onClick={() => setMapMode('3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              mapMode === '3d'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GlobeIcon className="w-3.5 h-3.5" />
            3D Globe Projection
          </button>
        </div>

        {/* Right: Controls & Layer Switcher */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Layer Selector */}
          {mapMode === '2d' && (
            <div className="relative">
              <button
                onClick={() => setShowLayerMenu(!showLayerMenu)}
                className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white hover:bg-slate-800 shadow-lg text-xs font-semibold flex items-center gap-1.5"
                title="Map Layers"
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <span className="hidden sm:inline capitalize">{activeLayer}</span>
              </button>

              {showLayerMenu && (
                <div className="absolute right-0 top-11 w-44 rounded-2xl bg-slate-900/95 backdrop-blur-lg border border-white/10 shadow-2xl p-1.5 space-y-1 text-xs z-50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">Map Layers</div>
                  {(['satellite', 'street', 'terrain', 'dark'] as MapLayerType[]).map((layer) => (
                    <button
                      key={layer}
                      onClick={() => {
                        setActiveLayer(layer);
                        setShowLayerMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl font-medium capitalize flex items-center justify-between ${
                        activeLayer === layer
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{layer} View</span>
                      {activeLayer === layer && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User Location */}
          {userLocation && mapMode === '2d' && (
            <button
              onClick={() => {
                mapInstanceRef.current?.flyTo([userLocation.latitude, userLocation.longitude], 10, { duration: 1.5 });
              }}
              className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-blue-400 hover:text-white hover:bg-slate-800 shadow-lg"
              title="Fly to My Location"
            >
              <Navigation className="w-4 h-4" />
            </button>
          )}

          {/* Reset World View */}
          <button
            onClick={() => {
              if (mapMode === '2d') {
                mapInstanceRef.current?.flyTo([23.5, 55.0], 3, { duration: 1.2 });
              } else {
                setGlobeRotation({ x: 0.2, y: -1.2 });
              }
            }}
            className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg"
            title="Reset World View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── 2D LEAFLET VIEW ── */}
      <div 
        ref={leafletContainerRef}
        className={`w-full h-full absolute inset-0 ${mapMode === '2d' ? 'block' : 'hidden'}`}
        style={{ minHeight: '560px' }}
      />

      {/* ── 3D CANVAS VIEW ── */}
      {mapMode === '3d' && (
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
          style={{ minHeight: '560px' }}
        />
      )}

      {/* ── BOTTOM MAP LEGEND & QUICK STATS ── */}
      <div className="absolute bottom-4 left-4 z-[400] pointer-events-none hidden sm:flex items-center gap-2">
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-[11px] font-medium text-slate-300 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{destinations.length} Worldwide Attractions Active</span>
          <span className="text-slate-500">•</span>
          <span>6 Continents</span>
        </div>

        {routeWaypoints.length > 0 && (
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-[11px] font-bold text-amber-300 flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Itinerary Route: {routeWaypoints.length} stops linked</span>
          </div>
        )}
      </div>

      {/* Zoom in / out floating buttons for 2D map */}
      {mapMode === '2d' && (
        <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-1.5">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-8 h-8 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-slate-800 shadow-lg text-sm font-bold"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-8 h-8 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-slate-800 shadow-lg text-sm font-bold"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
