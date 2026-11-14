import React, { useState, useEffect } from 'react';
import { useTravel } from '../context/TravelContext';
import confetti from 'canvas-confetti';
import { generateProMembershipPDF } from '../utils/pdfTicketGenerator';
import {
  Crown,
  X,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Radio,
  BellRing,
  LifeBuoy,
  CreditCard,
  QrCode,
  Smartphone,
  Copy,
  Check,
  Download,
  Fingerprint,
  Lock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Award,
  Printer,
  Ticket
} from 'lucide-react';

export const ProUpgradeModal: React.FC = () => {
  const {
    proModalOpen,
    setProModalOpen,
    isPro,
    activateProMembership,
    userProfile,
    setCurrentScreen,
  } = useTravel();

  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
  const [activeTab, setActiveTab] = useState<'upi' | 'qr' | 'gpay' | 'playstore' | 'applepay'>('upi');
  const [upiId, setUpiId] = useState('ranjeet@okaxis');
  const [upiVerified, setUpiVerified] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrSecondsLeft, setQrSecondsLeft] = useState(300); // 5 minutes timer
  const [selectedPlayMethod, setSelectedPlayMethod] = useState<'balance' | 'card'>('balance');

  // Plan pricing
  const planPrice = selectedPlan === 'annual' ? 3999 : 499;
  const originalPrice = selectedPlan === 'annual' ? 5999 : 699;
  const planTitle = selectedPlan === 'annual' ? 'Pro Annual (Save 40%)' : 'Pro Monthly';

  // QR countdown timer
  useEffect(() => {
    if (!proModalOpen || isSuccess) return;
    const interval = setInterval(() => {
      setQrSecondsLeft((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, [proModalOpen, isSuccess]);

  if (!proModalOpen) return null;

  const handleStartPayment = (methodName: string) => {
    setIsProcessing(true);
    setProcessingStep(1);

    setTimeout(() => {
      setProcessingStep(2);
    }, 800);

    setTimeout(() => {
      setProcessingStep(3);
    }, 1600);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      activateProMembership(selectedPlan, methodName);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#8b5cf6', '#10b981', '#3b82f6'],
        });
      } catch (err) {
        console.error('Confetti error:', err);
      }
    }, 2400);
  };

  const copyUpiString = () => {
    const uri = `upi://pay?pa=travelmate.ai@icici&pn=TravelMateAI&am=${planPrice}&cu=INR&tn=ProMembership`;
    navigator.clipboard?.writeText(uri);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleClose = () => {
    setIsProcessing(false);
    setIsSuccess(false);
    setProModalOpen(false);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header Background Glow */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-sky-500/20 pointer-events-none blur-2xl" />

        {/* Modal Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================= SUCCESS STATE ================= */}
        {isSuccess ? (
          <div className="p-6 sm:p-8 space-y-6 text-center overflow-y-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-500 border border-amber-500/30">
                <Crown className="w-3.5 h-3.5 fill-amber-500" />
                <span>MEMBERSHIP CONFIRMED</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-midnight-navy dark:text-white">
                Welcome to TravelMate PRO Elite!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Payment verified. All 11 Autonomous AI Agents, VIP Flight Alert Pings, and 24/7 SOS Helpline are now activated for your account.
              </p>
            </div>

            {/* Luxury VIP Ticket Card */}
            <div className="relative mx-auto max-w-md rounded-3xl bg-gradient-to-br from-[#0b0f19] via-[#151c33] to-[#1e1338] text-white shadow-2xl border-2 border-amber-500/40 text-left overflow-hidden">
              {/* Gold Holographic Ambient Glow */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-amber-400/25 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-purple-600/20 to-sky-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Perforated Notches (Left & Right Cutouts) */}
              <div className="absolute -left-3.5 top-[58%] -translate-y-1/2 w-7 h-7 rounded-full bg-white dark:bg-[#0c1222] border-r-2 border-amber-500/40 z-20 pointer-events-none" />
              <div className="absolute -right-3.5 top-[58%] -translate-y-1/2 w-7 h-7 rounded-full bg-white dark:bg-[#0c1222] border-l-2 border-amber-500/40 z-20 pointer-events-none" />

              {/* Top Golden Header Ribbon */}
              <div className="px-6 pt-5 pb-3 bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-transparent border-b border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-[11px] font-black tracking-wider text-amber-400 uppercase">
                    TRAVELMATE.AI VIP PASS
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/25 to-amber-600/25 text-amber-300 font-black text-[10px] border border-amber-500/40 shadow-sm shadow-amber-500/20">
                  <Crown className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>PRO ELITE</span>
                </div>
              </div>

              {/* Passenger Credentials Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">VIP Member Name</div>
                    <div className="text-xl font-black text-white tracking-wide">{userProfile.name || 'Ranjeet Kumar'}</div>
                    <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Biometric Verified • Global Access</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pass ID</div>
                    <div className="text-xs font-mono font-black text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      TMPRO-2026-8941
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Membership Tier</div>
                    <div className="font-bold text-amber-200 mt-0.5">{selectedPlan === 'annual' ? 'Annual All-Access (365d)' : 'Monthly Access (30d)'}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Swarm Mesh</div>
                    <div className="font-bold text-emerald-300 mt-0.5 flex items-center gap-1">
                      <Radio className="w-3 h-3" />
                      <span>11 Agents Synced</span>
                    </div>
                  </div>
                </div>

                {/* Perforated Divider Line */}
                <div className="relative pt-3 pb-1">
                  <div className="border-t-2 border-dashed border-amber-500/30 w-full" />
                </div>

                {/* Lower Ticket Stub: Barcode & Fast-Track Access */}
                <div className="pt-1 flex items-center justify-between gap-3">
                  <div className="flex-1 space-y-1.5">
                    {/* Simulated High-Density Barcode */}
                    <div className="h-9 bg-white/95 rounded px-2 py-1.5 flex items-center justify-between overflow-hidden">
                      {[3, 1, 2, 4, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2].map((w, idx) => (
                        <div
                          key={idx}
                          className="h-full bg-slate-900"
                          style={{ width: `${w * 1.5}px` }}
                        />
                      ))}
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 tracking-wider">
                      *TMPRO-2026-8941-DXB-GATE-OK*
                    </div>
                  </div>

                  {/* QR Fast Pass Box */}
                  <div className="w-16 h-16 rounded-xl bg-white p-1 flex flex-col items-center justify-center shrink-0 shadow-lg">
                    <QrCode className="w-11 h-11 text-slate-900" />
                    <span className="text-[7px] font-black text-slate-700 uppercase">E-GATE</span>
                  </div>
                </div>
              </div>

              {/* Bottom Security Footer */}
              <div className="px-6 py-2.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1 text-amber-300/90 font-medium">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>VIP Lounge & Concierge Priority</span>
                </span>
                <span>GST Tax Invoice Included</span>
              </div>
            </div>

            {/* Feedback alert when downloaded */}
            {pdfDownloaded && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold animate-fade-in mx-auto">
                <CheckCircle2 className="w-4 h-4" />
                <span>TravelMate PRO Elite Pass & Official Tax Invoice PDF downloaded to your device!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  handleClose();
                  setCurrentScreen('05-dashboard');
                }}
                className="btn-primary-gradient px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition"
              >
                <span>Launch Pro Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  generateProMembershipPDF({
                    memberName: userProfile.name || 'Ranjeet Kumar',
                    passId: 'TMPRO-2026-8941',
                    plan: selectedPlan,
                    amount: planPrice,
                    paymentMethod: activeTab === 'upi' ? `UPI (${upiId})` : activeTab === 'qr' ? 'UPI Dynamic QR' : activeTab === 'applepay' ? 'Apple Pay (Biometric)' : activeTab === 'gpay' ? 'Google Pay' : 'Google Play Billing',
                    issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  });
                  setPdfDownloaded(true);
                  setTimeout(() => setPdfDownloaded(false), 4000);
                }}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition active:scale-95"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Download Invoice PDF</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition active:scale-95"
                title="Print VIP Pass"
              >
                <Printer className="w-4 h-4" />
                <span>Print Ticket</span>
              </button>
            </div>
          </div>
        ) : isProcessing ? (
          /* ================= PROCESSING STATE ================= */
          <div className="p-12 space-y-6 text-center my-auto">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 animate-ping" />
              <div className="w-20 h-20 rounded-full border-4 border-transparent border-t-amber-500 border-r-purple-500 animate-spin" />
              <Lock className="w-7 h-7 text-ai-purple absolute" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-midnight-navy dark:text-white">
                Securing Your Pro Upgrade...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Encrypted bank-grade tokenization in progress. Please do not close this window.
              </p>
            </div>

            {/* Steps Progress */}
            <div className="max-w-xs mx-auto space-y-2 text-left">
              <div className="flex items-center gap-2.5 text-xs">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  processingStep >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}>✓</span>
                <span className={processingStep >= 1 ? 'font-bold text-slate-800 dark:text-slate-200' : 'text-slate-400'}>
                  Connecting to Banking Gateway
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  processingStep >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}>✓</span>
                <span className={processingStep >= 2 ? 'font-bold text-slate-800 dark:text-slate-200' : 'text-slate-400'}>
                  Verifying 256-bit Payment Handshake
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  processingStep >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}>✓</span>
                <span className={processingStep >= 3 ? 'font-bold text-slate-800 dark:text-slate-200' : 'text-slate-400'}>
                  Activating 11 Autonomous AI Agents
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ================= MAIN CHECKOUT STATE ================= */
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            {/* Top Brand Banner */}
            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-sky-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black">
                <Crown className="w-3.5 h-3.5 fill-amber-500" />
                <span>UPGRADE TO PRO ELITE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-midnight-navy dark:text-white tracking-tight">
                Get 11 Autonomous Agents, VIP Alerts & 24/7 SOS
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                Supercharge your travels with instant price-drop sniping, live flight tracking, and global concierge safety.
              </p>
            </div>

            {/* Plan Selector (Annual vs Monthly) */}
            <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setSelectedPlan('annual')}
                className={`relative p-3.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                  selectedPlan === 'annual'
                    ? 'bg-white dark:bg-slate-900 border-2 border-ai-purple shadow-md text-midnight-navy dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                  Save 40% • 14D Trial
                </span>
                <div className="font-extrabold text-xs sm:text-sm">Annual Pro Pass</div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-lg sm:text-xl font-black text-ai-purple">₹3,999</span>
                  <span className="text-[10px] text-slate-400 line-through">₹5,999</span>
                  <span className="text-[10px] text-slate-500">/year</span>
                </div>
                <div className="text-[10px] text-emerald-500 font-bold mt-1">₹333 / month • Billed annually</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan('monthly')}
                className={`p-3.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                  selectedPlan === 'monthly'
                    ? 'bg-white dark:bg-slate-900 border-2 border-ai-purple shadow-md text-midnight-navy dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <div className="font-extrabold text-xs sm:text-sm">Monthly Flex</div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-lg sm:text-xl font-black text-ai-purple">₹499</span>
                  <span className="text-[10px] text-slate-400 line-through">₹699</span>
                  <span className="text-[10px] text-slate-500">/month</span>
                </div>
                <div className="text-[10px] text-slate-500 font-bold mt-1">Cancel anytime in 1-click</div>
              </button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-purple-500/5 border border-purple-500/15 flex items-start gap-2.5">
                <div className="p-1.5 rounded-xl bg-purple-500/10 text-ai-purple shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-midnight-navy dark:text-white">11 Autonomous Agents</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Live negotiation & price-drop sniper</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-sky-500/5 border border-sky-500/15 flex items-start gap-2.5">
                <div className="p-1.5 rounded-xl bg-sky-500/10 text-sky-500 shrink-0 mt-0.5">
                  <BellRing className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-midnight-navy dark:text-white">VIP Flight Pings</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Gate shifts & baggage carousel alerts</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-rose-500/5 border border-rose-500/15 flex items-start gap-2.5">
                <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500 shrink-0 mt-0.5">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-midnight-navy dark:text-white">24/7 SOS Helpline</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Satellite emergency & embassy priority</div>
                </div>
              </div>
            </div>

            {/* Payment Methods Tabs (UPI, QR Code, GPay, Play Store, Apple Pay) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Choose Payment Method</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-extrabold normal-case">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>256-Bit SSL Encrypted</span>
                </span>
              </div>

              {/* Navigation Tabs */}
              <div className="grid grid-cols-5 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('upi')}
                  className={`py-2 px-1 rounded-xl text-center transition flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] ${
                    activeTab === 'upi'
                      ? 'bg-white dark:bg-slate-900 text-ai-purple shadow-sm font-black'
                      : 'text-slate-500 hover:text-midnight-navy dark:hover:text-white'
                  }`}
                >
                  <span>⚡</span>
                  <span>UPI Apps</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('qr')}
                  className={`py-2 px-1 rounded-xl text-center transition flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] ${
                    activeTab === 'qr'
                      ? 'bg-white dark:bg-slate-900 text-ai-purple shadow-sm font-black'
                      : 'text-slate-500 hover:text-midnight-navy dark:hover:text-white'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-sky-500" />
                  <span>Scan QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('gpay')}
                  className={`py-2 px-1 rounded-xl text-center transition flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] ${
                    activeTab === 'gpay'
                      ? 'bg-white dark:bg-slate-900 text-ai-purple shadow-sm font-black'
                      : 'text-slate-500 hover:text-midnight-navy dark:hover:text-white'
                  }`}
                >
                  <span>🌐</span>
                  <span>GPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('playstore')}
                  className={`py-2 px-1 rounded-xl text-center transition flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] ${
                    activeTab === 'playstore'
                      ? 'bg-white dark:bg-slate-900 text-ai-purple shadow-sm font-black'
                      : 'text-slate-500 hover:text-midnight-navy dark:hover:text-white'
                  }`}
                >
                  <span>▶️</span>
                  <span>Play Store</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('applepay')}
                  className={`py-2 px-1 rounded-xl text-center transition flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] ${
                    activeTab === 'applepay'
                      ? 'bg-white dark:bg-slate-900 text-ai-purple shadow-sm font-black'
                      : 'text-slate-500 hover:text-midnight-navy dark:hover:text-white'
                  }`}
                >
                  <span>🍎</span>
                  <span>Apple Pay</span>
                </button>
              </div>

              {/* Tab 1: UPI Apps & ID */}
              {activeTab === 'upi' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-4">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Pay directly with your preferred UPI app:
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { name: 'Google Pay', icon: 'GPay', bg: 'hover:border-blue-500' },
                      { name: 'PhonePe', icon: 'PhonePe', bg: 'hover:border-purple-500' },
                      { name: 'Paytm', icon: 'Paytm', bg: 'hover:border-cyan-500' },
                      { name: 'BHIM / Cred', icon: 'BHIM', bg: 'hover:border-emerald-500' },
                    ].map((app) => (
                      <button
                        key={app.name}
                        type="button"
                        onClick={() => handleStartPayment(app.name)}
                        className={`p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-black text-midnight-navy dark:text-white transition flex items-center justify-center gap-1.5 shadow-sm ${app.bg}`}
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>{app.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="relative flex items-center justify-center my-2">
                    <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                    <span className="bg-slate-50 dark:bg-slate-900 px-3 text-[10px] text-slate-400 font-bold uppercase">
                      Or enter UPI ID / VPA
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobile@upi, username@okhdfcbank"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-midnight-navy dark:text-white focus:outline-none focus:border-ai-purple"
                        />
                        {upiVerified && (
                          <span className="absolute right-3 top-3 text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleStartPayment('UPI (' + upiId + ')')}
                        className="btn-primary-gradient px-5 py-2.5 rounded-xl font-bold text-xs shadow-md whitespace-nowrap"
                      >
                        Request ₹{planPrice}
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Payment request will be sent instantly to your UPI app for 1-click approval.
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Dynamic Live QR Code */}
              {activeTab === 'qr' && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-4 text-center">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-midnight-navy dark:text-white flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-sky-500" />
                      <span>Instant Dynamic UPI QR Code</span>
                    </span>
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      Expires in: {formatTimer(qrSecondsLeft)}
                    </span>
                  </div>

                  {/* High Contrast Rendered QR Code */}
                  <div className="relative inline-block p-4 bg-white rounded-2xl shadow-xl border-2 border-slate-200 dark:border-slate-700">
                    <svg className="w-48 h-48 mx-auto" viewBox="0 0 200 200" fill="none">
                      {/* Background */}
                      <rect width="200" height="200" fill="#ffffff" />
                      
                      {/* Top-Left Position Detection Marker */}
                      <rect x="15" y="15" width="45" height="45" fill="#0f172a" rx="6" />
                      <rect x="23" y="23" width="29" height="29" fill="#ffffff" rx="3" />
                      <rect x="29" y="29" width="17" height="17" fill="#7956f5" rx="3" />

                      {/* Top-Right Position Detection Marker */}
                      <rect x="140" y="15" width="45" height="45" fill="#0f172a" rx="6" />
                      <rect x="148" y="23" width="29" height="29" fill="#ffffff" rx="3" />
                      <rect x="154" y="29" width="17" height="17" fill="#7956f5" rx="3" />

                      {/* Bottom-Left Position Detection Marker */}
                      <rect x="15" y="140" width="45" height="45" fill="#0f172a" rx="6" />
                      <rect x="23" y="148" width="29" height="29" fill="#ffffff" rx="3" />
                      <rect x="29" y="154" width="17" height="17" fill="#7956f5" rx="3" />

                      {/* Dynamic Matrix Dots */}
                      <g fill="#0f172a">
                        <rect x="70" y="20" width="8" height="8" rx="2" />
                        <rect x="85" y="20" width="8" height="8" rx="2" />
                        <rect x="110" y="20" width="8" height="8" rx="2" />
                        <rect x="70" y="35" width="14" height="8" rx="2" />
                        <rect x="95" y="35" width="8" height="8" rx="2" />
                        <rect x="115" y="35" width="12" height="8" rx="2" />
                        <rect x="70" y="50" width="8" height="14" rx="2" />
                        <rect x="88" y="50" width="12" height="8" rx="2" />
                        <rect x="110" y="50" width="16" height="8" rx="2" />

                        {/* Mid columns */}
                        <rect x="20" y="70" width="8" height="12" rx="2" />
                        <rect x="35" y="70" width="12" height="8" rx="2" />
                        <rect x="55" y="70" width="8" height="8" rx="2" />
                        <rect x="70" y="70" width="18" height="18" rx="4" fill="#f59e0b" />
                        <rect x="115" y="70" width="14" height="8" rx="2" />
                        <rect x="140" y="70" width="8" height="14" rx="2" />
                        <rect x="160" y="70" width="18" height="8" rx="2" />

                        {/* Center TravelMate Emblem */}
                        <rect x="75" y="75" width="50" height="50" fill="#ffffff" rx="8" />
                        <circle cx="100" cy="100" r="20" fill="#7956f5" />
                        <path d="M92 98 L98 104 L109 93" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Bottom columns */}
                        <rect x="70" y="140" width="8" height="18" rx="2" />
                        <rect x="85" y="140" width="16" height="8" rx="2" />
                        <rect x="110" y="140" width="8" height="14" rx="2" />
                        <rect x="130" y="140" width="14" height="8" rx="2" />
                        <rect x="155" y="140" width="8" height="18" rx="2" />
                        <rect x="70" y="165" width="18" height="8" rx="2" />
                        <rect x="95" y="165" width="12" height="8" rx="2" />
                        <rect x="115" y="165" width="18" height="8" rx="2" />
                        <rect x="140" y="165" width="12" height="8" rx="2" />
                        <rect x="160" y="165" width="16" height="8" rx="2" />
                      </g>
                    </svg>

                    <div className="mt-2 text-center">
                      <div className="font-mono text-xs font-black text-slate-800">
                        Scan to Pay: <span className="text-ai-purple font-black">₹{planPrice}.00</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold">
                        BHIM • GPay • PhonePe • Paytm
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
                    <button
                      type="button"
                      onClick={() => handleStartPayment('UPI Dynamic QR Scan')}
                      className="btn-primary-gradient px-5 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Simulate Mobile Scan & Pay (Test Payment)</span>
                    </button>
                    <button
                      type="button"
                      onClick={copyUpiString}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5 transition"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'URI Copied!' : 'Copy UPI Link'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Google Play Store In-App Billing */}
              {activeTab === 'playstore' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-sm">
                        ▶
                      </div>
                      <div>
                        <div className="font-black text-xs text-midnight-navy dark:text-white">Google Play Billing</div>
                        <div className="text-[10px] text-slate-400">ranjeet.travels@gmail.com</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">
                      Play Protect Certified
                    </span>
                  </div>

                  {/* Payment Instrument Options */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Payment method on Google:</div>
                    
                    <div
                      onClick={() => setSelectedPlayMethod('balance')}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        selectedPlayMethod === 'balance'
                          ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                          {selectedPlayMethod === 'balance' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-midnight-navy dark:text-white">Google Play Balance</div>
                          <div className="text-[10px] text-slate-400">Available: ₹1,480.00</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-500">Fast 1-Tap</span>
                    </div>

                    <div
                      onClick={() => setSelectedPlayMethod('card')}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        selectedPlayMethod === 'card'
                          ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
                          {selectedPlayMethod === 'card' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-midnight-navy dark:text-white">State Bank of India (•• 4821)</div>
                          <div className="text-[10px] text-slate-400">Auto-Renewing Google Play Subscription</div>
                        </div>
                      </div>
                      <CreditCard className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartPayment('Google Play In-App Billing')}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <Fingerprint className="w-4 h-4 text-emerald-400" />
                    <span>1-Tap Subscribe with Google Play (₹{planPrice})</span>
                  </button>
                </div>
              )}

              {/* Tab 4: Apple Pay (Cupertino Style) */}
              {activeTab === 'applepay' && (
                <div className="p-5 rounded-2xl bg-[#0d0d0f] text-white border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl"></span>
                      <span className="font-bold text-sm tracking-tight">Apple Pay</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                      Face ID Ready
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Card</span>
                      <span className="text-white font-semibold">Apple Card (•••• 9214)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Subscribed Service</span>
                      <span className="text-white font-semibold">TravelMate AI Pro Pass</span>
                    </div>
                    <div className="flex justify-between text-slate-400 pt-2 border-t border-white/10">
                      <span className="font-bold text-white">Amount Due</span>
                      <span className="font-black text-sm text-white">₹{planPrice}.00</span>
                    </div>
                  </div>

                  {/* Side button double-click prompt */}
                  <div className="p-3 rounded-xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center gap-2 text-xs text-slate-300">
                    <Smartphone className="w-4 h-4 text-sky-400" />
                    <span>Double-Click Side Button on iPhone / Mac</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartPayment('Apple Pay (Face ID)')}
                    className="w-full py-3.5 rounded-xl bg-white hover:bg-slate-100 text-black font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-lg"
                  >
                    <span className="text-lg"></span>
                    <span>Pay with Face ID / Touch ID (₹{planPrice})</span>
                  </button>
                </div>
              )}

              {/* Tab 5: Google Pay Direct */}
              {activeTab === 'gpay' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-black text-sm">
                        G
                      </div>
                      <div>
                        <div className="font-black text-xs text-midnight-navy dark:text-white">Google Pay Checkout</div>
                        <div className="text-[10px] text-slate-400">Fast, Simple and Safe Online Payment</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">Tokenized Visa/Mastercard</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                        💳
                      </div>
                      <div>
                        <div className="font-bold text-midnight-navy dark:text-white">HDFC Bank Millennia (•••• 3042)</div>
                        <div className="text-[10px] text-slate-400">Saved in your Google Account</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-bold">
                      Default
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartPayment('Google Pay Web Direct')}
                    className="w-full py-3.5 rounded-xl bg-black hover:bg-slate-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <span className="text-sm font-black text-white">GPay</span>
                    <span>Pay with Google Pay (₹{planPrice})</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Guarantee Badges */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>14-Day Money Back Guarantee</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sky-500" />
                <span>RBI & PCI-DSS Compliant</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
