import React, { useState, useEffect, useRef } from 'react';
import { useTravel } from '../../context/TravelContext';
import { SUPPORTED_LANGUAGES } from '../../data/travelData';
import { LanguageCode } from '../../types';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  ShieldAlert, 
  PhoneCall, 
  Globe2, 
  Sparkles, 
  HeartPulse, 
  Building2, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const Screen16_Voice: React.FC = () => {
  const { language, setLanguage, isSpeaking, speakText, stopSpeaking, sendUserPrompt, setCurrentScreen } = useTravel();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('Mujhe Dubai ke liye 10 din ka trip plan karna hai.');
  const [aiResponse, setAiResponse] = useState('Bilkul! Main aapke liye Dubai ka 10-day itinerary aur estimated budget prepare karta hoon.');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      rec.onstart = () => setIsListening(true);
      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        handleVoiceQuery(text);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);

      recognitionRef.current = rec;
    }
  }, [language]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is supported in Google Chrome, Edge, and Safari.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
    }
  };

  const handleVoiceQuery = (query: string) => {
    const qLower = query.toLowerCase();
    if (qLower.includes('dubai') || qLower.includes('dhanbad') || qLower.includes('10')) {
      const resp = 'Bilkul! Main aapke liye Dubai ka 10-day itinerary aur estimated budget prepare karta hoon. Flight starting at ₹32,500 and hotels at ₹4,500.';
      setAiResponse(resp);
      speakText(resp);
    } else {
      const resp = `Aapke request ke mutabiq TravelMate AI ne analysis complete kar liya hai. Full details ready hain!`;
      setAiResponse(resp);
      speakText(resp);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 select-none animate-page-enter">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 text-xs font-bold border border-fuchsia-500/20">
          <Mic className="w-3.5 h-3.5" />
          <span>Screen 16 • Multilingual Voice Assistant & 24/7 Emergency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-midnight-navy dark:text-white">
          Hands-Free Voice Travel Copilot
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Speak naturally in Hindi, English, Bengali, Tamil, Arabic or Spanish with live audio speech synthesis.
        </p>

        {/* Language selector */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <Globe2 className="w-4 h-4 text-ai-purple" />
          <select
            value={language}
            onChange={e => setLanguage(e.target.value as LanguageCode)}
            className="p-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-midnight-navy dark:text-white focus:outline-none"
          >
            {SUPPORTED_LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.native} ({l.label})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Voice Center Card */}
      <div className={`theme-card p-8 rounded-3xl text-center space-y-6 shadow-xl border border-slate-200 dark:border-slate-800 ${isListening ? 'glow-purple' : ''}`}>
        {/* Animated Waveform Bars */}
        <div className="h-16 flex items-center justify-center gap-1.5">
          {[8, 14, 28, 48, 20, 36, 52, 24, 12, 38, 50, 18, 10].map((h, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-300 ${
                isListening
                  ? 'bg-rose-500 animate-wave-bar'
                  : isSpeaking
                  ? 'bg-ai-purple animate-pulse'
                  : 'bg-slate-300 dark:bg-slate-700'
              }`}
              style={{
                height: isListening ? `${h}px` : isSpeaking ? `${h * 0.7}px` : '8px',
                animationDelay: `${i * 0.08}s`
              }}
            />
          ))}
        </div>

        {/* Giant Microphone Trigger Button */}
        <div className="flex justify-center">
          <button
            onClick={toggleMic}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
              isListening
                ? 'bg-rose-500 text-white animate-bounce shadow-rose-500/40 ring-8 ring-rose-500/20 pulse-ring'
                : 'btn-primary-gradient text-white hover:scale-105 active:scale-95 shadow-purple-500/30 ring-8 ring-purple-500/10'
            }`}
          >
            <Mic className="w-10 h-10" />
          </button>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isListening ? 'Listening to your speech...' : 'Tap to Speak with AI'}
          </span>
          <p className="text-xs text-slate-500 mt-0.5">
            Example: "Mujhe Dubai ke liye 10 din ka trip plan karna hai"
          </p>
        </div>

        {/* Transcript & AI Spoken Response Card */}
        <div className="max-w-xl mx-auto space-y-3 text-left">
          {/* User Transcript */}
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
            <span className="text-[10px] font-bold text-ai-purple uppercase tracking-wider block">
              You Spoke (Hindi / Hinglish):
            </span>
            <p className="text-xs font-semibold text-midnight-navy dark:text-white">
              "{transcript}"
            </p>
          </div>

          {/* AI Response */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Copilot Spoken Response:
              </span>
              <button
                onClick={() => speakText(aiResponse)}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-ai-purple"
                title="Play Audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs font-bold text-midnight-navy dark:text-white leading-relaxed">
              {aiResponse}
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('11-itinerary')}
          className="btn-primary-gradient px-6 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-purple-500/20 inline-flex items-center gap-2"
        >
          <span>Open Full Dubai Itinerary</span>
        </button>
      </div>

      {/* 24/7 SOS Emergency Guardian Section */}
      <div className="theme-card p-6 sm:p-8 rounded-3xl space-y-4 border border-rose-200 dark:border-rose-950/60 bg-gradient-to-r from-rose-500/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center font-bold">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-midnight-navy dark:text-white">
              24/7 Emergency Guardian & Hotlines
            </h2>
            <p className="text-xs text-slate-500">One-touch international emergency response</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 stagger-children">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-midnight-navy dark:text-white">Dubai Police SOS</div>
              <div className="text-[10px] text-slate-400">English, Hindi & Arabic</div>
            </div>
            <a href="tel:999" className="px-3 py-1 rounded-lg bg-rose-500 text-white font-bold">
              999
            </a>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-midnight-navy dark:text-white">National Ambulance</div>
              <div className="text-[10px] text-slate-400">Emergency Paramedics</div>
            </div>
            <a href="tel:998" className="px-3 py-1 rounded-lg bg-emerald-500 text-white font-bold">
              998
            </a>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-midnight-navy dark:text-white">Indian Consulate 24/7</div>
              <div className="text-[10px] text-slate-400">Consular Emergency Mobile</div>
            </div>
            <span className="font-bold text-amber-500">+971 50 734 7676</span>
          </div>
        </div>
      </div>
    </div>
  );
};
