import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { formatCurrency } from '../../data/travelData';
import { 
  Ticket, 
  Plane, 
  Building2, 
  QrCode, 
  Download, 
  ShieldCheck, 
  Calendar, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

export const Screen15_Wallet: React.FC = () => {
  const { bookingHistory, currency, activeTrip, setCurrentScreen } = useTravel();

  const [activeTab, setActiveTab] = useState<'trips' | 'wallet'>('trips');
  const [tripFilter, setTripFilter] = useState<'upcoming' | 'completed' | 'saved'>('upcoming');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 select-none animate-page-enter">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ai-purple/10 text-ai-purple text-xs font-bold border border-ai-purple/20">
          <Ticket className="w-3.5 h-3.5" />
          <span>Screen 15 • My Trips & Travel Wallet</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-midnight-navy dark:text-white">
          Trips & Digital Travel Wallet
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Centralized storage for boardings passes, hotel vouchers, travel insurance, and saved itineraries.
        </p>

        {/* Tab switcher */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 gap-1 mt-4">
          <button
            onClick={() => setActiveTab('trips')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'trips'
                ? 'bg-ai-purple text-white shadow-md shadow-purple-500/20'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            My Trips
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'wallet'
                ? 'bg-ai-purple text-white shadow-md shadow-purple-500/20'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Travel Wallet & E-Tickets
          </button>
        </div>
      </div>

      {activeTab === 'trips' ? (
        <div className="space-y-6">
          {/* Trip Filters */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
            {['upcoming', 'completed', 'saved'].map(t => (
              <button
                key={t}
                onClick={() => setTripFilter(t as any)}
                className={`px-4 py-1.5 rounded-lg capitalize transition ${
                  tripFilter === t
                    ? 'bg-purple-500/10 text-ai-purple'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t} Trips
              </button>
            ))}
          </div>

          {/* Trip Card */}
          <div className="theme-card p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 uppercase tracking-wider">
                  Confirmed Upcoming Trip
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-midnight-navy dark:text-white mt-1">
                  {activeTrip.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeTrip.origin} ➔ {activeTrip.destination} ({activeTrip.durationDays} Days)
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Price</span>
                <div className="text-2xl font-black text-ai-purple">
                  {formatCurrency(activeTrip.budgetBreakdown.totalINR, currency)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Departure Flight</span>
                <div className="font-bold text-midnight-navy dark:text-white">Emirates EK 571 (CCU-DXB)</div>
                <div className="text-[11px] text-slate-500">15 Nov • 08:45 AM</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Accommodation</span>
                <div className="font-bold text-midnight-navy dark:text-white">Rove Downtown (9 Nights)</div>
                <div className="text-[11px] text-emerald-500 font-semibold">Free Breakfast Included</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Visa Status</span>
                <div className="font-bold text-cyan-600 dark:text-cyan-400">30-Day UAE Tourist eVisa</div>
                <div className="text-[11px] text-slate-500">Documents verified</div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setCurrentScreen('11-itinerary')}
                className="btn-primary-gradient px-6 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-purple-500/20"
              >
                Open Master Itinerary
              </button>

              <button
                onClick={() => alert('Downloading complete travel dossier PDF for Dubai trip...')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                <Download className="w-4 h-4 text-ai-purple" />
                <span>Export Dossier (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Travel Wallet */
        <div className="space-y-4 stagger-children">
          {bookingHistory.map(b => (
            <div key={b.bookingId} className="theme-card p-6 rounded-3xl space-y-4 card-lift gradient-border hover:shadow-purple-500/10 transition-all duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">PNR Reference</span>
                  <div className="font-black text-ai-purple text-base font-mono">{b.pnr}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-500 font-bold uppercase">● {b.status}</span>
                  <div className="font-extrabold text-midnight-navy dark:text-white">{formatCurrency(b.totalPaidINR, currency)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Carrier</span>
                  <span className="font-bold text-midnight-navy dark:text-white">Emirates EK 571</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Dates</span>
                  <span className="font-bold text-midnight-navy dark:text-white">15 Nov – 24 Nov</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Seat</span>
                  <span className="font-bold text-midnight-navy dark:text-white">14A (Window)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Baggage</span>
                  <span className="font-bold text-midnight-navy dark:text-white">30 kg Check-in</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <QrCode className="w-7 h-7 text-midnight-navy dark:text-white" />
                  <span>DXB E-Gate Boarding Pass</span>
                </div>

                <button
                  onClick={() => alert('Downloading official E-Ticket & Boarding pass PDF...')}
                  className="btn-primary-gradient px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download E-Ticket</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
