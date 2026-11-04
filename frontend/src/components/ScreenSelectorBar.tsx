import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { ScreenType } from '../types';
import { ChevronDown, ChevronUp, Layers, Sparkles } from 'lucide-react';

export const ScreenSelectorBar: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useTravel();
  const [isExpanded, setIsExpanded] = useState(true);

  const screens: { id: ScreenType; num: string; label: string }[] = [
    { id: '01-welcome', num: '01', label: 'Splash' },
    { id: '02-onboarding', num: '02', label: 'Onboarding' },
    { id: '03-landing', num: '03', label: 'Landing' },
    { id: '04-login', num: '04', label: 'Login' },
    { id: '05-dashboard', num: '05', label: 'Dashboard' },
    { id: '06-copilot', num: '06', label: 'Copilot' },
    { id: '07-planner', num: '07', label: 'Trip Wizard' },
    { id: '08-flights', num: '08', label: 'Flights' },
    { id: '09-hotels', num: '09', label: 'Hotels' },
    { id: '10-destinations', num: '10', label: 'Destinations' },
    { id: '11-itinerary', num: '11', label: 'Dubai Itinerary' },
    { id: '12-budget', num: '12', label: 'Budget' },
    { id: '13-visa', num: '13', label: 'Visa' },
    { id: '14-payment', num: '14', label: 'Payment' },
    { id: '15-wallet', num: '15', label: 'Wallet' },
    { id: '16-voice', num: '16', label: 'Voice AI' },
    { id: '17-profile', num: '17', label: 'Profile' },
    { id: '18-admin', num: '18', label: 'Admin' },
  ];

  return (
    <div className="sticky top-0 z-50 w-full bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-700/60 shadow-lg text-white select-none">
      <div className="max-w-7xl mx-auto px-3 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-ai-purple font-extrabold text-[11px] uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-ai-purple" />
            <span className="hidden sm:inline">All 18 Screens Navigator:</span>
          </div>
          <span className="text-[11px] font-bold text-sky-400 bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-500/30">
            {screens.find(s => s.id === currentScreen)?.num} • {screens.find(s => s.id === currentScreen)?.label}
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
        >
          <span>{isExpanded ? 'Hide Pills' : 'Show All 18 Screens'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="max-w-7xl mx-auto px-3 pb-2 pt-0.5 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          {screens.map(s => {
            const isActive = currentScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentScreen(s.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition flex items-center gap-1 ${
                  isActive
                    ? 'bg-ai-purple text-white shadow-md shadow-purple-500/30 ring-1 ring-purple-300'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <span className="opacity-70">{s.num}</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
