import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Compass, 
  Coins, 
  Heart, 
  Plane, 
  Building2, 
  Utensils, 
  MapPin, 
  Globe 
} from 'lucide-react';

export const Screen02_Onboarding: React.FC = () => {
  const { userProfile, setUserProfile, setCurrentScreen } = useTravel();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Interests
  const allInterests = [
    { id: 'Adventure', icon: '🧗', desc: 'Dune bashing, hiking, adrenaline' },
    { id: 'Luxury', icon: '✨', desc: '5-star suites, private yachts, VIP service' },
    { id: 'Nature', icon: '🌿', desc: 'Oasis, national parks, wildlife' },
    { id: 'Beach', icon: '🏖️', desc: 'Turquoise waters, coastal relaxation' },
    { id: 'Business', icon: '💼', desc: 'Executive travel, high-speed connectivity' },
    { id: 'Cultural', icon: '🏛️', desc: 'Museums, historic districts, souks' },
    { id: 'Family', icon: '👨‍👩‍👧', desc: 'Theme parks, kid-friendly resorts' },
    { id: 'Solo travel', icon: '🎒', desc: 'Flexibility, meeting locals & nomads' },
  ];
  const [selectedInterests, setSelectedInterests] = useState<string[]>(userProfile.interests || ['Adventure', 'Luxury', 'Beach']);

  // Step 2: Budget
  const [budgetTier, setBudgetTier] = useState<string>(userProfile.budgetPreference || 'standard');

  // Step 3: Preferences
  const [airline, setAirline] = useState<string>(userProfile.loyaltyPrograms?.airline || 'Emirates');
  const [accomType, setAccomType] = useState<string>('Hotel & Resort');
  const [dietary, setDietary] = useState<string>(userProfile.dietaryPreference || 'vegetarian');
  const [departureCity, setDepartureCity] = useState<string>(userProfile.departureCity || 'Dhanbad (via CCU / IXR)');

  const toggleInterest = (name: string) => {
    setSelectedInterests(prev => 
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    );
  };

  const handleComplete = () => {
    setUserProfile(prev => ({
      ...prev,
      interests: selectedInterests,
      budgetPreference: budgetTier as any,
      dietaryPreference: dietary as any,
      departureCity: departureCity,
      loyaltyPrograms: {
        ...prev.loyaltyPrograms,
        airline,
      }
    }));
    setCurrentScreen('05-dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 select-none animate-page-enter">
      {/* Header and Step Indicator */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-ai-purple text-xs font-bold border border-purple-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Screen 02 • Onboarding & Travel Preferences</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-midnight-navy dark:text-white">
          Let’s Personalize Your Travel Experience
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Your AI Copilot will tailor flights, itineraries, and stays specifically to your style.
        </p>

        {/* 3 Steps indicator */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {[
            { step: 1, label: 'Interests' },
            { step: 2, label: 'Budget Tier' },
            { step: 3, label: 'Preferences' },
          ].map(s => (
            <div key={s.step} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  currentStep === s.step
                    ? 'bg-ai-purple text-white shadow-lg shadow-purple-500/30'
                    : currentStep > s.step
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {currentStep > s.step ? <Check className="w-3.5 h-3.5" /> : s.step}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${
                currentStep === s.step ? 'text-ai-purple' : 'text-slate-400'
              }`}>
                {s.label}
              </span>
              {s.step < 3 && <div className="w-8 h-0.5 bg-slate-300 dark:bg-slate-800" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="theme-card p-6 sm:p-8 rounded-3xl space-y-6">
        {/* Step 1: Interests */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-midnight-navy dark:text-white">
                  Step 1: What type of journeys excite you?
                </h2>
                <p className="text-xs text-slate-400">Select all that apply to help Destination Agent recommend places.</p>
              </div>
              <span className="text-xs font-bold text-ai-purple bg-purple-500/10 px-2.5 py-1 rounded-full">
                {selectedInterests.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {allInterests.map(item => {
                const isSelected = selectedInterests.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleInterest(item.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-ai-purple bg-purple-500/10 ring-2 ring-purple-500/20 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-2xl">
                      <span>{item.icon}</span>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-ai-purple flex items-center justify-center text-white">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700" />
                      )}
                    </div>
                    <div className="pt-3">
                      <div className="text-xs font-bold text-midnight-navy dark:text-white">{item.id}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="btn-primary-gradient px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
              >
                <span>Continue to Budget</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Budget Preferences */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-midnight-navy dark:text-white">
                Step 2: Choose your typical budget range
              </h2>
              <p className="text-xs text-slate-400">Budget Agent will calibrate flight classes and hotel star ratings.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { id: 'budget', label: 'Budget Smart', range: '₹3,000 - ₹5,000 / day', desc: 'Hostels, 3-star boutique hotels, public transit & street food' },
                { id: 'standard', label: 'Standard Comfort', range: '₹6,000 - ₹12,000 / day', desc: '4-star hotels, direct flights, combo sightseeing passes' },
                { id: 'premium', label: 'Premium Class', range: '₹14,000 - ₹25,000 / day', desc: '5-star luxury stays, premium economy / business flights' },
                { id: 'luxury', label: 'Ultra Luxury Elite', range: '₹30,000+ / day', desc: 'Presidential suites, private helicopter/yacht charters, VIP concierges' },
              ].map(tier => {
                const isSelected = budgetTier === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setBudgetTier(tier.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-ai-purple bg-purple-500/10 ring-2 ring-purple-500/20 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-sm text-midnight-navy dark:text-white">{tier.label}</div>
                      <span className="text-xs font-bold text-ai-purple">{tier.range}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{tier.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="btn-primary-gradient px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
              >
                <span>Continue to Preferences</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Travel Preferences */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-midnight-navy dark:text-white">
                Step 3: Refine your travel preferences
              </h2>
              <p className="text-xs text-slate-400">Diet, departure hub, and accommodation types.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400 block mb-1 font-semibold">
                  Default Departure City / Hub
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <input
                    type="text"
                    value={departureCity}
                    onChange={e => setDepartureCity(e.target.value)}
                    className="bg-transparent flex-1 text-midnight-navy dark:text-white focus:outline-none"
                    placeholder="e.g. Dhanbad / Kolkata CCU"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 block mb-1 font-semibold">
                  Preferred Airline Program
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <Plane className="w-4 h-4 text-sky-500" />
                  <select
                    value={airline}
                    onChange={e => setAirline(e.target.value)}
                    className="bg-transparent flex-1 text-midnight-navy dark:text-white focus:outline-none"
                  >
                    <option value="Emirates">Emirates (Skywards)</option>
                    <option value="IndiGo">IndiGo (6E Rewards)</option>
                    <option value="Air India">Air India (Flying Returns)</option>
                    <option value="Singapore Airlines">Singapore Airlines (KrisFlyer)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 block mb-1 font-semibold">
                  Dietary Preference
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <Utensils className="w-4 h-4 text-emerald-500" />
                  <select
                    value={dietary}
                    onChange={e => setDietary(e.target.value)}
                    className="bg-transparent flex-1 text-midnight-navy dark:text-white focus:outline-none"
                  >
                    <option value="vegetarian">Vegetarian (Pure Veg options)</option>
                    <option value="vegan">Vegan</option>
                    <option value="halal">Halal certified</option>
                    <option value="jain">Jain Pure Veg</option>
                    <option value="any">No restrictions</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 block mb-1 font-semibold">
                  Accommodation Style
                </label>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <Building2 className="w-4 h-4 text-indigo-500" />
                  <select
                    value={accomType}
                    onChange={e => setAccomType(e.target.value)}
                    className="bg-transparent flex-1 text-midnight-navy dark:text-white focus:outline-none"
                  >
                    <option value="Hotel & Resort">Boutique & 4-5 Star Hotels</option>
                    <option value="Luxury Villa">Private Luxury Villas</option>
                    <option value="Apartment">Serviced Apartments with Kitchen</option>
                    <option value="Hostel">Modern Social Hostels</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                className="btn-primary-gradient px-8 py-3 rounded-2xl font-black text-xs shadow-xl shadow-purple-500/30 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Personalize My Travel Experience</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
