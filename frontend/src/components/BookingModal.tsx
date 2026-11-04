import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { formatCurrency } from '../data/travelData';
import { BookingConfirmation } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Plane, 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  QrCode, 
  Download,
  Ticket
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { 
    bookingModalOpen, 
    setBookingModalOpen, 
    activeTrip, 
    currency, 
    userProfile, 
    addBookingToHistory,
    setCurrentScreen 
  } = useTravel();

  const [step, setStep] = useState<'checkout' | 'confirmed'>('checkout');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'International'>('UPI');
  const [coupon, setCoupon] = useState('COPILOT20');
  const [discountApplied, setDiscountApplied] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingConfirmation | null>(null);

  if (!bookingModalOpen) return null;

  const flight = activeTrip.selectedFlight;
  const hotel = activeTrip.selectedHotel;

  const basePriceINR = (flight ? flight.priceINR * activeTrip.travelersCount : 32500) +
    (hotel ? hotel.pricePerNightINR * 9 : 40500);
  const discountINR = discountApplied ? 5000 : 0;
  const finalPriceINR = Math.max(0, basePriceINR - discountINR);

  const handleCompleteBooking = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const newBooking: BookingConfirmation = {
        bookingId: `TM-DXB-${Math.floor(10000 + Math.random() * 90000)}`,
        pnr: `EK-${Math.floor(100000 + Math.random() * 900000)}`,
        passengerName: userProfile.name,
        tripTitle: activeTrip.title,
        origin: activeTrip.origin,
        destination: activeTrip.destination,
        dates: `${activeTrip.startDate} – ${activeTrip.endDate}`,
        flightDetails: flight || activeTrip.selectedFlight!,
        hotelDetails: hotel || activeTrip.selectedHotel!,
        totalPaidINR: finalPriceINR,
        currency,
        bookingDate: new Date().toISOString().split('T')[0],
        paymentMethod: paymentMethod,
        status: 'Confirmed',
      };

      setConfirmedBooking(newBooking);
      addBookingToHistory(newBooking);
      setIsProcessing(false);
      setStep('confirmed');

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {}
    }, 1000);
  };

  const handleClose = () => {
    setBookingModalOpen(false);
    setStep('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl theme-card p-6 sm:p-8 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'checkout' ? (
          <>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-ai-purple text-xs font-bold mb-2">
                <Ticket className="w-3.5 h-3.5" />
                <span>Booking Agent Instant Reservation</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-midnight-navy dark:text-white">
                Confirm & Secure Your Journey
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Instant ticketing synced with Emirates & Hotel Central Reservation System.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Selected Itinerary Package
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 space-y-1.5 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-sky-500 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Plane className="w-4 h-4" />
                      <span>{flight?.airline || 'Emirates'}</span>
                    </span>
                    <span>{flight?.duration || '5h 05m'}</span>
                  </div>
                  <div className="text-midnight-navy dark:text-white font-semibold">
                    {flight?.departureTime} ({flight?.origin.code}) ➔ {flight?.arrivalTime} ({flight?.destination.code})
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {activeTrip.travelersCount} Passenger • {flight?.baggage || '30 kg Check-in'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 space-y-1.5 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-teal-500 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      <span>{hotel?.name || 'Rove Downtown'}</span>
                    </span>
                    <span>9 Nights</span>
                  </div>
                  <div className="text-midnight-navy dark:text-white font-semibold line-clamp-1">
                    {hotel?.roomType || 'City Skyline Room'}
                  </div>
                  <div className="text-[11px] text-emerald-500 font-semibold">
                    Free Breakfast Included
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Secure Payment Method
              </h3>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: '⚡' },
                  { id: 'Card', label: 'Cards', icon: '💳' },
                  { id: 'NetBanking', label: 'NetBanking', icon: '🏛️' },
                  { id: 'International', label: 'Stripe', icon: '🌐' },
                ].map(pm => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                      paymentMethod === pm.id
                        ? 'border-ai-purple bg-purple-500/10 text-ai-purple ring-2 ring-purple-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-lg">{pm.icon}</span>
                    <span>{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
                placeholder="Enter Promo Code"
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-midnight-navy dark:text-white uppercase focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setDiscountApplied(true);
                  alert('Promo code COPILOT20 applied! ₹5,000 saved.');
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Apply
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Flights + Accommodation</span>
                <span className="font-bold text-midnight-navy dark:text-white">{formatCurrency(basePriceINR, currency)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>AI Copilot Member Discount (COPILOT20)</span>
                  <span>-{formatCurrency(discountINR, currency)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm">
                <span className="font-extrabold text-midnight-navy dark:text-white">Total Amount Due</span>
                <span className="font-black text-xl text-ai-purple">
                  {formatCurrency(finalPriceINR, currency)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCompleteBooking}
              disabled={isProcessing}
              className="w-full btn-primary-gradient py-3.5 rounded-2xl font-black text-xs shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-white" />
              <span>Authorize & Confirm Booking ({formatCurrency(finalPriceINR, currency)})</span>
            </button>
          </>
        ) : (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-midnight-navy dark:text-white">Booking Confirmed!</h2>
              <p className="text-xs text-slate-400">
                Your reservation has been processed. E-Ticket & Boarding Pass are generated below.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Booking Reference</span>
                  <div className="text-sm font-black text-midnight-navy dark:text-white font-mono">{confirmedBooking?.bookingId}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Flight PNR</span>
                  <div className="text-sm font-black text-ai-purple font-mono">{confirmedBooking?.pnr}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Passenger</span>
                  <span className="font-bold text-midnight-navy dark:text-white">{confirmedBooking?.passengerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Carrier</span>
                  <span className="font-bold text-midnight-navy dark:text-white">Emirates EK 571</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <QrCode className="w-7 h-7 text-midnight-navy dark:text-white" />
                  <span>Valid at DXB E-Gate</span>
                </div>
                <button
                  onClick={() => alert(`Downloading E-Ticket PDF for ${confirmedBooking?.bookingId}...`)}
                  className="btn-primary-gradient px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  handleClose();
                  setCurrentScreen('05-dashboard');
                }}
                className="btn-primary-gradient px-5 py-2.5 rounded-xl font-bold text-xs"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  handleClose();
                  setCurrentScreen('11-itinerary');
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                View 10-Day Itinerary
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
