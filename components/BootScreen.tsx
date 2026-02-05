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
  'Starting graphical environment...',
  '[OK] Display server initialized',
  'Boot sequence complete.',
];

export default function BootScreen() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <div className="w-full h-full bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-900 flex items-center justify-center p-8 overflow-hidden">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <h1 className="text-4xl font-bold text-cyan-300 tracking-wider">
            MURKOFF OS 2026
          </h1>
        </div>

        <div className="font-mono text-sm space-y-1">
          {lines.map((line, index) => (
            <div
              key={index}
              className={`text-cyan-400 animate-pulse ${
                line.includes('[OK]') ? 'text-green-400' : ''
              } ${line.includes('ERROR') ? 'text-red-400' : ''}`}
              style={{
                animation: 'fadeIn 0.3s ease-in',
              }}
            >
              <span className="text-cyan-600 mr-2">&gt;</span>
              {line}
            </div>
          ))}
          {currentIndex < bootSequence.length && (
            <div className="flex items-center">
              <span className="text-cyan-600 mr-2">&gt;</span>
              <span className="w-2 h-4 bg-cyan-400 animate-pulse"></span>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center gap-2 text-xs text-cyan-500">
          <div className="flex gap-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-8 bg-cyan-500 opacity-30"
                style={{
                  animation: `pulse ${Math.random() * 1 + 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.05}s`,
                }}
              ></div>
            ))}
          </div>
          <span className="ml-4">System Analysis in Progress...</span>
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
      `}</style>
    </div>
  );
}
