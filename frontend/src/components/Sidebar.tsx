import React from 'react';
import { useTravel } from '../context/TravelContext';
import { ScreenType } from '../types';
import { 
  Compass, 
  Bot, 
  CalendarDays, 
  LayoutDashboard, 
  Plane, 
  Building2, 
  MapPin, 
  Coins, 
  ShieldCheck, 
  Ticket, 
  Mic, 
  User, 
  Settings, 
  Server, 
  Crown, 
  Sparkles, 
  Moon, 
  Sun,
  X,
  Bell,
  Heart,
  Receipt,
  Smartphone,
  Globe,
  Lock,
  ArrowRightLeft
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    theme, 
    toggleTheme, 
    notifications, 
    setNotificationModalOpen,
    openMarketplace,
    viewMode,
    setViewMode,
    isPro,
    setProModalOpen 
  } = useTravel();
  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems: { screen?: ScreenType; action?: () => void; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { screen: '03-landing', label: 'Landing Page', icon: <Globe className="w-4 h-4 text-sky-500" /> },
    { screen: '04-login', label: 'Login / Sign In', icon: <Lock className="w-4 h-4 text-emerald-500" />, badge: 'Vault' },
    { screen: '05-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { screen: '19-compare', label: 'Compare & Book', icon: <ArrowRightLeft className="w-4 h-4 text-indigo-500" />, badge: 'OTA' },
    { screen: '06-copilot', label: 'AI Travel Copilot', icon: <Bot className="w-4 h-4" />, badge: 'AI' },
    { screen: '10-destinations', label: 'Destination Explorer', icon: <Compass className="w-4 h-4" />, badge: '50+' },
    { action: () => openMarketplace('packages'), label: 'Holiday Packages', icon: <Sparkles className="w-4 h-4 text-amber-500" />, badge: 'Deals' },
    { action: () => openMarketplace('cabs'), label: 'Cabs & Rentals', icon: <Plane className="w-4 h-4 text-sky-500" /> },
    { screen: '07-planner', label: 'Plan Trip', icon: <CalendarDays className="w-4 h-4" /> },
    { screen: '15-wallet', label: 'My Trips & Wallet', icon: <Ticket className="w-4 h-4" /> },
    { screen: '14-payment', label: 'Bookings & Checkout', icon: <Receipt className="w-4 h-4" /> },
    { action: () => setNotificationModalOpen(true), label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount || undefined },
    { screen: '11-itinerary', label: 'Dubai Itinerary', icon: <CalendarDays className="w-4 h-4" /> },
    { screen: '08-flights', label: 'Flights', icon: <Plane className="w-4 h-4" /> },
    { screen: '09-hotels', label: 'Hotels', icon: <Building2 className="w-4 h-4" /> },
    { screen: '12-budget', label: 'Budget & Expenses', icon: <Coins className="w-4 h-4" /> },
    { screen: '13-visa', label: 'Visa & Documents', icon: <ShieldCheck className="w-4 h-4" /> },
    { screen: '16-voice', label: 'Voice AI & SOS', icon: <Mic className="w-4 h-4" /> },
    { screen: '17-profile', label: 'Profile & Settings', icon: <Settings className="w-4 h-4" /> },
    { screen: '18-admin', label: 'Admin Portal', icon: <Server className="w-4 h-4" /> },
    { screen: '01-welcome', label: 'Loading Showcase', icon: <Sparkles className="w-4 h-4 text-ai-purple" /> },
  ];

  const handleNav = (itemOrScreen: { screen?: ScreenType; action?: () => void } | ScreenType) => {
    if (typeof itemOrScreen === 'string') {
      setCurrentScreen(itemOrScreen);
    } else if (itemOrScreen.action) {
      itemOrScreen.action();
    } else if (itemOrScreen.screen) {
      setCurrentScreen(itemOrScreen.screen);
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between h-full p-4 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="space-y-6">
        {/* Brand Logo matching mockup */}
        <div className="flex items-center justify-between px-2">
          <div 
            onClick={() => handleNav('03-landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7956f5] to-[#3478f6] flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-midnight-navy dark:text-white">
                TravelMate<span className="text-ai-purple">.AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-semibold block">Intelligent Copilot</p>
            </div>
          </div>

          {onCloseMobile && (
            <button onClick={onCloseMobile} className="lg:hidden p-1 text-slate-400">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <nav className="space-y-1">
          {menuItems.map(item => {
            const isActive = item.screen && currentScreen === item.screen;
            return (
              <button
                key={item.screen || item.label}
                onClick={() => handleNav(item)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition duration-150 ${
                  isActive
                    ? 'bg-ai-purple text-white shadow-md shadow-purple-500/25 font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-midnight-navy dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : typeof item.badge === 'number'
                      ? 'bg-rose-500 text-white'
                      : 'bg-purple-500/15 text-ai-purple'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Pro Banner & Theme Toggle */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        {/* Pro Banner matching mockup bottom-left */}
        {isPro ? (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-purple-600/15 to-transparent border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-500 font-black text-xs">
                <Crown className="w-4 h-4 fill-amber-500" />
                <span>PRO ELITE MEMBER</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-bold">ACTIVE</span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight">
              11 Autonomous Agents Swarm & VIP 24/7 SOS Hotline unlocked.
            </p>
            <button
              onClick={() => setProModalOpen(true)}
              className="w-full py-1.5 rounded-xl font-bold text-[11px] bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition flex items-center justify-center gap-1.5"
            >
              <span>View VIP Pass & Perks</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/15 via-sky-500/10 to-transparent border border-purple-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-ai-purple font-extrabold text-xs">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>Upgrade to Pro</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold">SAVE 40%</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              Get 11 autonomous agents, VIP flight alert pings and 24/7 SOS helpline.
            </p>
            <button
              onClick={() => setProModalOpen(true)}
              className="w-full btn-primary-gradient py-1.5 rounded-xl font-bold text-[11px] shadow-sm flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Upgrade Now</span>
              <span>➔</span>
            </button>
          </div>
        )}

        {/* Theme toggle & quick links */}
        <div className="flex items-center justify-between px-2 text-xs text-slate-400">
          <button
            onClick={() => handleNav('01-welcome')}
            className="hover:text-ai-purple transition font-medium"
          >
            Splash Screen
          </button>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl theme-card hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300"
            title="Toggle Light / Dark mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-ai-purple" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
