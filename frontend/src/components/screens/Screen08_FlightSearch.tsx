import React, { useState, useEffect } from 'react';
import { useTravel } from '../../context/TravelContext';
import { DUBAI_FLIGHT_OPTIONS, formatCurrency } from '../../data/travelData';
import { FlightOption } from '../../types';
import { 
  Plane, 
  Filter, 
  Luggage, 
  Clock, 
  Check, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Calendar 
} from 'lucide-react';

export const Screen08_FlightSearch: React.FC = () => {
  const { currency, setActiveTrip, setBookingModalOpen, setCurrentScreen } = useTravel();

  const [selectedAirline, setSelectedAirline] = useState<string>('all');
  const [maxStops, setMaxStops] = useState<number | 'all'>('all');
  const [cabinClass, setCabinClass] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredFlights = DUBAI_FLIGHT_OPTIONS.filter(fl => {
    if (selectedAirline !== 'all' && fl.airline !== selectedAirline) return false;
    if (maxStops !== 'all' && fl.stops > maxStops) return false;
    if (cabinClass !== 'all' && fl.cabinClass !== cabinClass) return false;
    return true;
  });

  // Find cheapest flight id (Emirates EK 571 or whichever has lowest priceINR)
  const cheapestFlight = DUBAI_FLIGHT_OPTIONS.reduce((prev, curr) =>
    curr.priceINR < prev.priceINR ? curr : prev
  );

  const handleSelectFlight = (fl: FlightOption) => {
    setActiveTrip(prev => ({
      ...prev,
      selectedFlight: fl,
    }));
    setBookingModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 select-none animate-page-enter">
      <div className="text-center space-y-2">
        {/* Animated plane icon sliding left to right */}
        <div className="flex justify-center mb-2 overflow-hidden">
          <svg
            className="w-10 h-10 text-ai-purple animate-slide-in-left"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-500 text-xs font-bold border border-sky-500/20">
          <Plane className="w-3.5 h-3.5" />
          <span>Screen 08 • Flight Search &amp; Live Booking</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-midnight-navy dark:text-white">
          Compare &amp; Book Flights
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Scanned via Amadeus GDS: Dhanbad (via CCU/IXR) to Dubai International (DXB).
        </p>
      </div>

      {/* Filter Ribbon */}
      <div className="theme-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-sky-500" />
            <span>Filters:</span>
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Airline:</span>
            <select
              value={selectedAirline}
              onChange={e => setSelectedAirline(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-midnight-navy dark:text-white focus:outline-none"
            >
              <option value="all">All Airlines</option>
              <option value="Emirates">Emirates</option>
              <option value="IndiGo Airlines">IndiGo</option>
              <option value="flydubai">flydubai</option>
              <option value="Air India">Air India</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Stops:</span>
            <select
              value={maxStops}
              onChange={e => setMaxStops(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-midnight-navy dark:text-white focus:outline-none"
            >
              <option value="all">Any Stops</option>
              <option value="0">Direct Non-Stop Only</option>
              <option value="1">Max 1 Stop</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-semibold">
          Showing <strong className="text-midnight-navy dark:text-white">{filteredFlights.length}</strong> available flights
        </span>
      </div>

      {/* Flight Cards List */}
      {isLoading ? (
        /* Skeleton loading state — 3 placeholder cards */
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="theme-card p-6 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <div className="skeleton h-6 w-24 rounded-lg" />
                  <div className="skeleton h-5 w-32 rounded-lg" />
                  <div className="skeleton h-5 w-16 rounded-md" />
                </div>
                <div className="flex items-center gap-12">
                  <div className="space-y-1">
                    <div className="skeleton h-7 w-14 rounded" />
                    <div className="skeleton h-4 w-10 rounded" />
                    <div className="skeleton h-3 w-24 rounded" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="skeleton h-3 w-16 rounded" />
                    <div className="skeleton h-0.5 w-32 rounded" />
                    <div className="skeleton h-3 w-20 rounded" />
                  </div>
                  <div className="space-y-1">
                    <div className="skeleton h-7 w-14 rounded" />
                    <div className="skeleton h-4 w-10 rounded" />
                    <div className="skeleton h-3 w-24 rounded" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="skeleton h-3 w-28 rounded" />
                  <div className="skeleton h-3 w-36 rounded" />
                </div>
              </div>
              <div className="lg:pl-8 flex lg:flex-col items-center lg:items-end justify-between gap-4">
                <div className="space-y-1">
                  <div className="skeleton h-3 w-20 rounded" />
                  <div className="skeleton h-8 w-28 rounded" />
                  <div className="skeleton h-3 w-24 rounded" />
                </div>
                <div className="skeleton h-9 w-28 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Actual flight cards */
        <div className="space-y-4 stagger-children">
          {filteredFlights.map(fl => {
            const isCheapest = fl.id === cheapestFlight.id;
            return (
              <div
                key={fl.id}
                className={`theme-card card-lift p-6 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative ${isCheapest ? 'glow-purple' : ''}`}
              >
                {/* Best Deal badge on cheapest flight */}
                {isCheapest && (
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-extrabold text-white bg-gradient-to-r from-amber-400 to-orange-500 shadow-md shadow-amber-400/30 z-10">
                    🏷️ Best Deal
                  </span>
                )}

                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 font-extrabold text-xs">
                      {fl.airlineCode} • {fl.flightNumber}
                    </span>
                    <span className="font-extrabold text-midnight-navy dark:text-white text-sm">
                      {fl.airline}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {fl.cabinClass}
                    </span>
                  </div>

                  {/* Timing & Routing */}
                  <div className="flex items-center gap-6 sm:gap-12 text-xs">
                    <div>
                      <div className="text-xl font-black text-midnight-navy dark:text-white">{fl.departureTime}</div>
                      <div className="font-bold text-slate-600 dark:text-slate-300">{fl.origin.code}</div>
                      <div className="text-[11px] text-slate-400">{fl.origin.city} ({fl.origin.terminal})</div>
                    </div>

                    <div className="text-center px-2">
                      <div className="text-[11px] text-slate-400 font-semibold">{fl.duration}</div>
                      <div className="w-24 sm:w-36 h-0.5 bg-slate-300 dark:bg-slate-700 my-1 relative">
                        <div className="w-2 h-2 rounded-full bg-sky-500 absolute left-1/2 -top-0.5 -translate-x-1/2" />
                      </div>
                      <div className={`text-[10px] font-bold ${fl.stops === 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {fl.stops === 0 ? 'Non-Stop Direct' : `${fl.stops} Stop (${fl.stopCity})`}
                      </div>
                    </div>

                    <div>
                      <div className="text-xl font-black text-midnight-navy dark:text-white">{fl.arrivalTime}</div>
                      <div className="font-bold text-slate-600 dark:text-slate-300">{fl.destination.code}</div>
                      <div className="text-[11px] text-slate-400">{fl.destination.city} ({fl.destination.terminal})</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Luggage className="w-3.5 h-3.5" />
                      <span>{fl.baggage}</span>
                    </span>
                    <span className="text-emerald-500 font-semibold">
                      {fl.refundable ? '✓ Free Cancellation & Refundable' : 'Standard Non-refundable'}
                    </span>
                    <span>CO2: ~{fl.carbonEmissionsKg} kg</span>
                  </div>
                </div>

                {/* Price & Booking Button */}
                <div className="lg:border-l lg:border-slate-200 dark:lg:border-slate-800 lg:pl-8 flex lg:flex-col items-center lg:items-end justify-between gap-4">
                  <div className="text-left lg:text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Roundtrip Total</div>
                    <div className="text-2xl font-black text-ai-purple">
                      {formatCurrency(fl.priceINR, currency)}
                    </div>
                    <div className="text-[10px] text-slate-400">All taxes &amp; fuel included</div>
                  </div>

                  <button
                    onClick={() => handleSelectFlight(fl)}
                    className="btn-primary-gradient px-6 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5"
                  >
                    <span>Select &amp; Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
