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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Lord_Gp-Two_2035') {
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
    <div className="w-full h-full bg-[#0a0000] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background effects - Red/Black theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0000] via-[#1a0505] to-[#000000]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      {/* Cerberus Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          {/* Red halo/glow effect around logo only */}
          <div className="absolute inset-0 bg-red-500/35 rounded-full blur-[80px] scale-150" />
          <img 
            src="/images/cerberus-logo.png" 
            alt="Cerberus" 
            className="w-[500px] h-auto relative z-10 opacity-[0.15] drop-shadow-[0_0_70px_rgba(220,38,38,0.6)] select-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Floating particles - Red */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${8 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Time display - Top */}
      {isMounted && (
        <div className="absolute top-12 text-center z-10">
          <p className="text-6xl sm:text-7xl font-extralight text-white/90 tracking-wider font-mono">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </p>
          <p className="text-red-400/60 text-lg mt-2 font-light tracking-wide">
            {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} 2035
          </p>
        </div>
      )}

      {/* Main login card */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Profile picture */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-rose-500/20 to-red-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-red-500/30 shadow-2xl shadow-red-500/20">
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
          {/* Online indicator */}
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#0a0000] flex items-center justify-center">
            <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
          </div>
        </div>

        {/* User name */}
        <h2 className="text-2xl font-semibold text-white mb-1">GP-TWO</h2>
        <div className="flex items-center gap-2 mb-6">
          <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs font-medium">
            ANDROID
          </span>
          <span className="text-red-400/40 text-xs">•</span>
          <span className="text-red-400/60 text-xs">Murkoff Corporation</span>
        </div>

        {/* Password input */}
        <form onSubmit={handleSubmit} className="w-72">
          <div className={`relative ${shake ? 'animate-shake' : ''}`}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez le code d'accès"
              className={`w-full px-5 py-4 bg-white/5 backdrop-blur-xl border ${
                error ? 'border-red-500/50' : 'border-red-500/20 focus:border-red-400/50'
              } rounded-2xl text-white placeholder-red-300/30 focus:outline-none transition-all text-center font-mono tracking-widest`}
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-red-500/25"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mt-3 flex items-center justify-center gap-2 text-red-400 text-sm animate-pulse">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Code d&apos;accès incorrect</span>
            </div>
          )}
        </form>

        {/* Hint */}
        <p className="mt-4 text-red-400/30 text-xs">Appuyez sur Entrée pour continuer</p>
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-8 text-xs text-red-400/40">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          <span>Connexion sécurisée</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
          <span>Chiffrement AES-512</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
          <span>Neural Link Active</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
          50% { transform: translateY(-10px) translateX(-10px); opacity: 0.3; }
          75% { transform: translateY(-30px) translateX(5px); opacity: 0.5; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
