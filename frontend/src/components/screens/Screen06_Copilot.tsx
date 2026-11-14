import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTravel } from '../../context/TravelContext';
import { formatCurrency } from '../../data/travelData';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Maximize2, 
  Sparkles, 
  Plane, 
  Building2, 
  CalendarDays, 
  Coins, 
  ShieldCheck, 
  ArrowRight, 
  Plus, 
  MessageSquare, 
  Zap,
  Bot,
  User,
  RefreshCw,
  Star
} from 'lucide-react';

// ── Animated typing hook ──────────────────────────────────────────────────────
function useTypingAnimation(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const idxRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    idxRef.current = 0;
    if (!text) return;

    const interval = setInterval(() => {
      idxRef.current += 1;
      setDisplayed(text.slice(0, idxRef.current));
      if (idxRef.current >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

// ── Single message bubble ─────────────────────────────────────────────────────
interface MessageBubbleProps {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'copilot' | 'agent';
  isLatest: boolean;
  cards?: any[];
  onActionItinerary: () => void;
  onActionBook: () => void;
  onOpenCompare: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  text, 
  sender, 
  isLatest, 
  cards,
  onActionItinerary, 
  onActionBook,
  onOpenCompare 
}) => {
  const isUser = sender === 'user';
  const shouldAnimate = isLatest && !isUser;
  const { displayed, done } = useTypingAnimation(shouldAnimate ? text : text, shouldAnimate ? 16 : 0);
  const content = shouldAnimate ? displayed : text;

  // Render **bold** markdown-style formatting
  const renderFormatted = (raw: string) => {
    const parts = raw.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-black text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const comparisonCard = cards?.find(c => c.type === 'comparison_card')?.data;

  return (
    <div className={`flex gap-3 animate-message-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#7956f5] to-[#3478f6] flex items-center justify-center shrink-0 shadow-md shadow-purple-500/30">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div className={`space-y-3 ${isUser ? 'items-end' : 'items-start'} max-w-[88%]`}>
        {/* Text bubble */}
        <div className={`p-4 rounded-2xl text-sm leading-relaxed transition-all ${
          isUser
            ? 'bg-gradient-to-r from-[#7956f5] to-[#3478f6] text-white font-medium rounded-tr-sm shadow-lg shadow-purple-500/25'
            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 text-[#101d42] dark:text-slate-100 rounded-tl-sm shadow-sm'
        }`}>
          <div className="whitespace-pre-line leading-relaxed">
            {renderFormatted(content)}
            {shouldAnimate && !done && (
              <span className="inline-block w-[2px] h-[1em] bg-[#7956f5] ml-0.5 align-middle animate-[blink_0.8s_step-end_infinite]" />
            )}
          </div>

          {/* Embedded Comparison Card */}
          {comparisonCard && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                    Trip.com vs MakeMyTrip
                  </span>
                  {comparisonCard.price_range_inr && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                      Save up to ₹{comparisonCard.price_range_inr.max_potential_savings?.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <button
                  onClick={onOpenCompare}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                >
                  Deep Compare <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Best Deal Highlights */}
              {comparisonCard.best_deal && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {comparisonCard.best_deal.recommended && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-blue-500/30">
                      <div className="flex items-center justify-between text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-1">
                        <span>🌟 BEST VALUE PICK</span>
                        <span>{comparisonCard.best_deal.recommended.provider}</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {comparisonCard.best_deal.recommended.airline || comparisonCard.best_deal.recommended.name}
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        {comparisonCard.best_deal.recommended.duration || comparisonCard.best_deal.recommended.room_type}
                      </div>
                      <div className="text-base font-black text-slate-900 dark:text-white mt-1">
                        ₹{(comparisonCard.best_deal.recommended.price_inr || comparisonCard.best_deal.recommended.price_per_night_inr)?.toLocaleString('en-IN')}
                      </div>
                      <a
                        href={comparisonCard.best_deal.recommended.booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block w-full py-1.5 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] transition shadow-sm"
                      >
                        Book on {comparisonCard.best_deal.recommended.provider} ↗
                      </a>
                    </div>
                  )}

                  {comparisonCard.best_deal.cheapest && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                        <span>💰 LOWEST FARE</span>
                        <span>{comparisonCard.best_deal.cheapest.provider}</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {comparisonCard.best_deal.cheapest.airline || comparisonCard.best_deal.cheapest.name}
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        {comparisonCard.best_deal.cheapest.duration || comparisonCard.best_deal.cheapest.room_type}
                      </div>
                      <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">
                        ₹{(comparisonCard.best_deal.cheapest.price_inr || comparisonCard.best_deal.cheapest.price_per_night_inr)?.toLocaleString('en-IN')}
                      </div>
                      <a
                        href={comparisonCard.best_deal.cheapest.booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block w-full py-1.5 text-center bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-lg text-[11px] transition shadow-sm"
                      >
                        Book on {comparisonCard.best_deal.cheapest.provider} ↗
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CTA action buttons inside copilot card */}
          {!isUser && done && (text.includes('Flights') || text.includes('Transit') || text.includes('Hotels') || text.includes('Plan')) && (
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-3">
              <button
                onClick={onActionItinerary}
                className="btn-primary-gradient px-4 py-2 rounded-xl font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5"
              >
                <span>View Full Itinerary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenCompare}
                className="px-4 py-2 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 font-bold text-xs text-blue-600 dark:text-blue-400 transition"
              >
                Compare & Book (OTAs)
              </button>
              <button
                onClick={onActionBook}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs text-midnight-navy dark:text-white transition"
              >
                Make Bookings
              </button>
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#7956f5] to-[#3478f6] flex items-center justify-center shrink-0 shadow-md shadow-purple-500/25 text-white">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

// ── AI Thinking Indicator ─────────────────────────────────────────────────────
const AIThinking: React.FC = () => (
  <div className="flex gap-3 justify-start animate-message-in">
    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#7956f5] to-[#3478f6] flex items-center justify-center shrink-0 shadow-md shadow-purple-500/30">
      <Bot className="w-5 h-5 text-white animate-pulse" />
    </div>
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 mr-1">AI Agents coordinating</span>
        <span className="ai-thinking-dot" />
        <span className="ai-thinking-dot" />
        <span className="ai-thinking-dot" />
      </div>
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        {['Flight', 'Hotel', 'Visa', 'Budget'].map((agent, i) => (
          <span key={agent} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-ai-purple animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}>
            {agent} Agent
          </span>
        ))}
      </div>
    </div>
  </div>
);

// ── Main Copilot Screen ───────────────────────────────────────────────────────
export const Screen06_Copilot: React.FC = () => {
  const { 
    chatMessages, 
    sendUserPrompt, 
    agents, 
    currency, 
    setCurrentScreen, 
    isSpeaking, 
    speakText, 
    stopSpeaking,
    setBookingModalOpen,
    activeTrip 
  } = useTravel();

  const [inputPrompt, setInputPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isSubmitting]);

  // Web Speech API
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.onstart = () => setIsListening(true);
      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setInputPrompt(text);
        setIsListening(false);
        handleSend(undefined, text);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

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

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const txt = (customText || inputPrompt).trim();
    if (!txt || isSubmitting) return;
    setInputPrompt('');
    setIsSubmitting(true);
    inputRef.current?.focus();
    try {
      await sendUserPrompt(txt);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickChips = [
    { label: '✈️ Cheapest Flights', query: 'Find cheapest flights from Delhi to Dubai.' },
    { label: '🏨 Compare Dubai Hotels', query: 'Compare Dubai hotels under ₹5,000 per night.' },
    { label: '🔄 Trip.com vs MakeMyTrip', query: 'Compare Trip.com and MakeMyTrip.' },
    { label: '🌴 10-Day Dubai Plan', query: 'Plan my 10-day Dubai trip.' },
    { label: '💳 Best Budget Flight', query: 'Find the best international flight for my budget.' },
    { label: '🇮🇳 Hinglish', query: 'Delhi se Dubai sasti flight batao' },
    { label: '🇦🇪 العربية', query: 'قارن أفضل رحلات الطيران إلى دبي' },
  ];

  const recentChats = [
    { label: 'Dubai 10-Day Plan', active: true, query: '' },
    { label: 'Bali Island Sanctuary', active: false, query: 'Suggest a 5-day honeymoon itinerary for Bali' },
    { label: 'Paris & Swiss Alps', active: false, query: 'Check Schengen visa requirements for France trip' },
    { label: 'Singapore Weekend', active: false, query: 'Plan 3-day Singapore trip from India' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 select-none animate-page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-slide-up">
        <div>
          <h1 className="text-xl font-black text-midnight-navy dark:text-white flex items-center gap-2">
            <span className="text-gradient-purple">AI Travel Copilot</span>
            <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">ONLINE</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">13 autonomous agents ready • Context-aware travel intelligence</p>
        </div>
        <button
          onClick={() => setCurrentScreen('11-itinerary')}
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl btn-primary-gradient text-xs font-bold shadow-md"
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Open Dubai Itinerary</span>
        </button>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ── Left: Chat History & Agent Swarm ── */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 animate-slide-in-left">
          <button
            onClick={() => handleSend(undefined, 'I want to travel from Dhanbad to Dubai for 10 days.')}
            className="w-full btn-primary-gradient py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>

          {/* Recent Chats */}
          <div className="theme-card p-4 rounded-3xl space-y-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Recent Conversations</h3>
            {recentChats.map(chat => (
              <div
                key={chat.label}
                onClick={() => !chat.active && chat.query && handleSend(undefined, chat.query)}
                className={`p-3 rounded-xl cursor-pointer flex items-center gap-2.5 transition group ${
                  chat.active
                    ? 'bg-gradient-to-r from-purple-500/15 to-blue-500/10 border border-purple-500/25 text-ai-purple font-black'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${
                  chat.active ? 'bg-ai-purple text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-purple-500/15 group-hover:text-ai-purple'
                }`}>
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs truncate">{chat.label}</span>
                {chat.active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-ai-purple shrink-0" />}
              </div>
            ))}
          </div>

          {/* Autonomous Swarm Monitor */}
          <div className="theme-card p-4 rounded-3xl space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Autonomous Swarm</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-500">13 ACTIVE</span>
              </div>
            </div>
            <div className="space-y-2">
              {agents.slice(0, 6).map((ag, i) => (
                <div key={ag.id} className="flex items-center justify-between gap-2 group" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      ag.status === 'completed' ? 'bg-emerald-500' :
                      ag.status === 'thinking' || ag.status === 'searching' ? 'bg-ai-purple animate-pulse' :
                      'bg-slate-300 dark:bg-slate-600'
                    }`} />
                    <span className="text-xs text-midnight-navy dark:text-slate-200 font-semibold truncate">
                      {ag.name.replace(' Agent', '')}
                    </span>
                  </div>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 ${
                    ag.status === 'completed' ? 'text-emerald-600 bg-emerald-500/10' :
                    ag.status === 'thinking' ? 'text-ai-purple bg-purple-500/15 animate-pulse' :
                    'text-slate-400 bg-slate-100 dark:bg-slate-800'
                  }`}>
                    {ag.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>System Load</span>
                <span className="font-bold text-ai-purple">24ms avg</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-ai-purple to-ocean-blue animate-progress-fill" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Center: AI Conversation Thread ── */}
        <div className="lg:col-span-6 flex flex-col rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 min-h-[640px] max-h-[720px] animate-scale-in">

          {/* Chat Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/90 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7956f5] to-[#3478f6] flex items-center justify-center shadow-md shadow-purple-500/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
              </div>
              <div>
                <div className="text-sm font-black text-midnight-navy dark:text-white flex items-center gap-2">
                  <span>AI Travel Copilot</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Context-Aware • 13 Agents • Multilingual</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => isSpeaking ? stopSpeaking() : speakText("I'm your AI Travel Copilot. Ready to plan your trip.")}
                className={`p-2 rounded-xl transition ${isSpeaking ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-500' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-ai-purple'}`}
                title={isSpeaking ? 'Mute' : 'Speak'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setCurrentScreen('11-itinerary')}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-ai-purple transition"
                title="Open Itinerary"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-950/40 dark:to-slate-900/40">
            {chatMessages.map((msg, idx) => (
              <MessageBubble
                key={msg.id}
                id={msg.id}
                text={msg.text}
                sender={msg.sender as any}
                isLatest={idx === chatMessages.length - 1 && msg.sender !== 'user'}
                cards={msg.cards}
                onActionItinerary={() => setCurrentScreen('11-itinerary')}
                onActionBook={() => setBookingModalOpen(true)}
                onOpenCompare={() => setCurrentScreen('19-compare')}
              />
            ))}

            {isSubmitting && <AIThinking />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Chip Suggestions */}
          <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {quickChips.map(chip => (
              <button
                key={chip.label}
                onClick={() => handleSend(undefined, chip.query)}
                className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-ai-purple hover:text-ai-purple hover:bg-purple-500/5 text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0 transition-all duration-200 whitespace-nowrap"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSend}
            className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900"
          >
            <button
              type="button"
              onClick={toggleMic}
              className={`p-2.5 rounded-full transition-all duration-200 ${
                isListening
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-110 animate-pulse'
                  : 'text-slate-400 hover:text-ai-purple hover:bg-purple-500/10'
              }`}
              title="Voice Input"
            >
              <Mic className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputPrompt}
                onChange={e => setInputPrompt(e.target.value)}
                placeholder="Ask anything about travel..."
                className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-sm text-midnight-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-ai-purple/40 placeholder-slate-400 transition-all border border-slate-200 dark:border-slate-700 focus:border-ai-purple/60"
              />
            </div>

            <button
              type="submit"
              disabled={!inputPrompt.trim() || isSubmitting}
              className="w-10 h-10 rounded-full btn-primary-gradient flex items-center justify-center shadow-md shadow-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 transition-all"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </form>
        </div>

        {/* ── Right: Trip Context & Budget ── */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 animate-slide-in-right">

          {/* Trip Summary */}
          <div className="theme-card p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Active Trip</div>
                <h3 className="text-sm font-black text-midnight-navy dark:text-white">Dubai Adventure</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">UAE • 10 Days • 2 Travellers</p>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400">Total Budget</div>
                <div className="text-base font-black text-gradient-purple">
                  {formatCurrency(activeTrip.budgetBreakdown.totalINR, currency)}
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { icon: Plane, label: 'Flights', value: activeTrip.budgetBreakdown.flightsINR, color: 'text-sky-500', bg: 'bg-sky-500/10' },
                { icon: Building2, label: 'Hotels (9 nights)', value: activeTrip.budgetBreakdown.hotelINR, color: 'text-teal-500', bg: 'bg-teal-500/10' },
                { icon: CalendarDays, label: 'Activities', value: activeTrip.budgetBreakdown.activitiesINR, color: 'text-ai-purple', bg: 'bg-purple-500/10' },
                { icon: Coins, label: 'Local Transport', value: activeTrip.budgetBreakdown.localTransportINR, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between gap-2 group">
                  <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <div className={`w-6 h-6 rounded-lg ${item.bg} ${item.color} flex items-center justify-center`}>
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{item.label}</span>
                  </span>
                  <span className="font-black text-midnight-navy dark:text-white">
                    {formatCurrency(item.value, currency)}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentScreen('11-itinerary')}
              className="w-full py-2.5 rounded-xl btn-primary-gradient font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-500/20"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Open Master Itinerary</span>
            </button>
          </div>

          {/* Visa Advisory Card */}
          <div className="theme-card p-4 rounded-3xl space-y-3 bg-gradient-to-br from-teal-500/8 to-blue-500/5 border-teal-500/25">
            <div className="flex items-center gap-2 text-xs font-black text-midnight-navy dark:text-white">
              <div className="w-7 h-7 rounded-xl bg-teal-500/15 text-teal-500 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>Visa Agent Advisory</span>
              <span className="ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-black bg-teal-500/15 text-teal-500">VERIFIED</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              🇮🇳 Indian passport: <strong className="text-midnight-navy dark:text-white">30-Day UAE tourist eVisa</strong> takes 2-3 business days (₹7,500). VoA available for US/UK/Schengen visa holders.
            </p>
            <button onClick={() => setCurrentScreen('13-visa')} className="text-[11px] font-bold text-teal-500 hover:underline flex items-center gap-1">
              <span>Check full visa requirements</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* AI Agent ratings */}
          <div className="theme-card p-4 rounded-3xl space-y-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Recommendations</h3>
            {[
              { name: 'Burj Khalifa At The Top', rating: 4.9, tag: 'Landmark' },
              { name: 'Red Dunes Desert Safari', rating: 4.9, tag: 'Adventure' },
              { name: 'Abu Dhabi Grand Mosque', rating: 4.95, tag: 'Culture' },
            ].map(r => (
              <div key={r.name} className="flex items-center gap-2 group cursor-pointer p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-midnight-navy dark:text-white truncate">{r.name}</div>
                  <div className="text-[10px] text-slate-400">{r.tag}</div>
                </div>
                <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span className="text-[10px] font-black text-midnight-navy dark:text-white">{r.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
