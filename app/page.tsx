'use client';

import { useState, useEffect } from 'react';
import BootScreen from '@/components/BootScreen';
import LoginScreen from '@/components/LoginScreen';
import StartupAnimation from '@/components/StartupAnimation';
import Desktop from '@/components/Desktop';
import { NotificationProvider } from '@/components/NotificationSystem';
import { AudioProvider } from '@/components/AudioManager';

type AppState = 'boot' | 'login' | 'startup' | 'desktop';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('boot');

  useEffect(() => {
    // Boot screen duration
    if (appState === 'boot') {
      const timer = setTimeout(() => {
        setAppState('login');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const handleLogin = (success: boolean) => {
    if (success) {
      setAppState('startup');
      setTimeout(() => {
        setAppState('desktop');
      }, 3000);
    }
  };

  return (
    <div className="w-full h-full overflow-hidden bg-black">
      {appState === 'boot' && <BootScreen />}
      {appState === 'login' && <LoginScreen onLogin={handleLogin} />}
      {appState === 'startup' && <StartupAnimation />}
      {appState === 'desktop' && (
        <AudioProvider>
          <NotificationProvider>
            <Desktop />
          </NotificationProvider>
        </AudioProvider>
      )}
    </div>
  );
}
