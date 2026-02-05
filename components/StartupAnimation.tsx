'use client';

import { useState, useEffect } from 'react';

export default function StartupAnimation() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing GP-TWO system core...');

  const loadingMessages = [
    'Initializing GP-TWO system core...',
    'Loading android neural pathways...',
    'Activating quantum processors...',
    'Establishing secure connection...',
    'Loading user profile data...',
    'Initializing desktop environment...',
    'System ready. Launching interface...',
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
  }, [progress, loadingMessages]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Glow effects */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>

      <div className="text-center relative z-10 max-w-xl w-full px-8">
        {/* Logo */}
        <div className="mb-16 relative">
          <div className="w-40 h-40 mx-auto relative">
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-cyan-400/20 rounded-full animate-spin-slow"></div>
            {/* Middle ring */}
            <div
              className="absolute inset-4 border-4 border-cyan-300/30 rounded-full animate-spin-reverse"
              style={{ animationDuration: '2s' }}
            ></div>
            {/* Inner glow */}
            <div className="absolute inset-8 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-full blur-md"></div>
            {/* Inner circle */}
            <div className="absolute inset-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Brand */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 mb-3 tracking-wider">
            MURKOFF SYSTEMS
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500/50"></div>
            <p className="text-cyan-500/70 text-sm tracking-[0.3em] font-light">GP-TWO ANDROID OS</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500/50"></div>
          </div>
          <p className="text-cyan-400/40 text-xs">Version 2026.1.0</p>
        </div>

        {/* Loading section */}
        <div className="w-full max-w-md mx-auto bg-black/20 backdrop-blur-sm border border-cyan-900/30 rounded-2xl p-6 shadow-2xl">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-cyan-400/70 mb-3">
              <span>System Initialization</span>
              <span className="font-mono">{progress}%</span>
            </div>
            <div className="h-2.5 bg-slate-900/50 rounded-full overflow-hidden border border-cyan-900/30">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-500 transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Loading text */}
          <div className="flex items-center justify-center gap-3 text-cyan-400 text-sm">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '0.6s',
                  }}
                />
              ))}
            </div>
            <p className="font-mono text-xs">{loadingText}</p>
          </div>

          {/* Status indicators */}
          <div className="mt-6 pt-6 border-t border-cyan-900/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-green-500/70">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Neural Link Active</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-500/70">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
              <span>Secure Boot</span>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-8 text-center">
          <p className="text-cyan-500/30 text-xs">
            Murkoff Corporation • Advanced Robotics Division
          </p>
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
          animation: spin-slow 4s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 3s linear infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
