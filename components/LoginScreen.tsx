'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LoginScreenProps {
  onLogin: (success: boolean) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === '1234') {
      setError(false);
      onLogin(true);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPassword('');
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20"
            style={{
              left: `${(i * 7 + 10) % 100}%`,
              top: `${(i * 11 + 20) % 100}%`,
              animation: `float ${5 + (i % 5)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]"></div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-8">
        {/* Logo and branding */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl blur-xl opacity-40 animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 mb-2">
            MURKOFF SYSTEMS
          </h1>
          <p className="text-cyan-500/50 text-sm tracking-[0.2em] font-light">ADVANCED OS 2026</p>
        </div>

        {/* User card */}
        <div className="w-full bg-black/30 backdrop-blur-xl border border-cyan-900/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/5">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative w-32 h-32 rounded-full border-4 border-cyan-500/30 overflow-hidden shadow-2xl bg-slate-900">
                <Image
                  src="https://imgg.fr/r/7sf9n0H4.png"
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  priority
                  unoptimized
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* User info */}
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold text-white mb-1">GP-TWO</h2>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-medium">
                  ANDROID UNIT
                </span>
                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-medium">
                  ADMIN
                </span>
              </div>
            </div>
            <p className="text-cyan-400/60 text-sm">Murkoff Corporation • Research Division</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-cyan-400/70 text-sm font-medium mb-2 ml-1">
                Access Code
              </label>
              <div className={`relative ${shake ? 'animate-shake' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-sm"></div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`relative w-full px-5 py-4 bg-slate-900/50 backdrop-blur-sm border-2 ${
                    error ? 'border-red-500/50' : 'border-cyan-500/20'
                  } rounded-xl text-white placeholder-cyan-400/30 focus:outline-none focus:border-cyan-400/50 transition-all font-mono`}
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg flex items-center justify-center transition-all shadow-lg shadow-cyan-500/30 group"
                >
                  <svg
                    className="w-5 h-5 text-white transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 animate-pulse">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Access denied. Invalid authentication code.</span>
              </div>
            )}
          </form>

          {/* Security info */}
          <div className="mt-6 pt-6 border-t border-cyan-900/20">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-cyan-500/50">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Encrypted Connection</span>
              </div>
              <div className="flex items-center gap-2 text-green-500/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Time and Date */}
        {isMounted && (
          <div className="mt-8 text-center">
            <p className="text-3xl font-light text-white/90 mb-2 font-mono">
              {new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </p>
            <p className="text-cyan-400/50 text-sm font-light">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-cyan-500/30 text-xs">
            Murkoff Corporation © 2026 • All Rights Reserved
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
          }
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
