import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { 
  BarChart3, 
  Users, 
  Ticket, 
  Cpu, 
  Server, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Settings, 
  Search 
} from 'lucide-react';

export const Screen18_Admin: React.FC = () => {
  const { agents } = useTravel();

  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'bookings' | 'apis'>('overview');

  const providerAPIs = [
    { name: 'Amadeus Flight GDS API', status: 'Operational', latency: '142ms', uptime: '99.94%' },
    { name: 'Central Hotel Inventory Provider', status: 'Operational', latency: '210ms', uptime: '99.88%' },
    { name: 'IATA Timatic Visa Engine', status: 'Operational', latency: '95ms', uptime: '100%' },
    { name: 'Google Maps & Places Geocoding', status: 'Operational', latency: '65ms', uptime: '99.99%' },
    { name: 'Payment Gateways (Razorpay / Stripe)', status: 'Operational', latency: '180ms', uptime: '99.95%' },
    { name: 'Voice Neural TTS / STT Service', status: 'Operational', latency: '110ms', uptime: '99.90%' },
  ];

  const recentUsers = [
    { name: 'Ranjeet Kumar', email: 'ranjeet.travels@travelmate.ai', tier: 'Gold Explorer', destination: 'Dubai, UAE', status: 'Active' },
    { name: 'Priya Sharma', email: 'priya.s@travelmate.ai', tier: 'Platinum VIP', destination: 'Tokyo, Japan', status: 'Active' },
    { name: 'Vikram Mehta', email: 'vikram.m@travelmate.ai', tier: 'Standard', destination: 'Paris, France', status: 'Active' },
    { name: 'Ananya Patel', email: 'ananya.p@travelmate.ai', tier: 'Gold Explorer', destination: 'Bali, Indonesia', status: 'Active' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 select-none animate-page-enter">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
          <Server className="w-3.5 h-3.5 text-ai-purple" />
          <span>Screen 18 • White-Label Travel Portal Admin</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-midnight-navy dark:text-white">
          System Administration & Swarm Telemetry
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Real-time AI agent monitoring, provider API latency, bookings governance, and user telemetry.
        </p>

        {/* Tab switcher */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 gap-1 mt-4">
          {[
            { id: 'overview', label: 'Platform Overview' },
            { id: 'agents', label: 'AI Agent Swarm' },
            { id: 'bookings', label: 'Users & Bookings' },
            { id: 'apis', label: 'Provider APIs & GDS' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === t.id
                  ? 'bg-ai-purple text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 4 Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="theme-card p-5 rounded-3xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Platform Volume</span>
              <div className="text-2xl sm:text-3xl font-black text-midnight-navy dark:text-white">₹4.82 Cr</div>
              <div className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+32% this month</span>
              </div>
            </div>

            <div className="theme-card p-5 rounded-3xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Active AI Travelers</span>
              <div className="text-2xl sm:text-3xl font-black text-ai-purple">184,290</div>
              <div className="text-[11px] text-slate-400">Across 140 countries</div>
            </div>

            <div className="theme-card p-5 rounded-3xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">AI Swarm Accuracy</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-500">99.4%</div>
              <div className="text-[11px] text-slate-400">Zero booking hallucinations</div>
            </div>

            <div className="theme-card p-5 rounded-3xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Amadeus Flight PNRs</span>
              <div className="text-2xl sm:text-3xl font-black text-sky-500">14,820</div>
              <div className="text-[11px] text-emerald-500 font-bold">100% Ticketed</div>
            </div>
          </div>

          {/* AI Telemetry Quick Grid */}
          <div className="theme-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-extrabold text-midnight-navy dark:text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-ai-purple" />
                <span>11 Autonomous Agent Live Operations</span>
              </h2>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                All 11 Online
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              {agents.map(ag => (
                <div key={ag.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-midnight-navy dark:text-white truncate">{ag.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">{ag.title}</div>
                  <div className="text-[9px] text-ai-purple font-semibold pt-1">Uptime: 99.98%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'agents' && (
        <div className="theme-card p-6 rounded-3xl space-y-4">
          <h2 className="text-base font-black text-midnight-navy dark:text-white">
            Detailed AI Agent Orchestration Telemetry
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">Agent</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Model / Engine</th>
                  <th className="pb-3">Avg Latency</th>
                  <th className="pb-3">Consensus Score</th>
                  <th className="pb-3">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {agents.map(ag => (
                  <tr key={ag.id} className="py-2.5">
                    <td className="py-3 font-bold text-midnight-navy dark:text-white">{ag.name}</td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{ag.title}</td>
                    <td className="py-3 font-mono text-[11px] text-ai-purple">Gemini 1.5 Pro / GPT-4o</td>
                    <td className="py-3 text-slate-500 font-semibold">120ms</td>
                    <td className="py-3 text-emerald-500 font-bold">99.8%</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold text-[10px]">
                        Operational
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="theme-card p-6 rounded-3xl space-y-4">
          <h2 className="text-base font-black text-midnight-navy dark:text-white">
            Recent User Accounts & Active Itineraries
          </h2>
          <div className="space-y-3">
            {recentUsers.map(u => (
              <div key={u.email} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-midnight-navy dark:text-white">{u.name}</div>
                  <div className="text-[10px] text-slate-400">{u.email} • {u.tier}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-ai-purple">{u.destination}</div>
                  <div className="text-[10px] text-emerald-500 font-semibold">● {u.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'apis' && (
        <div className="theme-card p-6 rounded-3xl space-y-4">
          <h2 className="text-base font-black text-midnight-navy dark:text-white">
            Provider GDS & Travel API Integrations
          </h2>
          <div className="space-y-3">
            {providerAPIs.map(api => (
              <div key={api.name} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-midnight-navy dark:text-white">{api.name}</div>
                  <div className="text-[11px] text-slate-400">Response Latency: {api.latency}</div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold text-[10px]">
                    {api.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">Uptime: {api.uptime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
