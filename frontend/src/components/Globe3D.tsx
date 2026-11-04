import React, { useEffect, useRef, useState } from 'react';

interface CityPin {
  name: string;
  lat: number;
  lng: number;
  color: string;
  isPrimary?: boolean;
}

const CITIES: CityPin[] = [
  { name: 'Dhanbad (Origin)', lat: 23.7957, lng: 86.4304, color: '#f59e0b', isPrimary: true },
  { name: 'Kolkata (Hub)', lat: 22.5726, lng: 88.3639, color: '#fbbf24' },
  { name: 'Dubai (Dest)', lat: 25.2048, lng: 55.2708, color: '#38bdf8', isPrimary: true },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, color: '#ec4899' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, color: '#a855f7' },
  { name: 'New York', lat: 40.7128, lng: -74.0060, color: '#10b981' },
  { name: 'London', lat: 51.5074, lng: -0.1278, color: '#6366f1' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, color: '#06b6d4' },
];

const FLIGHT_PATHS = [
  { from: CITIES[0], to: CITIES[1] }, // Dhanbad -> Kolkata
  { from: CITIES[1], to: CITIES[2] }, // Kolkata -> Dubai
  { from: CITIES[2], to: CITIES[4] }, // Dubai -> Paris
  { from: CITIES[2], to: CITIES[3] }, // Dubai -> Tokyo
  { from: CITIES[4], to: CITIES[5] }, // Paris -> New York
];

export const Globe3D: React.FC<{ size?: number; interactive?: boolean }> = ({ size = 380, interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState({ x: 0.2, y: -1.2 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina display scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const radius = size * 0.40;
    const centerX = size / 2;
    const centerY = size / 2;

    let rotY = rotation.y;
    let rotX = rotation.x;
    let pulseT = 0;

    // Helper: Lat/Lng to 3D Cartesian
    const latLngTo3D = (lat: number, lng: number, r: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return {
        x: -(r * Math.sin(phi) * Math.cos(theta)),
        y: r * Math.cos(phi),
        z: r * Math.sin(phi) * Math.sin(theta),
      };
    };

    // Helper: Rotate 3D point
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
        rotY += 0.004; // Smooth automatic slow spin
      }
      pulseT = (pulseT + 0.015) % 1;

      ctx.clearRect(0, 0, size, size);

      // Background atmospheric glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius * 1.3);
      glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
      glowGrad.addColorStop(0.6, 'rgba(99, 102, 241, 0.05)');
      glowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Globe sphere fill
      const sphereGrad = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      sphereGrad.addColorStop(0, '#1e293b');
      sphereGrad.addColorStop(0.7, '#0f172a');
      sphereGrad.addColorStop(1, '#020617');
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Globe edge rim
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Latitude and Longitude rings
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.lineWidth = 0.8;

      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let first = true;
        for (let lng = -180; lng <= 180; lng += 10) {
          const pt3D = latLngTo3D(lat, lng, radius);
          const rPt = rotatePoint(pt3D, rotX, rotY);
          if (rPt.z > 0) {
            const screenX = centerX + rPt.x;
            const screenY = centerY - rPt.y;
            if (first) {
              ctx.moveTo(screenX, screenY);
              first = false;
            } else {
              ctx.lineTo(screenX, screenY);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Draw Flight Arcs
      FLIGHT_PATHS.forEach(path => {
        const p1 = latLngTo3D(path.from.lat, path.from.lng, radius);
        const p2 = latLngTo3D(path.to.lat, path.to.lng, radius);

        ctx.beginPath();
        const steps = 30;
        let visible = false;

        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          // Interpolate with arc height
          const mx = p1.x * (1 - t) + p2.x * t;
          const my = p1.y * (1 - t) + p2.y * t;
          const mz = p1.z * (1 - t) + p2.z * t;
          const len = Math.sqrt(mx * mx + my * my + mz * mz);
          // Elevation peak at mid
          const elevation = Math.sin(t * Math.PI) * (radius * 0.16);
          const factor = (radius + elevation) / len;

          const arcPt = rotatePoint({ x: mx * factor, y: my * factor, z: mz * factor }, rotX, rotY);

          if (arcPt.z > 0) {
            visible = true;
            const sx = centerX + arcPt.x;
            const sy = centerY - arcPt.y;
            if (i === 0 || !visible) {
              ctx.moveTo(sx, sy);
            } else {
              ctx.lineTo(sx, sy);
            }
          }
        }

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 1.4;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Pulse dot traveling along Dhanbad -> Dubai route
        if (path.from.name.includes('Dhanbad') || path.from.name.includes('Kolkata')) {
          const t = (pulseT + (path.from.name.includes('Kolkata') ? 0.3 : 0)) % 1;
          const mx = p1.x * (1 - t) + p2.x * t;
          const my = p1.y * (1 - t) + p2.y * t;
          const mz = p1.z * (1 - t) + p2.z * t;
          const len = Math.sqrt(mx * mx + my * my + mz * mz);
          const elevation = Math.sin(t * Math.PI) * (radius * 0.16);
          const factor = (radius + elevation) / len;
          const pulsePt = rotatePoint({ x: mx * factor, y: my * factor, z: mz * factor }, rotX, rotY);

          if (pulsePt.z > 0) {
            const px = centerX + pulsePt.x;
            const py = centerY - pulsePt.y;
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(px, py, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Glow around traveler packet
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(px, py, 6, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      });

      // Draw City Pins
      CITIES.forEach(city => {
        const pt = latLngTo3D(city.lat, city.lng, radius);
        const rPt = rotatePoint(pt, rotX, rotY);

        if (rPt.z > 0) {
          const sx = centerX + rPt.x;
          const sy = centerY - rPt.y;

          // Pulsing ping for primary locations
          if (city.isPrimary) {
            ctx.strokeStyle = city.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(sx, sy, 5 + Math.sin(pulseT * Math.PI * 2) * 3, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Pin marker
          ctx.fillStyle = city.color;
          ctx.beginPath();
          ctx.arc(sx, sy, city.isPrimary ? 4.5 : 3, 0, Math.PI * 2);
          ctx.fill();

          // City Label
          ctx.font = city.isPrimary ? 'bold 11px system-ui' : '9px system-ui';
          ctx.fillStyle = city.isPrimary ? '#ffffff' : 'rgba(226, 232, 240, 0.75)';
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 4;
          ctx.fillText(city.name, sx + 8, sy + 3);
          ctx.shadowBlur = 0;
        }
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [size, isDragging, rotation]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setRotation(prev => ({
      x: Math.max(-0.9, Math.min(0.9, prev.x + dy * 0.008)),
      y: prev.y + dx * 0.008,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className={`rounded-full shadow-2xl transition-transform ${interactive ? 'cursor-grab active:cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      {interactive && (
        <span className="mt-2 text-xs text-slate-400 font-medium flex items-center gap-1.5 opacity-80">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block"></span>
          Drag to spin 3D globe • Active route: Dhanbad ➔ Dubai
        </span>
      )}
    </div>
  );
};
