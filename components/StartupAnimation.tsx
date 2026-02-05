'use client';

import { useState, useEffect } from 'react';

export default function StartupAnimation() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Starting system...');

  const loadingMessages = [
    'Starting system...',
    'Loading user profile...',
    'Initializing desktop environment...',
    'Loading system resources...',
    'Starting applications...',
    'Almost ready...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const messageIndex = Math.floor((progress / 100) * (loadingMessages.length - 1));
    setLoadingText(loadingMessages[messageIndex]);
  }, [progress]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-12 relative">
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-full animate-spin-slow"></div>
            {/* Middle ring */}
            <div
              className="absolute inset-4 border-4 border-cyan-300/50 rounded-full animate-spin-reverse"
              style={{ animationDuration: '2s' }}
            ></div>
            {/* Inner circle */}
            <div className="absolute inset-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Brand */}
        <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
          MURKOFF OS
        </h1>
        <p className="text-cyan-300 text-sm mb-12">Version 2026.1.0</p>

        {/* Loading bar */}
        <div className="w-80 mx-auto">
          <div className="h-2 bg-blue-950/50 rounded-full overflow-hidden backdrop-blur-sm border border-cyan-500/30">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-300 transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
            </div>
          </div>

          {/* Loading text */}
          <p className="text-cyan-300 text-sm mt-4 animate-pulse">
            {loadingText}
          </p>

          {/* Progress percentage */}
          <p className="text-cyan-400/70 text-xs mt-2">{progress}%</p>
        </div>

        {/* Dots animation */}
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 3s linear infinite;
        }

        .animate-shimmer {
          animation: shimmer 1s infinite;
        }
      `}</style>
    </div>
  );
}
