import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { CURRENCIES, formatCurrency } from '../../data/travelData';
import { Currency } from '../../types';
import { 
  Coins, 
  TrendingUp, 
  AlertCircle, 
  Plane, 
  Building2, 
  Utensils, 
  Train, 
  Ticket, 
  ShoppingBag, 
  ShieldAlert, 
  ArrowRight, 
  RefreshCw 
} from 'lucide-react';

export const Screen12_Budget: React.FC = () => {
  const { activeTrip, currency, setCurrency } = useTravel();

  const totalEstINR = activeTrip.budgetBreakdown.totalINR; // 97,000 INR
  const spentINR = activeTrip.budgetBreakdown.flightsINR + activeTrip.budgetBreakdown.hotelINR; // 73,000 INR
  const remainingINR = Math.max(0, totalEstINR - spentINR); // 24,000 INR
  const dailyLimitINR = Math.round(remainingINR / 10); // 2,400 INR/day

  const [convertAmount, setConvertAmount] = useState<number>(10000);
  const [targetCurrency, setTargetCurrency] = useState<Currency>('AED');

  const categories = [
    { name: 'Flights (Round-trip CCU ➔ DXB)', budgeted: activeTrip.budgetBreakdown.flightsINR, spent: activeTrip.budgetBreakdown.flightsINR, icon: <Plane className="w-4 h-4 text-sky-500" /> },
    { name: 'Hotels (9 Nights Rove Downtown)', budgeted: activeTrip.budgetBreakdown.hotelINR, spent: activeTrip.budgetBreakdown.hotelINR, icon: <Building2 className="w-4 h-4 text-teal-500" /> },
    { name: 'Activities & Attractions', budgeted: activeTrip.budgetBreakdown.activitiesINR, spent: 4200, icon: <Ticket className="w-4 h-4 text-ai-purple" /> },
    { name: 'Food & Gourmet Dining', budgeted: activeTrip.budgetBreakdown.foodINR, spent: 2800, icon: <Utensils className="w-4 h-4 text-emerald-500" /> },
    { name: 'Local Transit (Dubai Metro Nol & Cabs)', budgeted: activeTrip.budgetBreakdown.localTransportINR, spent: 1200, icon: <Train className="w-4 h-4 text-amber-500" /> },
    { name: 'Shopping & Souvenirs', budgeted: 5000, spent: 0, icon: <ShoppingBag className="w-4 h-4 text-pink-500" /> },
    { name: 'Emergency Fund Buffer', budgeted: activeTrip.budgetBreakdown.emergencyBufferINR, spent: 0, icon: <ShieldAlert className="w-4 h-4 text-rose-500" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 select-none animate-page-enter">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
          <Coins className="w-3.5 h-3.5" />
          <span>Screen 12 • Budget & Expense Manager</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-midnight-navy dark:text-white">
          Trip Expense & Currency Controller
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Managed by Budget Agent: Real-time spend tracking, daily limits, and dynamic FX conversions.
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="theme-card card-lift p-6 rounded-3xl space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Estimated Budget</span>
          <div className="text-3xl font-black text-midnight-navy dark:text-white">
            {formatCurrency(totalEstINR, currency)}
          </div>
          <p className="text-[11px] text-slate-500">10-Day Dubai Master Budget</p>
        </div>

        <div className="theme-card card-lift p-6 rounded-3xl space-y-2 border-l-4 border-l-emerald-500">
          <span className="text-xs font-bold text-slate-400 uppercase">Pre-Booked & Committed</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(spentINR, currency)}
          </div>
          <p className="text-[11px] text-emerald-500 font-semibold">Flights + 9 Nights Hotel Paid</p>
        </div>

        <div className="theme-card card-lift p-6 rounded-3xl space-y-2 border-l-4 border-l-ai-purple">
          <span className="text-xs font-bold text-slate-400 uppercase">Daily Allowance Limit</span>
          <div className="text-3xl font-black text-ai-purple">
            {formatCurrency(dailyLimitINR, currency)} / day
          </div>
          <p className="text-[11px] text-purple-400 font-semibold">Available for food, taxis & activities</p>
        </div>
      </div>

      {/* Categories Breakdown Table & Converter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Category list */}
        <div className="lg:col-span-8 theme-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-sm font-extrabold text-midnight-navy dark:text-white">
              Budget Categories & Real-time Spent
            </h2>
            <span className="text-xs text-slate-400 font-semibold">7 Categories</span>
          </div>

          <div className="space-y-3">
            {categories.map(cat => {
              const pct = Math.min(100, Math.round((cat.spent / cat.budgeted) * 100));
              return (
                <div key={cat.name} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-midnight-navy dark:text-white">
                    <span className="flex items-center gap-2">
                      {cat.icon}
                      <span>{cat.name}</span>
                    </span>
                    <span>
                      {formatCurrency(cat.spent, currency)} / {formatCurrency(cat.budgeted, currency)}
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct > 90 ? 'bg-rose-500' : pct > 50 ? 'bg-ai-purple' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Currency Converter Widget */}
        <div className="lg:col-span-4 theme-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-midnight-navy dark:text-white">
            <RefreshCw className="w-4 h-4 text-ai-purple" />
            <span>Currency Converter (Live Forex)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Amount in INR (₹)</label>
              <input
                type="number"
                value={convertAmount}
                onChange={e => setConvertAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-midnight-navy dark:text-white font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Target Currency</label>
              <select
                value={targetCurrency}
                onChange={e => setTargetCurrency(e.target.value as Currency)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-midnight-navy dark:text-white font-bold focus:outline-none"
              >
                <option value="AED">AED (UAE Dirham)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="GBP">GBP (British Pound)</option>
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Converted Total</span>
              <div className="text-2xl font-black text-ai-purple">
                {CURRENCIES[targetCurrency]?.symbol}
                {Math.round(convertAmount * (CURRENCIES[targetCurrency]?.rateAgainstINR || 1)).toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-500">1 AED ≈ ₹23.8 INR</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
