'use client';

import { useState, useEffect } from 'react';

export default function StartupAnimation() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  const phases = [
    'Initialisation du système...',
    'Chargement des modules neural...',
    'Synchronisation des processeurs...',
    'Activation de l\'interface...',
    'Bienvenue, GP-TWO'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.5;
      });
    }, 25);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const phaseIndex = Math.min(Math.floor((progress / 100) * phases.length), phases.length - 1);
    setPhase(phaseIndex);
  }, [progress, phases.length]);

  return (
    <div className="w-full h-full bg-[#0a0000] flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[200px] animate-pulse" />

      <div className="text-center relative z-10">
        {/* Logo Cerberus */}
        <div className="mb-12 relative inline-block">
          {/* Outer rings */}
          <div className="w-40 h-40 relative mx-auto">
            <div className="absolute inset-0 border-2 border-red-400/20 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
            <div className="absolute inset-4 border-2 border-rose-400/30 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
            <div className="absolute inset-8 border border-rose-300/20 rounded-full animate-spin" style={{ animationDuration: '4s' }} />
            
            {/* Center logo - Cerberus */}
            <div className="absolute inset-12 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-full backdrop-blur-sm flex items-center justify-center">
              <img src="/images/cerberus-logo.png" alt="Cerberus" className="w-14 h-14 object-contain" />
            </div>

            {/* Orbiting dots */}
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-red-400 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 90 + progress * 3.6}deg) translateX(70px) translateY(-50%)`,
                  opacity: 0.6 + (i * 0.1),
                }}
              />
            ))}
          </div>
        </div>

        {/* Brand */}
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-400 to-red-500 tracking-wider mb-2">
          CERBERUS OS
        </h1>
        <p className="text-red-400/40 text-xs tracking-[0.4em] mb-12">PREPARING YOUR WORKSPACE</p>

        {/* Progress section */}
        <div className="w-80 mx-auto">
          {/* Progress bar */}
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-rose-400 to-red-500 transition-all duration-200 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Phase text */}
          <div className="flex items-center justify-center gap-2 text-red-400/70 text-sm">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
                />
              ))}
            </div>
            <span className="font-light">{phases[phase]}</span>
          </div>
        </div>

        {/* Status indicators */}
        <div className="mt-12 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2 text-emerald-400/60">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span>Système sécurisé</span>
          </div>
          <div className="flex items-center gap-2 text-red-400/60">
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
            <span>Neural Link</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer { animation: shimmer 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
