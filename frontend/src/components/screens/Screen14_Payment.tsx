import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { formatCurrency } from '../../data/travelData';
import { BookingConfirmation } from '../../types';
import confetti from 'canvas-confetti';
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  QrCode, 
  Ticket, 
  Plane, 
  Building2, 
  Sparkles 
} from 'lucide-react';

export const Screen14_Payment: React.FC = () => {
  const { 
    activeTrip, 
    currency, 
    userProfile, 
    addBookingToHistory, 
    setCurrentScreen 
  } = useTravel();

  const [step, setStep] = useState<'checkout' | 'confirmed'>('checkout');
  const [method, setMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'International'>('UPI');
  const [coupon, setCoupon] = useState('COPILOT20');
  const [discountApplied, setDiscountApplied] = useState(true);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingConfirmation | null>(null);

  const basePriceINR = activeTrip.budgetBreakdown.flightsINR + activeTrip.budgetBreakdown.hotelINR; // 73,000
  const discountINR = discountApplied ? 5000 : 0;
  const finalPriceINR = Math.max(0, basePriceINR - discountINR);

  const handlePay = () => {
    const booking: BookingConfirmation = {
      bookingId: `TM-DXB-${Math.floor(10000 + Math.random() * 90000)}`,
      pnr: `EK-${Math.floor(100000 + Math.random() * 900000)}`,
      passengerName: userProfile.name,
      tripTitle: activeTrip.title,
      origin: activeTrip.origin,
      destination: activeTrip.destination,
      dates: `${activeTrip.startDate} – ${activeTrip.endDate}`,
      flightDetails: activeTrip.selectedFlight!,
      hotelDetails: activeTrip.selectedHotel!,
      totalPaidINR: finalPriceINR,
      currency,
      bookingDate: '2026-11-04',
      paymentMethod: method,
      status: 'Confirmed',
    };

    setConfirmedBooking(booking);
    addBookingToHistory(booking);
    setStep('confirmed');

    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 select-none animate-page-enter">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-ai-purple text-xs font-bold border border-purple-500/20">
          <Ticket className="w-3.5 h-3.5" />
          <span>Screen 14 • Payment & Booking Confirmation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-midnight-navy dark:text-white">
          {step === 'checkout' ? 'Secure Checkout & Payment' : 'Booking Confirmed! 🎉'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {step === 'checkout'
            ? 'Authorized directly with Emirates & Hotel Central Reservation Systems.'
            : 'Your official booking reference and digital boarding passes have been issued.'}
        </p>
      </div>

      {step === 'checkout' ? (
        <div className="theme-card p-6 sm:p-8 rounded-3xl space-y-6">
          {/* Booking Summary */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Selected Itinerary Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-sky-500 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Plane className="w-4 h-4" />
                    <span>Emirates (EK 571)</span>
                  </span>
                  <span>Direct (5h 05m)</span>
                </div>
                <div className="font-bold text-midnight-navy dark:text-white">
                  Kolkata CCU ➔ Dubai DXB
                </div>
                <div className="text-[10px] text-slate-400">Seat 14A • 30 kg Baggage</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-teal-500 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    <span>Rove Downtown</span>
                  </span>
                  <span>9 Nights</span>
                </div>
                <div className="font-bold text-midnight-navy dark:text-white">
                  Rover Room (Burj Khalifa View)
                </div>
                <div className="text-[10px] text-emerald-500 font-semibold">Free Breakfast Included</div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Select Payment Method
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'UPI', label: 'UPI / QR', icon: '⚡' },
                { id: 'Card', label: 'Credit Card', icon: '💳' },
                { id: 'NetBanking', label: 'Net Banking', icon: '🏛️' },
                { id: 'International', label: 'Stripe / Int’l', icon: '🌐' },
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id as any)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    method === m.id
                      ? 'border-ai-purple bg-purple-500/10 text-ai-purple ring-2 ring-purple-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-lg">{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Coupon */}
          <div className="flex gap-2">
            <input
              type="text"
              value={coupon}
              onChange={e => setCoupon(e.target.value)}
              placeholder="Enter Promo Code"
              className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-midnight-navy dark:text-white uppercase focus:outline-none"
            />
            <button
              onClick={() => alert('Code COPILOT20 verified! ₹5,000 discount applied.')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Apply
            </button>
          </div>

          {/* Fare Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Flights + Hotels Subtotal</span>
              <span className="font-bold text-midnight-navy dark:text-white">
                {formatCurrency(basePriceINR, currency)}
              </span>
            </div>
            {discountApplied && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>AI Member Promo (COPILOT20)</span>
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

          {/* Pay CTA */}
          <button
            onClick={handlePay}
            className="w-full btn-primary-gradient py-3.5 rounded-2xl font-black text-xs shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5 text-white" />
            <span>Authorize & Confirm Payment ({formatCurrency(finalPriceINR, currency)})</span>
          </button>
        </div>
      ) : (
        /* Confirmed Ticket Receipt */
        <div className="theme-card p-6 sm:p-8 rounded-3xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-midnight-navy dark:text-white">Booking Reference Issued</h2>
            <p className="text-xs text-slate-400">Official voucher sent to {userProfile.email}</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Booking ID</span>
                <div className="font-black text-midnight-navy dark:text-white font-mono">{confirmedBooking?.bookingId}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Airline PNR</span>
                <div className="font-black text-ai-purple font-mono">{confirmedBooking?.pnr}</div>
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
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <QrCode className="w-8 h-8 text-midnight-navy dark:text-white" />
                <span>Scan at DXB E-Gate</span>
              </div>
              <button
                onClick={() => alert('Downloading official PDF receipt for ' + confirmedBooking?.bookingId)}
                className="btn-primary-gradient px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Voucher</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => setCurrentScreen('15-wallet')}
              className="btn-primary-gradient px-6 py-2.5 rounded-xl font-bold text-xs"
            >
              Go to Travel Wallet
            </button>
            <button
              onClick={() => setCurrentScreen('05-dashboard')}
              className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
