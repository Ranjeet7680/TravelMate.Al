import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  Coins, 
  ArrowRight, 
  Check, 
  Compass, 
  Loader2 
} from 'lucide-react';

export const Screen07_TripPlannerWizard: React.FC = () => {
  const { setCurrentScreen, sendUserPrompt } = useTravel();

  const [origin, setOrigin] = useState('Dhanbad (via CCU / IXR)');
  const [destination, setDestination] = useState('Dubai, UAE');
  const [duration, setDuration] = useState('10 Days');
  const [travellers, setTravellers] = useState('1 Solo');
  const [travelType, setTravelType] = useState('Leisure & Sightseeing');
  const [budgetTier, setBudgetTier] = useState('Standard Comfort');
  const [interests, setInterests] = useState<string[]>(['Desert Safari', 'Burj Khalifa', 'Luxury Shopping']);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentScreen('11-itinerary');
      sendUserPrompt(`Generate a ${duration} trip from ${origin} to ${destination} for ${travellers}`);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 select-none animate-page-enter">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-ai-purple text-xs font-bold border border-purple-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Screen 07 • AI Trip Planning Wizard</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-midnight-navy dark:text-white">
          Create Your Autonomous Itinerary
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Tell TravelMate AI your travel parameters and let the 11-agent swarm assemble your custom plan.
        </p>
      </div>

      <div className="theme-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">
              Departure Location
            </label>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <MapPin className="w-4 h-4 text-rose-500" />
              <input
                type="text"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                className="bg-transparent w-full focus:outline-none text-midnight-navy dark:text-white font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">
              Destination City
            </label>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <MapPin className="w-4 h-4 text-ai-purple" />
              <input
                type="text"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className="bg-transparent w-full focus:outline-none text-midnight-navy dark:text-white font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">
              Duration
            </label>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <Calendar className="w-4 h-4 text-amber-500" />
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="bg-transparent w-full focus:outline-none text-midnight-navy dark:text-white font-semibold"
              >
                <option value="5 Days">5 Days (Express)</option>
                <option value="7 Days">7 Days (Week Getaway)</option>
                <option value="10 Days">10 Days (Grand Experience)</option>
                <option value="14 Days">14 Days (Immersion)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">
              Travellers
            </label>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <Users className="w-4 h-4 text-emerald-500" />
              <select
                value={travellers}
                onChange={e => setTravellers(e.target.value)}
                className="bg-transparent w-full focus:outline-none text-midnight-navy dark:text-white font-semibold"
              >
                <option value="1 Solo">1 Solo Explorer</option>
                <option value="2 Adults (Couple)">2 Adults (Couple / Friends)</option>
                <option value="Family with Kids">Family with Kids</option>
              </select>
            </div>
          </div>
        </div>

        {/* Travel Style Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
            Trip Focus & Pace
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['Leisure & Sightseeing', 'Adventure & Dunes', 'Cultural Heritage', 'Romantic Getaway'].map(style => (
              <button
                key={style}
                type="button"
                onClick={() => setTravelType(style)}
                className={`p-3 rounded-xl border text-xs font-bold transition ${
                  travelType === style
                    ? 'border-ai-purple bg-purple-500/10 text-ai-purple ring-2 ring-purple-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Generate CTA */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <button
            onClick={() => setCurrentScreen('05-dashboard')}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-primary-gradient px-8 py-3 rounded-2xl font-black text-xs shadow-xl shadow-purple-500/25 flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Assembling 10-Day Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate AI Itinerary</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
