'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  addNotification: (notification: Omit<Notification, 'id'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification = { ...notification, id };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, notification.duration || 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}

      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {notifications.map((notif, index) => (
          <NotificationToast
            key={notif.id}
            notification={notif}
            onClose={() => removeNotification(notif.id)}
            index={index}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

function NotificationToast({
  notification,
  onClose,
  index
}: {
  notification: Notification;
  onClose: () => void;
  index: number;
}) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation before removal
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, (notification.duration || 5000) - 300);

    return () => clearTimeout(timer);
  }, [notification.duration, onClose]);

  const typeConfig = {
    success: {
      icon: '✓',
      gradient: 'from-emerald-600 to-green-600',
      border: 'border-emerald-500/40',
      glow: 'shadow-emerald-500/20',
      iconBg: 'bg-emerald-500',
    },
    error: {
      icon: '✕',
      gradient: 'from-red-600 to-rose-600',
      border: 'border-red-500/40',
      glow: 'shadow-red-500/20',
      iconBg: 'bg-red-500',
    },
    warning: {
      icon: '!',
      gradient: 'from-amber-600 to-yellow-600',
      border: 'border-amber-500/40',
      glow: 'shadow-amber-500/20',
      iconBg: 'bg-amber-500',
    },
    info: {
      icon: 'i',
      gradient: 'from-blue-600 to-cyan-600',
      border: 'border-blue-500/40',
      glow: 'shadow-blue-500/20',
      iconBg: 'bg-blue-500',
    },
  };

  const config = typeConfig[notification.type];

  return (
    <div
      className={`
        pointer-events-auto relative w-80 bg-[#0a0a0f]/95 backdrop-blur-xl rounded-lg
        border ${config.border} shadow-2xl ${config.glow} overflow-hidden
        transition-all duration-300 ease-out
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
      style={{
        animationName: isExiting ? 'slideOut' : 'slideIn',
        animationDuration: '0.3s',
        animationTimingFunction: 'ease-out',
        animationFillMode: 'both',
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Top glow line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${config.gradient}`} />

      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)] bg-[size:100%_4px] animate-scan pointer-events-none" />

      <div className="relative p-4 flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-8 h-8 ${config.iconBg} rounded-lg flex items-center justify-center text-white font-bold shadow-lg`}>
          <span className="text-sm">{config.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-bold text-white mb-0.5 bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
            {notification.title}
          </h4>
          <p className="text-xs text-white/70 leading-relaxed">
            {notification.message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        >
          <span className="text-lg leading-none">×</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
        <div
          className={`h-full bg-gradient-to-r ${config.gradient}`}
          style={{
            animation: `shrink ${notification.duration || 5000}ms linear`,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        @keyframes scan {
          0% { background-position: 0 0; }
          100% { background-position: 0 100vh; }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
