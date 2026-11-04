import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { DUBAI_HOTEL_OPTIONS, formatCurrency } from '../../data/travelData';
import { HotelOption } from '../../types';
import { 
  Building2, 
  Star, 
  MapPin, 
  Filter, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Wifi, 
  Coffee 
} from 'lucide-react';

export const Screen09_HotelSearch: React.FC = () => {
  const { currency, setActiveTrip, setBookingModalOpen } = useTravel();

  const [minRating, setMinRating] = useState<number>(4.0);
  const [filterPool, setFilterPool] = useState<boolean>(false);
  const [filterBreakfast, setFilterBreakfast] = useState<boolean>(false);

  const filteredHotels = DUBAI_HOTEL_OPTIONS.filter(ht => {
    if (ht.rating < minRating) return false;
    if (filterPool && !ht.amenities.some(a => a.toLowerCase().includes('pool'))) return false;
    if (filterBreakfast && !ht.breakfastIncluded) return false;
    return true;
  });

  const handleSelectHotel = (ht: HotelOption) => {
    setActiveTrip(prev => ({
      ...prev,
      selectedHotel: ht,
    }));
    setBookingModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 select-none animate-page-enter">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold border border-teal-500/20">
          <Building2 className="w-3.5 h-3.5" />
          <span>Screen 09 • Hotel Search & Stays</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-midnight-navy dark:text-white">
          Verified Stays in Dubai
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Curated by Hotel Agent: Luxury suites to high-value boutique hotels near Burj Khalifa & Marina.
        </p>
      </div>

      {/* Filters */}
      <div className="theme-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-teal-500" />
            <span>Filters:</span>
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Min Rating:</span>
            <select
              value={minRating}
              onChange={e => setMinRating(Number(e.target.value))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-midnight-navy dark:text-white focus:outline-none"
            >
              <option value={4.0}>4.0★ & above</option>
              <option value={4.5}>4.5★ & above</option>
              <option value={4.8}>4.8★ Luxury Elite</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={filterPool}
              onChange={e => setFilterPool(e.target.checked)}
              className="rounded text-teal-500 focus:ring-teal-500"
            />
            <span>Swimming Pool</span>
          </label>

          <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={filterBreakfast}
              onChange={e => setFilterBreakfast(e.target.checked)}
              className="rounded text-teal-500 focus:ring-teal-500"
            />
            <span>Free Breakfast Included</span>
          </label>
        </div>

        <span className="text-xs text-slate-400 font-semibold">
          Showing <strong className="text-midnight-navy dark:text-white">{filteredHotels.length}</strong> top properties
        </span>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
        {filteredHotels.map((ht, idx) => (
          <div
            key={ht.id}
            className="theme-card card-lift rounded-3xl overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-56 overflow-hidden">
                <img
                  src={ht.imageUrl}
                  alt={ht.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{ht.rating}</span>
                  <span className="text-slate-400 font-normal">({ht.reviewCount} reviews)</span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {idx === 0 && (
                    <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                      ⭐ Top Pick
                    </span>
                  )}
                  <span className="bg-teal-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                    {ht.stars}★ Luxury
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-midnight-navy dark:text-white">
                    {ht.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{ht.location} • {ht.distanceToCenter}</span>
                  </p>
                </div>

                <div className="text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Selected Room</span>
                  <span className="font-bold text-ai-purple">{ht.roomType}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ht.amenities.map(a => (
                    <span
                      key={a}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Price per night</div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(ht.pricePerNightINR, currency)}
                </div>
                {ht.breakfastIncluded && (
                  <span className="text-[10px] text-emerald-500 font-semibold block">✓ Free Breakfast Included</span>
                )}
              </div>

              <button
                onClick={() => handleSelectHotel(ht)}
                className="btn-primary-gradient px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5"
              >
                <span>Select Stay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
