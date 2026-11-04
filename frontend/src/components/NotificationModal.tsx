import React from 'react';
import { useTravel } from '../context/TravelContext';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Plane, 
  ShieldAlert, 
  Sparkles, 
  Tag, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { notifications, markAllNotificationsRead, setCurrentScreen } = useTravel();

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-ai-purple flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-midnight-navy dark:text-white text-base">
                Travel Notifications & Alerts
              </h3>
              <p className="text-xs text-slate-400">
                {unreadCount > 0 ? `${unreadCount} unread travel alerts` : 'All alerts caught up'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="flex items-center gap-1 text-[11px] font-bold text-ai-purple hover:underline"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-4 max-h-[420px] overflow-y-auto space-y-3">
          {notifications.map(notif => {
            const getIcon = () => {
              switch (notif.type) {
                case 'deal':
                  return <Tag className="w-4 h-4 text-emerald-500" />;
                case 'visa':
                  return <ShieldAlert className="w-4 h-4 text-amber-500" />;
                case 'copilot':
                  return <Sparkles className="w-4 h-4 text-ai-purple" />;
                default:
                  return <Plane className="w-4 h-4 text-sky-500" />;
              }
            };

            return (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition flex items-start gap-3.5 ${
                  !notif.read
                    ? 'bg-purple-500/5 border-purple-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                  {getIcon()}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-midnight-navy dark:text-white">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold">{notif.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {notif.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer simulation actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Real-time flight gate & weather telemetry</span>
          </div>

          <button
            onClick={() => {
              onClose();
              setCurrentScreen('15-wallet');
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-ai-purple hover:underline"
          >
            <span>View Boarding Passes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
