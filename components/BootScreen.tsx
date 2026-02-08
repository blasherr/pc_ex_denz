'use client';

import { useState, useEffect, useRef } from 'react';

interface BootLine {
  type: 'system' | 'code' | 'ok' | 'success';
  text: string;
}

const bootSequence: BootLine[] = [
  { type: 'system', text: '> CERBERUS OS v2026.1.0 - BIOS INITIALIZATION' },
  { type: 'code', text: 'const system = new CerberusKernel();' },
  { type: 'code', text: 'await system.initialize({ mode: "secure" });' },
  { type: 'ok', text: '[OK] BIOS Check Complete - Signature Verified' },
  { type: 'system', text: '> LOADING HARDWARE DRIVERS...' },
  { type: 'code', text: 'import { CPU, RAM, GPU } from "@cerberus/drivers";' },
  { type: 'ok', text: '[OK] CPU: AMD Ryzen 9 9950X @ 5.8GHz - 24 Cores' },
  { type: 'ok', text: '[OK] RAM: 128GB DDR6-8400 - Quantum Enhanced' },
  { type: 'ok', text: '[OK] GPU: NVIDIA RTX 6090 Ti - Neural Accelerated' },
  { type: 'system', text: '> MOUNTING ENCRYPTED FILE SYSTEMS...' },
  { type: 'code', text: 'FileSystem.mount("/dev/nvme0n1", { encryption: "AES-512" });' },
  { type: 'ok', text: '[OK] /dev/nvme0n1p1 → /system (256GB SSD)' },
  { type: 'ok', text: '[OK] /dev/nvme0n1p2 → /data (2TB SSD)' },
  { type: 'system', text: '> INITIALIZING ANDROID SUBSYSTEM...' },
  { type: 'code', text: 'class AndroidBridge extends NeuralInterface {' },
  { type: 'code', text: '  constructor() { super({ version: "26.0" }); }' },
  { type: 'code', text: '}' },
  { type: 'ok', text: '[OK] Android 26.0 Neural Bridge - Active' },
  { type: 'ok', text: '[OK] GP-TWO Core Systems - Online' },
  { type: 'system', text: '> STARTING SERVICES...' },
  { type: 'code', text: 'services.startAll(["network", "bluetooth", "ai-core"]);' },
  { type: 'ok', text: '[OK] NetworkManager.service - Running' },
  { type: 'ok', text: '[OK] BluetoothAdapter.service - Running' },
  { type: 'ok', text: '[OK] NeuralProcessor.service - Running' },
  { type: 'ok', text: '[OK] QuantumEncryption.service - Running' },
  { type: 'system', text: '> LOADING GRAPHICAL INTERFACE...' },
  { type: 'code', text: 'GUI.render({ theme: "cerberus-dark", dpi: 4 });' },
  { type: 'ok', text: '[OK] Display Server Initialized - 8K@240Hz' },
  { type: 'success', text: '✓ BOOT SEQUENCE COMPLETE - LOADING LOGIN INTERFACE...' },
];

export default function BootScreen() {
  const [lines, setLines] = useState<BootLine[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (currentIndex < bootSequence.length) {
      const delay = bootSequence[currentIndex].type === 'code' ? 80 : Math.random() * 120 + 60;
      const timer = setTimeout(() => {
        setLines(prev => [...prev, bootSequence[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const getLineColor = (type: string) => {
    switch (type) {
      case 'system': return 'text-red-400';
      case 'code': return 'text-rose-300';
      case 'ok': return 'text-emerald-400';
      case 'success': return 'text-green-400 font-bold';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="w-full h-full bg-[#0a0000] flex items-center justify-center p-4 sm:p-8 overflow-hidden relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0000] via-[#1a0505] to-[#000000]" />
      
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Subtle glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[150px]" />

      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-red-400/30 to-transparent animate-scan" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="relative">
            <img 
              src="/images/cerberus-logo.png" 
              alt="Cerberus" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-400 to-red-500 tracking-wider">
              CERBERUS OS
            </h1>
            <p className="text-red-400/50 text-xs tracking-[0.3em] font-light">SYSTEM INITIALIZATION v2026.1</p>
          </div>
        </div>

        {/* Terminal window */}
        <div className="bg-[#120808]/90 backdrop-blur-xl border border-red-500/20 rounded-xl shadow-2xl shadow-red-500/5 overflow-hidden">
          {/* Window header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0a0505] border-b border-red-500/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors" />
              <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors" />
            </div>
            <span className="text-red-400/40 text-xs font-mono">root@cerberus-os:~$ boot --secure</span>
            <div className="w-16" />
          </div>

          {/* Terminal content */}
          <div 
            ref={terminalRef}
            className="p-4 sm:p-6 font-mono text-xs sm:text-sm space-y-1 min-h-[350px] max-h-[400px] overflow-y-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {lines.map((line, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${getLineColor(line.type)}`}
                style={{ animation: 'fadeSlide 0.2s ease-out' }}
              >
                {line.type === 'code' ? (
                  <>
                    <span className="text-red-500/40 select-none w-4">│</span>
                    <span className="text-slate-500">{'  '}</span>
                    <code className="text-rose-300/90">{line.text}</code>
                  </>
                ) : (
                  <>
                    <span className="text-red-500/40 select-none">{'>'}</span>
                    <span>{line.text}</span>
                    {line.type === 'ok' && <span className="ml-auto text-emerald-500">✓</span>}
                  </>
                )}
              </div>
            ))}
            {currentIndex < bootSequence.length && (
              <div className="flex items-center gap-2">
                <span className="text-red-500/40 select-none">{'>'}</span>
                <span className="w-2 h-4 bg-red-400 animate-pulse" />
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="px-4 sm:px-6 py-4 bg-[#0a0505]/50 border-t border-red-500/10">
            <div className="flex items-center justify-between text-xs text-red-400/60 mb-2">
              <span className="font-mono">BOOT PROGRESS</span>
              <span className="font-mono">{Math.round((currentIndex / bootSequence.length) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-red-500 transition-all duration-200 ease-out relative"
                style={{ width: `${(currentIndex / bootSequence.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom status */}
        <div className="mt-4 flex items-center justify-between text-xs text-red-400/40 px-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>Secure Boot</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span>Encrypted</span>
            </div>
          </div>
          {isMounted && (
            <span className="font-mono">{new Date().toISOString().split('T')[0]}</span>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scan {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        .animate-scan { animation: scan 4s linear infinite; }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
