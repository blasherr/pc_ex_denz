'use client';

import { useState, useEffect } from 'react';

const bootSequence = [
  'Initializing BIOS v4.2.1...',
  'Loading kernel modules...',
  '[OK] CPU: 8-Core Intel i9-12900K @ 5.2GHz',
  '[OK] RAM: 32GB DDR5-6000 detected',
  '[OK] GPU: NVIDIA RTX 4090 initialized',
  'Mounting file systems...',
  '[OK] /dev/sda1 mounted at /',
  '[OK] /dev/sda2 mounted at /home',
  'Starting system services...',
  '[OK] NetworkManager.service',
  '[OK] bluetooth.service',
  '[OK] systemd-logind.service',
  '[OK] android-bridge.service',
  'Loading AI kernel extensions...',
  '[OK] neural_processor.ko loaded',
  '[OK] quantum_encryption.ko loaded',
  'Initializing Android subsystem...',
  '[OK] Android 26.0 kernel bridge active',
  '[OK] GP-TWO system core initialized',
  'Starting graphical environment...',
  '[OK] Display server initialized',
  'Boot sequence complete.',
];

export default function BootScreen() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (currentIndex < bootSequence.length) {
      const delay = Math.random() * 100 + 50;
      const timer = setTimeout(() => {
        setLines(prev => [...prev, bootSequence[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-8 overflow-hidden relative">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-5xl relative z-10">
        {/* Header with logo */}
        <div className="mb-12 flex items-center justify-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-cyan-600/30 rounded-full"></div>
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 tracking-wider mb-2">
              MURKOFF SYSTEMS
            </h1>
            <p className="text-cyan-500/70 text-sm tracking-[0.3em] font-light">ADVANCED OPERATING SYSTEM v2026.1</p>
          </div>
        </div>

        {/* Terminal output */}
        <div className="bg-black/40 backdrop-blur-sm border border-cyan-900/50 rounded-lg p-6 shadow-2xl shadow-cyan-500/10">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cyan-900/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-cyan-500/50 text-xs font-mono ml-2">root@murkoff-os ~</span>
          </div>

          <div className="font-mono text-sm space-y-1.5 min-h-[300px]">
            {lines.map((line, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 ${
                  line.includes('[OK]') ? 'text-green-400' : 'text-cyan-400'
                } ${line.includes('ERROR') ? 'text-red-400' : ''}`}
                style={{
                  animation: 'fadeIn 0.3s ease-in',
                }}
              >
                <span className="text-cyan-600/50 select-none">▸</span>
                <span className="flex-1">{line}</span>
                {line.includes('[OK]') && (
                  <span className="text-green-500">✓</span>
                )}
              </div>
            ))}
            {currentIndex < bootSequence.length && (
              <div className="flex items-center gap-3">
                <span className="text-cyan-600/50 select-none">▸</span>
                <span className="w-2 h-4 bg-cyan-400 animate-pulse"></span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-6 pt-4 border-t border-cyan-900/50">
            <div className="flex items-center justify-between text-xs text-cyan-500/70 mb-2">
              <span>System initialization</span>
              <span>{Math.round((currentIndex / bootSequence.length) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-cyan-950/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${(currentIndex / bootSequence.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom info */}
        <div className="mt-6 flex items-center justify-between text-xs text-cyan-500/50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
              <span>Secure Boot Enabled</span>
            </div>
          </div>
          {isMounted && (
            <span className="font-mono">{new Date().toISOString().split('T')[0]}</span>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
