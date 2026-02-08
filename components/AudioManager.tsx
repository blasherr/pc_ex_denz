'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';

interface AudioContextType {
  playSound: (soundName: string) => void;
  toggleAmbient: () => void;
  setVolume: (volume: number) => void;
  isAmbientPlaying: boolean;
  volume: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const ambientRef = useRef<HTMLAudioElement | null>(null);

  // Initialize ambient sound
  useEffect(() => {
    // Create ambient hum using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume * 0.1; // Very subtle
    gainNode.connect(audioContext.destination);

    // Create oscillators for ambient hum
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const oscillator3 = audioContext.createOscillator();

    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    oscillator3.type = 'sine';

    oscillator1.frequency.value = 60; // Low hum
    oscillator2.frequency.value = 120; // Harmonic
    oscillator3.frequency.value = 180; // Higher harmonic

    const gain1 = audioContext.createGain();
    const gain2 = audioContext.createGain();
    const gain3 = audioContext.createGain();

    gain1.gain.value = 0.3;
    gain2.gain.value = 0.2;
    gain3.gain.value = 0.1;

    oscillator1.connect(gain1).connect(gainNode);
    oscillator2.connect(gain2).connect(gainNode);
    oscillator3.connect(gain3).connect(gainNode);

    if (isAmbientPlaying) {
      oscillator1.start();
      oscillator2.start();
      oscillator3.start();
    }

    return () => {
      try {
        oscillator1.stop();
        oscillator2.stop();
        oscillator3.stop();
        audioContext.close();
      } catch (e) {
        // Ignore
      }
    };
  }, [isAmbientPlaying, volume]);

  const playSound = (soundName: string) => {
    // Use Web Audio API to generate simple sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume * 0.5;
    gainNode.connect(audioContext.destination);

    const oscillator = audioContext.createOscillator();

    switch (soundName) {
      case 'click':
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
        break;

      case 'open':
        oscillator.frequency.value = 400;
        oscillator.type = 'sine';
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        break;

      case 'close':
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        break;

      case 'error':
        oscillator.frequency.value = 200;
        oscillator.type = 'sawtooth';
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
        break;

      case 'success':
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.15);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
        break;

      case 'notification':
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        const oscillator2 = audioContext.createOscillator();
        oscillator2.frequency.value = 1000;
        oscillator2.type = 'sine';
        oscillator2.connect(gainNode);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start();
        oscillator2.start(audioContext.currentTime + 0.1);
        oscillator.stop(audioContext.currentTime + 0.1);
        oscillator2.stop(audioContext.currentTime + 0.2);
        break;

      case 'startup':
        // Futuristic startup sound
        oscillator.frequency.value = 200;
        oscillator.type = 'sawtooth';
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.8);
        gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);
        break;

      default:
        oscillator.frequency.value = 440;
        oscillator.type = 'sine';
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    oscillator.connect(gainNode);
  };

  const toggleAmbient = () => {
    setIsAmbientPlaying(!isAmbientPlaying);
  };

  return (
    <AudioContext.Provider
      value={{
        playSound,
        toggleAmbient,
        setVolume,
        isAmbientPlaying,
        volume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

// Audio Control Panel Component
export function AudioControlPanel() {
  const { isAmbientPlaying, toggleAmbient, volume, setVolume } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-16 right-4 z-[9999]">
      {isExpanded && (
        <div className="mb-2 bg-[#1e293b]/98 backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl p-4 w-64">
          <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
            Contrôles Audio
          </h3>

          {/* Ambient toggle */}
          <div className="mb-3">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-white/70 text-sm">Ambiance</span>
              <div
                onClick={toggleAmbient}
                className={`
                  relative w-12 h-6 rounded-full transition-colors
                  ${isAmbientPlaying ? 'bg-red-600' : 'bg-white/20'}
                `}
              >
                <div
                  className={`
                    absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                    ${isAmbientPlaying ? 'translate-x-6' : 'translate-x-0'}
                  `}
                />
              </div>
            </label>
          </div>

          {/* Volume slider */}
          <div>
            <label className="text-white/70 text-xs mb-2 block">
              Volume: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={(e) => setVolume(parseInt(e.target.value) / 100)}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`,
              }}
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-12 h-12 rounded-full flex items-center justify-center transition-all
          ${isAmbientPlaying ? 'bg-red-600 shadow-red-500/30' : 'bg-[#1e293b]/98 border border-white/10'}
          shadow-xl hover:scale-110
        `}
        title="Contrôles Audio"
      >
        <svg
          className={`w-5 h-5 ${isAmbientPlaying ? 'text-white' : 'text-white/70'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          {isAmbientPlaying ? (
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          ) : (
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          )}
        </svg>
      </button>
    </div>
  );
}
