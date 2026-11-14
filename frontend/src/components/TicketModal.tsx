import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { generateETicketPDF } from '../utils/pdfTicketGenerator';
import { BookingConfirmation } from '../types';
import {
  X,
  Plane,
  Building2,
  Download,
  Printer,
  Share2,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Luggage,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: BookingConfirmation | null;
}

export const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, booking }) => {
  const { activeTrip, userProfile, currency } = useTravel();
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentBooking: BookingConfirmation = booking || {
    bookingId: 'TM-DXB-52956',
    pnr: 'EK-305097',
    passengerName: userProfile.name || 'Ranjeet Kumar',
    tripTitle: activeTrip.title || 'Dubai 10-Day Luxury Adventure',
    origin: activeTrip.origin || 'Dhanbad (via CCU / IXR)',
    destination: activeTrip.destination || 'Dubai, UAE',
    dates: '15 Nov 2026 – 24 Nov 2026',
    flightDetails: activeTrip.selectedFlight!,
    hotelDetails: activeTrip.selectedHotel!,
    totalPaidINR: 68000,
    currency: 'INR',
    bookingDate: '2026-11-14',
    paymentMethod: 'UPI',
    status: 'Confirmed',
  };

  const handleDownload = () => {
    generateETicketPDF(currentBooking);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `TravelMate AI Official E-Ticket: PNR ${currentBooking.pnr} for ${currentBooking.passengerName} (CCU -> DXB). Verified at Dubai Smart Gates.`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">

          {/* Top Status & Brand Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-ai-purple to-ocean-blue flex items-center justify-center shadow-md shadow-purple-500/25">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base text-midnight-navy dark:text-white">TravelMate.AI</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-extrabold border border-emerald-500/20">
                    CONFIRMED / ISSUED
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Official IATA Resolution 722 E-Ticket</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                title="Print Ticket"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                title="Copy Ticket Details"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                className="btn-primary-gradient px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20"
              >
                <Download className="w-4 h-4" />
                <span>{downloadSuccess ? 'Downloaded!' : 'Download PDF'}</span>
              </button>
            </div>
          </div>

          {/* ── Visual Airline Boarding Pass ── */}
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-white/10 overflow-hidden">
            
            {/* Airline Header Bar */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-red-600 via-red-700 to-rose-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-serif font-black tracking-widest text-base sm:text-lg">Emirates</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-black/25 text-white/90 font-bold uppercase tracking-wider">
                  Flight EK 571
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-red-200 font-bold block uppercase tracking-wider">Airframe</span>
                <span className="font-bold text-white text-xs">Boeing 777-300ER</span>
              </div>
            </div>

            {/* Flight Route Banner (CCU -> DXB) */}
            <div className="p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">CCU</div>
                  <div className="text-xs font-bold text-slate-300">09:45 AM</div>
                  <div className="text-[10px] text-slate-400">Kolkata Netaji Subhash (T2)</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">15 Nov 2026</div>
                </div>

                <div className="flex flex-col items-center px-4">
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Non-Stop</div>
                  <div className="flex items-center gap-2 my-1">
                    <div className="w-2 h-2 rounded-full bg-ai-purple" />
                    <div className="w-16 sm:w-28 h-0.5 bg-gradient-to-r from-ai-purple via-sky-400 to-teal-400" />
                    <Plane className="w-4 h-4 text-sky-400 rotate-90" />
                  </div>
                  <div className="text-[10px] text-slate-400">5h 05m duration</div>
                </div>

                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">DXB</div>
                  <div className="text-xs font-bold text-slate-300">01:20 PM</div>
                  <div className="text-[10px] text-slate-400">Dubai International (T3)</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">15 Nov 2026</div>
                </div>
              </div>

              {/* Perforated Separator with Side Notches */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute -left-6 sm:-left-7 w-5 h-5 rounded-full bg-white dark:bg-[#0c1322]" />
                <div className="w-full border-t border-dashed border-white/20" />
                <div className="absolute -right-6 sm:-right-7 w-5 h-5 rounded-full bg-white dark:bg-[#0c1322]" />
              </div>

              {/* Boarding Credentials Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Passenger</div>
                  <div className="font-extrabold text-white text-xs truncate">{currentBooking.passengerName}</div>
                  <div className="text-[9px] text-amber-400 font-medium">Skywards Gold</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Seat / Class</div>
                  <div className="font-extrabold text-white text-xs">14A (Window)</div>
                  <div className="text-[9px] text-slate-400">Economy (Y)</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Gate / Zone</div>
                  <div className="font-extrabold text-sky-400 text-xs">Gate B22</div>
                  <div className="text-[9px] text-slate-400">Zone B (08:50 AM)</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Baggage Allowance</div>
                  <div className="font-extrabold text-white text-xs">30 KG Checked</div>
                  <div className="text-[9px] text-slate-400">+ 7 KG Cabin Bag</div>
                </div>
              </div>

              {/* Barcode & Fast Pass Banner */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/30 p-3 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow">
                    <QrCode className="w-12 h-12 text-black" />
                  </div>
                  <div>
                    <div className="font-mono text-xs font-black text-white tracking-widest">{currentBooking.pnr}</div>
                    <div className="text-[10px] text-slate-400">Booking Ref: {currentBooking.bookingId}</div>
                    <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>DXB Smart E-Gate Approved</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Barcode Lines */}
                <div className="text-center sm:text-right font-mono text-[9px] text-slate-400">
                  <div className="h-6 w-36 bg-[repeating-linear-gradient(90deg,#fff,#fff_2px,transparent_2px,transparent_4px,#fff_4px,#fff_7px,transparent_7px,transparent_9px)] rounded opacity-90 mx-auto sm:ml-auto" />
                  <div className="mt-1 tracking-widest text-[8px]">*M1EK571-CCUDXB-RANJEET*</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Hotel Basecamp Voucher Card ── */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-midnight-navy dark:text-white">
                <Building2 className="w-4 h-4 text-teal-500" />
                <span>Confirmed Hotel Basecamp Stay</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-500 font-bold">
                9 Nights Confirmed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-extrabold text-midnight-navy dark:text-white">Rove Downtown Dubai</div>
                <div className="text-[11px] text-slate-400">Burj Khalifa View Rover Room</div>
                <div className="text-[10px] text-emerald-500 font-semibold">Free Gourmet Breakfast & Wi-Fi Included</div>
              </div>

              <div className="space-y-1 text-slate-500 dark:text-slate-400 text-[11px]">
                <div>Check-in: <strong className="text-midnight-navy dark:text-white">15 Nov 2026 (14:00)</strong></div>
                <div>Check-out: <strong className="text-midnight-navy dark:text-white">24 Nov 2026 (12:00)</strong></div>
                <div>Voucher Reference: <strong className="font-mono text-ai-purple">ROVE-DXB-99824</strong></div>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>256-Bit Cryptographic Vault Verification</span>
            </div>

            <div className="flex gap-2.5 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Close Pass
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 sm:flex-initial btn-primary-gradient px-6 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{downloadSuccess ? 'Downloaded!' : 'Download PDF E-Ticket'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
