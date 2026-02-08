'use client';

import { useState, useEffect, useCallback } from 'react';
import BootScreen from '@/components/BootScreen';
import LoginScreen from '@/components/LoginScreen';
import StartupAnimation from '@/components/StartupAnimation';
import Desktop from '@/components/Desktop';
import { NotificationProvider } from '@/components/NotificationSystem';
import { AudioProvider } from '@/components/AudioManager';

type AppState = 'boot' | 'login' | 'startup' | 'desktop';

export default function FiveMPage() {
  const [appState, setAppState] = useState<AppState>('boot');
  const [visible, setVisible] = useState(false);

  // Send NUI callback to FiveM client
  const nuiCallback = useCallback((eventName: string, data: Record<string, unknown> = {}) => {
    try {
      fetch(`https://cerberus_os/${eventName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(() => {});
    } catch {
      // Not in FiveM environment
    }
  }, []);

  // Listen for NUI messages from FiveM Lua
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || !data.type) return;

      switch (data.type) {
        case 'open':
        case 'show':
          setVisible(true);
          nuiCallback('uiReady');
          break;
        case 'close':
        case 'hide':
          setVisible(false);
          // Reset to boot for next open
          setAppState('boot');
          nuiCallback('uiClosed');
          break;
        case 'reset':
          setAppState('boot');
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [nuiCallback]);

  // Boot sequence
  useEffect(() => {
    if (appState === 'boot' && visible) {
      const timer = setTimeout(() => {
        setAppState('login');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [appState, visible]);

  const handleLogin = (success: boolean) => {
    if (success) {
      setAppState('startup');
      nuiCallback('loggedIn');
      setTimeout(() => {
        setAppState('desktop');
      }, 3000);
    }
  };

  // Close UI with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        setVisible(false);
        setAppState('boot');
        nuiCallback('closeUI');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, nuiCallback]);

  // Auto-show if not in FiveM (for testing in browser)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auto') === '1' || params.get('test') === '1') {
      setVisible(true);
    }
  }, []);

  if (!visible) {
    // Transparent background when hidden - NUI can click through
    return <div className="w-full h-full" />;
  }

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
