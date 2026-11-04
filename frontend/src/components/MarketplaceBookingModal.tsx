import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { HOLIDAY_PACKAGES, MOBILITY_FLEET, SIGHTSEEING_TOURS, formatCurrency } from '../data/travelData';
import { HolidayPackage, MobilityOption, SightseeingTour, BookingConfirmation } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  Check, 
  MapPin, 
  Calendar, 
  Users, 
  Car, 
  Compass, 
  Plane, 
  Clock, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  CreditCard, 
  Ticket,
  ChevronRight,
  Filter,
  CheckCircle2,
  Tag
} from 'lucide-react';

interface MarketplaceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'packages' | 'cabs' | 'cars' | 'bikes' | 'sightseeing';
}

export const MarketplaceBookingModal: React.FC<MarketplaceBookingModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'packages'
}) => {
  const { 
    currency, 
    userProfile, 
    addBookingToHistory, 
    setCurrentScreen,
    marketplaceTab,
    setMarketplaceTab 
  } = useTravel();

  const [activeTab, setActiveTab] = useState<'packages' | 'cabs' | 'cars' | 'bikes' | 'sightseeing'>(initialTab || marketplaceTab || 'packages');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');
  
  // Booking checkout workflow state
  const [selectedOffer, setSelectedOffer] = useState<{
    type: 'package' | 'cab' | 'car' | 'bike' | 'tour';
    data: any;
  } | null>(null);

  const [bookingStep, setBookingStep] = useState<'browse' | 'details' | 'confirmed'>('browse');
  const [travellerName, setTravellerName] = useState(userProfile.name);
  const [travellerPhone, setTravellerPhone] = useState(userProfile.phone || '+91 98765 43210');
  const [travelDate, setTravelDate] = useState('2026-11-15');
  const [pickupLocation, setPickupLocation] = useState('Dhanbad Junction / City Center');
  const [passengersCount, setPassengersCount] = useState(2);
  const [confirmedBookingInfo, setConfirmedBookingInfo] = useState<BookingConfirmation | null>(null);

  if (!isOpen) return null;

  const handleStartBooking = (type: 'package' | 'cab' | 'car' | 'bike' | 'tour', data: any) => {
    setSelectedOffer({ type, data });
    setBookingStep('details');
  };

  const handleConfirmReservation = () => {
    if (!selectedOffer) return;

    let title = 'Travel Service Booking';
    let totalCost = 5000;
    let dest = 'India';

    if (selectedOffer.type === 'package') {
      const p = selectedOffer.data as HolidayPackage;
      title = p.title;
      totalCost = p.priceINR * Math.max(1, passengersCount);
      dest = p.destinations;
    } else if (selectedOffer.type === 'cab' || selectedOffer.type === 'car' || selectedOffer.type === 'bike') {
      const m = selectedOffer.data as MobilityOption;
      title = `${m.name} (${m.service})`;
      totalCost = m.baseFareINR * 2; // sample 2-day or standard trip
      dest = pickupLocation;
    } else if (selectedOffer.type === 'tour') {
      const t = selectedOffer.data as SightseeingTour;
      title = t.title;
      totalCost = t.priceINR * passengersCount;
      dest = t.city;
    }

    const newBooking: BookingConfirmation = {
      bookingId: `TM-${Math.floor(10000 + Math.random() * 90000)}`,
      pnr: `MOB-${Math.floor(100000 + Math.random() * 900000)}`,
      passengerName: travellerName,
      tripTitle: title,
      origin: pickupLocation,
      destination: dest,
      dates: `${travelDate} (Flexible)`,
      flightDetails: {
        id: 'mobility-fl',
        airline: 'TravelMate Mobility Partner',
        airlineCode: 'TM',
        flightNumber: '920',
        origin: { city: pickupLocation, airport: `${pickupLocation} Hub`, code: 'LOC', terminal: 'T1' },
        destination: { city: dest, airport: `${dest} Terminal`, code: 'DST', terminal: 'T1' },
        departureTime: '08:00 AM',
        arrivalTime: '11:30 AM',
        duration: 'Flexible',
        stops: 0,
        priceINR: 0,
        cabinClass: 'Economy',
        baggage: 'Included',
        refundable: true,
        carbonEmissionsKg: 45
      },
      hotelDetails: {
        id: 'mobility-ht',
        name: title,
        city: dest,
        stars: 4,
        rating: 4.8,
        reviewCount: 320,
        location: dest,
        distanceToCenter: 'Central',
        pricePerNightINR: totalCost,
        breakfastIncluded: true,
        freeCancellation: true,
        amenities: ['Instant Confirmation', '24/7 Helpline', 'Insurance Included'],
        imageUrl: selectedOffer.data.image,
        roomType: 'Confirmed Reservation'
      },
      totalPaidINR: totalCost,
      currency,
      bookingDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI',
      status: 'Confirmed'
    };

    setConfirmedBookingInfo(newBooking);
    addBookingToHistory(newBooking);
    setBookingStep('confirmed');

    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const filteredPackages = HOLIDAY_PACKAGES.filter(p => {
    if (searchFilter && !p.title.toLowerCase().includes(searchFilter.toLowerCase()) && !p.destinations.toLowerCase().includes(searchFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filteredCabs = MOBILITY_FLEET.filter(v => v.category === 'Cab');
  const filteredCars = MOBILITY_FLEET.filter(v => v.category === 'Self-Drive Car');
  const filteredBikes = MOBILITY_FLEET.filter(v => v.category === 'Bike Rental');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-5xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-ai-purple/15 text-ai-purple">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-black text-midnight-navy dark:text-white">
                TravelMate Booking Marketplace
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold">
                Live Inventory
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Holiday packages, cabs, self-drive rentals, bikes & sightseeing in one place.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* STEP 1: BROWSE INVENTORY */}
          {bookingStep === 'browse' && (
            <>
              {/* Category Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100 dark:border-slate-800">
                {[
                  { id: 'packages', label: 'Holiday Packages', icon: <Compass className="w-4 h-4" /> },
                  { id: 'cabs', label: 'Cab Booking', icon: <Car className="w-4 h-4" /> },
                  { id: 'cars', label: 'Car Rental', icon: <Car className="w-4 h-4" /> },
                  { id: 'bikes', label: 'Bike Rental', icon: <Car className="w-4 h-4" /> },
                  { id: 'sightseeing', label: 'Sightseeing Tours', icon: <Star className="w-4 h-4" /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                      activeTab === tab.id
                        ? 'bg-ai-purple text-white shadow-md shadow-purple-500/25'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* 1. HOLIDAY PACKAGES TAB */}
              {activeTab === 'packages' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-500">
                      Showing <strong className="text-midnight-navy dark:text-white">{filteredPackages.length}</strong> curated holiday packages
                    </span>
                    <input
                      type="text"
                      placeholder="Search packages by destination..."
                      value={searchFilter}
                      onChange={e => setSearchFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-midnight-navy dark:text-white focus:outline-none max-w-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredPackages.map(pkg => (
                      <div
                        key={pkg.id}
                        className="theme-card card-lift rounded-3xl overflow-hidden flex flex-col justify-between group border border-slate-200/90 dark:border-slate-800"
                      >
                        <div>
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={pkg.image}
                              alt={pkg.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{pkg.rating}</span>
                              <span className="text-slate-400 font-normal">({pkg.reviews})</span>
                            </div>
                            <div className="absolute top-3 right-3 bg-gradient-to-r from-ai-purple to-ocean-blue text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
                              {pkg.badge || pkg.category}
                            </div>
                            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{pkg.durationDays} Days / {pkg.durationNights} Nights</span>
                            </div>
                          </div>

                          <div className="p-5 space-y-3">
                            <h3 className="font-extrabold text-base text-midnight-navy dark:text-white leading-snug">
                              {pkg.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span>{pkg.destinations}</span>
                            </p>
                            <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                              <strong className="text-ai-purple block mb-0.5">Package Inclusions:</strong>
                              <span>{pkg.inclusions}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block line-through">
                              {formatCurrency(pkg.originalPriceINR, currency)}
                            </span>
                            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(pkg.priceINR, currency)}
                              <span className="text-xs text-slate-400 font-normal"> / person</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleStartBooking('package', pkg)}
                            className="btn-primary-gradient px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5"
                          >
                            <span>Book Package</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. CABS TAB */}
              {activeTab === 'cabs' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-sky-500" />
                      <span className="font-bold text-sky-900 dark:text-sky-200">
                        Available in Dhanbad, Ranchi, Kolkata, Delhi, Mumbai, Jaipur, Dubai & All Major Hubs
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-sky-600">Free Cancellation up to 1hr</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCabs.map(cab => (
                      <div
                        key={cab.id}
                        className="theme-card card-lift p-5 rounded-3xl flex flex-col justify-between border border-slate-200/90 dark:border-slate-800 group"
                      >
                        <div className="flex gap-4">
                          <img
                            src={cab.image}
                            alt={cab.name}
                            className="w-24 h-20 rounded-2xl object-cover shrink-0"
                          />
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-500">
                              {cab.service}
                            </span>
                            <h3 className="font-extrabold text-sm text-midnight-navy dark:text-white">
                              {cab.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{cab.capacity}</p>
                            <p className="text-[11px] text-slate-400">{cab.features}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-3">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Base Fare</span>
                            <span className="text-lg font-black text-ai-purple">
                              {formatCurrency(cab.baseFareINR, currency)}
                            </span>
                            <span className="text-[10px] text-slate-400 block">+{formatCurrency(cab.ratePerKmINR, currency)}/km</span>
                          </div>

                          <button
                            onClick={() => handleStartBooking('cab', cab)}
                            className="btn-primary-gradient px-4 py-2 rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5"
                          >
                            <span>Book Ride</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. CAR RENTALS TAB */}
              {activeTab === 'cars' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredCars.map(car => (
                      <div
                        key={car.id}
                        className="theme-card card-lift rounded-3xl overflow-hidden flex flex-col justify-between border border-slate-200/90 dark:border-slate-800"
                      >
                        <div>
                          <img
                            src={car.image}
                            alt={car.name}
                            className="w-full h-40 object-cover"
                          />
                          <div className="p-4 space-y-2">
                            <h3 className="font-extrabold text-sm text-midnight-navy dark:text-white">
                              {car.name}
                            </h3>
                            <p className="text-xs text-slate-400">{car.capacity}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                              {car.features}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Daily Rate</span>
                            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(car.baseFareINR, currency)} / day
                            </span>
                          </div>

                          <button
                            onClick={() => handleStartBooking('car', car)}
                            className="btn-primary-gradient px-3.5 py-1.5 rounded-xl font-bold text-xs"
                          >
                            Rent Car
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. BIKE RENTALS TAB */}
              {activeTab === 'bikes' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredBikes.map(bike => (
                      <div
                        key={bike.id}
                        className="theme-card card-lift rounded-3xl overflow-hidden flex flex-col justify-between border border-slate-200/90 dark:border-slate-800"
                      >
                        <div>
                          <img
                            src={bike.image}
                            alt={bike.name}
                            className="w-full h-40 object-cover"
                          />
                          <div className="p-4 space-y-2">
                            <h3 className="font-extrabold text-sm text-midnight-navy dark:text-white">
                              {bike.name}
                            </h3>
                            <p className="text-xs text-slate-400">{bike.capacity}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                              {bike.features}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Daily Rent</span>
                            <span className="text-base font-black text-ai-purple">
                              {formatCurrency(bike.baseFareINR, currency)} / day
                            </span>
                          </div>

                          <button
                            onClick={() => handleStartBooking('bike', bike)}
                            className="btn-primary-gradient px-3.5 py-1.5 rounded-xl font-bold text-xs"
                          >
                            Rent Bike
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. SIGHTSEEING TOURS TAB */}
              {activeTab === 'sightseeing' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SIGHTSEEING_TOURS.map(tour => (
                      <div
                        key={tour.id}
                        className="theme-card card-lift p-5 rounded-3xl flex flex-col justify-between border border-slate-200/90 dark:border-slate-800"
                      >
                        <div className="flex gap-4">
                          <img
                            src={tour.image}
                            alt={tour.title}
                            className="w-28 h-24 rounded-2xl object-cover shrink-0"
                          />
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-ai-purple uppercase">
                              {tour.city} • {tour.duration}
                            </span>
                            <h3 className="font-extrabold text-sm text-midnight-navy dark:text-white">
                              {tour.title}
                            </h3>
                            <p className="text-[11px] text-slate-500">{tour.highlights}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-3">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold">Tour Fee</span>
                            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(tour.priceINR, currency)} / person
                            </span>
                          </div>

                          <button
                            onClick={() => handleStartBooking('tour', tour)}
                            className="btn-primary-gradient px-4 py-2 rounded-xl font-bold text-xs shadow-sm"
                          >
                            Book Tour
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: ENTER TRAVELLER DETAILS & CONFIRM */}
          {bookingStep === 'details' && selectedOffer && (
            <div className="max-w-2xl mx-auto space-y-6 animate-scale-in">
              <div className="theme-card p-5 rounded-2xl space-y-2 border-l-4 border-l-ai-purple">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Selected Booking Service
                </span>
                <h3 className="text-lg font-black text-midnight-navy dark:text-white">
                  {selectedOffer.data.title || selectedOffer.data.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedOffer.data.destinations || selectedOffer.data.service || selectedOffer.data.city}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">
                    Primary Passenger / Driver Name
                  </label>
                  <input
                    type="text"
                    value={travellerName}
                    onChange={e => setTravellerName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-midnight-navy dark:text-white font-semibold focus:outline-none focus:border-ai-purple"
                  />
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">
                    Contact Phone Number (WhatsApp Enabled)
                  </label>
                  <input
                    type="text"
                    value={travellerPhone}
                    onChange={e => setTravellerPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-midnight-navy dark:text-white font-semibold focus:outline-none focus:border-ai-purple"
                  />
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">
                    Travel / Service Date
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={e => setTravelDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-midnight-navy dark:text-white font-semibold focus:outline-none focus:border-ai-purple"
                  />
                </div>

                <div>
                  <label className="text-slate-600 dark:text-slate-300 font-bold block mb-1">
                    Pickup Location / Departure City
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={e => setPickupLocation(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-midnight-navy dark:text-white font-semibold focus:outline-none focus:border-ai-purple"
                  />
                </div>
              </div>

              {/* Coupon / Guarantee */}
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-ai-purple" />
                  <div>
                    <span className="font-bold text-midnight-navy dark:text-white block">Promo Code Applied: TRAVELMATEAI</span>
                    <span className="text-[11px] text-slate-500">Includes 24/7 SOS helpline & verified travel insurance</span>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-[10px]">
                  100% Guaranteed
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setBookingStep('browse')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Back to Offers
                </button>

                <button
                  type="button"
                  onClick={handleConfirmReservation}
                  className="btn-primary-gradient px-6 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-purple-500/25 flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Confirm & Issue Reservation</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: BOOKING CONFIRMED */}
          {bookingStep === 'confirmed' && confirmedBookingInfo && (
            <div className="max-w-lg mx-auto text-center space-y-5 animate-scale-in py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-500 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-midnight-navy dark:text-white">
                  Reservation Confirmed! 🎉
                </h3>
                <p className="text-xs text-slate-500">
                  Your official voucher has been synchronized and stored in your Digital Travel Wallet.
                </p>
              </div>

              <div className="theme-card p-5 rounded-2xl text-left text-xs space-y-2 border border-slate-200/80">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-400">Booking ID:</span>
                  <span className="font-mono font-bold text-ai-purple">{confirmedBookingInfo.bookingId}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-400">Passenger / Lead:</span>
                  <span className="font-bold text-midnight-navy dark:text-white">{confirmedBookingInfo.passengerName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-400">Service:</span>
                  <span className="font-bold text-midnight-navy dark:text-white">{confirmedBookingInfo.tripTitle}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">Amount Paid (Mock):</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(confirmedBookingInfo.totalPaidINR, currency)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    setCurrentScreen('15-wallet');
                  }}
                  className="w-full sm:w-auto btn-primary-gradient px-6 py-3 rounded-2xl font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Open Travel Wallet & E-Tickets</span>
                </button>

                <button
                  onClick={() => {
                    setBookingStep('browse');
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Close Marketplace
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
