import React, { useState } from 'react';
import { TravelProvider, useTravel } from './context/TravelContext';
import { Sidebar } from './components/Sidebar';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { NotificationModal } from './components/NotificationModal';
import { MarketplaceBookingModal } from './components/MarketplaceBookingModal';
import { ProUpgradeModal } from './components/ProUpgradeModal';
import { MobileAppSimulator } from './components/mobile/MobileAppSimulator';

// 18 Screens
import { Screen01_Splash } from './components/screens/Screen01_Splash';
import { Screen02_Onboarding } from './components/screens/Screen02_Onboarding';
import { Screen03_Landing } from './components/screens/Screen03_Landing';
import { Screen04_Login } from './components/screens/Screen04_Login';
import { Screen05_Dashboard } from './components/screens/Screen05_Dashboard';
import { Screen06_Copilot } from './components/screens/Screen06_Copilot';
import { Screen07_TripPlannerWizard } from './components/screens/Screen07_TripPlannerWizard';
import { Screen08_FlightSearch } from './components/screens/Screen08_FlightSearch';
import { Screen09_HotelSearch } from './components/screens/Screen09_HotelSearch';
import { Screen10_DestinationExplorer } from './components/screens/Screen10_DestinationExplorer';
import { Screen11_Itinerary } from './components/screens/Screen11_Itinerary';
import { Screen12_Budget } from './components/screens/Screen12_Budget';
import { Screen13_Visa } from './components/screens/Screen13_Visa';
import { Screen14_Payment } from './components/screens/Screen14_Payment';
import { Screen15_Wallet } from './components/screens/Screen15_Wallet';
import { Screen16_Voice } from './components/screens/Screen16_Voice';
import { Screen17_Profile } from './components/screens/Screen17_Profile';
import { Screen18_Admin } from './components/screens/Screen18_Admin';
import { Screen19_CompareAndBook } from './components/screens/Screen19_CompareAndBook';

import { Menu, Sun, Moon, Globe, Bot, Smartphone, Monitor } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    theme, 
    toggleTheme, 
    notificationModalOpen, 
    setNotificationModalOpen,
    marketplaceModalOpen,
    setMarketplaceModalOpen,
    marketplaceTab,
    viewMode,
    setViewMode 
  } = useTravel();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Standalone Fullscreen Screens (No Sidebar, No Dashboard Header)
  if (currentScreen === '03-landing') {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-[#070b14] text-[#101d42] dark:text-[#f8fafc] animate-fade-in">
        <Screen03_Landing />
        <ProUpgradeModal />
        <AuthModal />
        <NotificationModal 
          isOpen={notificationModalOpen} 
          onClose={() => setNotificationModalOpen(false)} 
        />
        <MarketplaceBookingModal
          isOpen={marketplaceModalOpen}
          onClose={() => setMarketplaceModalOpen(false)}
          initialTab={marketplaceTab}
        />
      </div>
    );
  }

  if (currentScreen === '04-login') {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-[#f8fafc] dark:bg-[#080d1a] text-[#101d42] dark:text-[#f8fafc] animate-fade-in">
        <Screen04_Login />
        <ProUpgradeModal />
        <AuthModal />
      </div>
    );
  }

  if (currentScreen === '01-welcome') {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-white animate-fade-in">
        <Screen01_Splash />
        <ProUpgradeModal />
      </div>
    );
  }

  if (currentScreen === '02-onboarding') {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-white animate-fade-in">
        <Screen02_Onboarding />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f5f7fc] dark:bg-[#0a0f1d] text-[#101d42] dark:text-[#f8fafc]">
      {/* Main Workspace with Left Sidebar & Content View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-64 h-full bg-white dark:bg-slate-900 shadow-2xl">
              <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Platform Bar with Mode Switcher & Innovation 27X7 Identity */}
          <header className="sticky top-0 z-30 px-4 py-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-xl theme-card text-midnight-navy dark:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-midnight-navy dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>TravelMate<span className="text-ai-purple">.AI</span></span>
                </span>
                <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 text-ai-purple font-bold">
                  Team Innovation 27X7
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* View Mode Switcher: Desktop vs Mobile App Simulator */}
              <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                    viewMode === 'desktop'
                      ? 'bg-white dark:bg-slate-700 text-midnight-navy dark:text-white shadow-sm font-black'
                      : 'text-slate-500 hover:text-midnight-navy dark:hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Web Platform</span>
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                    viewMode === 'mobile'
                      ? 'bg-[#7956f5] text-white shadow-sm font-black'
                      : 'text-slate-500 hover:text-midnight-navy dark:hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile App (iPhone)</span>
                </button>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-xl theme-card text-slate-600 dark:text-slate-300 hover:text-ai-purple transition"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-ai-purple" />}
              </button>
            </div>
          </header>

          {/* Active Screen View */}
          <main key={viewMode === 'mobile' ? 'mobile-sim' : currentScreen} className="flex-1 p-2 sm:p-4 animate-page-enter">
            {viewMode === 'mobile' ? (
              <MobileAppSimulator onClose={() => setViewMode('desktop')} />
            ) : (
              <>
                {currentScreen === '05-dashboard' && <Screen05_Dashboard />}
                {currentScreen === '06-copilot' && <Screen06_Copilot />}
                {currentScreen === '07-planner' && <Screen07_TripPlannerWizard />}
                {currentScreen === '08-flights' && <Screen08_FlightSearch />}
                {currentScreen === '09-hotels' && <Screen09_HotelSearch />}
                {currentScreen === '10-destinations' && <Screen10_DestinationExplorer />}
                {currentScreen === '11-itinerary' && <Screen11_Itinerary />}
                {currentScreen === '12-budget' && <Screen12_Budget />}
                {currentScreen === '13-visa' && <Screen13_Visa />}
                {currentScreen === '14-payment' && <Screen14_Payment />}
                {currentScreen === '15-wallet' && <Screen15_Wallet />}
                {currentScreen === '16-voice' && <Screen16_Voice />}
                {currentScreen === '17-profile' && <Screen17_Profile />}
                {currentScreen === '18-admin' && <Screen18_Admin />}
                {currentScreen === '19-compare' && <Screen19_CompareAndBook />}
              </>
            )}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-200 dark:border-slate-800 py-5 px-6 text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <strong className="text-midnight-navy dark:text-white">TravelMate AI</strong>
                <span className="text-slate-300 dark:text-slate-600">—</span>
                <span>Complete Autonomous Travel Agent & Copilot</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="agent-online-dot"></span>
                  <span className="text-travel-teal font-semibold">13 Agents Active</span>
                </span>
                <span>•</span>
                <span>Trip.com Partner</span>
                <span>•</span>
                <span>MakeMyTrip Handoff</span>
                <span>•</span>
                <span>Amadeus GDS</span>
                <span>•</span>
                <span>IATA Timatic</span>
                <span>•</span>
                <span className="font-semibold text-ai-purple">Team Innovation 27X7</span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Global Modals */}
      <BookingModal />
      <AuthModal />
      <ProUpgradeModal />
      <NotificationModal 
        isOpen={notificationModalOpen} 
        onClose={() => setNotificationModalOpen(false)} 
      />
      <MarketplaceBookingModal
        isOpen={marketplaceModalOpen}
        onClose={() => setMarketplaceModalOpen(false)}
        initialTab={marketplaceTab}
      />
    </div>
  );
};

export function App() {
  return (
    <TravelProvider>
      <MainLayout />
    </TravelProvider>
  );
}

export default App;
